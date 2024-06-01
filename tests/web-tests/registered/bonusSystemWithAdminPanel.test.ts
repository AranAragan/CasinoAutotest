import { expect, test } from "../../../src/web/base/pomFixture";
import moment from "moment";
import { v4 as uuidv4 } from 'uuid';
import { Utils } from "../../../utils/generators";
import UnauthorizedLoginPage from "../../../src/admin/pages/unauthorized/UnauthorizedLoginPage";
import AuthorizedUsersPage from "../../../src/admin/pages/authorized/AuthorizedUsersPage";
import AuthorizedOfferPage from "../../../src/admin/pages/authorized/AuthorizedOfferPage";
import AuthorizedOffersPage from "../../../src/admin/pages/authorized/AuthorizedOffersPage";

const depositURL = 'https://api.dev.amxeox.xyz/cash/deposit';
const token = `RJ9iMCoBm3Rb5IPhfbr7K8QYmO97cQbf`


test.describe("Бонусная система на фронте", () => {
    test("ADM-253 Создание оффера с типом активации 'по кнопке', проверка баланса @regression @web", async ({ page, request, unauthorizedInHousePage, authorizedInHousePage, authorizedSlotsPage, authorizedMyBonusesPage, cryptosGamePage }) => {
        let offerName: string
        let offerId = "";

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const activationType = "По кнопке";
            const rewardCurrency = 'BTC';
            const rewardAmount = '0.1';
            const wagerPeriodInDays = '12';
            const wagerAmountMultiplier = '1';
            const wageringByProvider = 'InOut';
            const wageringByProviderProcent = '10';

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInActivationType(activationType)
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier(wagerAmountMultiplier);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays(wagerPeriodInDays);
                await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
                await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput(wageringByProvider);
                await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput(wageringByProviderProcent);
                await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });
            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop()!;
        });

        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        let login: string = "";
        const password = Utils.generateString(10);
        const generatedUUID = uuidv4();

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            await authorizedInHousePage.navigationMenuButton().click();
            login = await authorizedInHousePage.navigationMenuUserLogin().innerText();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });


        login = login.split('#')[1]
        const newIssue = await request.post(depositURL + '', {
            headers: {
                'Authorization': token,
            },
            data: {
                customer_id: login,
                order_id: generatedUUID,
                amount: "1",
                currency: "BTC",
            }
        });
        expect(newIssue.ok()).toBeTruthy();

        await test.step(`Открыть левый sidebar`, async () => {
            await authorizedInHousePage.openLeftSidebar();
        });

        await test.step(`Нажать на ссылку Bonus Manager в левом меню сайдбара`, async () => {
            await authorizedInHousePage.mainLeftSidebar.leftSideBarBonusManager().click();
        });

        await test.step(`Активировать бонус`, async () => {
            await authorizedMyBonusesPage.claimBonus(offerName);
        });

        await test.step(`Открыть левый sidebar`, async () => {
            await authorizedInHousePage.openLeftSidebar();
        });

        await test.step(`Нажать на ссылку "Slots" (Слоты) в левом меню сайдбара`, async () => {
            await authorizedInHousePage.mainLeftSidebar.openCasinoSlots("Original Games");
            await authorizedSlotsPage.clickOnSlotsMenu("All Games");
        });

        await test.step(`Нажать на провайдера в списке провайдеров`, async () => {
            await authorizedSlotsPage.selectProviderInProviderList("InOut");
        });

        await test.step(`Выбрать в качестве игровой валюты Bitcoin`, async () => {
            await authorizedSlotsPage.selectCurrency("Bitcoin");
        });

        await test.step(`Открыть Cryptos`, async () => {
            await authorizedSlotsPage.providersSlotsTab.cryptosGame().click();
        });

        await test.step(`Cделать ставку`, async () => {
            await page.mouse.wheel(0, 300);
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
        });

        await test.step(`Нажать на ссылку Bonus Manager в левом меню сайдбара`, async () => {
            await authorizedInHousePage.openLeftSidebar();
            await authorizedInHousePage.mainLeftSidebar.leftSideBarBonusManager().click();
        });


        await test.step(`Проверить, что оффер активирован для пользователя`, async () => {
            await expect(authorizedMyBonusesPage.currentFinishedBonus(offerName)).toBeVisible();
        });

        const balance = await test.step(`Проверить баланс`, async () => {
            return await authorizedMyBonusesPage.balanceInMenu().innerText();
        });

        await test.step(`Забрать бонус`, async () => {
            await authorizedMyBonusesPage.getBonus(offerName);
        });

        await test.step(`Проверить баланс`, async () => {
            expect(parseFloat(await authorizedMyBonusesPage.balanceInMenu().innerText())).toEqual(parseFloat(balance) + 0.1);
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });

    test('ADM-257 Создание оффера с типом активации "по кнопке", начислять сразу, проверка баланса @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage, request }) => {
        let offerName: string
        let offerId = "";

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const rewardCurrency = 'BTC';
            const rewardAmount = '0.1';
            const activationType = "По кнопке";

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInActivationType(activationType)
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.clickWageringCheckbox();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });
            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop()!;
        });

        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await unauthorizedInHousePage.selectLanguage("Русский");
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        await test.step(`Нажать на кнопку Sign Up (Кнопка регистрации)`, async () => {
            await unauthorizedInHousePage.clickOnRegistrationButton();
        });

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
        });

        await test.step(`Активировать бонус`, async () => {
            await authorizedMyBonusesPage.claimBonus(offerName);
        });

        await test.step(`Забрать бонус`, async () => {
            await authorizedMyBonusesPage.getBonus(offerName);
        });

        await test.step(`Выбрать в качестве игровой валюты Bitcoin`, async () => {
            await authorizedMyBonusesPage.selectCurrency("Bitcoin");
        });

        await test.step(`Проверить баланс`, async () => {
            expect(parseFloat(await authorizedMyBonusesPage.balanceInMenu().innerText())).toEqual(0.1);
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });

    test("ADM-258 Создание оффера с типом активации по депозиту, проверка баланса @regression @web", async ({ page, request, unauthorizedInHousePage, authorizedInHousePage, authorizedSlotsPage, authorizedMyBonusesPage, cryptosGamePage }) => {
        let offerId;
        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const rewardCurrency = 'BTC';
            const rewardAmount = '10';
            const minDeposit = '1';
            const wagerPeriodInDays = '12';
            const wagerAmountMultiplier = '1';
            const wageringByProvider = 'InOut';
            const wageringByProviderProcent = '10';

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit(minDeposit)
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier(wagerAmountMultiplier);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays(wagerPeriodInDays);
                await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
                await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput(wageringByProvider);
                await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput(wageringByProviderProcent);
                await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
                await page.waitForTimeout(5000);
            });
            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop();
        });

        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);
        let login = "";
        const generatedUUID = uuidv4();

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            await authorizedInHousePage.navigationMenuButton().click();
            login = await authorizedInHousePage.navigationMenuUserLogin().innerText();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        login = login.split('#')[1]
        const newIssue = await request.post(depositURL + '', {
            headers: {
                'Authorization': token,
            },
            data: {
                customer_id: login,
                order_id: generatedUUID,
                offer_id: offerId,
                amount: "1",
                currency: "BTC",
            }
        });
        expect(newIssue.ok()).toBeTruthy();

        await test.step(`Открыть левый sidebar`, async () => {
            await authorizedInHousePage.openLeftSidebar();
        });

        await test.step(`Нажать на ссылку "Original games" в левом меню сайдбара`, async () => {
            await authorizedInHousePage.mainLeftSidebar.openCasinoSlots("Original Games");
            await authorizedSlotsPage.clickOnSlotsMenu("All Games");
        });

        await test.step(`Нажать на провайдера в списке провайдеров`, async () => {
            await authorizedSlotsPage.selectProviderInProviderList("InOut");
        });

        await test.step(`Выбрать в качестве игровой валюты Bitcoin`, async () => {
            await authorizedSlotsPage.selectCurrency("Bitcoin");
        });

        await test.step(`Открыть Cryptos`, async () => {
            await authorizedSlotsPage.providersSlotsTab.cryptosGame().click();
        });

        await test.step(`Cделать ставку`, async () => {
            await page.mouse.wheel(0, 300);
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
        });

        await test.step(`Нажать на ссылку Bonus Manager в левом меню сайдбара`, async () => {
            await authorizedSlotsPage.openLeftSidebar();
            await authorizedSlotsPage.mainLeftSidebar.leftSideBarBonusManager().click();
        });

        await test.step(`Проверить, что оффер активирован для пользователя`, async () => {
            await expect(authorizedMyBonusesPage.currentFinishedBonus(offerName)).toBeVisible();
        });

        const balance = await test.step(`Проверить баланс`, async () => {
            return await authorizedMyBonusesPage.balanceInMenu().innerText();
        });

        await test.step(`Забрать бонус`, async () => {
            await authorizedMyBonusesPage.getBonus(offerName);
        });

        await test.step(`Проверить баланс`, async () => {
            expect(parseFloat(await authorizedMyBonusesPage.balanceInMenu().innerText())).toEqual(parseFloat(balance) + 0.1);
        });
    });

    test('ADM-259 Создание оффера с типом активации "по депозиту", начислять сразу, проверка баланса @regression @web', async ({ page, request, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage }) => {
        let offerId;
        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const rewardCurrency = 'BTC';
            const rewardAmount = '10';
            const minDeposit = '1';

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit(minDeposit)
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.clickWageringCheckbox();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });
            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop();
        });

        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);
        let login = "";
        const generatedUUID = uuidv4();

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        await test.step(`Заполнить телефонный номер, email, password`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
        });


        await test.step(`Закрыть окно депозита`, async () => {
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
        });

        await test.step(`Получить login-id`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
            login = await authorizedInHousePage.navigationMenuUserLogin().innerText();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        login = login.split('#')[1]
        const newIssue = await request.post(depositURL + '', {
            headers: {
                'Authorization': token,
            },
            data: {
                customer_id: login,
                order_id: generatedUUID,
                offer_id: offerId,
                amount: "1",
                currency: "BTC",
            }
        });
        expect(newIssue.ok()).toBeTruthy();

        await test.step(`Нажать на ссылку Bonus Manager в левом меню сайдбара`, async () => {
            await authorizedInHousePage.openLeftSidebar();
            await authorizedInHousePage.mainLeftSidebar.leftSideBarBonusManager().click();
        });

        await test.step(`Забрать бонус`, async () => {
            await authorizedMyBonusesPage.getBonus(offerName);
        });

        await test.step(`Выбрать в качестве игровой валюты Bitcoin`, async () => {
            await authorizedMyBonusesPage.selectCurrency("Bitcoin");
        });

        await test.step(`Проверить баланс`, async () => {
            expect(parseFloat(await authorizedMyBonusesPage.balanceInMenu().innerText())).toEqual(1.1);
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });


    test('ADM-260 Создание оффера с типом активации "по кнопке", начислять сразу, проверка сегмента "Персональный" @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage, request }) => {
        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);
        let login: string = "";
        let offerId = "";

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            await authorizedInHousePage.navigationMenuButton().click();
            login = await authorizedInHousePage.navigationMenuUserLogin().innerText();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        login = login.split('#')[1]

        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const rewardCurrency = 'BTC';
            const rewardAmount = '0.01';
            const activationType = "По кнопке";

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInActivationType(activationType)
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeIndividual(login)
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.clickWageringCheckbox();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });

            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop()!;
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
        });

        await test.step(`Активировать бонус`, async () => {
            await authorizedMyBonusesPage.claimBonus(offerName);
        });

        await test.step(`Забрать бонус`, async () => {
            await authorizedMyBonusesPage.getBonus(offerName);
        });

        await test.step(`Выбрать в качестве игровой валюты Bitcoin`, async () => {
            await authorizedMyBonusesPage.selectCurrency("Bitcoin");
        });

        await test.step(`Проверить баланс`, async () => {
            expect(parseFloat(await authorizedMyBonusesPage.balanceInMenu().innerText())).toEqual(0.01);
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });

    test.skip('ADM-261 Создание оффера с типом активации "по кнопке", начислять сразу, проверка сегмента "Аналитический статический" @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage, request }) => {
        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);
        let login: string = "";
        let offerId = "";

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            await authorizedInHousePage.navigationMenuButton().click();
            login = await authorizedInHousePage.navigationMenuUserLogin().innerText();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        login = login.split('#')[1]

        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const rewardCurrency = 'BTC';
            const rewardAmount = '0.01';
            const activationType = "По кнопке";

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInActivationType(activationType)
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAnalytic(login);
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.clickWageringCheckbox();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });

            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop()!;
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
        });

        await test.step(`Активировать бонус`, async () => {
            await authorizedMyBonusesPage.claimBonus(offerName);
        });

        await test.step(`Забрать бонус`, async () => {
            await authorizedMyBonusesPage.getBonus(offerName);
        });

        await test.step(`Выбрать в качестве игровой валюты Bitcoin`, async () => {
            await authorizedMyBonusesPage.selectCurrency("Bitcoin");
        });

        await test.step(`Проверить баланс`, async () => {
            expect(parseFloat(await authorizedMyBonusesPage.balanceInMenu().innerText())).toEqual(0.01);
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });

    test('ADM-262 Создание оффера с типом активации "по кнопке", начислять сразу, проверка сегмента "По фильтрам" (Таргетинг по статусу) @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage, request }) => {
        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);
        let offerId = "";

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
        });



        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const rewardCurrency = 'BTC';
            const rewardAmount = '0.01';
            const activationType = "По кнопке";

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInActivationType(activationType)
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeFilter();
                await authorizedOffersPage.createAndEditOfferWindow.addValueInSettingTargetingByStatus(['Freeze']);
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.clickWageringCheckbox();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });
            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop()!;
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).not.toBeVisible();
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`Выйти из под пользователя`, async () => {
            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });

        await test.step(`Авторизоваться под пользователем`, async () => {

            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
            const data = require(`../../../src/web/base/auth_data/${process.env.STAND}/banned_user.json`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
            await unauthorizedInHousePage.loginUser(data.email, data.password);
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });

    test('ADM-264 Создание оффера с типом активации "по кнопке", начислять сразу, проверка сегмента "По фильтрам" (Таргетинг по роли) @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage, request }) => {
        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);
        let offerId = "";

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
        });


        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const rewardCurrency = 'BTC';
            const rewardAmount = '0.01';
            const activationType = "По кнопке";

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInActivationType(activationType)
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeFilter();
                await authorizedOffersPage.createAndEditOfferWindow.addValueInsettingUpForRoleTargeting(['Blogger']);
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.clickWageringCheckbox();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });
            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop()!;
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).not.toBeVisible();
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`Выйти из под пользователя`, async () => {
            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });

        await test.step(`Авторизоваться под пользователем`, async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
            const data = require(`../../../src/web/base/auth_data/${process.env.STAND}/blogger_user.json`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            await unauthorizedInHousePage.loginUser(data.email, data.password);
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });

    test('ADM-265 Создание оффера с типом активации "по кнопке", начислять сразу, проверка сегмента "По фильтрам" (Таргетинг по тегу) @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage, request }) => {
        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);
        let offerId = "";

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
        });

        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const rewardCurrency = 'BTC';
            const rewardAmount = '0.01';
            const activationType = "По кнопке";

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInActivationType(activationType)
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeFilter();
                await authorizedOffersPage.createAndEditOfferWindow.addValueInsettingUpForTagTargeting(['VIP Silver']);
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.clickWageringCheckbox();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });

            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop()!;
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).not.toBeVisible();
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`Выйти из под пользователя`, async () => {
            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });

        await test.step(`Авторизоваться под пользователем`, async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
            const data = require(`../../../src/web/base/auth_data/${process.env.STAND}/vip_silver_tag_user.json`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            await unauthorizedInHousePage.loginUser(data.email, data.password);
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });

    test('ADM-266 Создание оффера с типом активации "по кнопке", начислять сразу, проверка сегмента "По фильтрам" (Таргетинг по Дате От) @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage, request }) => {
        const email = Utils.generateEmail();
        const password = Utils.generateString(10);
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const todayFormatted = moment().format('MMMM YYYY');
        const todayDay = moment().date();
        let offerId = "";

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
        });


        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const rewardCurrency = 'BTC';
            const rewardAmount = '0.01';
            const activationType = "По кнопке";

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInActivationType(activationType)
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeFilter();
                await authorizedOffersPage.createAndEditOfferWindow.selectStartDateWithoutTime(todayDay, todayFormatted);
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.clickWageringCheckbox();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });

            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop()!;
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`Выйти из под пользователя`, async () => {
            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });

        await test.step(`Авторизоваться под пользователем`, async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
            const data = require(`../../../src/web/base/auth_data/${process.env.STAND}/vip_silver_tag_user.json`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            await unauthorizedInHousePage.loginUser(data.email, data.password);
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).not.toBeVisible();
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });

    test('ADM-267 Создание оффера с типом активации "по кнопке", начислять сразу, проверка сегмента "По фильтрам" (Таргетинг по Дате По) @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage, request }) => {
        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);
        let offerId = "";

        const today = moment();
        const yesterday = today.clone().subtract(1, 'day');
        const yesterdayMonthAndYear = yesterday.format('MMMM YYYY');
        const yesterdayDay = yesterday.date();

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            await authorizedInHousePage.navigationMenuButton().click();
        });

        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const rewardCurrency = 'BTC';
            const rewardAmount = '0.01';
            const activationType = "По кнопке";

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInActivationType(activationType)
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeFilter();
                await authorizedOffersPage.createAndEditOfferWindow.selectEndDateWithoutTime(yesterdayDay, yesterdayMonthAndYear);
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.clickWageringCheckbox();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });
            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop()!;
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).not.toBeVisible();
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`Выйти из под пользователя`, async () => {
            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });

        await test.step(`Авторизоваться под пользователем`, async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
            const data = require(`../../../src/web/base/auth_data/${process.env.STAND}/vip_silver_tag_user.json`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            await unauthorizedInHousePage.loginUser(data.email, data.password);
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });

    // что-то непонятное с гео
    test.skip('ADM-268 Создание оффера с типом активации "по кнопке", начислять сразу, проверка сегмента "По фильтрам" (Таргетинг по гео) @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage, request }) => {
        const interval = setInterval(() => {
            unauthorizedInHousePage.registerWindow.windowLocatorBanner().isVisible()
                .then(async (isVisible) => {
                    if (isVisible) {
                        await unauthorizedInHousePage.registerWindow.closeRegisterWindow();
                        clearInterval(interval);
                    }
                })
                .catch(() => {
                });
        }, 10000);

        let offerId = "";

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Авторизоваться под пользователем`, async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
            const data = await require(`../../../src/web/base/auth_data/${process.env.STAND}/russian_user.json`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            await unauthorizedInHousePage.loginUser(data.email, data.password);
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const rewardCurrency = 'BTC';
            const rewardAmount = '0.01';
            const activationType = "По кнопке";

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInActivationType(activationType)
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeFilter();
                await authorizedOffersPage.createAndEditOfferWindow.addValueInsettingUpForGeoTargeting(['Сингапур']);
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.clickWageringCheckbox();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });
            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop()!;
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).not.toBeVisible();
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`Выйти из под пользователя`, async () => {
            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });

        await test.step(`Авторизоваться под пользователем`, async () => {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
            const data = await require(`../../../src/web/base/auth_data/${process.env.STAND}/indian_user.json`);
            // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
            await unauthorizedInHousePage.loginUser(data.email, data.password);
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });

    test('ADM-269 Создание оффера с типом активации по депозиту (указан минимальный и максимальный депозит), проверка баланса @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage, request }) => {
        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);
        let offerId;
        let login: string = "";

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            await authorizedInHousePage.navigationMenuButton().click();
            login = await authorizedInHousePage.navigationMenuUserLogin().innerText();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const rewardCurrency = 'BTC';
            const rewardAmount = '10';
            const minDeposit = "1";
            const maxDeposit = "2";

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit(minDeposit);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInMaxDeposit(maxDeposit);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.clickWageringCheckbox();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
                await page.waitForLoadState('networkidle');
                await page.waitForTimeout(5000);
            });

            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop();
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
        });

        let generatedUUID = uuidv4();

        login = login.split('#')[1]
        const requestWithBalanceLessThanMin = await request.post(depositURL + '', {
            headers: {
                'Authorization': token,
            },
            data: {
                customer_id: login,
                order_id: generatedUUID,
                offer_id: offerId,
                amount: "0.5",
                currency: "BTC",
            }
        });
        expect(requestWithBalanceLessThanMin.ok()).toBeTruthy();

        await test.step(`Обновить страницу`, async () => {
            await page.reload();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
        });

        generatedUUID = uuidv4();

        const requestWithBalanceMoreThanMax = await request.post(depositURL + '', {
            headers: {
                'Authorization': token,
            },
            data: {
                customer_id: login,
                order_id: generatedUUID,
                offer_id: offerId,
                amount: "2.5",
                currency: "BTC",
            }
        });

        expect(requestWithBalanceMoreThanMax.ok()).toBeTruthy();

        await test.step(`Обновить страницу`, async () => {
            await page.reload();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
        });

        generatedUUID = uuidv4();

        const requestWithBalance = await request.post(depositURL + '', {
            headers: {
                'Authorization': token,
            },
            data: {
                customer_id: login,
                order_id: generatedUUID,
                offer_id: offerId,
                amount: "1",
                currency: "BTC",
            }
        });
        expect(requestWithBalance.ok()).toBeTruthy();

        await test.step(`Обновить страницу`, async () => {
            await page.reload();
        });

        await test.step(`Забрать бонус`, async () => {
            await authorizedMyBonusesPage.getBonus(offerName);
        });

        await test.step(`Выбрать в качестве игровой валюты Bitcoin`, async () => {
            await authorizedMyBonusesPage.selectCurrency("Bitcoin");
        });

        await test.step(`Проверить баланс`, async () => {
            expect(parseFloat(await authorizedMyBonusesPage.balanceInMenu().innerText())).toEqual(4.1);
        });
    });

    test('ADM-270 Создание оффера с типом активации по депозиту (указан минимальное и максимальное количество депозитов) проверка граничных значений @regression @web', async ({ page, unauthorizedInHousePage, request, authorizedInHousePage, authorizedMyBonusesPage }) => {
        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);
        let login: string = "";
        let offerId = "";

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            await authorizedInHousePage.navigationMenuButton().click();
            login = await authorizedInHousePage.navigationMenuUserLogin().innerText();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const rewardCurrency = 'BTC';
            const rewardAmount = '10';
            const minDeposit = "1";
            const minCount = "2";
            const maxCount = "3";

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit(minDeposit);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInMinCountDeposit(minCount);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInMaxCountDeposit(maxCount);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.clickWageringCheckbox();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });
            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop()!;
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение и недоступность бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
            expect(await authorizedMyBonusesPage.currentAvailableBonusButton(offerName).innerText()).toEqual('Not available now');
        });

        let generatedUUID = uuidv4();

        login = login.split('#')[1]
        let requestWithBalance = await request.post(depositURL + '', {
            headers: {
                'Authorization': token,
            },
            data: {
                customer_id: login,
                order_id: generatedUUID,
                amount: "1",
                currency: "BTC",
            }
        });

        await test.step(`Обновить страницу`, async () => {
            await page.reload();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
            expect(await authorizedMyBonusesPage.currentAvailableBonusButton(offerName).innerText()).not.toEqual('Not available now');
        });

        generatedUUID = uuidv4();

        requestWithBalance = await request.post(depositURL + '', {
            headers: {
                'Authorization': token,
            },
            data: {
                customer_id: login,
                order_id: generatedUUID,
                amount: "1",
                currency: "BTC",
            }
        });
        expect(requestWithBalance.ok()).toBeTruthy();

        await test.step(`Обновить страницу`, async () => {
            await page.reload();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
            expect(await authorizedMyBonusesPage.currentAvailableBonusButton(offerName).innerText()).not.toEqual('Not available now');
        });

        generatedUUID = uuidv4();

        requestWithBalance = await request.post(depositURL + '', {
            headers: {
                'Authorization': token,
            },
            data: {
                customer_id: login,
                order_id: generatedUUID,
                amount: "1",
                currency: "BTC",
            }
        });
        expect(requestWithBalance.ok()).toBeTruthy();

        await test.step(`Обновить страницу`, async () => {
            await page.reload();
        });

        await test.step(`Проверить отображение и недоступность бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).not.toBeVisible();
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });

    test('ADM-271 Создание оффера с типом активации по депозиту (указан минимальное и максимальное количество депозитов) проверка зачисления @regression @web', async ({ page, unauthorizedInHousePage, request, authorizedInHousePage, authorizedMyBonusesPage, authorizedSlotsPage, cryptosGamePage }) => {
        const email = Utils.generateEmail();
        const password = Utils.generateString(10);
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        let login: string = "";
        let offerId;

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            await authorizedInHousePage.navigationMenuButton().click();
            login = await authorizedInHousePage.navigationMenuUserLogin().innerText();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const rewardCurrency = 'BTC';
            const rewardAmount = '10';
            const minDeposit = "1";
            const minCount = "2";
            const maxCount = "3";
            const wagerPeriodInDays = '12';
            const wagerAmountMultiplier = '1';
            const wageringByProvider = 'InOut';
            const wageringByProviderProcent = '10';

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit(minDeposit);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInMinCountDeposit(minCount);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInMaxCountDeposit(maxCount);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier(wagerAmountMultiplier);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays(wagerPeriodInDays);
                await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
                await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput(wageringByProvider);
                await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput(wageringByProviderProcent);
                await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });


            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });

            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop();
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение и недоступность бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
            expect(await authorizedMyBonusesPage.currentAvailableBonusButton(offerName).innerText()).toEqual('Not available now');
        });

        let generatedUUID = uuidv4();

        login = login.split('#')[1]
        let requestWithBalance = await request.post(depositURL + '', {
            headers: {
                'Authorization': token,
            },
            data: {
                customer_id: login,
                order_id: generatedUUID,
                amount: "1",
                currency: "BTC",
            }
        });

        await test.step(`Обновить страницу`, async () => {
            await page.reload();
        });

        await test.step(`Проверить отображение доступного бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
            expect(await authorizedMyBonusesPage.currentAvailableBonusButton(offerName).innerText()).not.toEqual('Not available now');
        });

        generatedUUID = uuidv4();

        requestWithBalance = await request.post(depositURL + '', {
            headers: {
                'Authorization': token,
            },
            data: {
                customer_id: login,
                order_id: generatedUUID,
                offer_id: offerId,
                amount: "1",
                currency: "BTC",
            }
        });
        expect(requestWithBalance.ok()).toBeTruthy();

        await test.step(`Обновить страницу`, async () => {
            await page.reload();
        });

        await test.step(`Открыть левый sidebar`, async () => {
            await authorizedInHousePage.openLeftSidebar();
        });

        await test.step(`Нажать на ссылку "Original games" в левом меню сайдбара`, async () => {
            await authorizedInHousePage.mainLeftSidebar.openCasinoSlots("Original Games");
            await authorizedSlotsPage.clickOnSlotsMenu("All Games");
        });

        await test.step(`Нажать на провайдера в списке провайдеров`, async () => {
            await authorizedSlotsPage.selectProviderInProviderList("InOut");
        });

        await test.step(`Выбрать в качестве игровой валюты Bitcoin`, async () => {
            await authorizedSlotsPage.selectCurrency("Bitcoin");
        });

        await test.step(`Открыть Cryptos`, async () => {
            await authorizedSlotsPage.providersSlotsTab.cryptosGame().click();
        });

        await test.step(`Cделать ставку`, async () => {
            await page.mouse.wheel(0, 300);
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
            await cryptosGamePage.placeBet("0.1");
        });

        await test.step(`Нажать на ссылку Bonus Manager в левом меню сайдбара`, async () => {
            await authorizedInHousePage.openLeftSidebar();
            await authorizedInHousePage.mainLeftSidebar.leftSideBarBonusManager().click();
        });


        await test.step(`Проверить, что оффер активирован для пользователя`, async () => {
            await expect(authorizedMyBonusesPage.currentFinishedBonus(offerName)).toBeVisible();
        });

        const balance = await test.step(`Проверить баланс`, async () => {
            return await authorizedMyBonusesPage.balanceInMenu().innerText();
        });

        await test.step(`Забрать бонус`, async () => {
            await authorizedMyBonusesPage.getBonus(offerName);
        });

        await test.step(`Обновить страницу`, async () => {
            await page.reload();
        });

        await test.step(`Проверить баланс`, async () => {
            expect(parseFloat(await authorizedMyBonusesPage.balanceInMenu().innerText()).toFixed(2)).toEqual((parseFloat(balance) + 0.1).toFixed(2));
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });

    test('ADM-273 Создание оффера с типом активации "по кнопке" и "Валюта регистрации должна совпадать с валютой вознаграждения"  @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage, request }) => {
        let email = Utils.generateEmail();
        let password = Utils.generateString(10);
        let phoneNumber = "9" + Utils.generateRandomNumber(9);
        let offerId = "";

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password, 'MXN');
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            await authorizedInHousePage.navigationMenuButton().click();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const activationType = "По кнопке";
            const rewardCurrency = 'MXN';
            const rewardAmount = '10';
            const wagerPeriodInDays = '12';
            const wagerAmountMultiplier = '1';
            const wageringByProvider = 'InOut';
            const wageringByProviderProcent = '10';

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInActivationType(activationType)
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
                await authorizedOffersPage.createAndEditOfferWindow.activateOfferWindowUserSegments.registrationCurrencyMustMatchRewardCurrency().click();
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier(wagerAmountMultiplier);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays(wagerPeriodInDays);
                await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
                await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput(wageringByProvider);
                await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput(wageringByProviderProcent);
                await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });

            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });
            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop()!;
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение и доступность бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).toBeVisible();
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`Выйти из под пользователя`, async () => {
            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });

        email = Utils.generateEmail();
        password = Utils.generateString(10);
        phoneNumber = "9" + Utils.generateRandomNumber(9);

        await test.step(`Авторизоваться под новым пользователем с валютой  регистрации != офферной`, async () => {
            await page.evaluate('window.__disableCaptcha__ = true')
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password, 'INR');
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            await authorizedInHousePage.navigationMenuButton().click();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отсутствие отображения и недоступность бонуса`, async () => {
            await expect(authorizedMyBonusesPage.currentAvailableBonus(offerName)).not.toBeVisible();
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });


    test('ADM-274 Создание оффера с типом активации "по кнопке", начислять сразу, проверка cохранения галочки "Начислять сразу" @regression @web', async ({ page, }) => {
        await test.step(`Создание оффера`, async () => {
            const offerName = Utils.generateRandomNumber(15);
            const activationType = "По кнопке";
            const rewardCurrency = 'MXN';
            const rewardAmount = '10';

            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInActivationType(activationType)
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await authorizedOffersPage.createAndEditOfferWindow.clickWageringCheckbox();
                await expect(authorizedOffersPage.createAndEditOfferWindow.activateOfferWindowWagerParams.wageringCheckbox(), 'Чекбокс не выбран').toBeChecked();
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
                await expect(authorizedOffersPage.createAndEditOfferWindow.activateOfferWindowWagerParams.wageringCheckbox(), 'Чекбокс не выбран').toBeChecked();
            });
        });
    });

    test('ADM-275 Создание оффера с типом вознаграждения "Ваучер" @regression @web', async ({ page, request, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage }) => {
        const email = Utils.generateEmail();
        const password = Utils.generateString(10);
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        let login: string = "";
        let offerId = "";
        const generatedUUID = uuidv4();

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password, 'INR');
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            await authorizedInHousePage.navigationMenuButton().click();
            login = await authorizedInHousePage.navigationMenuUserLogin().innerText();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        let offerName: string

        await test.step(`Создание оффера`, async () => {
            offerName = Utils.generateRandomNumber(15);
            const activationType = "Депозит";
            const rewardType = "Ваучер";


            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedOffersPage = new AuthorizedOffersPage(page);
            const authorizedOfferPage = new AuthorizedOfferPage(page);

            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');

            await test.step(`В левом меню выбрать "Офферы"`, async () => {
                await authorizedUsersPage.mainLeftSidebar.openOffersPage();
            });

            await authorizedUsersPage.selectLanguage("Русский");

            await test.step(`Создать оффер`, async () => {
                await authorizedOffersPage.openCreateOfferWindow();
                await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
                await authorizedOffersPage.createAndEditOfferWindow.setValueInActivationType(activationType)
                await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardType(rewardType);
                await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
                await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
                await authorizedOffersPage.createAndEditOfferWindow.createOffer();
            });

            await test.step(`Сменить статус на PENDING`, async () => {
                await authorizedOfferPage.changeOfferStatus('Включить оффер');
                await authorizedOfferPage.activateOffer();
            });

            await test.step(`Сменить статус на ACTIVE`, async () => {
                await authorizedOfferPage.changeOfferStatus('Запустить оффер');
                await authorizedOfferPage.startOffer();
            });

            const currentUrl = page.url();
            offerId = currentUrl.split('/').pop()!;
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });


        await test.step(`Получить login-id`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
            login = await authorizedInHousePage.navigationMenuUserLogin().innerText();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        login = login.split('#')[1]

        const newIssue = await request.post(depositURL + '', {
            headers: {
                'Authorization': token,
            },
            data: {
                customer_id: login,
                order_id: generatedUUID,
                offer_id: offerId,
                amount: "500",
                currency: "INR",
            }
        });
        expect(newIssue.ok()).toBeTruthy();

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "My bonuses" (Мои бонусы)`, async () => {
            await authorizedInHousePage.navigationMenuBonus().click();
        });

        await test.step(`Проверить отображение и количество прокруток`, async () => {
            await page.waitForLoadState();
            expect(await authorizedMyBonusesPage.currencyVoucherBonus().innerText()).toEqual('1');
        });

        await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
            data: {
                "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
            },
            headers: {
                'Authorization': `${process.env.ADMIN_TOKEN}`,
            },
        });
    });
});