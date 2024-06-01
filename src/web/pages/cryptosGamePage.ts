import { Page } from "@playwright/test";
import GamePage from "./gamePage";

export default class CryptosGamePage extends GamePage {

    constructor(public page: Page) {
        super(page);
    }

    // locators
    betInput = () => this.gameFrameFrameLocator().locator('input[inputmode="decimal"]')
    betButton = () => this.gameFrameFrameLocator().locator('//h3/../../button');

    async placeBet(value: string){
        await this.page.waitForTimeout(2000);
        await this.betInput().fill(value);
        await this.betButton().click({force: true});
        await this.page.waitForTimeout(3000);
    }
}