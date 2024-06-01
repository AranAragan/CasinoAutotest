import { Page } from "@playwright/test"
import MainPage from "./mainPage";
import SuccessRegistrationWindow from "../../windows/successRegistrationWindow";
import DepositWindow from "../../windows/depositWindow";
import PopupBonusWindow from "../../windows/popupBonusWindow";
import LiveWinsUserWindow from "../../windows/liveWinsUserWindow";

export default class AuthorizedMainPage extends MainPage {
    successRegistrationWindow: SuccessRegistrationWindow;
    depositWindow: DepositWindow;
    popupBonusWindow: PopupBonusWindow;
    liveWinsUserWindow: LiveWinsUserWindow;

    constructor(public page: Page) {
        super(page);
        this.successRegistrationWindow = new SuccessRegistrationWindow(page);
        this.depositWindow = new DepositWindow(page);
        this.liveWinsUserWindow = new LiveWinsUserWindow(page);
        this.popupBonusWindow = new PopupBonusWindow(page);
    }

    // locators
    navigationMenuButton = () => this.page.locator("div[class*='NavMenuButton']");
    navigationMenuList = () => this.page.locator("ul[class*='NavItems']");
    navigationMenuUserLogin = () => this.page.locator("div[class*='NavUsername'] span");
    navigationMenuUserId = () => this.page.locator(".userId span")
    navigationMenuLogout = () => this.page.locator("//*[@alt='exit']/../following-sibling::span");
    navigationMenuProfile = () => this.navigationMenuList().locator("//*[@alt='profile']/../following-sibling::span");
    navigationMenuBonus = () => this.navigationMenuList().locator("//*[@alt='bonus']/../following-sibling::span");
    navigationMenuReferal = () => this.navigationMenuList().locator("//*[@alt='referral']/../following-sibling::span");

    slotsMenu = () => this.page.locator("#slotsMenuWrapper");
    slotsMenuValues = () => this.slotsMenu().locator("div");

    chatOpenLanguageListButton = () => this.page.locator("//span[contains(text(),'Room')]/following-sibling::div/button");
    chatLanguageList = () => this.page.locator("//span[contains(text(),'Room')]/following-sibling::div/ul");
    chatInput = () => this.page.locator("form input");
    chatSendMessageButton = () => this.page.locator("form .send__icon");
    chatMessages = () => this.page.locator("div[id='chatScrollBar'] span");

    navigationMenuNotificationButton = () => this.page.locator('[class*="notification-bell"]');
    navigationMenuNotificationList = () => this.page.locator("div[class*='NotificationSidebarContainer'] div[class*='NotificationCardStyled']");
    navigationMenuNotificationListName = () => this.navigationMenuNotificationList().locator("div[class*='NotificationInfoTitle']");
    navigationMenuNotificationListDescription = () => this.navigationMenuNotificationList().locator("div[class*='NotificationInfoDescription']");

    async logout() {
        await this.navigationMenuButton().click();
        await this.navigationMenuList().locator(this.navigationMenuLogout())
            .click();
    }

    async pressEscapeForCloseMenu() {
        await this.page.keyboard.press('Escape');
    }

    async clickOnOpenLanguageListButton() {
        await this.chatOpenLanguageListButton().click();
    }

    async sendMessageToChat(message: string) {
        await this.chatInput().fill(message);
        await this.chatSendMessageButton().click();
    }

    async getOrderNumberOfNotificationInList(notificationName: string) {
        for (let i = 0; i < await this.navigationMenuNotificationListDescription().count(); i++) {
            const currentNotification = (await this.navigationMenuNotificationListDescription().nth(i).innerText()).trim();
            if (currentNotification === notificationName) {
                return i; // Если название раздела найдено, возвращаем его порядковый номер (индекс)
            }
        }

        return -1; // Если название раздела не найдено, возвращаем -1
    }

    async checkVoucherNotificationInList() {
        for (let i = 0; i < await this.navigationMenuNotificationListName().count(); i++) {
            const currentNotification = (await this.navigationMenuNotificationListName().nth(i).innerText()).trim();
            const currentNotificationDescription = (await this.navigationMenuNotificationListDescription().nth(i).innerText()).trim();
            if (currentNotification === 'You have received 1 vouchers.' && currentNotificationDescription.includes('Spin the Wheel of Fortune and get your bonus right now!')) {
                return i; // Если название раздела найдено, возвращаем его порядковый номер (индекс)
            }
        }

        return -1; // Если название раздела не найдено, возвращаем -1
    }
    // Spin the Wheel of Fortune and get your bonus right now! Enjoy the game :)  
    async checkFinishedOfferNotificationInList() {
        for (let i = 0; i < await this.navigationMenuNotificationListName().count(); i++) {
            const currentNotification = (await this.navigationMenuNotificationListName().nth(i).innerText()).trim();
            const currentNotificationDescription = (await this.navigationMenuNotificationListDescription().nth(i).innerText()).trim();
            if (currentNotification.includes('You have received') && currentNotification.includes(' on your bonus account.') && currentNotificationDescription.includes('Make bets and get your bonus right now! Enjoy the game :)')) {
                return i; // Если название раздела найдено, возвращаем его порядковый номер (индекс)
            }
        }

        return -1; // Если название раздела не найдено, возвращаем -1
    }
}