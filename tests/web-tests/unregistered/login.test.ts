import { expect, test } from "../../../src/web/base/pomFixture"
import * as data from "../../../src/web/data/login-data.json"

test.describe("Базовые тесты авторизации", () => {
    test("FB-95 autotest.web. Авторизация с email-ом и паролем @regression @dev @web ", async ({ page, authorizedInHousePage, unauthorizedInHousePage }) => {
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
        }, 30000);
        
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Поменять язык на русский и авторизоваться`, async () => {
            await unauthorizedInHousePage.selectLanguage("Русский");
            if (process.env.STAND == "dev" || process.env.STAND == "local") {
                await unauthorizedInHousePage.loginUser(data.email, data.password);
            }else{
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
                const data = require(`../../../src/web/base/auth_data/${process.env.STAND}/0.json`);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                await unauthorizedInHousePage.loginUser(data.email, data.password);
            }
        });

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке нажать на Exit (log-out-ом)`, async () => {
            await expect(authorizedInHousePage.navigationMenuUserLogin()).toHaveText(data.login);
            await expect(authorizedInHousePage.navigationMenuUserId()).toHaveText(data.login.replace(/[^0-9]/g, ''))

            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });
    })

    test("FB-94 autotest.web. Авторизация с логином и паролем @regression @dev @web ", async ({ page, authorizedInHousePage, unauthorizedInHousePage }) => {
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

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        await test.step(`Дождаться появления окна с регистрацией`, async () => {
            await unauthorizedInHousePage.waitForRegisteredWindowEnabled();
        });

        await test.step(`Поменять язык на русский и авторизоваться`, async () => {
            await unauthorizedInHousePage.selectLanguage("Русский");
            if (process.env.STAND == "dev" || process.env.STAND == "local") {
                await unauthorizedInHousePage.loginUser(data.email, data.password);
            }else{
                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-var-requires
                const data = require(`../../../src/web/base/auth_data/${process.env.STAND}/0.json`);
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument, @typescript-eslint/no-unsafe-member-access
                await unauthorizedInHousePage.loginUser(data.email, data.password);
            }
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Нажать на иконку логина в правом верхнем углу экрана`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке нажать на Exit (log-out-ом)`, async () => {
            await expect(authorizedInHousePage.navigationMenuUserLogin()).toHaveText(data.login);
            await expect(authorizedInHousePage.navigationMenuUserId()).toHaveText(data.login.replace(/[^0-9]/g, ''))

            await authorizedInHousePage.navigationMenuList().locator(authorizedInHousePage.navigationMenuLogout())
                .click();
        });
    })
})
