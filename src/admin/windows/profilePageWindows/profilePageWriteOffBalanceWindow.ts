import { Page } from "@playwright/test"

export default class ProfilePageWriteOffBalanceWindow {

    constructor(public page: Page) {

    }

    // locators
    writeOffWindow = () => this.page.locator('[aria-labelledby="balance-change-modal"]');
    writeOffCurrency = () => this.writeOffWindow().locator('[aria-haspopup="listbox"]').nth(0);
    writeOffSum = () => this.writeOffWindow().locator("//label[text()='Sum']/following-sibling::div/input");
    writeOffType = () => this.writeOffWindow().locator('[aria-haspopup="listbox"]').nth(1);
    writeOffComment = () => this.writeOffWindow().locator('textarea').nth(0);
 
    writeOffCurrencyList = () => this.page.locator('ul[role="listbox"] li');
    writeOffAccrualList  = () => this.page.locator('ul[role="listbox"] li');

    applyButton = () => this.writeOffWindow().locator('button[type="submit"]');
    resetButton = () => this.writeOffWindow().locator('button', {hasText: "Reset"});
    
    alertsInWindows = () => this.writeOffWindow().locator('div[class*="MuiAlert-standardError"]');

    async setValueInCurrencyList(currency: string){
        await this.writeOffCurrency().click();
        await this.writeOffCurrencyList().getByText(currency).click();
    }

    async setNewValueInCurrencyList(oldCurrency: string[]){
        await this.writeOffCurrency().click();
        let newCurrency;
        for (let i = 0; i < oldCurrency.length; i++){
            newCurrency = await this.writeOffCurrencyList().nth(i).innerText();
            if (!oldCurrency.includes(newCurrency)){
                await this.writeOffCurrencyList().nth(i).click();
                break;
            }
        }
        return newCurrency;
    }

    async setValueInWriteOffList(typeOfAccrual: string){
        await this.writeOffType().click();
        await this.writeOffAccrualList().getByText(typeOfAccrual).click();
    }

    async setValueInWriteOffSum(sum: number){
        await this.writeOffSum().fill(sum.toString())
    }

    async setValueInComment(comment: string){
        await this.writeOffComment().fill(comment)
    }
}