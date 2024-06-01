import { Page } from "@playwright/test"

export default class ProfilePageDeletePasswordWindow {

    constructor(public page: Page) {

    }

    // locators
    resetPassword = () => this.page.locator("button", {hasText: "Yes, reset"});
}