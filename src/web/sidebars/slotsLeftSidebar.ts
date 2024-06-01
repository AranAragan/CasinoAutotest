import { Page} from "@playwright/test"

// old functional, will be deprecated
export default class SlotsLeftSidebar {

    constructor(public page: Page) {

    }

    // Locators
    leftSideBarOnSlotsPageContent = () => this.page.locator("div[class*='LeftSidebarContent']");
    leftSideBarOnSlotsPageBanners = () => this.leftSideBarOnSlotsPageContent().locator("div[class*='BonusBanners'] img");
    leftSideBarOnSlotsHeaders = () => this.leftSideBarOnSlotsPageContent().locator("span", {hasText: "Providers"});
    leftSideBarListValues = () => this.leftSideBarOnSlotsPageContent().locator("//span[@class='count']/preceding-sibling::div/span");
    leftSideBarProvider = (provider: string) => this.leftSideBarOnSlotsPageContent().locator("//span[@class='count']/preceding-sibling::div/span", {hasText: provider});
    leftSideBarInstallButtons = () => this.leftSideBarOnSlotsPageContent().locator("div[class*='InstallButtonsWrapper'] a");
    leftSideBarSocialLinks = () => this.leftSideBarOnSlotsPageContent().locator("div[class*='SocialBtnWrapper'] a");

    async openProviderPage(provider: string){
        await this.leftSideBarProvider(provider).click();
    }
}