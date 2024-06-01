import { expect, test } from "../../../src/web/base/pomFixtureWithAuthorisation"

test.describe('Страница "Реферальная система"', () => {
    test('FB-114 autotest.web. Проверка базовых элементов на странице "Реферальная система" (Referral system), зарегистрированный пользователь @regression @prod @dev @web ', async ({ page, authorizedInHousePage, authorizedReferralPage }) => {
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

        await test.step(`В выпадающем списке выбрать "Реферальная система" (Referral system)`, async () => {
            await authorizedInHousePage.navigationMenuReferal().click();
        });

        await test.step(`Проверить отображение заголовков в верхней части блока "Referral System"`, async () => {
            await expect(authorizedReferralPage.referalBlocksHeaders()).toHaveText(["Total referrals", "Registrations today", "Income for today", "Income for all time"]);
        });

        await test.step(`Проверить отображение в блоке "Referral link" ссылок на социальные сети`, async () => {
            await expect(authorizedReferralPage.referalSocialLinks()).toHaveCount(3);
        });

        await test.step(`Проверить отображение в блоке "Referral link" input-а`, async () => {
            await expect(authorizedReferralPage.referalLinkInput()).toBeVisible();
        });

        await test.step(`Проверить отображение в блоке "Referral link" кнопки копирования значения из input-а`, async () => {
            await expect(authorizedReferralPage.referalLinkInputCopyButton()).toBeVisible();
        });

        await test.step(`Проверить отображение в блоке "Referral link" кнопки "Promo materials"`, async () => {
            await expect(authorizedReferralPage.referalLinkButtonPromo()).toBeVisible();
        });

        await test.step(`Проверить отображение в блоке "Referral info" header-а`, async () => {
            await expect(authorizedReferralPage.referalInfoHeader()).toContainText(["Make profit by participating in the"]);
        });

        await test.step(`Проверить отображение в блоке "Referral info" наличие изображения-схемы`, async () => {
            await expect(authorizedReferralPage.referalInfoImage()).toBeVisible();
        });

        await test.step(`Проверить отображение в блоке "Profitability calculation" наличие слайдеров`, async () => {
            await expect(authorizedReferralPage.referalProfitabilityCalculationSliders()).toHaveCount(2);
        });

        await test.step(`Проверить отображение в блоке "Profitability calculation" заголовка`, async () => {
            await expect(authorizedReferralPage.referalProfitabilityCalculationHeader()).toHaveText("Profitability calculation:");
        });

        await test.step(`Проверить отображение в таблице "TOP 10 affiliates" столбцов`, async () => {
            await expect(authorizedReferralPage.referalTableHeader()).toHaveText("TOP 10 affiliates");
            await expect(authorizedReferralPage.referalTableTheadElements()).toHaveText('#AffiliateReferralsIncomeReward');
        });

        await test.step(`Проверить ссылки для заголовка "Legal information"`, async () => {
            await expect(authorizedReferralPage.legalInformationFooterHeader()).toBeVisible();
            await expect(authorizedReferralPage.legalInformationFooterLinks()).toHaveText(["KYC Policies", "Accounts, Payouts & Bonuses", "Dispute Resolution", "Privacy & Management of Personal Data", "Anti-Money Laundering Policy", "Self-exclusion", "Terms and Conditions", "Responsible Gaming", "Fairness & RNG Testing Methods", "Risk Disclosure"]);
        });

        await test.step(`Проверить ссылки для заголовка "Features"`, async () => {
            await expect(authorizedReferralPage.featuresFooterHeader()).toBeVisible();
            await expect(authorizedReferralPage.featuresFooterLinks()).toHaveText(["Affiliate program", "Referral system", "Bonus system"]);
        });

        await test.step(`Проверить ссылки для заголовка "Other"`, async () => {
            await expect(authorizedReferralPage.otherFooterHeader()).toBeVisible();
            await expect(authorizedReferralPage.otherFooterLinks()).toHaveText(["Download App", "Rules", "Contacts"]);
        });

        await test.step(`Проверить ссылки для заголовка "Support"`, async () => {
            await expect(authorizedReferralPage.supportFooterHeader()).toBeVisible();
            await expect(authorizedReferralPage.supportFooterLinks()).toHaveText(["HELP 24/7"]);
        });
    })

    test('FB-115 autotest.web. Проверка ссылок и кнопок на странице "Реферальная система" (Referral system), зарегистрированный пользователь @regression @prod @dev @web ', async ({ page, context, authorizedInHousePage, authorizedReferralPage }) => {
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

        await test.step(`В выпадающем списке выбрать "Реферальная система" (Referral system)`, async () => {
            await authorizedInHousePage.navigationMenuReferal().click();
        });

        // check telegram link
        await test.step(`В разделе "Реферальная ссылка" нажать на иконку Telegram`, async () => {
            await authorizedReferralPage.referalSocialLinks().nth(0).click();
        });

        await page.waitForTimeout(5000);

        await test.step(`Проверить url в открывшемся окне и отображаемую страницу`, () => {
            const pages = context.pages();

            const telegramUrl = pages[pages.length - 1].url();
            expect(telegramUrl).toContain("t.me");
        });

        await test.step(`Закрыть вкладку`, async () => {
            const pages = context.pages();
            await pages[pages.length - 1].close();
        });

        // check twitter link
        await test.step(`В разделе "Реферальная ссылка" нажать на иконку Twitter`, async () => {
            const referalSocialLinkTwitter = await authorizedReferralPage.referalSocialLinks().nth(1).getAttribute("href");
            expect(referalSocialLinkTwitter).toContain("/ref/");
        });

        await test.step(`Проверить url в открывшемся окне и отображаемую страницу`, async () => {
            await authorizedReferralPage.referalSocialLinks().nth(1).click();
            const pagesWithTwitter = context.pages();

            const twitterUrl = pagesWithTwitter[pagesWithTwitter.length - 1].url();
            expect(twitterUrl).toContain("twitter.com");
        });

        await test.step(`Закрыть вкладку`, async () => {
            const pages = context.pages();
            await pages[pages.length - 1].close();
        });

        // check reddit link
        await test.step(`В разделе "Реферальная ссылка" нажать на иконку Reddit`, async () => {
            const referalSocialLinkReddit = await authorizedReferralPage.referalSocialLinks().nth(2).getAttribute("href");

            expect(referalSocialLinkReddit).toContain("/ref/");
            await authorizedReferralPage.referalSocialLinks().nth(2).click();
        });

        await page.waitForTimeout(5000);

        await test.step(`Проверить url в открывшемся окне и отображаемую страницу`, () => {
            let pages = context.pages();
            pages = context.pages();

            const redditUrl = pages[pages.length - 1].url();
            expect(redditUrl).toContain("reddit.com");
        });

        await test.step(`Закрыть вкладку`, async () => {
            const pages = context.pages();
            await pages[pages.length - 1].close();
        });

        // check promo link button
        await test.step(`В разделе "Реферальная ссылка" нажать на кнопку "Промо материалы"`, async () => {
            await authorizedReferralPage.referalLinkButtonPromo().click();
        });

        await page.waitForTimeout(5000);
        
        await test.step(`Проверить url в открывшемся окне и отображаемую страницу`, () => {
            let pages = context.pages();
            pages = context.pages();

            const downloadPromoUrl = pages[pages.length - 1].url();
            expect(downloadPromoUrl).toContain("dropbox.com");
        });

        await test.step(`Закрыть вкладку`, async () => {
            const pages = context.pages();
            await pages[pages.length - 1].close();
        });
    })
})