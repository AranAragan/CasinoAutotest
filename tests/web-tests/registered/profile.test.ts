import { Page } from "@playwright/test";
import { expect, test } from "../../../src/web/base/pomFixtureWithAuthorisation"
import { Utils } from "../../../utils/generators";

test.describe('Страница "Профиль"', () => {
    test('FB-112 autotest.web. Проверка базовых элементов на странице "Профиль" (Profile), зарегистрированный пользователь @regression @prod @dev @web ', async ({ page, authorizedInHousePage, authorizedProfilePage }) => {
        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        await test.step(`Сменить язык на английский`, async () => {
            await authorizedInHousePage.selectLanguage("English");
        });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "Profile" (Профиль)`, async () => {
            await authorizedInHousePage.navigationMenuProfile().click();
        });

        await test.step(`Проверить отображение кнопок, ведущих на подписку социальных сетей`, async () => {
            expect(await authorizedProfilePage.socialLinksButton().count()).toBeGreaterThanOrEqual(3);
        });

        await test.step(`Проверить отображение имени пользователя`, async () => {
            await expect(authorizedProfilePage.profileName()).toBeVisible();
        });

        await test.step(`Проверить описание`, async () => {
            await expect(authorizedProfilePage.profileId()).toBeVisible();
        });

        await test.step(`Проверить заголовки в описании/статистике: "Amount of bets", "Best win", "Best coeff.", "Total games"`, async () => {
            await expect(authorizedProfilePage.descriptionHeaders()).toHaveText(["Amount of bets", "Best win", "Best coeff.", "Total games"]);
        });

        await test.step(`Проверить заголовки в bottom-страницы: "Contact info", "Security setup"`, async () => {
            await expect(authorizedProfilePage.settingBottomHeader()).toHaveText(["Contact info", "Security setup"]);
        });

        await test.step(`Проверить отображение кнопок в разделе "Security setup"`, async () => {
            await expect(authorizedProfilePage.settingBottomPlaceBetsAnonymouslySideButton()).toBeVisible();
        });

        await test.step(`Проверить отображение кнопки "Скрыть статистику"`, async () => {
            await expect(authorizedProfilePage.settingBottomHideStatisticsButton()).toBeVisible();
        });

        await test.step(`Проверить ссылки для заголовка "Legal information"`, async () => {
            await expect(authorizedProfilePage.legalInformationFooterHeader()).toBeVisible();
            await expect(authorizedProfilePage.legalInformationFooterLinks()).toHaveText(["KYC Policies", "Accounts, Payouts & Bonuses", "Dispute Resolution", "Privacy & Management of Personal Data", "Anti-Money Laundering Policy", "Self-exclusion", "Terms and Conditions", "Responsible Gaming", "Fairness & RNG Testing Methods", "Risk Disclosure"]);
        });

        await test.step(`Проверить ссылки для заголовка "Features"`, async () => {
            await expect(authorizedProfilePage.featuresFooterHeader()).toBeVisible();
            await expect(authorizedProfilePage.featuresFooterLinks()).toHaveText(["Affiliate program", "Referral system", "Bonus system"]);
        });

        await test.step(`Проверить ссылки для заголовка "Other"`, async () => {
            await expect(authorizedProfilePage.otherFooterHeader()).toBeVisible();
            await expect(authorizedProfilePage.otherFooterLinks()).toHaveText(["Download App", "Rules", "Contacts"]);
        });

        await test.step(`Проверить ссылки для заголовка "Support"`, async () => {
            await expect(authorizedProfilePage.supportFooterHeader()).toBeVisible();
            await expect(authorizedProfilePage.supportFooterLinks()).toHaveText(["HELP 24/7"]);
        });
    })

    // https://kv78r.atlassian.net/browse/PROD-2269
    test('FB-113 autotest.web. Проверка ссылок и кнопок на странице "Профиль" (Profile), зарегистрированный пользователь @regression @prod @dev @web ', async ({ page, context, authorizedInHousePage, authorizedProfilePage }) => {
        const phoneNumber = "1393" + Utils.generateRandomNumber(7);
        const randomLogin = Utils.generateString(6);

        await test.step(`Перейти на страницу стенда`, async () => {
            await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        });

        authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();

        // await test.step(`Сменить язык на английский`, async () => {
        //     await authorizedInHousePage.selectLanguage("English");
        // });

        await test.step(`Нажать на иконку логина в верхнем правом углу`, async () => {
            await authorizedInHousePage.navigationMenuButton().click();
        });

        await test.step(`В выпадающем списке выбрать "Profile" (Профиль)`, async () => {
            await authorizedInHousePage.navigationMenuProfile().click();
        });

        const oldLogin = await authorizedProfilePage.profileName().innerText();

        await test.step(`В input логина ввести сгенерированный логин и нажать на кнопку "Сохранить"`, async () => {
            await authorizedProfilePage.changeLogin(randomLogin);
            expect(await authorizedProfilePage.profileName().innerText()).toEqual(randomLogin);
        });

        await test.step(`В input логина ввести первоначальный логин и нажать на кнопку "Сохранить"`, async () => {
            await authorizedProfilePage.changeLogin(oldLogin);
        });

        // await test.step(`В input email ввести сгенерированный email и нажать на кнопку "Сохранить"`, async () => {
        //     await authorizedProfilePage.changeEmail(email);
        //     expect(await authorizedProfilePage.settingBottomEmailInput().innerText()).toEqual(email);
        // });

        // await test.step(`В input email ввести первоначальный email и нажать на кнопку "Сохранить"`, async () => {
        //     await authorizedProfilePage.changeEmail(oldEmail);
        // });

        await test.step(`В input телефона ввести любой валидный номер телефона и нажать на кнопку "Сохранить"`, async () => {
            await authorizedProfilePage.changePhone(phoneNumber);
            const phone: string = await authorizedProfilePage.settingBottomPhoneInput().inputValue();
            expect(phone.split(' ').join('')).toEqual("+" + phoneNumber);
        });

        // check telegram link 
        let pages: Page[];

        // await test.step(`В разделе ссылок на соц. сети нажать на иконку telegram`, async () => {
        //     await authorizedProfilePage.socialLinksButton().nth(0).click();

        //     pages = context.pages();

        //     let telegramUrl = pages[pages.length - 1].url();
        //     expect(telegramUrl).toContain("telegram.com");
        // });

        // await test.step(`Закрыть вкладку`, async () => {
        //     await pages[pages.length - 1].close();
        // });


        // check steam
        await test.step(`В разделе ссылок на соц. сети нажать на иконку steam`, async () => {
            await authorizedProfilePage.socialLinksButton().nth(1).click();
            await page.waitForTimeout(5000);

            pages = context.pages();
            const steamUrl = pages[0].url();
            expect(steamUrl).toContain("https://steamcommunity.com/");
        });

        await test.step(`Вернуться на предыдущую страницу`, async () => {
            await page.goBack();
        });

        // check google
        await test.step(`В разделе ссылок на соц. сети нажать на иконку google`, async () => {
            await authorizedProfilePage.socialLinksButton().nth(2).click();
            await page.waitForTimeout(5000);
            pages = context.pages();

            const redditUrl = pages[0].url();
            expect(redditUrl).toContain("google.com");
        });

        await test.step(`Вернуться на предыдущую страницу`, async () => {
            await page.goBack();
        });
    })
})