import { expect, test } from "../../../src/web/base/pomFixture";
import { Utils } from "../../../utils/generators";
import UnauthorizedLoginPage from "../../../src/admin/pages/unauthorized/UnauthorizedLoginPage";
import AuthorizedUsersPage from "../../../src/admin/pages/authorized/AuthorizedUsersPage";
import AuthorizedOfferPage from "../../../src/admin/pages/authorized/AuthorizedOfferPage";
import AuthorizedOffersPage from "../../../src/admin/pages/authorized/AuthorizedOffersPage";

let offerId: number;

test('ADM-272 Создание оффера с типом POP-UP, начислять сразу, проверка окна @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage }) => {
    let offerName: string

    const rewardCurrency = 'INR';
    const rewardAmount = '10';

    await test.step(`Создание оффера`, async () => {
        offerName = Utils.generateRandomNumber(15);

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
            await authorizedOffersPage.createAndEditOfferWindow.setValueTypeInput('Popup');
            await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(offerName);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
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

        offerId = parseInt(currentUrl.split('/').pop()!);
    });

    const email = Utils.generateEmail();
    const phoneNumber = "9" + Utils.generateRandomNumber(9);
    const password = Utils.generateString(10);


    await test.step(`Перейти на страницу стенда`, async () => {
        await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        await page.evaluate('window.__disableCaptcha__ = true');
    });

    
    await test.step(`Заполнить телефонный номер, email, password`, async () => {
        await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
        await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
        await page.reload();
    });

    
    await test.step(`Выбрать в качестве игровой валюты INR`, async () => {
        await authorizedInHousePage.popupBonusWindow.getPopUpBonus();
        await authorizedInHousePage.selectCurrency(rewardCurrency);
    });

    await test.step(`Проверить баланс`, async () => {
        expect(parseFloat(await authorizedInHousePage.balanceInMenu().innerText())).not.toEqual(0);
    });
});

test.afterEach(async ({ request }) => {
    await request.post(`${process.env.ADMIN_API_URL}/graphql?op=AdminCancelOffer`, {
        data: {
            "operationName": "AdminCancelOffer", "variables": { "id": offerId, "cancelReason": "OFFER_INVALID", "comment": "аutotest" }, "query": "mutation AdminCancelOffer($id: Int!, $cancelReason: OfferCancelReason!, $comment: String!) {\n  adminCancelOffer(id: $id, cancelReason: $cancelReason, comment: $comment) {\n    id\n    __typename\n  }\n}"
        },
        headers: {
            'Authorization': `${process.env.ADMIN_TOKEN}`,
        },
    });
});