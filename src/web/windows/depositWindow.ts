import { Page } from "@playwright/test"
export default class DepositWindow {

    constructor(public page: Page) {

    }

    // locators
    depositHeader = () => this.page.frameLocator('iframe[allow="clipboard-read; clipboard-write"]').locator("h1").getByText("Deposit");
    closeDepositWindowButton = () => this.page.frameLocator('iframe[allow="clipboard-read; clipboard-write"]').locator(".items-center button");

    autoCloseDepositWindow() {
        const interval = setInterval(() => {
            this.depositHeader().isVisible()
                .then(async (isVisible) => {
                    if (isVisible) {
                        await this.closeDepositWindowButton().click();
                        clearInterval(interval);
                    }
                })
                .catch(() => {
                });
        }, 30000);
    }
}