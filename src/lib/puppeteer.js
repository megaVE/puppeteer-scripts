import puppeteer from "puppeteer"

export async function createBrowserAndPage(initialURL) {
  const browser = await puppeteer.launch(
    { headless: false, slowMo: 100 }
  )
  const page = await browser.newPage()

  if(initialURL) {
    await page.goto(initialURL)
  }

  return { browser, page }
}
