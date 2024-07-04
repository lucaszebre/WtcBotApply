    const fs = require('fs');
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
    let companyApplicationStatus = {}; // Create an empty object to store application status


    try {
        const data = fs.readFileSync('application_status.json', 'utf8');
        companyApplicationStatus = JSON.parse(data);
    } catch (error) {
        console.log('No existing application status file found. Starting fresh.');
    }
    

    const letter=`
    Objet : Développeur Web passionné - Une surprise vidéo et une opportunité financière vous attendent !
    
    Madame, Monsieur,
    
    Je suis Lucas Zebre, développeur web en formation à la Web@cademie by EPITECH, à la recherche d'une alternance de 14 mois à partir de septembre 2024.
    
    Pour pimenter votre journée de recrutement, je vous ai concocté un CV vidéo : https://youtu.be/dAv2vatCcVE
    En seulement quelques minutes, vous découvrirez qui je suis vraiment (et peut-être même quelques surprises).
    
    Si cette mise en bouche vous a mis en appétit, mon portfolio est le plat principal : https://lucaszebre.vercel.app/
    Vous y savourerez mes projets, dont un clone d'Instagram qui démontre mes compétences en développement full-stack.
    
    Autodidacte dans l'âme, j'apprends aussi vite qu'un développeur devant sa machine à café le matin.
    
    Avant de passer au dessert, j'ai une information qui pourrait vous intéresser : le gouvernement offre actuellement une aide aux employeurs qui recrutent des alternants. Cette aide pourrait considérablement réduire le coût de mon alternance. Vous trouverez plus d'informations à ce sujet en suivant ce lien : [Aide aux employeurs qui recrutent en alternance](https://travail-emploi.gouv.fr/formation-professionnelle/entreprise-et-alternance/aides-au-recrutement-d-un-alternant/article/aide-aux-employeurs-qui-recrutent-en-alternance).
    
    Et maintenant, passons au dessert ! Je serais ravi d'échanger avec vous lors d'un appel pour discuter de la façon dont je pourrais apporter ma touche épicée à votre équipe, tout en bénéficiant de cette opportunité financière.
    
    Dans l'attente de votre retour, je vous souhaite une excellente dégustation de mon profil.
    
    Lucas Zebre
    0758486742
    `

    async function Login() {
        const popupselector='#axeptio_btn_acceptAll'
        try {
        await buttonClick(popupselector);
        await page.waitForTimeout(3000);
        } catch (error) {
        console.error('Error clicking on button:', error);
        }
        const selector = "[data-testid='not-logged-visible-login-button']";
        await buttonClick(selector);
        await findTargetAndType('#email_login', email);
        await findTargetAndType('#password', password);
        page.keyboard.press("Enter");
        await page.waitForTimeout(3000); // Wait for 3 seconds (adjust as needed)


    }

    function updateApplicationStatus(companyName, status) {
        companyApplicationStatus[companyName] = status;
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
        let i=3
        while(i<numberOfPagination){
            await GetListCompaniesPage(i)
            i++
        }
    }

    // function to get list of all the company on the page 'i'
    async function GetListCompaniesPage(i) {
        let Paris=`https://www.welcometothejungle.com/fr/companies?page=${i}&aroundQuery=Paris%2C%20France&aroundLatLng=48.85718%2C2.34141&aroundRadius=20000&query=`
        await page.goto(
        Paris
    );
    const selector = 'input[type="checkbox"][aria-checked="false"].sc-fUkmAC.fOWgih';
    await buttonClickWithTimeout(selector, 5000);
    const companyNames = await scrapeCompanyNames('div[role="mark"].sc-bXCLTC.vm8xc2-0.cVbuZq');
    ListCompany.push(...companyNames); // Append the company names to the list
    await page.waitForTimeout(500);
    }


    // function to apply to one companies
    async function ApplyToOneCompanies(companies) {
        if (companyApplicationStatus[companies] === 'Successful') {
            console.log(`Already successfully applied to ${companies}. Skipping.`);
            return;
        }
        try {
            await page.goto(`https://www.welcometothejungle.com/fr/companies/${companies}/jobs`);
            
            // Check for "Page introuvable" message
            const pageNotFoundSelector = 'p.sc-fulCBj.bXxmFr.wui-text';
            const pageNotFound = await page.$(pageNotFoundSelector);
            if (pageNotFound) {
                const pageNotFoundText = await pageNotFound.innerText();
                if (pageNotFoundText.includes('Page introuvable')) {
                    console.log(`Page not found for ${companies}. Skipping.`);
                    updateApplicationStatus(companies, 'Skipped - Page Not Found');
                    return;
                }
            }

            const buttonSelector = 'button[data-testid="company_jobs-button-apply"][data-role="job:apply"]';
            const externalLinkSelector = 'a[data-testid="company_jobs-button-apply"][data-role="job:apply"]';

            let found = false;
            let attempts = 0;
            const maxAttempts = 3;

            while (!found && attempts < maxAttempts) {
                try {
                    // Check for external link first
                    const externalLink = await page.$(externalLinkSelector);
                    if (externalLink) {
                        console.log(`External application link found for ${companies}. Skipping.`);
                        updateApplicationStatus(companies, 'Skipped - External Link');
                        return;
                    }

                    // Look for the button
                    const button = await page.$(buttonSelector);
                    if (button) {
                        await button.scrollIntoViewIfNeeded();
                        await page.waitForTimeout(2000);
                        await button.click({ force: true });
                        found = true;
                        await page.waitForTimeout(3000);
                    } else {
                        // Scroll down if button not found
                        await page.evaluate(() => {
                            window.scrollBy(0, 300);
                        });
                        await page.waitForTimeout(1000);
                    }
                } catch (error) {
                    console.error(`Attempt ${attempts + 1} failed for ${companies}:`, error);
                }
                attempts++;
            }

            if (!found) {
                console.log(`Button not found for company ${companies} after ${maxAttempts} attempts.`);
                updateApplicationStatus(companies, 'Failed - Button Not Found');
                return;
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
                updateApplicationStatus(companies, 'Failed - Application Error');
            }
                console.log('Apply successfully to:', companies);
                updateApplicationStatus(companies, 'Successful');
            } catch (error) {
                console.log('Failed to apply to:', companies);
                updateApplicationStatus(companies, 'Failed - General Error');
            }
            
        }

    function saveApplicationStatusToFile() {
        try {
            let existingData = {};
            const fileName = 'application_status.json';

            // Check if the file exists and read its content
            if (fs.existsSync(fileName)) {
                const fileContent = fs.readFileSync(fileName, 'utf8');
                existingData = JSON.parse(fileContent);
            }

            // Merge existing data with new data
            const updatedData = { ...existingData, ...companyApplicationStatus };

            // Write the merged data back to the file
            const data = JSON.stringify(updatedData, null, 2);
            fs.writeFileSync(fileName, data);

            console.log('Application status appended to application_status.json');
        } catch (error) {
            console.error('Error saving application status:', error);
        }
    }
    

    console.log(companyApplicationStatus)


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
            saveApplicationStatusToFile();
    }
    main();