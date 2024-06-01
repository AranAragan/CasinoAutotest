import { expect, test } from "../../src/admin/base/pomFixture"
import moment from "moment";

test.describe("Проверки фильтров поиска истории вывода средств", () => {
    test("ADM-81 autotest.admin. В админке можно найти вывод в истории выводов средств по ID заявки @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
        });

        const id = "19189";

        await test.step(`Нажать на таб "Withdraw history"`, async () => {
            await authorizedWithdrawalsPage.openWithdrawHistoryTab();
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Withdraw ID`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addFilter('Withdraw ID');
        });

        await test.step(`Ввести в Withdraw id значение`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addValueInInputFilter('Search withdraw request by id', id);
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedWithdrawalsPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить таблицу`, async () => {
            const countRow = await authorizedWithdrawalsPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i < countRow; i += 2) {
                const requestId = await authorizedWithdrawalsPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Request ID");
                expect(requestId).toEqual(id);
            }
        });
    });

    test("ADM-82 autotest.admin. В админке можно найти вывод в истории выводов средств по ID пользователя @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
        });
        const userId = "222411";

        await test.step(`Нажать на таб "Withdraw history"`, async () => {
            await authorizedWithdrawalsPage.openWithdrawHistoryTab();
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр User ID`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addFilter('User ID');
        });

        await test.step(`Ввести в Search withdraw request by user id значение`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addValueInInputFilter('Search withdraw request by user id', userId);
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedWithdrawalsPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить таблицу`, async () => {
            const countRow = await authorizedWithdrawalsPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i < countRow; i += 2) {
                const userIDInTable = await authorizedWithdrawalsPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "User ID");
                expect(userIDInTable).toEqual(userId);
            }
        });
    });


    test("ADM-83 autotest.admin. В админке можно найти вывод в истории выводов средств по валюте @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
        });

        await test.step(`Нажать на таб "Withdraw history"`, async () => {
            await authorizedWithdrawalsPage.openWithdrawHistoryTab();
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Purse type`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addFilter('Purse type');
        });

        await test.step(`Выбрать в выпадающем списке "Purse type" пункт BRL`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addValueInDropdownFilter('Purse type', ['BTC'])
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedWithdrawalsPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить таблицу`, async () => {
            const countRow = await authorizedWithdrawalsPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i += 2) {
                const currency = await authorizedWithdrawalsPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Currency");
                expect(currency).toEqual('BTC');
            }
        });
    });

    test("ADM-80 autotest.admin. В админке можно найти вывод в истории выводов средств по дате создания заявки @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        const dateStart = moment("2023-06-1", "YYYY-MM-DD");
        const dateFinish = moment("2023-08-5", "YYYY-MM-DD");

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
        });

        await test.step(`Нажать на таб "Withdraw history"`, async () => {
            await authorizedWithdrawalsPage.openWithdrawHistoryTab();
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Created at`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addFilter('Created at');
        });

        await test.step(`Выбрать в data picker-е "Created at" две даты`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addTwoDateInDateFilter('Created at', 1, "June 2023", 5, "August 2023");
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedWithdrawalsPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить таблицу`, async () => {
            const countRow = await authorizedWithdrawalsPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i += 2) {
                const registeredAtValue = moment(await authorizedWithdrawalsPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Created date"), "DD-MM-YYYY HH:mm");
                const isBetween = moment(registeredAtValue).isBetween(dateStart, dateFinish);
                expect(isBetween).toBeTruthy();
            }
        });
    });

    test("ADM-86 autotest.admin. В админке можно найти вывод в истории выводов средств по сумме заявки @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
        });

        await test.step(`Нажать на таб "Withdraw history"`, async () => {
            await authorizedWithdrawalsPage.openWithdrawHistoryTab();
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Withdraw request amount`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addFilter('Withdraw request amount');
        });

        await test.step(`Ввести в Amount from значение`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addValueInInputFilter('Amount from', '1');
        });

        await test.step(`Ввести в Amount to значение`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addValueInInputFilter('Amount to', '10');
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedWithdrawalsPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить таблицу`, async () => {
            const countRow = await authorizedWithdrawalsPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i += 2) {
                const amount = (await authorizedWithdrawalsPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Request amount")).replace(',', '');
                expect(parseFloat(amount)).toBeGreaterThanOrEqual(1);
                expect(parseFloat(amount)).toBeLessThanOrEqual(10);
            }
        });
    });

    test("ADM-87 autotest.admin. В админке можно найти вывод в истории выводов средств по методу @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
        });

        await test.step(`Нажать на таб "Withdraw history"`, async () => {
            await authorizedWithdrawalsPage.openWithdrawHistoryTab();
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Method`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addFilter('Method');
        });

        await test.step(`Выбрать в выпадающем списке "Method" значение "Manual withdraw"`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addValueInDropdownFilter('Method', ['Manual withdraw'])
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedWithdrawalsPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить таблицу`, async () => {
            const countRow = await authorizedWithdrawalsPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i += 2) {
                const method = await authorizedWithdrawalsPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Method");
                expect(method).toEqual('Manual withdraw');
            }
        });
    });

    test("ADM-89 autotest.admin. В админке можно найти вывод в истории выводов средств по дате обработки заявки @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
        });

        const dateStart = moment("2023-06-1", "YYYY-MM-DD");
        const dateFinish = moment("2023-08-5", "YYYY-MM-DD");

        await test.step(`Нажать на таб "Withdraw history"`, async () => {
            await authorizedWithdrawalsPage.openWithdrawHistoryTab();
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Processed at`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addFilter('Processed at');
        });

        await test.step(`Выбрать в data picker-е "Processed at" две даты`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addTwoDateInDateFilter('Processed at', 1, "June 2023", 5, "August 2023");
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedWithdrawalsPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить таблицу`, async () => {
            const countRow = await authorizedWithdrawalsPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i += 1) {
                const cellValue = await authorizedWithdrawalsPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Proceed date");
                if (cellValue != '') {
                    const proceedAtValue = moment(cellValue, "DD-MM-YYYY HH:mm");
                    const isBetween = moment(proceedAtValue).isBetween(dateStart, dateFinish);
                    expect(isBetween).toBeTruthy();
                }
            }
        });
    });
})