import { Page } from "@playwright/test"
import AuthorizedMainPage from "../basePages/authorizedMainPage";
import MainLeftSidebar from "../../sidebars/mainLeftSidebar";
import Delete2faWindow from "../../windows/delete2faWindow";

export default class AuthorizedProfilePage extends AuthorizedMainPage {
    mainLeftSidebar: MainLeftSidebar;
    delete2faWindow: Delete2faWindow;

    constructor(public page: Page) {
        super(page);
        this.mainLeftSidebar = new MainLeftSidebar(this.page);
        this.delete2faWindow = new Delete2faWindow(this.page);
    }

    settingsTop = () => this.page.locator("div[class*='SettingsTop']");
    socialLinksButton = () => this.settingsTop().locator("div[class*='SettingsSocialsContent'] button");
    profileEditButton = () => this.settingsTop().locator("button[class*='ProfileUserNameEditButton']");
    profileEditNameInput = () => this.settingsTop().locator("input[placeholder='your name']");
    profileEditNameSaveButton = () => this.settingsTop().locator("//input[@placeholder='your name']/following::div[2]");
    profileName = () => this.settingsTop().locator("div[class*='ProfileUserNameWrap'] div[class*='ProfileUserNameStyled']");
    profileId = () => this.settingsTop().locator(".userId");
    descriptionHeaders = () => this.page.locator("div[class*='PlayerProfileInfoBlockDescription']");
    settingBottom = () => this.page.locator("div[class*='SettingsBottom']");
    settingBottomHeader = () => this.settingBottom().locator("div[class*='SettingsHeader']");
    settingBottomEmailInput = () => this.settingBottom().locator("div[class*='SettingsInputBlock'] input[placeholder='Email']");
    settingBottomEmailEditButton = () => this.settingBottom().locator("//input[@placeholder='Email']/following::div[1]");
    settingBottomEmailSaveAfterEditButton = () => this.settingBottom().locator("//input[@placeholder='Email']/following::div[2]");
    settingBottomPhoneInput = () => this.settingBottom().locator("//input[@placeholder='your phone number']");
    settingBottomPhoneEditButton = () => this.settingBottom().locator("//input[@placeholder='your phone number']/following::div[1]");
    settingBottomPhoneSaveAfterEditButton = () => this.settingBottom().locator("//input[@placeholder='your phone number']/following::div[2]");
    settingBottomPlaceBetsAnonymouslySideButton = () => this.settingBottom().locator("//div[text()='Place bets anonymously']/following::label[1]/span");
    settingBottomPlace2faButton = () => this.settingBottom().locator("//div[text()='Two factor authentication']/following::label[1]/span");
    settingBottomPlaceGetSecretKey = () => this.settingBottom().locator('[placeholder="Your 2fA code"]');
    settingBottomPlaceInputPassword = () => this.settingBottom().locator('[placeholder="Enter password"]');
    settingBottomPlaceInputOTRCode = () => this.settingBottom().locator('[placeholder="Enter two-factor code"]');
    settingBottomButtonDelete = () => this.settingBottom().locator("button[class*='two-factor-auth-delete']");
    settingBottomQRCodeFor2fa = () => this.settingBottom().locator("[class*='SettingsQRContent']");
    settingBottomSubmit2faForm = () => this.settingBottom().locator("button", {hasText: "Submit"});
    settingBottomHideStatisticsButton = () => this.settingBottom().locator("//div[text()='Hide statistics']/following::label[1]/span");

    async changeLogin(login: string) {
        await this.profileEditButton().click();
        await this.profileEditNameInput().clear();
        await this.profileEditNameInput().fill(login);
        await this.profileEditNameSaveButton().click();
    }

    async changeEmail(email: string) {
        await this.settingBottomEmailEditButton().click();
        await this.settingBottomEmailInput().fill(email);
        await this.settingBottomEmailSaveAfterEditButton().click();
        await this.page.waitForLoadState("networkidle");
    }

    async delete2Fa() {
        await this.settingBottomButtonDelete().click();
        await this.delete2faWindow.deleteButton().click();
    }

    async changePhone(phone: string) {
        await this.settingBottomPhoneEditButton().click();
        await this.settingBottomPhoneInput().clear();

        await this.settingBottomPhoneInput().type(phone);
        await this.settingBottomPhoneSaveAfterEditButton().click();
    }
}