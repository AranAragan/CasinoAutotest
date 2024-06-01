import { Page } from "@playwright/test"
import MainPage from "../pages/basePages/mainPage";

export default class TableBlock extends MainPage {

    constructor(public page: Page) {
        super(page);
    }

    // Locators
    userTable = () => this.page.locator("table[class*='MuiTable-root']");
    userTableBody = () => this.userTable().locator('tbody');
    userTableRows = () => this.userTableBody().locator('tr');
    thead = () => this.userTable().locator("thead");
    theadElements = () => this.thead().locator("th");

    findAllRowsInTable() {
        return this.userTableBody().locator('tr');
    }

    async findCountRowsInTable() {
        return await this.userTableBody().locator('tr').count();
    }

    findRowByOrder(order: number) {
        return this.userTableBody().locator('tr').nth(order);
    }

    getCheckBoxInRow(order: number) {
        return this.userTable().locator('tr').nth(order).locator("td input[type='checkbox']");
    }

    async clickCheckBoxInRow(order: number) {
        await (this.getCheckBoxInRow(order)).click();
    }

    async findValueInRowByNumberAndColumnHeader(order: number, columnHeader: string) {
        const cellElement = await this.findCellInRowByNumberAndColumnHeader(order, columnHeader);
        return await cellElement.innerText();
    }

    async findCellInRowByNumberAndColumnHeader(order: number, columnHeader: string) {
        let orderCell = -1;

        for (let i = 0; i < await this.theadElements().count(); i++) {
            if ((await this.theadElements().nth(i).innerText()).toLowerCase() === columnHeader.toLowerCase()) {
                orderCell = i;
                break;
            }
        }
        return this.userTableRows().nth(order - 1).locator('.MuiTableCell-sizeMedium').nth(orderCell);
    }

    async findOrderRowByValue(columnHeader: string, value: string) {
        let orderCell = -1;
        let orderRow = -1;

        for (let i = 0; i < await this.theadElements().count(); i++) {
            if ((await this.theadElements().nth(i).innerText()).toLowerCase() === columnHeader.toLowerCase()) {
                orderCell = i;
                break;
            }
        }

        for (let i = 0; i < await this.userTableRows().count(); i++) {
            if (await this.userTableRows().nth(i).locator('td').nth(orderCell).innerText() === value) {
                orderRow = i;
                break;
            }
        }
        if (isNaN(orderRow)) {
            orderRow = 0;
        }
        return orderRow;
    }

    async openProfileUserByOrder(order: number) {
        await this.userTableRows().nth(order).locator('td button').click();
    }

}