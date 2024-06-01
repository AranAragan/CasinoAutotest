import { Page } from "@playwright/test";
import MainPage from "../pages/basePages/mainPage";
import moment from "moment";

export default class FilterBlock extends MainPage {

    constructor(public page: Page) {
        super(page);
    }

    // Locators
    addFilterButton = () => this.page.locator("//button[text()='Добавить фильтр']|//button[text()='Add filter']");
    addFilterList = () => this.page.locator("ul[role='menu']");

    filterBlock = () => this.page.locator(".MuiAccordion-region");
    filterList = () => this.page.locator("ul[role='listbox']");
    filterApplyButton = () => this.page.locator("//button[text()='Применить']|//button[text()='Apply filters']");
    filterClearAllButton = () => this.page.locator("//button[text()='Сбросить все']|//button[text()='Clear all']");
    filterClearValues = () => this.page.locator("//button[text()='Сбросить значения']|//button[text()='Clear values']");

    filterAccordion = () => this.page.locator(".MuiAccordionSummary-content ul");
    filterAccordionList = () => this.filterAccordion().locator("li");

    filtersListUpDownButton = () => this.page.locator("[data-testid='KeyboardArrowUpIcon']");
    filtersItemWrapper = () => this.page.locator("[class*='FilterItemWrapper']:visible");

    filterCalendar = () => this.page.locator(".rmdp-calendar");
    filterCalendarNextMonthButton = () => this.filterCalendar().locator(".rmdp-right");
    filterCalendarPrevMonthButton = () => this.filterCalendar().locator(".rmdp-left");
    filterCalendarMounthAndYear = () => this.filterCalendar().locator(".rmdp-header-values");
    filterDays = () => this.filterCalendar().locator("div[class*='rmdp-day-picker']");

    async addFilter(filter: string) {
        await this.addFilterButton().click();
        await this.addFilterList().getByText(filter, { exact: true }).click();
    }

    async hideOrOpenFilters() {
        await this.filtersListUpDownButton().click();
    }

    async countFiltersOnPage(){
        return await this.filtersItemWrapper().count();
    }

    async setBooleanValuesFilter(filter: string, valueYes: boolean, valueNo: boolean) {
        await this.setBooleanValuesYes(filter, valueYes);
        await this.setBooleanValuesNo(filter, valueNo);
    }

    async setBooleanValuesYes(filter: string, value: boolean) {
        const booleanCheckboxIsChecked = this.filterBlock().locator(`//span[text()='${filter}']/parent::div//li`).nth(0).locator("[class*='MuiCheckbox-root'][class*='Mui-checked']");
        const booleanCheckbox = this.filterBlock().locator(`//span[text()='${filter}']/parent::div//li`).nth(0).locator("[class*='MuiCheckbox-root'] input");

        if (await booleanCheckboxIsChecked.isVisible() && !value){
            await booleanCheckbox.click();
        } else if (!await booleanCheckboxIsChecked.isVisible() && value){
            await booleanCheckbox.click();
        }
    }

    async setBooleanValuesNo(filter: string, value: boolean) {
        const booleanCheckboxIsChecked = this.filterBlock().locator(`//span[text()='${filter}']/parent::div//li`).nth(1).locator("[class*='MuiCheckbox-root'][class*='Mui-checked']");
        const booleanCheckbox = this.filterBlock().locator(`//span[text()='${filter}']/parent::div//li`).nth(1).locator("[class*='MuiCheckbox-root'] input");

        if (await booleanCheckboxIsChecked.isVisible() && !value){
            await booleanCheckbox.click();
        } else if (!await booleanCheckboxIsChecked.isVisible() && value){
            await booleanCheckbox.click();
        }
    }

    async addValueInDropdownFilter(filter: string, values: string[]) {
        await this.filterBlock().locator(`//label[text()='${filter}']/parent::div//div[@role="button"]`).click();

        for (const value of values) {
            await this.filterList().getByText(value, { exact: true }).click();
        }

        await this.page.keyboard.press('Escape');
    }

    async addValueInInputFilter(filter: string, value: string) {
        await this.filterBlock().locator("input[placeholder='" + filter + "']").fill(value);
    }

    async deleteInputFilter(filter: string) {
        await this.filterBlock().locator("//input[@placeholder='" + filter + "']/parent::div/following-sibling::button").click();
    }

    async deleteFilterInAccordion(filter: string) {
        await this.filterAccordion().locator('li', {hasText: filter}).locator('svg').click();
    }

    async deleteDropdownFilter(dropdown: string) {
        await this.filterBlock().locator("//label[text()='" + dropdown + "']/parent::div/following-sibling::button").click();
    }

    async addTwoDateInDateFilter(filter: string, firstDay: number, firstMonthAndYear: string, secondDay: number, secondMonthAndYear: string) {
        await this.filterBlock().locator("//label[text()='" + filter + "']/parent::div//input").click();
        await this.selectTwoDate(firstDay, firstMonthAndYear, secondDay, secondMonthAndYear);
        await this.page.keyboard.press('Escape');
    }

    async selectDate(day: number, dateToSelect: string) {
        const thisMonth = moment(dateToSelect, "MMMM YYYY").isBefore();
        console.log("this month? " + thisMonth);
        while ((await this.filterCalendarMounthAndYear().innerText()).replace(',', ' ') != dateToSelect) {
            if (thisMonth) {
                await this.filterCalendarPrevMonthButton().click();
            } else {
                await this.filterCalendarNextMonthButton().click();
            }
        }
        await this.filterDays().getByText(day.toString(), { exact: true }).click();
    }

    async selectTwoDate(firstDay: number, firstMonthAndYear: string, secondDay: number, secondMonthAndYear: string,) {
        moment.suppressDeprecationWarnings = true;
        let thisMonth = moment(firstMonthAndYear, "MMMM YYYY").isBefore();
        while ((await this.filterCalendarMounthAndYear().innerText()).replace(',', ' ') != firstMonthAndYear) {
            if (thisMonth) {
                await this.filterCalendarPrevMonthButton().click();
            } else {
                await this.filterCalendarNextMonthButton().click();
            }
        }
        await this.filterDays().getByText(firstDay.toString(), { exact: true }).click();

        thisMonth = moment(secondMonthAndYear, "MMMM YYYY").isBefore(firstMonthAndYear);
        while ((await this.filterCalendarMounthAndYear().innerText()).replace(',', ' ') != secondMonthAndYear) {
            if (thisMonth) {
                await this.filterCalendarPrevMonthButton().click();
            } else {
                await this.filterCalendarNextMonthButton().click();
            }
        }
        await this.filterDays().getByText(secondDay.toString(), { exact: true }).click();
    }
}