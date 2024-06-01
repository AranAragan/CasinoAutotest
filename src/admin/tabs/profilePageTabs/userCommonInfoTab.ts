import { Page } from "@playwright/test"
import MainPage from "../../pages/basePages/mainPage";
import ProfilePageDeletePasswordWindow from "../../windows/profilePageWindows/profilePageDeletePasswordWindow";
import ProfilePageTopUpBalanceWindow from "../../windows/profilePageWindows/profilePageTopUpBalanceWindow";
import ProfilePageWriteOffBalanceWindow from "../../windows/profilePageWindows/profilePageWriteOffBalanceWindow";


export default class UserCommonInfoTab extends MainPage {
    profilePageDeletePasswordWindow: ProfilePageDeletePasswordWindow;
    profilePageTopUpBalanceWindow: ProfilePageTopUpBalanceWindow;
    profilePageWriteOffBalanceWindow: ProfilePageWriteOffBalanceWindow;


    constructor(public page: Page) {
        super(page);
        this.profilePageDeletePasswordWindow = new ProfilePageDeletePasswordWindow(this.page);
        this.profilePageTopUpBalanceWindow = new ProfilePageTopUpBalanceWindow(this.page);
        this.profilePageWriteOffBalanceWindow = new ProfilePageWriteOffBalanceWindow(this.page);
    }

    // Locators
    detailsModule = () => this.page.locator("div[class*='MuiCard-root details-card']");
    detailsTabList = () => this.detailsModule().locator("div[role='tablist']");
    detailsBasicStatusButton = () => this.detailsModule().locator("div[role='button']");
    detailsBasicStatusListbox = () => this.page.locator("ul[role='listbox']");
    detailsBasicEditNameButton = () => this.detailsModule().locator("//div[text()='Nickname']/following-sibling::div//button")
    detailsBasicEditNameInput = () => this.detailsModule().locator("//div[text()='Nickname']/following-sibling::div//input");
    detailsBasicEditTelegramButton = () => this.detailsModule().locator("//div[text()='Telegram ID']/following-sibling::div//button")
    detailsBasicEditTelegramInput = () => this.detailsModule().locator("//div[text()='Telegram ID']/following-sibling::div//input");

    mainContainerRoleButton = () => this.page.locator("//label[text()='Role']/following-sibling::div/div[@role='button']");
    mainContainerRoleListbox = () => this.page.locator("ul[role='listbox']");
    mainContainerTagsButton = () => this.page.locator("//label[text()='Tags']/following-sibling::div/div[@role='button']");
    mainContainerTagsListbox = () => this.page.locator("ul[role='listbox']");
    mainContainerTagsCheckedButton = () => this.mainContainerTagsListbox().locator("li span[class*='Mui-checked']");
    mainContainerAccountStatusButton = () => this.page.locator("//label[text()='Account status']/following-sibling::div/div[@role='button']");
    mainContainerAccountStatusListbox = () => this.page.locator("ul[role='listbox']");
    mainContainerEditPhoneButton = () => this.page.locator("//label[text()='Phone']/following-sibling::div//button")
    mainContainerEditPhoneInput = () => this.page.locator("//label[text()='Phone']/following-sibling::div//input");
    mainContainerEditEmailButton = () => this.page.locator("//label[text()='E-mail']/following-sibling::div//button")
    mainContainerEditEmailInput = () => this.page.locator("//label[text()='E-mail']/following-sibling::div//input");
    mainContainerEditPasswordButton = () => this.page.locator("//label[text()='Password']/following-sibling::div//button")
    mainContainerEditPasswordInput = () => this.page.locator("//label[text()='Password']/following-sibling::div//input");
    mainContainerEditMaxBetButton = () => this.page.locator("//label[text()='Max bet']/following-sibling::div//button")
    mainContainerEditMaxBetInput = () => this.page.locator("//label[text()='Max bet']/following-sibling::div//input");

    balanceBlock = () => this.page.locator("div[class*='balance-card']");
    balanceListButton = () => this.balanceBlock().locator("div[aria-haspopup='listbox']");
    balanceList = () => this.page.locator('ul[role="listbox"] li');

    topUpButton = () => this.balanceBlock().locator('button', { hasText: "Top up" });
    writeOffButton = () => this.balanceBlock().locator('button', { hasText: "Write off" });

    async openTabInDetails(tab: string) {
        await this.detailsTabList().locator('a', { hasText: tab }).click();
    }

    async openOrClosedBalanceList() {
        await this.balanceListButton().click();
    }

    async getValuesInBalanceList() {
        await this.openOrClosedBalanceList();
        const values: string[] = [];
        const count = await this.balanceList().count();
        for (let i = 0; i < count; i++) {
            values.push(await this.balanceList().nth(i).locator('h6').nth(0).innerText());
        }
        await this.page.keyboard.press("Escape");
        return values;
    }

    async getCurrencyBalanceInBalanceList(currency: string) {
        await this.openOrClosedBalanceList();
        let value = 0.0;
        const count = await this.balanceList().count();
        for (let i = 0; i < count; i++) {
            if (await this.balanceList().nth(i).locator('h6').nth(0).innerText() == currency) {
                value = parseFloat(await this.balanceList().nth(i).locator('h6').nth(2).innerText());
                break;
            }
        }
        await this.page.keyboard.press("Escape");
        return value;
    }

    async topUpBalance(value: string, sum: number, typeOfAccrual: string, comment: string){
        await this.topUpButton().click();
        await this.profilePageTopUpBalanceWindow.setValueInCurrencyList(value);
        await this.profilePageTopUpBalanceWindow.setValueInDepositSum(sum);
        await this.profilePageTopUpBalanceWindow.setValueInTypeOfAccrualList(typeOfAccrual);
        await this.profilePageTopUpBalanceWindow.setValueInComment(comment);
        await this.profilePageTopUpBalanceWindow.applyButton().click();
    }

    async topUpBalanceWithNewCurrency(currencies: string[], sum: number, typeOfAccrual: string, comment: string){
        await this.topUpButton().click();
        const newCurrency = await this.profilePageTopUpBalanceWindow.addNewCurrency(currencies);
        await this.profilePageTopUpBalanceWindow.setValueInDepositSum(sum);
        await this.profilePageTopUpBalanceWindow.setValueInTypeOfAccrualList(typeOfAccrual);
        await this.profilePageTopUpBalanceWindow.setValueInComment(comment);
        await this.profilePageTopUpBalanceWindow.applyButton().click();
        return newCurrency;
    }

    async writeOffBalance(value: string, sum: number, typeOfWriteOff: string, comment: string){
        await this.writeOffButton().click();
        await this.profilePageWriteOffBalanceWindow.setValueInCurrencyList(value)
        await this.profilePageWriteOffBalanceWindow.setValueInWriteOffSum(sum);
        await this.profilePageWriteOffBalanceWindow.setValueInWriteOffList(typeOfWriteOff);
        await this.profilePageWriteOffBalanceWindow.setValueInComment(comment);
        await this.profilePageWriteOffBalanceWindow.applyButton().click();
    }

    async setValueInStatusListboxInDetailsModule(value: string) {
        await this.detailsBasicStatusButton().click();
        await this.detailsBasicStatusListbox().locator("//div[text()='" + value + "']").click();
    }

    async changeNicknameInDetailsModule(value: string) {
        await this.detailsBasicEditNameButton().click();
        await this.detailsBasicEditNameInput().clear();
        await this.detailsBasicEditNameInput().fill(value);
        await this.detailsBasicEditNameButton().nth(0).click();
    }

    async changeTelegramInDetailsModule(value: string) {
        await this.detailsBasicEditTelegramButton().click();
        await this.detailsBasicEditTelegramInput().clear();
        await this.detailsBasicEditTelegramInput().fill(value);
        await this.detailsBasicEditTelegramButton().nth(0).click();
    }

    async setValueInMainContainerRoleListbox(value: string) {
        await this.mainContainerRoleButton().click();
        await this.mainContainerRoleListbox().locator("//li[text()='" + value + "']").click();
    }

    async deleteValueInMainContainerTagsListbox() {
        await this.mainContainerTagsButton().click();
        const checkedElements = await this.mainContainerTagsCheckedButton().count();
        for (let i = 0; i < checkedElements; i++) {
            await this.mainContainerTagsCheckedButton().nth(i).click();
        }
        await this.page.keyboard.press("Escape")
    }

    async setValueInMainContainerTagsListbox(value: string[]) {
        await this.mainContainerTagsButton().click();
        for (let i = 0; i < value.length; i++) {
            await this.mainContainerTagsListbox().locator('li', { hasText: value[i] }).click();
        }
        await this.page.keyboard.press("Escape")
    }

    async setValueInMainContainerAccountStatusListbox(value: string) {
        await this.mainContainerAccountStatusButton().click();
        await this.page.waitForLoadState();
        await this.mainContainerAccountStatusListbox().locator('li', { hasText: value }).click();
    }

    async setValueInMainContainerPhoneInput(value: string) {
        await this.mainContainerEditPhoneButton().click();
        await this.mainContainerEditPhoneInput().clear();
        await this.mainContainerEditPhoneInput().fill(value);
        await this.mainContainerEditPhoneButton().nth(0).click();
    }

    async setValueInMainContainerEmailInput(value: string) {
        await this.mainContainerEditEmailButton().click();
        await this.mainContainerEditEmailInput().clear();
        await this.mainContainerEditEmailInput().fill(value);
        await this.mainContainerEditEmailButton().nth(0).click();
    }

    async resetValueInMainContainerPassword() {
        await this.mainContainerEditPasswordButton().click();
        await this.profilePageDeletePasswordWindow.resetPassword().click();
    }

    async setValueInMainContainerMaxBet(value: string) {
        await this.mainContainerEditMaxBetButton().click();
        await this.mainContainerEditMaxBetInput().clear();
        await this.mainContainerEditMaxBetInput().type(value);
        await this.mainContainerEditMaxBetButton().nth(0).click();
    }
}