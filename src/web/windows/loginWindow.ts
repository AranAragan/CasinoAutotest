import { Page } from "@playwright/test"
export default class LoginWindow {

    constructor(public page: Page) {

    }

    // locators
    root = () => this.page.locator('div[role="dialog"]');
    emailOrLoginInput = () => this.root().locator("input[name='username']");
    passwordInput = () => this.root().locator("input[name='password']");
    submitFormButton = () => this.root().locator("button[type='submit']");
    closeButton = () => this.root().locator("button[class*='ModalContainerBtnClose']");
    windowLocator = () => this.root().locator("//div[@class = 'modalContent']/ancestor::div[contains(@class,'ModalContainerContent')]");
    twoFactorInput = () => this.root().locator('[inputmode="numeric"]');

    async loginUser(email: string, password: string) {
        await this.enterEmailOrLogin(email);
        await this.enterPassword(password);
        await this.submitLoginForm();
    }

    async twoFactorInputFill(code: string) {
        for(let i = 0; i < code.length; i++) {
            await this.twoFactorInput().nth(i).type(code[i]);
        }
    }

    async enterEmailOrLogin(email: string) {
        await this.emailOrLoginInput().fill(email);
    }

    async enterPassword(password: string) {
        await this.passwordInput().fill(password);
    }

    async submitLoginForm() {
        await this.submitFormButton().click();
    }

    async closeLoginWindow() {
        await this.closeButton().click();
    }
}