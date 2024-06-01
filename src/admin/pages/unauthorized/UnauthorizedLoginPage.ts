import { Page } from "@playwright/test"
import UnauthorizedMainPage from "../basePages/unauthorizedMainPage";

export default class UnauthorizedLoginPage extends UnauthorizedMainPage {

    constructor(public page: Page) {
        super(page);
    }

    // Locators
    loginInput = () => this.page.locator("input[name='email']");
    passwordInput = () => this.page.locator("input[type='password']");
    loginButton = () => this.page.locator("button[type='submit']");

    async loginUser(email: string, password: string) {
        await this.enterLogin(email);
        await this.enterPassword(password);
        await this.submitLoginForm();
    }

    async enterLogin(email: string) {
        await this.loginInput().type(email);
    }

    async enterPassword(password: string) {
        await this.passwordInput().type(password);
    }

    async submitLoginForm() {
        await this.loginButton().click();
    }
}