import { Page } from "@playwright/test"
export default class LiveWinsUserWindow {

    constructor(public page: Page) {

    }

    modalWindow = () => this.page.locator('div[class="m_profile"]');
    userLogin = () => this.modalWindow().locator("div[class*='ProfileUserName']");
    closeModalWindow = () => this.page.locator("button[class*='ModalContainerBtnClose']");
}