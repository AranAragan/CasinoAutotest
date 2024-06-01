import { Page } from "@playwright/test"

export default class MainLeftSidebar {
    constructor(public page: Page) {
        this.page = page;
    }

    // Locators
    leftSideBarContent = () => this.page.locator("div[data-simplebar='init']");
    leftSideBarUsersPage = () => this.leftSideBarContent().locator("//span[text()='Пользователи']|//span[text()='Users']");
    leftSideBarWithdrawalsPage = () => this.leftSideBarContent().locator("//div[contains(text(),'Withdrawals')]/..|//div[contains(text(),'Выводы')]/..");
    leftSideBarOffersPage = () => this.leftSideBarContent().locator("//span[contains(text(),'Offers')]/..|//span[contains(text(),'Офферы')]/..");

    async openUsersPage() {
        await this.leftSideBarUsersPage().click();
    }

    async openWithdrawalsPage() {
        await this.leftSideBarWithdrawalsPage().click();
    }

    async openOffersPage() {
        await this.leftSideBarOffersPage().click();
    }
}