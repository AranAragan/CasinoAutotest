import { Page } from "@playwright/test"

export default class DeleteOfferWindow{

    constructor(public page: Page) {

    }

    // locators
    window = () => this.page.locator('div[role="dialog"]');
    deleteButton = () => this.window().locator("button", {hasText:'Удалить'});

    
    async clickOnDeleteOfferButton() {
        await this.deleteButton().click();
    }
}