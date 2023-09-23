    const { chromium } = require('playwright-chromium');
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

    Je suis convaincu que votre entreprise,, serait le lieu idéal pour mettre en pratique mes compétences et en acquérir de nouvelles. Mon portfolio, consultable ici : [Lien vers mon Portfolio](https://lucaszebre.github.io/Portfolio/), reflète mon engagement dans la création de projets innovants et fonctionnels. N'hésitez pas à l'explorer pour mieux appréhender mon travail et ma passion pour la programmation.

    Je suis motivé à l'idée de rejoindre une équipe dynamique et de contribuer activement à vos projets. Mon adaptabilité, mon sens de l'organisation et ma rigueur font de moi un candidat capable de s'intégrer rapidement dans votre entreprise. De plus, ma capacité d'apprentissage rapide me permettra de contribuer activement dès le début de mon contrat en alternance.

    Je tiens à vous informer qu'en 2023, le gouvernement offre une aide exceptionnelle de 6000€ aux employeurs qui recrutent des alternants, ce qui pourrait couvrir intégralement ma première année d'apprentissage. Vous trouverez plus d'informations à ce sujet en suivant ce lien : [Lien vers l'aide gouvernementale](https://travail-emploi.gouv.fr/formation-professionnelle/entreprise-et-alternance/aides-au-recrutement-d-un-alternant/article/aide-2023-aux-employeurs-qui-recrutent-en-alternance).

    Je suis disponible pour commencer immédiatement et je suis persuadé que ma passion pour le développement, mon engagement et ma détermination en font un candidat idéal pour cette opportunité en alternance.

    Je vous remercie sincèrement pour l'attention que vous porterez à ma candidature. Je suis impatient de vous rencontrer pour discuter de ma contribution potentielle à votre entreprise.

    Je vous prie d'agréer, Madame, Monsieur, l'expression de mes salutations distinguées.

    Lucas Zebre`

    async function Login() {
        const popupselector='#axeptio_btn_acceptAll'
        try {
        await buttonClick(popupselector);
        await page.waitForTimeout(3000);
        } catch (error) {
        console.error('Error clicking on button:', error);
        }
        const selector = "[data-testid='header-user-button-login']";
        await buttonClick(selector);
        await findTargetAndType('#email_login', email);
        await findTargetAndType('#password', password);
        page.keyboard.press("Enter");
        await page.waitForTimeout(3000); // Wait for 3 seconds (adjust as needed)


    }

    async function buttonClickWithTimeout(selector, timeout) {
            try {
            await page.waitForSelector(selector, { visible: true, timeout });
            const buttonClick = await page.$(selector);
            await buttonClick.click();
            } catch (error) {
            console.error(`Error clicking on button: ${error.message}`);
            }
        }


    async function findTargetAndType(target, value) {
        await page.waitForSelector(target);
        const f = await page.$(target);
        await f.type(value);
    }

    async function initiliazer() {
        browser = await chromium.launch({
        headless: false,
        executablePath: browserPath,
        args: [resolution],
        defaultViewport: null,
        });
        page = await browser.newPage();
    
        await page.goto(BaseURL);
    }

    
    async function buttonClick(selector) {
        await page.waitForSelector(selector, { visible: true });
        const buttonClick = await page.$(selector);
        await buttonClick.click();
    }
    let ListCompany=[]

    // function to get the list of all the company
    async function getAllTheCompany(){
        let i=1
        while(i<9){
            await GetListCompaniesPage(i)
            i++
        }
    }

    // function to get list of all the company on the page 'i'
    async function GetListCompaniesPage(i) {
        let Marseille =`https://www.welcometothejungle.com/fr/companies?page=${i}&aroundQuery=Marseille%2C%20France&aroundLatLng=43.29337%2C5.37133&aroundRadius=20000&query=`
        let Paris=`https://www.welcometothejungle.com/fr/companies?page=${i}&aroundQuery=Paris%2C%20France&aroundLatLng=48.85718%2C2.34141&aroundRadius=20000&query=`
        await page.goto(
        Marseille
    );
    const selector =
        '#pages_organizations_search > div.sc-bXCLTC.sc-8lzkc1-0.FhrpP > div > div.sc-1ojxmdz-0.iakhCd > label > input';
        await buttonClickWithTimeout(selector, 5000);
        const companyNames = await scrapeCompanyNames('.sc-bXCLTC.hlqow9-0.helNZg');
    ListCompany.push(...companyNames); // Append the company names to the list
    await page.waitForTimeout(500);
    }


    // function to apply to one companies
    async function ApplyToOneCompanies(companies) {
        try {
            await page.goto(`https://www.welcometothejungle.com/fr/companies/${companies}/jobs`);
        const selector = '#pages_organizations_show > main > div > div > section > div.sc-1tceu7y-0.dtBzLT > div > div > div > div > div > div.sc-1mxdn37-1.gkJZtf > ol > div.sc-bXCLTC.eRgxOS > div > button';
    
        try {
        await buttonClick(selector);
        await page.waitForTimeout(3000);
        } catch (error) {
        console.error('Error clicking on button:', error);
        }
        
    
        const selectorTextArea = '#cover_letter';
    
        try {
        await findTargetAndType(selectorTextArea, letter);
        await buttonClick('#terms');
        await buttonClick('#consent');
        // Scroll and wait for a moment (adjust the duration as needed)
        await page.evaluate(() => {
            window.scrollBy(0, 200); // Scroll down by 200 pixels (adjust as needed)
        });
        await page.waitForTimeout(3000); // Wait for 3 seconds (adjust as needed)
        
        // Explicitly wait for the submit button to appear
        await page.waitForSelector('#apply-form-submit', { visible: true });
        
        const ConfirmButton = '#apply-form-submit';
        await buttonClick(ConfirmButton);
        await page.waitForTimeout(5000);
        } catch (error) {
        console.error('Error during application:', error);
        }
        console.log('apply sucessfully', companies)
        } catch (error) {
            console.log('ErrorApply',companies)
        }
        
    }
    

    


// function to The company name
    async function scrapeCompanyNames(companyNameSelector) {
        try {
            await page.waitForTimeout(2500);
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
    
    
    async function ApplytoAll() {
        await getAllTheCompany();
        // Loop through each company and apply
        for (const company of ListCompany) {
        await ApplyToOneCompanies(company);
        }
    }
    
    async function main() {
            await initiliazer();
            await Login();
            await ApplytoAll()
            await browser.close();
    }
    main();