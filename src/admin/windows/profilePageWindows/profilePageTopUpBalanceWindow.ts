import { Page } from "@playwright/test"

export default class profilePageTopUpBalanceWindow {

    constructor(public page: Page) {

    }

    // locators
    depositWindow = () => this.page.locator('[aria-labelledby="balance-change-modal"]');
    depositCurrency = () => this.depositWindow().locator('[aria-haspopup="listbox"]').nth(0);
    depositSum = () => this.depositWindow().locator("//label[text()='Sum']/following-sibling::div/input");
    depositTypeOfAccrual = () => this.depositWindow().locator('[aria-haspopup="listbox"]').nth(1);
    depositComment = () => this.depositWindow().locator('textarea').nth(0);
 
    depositCurrencyList = () => this.page.locator('ul[role="listbox"] li');
    depositTypeOfAccrualList  = () => this.page.locator('ul[role="listbox"] li');

    applyButton = () => this.depositWindow().locator('button[type="submit"]');
    resetButton = () => this.depositWindow().locator('button', {hasText: "Reset"});
    
    alertsInWindows = () => this.depositWindow().locator('div[class*="MuiAlert-standardError"]');

    async setValueInCurrencyList(currency: string){
        await this.depositCurrency().click();
        await this.depositCurrencyList().getByText(currency).click();
    }

    async setValueInTypeOfAccrualList(typeOfAccrual: string){
        await this.depositTypeOfAccrual().click();
        await this.depositTypeOfAccrualList().getByText(typeOfAccrual).click();
    }

    async addNewCurrency(oldCurrency: string[]){
        await this.depositCurrency().click();
        let newCurrency;
        for (let i = 0; i < oldCurrency.length; i++){
            newCurrency = await this.depositCurrencyList().nth(i).innerText();
            if (!oldCurrency.includes(newCurrency)){
                await this.depositCurrencyList().nth(i).click();
                break;
            }
        }
        return newCurrency;
    }

    async setValueInDepositSum(sum: number){
        await this.depositSum().fill(sum.toString())
    }

    async setValueInComment(comment: string){
        await this.depositComment().fill(comment)
    }
}