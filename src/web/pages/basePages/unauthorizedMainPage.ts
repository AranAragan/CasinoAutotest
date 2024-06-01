import { Page, expect } from "@playwright/test"
import RegisterWindow from "../../windows/registerWindow";
import LoginWindow from "../../windows/loginWindow";
import MainPage from "./mainPage";

export default class UnauthorizedMainPage extends MainPage {
    loginWindow: LoginWindow;
    registerWindow: RegisterWindow;

    constructor(public page: Page) {
        super(page);
        this.loginWindow = new LoginWindow(page);
        this.registerWindow = new RegisterWindow(this.page);
    }

    // locators
    registerButton = () => this.page.locator("button[class*='registerButton']");
    registerButtonInChat = () => this.page.locator("div[class*='SendMessage'] button");
    loginButton = () => this.page.locator("button[class*='AuthButton']:not([class*='registerButton'])");
    

    async clickOnRegistrationButton() {
        await this.registerButton().click();
    }

    async clickOnRegistrationButtonInChat() {
        await this.registerButtonInChat().click();
    }

    async clickOnLoginButton() {
        await this.loginButton().click();
    }

    async closeRegisterWindow() {
        await this.registerWindow.closeRegisterWindow();
    }

    async closeLoginWindow() {
        await this.loginWindow.closeLoginWindow()
    }

    async registerNewUser(email: string, phoneNumber: string, password: string, currency? : string) {
        await this.registerWindow.registerNewUser(email, phoneNumber, password, currency);
    }

    async loginUser(email: string, password: string) {
        await this.clickOnLoginButton();
        await this.loginWindow.loginUser(email, password);
    }

    async enter2Fa(code: string) {
        await this.loginWindow.twoFactorInputFill(code);
    }

    async waitForRegisteredWindowEnabled() {
        await expect(this.registerWindow.windowLocator()).toBeVisible({ timeout: 50000 });
    }


}