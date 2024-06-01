import { Page } from "@playwright/test"

export default class WageringBySlotsWindow{

    constructor(public page: Page) {

    }

    // locators
    wageringWindow = () => this.page.locator('div[role="dialog"]').nth(1);
    wageringWindowApply = () => this.wageringWindow().locator("button[type='submit']");
    wageringWindowCancelButton = () => this.wageringWindow().locator("button", {hasText: "Назад"})
    wageringBySlotsProviders = () => this.wageringWindow().locator("li[class*='MuiListItem-root']");


    async applyWageringWindow(){
        await this.wageringWindowApply().click();
    }

    async clickOnGameCheckbox(gameName: string) {
        for (let i = 0; i < await this.wageringBySlotsProviders().count(); i++) {
            if ((await this.wageringBySlotsProviders().nth(i).locator("div[class*='slot-row__SpacerBox'] p").nth(0).innerText()).toLowerCase() === gameName) {
                await this.wageringBySlotsProviders().nth(i).locator("input[type='checkbox']").click();
                break;
            }
        }
    }

    async gameIsChecked(gameName: string) {
        let isChecked = false;
        for (let i = 0; i < await this.wageringBySlotsProviders().count(); i++) {
            if ((await this.wageringBySlotsProviders().nth(i).locator("div[class*='slot-row__SpacerBox'] p").nth(0).innerText()).toLowerCase().includes(gameName)) {
                isChecked = await this.wageringBySlotsProviders().nth(i).locator("input[type='checkbox']").isChecked();
                break;
            }
        }
        return isChecked;
    }

    async cancelChangesWageringWindow(){
        await this.wageringWindowCancelButton().click();
    }
}