import { Page } from "@playwright/test"
import MainPage from "../../pages/basePages/mainPage";

export default class AllGamesTab extends MainPage {

    constructor(public page: Page) {
        super(page);
    }
    
    // Locators
    slotsHeaderValues = () => this.page.locator("div[class*='SlotsRowStyles'] span");
    sectionsWithGames = () => this.page.locator("section[class*='SlotsBox']");
    gamesInOriginalGamesSection = () => this.sectionsWithGames().nth(0).locator("div[class*='SlotBtnContainer']");
    gamesInOriginalGamesSecrionPrevButton = () => this.gamesInOriginalGamesSection().locator('div[class*="PrevBtn"]');
    gamesInOriginalGamesSecrionNextButton = () => this.gamesInOriginalGamesSection().locator('div[class*="NextBtn"]');
    gamesInTopSection = () => this.sectionsWithGames().nth(1).locator("div[class*='SlotBtnContainer']");
    gamesInTopSectionPrevButton = () => this.gamesInTopSection().locator('div[class*="PrevBtn"]');
    gamesInTopSectionNextButton = () => this.gamesInTopSection().locator('div[class*="NextBtn"]');
    gamesInNewSection = () => this.sectionsWithGames().nth(2).locator("div[class*='SlotBtnContainer']");
    gamesInNewSectionPrevButton = () => this.gamesInNewSection().locator('div[class*="PrevBtn"]');
    gamesInNewSectionNextButton = () => this.gamesInNewSection().locator('div[class*="NextBtn"]');
    providersInProvidersSection = () => this.sectionsWithGames().nth(3).locator("div[class*='SlotBtnContainer']");
    providersSectionPrevButton = () => this.providersInProvidersSection().locator('div[class*="PrevBtn"]');
    providersSectionNextButton = () => this.providersInProvidersSection().locator('div[class*="NextBtn"]');

    jackpotGame = () => this.sectionsWithGames().locator("div[class*='SlotBtnContainer'] [data-src='https://icons.tivitbet.app/io_jackpot.jpeg']");
  
    async clickOnFirstGameInOriginalGames() {
        await this.gamesInOriginalGamesSection().nth(0).click();
    }

    async clickOnFirstGameInTopSelection() {
        await this.gamesInTopSection().nth(0).click();
    }

    async clickOnFirstGameInNewSelection() {
        await this.gamesInNewSection().nth(0).click();
    }

    async openJackpotGame(){
        await this.jackpotGame().click();
    }
}