import { Page } from "@playwright/test"
import MainPage from "../../pages/basePages/mainPage";
import TableBlock from "../../blocks/tableBlock";
import FilterBlock from "../../blocks/filterBlock";

export default class SportsBidsTab extends MainPage {
    filterBlock: FilterBlock;
    tableBlock: TableBlock;

    constructor(public page: Page) {
        super(page);
        this.filterBlock = new FilterBlock(this.page);
        this.tableBlock = new TableBlock(this.page);
    }
    
}