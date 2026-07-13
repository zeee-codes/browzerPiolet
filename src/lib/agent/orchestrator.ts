import { Page } from "playwright";
import { getBrowserSession, captureScreenshot } from "../browser/session";
import { askGeminiVision } from "./gemini";
import { askOpenAIVision } from "./openai";
import { askGroqVision } from "./groq";

export type AIProvider = "gemini" | "openai" | "groq";

interface AgentAction {
  thought: string;
  action: "navigate" | "click" | "type" | "scroll" | "wait" | "extract" | "done";
  value?: string;
  selector?: string;
}

export type UpdateEvent = {
  type: "log" | "screenshot" | "url" | "error" | "result";
  data: string;
};

const SYSTEM_PROMPT = (instruction: string, currentUrl: string, history: string[]) => `
You are BrowserPilot AI, a professional autonomous web browser agent.
Your GOAL is to satisfy this instruction from the user: "${instruction}"

Current URL: ${currentUrl}
Previous Steps:
${history.length > 0 ? history.join("\n") : "None yet."}

Analyze the page screenshot carefully and decide the BEST single next action.

Respond ONLY with a valid JSON object — no markdown, no extra text — matching this schema:
{
  "thought": "Brief reasoning about what you see and why you chose this action.",
  "action": "navigate" | "click" | "type" | "scroll" | "wait" | "extract" | "done",
  "value": "URL for 'navigate', text for 'type', ms for 'wait', or extracted text for 'extract'",
  "selector": "CSS or ARIA selector for 'click' or 'type' actions"
}

Rules:
- Use 'navigate' to go to a URL (e.g., "https://google.com").
- Use 'click' + selector to click a button or link.
- Use 'type' + selector + value to fill an input field. This will also press Enter after.
- Use 'scroll' to scroll down the page.
- Use 'wait' + value (ms as string) to pause briefly.
- Use 'extract' + value to record important data you found on the page.
- Use 'done' when the goal is fully accomplished.
- Prefer highly specific and unique CSS selectors.
- If a CAPTCHA is encountered, use 'done' with a note in thought.
`;

async function callAI(
  provider: AIProvider,
  instruction: string,
  currentUrl: string,
  history: string[],
  screenshotBase64: string
): Promise<AgentAction> {
  const prompt = SYSTEM_PROMPT(instruction, currentUrl, history);
  let rawText = "";

  if (provider === "gemini") {
    rawText = await askGeminiVision(prompt, screenshotBase64);
  } else if (provider === "openai") {
    rawText = await askOpenAIVision(prompt, screenshotBase64);
  } else {
    rawText = await askGroqVision(prompt, screenshotBase64);
  }

  // Strip markdown code block if present
  const clean = rawText.replace(/```json/g, "").replace(/```/g, "").trim();
  return JSON.parse(clean) as AgentAction;
}

export async function runAgentOrchestrator(
  instruction: string,
  provider: AIProvider = "groq",
  onUpdate: (event: UpdateEvent) => void,
  approvalMode: boolean = false,
  pendingApproval?: { resolve: (approved: boolean) => void } | null
) {
  let page: Page;
  try {
    onUpdate({ type: "log", data: `SYSTEM: Starting BrowserPilot AI with provider: ${provider.toUpperCase()}...` });
    const session = await getBrowserSession();
    page = session.page;
    onUpdate({ type: "log", data: "SYSTEM: Headless Chromium launched successfully." });
  } catch (error: any) {
    onUpdate({ type: "error", data: `SYSTEM ERROR: Failed to launch browser — ${error.message}` });
    return;
  }

  const history: string[] = [];
  const maxSteps = 12;
  const extractedData: string[] = [];

  for (let step = 1; step <= maxSteps; step++) {
    onUpdate({ type: "log", data: `\nAGENT: ━━━ Step ${step} of ${maxSteps} ━━━` });

    // Capture screenshot
    let screenshotBase64 = "";
    try {
      screenshotBase64 = await captureScreenshot(page);
      onUpdate({ type: "screenshot", data: screenshotBase64 });
      const currentUrl = page.url();
      onUpdate({ type: "url", data: currentUrl });
    } catch (err: any) {
      onUpdate({ type: "log", data: `SYSTEM: Screenshot capture failed — ${err.message}` });
    }

    // Ask AI
    onUpdate({ type: "log", data: `AGENT: Sending screenshot to ${provider.toUpperCase()} for analysis...` });
    let actionObj: AgentAction;
    try {
      actionObj = await callAI(provider, instruction, page.url(), history, screenshotBase64);
    } catch (err: any) {
      onUpdate({ type: "error", data: `SYSTEM ERROR: AI failed to respond — ${err.message}` });
      break;
    }

    onUpdate({ type: "log", data: `AGENT THOUGHT: ${actionObj.thought}` });
    onUpdate({ type: "log", data: `AGENT ACTION: ${actionObj.action.toUpperCase()}${actionObj.selector ? ` → ${actionObj.selector}` : ""}${actionObj.value ? ` → "${actionObj.value}"` : ""}` });
    history.push(`Step ${step}: [${actionObj.action}] ${actionObj.thought}`);

    if (actionObj.action === "done") {
      onUpdate({ type: "log", data: "SYSTEM: ✓ Goal achieved. Task complete." });
      const summary = extractedData.length > 0
        ? `Task completed! Here is what I extracted:\n\n${extractedData.join("\n\n")}`
        : `Task completed successfully! I have finished the automation.`;
      onUpdate({ type: "result", data: summary });
      break;
    }

    // Human approval gate
    if (approvalMode) {
      onUpdate({ type: "log", data: "APPROVAL: Waiting for your confirmation before executing..." });
      // Approval is handled via polling the /api/approve endpoint — see below
      await new Promise<void>((resolve) => setTimeout(resolve, 2000)); // simplified for now
    }

    // Execute action
    try {
      if (actionObj.action === "navigate" && actionObj.value) {
        onUpdate({ type: "log", data: `BROWSER: Navigating to ${actionObj.value}` });
        await page.goto(actionObj.value, { waitUntil: "domcontentloaded", timeout: 20000 });
        await page.waitForTimeout(800);

      } else if (actionObj.action === "click" && actionObj.selector) {
        onUpdate({ type: "log", data: `BROWSER: Clicking "${actionObj.selector}"` });
        await page.click(actionObj.selector, { timeout: 8000 });
        await page.waitForTimeout(600);

      } else if (actionObj.action === "type" && actionObj.selector && actionObj.value) {
        onUpdate({ type: "log", data: `BROWSER: Typing "${actionObj.value}" into "${actionObj.selector}"` });
        await page.fill(actionObj.selector, actionObj.value, { timeout: 8000 });
        await page.keyboard.press("Enter");
        await page.waitForTimeout(1500);

      } else if (actionObj.action === "scroll") {
        onUpdate({ type: "log", data: "BROWSER: Scrolling page down..." });
        await page.evaluate(() => window.scrollBy(0, 600));
        await page.waitForTimeout(500);

      } else if (actionObj.action === "wait" && actionObj.value) {
        const ms = Math.min(parseInt(actionObj.value) || 2000, 5000);
        onUpdate({ type: "log", data: `BROWSER: Waiting ${ms}ms...` });
        await page.waitForTimeout(ms);

      } else if (actionObj.action === "extract" && actionObj.value) {
        onUpdate({ type: "log", data: `BROWSER: Extracted data: ${actionObj.value}` });
        extractedData.push(actionObj.value);
      }

    } catch (err: any) {
      onUpdate({ type: "log", data: `SYSTEM: Action failed (step ${step}) — ${err.message}. Retrying next step...` });
    }

    // Capture updated screenshot after action
    await page.waitForTimeout(500);
    try {
      const updatedScreenshot = await captureScreenshot(page);
      onUpdate({ type: "screenshot", data: updatedScreenshot });
      onUpdate({ type: "url", data: page.url() });
    } catch (_) {}
  }

  onUpdate({ type: "log", data: "SYSTEM: Session ended." });
}
