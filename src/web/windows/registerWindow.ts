import { Page } from "@playwright/test"
export default class RegisterWindow {

    constructor(public page: Page) {
    }

    // locators
    windowLocator = () => this.page.locator("//div[@class = 'modalContent']/ancestor::div[contains(@class,'ModalContainerContent')]")
    windowLocatorBanner = () => this.page.locator("//div[@class = 'modalContent']/preceding-sibling::div[contains(@class, 'RegisterBannerContainer')]");
    currencyTypeInput = () => this.windowLocator().locator("div[class*='SelectCurrencyStyles']").nth(0);
    currencyListValue = (currency: string) => this.page.locator("div[class*='Select__menu'] [role='option']", {hasText: new RegExp(currency)})
    emailInput = () => this.windowLocator().locator("input[name='email']");
    phoneInput = () => this.windowLocator().locator("input[type='tel']");
    passwordInput = () => this.windowLocator().locator("input[type='password']");
    submitFormButton = () => this.windowLocator().locator("button[type='submit']");
    closeButton = () => this.page.locator("button[class*='ModalContainerBtnClose']");
    confirmCheckbox = () => this.windowLocator().locator("[name='isGoing']");
    bannerLocator = () => this.page.locator("div[class*='RegisterBannerContainer']");

    async registerNewUser(email: string, phoneNumber: string, password: string, currency?: string) {
        if (currency) {
            await this.currencyTypeInput().click();
            await this.currencyListValue(currency).click();
        }
        await this.enterEmail(email);
        await this.enterPhoneNumber(phoneNumber);
        await this.enterPassword(password)
        await this.clickOnCheckBoxConfirmedCheck();
        await this.submitRegistrationForm();
    }

    async enterEmail(email: string) {
        await this.emailInput().fill(email);
    }

    async enterPhoneNumber(phoneNumber: string) {
        await this.phoneInput().fill(phoneNumber);
    }

    async enterPassword(password: string) {
        await this.passwordInput().fill(password);
    }

    async isConfirmChecked() {
        return await this.confirmCheckbox().isChecked();
    }

    async submitRegistrationForm() {
        await this.submitFormButton().click();
    }

    async closeRegisterWindow() {
        await this.closeButton().click();
    }

    async clickOnCheckBoxConfirmedCheck() {
        if (!this.isConfirmChecked) {
            await this.confirmCheckbox().click();
        }
    }
}