import { Page } from "@playwright/test"
import WageringByProvidersWindow from "./wageringByProvidersWindow";
import WageringBySlotsWindow from "./wageringBySlotsWindow";
import moment from "moment";
import ActivateOfferWindowParameters from "./windowTabs/activateOfferWindowParameters";
import ActivateOfferWindowUserSegments from "./windowTabs/activateOfferWindowUserSegments";
import ActivateOfferWindowWagerParams from "./windowTabs/activateOfferWindowWagerParams";

export default class CreateAndEditOfferWindow {
    wageringByProvidersWindow: WageringByProvidersWindow;
    wageringBySlotsWindow: WageringBySlotsWindow;
    activateOfferWindowParameters: ActivateOfferWindowParameters;
    activateOfferWindowUserSegments: ActivateOfferWindowUserSegments;
    activateOfferWindowWagerParams: ActivateOfferWindowWagerParams;

    constructor(public page: Page) {
        this.wageringByProvidersWindow = new WageringByProvidersWindow(page);
        this.wageringBySlotsWindow = new WageringBySlotsWindow(page);
        this.activateOfferWindowParameters = new ActivateOfferWindowParameters(page);
        this.activateOfferWindowUserSegments = new ActivateOfferWindowUserSegments(page);
        this.activateOfferWindowWagerParams = new ActivateOfferWindowWagerParams(page);
    }

    // tabs
    offerWindow = () => this.page.locator('div[role="dialog"]');
    tabs = () => this.offerWindow().locator("div[role='tablist']");
    tabsParameters = () => this.tabs().locator("button", { hasText: "Параметры оффера" });
    tabsUserSegments = () => this.tabs().locator("button", { hasText: "Сегменты пользователей" });
    tabsWagerParams = () => this.tabs().locator("button", { hasText: "Параметры отыгрыша Оффера" });
    createOfferButton = () => this.page.locator('button[type="submit"]');
    alertMessages = () => this.page.locator(".MuiAlert-message");


    async setValueInActivationType(value: string) {
        await this.activateOfferWindowParameters.activationType().click();
        await this.activateOfferWindowParameters.activationTypeList().getByText(value).click();
    }

    async setValueInRewardCurrency(value: string) {
        await this.activateOfferWindowParameters.rewardCurrency().click();
        await this.activateOfferWindowParameters.rewardCurrencyList().getByText(value).click();
    }

    async setValueInRewardType(value: string) {
        await this.activateOfferWindowParameters.rewardType().click();
        await this.activateOfferWindowParameters.rewardTypeList().getByText(value).click();
    }

    async setValueTypeInput(type: string) {
        await this.activateOfferWindowParameters.offerTypeInput().click();
        await this.activateOfferWindowParameters.offerTypeList().getByText(type).click();
    }

    async setValueInRewardAmount(currency: string) {
        await this.activateOfferWindowParameters.rewardAmount().fill(currency);
    }

    async setValueInOfferNameInput(currency: string) {
        await this.activateOfferWindowParameters.offerNameInput().fill(currency);
    }

    async setValueInMinDeposit(currency: string) {
        await this.activateOfferWindowParameters.minDeposit().fill(currency);
    }

    async setValueInMaxDeposit(currency: string) {
        await this.activateOfferWindowParameters.maxDeposit().fill(currency);
    }

    async setValueInMinCountDeposit(count: string) {
        await this.activateOfferWindowParameters.minCountDeposit().fill(count);
    }

    async setValueInMaxCountDeposit(count: string) {
        await this.activateOfferWindowParameters.maxCountDeposit().fill(count);
    }


    async addValueInSettingTargetingByStatus(values: string[]) {
        await this.activateOfferWindowUserSegments.settingTargetingByStatus().click();
        
        for (const value of values) {
            await this.page.getByText(value, { exact: true }).click();
        }
    
        await this.page.keyboard.press('Escape');
    }
    

    async addValueInsettingUpForRoleTargeting(values: string[]) {
        await this.activateOfferWindowUserSegments.settingUpForRoleTargeting().click();
  
        for (const value of values) {
            await this.page.getByText(value, { exact: true }).click();
        }

        await this.page.keyboard.press('Escape');
    }

    async addValueInsettingUpForTagTargeting(values: string[]) {
        await this.activateOfferWindowUserSegments.settingUpForTagTargeting().click();

        for (const value of values) {
            await this.page.getByText(value, { exact: true }).click();
        }

        await this.page.keyboard.press('Escape');
    }

    async addValueInsettingUpForGeoTargeting(values: string[]) {
        await this.activateOfferWindowUserSegments.settingUpForGeoTargeting().click();
   
        for (const value of values) {
            await this.page.getByText(value, { exact: true }).click();
        }

        await this.page.keyboard.press('Escape');
    }

    async setValueInWagerAmountMultiplier(currency: string) {
        await this.activateOfferWindowWagerParams.wagerAmountMultiplier().fill(currency);
    }

    async setValueInWagerPeriodInDays(currency: string) {
        await this.activateOfferWindowWagerParams.wagerPeriodInDays().fill(currency);
    }

    async openWageringProvidersWindow() {
        await this.activateOfferWindowWagerParams.wageringByProviders().click();
    }

    async openWageringSlotsWindow() {
        await this.activateOfferWindowWagerParams.wageringBySlots().click();
    }

    async clickWageringCheckbox() {
        await this.activateOfferWindowWagerParams.wageringCheckbox().click();
    }

    async createOffer() {
        await this.createOfferButton().click();
    }

    async selectStartDateWithoutTime(day: number, dateToSelect: string) {
        await this.activateOfferWindowUserSegments.settingUpPeriodDate().click();
        await this.activateOfferWindowUserSegments.datePeriodValue().click();
        await this.activateOfferWindowUserSegments.dateBeforeCalendarButton().click();
        const thisMonth = moment(dateToSelect, "MMMM YYYY").isBefore();
        while ((await this.activateOfferWindowUserSegments.filterCalendarMounthAndYear().innerText()).replace(',', ' ') != dateToSelect) {
            if (thisMonth) {
                await this.activateOfferWindowUserSegments.calendarNextMonthButton().click();
            } else {
                await this.activateOfferWindowUserSegments.calendarPrevMonthButton().click();
            }
        }
        await this.activateOfferWindowUserSegments.filterDays().getByText(day.toString(), { exact: true }).click();
        await this.activateOfferWindowUserSegments.dateBeforeCalendarButton().click()
    }

    async selectEndDateWithoutTime(day: number, dateToSelect: string) {
        await this.activateOfferWindowUserSegments.settingUpPeriodDate().click();
        await this.activateOfferWindowUserSegments.datePeriodValue().click();
        await this.activateOfferWindowUserSegments.dateAfterCalendarButton().click();
        const thisMonth = moment(dateToSelect, "MMMM YYYY").isBefore();
        while ((await this.activateOfferWindowUserSegments.filterCalendarMounthAndYear().innerText()).replace(',', ' ') != dateToSelect) {
            if (thisMonth) {
                await this.activateOfferWindowUserSegments.calendarNextMonthButton().click();
            } else {
                await this.activateOfferWindowUserSegments.calendarPrevMonthButton().click();
            }
        }
        await this.activateOfferWindowUserSegments.filterDays().getByText(day.toString(), { exact: true }).click();
        await this.activateOfferWindowUserSegments.dateAfterCalendarButton().click()
    }

    async setSegmentTypeAll() {
        await this.activateOfferWindowUserSegments.segmentTypeInput().click();
        await this.activateOfferWindowUserSegments.segmentTypeAll().click();
    }

    async setSegmentTypeIndividual(id: string) {
        await this.activateOfferWindowUserSegments.segmentTypeInput().click();
        await this.activateOfferWindowUserSegments.segmentTypePersonal().click();
        await this.activateOfferWindowUserSegments.userIdInput().fill(id);
    }

    async setSegmentTypeAnalytic(id: string) {
        await this.activateOfferWindowUserSegments.segmentTypeInput().click();
        await this.activateOfferWindowUserSegments.segmentTypeAnalyticStatic().click();
        await this.activateOfferWindowUserSegments.segmentInput().fill(id);
    }

    async setSegmentTypeFilter() {
        await this.activateOfferWindowUserSegments.segmentTypeInput().click();
        await this.activateOfferWindowUserSegments.segmentTypeFilter().click();
    }
}