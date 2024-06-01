import { Page } from "@playwright/test";

export default class ActivateOfferWindowParameters {

    constructor(public page: Page) {
        this.page = page;
    }

    // locators tabs.parameters
    offerTypeInput = () => this.page.locator("//label[text()='Type']/following-sibling::div");
    offerTypeList = () => this.page.locator('ul[role="listbox"] li');
    offerNameInput = () => this.page.locator("//label[text()='Название оффера']/following-sibling::div/input|//label[text()='Offer name']/following-sibling::div/input");
    activationType = () => this.page.locator("//label[text()='Тип активации']/following-sibling::div|//label[text()='Activation type']/following-sibling::div");
    activationTypeList = () => this.page.locator('ul[role="listbox"] li');
    rewardCurrency = () => this.page.locator("//label[text()='Валюта вознаграждения']/following-sibling::div");
    rewardCurrencyList = () => this.page.locator('ul[role="listbox"] li');
    rewardType = () => this.page.locator("//label[text()='Тип вознаграждения']/following-sibling::div").nth(0);
    rewardTypeList = () => this.page.locator('ul[role="listbox"] li');
    rewardAmount = () => this.page.locator("//label[text()='Reward amount']/following-sibling::div/input|//label[text()='Размер вознаграждения']/following-sibling::div/input");
    minDeposit = () => this.page.locator("//label[text()='Min deposit']/following-sibling::div/input|//label[text()='Минимальный депозит']/following-sibling::div/input");
    maxDeposit = () => this.page.locator("//label[text()='Max deposit']/following-sibling::div/input|//label[text()='Максимальный депозит']/following-sibling::div/input");
    minCountDeposit = () => this.page.locator("//label[text()='Min deposits count']/following-sibling::div/input|//label[text()='Мин кол-во депозитов']/following-sibling::div/input");
    maxCountDeposit = () => this.page.locator("//label[text()='Max deposits count']/following-sibling::div/input|//label[text()='Макс кол-во депозитов']/following-sibling::div/input");
}