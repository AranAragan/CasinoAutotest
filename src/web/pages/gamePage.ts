import { Page, expect } from "@playwright/test"
import MainPage from "./basePages/mainPage";

export default class GamePage extends MainPage {

    constructor(public page: Page) {
        super(page);
    }

    // locators
    gameFrame = () => this.page.locator("iframe[class='gameFrame']");
    gameFrameFrameLocator = () => this.page.frameLocator("iframe[class='gameFrame']");
    gameWithoutFrame = () => this.page.locator('[class*="game__Game"]');
    gameWithoutFrameTypeTwo = () => this.page.locator('[class*="GameBlockStyled"]');
    loginLabel = () => this.page.locator("div[class*='SlotGameContainer'] p");

    gameMainLink = () => this.page.locator("a[aria-current='page'][href='/']").nth(0);
    gameAllGamesLink = () => this.page.locator("a[aria-current='page'][href='/']").nth(1);
    gameSlotsLink = () => this.page.locator("a[href*='/slots?scroll=SLOTS']");
}