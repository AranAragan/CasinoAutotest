import { Page } from "@playwright/test"
import MainPage from "./mainPage";

export default class UnauthorizedMainPage extends MainPage {

    constructor(public page: Page) {
        super(page);
    }
}