import { Page } from "@playwright/test"
import AuthorizedMainPage from "../basePages/authorizedMainPage";
import MainLeftSidebar from "../../sidebars/mainLeftSidebar";
import FilterBlock from "../../blocks/filterBlock";
import TableBlock from "../../blocks/tableBlock";

export default class AuthorizedUsersPage extends AuthorizedMainPage {
    mainLeftSidebar: MainLeftSidebar;
    filterBlock: FilterBlock;
    tableBlock: TableBlock;

    constructor(public page: Page) {
        super(page);
        this.mainLeftSidebar = new MainLeftSidebar(this.page);
        this.filterBlock = new FilterBlock(this.page);
        this.tableBlock = new TableBlock(this.page);
    }

}