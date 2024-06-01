import { Page } from "@playwright/test"
import TableBlock from "../../blocks/tableBlock";
import FilterBlock from "../../blocks/filterBlock";
import MainPage from "../../pages/basePages/mainPage";

export default class AdminActionsTab extends MainPage {
    filterBlock: FilterBlock;
    tableBlock: TableBlock;

    constructor(public page: Page) {
        super(page);
        this.filterBlock = new FilterBlock(this.page);
        this.tableBlock = new TableBlock(this.page);
    }
    
}