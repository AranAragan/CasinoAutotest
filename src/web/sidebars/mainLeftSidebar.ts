import { Page} from "@playwright/test"

export default class MainLeftSidebar {

    constructor(public page: Page) {

    }
    
    // Locators
    leftSidebarAside = () => this.page.locator("aside").nth(0);
    leftSideBarOnInHousePageContent = () => this.page.locator("aside section").nth(0);
    leftSideBarOnInHousePageBanner = () => this.leftSideBarOnInHousePageContent().locator("h6");
    leftSideBarProfile = () => this.leftSideBarOnInHousePageContent().locator("button div", {hasText: 'Profile'});
    leftSidebarHelp = () => this.leftSideBarOnInHousePageContent().locator("button div", {hasText: 'Help'});
    leftSideBarBonusManager = () => this.leftSideBarOnInHousePageContent().locator("button div", {hasText: 'Bonus manager'});
    leftSideBarCasinoBlock = () => this.leftSideBarOnInHousePageContent().locator("button div", {hasText: 'Casino'});
    leftSidebarCasinoList = () => this.page.locator("aside section ul").nth(1);
    leftSideBarSportBlock = () => this.leftSideBarOnInHousePageContent().locator("button", {hasText: 'Sport'});
    leftSideBarInstallButtonAndroid = () => this.leftSidebarAside().locator('footer a[href="/android-instruction"]');
    leftSideBarInstallButtonIos = () => this.leftSidebarAside().locator(' footer a[href="/ios-instruction"]');
    leftSideBarSocialLinkInst = () => this.page.locator('aside footer ul li a[href="https://www.instagram.com/chillbet.brasil"]');
    leftSideBarSocialLinkTwitter = () => this.page.locator('aside footer ul li a[href="https://twitter.com/chillbet_brasil"]');
    leftSideBarSocialLinkTelegram = () => this.page.locator('aside footer ul li a[href="https://twitter.com/chillbet_brasil"]');

    async openCasinoSlots(slot: string) {
        await this.leftSidebarCasinoList().locator('a', {hasText: slot}).click();
    }
}