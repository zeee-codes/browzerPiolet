import { chromium, Browser, BrowserContext, Page } from "playwright";

let browserInstance: Browser | null = null;
let contextInstance: BrowserContext | null = null;
let activePage: Page | null = null;

export async function getBrowserSession(): Promise<{ page: Page; context: BrowserContext }> {
  if (!browserInstance) {
    browserInstance = await chromium.launch({
      headless: true
    });
  }
  
  if (!contextInstance) {
    contextInstance = await browserInstance.newContext({
      viewport: { width: 1280, height: 800 }
    });
  }

  if (!activePage) {
    activePage = await contextInstance.newPage();
  }

  return { page: activePage, context: contextInstance };
}

export async function closeBrowserSession() {
  if (activePage) {
    await activePage.close();
    activePage = null;
  }
  if (contextInstance) {
    await contextInstance.close();
    contextInstance = null;
  }
  if (browserInstance) {
    await browserInstance.close();
    browserInstance = null;
  }
}

export async function captureScreenshot(page: Page): Promise<string> {
  const buffer = await page.screenshot({ type: "png" });
  return buffer.toString("base64");
}
