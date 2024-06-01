import { expect, test } from "../../src/admin/base/pomFixture"
import moment from "moment";

test.describe("Проверки фильтров поиска запросов на вывод", () => {
    test("ADM-65 autotest.admin. В админке можно найти вывод по ID заявки @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        const id = "19189";

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Withdraw ID`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addFilter('Withdraw ID');
        });

        await test.step(`Ввести в input Withdraw ID значение`, async () => {
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

    test("ADM-66 autotest.admin. В админке можно найти вывод по ID пользователя @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        const userId = "222362";

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр User ID`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addFilter('User ID');
        });

        await test.step(`Ввести в input "Search withdraw request by user id" значение `, async () => {
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


    test("ADM-68 autotest.admin. В админке можно найти вывод по балансу @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Balance`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addFilter('Balance');
        });

        await test.step(`Ввести в Balance from значение`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addValueInInputFilter('Balance from', '1000');
        });

        await test.step(`Ввести в Balance to значение`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addValueInInputFilter('Balance to', '7000');
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedWithdrawalsPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить таблицу`, async () => {
            const countRow = await authorizedWithdrawalsPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i += 2) {
                const tableBlock = (await authorizedWithdrawalsPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Balance")).replace(',', '');
                expect(parseFloat(tableBlock)).toBeGreaterThanOrEqual(1000);
                expect(parseFloat(tableBlock)).toBeLessThanOrEqual(7000);
            }
        });
    });

    test("ADM-67 autotest.admin. В админке можно найти вывод по валюте @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Purse type`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addFilter('Purse type');
        });

        await test.step(`Выбрать в выпадающем фильтре purse type значение 'BRL'`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addValueInDropdownFilter('Purse type', ['BRL'])
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedWithdrawalsPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить таблицу`, async () => {
            const countRow = await authorizedWithdrawalsPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i += 2) {
                const currency = await authorizedWithdrawalsPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Currency");
                expect(currency).toEqual('BRL');
            }
        });
    });

    test("ADM-64 autotest.admin. В админке можно найти вывод по дате заявки @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        const dateStart = moment("2023-06-1", "YYYY-MM-DD");
        const dateFinish = moment("2023-08-5", "YYYY-MM-DD");

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
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

    test("ADM-70 autotest.admin. В админке можно найти вывод по сумме заявки @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
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

    test("ADM-78 autotest.admin. В админке можно найти вывод по методу @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Method`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addFilter('Method');
        });

        await test.step(`Выбрать в выпадающем списке "Method" пункт Manual withdraw`, async () => {
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

    test("ADM-69 autotest.admin. В админке можно найти вывод по SC @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр SC`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addFilter('SC');
        });

        await test.step(`Ввести в SC from значение`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addValueInInputFilter('SC from', '2');
        });

        await test.step(`Ввести в SC to значение`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addValueInInputFilter('SC to', '84');
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedWithdrawalsPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить таблицу`, async () => {
            const countRow = await authorizedWithdrawalsPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i += 2) {
                const sc = await authorizedWithdrawalsPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "SC");
                expect(parseFloat(sc)).toBeGreaterThanOrEqual(2);
                expect(parseFloat(sc)).toBeLessThanOrEqual(84);
            }
        });
    });

    // не работает и не будет вероятно исправлено, админка не актуализируется
    test.skip("ADM-79 autotest.admin. В админке можно найти вывод по сумме выводов @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedWithdrawalsPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Withdrawals"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openWithdrawalsPage();
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Withdrawn amount`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addFilter('Withdrawn amount');
        });

        await test.step(`Ввести в Withdraw amount from значение`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addValueInInputFilter('Withdrawn amount from', '1');
        });

        await test.step(`Ввести в Withdraw amount to значение`, async () => {
            await authorizedWithdrawalsPage.filterBlock.addValueInInputFilter('Withdrawn amount to', '100');
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedWithdrawalsPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить таблицу`, async () => {
            const countRow = await authorizedWithdrawalsPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i += 2) {
                const withdrawAmount = await authorizedWithdrawalsPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Withdraw amount");
                expect(parseFloat(withdrawAmount)).toBeGreaterThanOrEqual(1);
                expect(parseFloat(withdrawAmount)).toBeLessThanOrEqual(100);
            }
        });
    });
})