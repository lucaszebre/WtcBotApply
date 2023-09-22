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

const letter=`Madame, Monsieur,

Actuellement en formation autodidacte en développement front-end, je suis déterminé à acquérir une première expérience professionnelle au sein d'une entreprise innovante. Malgré l'absence de diplôme, je tiens à vous assurer que ma passion pour la programmation, mon portefeuille de projets variés et ma maîtrise des technologies telles que JavaScript, React, Node.js et Python attestent de ma compétence et de mon engagement.

Je suis convaincu que votre entreprise, reconnue pour son expertise dans le domaine du développement, serait le lieu idéal pour mettre en pratique mes compétences et en acquérir de nouvelles. Mon portfolio, consultable ici : [Lien vers mon Portfolio](https://lucaszebre.github.io/Portfolio/), reflète mon engagement dans la création de projets innovants et fonctionnels. N'hésitez pas à l'explorer pour mieux appréhender mon travail et ma passion pour la programmation.

Je suis motivé à l'idée de rejoindre une équipe dynamique et de contribuer activement à vos projets. Mon adaptabilité, mon sens de l'organisation et ma rigueur font de moi un candidat capable de s'intégrer rapidement dans votre entreprise. De plus, ma capacité d'apprentissage rapide me permettra de contribuer activement dès le début de mon contrat en alternance.

Je tiens à vous informer qu'en 2023, le gouvernement offre une aide exceptionnelle de 6000€ aux employeurs qui recrutent des alternants, ce qui pourrait couvrir intégralement ma première année d'apprentissage. Vous trouverez plus d'informations à ce sujet en suivant ce lien : [Lien vers l'aide gouvernementale](https://travail-emploi.gouv.fr/formation-professionnelle/entreprise-et-alternance/aides-au-recrutement-d-un-alternant/article/aide-2023-aux-employeurs-qui-recrutent-en-alternance).

Je suis disponible pour commencer immédiatement et je suis persuadé que ma passion pour le développement, mon engagement et ma détermination en font un candidat idéal pour cette opportunité en alternance.

Je vous remercie sincèrement pour l'attention que vous porterez à ma candidature. Je suis impatient de vous rencontrer pour discuter de ma contribution potentielle à votre entreprise.

Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

Lucas Zebre`
async function Login() {
    const selector = "[data-testid='header-user-button-login']";
    await buttonClick(selector);
    await findTargetAndType('#email_login', email);
    await findTargetAndType('#password', password);
    page.keyboard.press("Enter");

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
  let ListCompany=[]


  async function getAllTheCompany(){
    let i=0
    while(i<numberOfPagination){
        await jobsApply(i)
        i++
    }
  }

 async function jobsApply(i) {
  await page.goto(
    `https://www.welcometothejungle.com/fr/companies?page=${i}&aroundQuery=Paris%2C%20France&aroundLatLng=48.85718%2C2.34141&aroundRadius=20000&query=`
  );
  const selector =
    '#pages_organizations_search > div.sc-bXCLTC.sc-8lzkc1-0.FhrpP > div > div.sc-1ojxmdz-0.iakhCd > label > input';
  await buttonClick(selector);
  const companyNames = await scrapeCompanyNames('.sc-bXCLTC.hlqow9-0.helNZg');
  ListCompany.push(...companyNames); // Append the company names to the list
  await page.waitForTimeout(3000);
}

  async function ApplyToOneCompanies(companies){
    await page.goto(`https://www.welcometothejungle.com/fr/companies/${companies}/jobs`)
    const selector = '#pages_organizations_show > main > div > div > section > div.sc-1tceu7y-0.dtBzLT > div > div > div > div > div > div.sc-1mxdn37-1.gkJZtf > ol > div.sc-bXCLTC.eRgxOS > div > button'
    await buttonClick(selector)
    const selectorTextArea='#cover_letter'
    await findTargetAndType(selectorTextArea,letter);
    const firstInput = '#terms'
    await buttonClick(firstInput)
    const secondInput='#consent'
    await buttonClick(secondInput)
    const ConfirnButton='#apply-form-submit'
    await buttonClick(ConfirnButton)
    await page.waitForTimeout(3000);


  }


  async function scrapeCompanyNames(companyNameSelector) {
    try {
      await page.waitForSelector(companyNameSelector);
      const companyNames = await page.$$eval(companyNameSelector, (elements) => {
        return elements.map((element) => {
          const rawName = element.textContent;
          const formattedName = rawName.toLowerCase().replace(/\([^)]*\)/g, '').replace(/[\s.]/g, '-').replace(/'/g, '-').replace(/^-+|-+$/g, '');
          return formattedName;
        });
      });
      console.log(companyNames);
      return companyNames;
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }
 
  async function main() {
        await initiliazer();
        await Login();
        // await getAllTheCompany();
        await ApplyToOneCompanies('jab');
        console.log(ListCompany)
        await browser.close();
  }
  main();