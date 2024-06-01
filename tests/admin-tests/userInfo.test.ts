import { Utils } from "../../utils/generators";
import { expect, test } from "../../src/admin/base/pomFixture"
import * as data from "../../src/web/data/login-data.json"


test.describe("Изменение данных пользователя", () => {
    test('ADM-56 autotest.admin. В табе "Общая информация по игроку" можно изменить данные игрока @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedProfilePage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        const dataForChange = {
            login: "player#222315",
            email: "csdfdsf@fsldfds.ru"
        }

        const login = Utils.generateString(6);
        const telegramLogin = Utils.generateString(6);
        const phoneNumber = "+919" + Utils.generateRandomNumber(9);
        const email = Utils.generateEmail();
        const ranomNumber = Utils.generateRandomNumber(1);

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Search by id/nickname`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
        });

        await test.step(`Ввести в поле имя пользователя и нажать "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', dataForChange.login);
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`В таблице пользователей нажать на иконку глаза в колонке "Profile" для пользователя`, async () => {
            const row = await authorizedUsersPage.tableBlock.findOrderRowByValue("name", dataForChange.login);
            await authorizedUsersPage.tableBlock.openProfileUserByOrder(row);
        });

        await test.step(`Нажать на кнопку редактирования логина, ввести новый логин, сохранить изменения`, async () => {
            await authorizedProfilePage.userCommonInfoTab.changeNicknameInDetailsModule(login);
            await expect(authorizedProfilePage.userCommonInfoTab.detailsBasicEditNameInput()).toHaveValue(login);
        });

        await test.step(`Нажать на кнопку редактирования логина, ввести старый логин, сохранить изменения`, async () => {
            await authorizedProfilePage.userCommonInfoTab.changeNicknameInDetailsModule(dataForChange.login);
        });

        await test.step(`Нажать на кнопку редактирования telegram-id, ввести новый telegram-id, сохранить изменения`, async () => {
            await authorizedProfilePage.userCommonInfoTab.changeTelegramInDetailsModule(telegramLogin);
            await expect(authorizedProfilePage.userCommonInfoTab.detailsBasicEditTelegramInput()).toHaveValue(telegramLogin);
        });

        await test.step(`Нажать на кнопку редактирования telegram-id, ввести значение по умолчанию ("-") , сохранить изменения`, async () => {
            await authorizedProfilePage.userCommonInfoTab.changeTelegramInDetailsModule("–");
        });

        await test.step(`Нажать на выпадающий список "Status", выбрать "Not Verified"`, async () => {
            await authorizedProfilePage.userCommonInfoTab.setValueInStatusListboxInDetailsModule('Not verified');
            await expect(authorizedProfilePage.userCommonInfoTab.detailsBasicStatusButton()).toHaveText('Not verified');
        });

        await test.step(`Нажать на выпадающий список "Status", выбрать "Verified"`, async () => {
            await authorizedProfilePage.userCommonInfoTab.setValueInStatusListboxInDetailsModule('Verified');
        });

        await test.step(`Нажать на выпадающий список "Role", выбрать "Administrator"`, async () => {
            await authorizedProfilePage.userCommonInfoTab.setValueInMainContainerRoleListbox('Administrator');
            await expect(authorizedProfilePage.userCommonInfoTab.mainContainerRoleButton()).toHaveText('Administrator');
        });

        await test.step(`Нажать на выпадающий список "Role", выбрать "User"`, async () => {
            await authorizedProfilePage.userCommonInfoTab.setValueInMainContainerRoleListbox("User");
        });

        await test.step(`Нажать на выпадающий список c несколькими значениями "Tags", снять выделение со всех активных значений, кликнуть на свободное пространство на странице`, async () => {
            await authorizedProfilePage.userCommonInfoTab.deleteValueInMainContainerTagsListbox();
        });

        await test.step(`Нажать на выпадающий список c несколькими значениями "Tags", выбрать значение, кликнуть на свободное пространство на странице`, async () => {
            await authorizedProfilePage.userCommonInfoTab.setValueInMainContainerTagsListbox(['VIP Bronze']);
            await expect(authorizedProfilePage.userCommonInfoTab.mainContainerTagsButton()).toHaveText('VIP Bronze');
        });

        await test.step(`Нажать на выпадающий список c несколькими значениями "Tags", снять выделение со всех активных значений, кликнуть на свободное пространство на странице`, async () => {
            await authorizedProfilePage.userCommonInfoTab.deleteValueInMainContainerTagsListbox();
        });

        await test.step(`Нажать на кнопку редактирования телефона ввести новый телефон, сохранить изменения`, async () => {
            await authorizedProfilePage.userCommonInfoTab.setValueInMainContainerPhoneInput(phoneNumber);
            await expect(authorizedProfilePage.userCommonInfoTab.mainContainerEditPhoneInput()).toHaveValue(phoneNumber);
        });

        await test.step(`Нажать на кнопку редактирования e-mail ввести новый e-mail, сохранить изменения`, async () => {
            await authorizedProfilePage.userCommonInfoTab.setValueInMainContainerEmailInput(email);
            await expect(authorizedProfilePage.userCommonInfoTab.mainContainerEditEmailInput()).toHaveValue(email);
        });

        await test.step(`Нажать на кнопку редактирования e-mail ввести старый e-mail, сохранить изменения`, async () => {
            await authorizedProfilePage.userCommonInfoTab.setValueInMainContainerEmailInput(dataForChange.email);
        });

        await test.step(`Нажать на кнопку редактирования max-bet ввести числовое значение, сохранить изменения`, async () => {
            await authorizedProfilePage.userCommonInfoTab.setValueInMainContainerMaxBet(ranomNumber);
            await expect(authorizedProfilePage.userCommonInfoTab.mainContainerEditMaxBetInput()).toHaveValue(ranomNumber);
        });
    });

    test('ADM-94 Отображение блока "Баланс" @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedProfilePage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Search by id/nickname`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
        });

        await test.step(`Ввести в поле имя пользователя и нажать "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', data.login);
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`В таблице пользователей нажать на иконку глаза в колонке "Profile" для пользователя`, async () => {
            const row = await authorizedUsersPage.tableBlock.findOrderRowByValue("name", data.login);
            await authorizedUsersPage.tableBlock.openProfileUserByOrder(row);
        });

        await test.step(`Нажать на дропдаун и проверить доступные валюты`, async () => {
            const values: string[] = await authorizedProfilePage.userCommonInfoTab.getValuesInBalanceList();
            expect(values).toContain('DEMO');
            expect(values).toContain('BTC');
        });
    });

    test('ADM-95 Пополнение баланса @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedProfilePage }) => {
        const sum = 0.05;
        const comment = "test";

        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Search by id/nickname`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
        });

        await test.step(`Ввести в поле имя пользователя и нажать "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', data.login);
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`В таблице пользователей нажать на иконку глаза в колонке "Profile" для пользователя`, async () => {
            const row = await authorizedUsersPage.tableBlock.findOrderRowByValue("name", data.login);
            await authorizedUsersPage.tableBlock.openProfileUserByOrder(row);
        });

        const oldValue = (await authorizedProfilePage.userCommonInfoTab.getCurrencyBalanceInBalanceList("BTC")).toFixed(2);

        await test.step(`Нажать на "Пополнить"`, async () => {
            await authorizedProfilePage.userCommonInfoTab.topUpButton().click();
        });

        await test.step(`Проверить значения по умолчанию`, async () => {
            await expect(authorizedProfilePage.userCommonInfoTab.profilePageTopUpBalanceWindow.depositWindow()).toBeVisible();
            await expect(authorizedProfilePage.userCommonInfoTab.profilePageTopUpBalanceWindow.depositCurrency()).toHaveText('INR');
            await expect(authorizedProfilePage.userCommonInfoTab.profilePageTopUpBalanceWindow.depositSum()).toHaveValue('0');
            await expect(authorizedProfilePage.userCommonInfoTab.profilePageTopUpBalanceWindow.depositTypeOfAccrual()).toHaveText('Normal');
            await expect(authorizedProfilePage.userCommonInfoTab.profilePageTopUpBalanceWindow.depositComment()).toHaveAttribute("placeholder", "Enter a comment for the transaction");
        });

        await test.step(`Нажать на "Отменить"`, async () => {
            await authorizedProfilePage.userCommonInfoTab.profilePageTopUpBalanceWindow.resetButton().click();
        });

        await test.step(`Пополнить баланс`, async () => {
            await authorizedProfilePage.userCommonInfoTab.topUpBalance('BTC', sum, 'Normal', comment);
            await expect(authorizedProfilePage.userCommonInfoTab.profilePageTopUpBalanceWindow.depositWindow()).not.toBeVisible();
        });

        await test.step(`Проверить изменение баланса после пополнения баланса`, async () => {
            const newValue = (await authorizedProfilePage.userCommonInfoTab.getCurrencyBalanceInBalanceList("BTC"));
            expect(Number(newValue) - Number(oldValue)).toBeGreaterThanOrEqual(0.05)
        });

        await test.step(`Нажать на "Пополнить" ничего не заполнять нажать на "Применить"`, async () => {
            await authorizedProfilePage.userCommonInfoTab.topUpButton().click();
            await authorizedProfilePage.userCommonInfoTab.profilePageTopUpBalanceWindow.applyButton().click();
            expect(await authorizedProfilePage.userCommonInfoTab.profilePageTopUpBalanceWindow.alertsInWindows().nth(0).innerText()).toContain('amount: Number must be greater than 0');
            expect(await authorizedProfilePage.userCommonInfoTab.profilePageTopUpBalanceWindow.alertsInWindows().nth(1).innerText()).toContain('comment: String must contain at least 1 character(s)');
            await authorizedProfilePage.userCommonInfoTab.profilePageTopUpBalanceWindow.resetButton().click();
            await expect(authorizedProfilePage.userCommonInfoTab.profilePageTopUpBalanceWindow.depositWindow()).not.toBeVisible();
        });
        // let currencies: string[] = await authorizedProfilePage.userCommonInfoTab.getValuesInBalanceList();
        // let newCurrency: string = await authorizedProfilePage.userCommonInfoTab.topUpBalanceWithNewCurrency(currencies, sum, 'Normal', comment);
        // let newCurrencies: string[] = await authorizedProfilePage.userCommonInfoTab.getValuesInBalanceList();
        // await expect(newCurrencies).toContain(newCurrency);

        await test.step(`Списать баланс`, async () => {
            await authorizedProfilePage.userCommonInfoTab.writeOffBalance("BTC", sum, "Withdraw", comment);
        });
    });

    test('ADM-96 Списание с баланса @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedProfilePage }) => {
        const sum = 0.05;
        const comment = "test";

        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Search by id/nickname`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
        });

        await test.step(`Ввести в поле имя пользователя и нажать "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', data.login);
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`В таблице пользователей нажать на иконку глаза в колонке "Profile" для пользователя`, async () => {
            const row = await authorizedUsersPage.tableBlock.findOrderRowByValue("name", data.login);
            await authorizedUsersPage.tableBlock.openProfileUserByOrder(row);
        });

        await test.step(`Нажать на "Списать" и проверить доступные поля и их значения`, async () => {
            await authorizedProfilePage.userCommonInfoTab.writeOffButton().click();
            await expect(authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.writeOffWindow()).toBeVisible();
            await expect(authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.writeOffCurrency()).toHaveText('INR');
            await expect(authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.writeOffSum()).toHaveValue('0');
            await expect(authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.writeOffType()).toHaveText('Withdraw');
            await expect(authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.writeOffComment()).toHaveAttribute("placeholder", "Enter a comment for the transaction");
        });

        await test.step(`Закрыть окно`, async () => {
            await authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.resetButton().click();
        });

        let oldValue: string;

        await test.step(`Пополнить счет клиента`, async () => {
            await authorizedProfilePage.userCommonInfoTab.topUpBalance('BTC', sum, 'Normal', comment);
            oldValue = (await authorizedProfilePage.userCommonInfoTab.getCurrencyBalanceInBalanceList("BTC")).toFixed(2);
        });

        let newValue: number;

        await test.step(`Списать деньги со счета`, async () => {
            await authorizedProfilePage.userCommonInfoTab.writeOffBalance("BTC", sum, "Withdraw", comment);
            newValue = (await authorizedProfilePage.userCommonInfoTab.getCurrencyBalanceInBalanceList("BTC"));
            expect(Number(oldValue) - Number(newValue)).toBeGreaterThanOrEqual(0.05)
        });

        await test.step(`Нажать на "Списать", ввести сумму большую, чем есть на балансе, выбрать любой тип списания, заполнить комментарий произвольным текстом`, async () => {
            await authorizedProfilePage.userCommonInfoTab.writeOffButton().click();
            await authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.setValueInCurrencyList("BTC")
            await authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.setValueInWriteOffSum(Number(newValue) + sum);
            await authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.setValueInComment(comment);
            await authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.applyButton().click();
            expect(await authorizedProfilePage.userCommonInfoTab.profilePageTopUpBalanceWindow.alertsInWindows().innerText()).toContain('Not enough money in the account');
        });

        await test.step(`Нажать на "Списать", ввести сумму большую, чем есть на балансе, выбрать любой тип списания, заполнить комментарий произвольным текстом`, async () => {
            await authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.resetButton().click();
        });

        await test.step(`Нажать на "Списать", выбрать любую другую валюту, ввести любую сумму, выбрать любой тип списания, заполнить комментарий произвольным текстом, нажать на "Применить"`, async () => {
            const currencies: string[] = await authorizedProfilePage.userCommonInfoTab.getValuesInBalanceList();
            await authorizedProfilePage.userCommonInfoTab.writeOffButton().click();
            await authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.setNewValueInCurrencyList(currencies)
            await authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.setValueInWriteOffSum(sum);
            await authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.setValueInComment(comment);
            await authorizedProfilePage.userCommonInfoTab.profilePageWriteOffBalanceWindow.applyButton().click();
            expect(await authorizedProfilePage.userCommonInfoTab.profilePageTopUpBalanceWindow.alertsInWindows().innerText()).toContain('Not enough money in the account');
        });
    });
});