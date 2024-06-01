import { Page } from "@playwright/test"
import SubscribeTelegramWindow from "../../windows/subscribeTelegramWindow";
import AuthorizedMainPage from "../basePages/authorizedMainPage";
import MainLeftSidebar from "../../sidebars/mainLeftSidebar";


export default class AuthorizedMyBonusesPage extends AuthorizedMainPage {
    subscribeTelegramWindow: SubscribeTelegramWindow;
    mainLeftSidebar: MainLeftSidebar;

    constructor(public page: Page) {
        super(page);
        this.subscribeTelegramWindow = new SubscribeTelegramWindow(this.page);
        this.mainLeftSidebar = new MainLeftSidebar(this.page);
    }

    bonusWheel = () => this.page.locator("#bonusWheel");
    activeBonus = () => this.page.locator("//span[text()='Активные бонусы']/following-sibling::div[1]|//span[text()='Active Bonuses']/following-sibling::div[1]")
    availableBonus = () => this.page.locator("//span[text()='Доступные бонусы']/following-sibling::div[1]|//span[text()='Available Bonuses']/following-sibling::div[1]")
    finishedBonus = () => this.page.locator("//span[text()='Завершённые бонусы']/following-sibling::div[1]|//span[text()='Finished Bonuses']/following-sibling::div[1]")
    cardsContainer = () => this.page.locator("div[class*='OfferCardsContainer']").nth(1);
    instagramContainer = () => this.cardsContainer().locator("//span[contains(text(),'Instagram')]/../..");
    instagramContainerButton = () => this.instagramContainer().locator("button");
    telegramContainer = () => this.cardsContainer().locator("//span[contains(text(),'Telegram')]/../..");
    telegramContainerButton = () => this.telegramContainer().locator("button");
    wheelOfFortuneContainer = () => this.cardsContainer().locator("//span[contains(text(),'WHEEL OF FORTUNE')]/../..");
    wheelOfFortuneContainerButton = () => this.wheelOfFortuneContainer().locator("button");
    currentActiveBonus = (id: string) => this.activeBonus().locator('span', {hasText: id});
    currentAvailableBonus = (id: string) => this.availableBonus().locator('span', {hasText: id});
    currentAvailableBonusButton = (id: string) => this.availableBonus().locator(`//span[text()='${id}']/../..//button`);
    currentFinishedBonus = (id: string) => this.finishedBonus().locator('span', {hasText: id})
    currentFinishedBonusButton = (id: string) => this.finishedBonus().locator(`//span[text()='${id}']/../..//button`);
    currencyVoucherBonus = () => this.page.locator("[class*='CurrencyVoucherBonus'] span").nth(0);

    async getBonus(bonusName: string) {
        await this.currentFinishedBonusButton(bonusName).click();
    }

    async claimBonus(bonusName: string) {
        await this.currentAvailableBonusButton(bonusName).click();
    }
}