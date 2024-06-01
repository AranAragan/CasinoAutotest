import { Page } from "@playwright/test"
import MainLeftSidebar from "../../sidebars/mainLeftSidebar";

export default class MainPage {
    mainLeftSidebar: MainLeftSidebar;

    constructor(public page: Page) {
        this.page = page;
        this.mainLeftSidebar = new MainLeftSidebar(this.page);
    }

    // Locators
    header = () => this.page.locator("//div[contains(@class,'LeftSideBar')]/ancestor::div[contains(@class,'HeaderStyles')]");
    langContainer = () => this.page.locator("div[class*='SidebarElements'] div[class*='LangContainer']");
    langMenuList = () => this.page.locator("ul#langMenuList");
    balanceInMenu = () => this.page.locator('span[class="number"]');
    balanceMenuButton = () => this.page.locator("div[class*='WalletHeaderContainer']");
    navigationMenuLogout = () => this.page.locator("//*[@alt='exit']/../following-sibling::span");
    hamburgerButton = () => this.page.locator("[class*='SideHamburger']");
    chatButton = () => this.page.locator("div[class*='ProfileWrapper'] div[class*='CloseChat']");

    bitcoinInMenuBalance = () => this.page.locator("//span[text()='Bitcoin']/preceding-sibling::span[@class='balance']/span").nth(0);
    currencyInMenuBalance = (currency: string) => this.page.locator(`//span[text()='${currency}']/preceding-sibling::span[@class='balance']/span`).nth(0);

    gameBannersContainer = () => this.page.locator('[class="MainStyled__PageBanner-fkuseo dxAErj"]').nth(0);
    gameBanners = () => this.gameBannersContainer().locator('div[class*="css-vo2es7"]');
    gameBannersActive = () => this.gameBannersContainer().locator('div[class*="css-vo2es7"][aria-hidden="false"]');
    gameBannersPrevButton = () => this.page.locator("button[class*='carousel-prev']");
    gameBannersNextButton = () => this.page.locator("button[class*='carousel-next']");
    gameBannerPlinko = () => this.page.locator('[class="slick-slide slick-cloned"] img[alt="Plinko"]').nth(0);
    gameBannerDiver = () => this.gameBannersContainer().locator('[class="slick-slide slick-cloned"] img[alt="Diver"]').nth(0);
    gameBannerSports = () => this.gameBannersContainer().locator('[class="slick-slide slick-cloned"] img[alt="SportsBetting"]').nth(0);
    gameBannerOriginalGames = () => this.gameBannersContainer().locator('[class="slick-slide slick-cloned"] img[alt="original games"]').nth(0);
    gameBannerReferalSystem = () => this.gameBannersContainer().locator('[class="slick-slide slick-cloned"] img[alt="referral system"]').nth(0);
    gameBannerGamesAndSlots = () => this.gameBannersContainer().locator('[class="slick-slide slick-cloned"] img[alt="games and slots"]').nth(0);
    gameBannerLiveCasino = () => this.gameBannersContainer().locator(' [class="slick-slide"] img[alt="live casino"]').nth(0);
    gameBannerBrazilianTournament = () => this.gameBannersContainer().locator(' [class="slick-slide"] img[alt="brazilian tournament"]').nth(0);


    tabsGamesList = () => this.page.locator("div[class*='slots-categories']");
    tabsGamesListValues = () => this.page.locator("div[class*='MenuContainer'] span");

    footer = () => this.page.locator("footer[class='main-footer']");
    legalInformationFooterHeader = () => this.footer().locator("h4", {
        hasText: "Legal information"
    });
    legalInformationFooterLinks = () => this.legalInformationFooterHeader().locator("//following::ul[1]/li");

    featuresFooterHeader = () => this.footer().locator("h4", {
        hasText: "Features"
    });
    featuresFooterLinks = () => this.featuresFooterHeader().locator("//following::ul[1]/li");

    otherFooterHeader = () => this.footer().locator("h4", {
        hasText: "Other"
    });
    otherFooterLinks = () => this.otherFooterHeader().locator("//following::ul[1]/li");

    supportFooterHeader = () => this.footer().locator("h4", {
        hasText: "Support"
    });
    supportFooterLinks = () => this.supportFooterHeader().locator("//following::ul[1]/li");

    async selectLanguage(country: string) {
        await this.langContainer().click();
        await this.langMenuList()
            .locator("span", {
                hasText: country
            }).click();
    }

    async selectCurrency(currency: string) {
        await this.balanceMenuButton().click();
        await this.currencyInMenuBalance(currency).click();
    }

    async clickOnHamburgerButton() {
        await this.hamburgerButton().click();
    }

    async clickOnChat() {
        await this.chatButton().click();
    }

    async clickOnGamesTab(tab: string) {
        await this.tabsGamesList()
            .locator('span', { hasText: tab }).click();
    }

    async openLeftSidebar() {
        if (await this.mainLeftSidebar.leftSidebarAside().getAttribute('data-testid') === 'sidebar-false') {
            await this.hamburgerButton().click();
        }
    }
}