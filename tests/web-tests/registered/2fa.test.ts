import { test, expect } from "../../../src/web/base/pomFixture";
import { Utils } from "../../../utils/generators";
import UnauthorizedLoginPage from "../../../src/admin/pages/unauthorized/UnauthorizedLoginPage";
import AuthorizedUsersPage from "../../../src/admin/pages/authorized/AuthorizedUsersPage";
import AuthorizedProfilePage from "../../../src/admin/pages/authorized/AuthorizedProfilePage";
import { authenticator } from 'otplib';


test.describe("2FA на фронте", () => {
    test('FB-147 Проверка включения 2FA @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedProfilePage }) => {
        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);
        let login: string = "";

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

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`В выпадающем списке выбрать "Profile" (Профиль)`, async () => {
            await authorizedInHousePage.navigationMenuProfile().click();
        });

        await test.step(`Проверить, что кнопка 2fa отображается, но не при нажатии на нее ничего не происходит`, async () => {
            await expect(authorizedProfilePage.settingBottomPlace2faButton(), 'Кнопка 2fa видна на странице').toBeVisible();
            await expect(authorizedProfilePage.settingBottomPlaceGetSecretKey(), 'Input с 2fa кодом не отображается на странице').not.toBeVisible();
            await expect(authorizedProfilePage.settingBottomQRCodeFor2fa(), 'QR Код не отображается на странице').not.toBeVisible();
        });

        await test.step(`Верефицировать пользователя`, async () => {
            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedProfilePage = new AuthorizedProfilePage(page);

            // await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            // await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
            login = login.split('#')[1];

            await test.step(`Перейти в админку`, async () => {
                await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
                await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
            });

            await test.step(`Дождаться загрузки страницы`, async () => {
                await authorizedUsersPage.mainLeftSidebar.leftSideBarContent().waitFor({ state: "visible" });
            });

            await test.step(`Перейти на страниц пользователя`, async () => {
                await page.goto(`${process.env.ADMIN_URL}/users/${login}`);
            });

            await test.step(`Нажать на выпадающий список "Status", выбрать "Verified"`, async () => {
                await authorizedProfilePage.userCommonInfoTab.setValueInStatusListboxInDetailsModule('Verified');
            });
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "Profile" (Профиль)`, async () => {
            await authorizedInHousePage.navigationMenuProfile().click();
        });

        await test.step(`Проверить, что кнопка 2fa не заблокирована`, async () => {
            await expect(authorizedProfilePage.settingBottomPlace2faButton(), 'Кнопка 2fa не заблокирована').toBeEnabled();
        });

        await test.step(`Нажать на кнопку 2fa`, async () => {
            await authorizedProfilePage.settingBottomPlace2faButton().click();
        });

        await test.step(`Проверить отображение QR-кода, input-а и доступность кнопки включения 2fa`, async () => {
            await expect(authorizedProfilePage.settingBottomPlace2faButton(), 'Кнопка 2fa не заблокирована').toBeEnabled();
            await expect(authorizedProfilePage.settingBottomPlaceGetSecretKey(), 'Input с 2fa кодом отображается на странице').toBeVisible();
            await expect(authorizedProfilePage.settingBottomQRCodeFor2fa(), 'QR Код отображается на странице').toBeEnabled();
        });
    });

    test('FB-148 Проверка работы 2FA @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedProfilePage }) => {
        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);
        let login: string = "";
        let loginId: string = "";
        let twoFaCode: string = "";
        let token: string = "";

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

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Верефицировать пользователя`, async () => {
            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedProfilePage = new AuthorizedProfilePage(page);

            // await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            // await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
            loginId = login.split('#')[1];

            await test.step(`Перейти в админку`, async () => {
                await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
                await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
            });

            await test.step(`Дождаться загрузки страницы`, async () => {
                await authorizedUsersPage.mainLeftSidebar.leftSideBarContent().waitFor({ state: "visible" });
            });

            await test.step(`Перейти на страниц пользователя`, async () => {
                await page.goto(`${process.env.ADMIN_URL}/users/${loginId}`);
            });

            await test.step(`Нажать на выпадающий список "Status", выбрать "Verified"`, async () => {
                await authorizedProfilePage.userCommonInfoTab.setValueInStatusListboxInDetailsModule('Verified');
            });
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "Profile" (Профиль)`, async () => {
            await authorizedInHousePage.navigationMenuProfile().click();
        });

        await test.step(`Нажать на кнопку 2fa`, async () => {
            await authorizedProfilePage.settingBottomPlace2faButton().click();
        });

        await test.step(`Ввести пароль пользователя`, async () => {
            await authorizedProfilePage.settingBottomPlaceInputPassword().fill(password);
        });

        await test.step(`Получить 2fa code`, async () => {
            twoFaCode = await authorizedProfilePage.settingBottomPlaceGetSecretKey().inputValue();
        });

        await test.step(`Генерация OTP-кода на основе секретного ключа`, () => {
            token = authenticator.generate(twoFaCode);
        });

        await test.step(`Ввести ОТР-код в поле ввода одноразового кода`, async () => {
            await authorizedProfilePage.settingBottomPlaceInputOTRCode().fill(token);
        });

        await test.step(`Отправить форму 2fa`, async () => {
            await authorizedProfilePage.settingBottomSubmit2faForm().click();
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке нажать на Exit (log-out-ом)`, async () => {
            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });

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


        await test.step(`Авторизоваться`, async () => {
            await unauthorizedInHousePage.loginUser(login, password);
        });

        await test.step(`Ввести одноразовый код`, async () => {
            token = authenticator.generate(twoFaCode);
            await unauthorizedInHousePage.enter2Fa(token);
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`Проверить авторизацию`, async () => {
            await expect(authorizedInHousePage.navigationMenuUserLogin()).toHaveText(login);
            await expect(authorizedInHousePage.navigationMenuUserId()).toHaveText(loginId)
        });
    });

    test('FB-150 Проверка отключения и удаления 2FA @regression @web', async ({ page, unauthorizedInHousePage, authorizedInHousePage, authorizedProfilePage }) => {
        const email = Utils.generateEmail();
        const phoneNumber = "9" + Utils.generateRandomNumber(9);
        const password = Utils.generateString(10);
        let login: string = "";
        let loginId: string = "";
        let twoFaCode: string = "";
        let token: string = "";

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

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Верефицировать пользователя`, async () => {
            const unauthorizedLoginPage = new UnauthorizedLoginPage(page);
            const authorizedUsersPage = new AuthorizedUsersPage(page);
            const authorizedProfilePage = new AuthorizedProfilePage(page);

            // await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            // await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
            loginId = login.split('#')[1];

            await test.step(`Перейти в админку`, async () => {
                await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
                await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
            });

            await test.step(`Дождаться загрузки страницы`, async () => {
                await authorizedUsersPage.mainLeftSidebar.leftSideBarContent().waitFor({ state: "visible" });
            });

            await test.step(`Перейти на страниц пользователя`, async () => {
                await page.goto(`${process.env.ADMIN_URL}/users/${loginId}`);
            });

            await test.step(`Нажать на выпадающий список "Status", выбрать "Verified"`, async () => {
                await authorizedProfilePage.userCommonInfoTab.setValueInStatusListboxInDetailsModule('Verified');
            });
        });

        await test.step(`Вернуться на dev`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "Profile" (Профиль)`, async () => {
            await authorizedInHousePage.navigationMenuProfile().click();
        });

        await test.step(`Нажать на кнопку 2fa`, async () => {
            await authorizedProfilePage.settingBottomPlace2faButton().click();
        });

        await test.step(`Ввести пароль пользователя`, async () => {
            await authorizedProfilePage.settingBottomPlaceInputPassword().fill(password);
        });

        await test.step(`Получить 2fa code`, async () => {
            twoFaCode = await authorizedProfilePage.settingBottomPlaceGetSecretKey().inputValue();
        });

        await test.step(`Генерация OTP-кода на основе секретного ключа`, () => {
            token = authenticator.generate(twoFaCode);
        });

        await test.step(`Ввести ОТР-код в поле ввода одноразового кода`, async () => {
            await authorizedProfilePage.settingBottomPlaceInputOTRCode().fill(token);
        });

        await test.step(`Отправить форму 2fa`, async () => {
            await authorizedProfilePage.settingBottomSubmit2faForm().click();
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке нажать на Exit (log-out-ом)`, async () => {
            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });

        let interval = setInterval(() => {
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


        await test.step(`Авторизоваться`, async () => {
            await unauthorizedInHousePage.loginUser(login, password);
        });

        await test.step(`Ввести одноразовый код`, async () => {
            token = authenticator.generate(twoFaCode);
            await unauthorizedInHousePage.enter2Fa(token);
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "Profile" (Профиль)`, async () => {
            await authorizedInHousePage.navigationMenuProfile().click();
        });

        await test.step(`Нажать на кнопку 2fa`, async () => {
            await authorizedProfilePage.settingBottomPlace2faButton().click();
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке нажать на Exit (log-out-ом)`, async () => {
            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });

        interval = setInterval(() => {
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

        await test.step(`Авторизоваться`, async () => {
            await unauthorizedInHousePage.loginUser(login, password);
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`Проверить авторизацию`, async () => {
            await expect(authorizedInHousePage.navigationMenuUserLogin()).toHaveText(login);
            await expect(authorizedInHousePage.navigationMenuUserId()).toHaveText(loginId)
        });

        await test.step(`В выпадающем списке выбрать "Profile" (Профиль)`, async () => {
            await authorizedInHousePage.navigationMenuProfile().click();
        });

        await test.step(`Удалить 2fa`, async () => {
            await authorizedProfilePage.delete2Fa();
        });

        await test.step(`Проверить, что 2fa удалилась`, async () => {
            await expect(authorizedProfilePage.settingBottomPlace2faButton(), 'Кнопка 2fa видна на странице').toBeVisible();
            await expect(authorizedProfilePage.settingBottomPlaceGetSecretKey(), 'Input с 2fa кодом не отображается на странице').not.toBeVisible();
            await expect(authorizedProfilePage.settingBottomQRCodeFor2fa(), 'QR Код не отображается на странице').not.toBeVisible();
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке нажать на Exit (log-out-ом)`, async () => {
            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });

        interval = setInterval(() => {
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

        await test.step(`Авторизоваться`, async () => {
            await unauthorizedInHousePage.loginUser(login, password);
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`Проверить авторизацию`, async () => {
            await expect(authorizedInHousePage.navigationMenuUserLogin()).toHaveText(login);
            await expect(authorizedInHousePage.navigationMenuUserId()).toHaveText(loginId)
        });
    });
});