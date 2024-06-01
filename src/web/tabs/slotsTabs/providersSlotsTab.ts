import { Page } from "@playwright/test"
import MainPage from "../../pages/basePages/mainPage";

export default class ProvidersSlotsTab extends MainPage {
    
    constructor(public page: Page) {
        super(page);
    }

    // Locators
    gamesInSlotsBox = () => this.page.locator("div[class*='SlotBox'] div[class*='SlotBtnContainer']");
    slotsMoreContainer = () => this.page.locator("div[class*='SlotsMoreContainer']");
    textDisplayMore = () => this.slotsMoreContainer().locator("//span[contains(text(),'Displaying')]");
    showMoreButton = () => this.slotsMoreContainer().locator("button");
    providerMenuList = () => this.page.locator("div[class*='ProviderMenu'] span");

    cryptosGame = () => this.gamesInSlotsBox().locator('img[src="https://icons.tivitbet.app/io_cryptos.jpeg"]');

    async clickOnFirstGameInSlots() {
        await this.gamesInSlotsBox().nth(0).click();
    }
}