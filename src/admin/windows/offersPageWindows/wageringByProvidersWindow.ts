import { Page } from "@playwright/test"

export default class WageringByProvidersWindow{

    constructor(public page: Page) {

    }

    // locators
    wageringWindow = () => this.page.locator('div[role="dialog"]').nth(1);
    wageringWindowApplyButton = () => this.wageringWindow().locator("button[type='submit']");
    wageringWindowCancelButton = () => this.wageringWindow().locator("button", {hasText: "Назад"})
    addProviderButton = () => this.wageringWindow().locator("button", {hasText: "Добавить"});
    providerInput = () => this.page.locator("//label[text()='Провайдер']/following-sibling::div|//label[text()='Provider']/following-sibling::div");
    percentInput = () => this.page.locator("//label[text()='Процент, %']/following-sibling::div/input|//label[text()='Percent, %']/following-sibling::div/input");
    deleteIcon = () => this.wageringWindow().locator('[data-testid="DeleteIcon"]');

    async addValueInProviderInput(values: string, providerOrder = 1) {
        await this.providerInput().nth(providerOrder - 1).click();
        await this.page.locator('ul[role="listbox"] li', {hasText: values}).click();
    }

    async setValueInPercentInput(currency: string, providerOrder = 1){
        await this.percentInput().nth(providerOrder - 1).fill(currency);
    }

    async addProvider(){
        await this.addProviderButton().click();
    }

    async deleteProvider(providerOrder = 1){
        await this.deleteIcon().nth(providerOrder-1).click();
    }

    async applyWageringWindow(){
        await this.wageringWindowApplyButton().click();
    }

    async cancelChangesWageringWindow(){
        await this.wageringWindowCancelButton().click();
    }
}