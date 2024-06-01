import { Page } from "@playwright/test"
import AuthorizedMainPage from "../basePages/authorizedMainPage";
import ProvidersSlotsTab from "../../tabs/slotsTabs/providersSlotsTab";
import SlotsTab from "../../tabs/slotsTabs/slotsTab";
import MainLeftSidebar from "../../sidebars/mainLeftSidebar";

export default class AuthorizedSlotsPage extends AuthorizedMainPage {
    providersSlotsTab: ProvidersSlotsTab;
    slotsTab: SlotsTab;
    mainLeftSidebar: MainLeftSidebar;

    constructor(public page: Page) {
        super(page);
        this.providersSlotsTab = new ProvidersSlotsTab(page);
        this.slotsTab = new SlotsTab(this.page);
        this.mainLeftSidebar = new MainLeftSidebar(this.page);
    }

    // locators
    headerValues = () => this.page.locator("div[class*='TitleBox'] span");
    liveWinsList = () => this.page.locator("div[class*='LiveLineContainer'] a");

    providersTitleBox = () => this.page.locator("div[class*='ProviderTitleBox']");
    mainLink = () => this.providersTitleBox().locator("a[href='/']").nth(0);
    allGamesLink = () => this.providersTitleBox().locator("a[href='/slots']", {hasText: 'All games'});
    slotsLink = () => this.page.locator("a[href='/slots?scroll=SLOTS']");

    selectProvider = () => this.page.locator("div[class*='SelectTitle']");
    providerOpenedList = () => this.page.locator("div[class*='ProvidersListBox']");

    async selectProviderInProviderList(provider: string){
        await this.selectProvider().click();
        await this.providerOpenedList().locator('div span', {hasText: provider}).click();
    }

    async clickOnSlotsMenu(slot: string){
        await this.slotsMenu()
            .locator('div', {hasText: slot})
            .click();
    }

    async getSlotsMenuValues(){
        const arrayValues = [];
        const countMenuValues = await this.slotsMenuValues().count();

        for (let i = 0; i < countMenuValues; i++){
            arrayValues.push(await this.slotsMenuValues().nth(i).innerText());
        }
        return arrayValues;
    }
    
}