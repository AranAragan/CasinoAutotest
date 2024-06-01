import { Page } from "@playwright/test"

export default class ActivateOfferWindow {

    constructor(public page: Page) {

    }

    // locators
    window = () => this.page.locator('div[role="dialog"]');
    activateOfferWindowApply = () => this.window().locator("button", { hasText: 'Включить оффер' });
    turnOffOfferWindowApply = () => this.window().locator("button", { hasText: 'Выключить оффер' });
    startOfferWindowApply = () => this.window().locator("button", { hasText: 'Запуск оффера' });

    async turnOnOffer() {
        await this.activateOfferWindowApply().click();
    }

    async startOffer() {
        await this.startOfferWindowApply().click();
    }

    async turnOffOffer() {
        await this.turnOffOfferWindowApply().click();
    }
}