import { Page} from "@playwright/test"
import AuthorizedMainPage from "../basePages/authorizedMainPage";
import MainLeftSidebar from "../../sidebars/mainLeftSidebar";

export default class AuthorizedReferralPage extends AuthorizedMainPage {
    mainLeftSidebar: MainLeftSidebar;

    constructor(public page: Page) {
        super(page);
        this.mainLeftSidebar = new MainLeftSidebar(this.page);
    }

    referalBlocksHeaders = () => this.page.locator("div[class*='RefStat'] div[class*='Blocks'] p");
    referalLinkContainer = () => this.page.locator("div[class*='RefStatMain']");
    referalSocialLinks = () => this.referalLinkContainer().locator(".socials a");
    referalLinkInput = () => this.referalLinkContainer().locator("input");
    referalLinkInputCopyButton = () => this.referalLinkContainer().locator("div[class*='UiInputToolbar'] button");
    referalLinkButtonPromo = () => this.referalLinkContainer().locator("div[class*='RefPromo'] a");
    referalInfoMain = () => this.page.locator("div[class*='RefInfoMain']");
    referalInfoHeader = () => this.referalInfoMain().locator("h3");
    referalInfoImage = () => this.referalInfoMain().locator("img");
    referalProfitabilityCalculationContainer = () => this.page.locator("div[class*='RefComissionWrap']");
    referalProfitabilityCalculationSliders = () => this.referalProfitabilityCalculationContainer().locator("div[class='slider']");
    referalProfitabilityCalculationHeader = () => this.referalProfitabilityCalculationContainer().locator("h3");
    referalTableContainer = () => this.page.locator("div[class*='RefTable'] ");
    referalTableHeader = () => this.referalTableContainer().locator("h2");
    referalTableTheadElements = () => this.referalTableContainer().locator(".thead .row");

}