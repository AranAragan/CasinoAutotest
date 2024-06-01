import { Page } from "@playwright/test"
import MainPage from "../../pages/basePages/mainPage";

export default class NewGamesTab extends MainPage {

    constructor(public page: Page) {
        super(page);
    }
    
    // Locators
    slotsHeaderValues = () => this.page.locator("div[class*='SlotsRowStyles'] span");
    sectionsWithGames = () => this.page.locator("div[class*='GameBox']");
    gamesInNewSection = () => this.sectionsWithGames().locator("div[class*='SlotBtnBox'] div[class*='SlotBtnContainer']");
    gamesInNewSectionPrevButton = () => this.gamesInNewSection().locator('div[class*="PrevBtn"]');
    gamesInNewSectionNextButton = () => this.gamesInNewSection().locator('div[class*="NextBtn"]');
    providersInProvidersSection = () => this.sectionsWithGames().nth(1).locator("div[class*='SlotBtnContainer']");
    providersSectionPrevButton = () => this.providersInProvidersSection().locator('div[class*="PrevBtn"]');
    providersSectionNextButton = () => this.providersInProvidersSection().locator('div[class*="NextBtn"]');
    liveWinsHeader = () => this.page.locator("div[class*='LastBetsNavigation'] span");
    liveWinsButtons = () => this.page.locator("div[class*='LastBetsNavigation'] button");
    liveWinsCellOfTable = () => this.page.locator("div[class*='LastBetsHeaderStyled'] span");
    

    async clickOnFirstGameInNewSelection() {
        await this.gamesInNewSection().nth(0).click();
    }
}