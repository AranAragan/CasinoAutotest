import { Page } from "@playwright/test"
import MainPage from "../../pages/basePages/mainPage";

export default class SlotsTab extends MainPage {

    constructor(public page: Page) {
        super(page);
    }
    
    // Locators
    searchPlace = () => this.page.locator("input[type='search']");
    gamesInSlotsBox = () => this.page.locator("div[class*='SlotBox'] div[class*='SlotBtnContainer']");
    slotsMoreContainer = () => this.page.locator("div[class*='SlotsMoreContainer']");
    textDisplayMore = () => this.slotsMoreContainer().locator("//span[contains(text(),'Displaying')]");
    showMoreButton = () => this.slotsMoreContainer().locator("button");

    async clickOnFirstGameInSlots() {
        await this.gamesInSlotsBox().nth(0).click();
    }
}