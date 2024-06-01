import { Page } from "@playwright/test"
import UnauthorizedMainPage from "../basePages/unauthorizedMainPage";
import AllGamesTab from "../../tabs/inHouseGamesTabs/allGamesTab";
import NewGamesTab from "../../tabs/inHouseGamesTabs/newGamesTab";
import TopGamesTab from "../../tabs/inHouseGamesTabs/topGamesTab";
import MainLeftSidebar from "../../sidebars/mainLeftSidebar";

export default class UnauthorizedInHousePage extends UnauthorizedMainPage {
    allGamesTab: AllGamesTab;
    newGamesTab: NewGamesTab;
    topGamesTab: TopGamesTab;
    mainLeftSidebar: MainLeftSidebar;

    constructor(public page: Page) {
        super(page);
        this.allGamesTab = new AllGamesTab(this.page);
        this.newGamesTab = new NewGamesTab(this.page);
        this.topGamesTab = new TopGamesTab(this.page);
        this.mainLeftSidebar = new MainLeftSidebar(this.page);
    }

    liveWinsHeader = () => this.page.locator("div[class*='LastBetsNavigation'] span");
    liveWinsTabs = () => this.page.locator("div[class*='LastBetsNavigation'] button");
    liveWinsCellOfTable = () => this.page.locator("div[class*='LastBetsHeaderStyled'] span");
    liveWinsRow = () => this.page.locator("div[class*='LastBetsTableStyled__Item-sc']");
    liveWinsButtons = () => this.page.locator("div[class*='LastBetsNavigation'] button");

    async openUserWindowInLiveWinsTable(count: number){
        await this.liveWinsRow().nth(count-1).locator("div[class*='ItemPlayer']").click();
    }
}