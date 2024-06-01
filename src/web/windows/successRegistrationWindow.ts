import { Page } from "@playwright/test"

export default class SuccessRegistrationWindow {

    constructor(public page: Page) {
    }

    // locators
    successRegistrationWindow = () => this.page.locator("div[class='modalContent']");
    closeButton = () => this.page.locator("button[class*='ModalContainerBtnClose']");
    loginUser = () => this.page.locator("div[class*='CompletionRegisterData'] span ").nth(0);
    passwordUser = () => this.page.locator("div[class*='CompletionRegisterData'] span ").nth(1);
    topUpButton = () => this.page.locator("button[class*='CompletionRegistrationButton']");
}