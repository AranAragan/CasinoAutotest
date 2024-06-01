import { Page } from "@playwright/test";

export default class ActivateOfferWindowWagerParams {

    constructor(public page: Page) {
        this.page = page;
    }

     // locators tabs.wager-params
     wagerAmountMultiplier = () => this.page.locator("//label[text()='Мультипликатор суммы отыгрыша']/following-sibling::div/input|//label[text()='Wager amount multiplier']/following-sibling::div/input");
     wagerPeriodInDays = () => this.page.locator("//label[text()='Период отыгрыша в днях']/following-sibling::div/input|//label[text()='Wager period in days']/following-sibling::div/input");
     wageringByProviders = () => this.page.locator("//label[text()='Отыгрыш по провайдерам']/following-sibling::div/button|//label[text()='Wagering by providers']/following-sibling::div/button");
     wageringBySlots = () => this.page.locator("//label[text()='Отыгрыш по слотам']/following-sibling::div/button|//label[text()='Wagering by slots']/following-sibling::div/button");
     wageringCheckbox = () => this.page.locator("//span[text()='Начислять сразу']|//span[text()='Charge immediately']");
}