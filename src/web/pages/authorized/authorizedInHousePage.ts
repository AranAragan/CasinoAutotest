import { Page } from "@playwright/test"
import AllGamesTab from "../../tabs/inHouseGamesTabs/allGamesTab";
import NewGamesTab from "../../tabs/inHouseGamesTabs/newGamesTab";
import TopGamesTab from "../../tabs/inHouseGamesTabs/topGamesTab";
import AuthorizedMainPage from "../basePages/authorizedMainPage";
import MainLeftSidebar from "../../sidebars/mainLeftSidebar";
import SuccessRegistrationWindow from "../../windows/successRegistrationWindow";

export default class AuthorizedInHousePage extends AuthorizedMainPage{
    allGamesTab: AllGamesTab;
    newGamesTab: NewGamesTab;
    topGamesTab: TopGamesTab;
    mainLeftSidebar: MainLeftSidebar;
    successRegistrationWindow: SuccessRegistrationWindow;

    constructor(public page: Page) {
        super(page);
        this.allGamesTab = new AllGamesTab(this.page);
        this.newGamesTab = new NewGamesTab(this.page);
        this.topGamesTab = new TopGamesTab(this.page);
        this.mainLeftSidebar = new MainLeftSidebar(this.page);
        this.successRegistrationWindow = new SuccessRegistrationWindow(this.page)
    }

    liveWinsHeader = () => this.page.locator("div[class*='LastBetsNavigation'] span");
    liveWinsTabs = () => this.page.locator("div[class*='LastBetsNavigation'] button");
    liveWinsCellOfTable = () => this.page.locator("div[class*='LastBetsHeaderStyled'] span");
    liveWinsRow = () => this.page.locator("div[class*='LastBetsTableStyled']");
    liveWinsButtons = () => this.page.locator("div[class*='LastBetsNavigation'] button");

    liveWinsTableBody = () => this.page.locator("div[class*='LastBetsStyled__BetsTable']");
    liveWinsTableRows = () => this.liveWinsTableBody().locator("div[class*='LastBetsTableStyled__Item-']");
    thead = () => this.liveWinsTableBody().locator("div[class*='LastBetsHeaderStyled']");
    theadElements = () => this.thead().locator("span");

    async openUserWindowInLiveWinsTable(count: number){
        const userName = await this.liveWinsRow().nth(count-1).locator("div[class*='ItemPlayer']").innerText();
        await this.liveWinsRow().nth(count-1).locator("div[class*='ItemPlayer']").click();
        return userName;
    }
    
    findAllRowsInTable() {
        return this.liveWinsTableBody().locator('tr');
    }

    async findCountRowsInLiveWinsTable() {
        return this.liveWinsTableRows().count();
    }

    findRatesCellInLiveWinsTableHighRates(order: number) {
        return this.liveWinsTableRows().nth(order - 1).locator("div[class*='ItemCoefficient']");
    }

    findUserInLiveWinsTableMyBets(order: number) {
        return this.liveWinsTableRows().nth(order - 1).locator("div[class*='ItemPlayer']");
    }    
}