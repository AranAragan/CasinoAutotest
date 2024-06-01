import { Page } from "@playwright/test"
import AuthorizedMainPage from "../basePages/authorizedMainPage";
import MainLeftSidebar from "../../sidebars/mainLeftSidebar";
import CreateAndEditOfferWindow from "../../windows/offersPageWindows/createAndEditOfferWindow";
import ActivateOfferWindow from "../../windows/offersPageWindows/activateOfferWindow";
import CancelOfferWindow from "../../windows/offersPageWindows/cancelOfferWindow";
import DeleteOfferWindow from "../../windows/offersPageWindows/deleteOfferWindow";

export default class AuthorizedOfferPage extends AuthorizedMainPage {
    mainLeftSidebar: MainLeftSidebar;
    createAndEditOfferWindow: CreateAndEditOfferWindow;
    activateOfferWindow: ActivateOfferWindow;
    cancelOfferWindow: CancelOfferWindow;
    deleteOfferWindow: DeleteOfferWindow;

    constructor(public page: Page) {
        super(page);
        this.mainLeftSidebar = new MainLeftSidebar(this.page);
        this.createAndEditOfferWindow = new CreateAndEditOfferWindow(this.page);
        this.activateOfferWindow = new ActivateOfferWindow(this.page);
        this.cancelOfferWindow = new CancelOfferWindow(this.page);
        this.deleteOfferWindow = new DeleteOfferWindow(this.page);
    }

    nameOfferTitle = () => this.page.locator(".MuiBox-root h4");
    backToOffersPageButton = () => this.page.locator('a[href="/offers"] div p');
    statusTitle = () => this.page.locator("div[class*='offer-status']");
    editButton = () => this.page.locator('button', { hasText: "Редактировать" });
    actionButton = () => this.page.locator('button', { hasText: "Действия" });
    actionList = () => this.page.locator("ul[role='menu'] li");
    actionListValues = () => this.actionList().locator('button');

    offerTabList = () => this.page.locator('[role="tablist"]');
    offerMenu = () => this.page.locator('li[role="menuitem"]');
    offerMenuDeleteButton = () => this.offerMenu().locator('button', {hasText: 'Удалить оффер'});
    offerParametersButton = () => this.offerTabList().locator('button', { hasText: 'Параметры оффера' });
    usersSegmentsButton = () => this.offerTabList().locator('button', { hasText: 'Сегменты пользователей' });
    offerWageringParametersButton = () => this.offerTabList().locator('button', { hasText: 'Параметры отыгрыша Оффера' });

    async backToOffersPage() {
        await this.backToOffersPageButton().click();
    }

    async openActionMenu() {
        await this.actionButton().click({force: true});
    }

    async closeActionMenu() {
        await this.actionButton().click();
    }

    async openEditMenu() {
        await this.editButton().click();
    }

    async deleteOffer() {
        await this.offerMenuDeleteButton().click();
        await this.deleteOfferWindow.clickOnDeleteOfferButton();
    }

    async changeOfferStatus(value: string) {
        await this.openActionMenu();
        await this.offerMenu().locator('button', { hasText: value }).click();
    }

    async activateOffer() {
        await this.activateOfferWindow.turnOnOffer();
    }

    async unactivateOffer() {
        await this.activateOfferWindow.turnOffOffer();
    }

    async startOffer() {
        await this.activateOfferWindow.startOffer();
    }

    async cancelOfferForInvalidValue(value: string) {
        await this.cancelOfferWindow.selectReasonOfCancelInvalidValue();
        await this.cancelOfferWindow.selectTextComment(value);
        await this.cancelOfferWindow.cancelOffer();
    }
}