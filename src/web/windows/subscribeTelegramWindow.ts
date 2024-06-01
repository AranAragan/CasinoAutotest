import { Page } from "@playwright/test"
export default class SubscribeTelegramWindow {

    constructor(public page: Page) {
    }

    // locators
    modalWindow = () => this.page.locator(".modalContent");
    bonusHeader = () => this.modalWindow().locator(".bonusHeader");
    closeWindowButton = () => this.modalWindow().locator("button[class*='ModalContainerBtnClose']");
    submitWindowButton = () => this.modalWindow().locator("a button");
}