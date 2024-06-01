import { Page } from "@playwright/test"
export default class PopupBonusWindow {

    constructor(public page: Page) {

    }

    // locators
    popUpWindow = () => this.page.locator("div[class*='PopupBonusModal'][class*='DemoModalContainer']");
    popUpGetBonus = () => this.popUpWindow().locator('button');

    autoGetPopUpBonus() {
        const interval = setInterval(() => {
            this.popUpWindow().isVisible()
                .then(async (isVisible) => {
                    if (isVisible) {
                        await this.popUpGetBonus().click();
                        clearInterval(interval);
                    }
                })
                .catch(() => {
                });
        }, 10000);
    }

    async getPopUpBonus() {
        await this.popUpWindow().isVisible()
        await this.popUpGetBonus().click();

    }

}