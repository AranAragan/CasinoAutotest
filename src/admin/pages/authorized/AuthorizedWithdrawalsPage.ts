import { Page } from "@playwright/test"
import AuthorizedMainPage from "../basePages/authorizedMainPage";
import MainLeftSidebar from "../../sidebars/mainLeftSidebar";
import FilterBlock from "../../blocks/filterBlock";
import TableBlock from "../../blocks/tableBlock";

export default class AuthorizedWithdrawalsPage extends AuthorizedMainPage {
    mainLeftSidebar: MainLeftSidebar;
    filterBlock: FilterBlock;
    tableBlock: TableBlock;

    constructor(public page: Page) {
        super(page);
        this.mainLeftSidebar = new MainLeftSidebar(this.page);
        this.filterBlock = new FilterBlock(this.page);
        this.tableBlock = new TableBlock(this.page);
    }

    withdrawalsTab = () => this.page.locator("//div[contains(text(),'Withdraw request')]/..|//div[contains(text(),'Запросы на вывод')]/..");
    withdrawHistoryTab = () => this.page.locator("//a[contains(text(),'Withdraw history')]|//a[contains(text(),'История вывода средств')]");

    async openWithdrawalsTab(){
        await this.withdrawalsTab().click();
    }

    async openWithdrawHistoryTab(){
        await this.withdrawHistoryTab().click();
    }
}