import { Page } from "@playwright/test"
import AuthorizedMainPage from "../basePages/authorizedMainPage";
import MainLeftSidebar from "../../sidebars/mainLeftSidebar";
import DeleteOfferWindow from "../../windows/offersPageWindows/deleteOfferWindow";
import TableBlock from "../../blocks/tableBlock";
import CreateAndEditOfferWindow from "../../windows/offersPageWindows/createAndEditOfferWindow";

export default class AuthorizedOffersPage extends AuthorizedMainPage {
    mainLeftSidebar: MainLeftSidebar;
    tableBlock: TableBlock;
    createAndEditOfferWindow: CreateAndEditOfferWindow;
    deleteOfferWindow: DeleteOfferWindow;

    constructor(public page: Page) {
        super(page);
        this.mainLeftSidebar = new MainLeftSidebar(this.page);
        this.tableBlock = new TableBlock(this.page);
        this.createAndEditOfferWindow = new CreateAndEditOfferWindow(this.page);
        this.deleteOfferWindow = new DeleteOfferWindow(this.page);
    }

    selectAllCheckbox = () => this.page.locator("//span[text()='Select all']|//span[text()='Выбрать все']");
    createButton = () => this.page.locator("//button[text()='Create']|//button[text()='Создать']");
    paginator = () => this.page.locator('[aria-haspopup="listbox"]');
    paginatorList = () => this.page.locator('ul[role="listbox"]');
    paginatorNextButton = () => this.page.locator('button[title="Go to next page"]');
    paginatorPrevButton = () => this.page.locator('button[title="Go to previous page"]');
    paginatorNextButtonBlocked = () => this.page.locator('.Mui-disabled[title="Go to next page"]');
    paginatorPrevButtonBlocked = () => this.page.locator('.Mui-disabled[title="Go to previous page"]');

    async changePaginatorValue(number: number){
        await this.paginator().click();
        await this.paginatorList().locator('li', {hasText: number.toString()}).click();
    }

    async openCreateOfferWindow(){
        await this.createButton().click();
    }

    async openOffer(number: number){
        await (this.tableBlock.findRowByOrder(number)).click();
    }

    async deleteOffer(number: number){
        await (this.tableBlock.findRowByOrder(number)).locator('[data-testid="DeleteIcon"]').click();
        await this.deleteOfferWindow.clickOnDeleteOfferButton();
    }
}