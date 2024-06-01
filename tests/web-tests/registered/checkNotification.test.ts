import { test, expect } from "../../../src/web/base/pomFixture";
import { Utils } from "../../../utils/generators";
import UnauthorizedLoginPage from "../../../src/admin/pages/unauthorized/UnauthorizedLoginPage";
import AuthorizedOffersPage from "../../../src/admin/pages/authorized/AuthorizedOffersPage";
import AuthorizedOfferPage from "../../../src/admin/pages/authorized/AuthorizedOfferPage";
import AuthorizedUsersPage from "../../../src/admin/pages/authorized/AuthorizedUsersPage";
import { v4 as uuidv4 } from 'uuid';

const depositURL = 'https://api.dev.amxeox.xyz/cash/deposit';
const token = `RJ9iMCoBm3Rb5IPhfbr7K8QYmO97cQbf`

test('FB-151 Проверка работы нотификаций для офферов с типом "Индивидуальный" @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, request }) => {
    const email = Utils.generateEmail();
    const phoneNumber = "9" + Utils.generateRandomNumber(9);
    const password = Utils.generateString(10);
    const activationType = "По кнопке";
    const rewardCurrency = 'INR';
    const rewardAmount = '100';
    let login: string = "";
    let offerName: string = "";
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

    await test.step(`Сменить язык на английский`, async () => {
        await authorizedInHousePage.selectLanguage("English");
    });

    await test.step(`Создание оффера`, async () => {
        offerName = Utils.generateRandomNumber(15);

        const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
        const authorizedOffersPage = new AuthorizedOffersPage(page);
        const authorizedOfferPage = new AuthorizedOfferPage(page);
        const authorizedUsersPage = new AuthorizedUsersPage(page);

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
            await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeIndividual(login);
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

    await test.step(`Нажать на иконку  колокольчика в верхнем правом углу`, async () => {
        await authorizedInHousePage.navigationMenuNotificationButton().click();
    });

    await test.step(`Найти offer в списке нотификаций`, async () => {
        const value = await authorizedInHousePage.getOrderNumberOfNotificationInList(offerName);
        expect(value).not.toEqual(-1);
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


test('FB-152 Проверка работы нотификаций для офферов с типом "Аналитический статический" @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, request }) => {
    const activationType = "По кнопке";
    const rewardCurrency = 'INR';
    const rewardAmount = '100';
    let offerName: string = "";
    let offerId = "";

    await test.step(`Перейти на страницу стенда`, async () => {
        await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        await page.evaluate('window.__disableCaptcha__ = true');
    });

    await test.step(`Авторизоваться под пользователем`, async () => {

        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
        const data = require(`../../../src/web/base/auth_data/${process.env.STAND}/analitical_segment.json`);
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-argument
        await unauthorizedInHousePage.loginUser(data.username, data.password);
    });

    authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

    await test.step(`Сменить язык на английский`, async () => {
        await authorizedInHousePage.selectLanguage("English");
    });

    await test.step(`Создание оффера`, async () => {
        offerName = Utils.generateRandomNumber(15);

        const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
        const authorizedOffersPage = new AuthorizedOffersPage(page);
        const authorizedOfferPage = new AuthorizedOfferPage(page);
        const authorizedUsersPage = new AuthorizedUsersPage(page);

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
            await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAnalytic('static_segment3');
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

    await test.step(`Нажать на иконку  колокольчика в верхнем правом углу`, async () => {
        await authorizedInHousePage.navigationMenuNotificationButton().click();
    });

    await test.step(`Найти offer в списке нотификаций`, async () => {
        const value = await authorizedInHousePage.getOrderNumberOfNotificationInList(offerName);
        expect(value).not.toEqual(-1);
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

test('FB-153 autotest.web. Проверка работы нотификаций после получения выигрыша для офферов с активацией по кнопке @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage, request }) => {
    const email = Utils.generateEmail();
    const phoneNumber = "9" + Utils.generateRandomNumber(9);
    const password = Utils.generateString(10);
    const activationType = "По кнопке";
    const rewardCurrency = 'INR';
    const rewardAmount = '100';
    let offerName: string = "";
    let offerId = "";

    await test.step(`Перейти на страницу стенда`, async () => {
        await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        await page.evaluate('window.__disableCaptcha__ = true');
    });

    await test.step(`Заполнить телефонный номер, email`, async () => {
        await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
        await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
        await authorizedInHousePage.navigationMenuButton().click();
        await authorizedInHousePage.navigationMenuUserLogin().click();
    });

    authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

    await test.step(`Сменить язык на английский`, async () => {
        await authorizedInHousePage.selectLanguage("English");
    });

    await test.step(`Создание оффера`, async () => {
        offerName = Utils.generateRandomNumber(15);

        const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
        const authorizedOffersPage = new AuthorizedOffersPage(page);
        const authorizedOfferPage = new AuthorizedOfferPage(page);
        const authorizedUsersPage = new AuthorizedUsersPage(page);

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

    await test.step(`Нажать на ссылку Bonus Manager в левом меню сайдбара`, async () => {
        await authorizedInHousePage.openLeftSidebar();
        await authorizedInHousePage.mainLeftSidebar.leftSideBarBonusManager().click();
    });

    await test.step(`Активировать бонус`, async () => {
        await authorizedMyBonusesPage.claimBonus(offerName);
        await page.reload();
        await page.waitForLoadState();
    });

    await test.step(`Нажать на иконку  колокольчика в верхнем правом углу`, async () => {
        await authorizedInHousePage.navigationMenuNotificationButton().click();
    });

    await test.step(`Найти offer в списке нотификаций`, async () => {
        const value = await authorizedInHousePage.checkFinishedOfferNotificationInList();
        expect(value).not.toEqual(-1);
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

test("FB-156 autotest.web. Проверка работы нотификаций после получения выигрыша для офферов с отыгрышем @regression @web", async ({ page, request, unauthorizedInHousePage, authorizedInHousePage, authorizedSlotsPage, authorizedMyBonusesPage, cryptosGamePage }) => {
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

    await test.step(`Нажать на иконку  колокольчика в верхнем правом углу`, async () => {
        await page.reload();
        await page.waitForLoadState();
        await authorizedInHousePage.navigationMenuNotificationButton().click();
    });

    await test.step(`Найти offer в списке нотификаций`, async () => {
        const value = await authorizedInHousePage.checkFinishedOfferNotificationInList();
        expect(value).not.toEqual(-1);
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

test('FB-157 autotest.web. Проверка работы нотификаций после получения выигрыша для офферов с ваучером @regression @web', async ({ page, request, unauthorizedInHousePage, authorizedInHousePage, authorizedMyBonusesPage }) => {
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

    await test.step(`Открыть левый sidebar`, async () => {
        await page.reload();
        await authorizedInHousePage.openLeftSidebar();
    });

    await test.step(`Нажать на ссылку Bonus Manager в левом меню сайдбара`, async () => {
        await authorizedInHousePage.mainLeftSidebar.leftSideBarBonusManager().click();
    });

    await test.step(`Проверить отображение и количество прокруток`, async () => {
        await page.waitForLoadState();
        expect(await authorizedMyBonusesPage.currencyVoucherBonus().innerText()).toEqual('1');
    });

    await test.step(`Нажать на иконку  колокольчика в верхнем правом углу`, async () => {
        await authorizedInHousePage.navigationMenuNotificationButton().click();
    });

    await test.step(`Найти offer в списке нотификаций`, async () => {
        const value = await authorizedInHousePage.checkVoucherNotificationInList();
        expect(value).not.toEqual(-1);
    });
});