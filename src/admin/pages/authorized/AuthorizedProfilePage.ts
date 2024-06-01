import { Page } from "@playwright/test"
import AuthorizedMainPage from "../basePages/authorizedMainPage";
import MainLeftSidebar from "../../sidebars/mainLeftSidebar";
import UserCommonInfoTab from "../../tabs/profilePageTabs/userCommonInfoTab";
import AdminActionsTab from "../../tabs/profilePageTabs/adminActionsTab";
import DepositAndWithdrawalsTab from "../../tabs/profilePageTabs/depositsAndWithdrawals";
import DepositsTab from "../../tabs/profilePageTabs/depositsTab";
import SlotsBidsTab from "../../tabs/profilePageTabs/slotsBidsTab";
import SportsBidsTab from "../../tabs/profilePageTabs/sportsBidsTab";
import TransactionsTab from "../../tabs/profilePageTabs/transactionsTab";
import UserActionsTab from "../../tabs/profilePageTabs/userActionsTab";
import WithdrawalsTab from "../../tabs/profilePageTabs/withdrawalsTab";

export default class AuthorizedProfilePage extends AuthorizedMainPage {
    mainLeftSidebar: MainLeftSidebar;
    userCommonInfoTab: UserCommonInfoTab;
    adminActionsTab: AdminActionsTab;
    depositAndWithdrawalsTab: DepositAndWithdrawalsTab;
    depositsTab: DepositsTab;
    slotsBidsTab: SlotsBidsTab;
    sportsBidsTab: SportsBidsTab;
    transcationsTab: TransactionsTab;
    userActionsTab: UserActionsTab;
    withdrawalsTab: WithdrawalsTab;


    constructor(public page: Page) {
        super(page);
        this.mainLeftSidebar = new MainLeftSidebar(this.page);
        this.userCommonInfoTab = new UserCommonInfoTab(this.page);
        this.depositsTab = new DepositsTab(this.page);
        this.adminActionsTab = new AdminActionsTab(this.page);
        this.depositAndWithdrawalsTab = new DepositAndWithdrawalsTab(this.page);
        this.slotsBidsTab = new SlotsBidsTab(this.page);
        this.sportsBidsTab = new SportsBidsTab(this.page);
        this.transcationsTab = new TransactionsTab(this.page);
        this.userActionsTab = new UserActionsTab(this.page);
        this.withdrawalsTab = new WithdrawalsTab(this.page);
    }

    // Locator
    userLogin = () => this.page.locator(".MuiBox-root h5");
    tabsList = () => this.page.locator(" div[class*='MuiTabs-scrollable'] div[role='tablist']");

    async openTab(tab: string){
        await this.tabsList().locator('a', {hasText: tab}).nth(0).click();
    }
}