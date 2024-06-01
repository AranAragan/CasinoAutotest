import { Page } from "@playwright/test"
import MainPage from "../../pages/basePages/mainPage";

export default class TopGamesTab extends MainPage {

    constructor(public page: Page) {
        super(page);
    }
    
    // Locators
    slotsHeaderValues = () => this.page.locator("div[class*='SlotsRowStyles'] span");
    sectionsWithGames = () => this.page.locator("div[class*='GameBox']");
    gamesInTopSection = () => this.sectionsWithGames().locator("div[class*='SlotBtnBox'] div[class*='SlotBtnContainer']");
    providersInProvidersSection = () => this.sectionsWithGames().nth(1).locator("div[class*='SlotBtnContainer']");
    liveWinsHeader = () => this.page.locator("div[class*='LastBetsNavigation'] span");
    liveWinsButtons = () => this.page.locator("div[class*='LastBetsNavigation'] button");
    liveWinsCellOfTable = () => this.page.locator("div[class*='LastBetsHeaderStyled'] span");
    gamesInTopSectionPrevButton = () => this.sectionsWithGames().nth(0).locator('div[class*="PrevBtn"]');
    gamesInTopSectionNextButton = () => this.sectionsWithGames().nth(0).locator('div[class*="NextBtn"]');
    providersSectionPrevButton = () => this.providersInProvidersSection().locator('div[class*="PrevBtn"]');
    providersSectionNextButton = () => this.providersInProvidersSection().locator('div[class*="NextBtn"]');

    async clickOnFirstGameInTopSelection() {
        await this.gamesInTopSection().nth(0).click();
    }
}