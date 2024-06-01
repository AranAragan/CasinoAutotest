import { expect, test } from "../../../src/web/base/pomFixture"
import * as data from "../../../src/web/data/login-data.json"

test.describe("Visual basic tests", () => {
    test.skip("Future and bottom visual test", async ({ page, authorizedInHousePage, unauthorizedInHousePage }) => {
        await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        await unauthorizedInHousePage.selectLanguage("हिंदी");

        expect(await unauthorizedInHousePage.header().screenshot()).toMatchSnapshot("unloginHeader.png", { threshold: 0.2 });
        expect(await unauthorizedInHousePage.footer().screenshot()).toMatchSnapshot("footer.png", { threshold: 0.2 });

        await unauthorizedInHousePage.loginUser(data.email, data.password);
        expect(await authorizedInHousePage.header().screenshot()).toMatchSnapshot("loginHeader.png", { threshold: 0.2 });
    })

    test.skip("Login and register window visual test", async ({ page, unauthorizedInHousePage }) => {
        await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        await unauthorizedInHousePage.selectLanguage("हिंदी");

        await unauthorizedInHousePage.clickOnLoginButton();
        expect(await unauthorizedInHousePage.loginWindow.windowLocator().screenshot()).toMatchSnapshot("loginWindow.png", { threshold: 0.2 });

        await unauthorizedInHousePage.closeLoginWindow();
        await unauthorizedInHousePage.clickOnRegistrationButton();

        expect(await unauthorizedInHousePage.registerWindow.windowLocator().screenshot()).toMatchSnapshot("registerWindow.png", { threshold: 0.2 });
        expect(await unauthorizedInHousePage.registerWindow.bannerLocator().screenshot()).toMatchSnapshot("registerWindowBanner.png", { threshold: 0.2 });
    })

    test.skip("SideHamburger test", async ({ page, unauthorizedInHousePage }) => {
        await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
        await unauthorizedInHousePage.selectLanguage("हिंदी");


        expect(await unauthorizedInHousePage.leftSideBarOpened().screenshot()).toMatchSnapshot("openedHamburger.png", { threshold: 0.2 });
    })
})
