import { Page } from "playwright";
import { getBrowserSession, captureScreenshot } from "../browser/session";
import { askGeminiVision } from "../ai/gemini";

interface AgentAction {
  thought: string;
  action: "navigate" | "click" | "type" | "scroll" | "wait" | "done";
  value?: string;
  selector?: string;
}

export async function runAgentOrchestrator(
  instruction: string,
  onUpdate: (event: { type: "log" | "screenshot" | "url" | "error"; data: string }) => void
) {
  let page: Page;
  try {
    onUpdate({ type: "log", data: "SYSTEM: Initializing Playwright session..." });
    const session = await getBrowserSession();
    page = session.page;
  } catch (error: any) {
    onUpdate({ type: "error", data: `SYSTEM ERROR: Failed to launch browser: ${error.message}` });
    return;
  }

  let steps = 0;
  const maxSteps = 10;
  const history: string[] = [];

  while (steps < maxSteps) {
    steps++;
    onUpdate({ type: "log", data: `AGENT: Processing Step ${steps}...` });

    let screenshotBase64 = "";
    try {
      screenshotBase64 = await captureScreenshot(page);
      onUpdate({ type: "screenshot", data: screenshotBase64 });
      onUpdate({ type: "url", data: page.url() });
    } catch (err: any) {
      onUpdate({ type: "log", data: `SYSTEM: Failed to capture screenshot or URL: ${err.message}` });
    }

    const systemPrompt = `
      You are BrowserPilot AI, an autonomous web browser agent.
      Your goal is to satisfy the user's instruction: "${instruction}"
      
      Current URL: ${page.url()}
      Step History:
      ${history.join("\n")}
      
      Analyze the page screenshot provided and decide the single NEXT action to take.
      
      Respond with a JSON object ONLY, matching this schema:
      {
        "thought": "Explain your logic here.",
        "action": "navigate" | "click" | "type" | "scroll" | "wait" | "done",
        "value": "URL for navigate, text for type, or time in ms for wait (optional)",
        "selector": "CSS selector for click/type (optional)"
      }

      Guidelines:
      - Choose the most robust CSS selector you can find from the screen.
      - If you need to search Google, use 'navigate' to 'https://google.com'.
      - If you have successfully accomplished the instruction, use the 'done' action.
    `;

    onUpdate({ type: "log", data: "AGENT: Analyzing page state with Gemini..." });

    let aiResponseText = "";
    let actionObj: AgentAction;

    try {
      aiResponseText = await askGeminiVision(systemPrompt, screenshotBase64);
      // Clean JSON formatting from Gemini (remove markdown block backticks if present)
      const cleanJson = aiResponseText.replace(/```json/g, "").replace(/```/g, "").trim();
      actionObj = JSON.parse(cleanJson);
    } catch (error: any) {
      onUpdate({ type: "log", data: `SYSTEM ERROR: Gemini parse failed: ${error.message}. Response was: ${aiResponseText}` });
      break;
    }

    onUpdate({ type: "log", data: `THOUGHT: ${actionObj.thought}` });
    history.push(`Step ${steps}: Thought - ${actionObj.thought} | Action - ${actionObj.action}`);

    if (actionObj.action === "done") {
      onUpdate({ type: "log", data: "SYSTEM: Goal achieved! Ending workflow." });
      break;
    }

    try {
      if (actionObj.action === "navigate" && actionObj.value) {
        onUpdate({ type: "log", data: `SYSTEM: Navigating to ${actionObj.value}...` });
        await page.goto(actionObj.value, { waitUntil: "domcontentloaded" });
      } else if (actionObj.action === "click" && actionObj.selector) {
        onUpdate({ type: "log", data: `SYSTEM: Clicking element '${actionObj.selector}'...` });
        await page.click(actionObj.selector, { timeout: 8000 });
      } else if (actionObj.action === "type" && actionObj.selector && actionObj.value) {
        onUpdate({ type: "log", data: `SYSTEM: Typing '${actionObj.value}' into '${actionObj.selector}'...` });
        await page.fill(actionObj.selector, actionObj.value, { timeout: 8000 });
        await page.keyboard.press("Enter");
      } else if (actionObj.action === "scroll") {
        onUpdate({ type: "log", data: "SYSTEM: Scrolling down..." });
        await page.evaluate(() => window.scrollBy(0, 400));
      } else if (actionObj.action === "wait" && actionObj.value) {
        const ms = parseInt(actionObj.value) || 2000;
        onUpdate({ type: "log", data: `SYSTEM: Waiting for ${ms}ms...` });
        await page.waitForTimeout(ms);
      } else {
        onUpdate({ type: "log", data: `SYSTEM: Action '${actionObj.action}' not recognized or missing args.` });
      }
    } catch (err: any) {
      onUpdate({ type: "log", data: `SYSTEM ERROR: Action failed: ${err.message}` });
    }

    // Brief delay between steps
    await page.waitForTimeout(1000);
  }

  onUpdate({ type: "log", data: "SYSTEM: Task complete." });
}
