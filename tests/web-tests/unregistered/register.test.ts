import { expect, test } from "../../../src/web/base/pomFixture"
import { Utils } from "../../../utils/generators";

test.describe("Базовые тесты регистрации", () => {
    test("FB-89 autotest.web. Регистрация с помощью кнопки Sign Up в Header @regression @dev @prod", async ({ page, unauthorizedInHousePage, authorizedInHousePage }) => {
        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);
        let login: string;

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await unauthorizedInHousePage.selectLanguage("Русский");
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        await test.step(`Подождать окрытия окна регистрации`, async () => {
            await unauthorizedInHousePage.waitForRegisteredWindowEnabled();
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            await authorizedInHousePage.navigationMenuButton().click();
            login = await authorizedInHousePage.navigationMenuUserLogin().innerText();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`Проверить сгенерируемый логин и логин из выпадающего списка`, async () => {
            await expect(authorizedInHousePage.navigationMenuUserLogin()).toHaveText(login);
            await expect(authorizedInHousePage.navigationMenuUserId()).toHaveText(login.replace(/[^0-9]/g, ''))

            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });

        await test.step(`Перезайти под созданным пользователем и проверить наличие логина`, async () => {
            await unauthorizedInHousePage.loginUser(login, password);

            await authorizedInHousePage.navigationMenuButton().click();
            await expect(authorizedInHousePage.navigationMenuUserLogin()).toHaveText(login);
            await expect(authorizedInHousePage.navigationMenuUserId()).toHaveText(login.replace(/[^0-9]/g, ''));
        });
    })

    test("FB-90 autotest.web. Регистрация с помощью окна регистрации @regression @dev @prod", async ({ page, unauthorizedInHousePage, authorizedInHousePage }) => {
        const email = Utils.generateEmail();
        const phoneNumber = Utils.generateRandomNumber(10);
        const password = Utils.generateString(10);
        let login: string;

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.waitForRegisteredWindowEnabled();
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            await authorizedInHousePage.navigationMenuButton().click();
            login = await authorizedInHousePage.navigationMenuUserLogin().innerText();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`Проверить сгенерируемый логин и логин из выпадающего списка`, async () => {
            await expect(authorizedInHousePage.navigationMenuUserLogin()).toBeVisible();

            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });

        await test.step(`Перезайти под созданным пользователем и проверить наличие логина`, async () => {
            await unauthorizedInHousePage.loginUser(login, password);

            await authorizedInHousePage.navigationMenuButton().click();
            await expect(authorizedInHousePage.navigationMenuUserLogin()).toHaveText(login);
            await expect(authorizedInHousePage.navigationMenuUserId()).toHaveText(login.replace(/[^0-9]/g, ''));
        });
    })

    test("FB-91 autotest.web. Регистрация с помощью кнопки Sign Up Now в чате @regression @dev", async ({ page, unauthorizedInHousePage, authorizedInHousePage }) => {
        const email = Utils.generateEmail();
        const phoneNumber = Utils.generateRandomNumber(10);
        let login: string;
        const password = Utils.generateString(10);

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
            await page.evaluate('window.__disableCaptcha__ = true');
        });

        await test.step(`Нажать на кнопку Sign Up Now в чате (Кнопка регистрации)`, async () => {
            await unauthorizedInHousePage.clickOnRegistrationButtonInChat();
        });

        await test.step(`Заполнить телефонный номер, email и нажать на кнопку Register (Кнопка регистрации))`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Заполнить телефонный номер, email`, async () => {
            await unauthorizedInHousePage.registerNewUser(email, phoneNumber, password);
            await authorizedInHousePage.depositWindow.closeDepositWindowButton().click();
            await authorizedInHousePage.navigationMenuButton().click();
            login = await authorizedInHousePage.navigationMenuUserLogin().innerText();
            await authorizedInHousePage.navigationMenuUserLogin().click();
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`Проверить сгенерируемый логин и логин из выпадающего списка`, async () => {
            await expect(authorizedInHousePage.navigationMenuUserLogin()).toHaveText(login);
            await expect(authorizedInHousePage.navigationMenuUserId()).toHaveText(login.replace(/[^0-9]/g, ''))

            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });

        await test.step(`Перезайти под созданным пользователем и проверить наличие логина`, async () => {
            await unauthorizedInHousePage.loginUser(login, password);

            await authorizedInHousePage.navigationMenuButton().click();
            await expect(authorizedInHousePage.navigationMenuUserLogin()).toHaveText(login);
            await expect(authorizedInHousePage.navigationMenuUserId()).toHaveText(login.replace(/[^0-9]/g, ''));
        });
    })
})
