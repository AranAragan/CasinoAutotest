import { Page } from "@playwright/test"

export default class CancelOfferWindow{
    constructor(public page: Page) {

    }

    // locators
    window = () => this.page.locator('div[role="dialog"]');
    cancelOfferWindowButton = () => this.window().locator("button", {hasText:'Отменить оффер'});
    cancelActionButton = () => this.window().locator("button", {hasText:'Отмена'});
    reasonOfCancelOffer = () => this.window().locator('//label[text()="Причина отмены оффера"]/following-sibling::div');
    textArea = () => this.window().locator('textarea').nth(0);

    offerInvalidValue = () => this.page.locator('[data-value="OFFER_INVALID"]');
    offerChangeValue = () => this.page.locator('[data-value="OFFER_NOT_NEEDED"]');
    offerOtherValue = () => this.page.locator('[data-value="OTHER"]');

    async selectReasonOfCancelInvalidValue() {
        await this.reasonOfCancelOffer().click();
        await this.offerInvalidValue().click();
    }

    async selectReasonOfCancelChangeValue() {
        await this.offerChangeValue().click();
        await this.offerInvalidValue().click();
    }

    async selectReasonOfCancelOtherValue() {
        await this.offerOtherValue().click();
        await this.offerInvalidValue().click();
    }

    async selectTextComment(comment: string) {
        await this.textArea().fill(comment);
    }

    async cancelOffer() {
        await this.cancelOfferWindowButton().click();
        await this.cancelOfferWindowButton().nth(1).click();
    }

    async closeCancelWindowOffer() {
        await this.cancelActionButton().click();
    }
}