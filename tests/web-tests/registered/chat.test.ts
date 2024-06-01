import { expect, test } from "../../../src/web/base/pomFixtureWithAuthorisation"
import { Utils } from "../../../utils/generators";

test("FB-96 autotest.web. Базовые действия и интерфейс чата @regression @dev @web", async ({ page, authorizedInHousePage }) => {
    authorizedInHousePage.popupBonusWindow.autoGetPopUpBonus();
    const randomString = "test" + Utils.generateRandomNumber(10);
    await page.goto(process.env.BASE_URL!, { waitUntil: 'load' });
    await authorizedInHousePage.selectLanguage("English");
    
    await authorizedInHousePage.clickOnOpenLanguageListButton();
    await expect(authorizedInHousePage.chatLanguageList()).toBeVisible();
    
    await authorizedInHousePage.sendMessageToChat(randomString);
    await expect(authorizedInHousePage.chatMessages().nth(1)).toContainText(randomString);
})