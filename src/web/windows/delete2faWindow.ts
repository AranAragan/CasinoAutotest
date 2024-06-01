import { Page } from "@playwright/test"

export default class Delete2faWindow {

    constructor(public page: Page) {
        this.page = page;
    }

    // locators
    deleteButton = () => this.page.locator("div[class*='two-factor-auth-delete-confirmation'] button", {hasText: 'Delete'});
}