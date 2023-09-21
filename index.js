const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
dotenv.config(); // Load environment variables from .env file

const BaseURL = process.env.BASE_URL;
const email = process.env.EMAIL;
const password = process.env.PASSWORD;
const keyword = process.env.KEYWORD;
const location = process.env.LOCATION;
const avgOfExp = process.env.AVG_EXPERIENCE;
const periodOfTime = process.env.PERIOD;
const browserPath = process.env.CHROME_PATH;
const resolution = process.env.RESOLUTION;
const numberOfPagination = process.env.NUMBER_OF_PAGINATION;
const nbrOfOffersPerPage = process.env.NUMBER_OF_OFFERS_PER_PAGE;
let browser = "";

async function Login() {
    const selector = "[data-testid='header-user-button-login']";
    await buttonClick(selector);
  await findTargetAndType('#email_login', email);
  await findTargetAndType('#password', password);
  page.keyboard.press("Enter");
  await page.waitForTimeout(10000000);

}
async function findTargetAndType(target, value) {
    await page.waitForSelector(target);
    const f = await page.$(target);
    await f.type(value);
  }

async function initiliazer() {
    browser = await puppeteer.launch({
      headless: false,
      executablePath: browserPath,
      args: [resolution],
      defaultViewport: null,
      //userDataDir: "./userData",
      //uncomment userDataDir line  if you want to store your session and remove login() from main()
      // and change the baseURL to https://www.linkedin.com/feed
    });
    page = await browser.newPage();
    const pages = await browser.pages();
    if (pages.length > 1) {
      await pages[0].close();
    }
    await page.goto(BaseURL);
  }
  async function buttonClick(selector) {
    await page.waitForSelector(selector);
    const buttonClick = await page.$(selector);
    await buttonClick.click();
  }

  async function main() {
    await initiliazer();
     await Login();
    // await jobsApply();
    await browser.close();
  }
  main();