import { Page } from "@playwright/test"

export default class WithdrawalWindow {

    constructor(public page: Page) {

    }

    // locators
    window = () => this.page.locator("[class='modalContent']");
    closeButton = () => this.window().locator("button[class*='ModalContainerBtnClose']");
    title = () => this.window().locator(" div[class*='ModalContainerTitle']");
}