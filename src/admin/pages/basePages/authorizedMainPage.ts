import { Page } from "@playwright/test"
import MainPage from "./mainPage";

export default class AuthorizedMainPage extends MainPage {

    constructor(public page: Page) {
        super(page);
    }

    // Locators
    navigationMenuButton = () => this.page.locator("button[class*='MuiBox-root']");
    navigationMenuLogout = () => this.page.locator("//button[text()='Logout']|//button[text()='Выйти']");
    languageMenuButton = () => this.page.locator("button[aria-label='Language']");
    langMenuList = () => this.page.locator("li[role='menuitem'] h6");

    async logout() {
        await this.navigationMenuButton().click();
        await this. navigationMenuLogout().click();
    }

    async selectLanguage(country: string) {
        await this.languageMenuButton().click();
        await this.langMenuList()
            .getByText(country).click();
    }
}