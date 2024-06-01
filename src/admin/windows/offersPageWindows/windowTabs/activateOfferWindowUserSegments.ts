import { Page } from "@playwright/test";

export default class ActivateOfferWindowUserSegments {

    constructor(public page: Page) {
        this.page = page;
    }

    // locators tabs.user-segments
    segmentTypeInput = () => this.page.locator("//label[text()='Segment type']/following-sibling::div/div|//label[text()='Тип сегмента']/following-sibling::div/div");
    segmentTypeAll = ()  => this.page.locator('li[data-value="ALL"]');
    segmentTypePersonal = ()  => this.page.locator('li[data-value="PERSONAL"]');
    segmentTypeAnalyticStatic = () => this.page.locator('li[data-value="ANALYTIC_STATIC"]');
    segmentTypeFilter = () => this.page.locator('li[data-value="DEFAULT"]');
    segmentTypeSelected = () => this.page.locator("//label[text()='Segment type']/following-sibling::div/div");
    
    registrationCurrencyMustMatchRewardCurrency = () => this.page.locator("//span[text()='Валюта регистрации должна совпадать с валютой вознаграждения']/preceding-sibling::span|//span[text()='Registration currency must match the reward currency']/preceding-sibling::span");

    userIdInput = () => this.page.locator("//label[text()='Id пользователя']/following-sibling::div/input");
    segmentInput = () => this.page.locator("//label[text()='Segment id']/following-sibling::div/input");

    settingTargetingByStatus = () => this.page.locator("//label[text()='Setting targeting by status']/following-sibling::div|//label[text()='Настройка для таргетинга по статусу']/following-sibling::div");
    settingUpForRoleTargeting = () => this.page.locator("//label[text()='Setting up for role targeting']/following-sibling::div/div|//label[text()='Настройка для таргетинга по роли']/following-sibling::div/div");
    settingUpForTagTargeting = () => this.page.locator("//label[text()='Tag targeting setup']/following-sibling::div/div|//label[text()='Настройка для таргетинга по тегу']/following-sibling::div/div");
    settingUpForGeoTargeting = () => this.page.locator("//label[text()='Geo targeting setup']/following-sibling::div/div|//label[text()='Настройки для таргетинга по гео']/following-sibling::div/div")
    settingUpPeriodDate = () => this.page.locator("//label[text()='Registration date']/following-sibling::div/div|//label[text()='Дата регистрации']/following-sibling::div/div");
    datePeriodValue = () => this.page.locator('li[data-value="range"]');

    dateWindow = () => this.page.locator('div[role="dialog"]').nth(1);
    dateBeforeCalendarButton = () => this.page.locator("//label[text()='Дата от']/following-sibling::div/div/button");
    dateAfterCalendarButton = () => this.page.locator("//label[text()='Дата до']/following-sibling::div/div/button");
    calendarNextMonthButton = () => this.dateWindow().locator('[data-testid="ArrowRightIcon"]');
    calendarPrevMonthButton = () => this.dateWindow().locator('[data-testid="ArrowLeftIcon"]');
    filterCalendarMounthAndYear = () => this.dateWindow().locator('[class*="MuiPickersCalendarHeader-label"]').nth(1);
    filterDays = () => this.dateWindow().locator('div[role="rowgroup"]');
    buttonOk = () => this.dateWindow().locator('button', {hasText:'OK'});
}