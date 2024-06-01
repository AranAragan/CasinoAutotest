import { expect, test } from "../../src/admin/base/pomFixture"
import moment from "moment";

test.describe("Проверки фильтров поиска пользователей", () => {
    test('ADM-2 SMOKE.Очистка фильтра через "Сбросить все" @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        let countRow;

        await test.step(`Открыть произвольный раздел`, async () => {
            const userId = "222362";
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', userId);
            await authorizedUsersPage.filterBlock.filterApplyButton().click();

            countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toEqual(1);
        });

        await test.step(`Нажать кнопку "Сбросить все"`, async () => {
            await authorizedUsersPage.filterBlock.filterClearAllButton().click();
        });

        await test.step(`Данные обновлены`, async () => {
            countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toEqual(10);

            expect(await authorizedUsersPage.filterBlock.filterAccordionList().count()).toEqual(0);
        });
    });

    test('ADM-3 SMOKE.Очистка фильтра через крестик @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        const userId = "222362";

        let countRow;
        await test.step(`Открыть произвольный раздел`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', userId);
            await authorizedUsersPage.filterBlock.filterApplyButton().click();

            countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toEqual(1);
        });

        await test.step(`Нажать на крестик справа от фильтра`, async () => {
            await authorizedUsersPage.filterBlock.deleteInputFilter('Search by id/nickname');
        });

        await test.step(`Нажать "Применить"`, async () => {
            countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toEqual(10);
        });
    });

    test("ADM-8 Админ удаляет чипсик @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });


        await test.step(`Добавить произвольный фильтр`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Status');
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Status', ['Freeze'])

            await authorizedUsersPage.filterBlock.addFilter('Role');
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Role', ['Cashup'])

            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        const countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
        expect(countRow).toBeGreaterThanOrEqual(1);

        for (let i = 1; i <= countRow; i++) {
            const roleBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Role"));
            expect(roleBlock).toEqual("Cashup");
            const statusBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Status"));
            expect(statusBlock).toEqual("Freeze");
        }

        await test.step(`Нажать на кнопку с изображением крестика, которая расположена рядом с соответствующим чипсиком`, async () => {
            await authorizedUsersPage.filterBlock.deleteFilterInAccordion('Cashup');
            await authorizedUsersPage.filterBlock.deleteFilterInAccordion('Role');
        });

        expect(await authorizedUsersPage.filterBlock.filterAccordionList().count()).toEqual(1);
        const newCountRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
        expect(newCountRow).toBeGreaterThan(countRow);

        await test.step(`Удалить оставшиеся фильтры`, async () => {
            await authorizedUsersPage.filterBlock.deleteFilterInAccordion('Freeze');
            await authorizedUsersPage.filterBlock.deleteFilterInAccordion('Status');

            expect(await authorizedUsersPage.filterBlock.filterAccordionList().count()).toEqual(0);
        });
    });

    test("ADM-9 Админ удаляет фильтр @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        let countRow: number;
        await test.step(`Добавить любые фильтры`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Status');
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Status', ['Freeze'])

            await authorizedUsersPage.filterBlock.addFilter('Role');
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Role', ['Cashup'])

            await authorizedUsersPage.filterBlock.filterApplyButton().click();

            countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i++) {
                const roleBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Role"));
                expect(roleBlock).toEqual("Cashup");
                const statusBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Status"));
                expect(statusBlock).toEqual("Freeze");
            }
        });

        await test.step(`Нажать на кнопку с изображением крестика, которая расположена рядом с соответствующим фильтром`, async () => {
            await authorizedUsersPage.filterBlock.deleteDropdownFilter('Role');
            expect(await authorizedUsersPage.filterBlock.filterAccordionList().count()).toEqual(1);
        });

        await test.step(`Нажать кнопку Apply`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Удаленный фильтр отменен`, async () => {
            const newCountRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(newCountRow).toBeGreaterThan(countRow);
        });

        await test.step(`Удалить последний фильтр и проверить его отмену`, async () => {
            await authorizedUsersPage.filterBlock.deleteDropdownFilter('Status');
            expect(await authorizedUsersPage.filterBlock.filterAccordionList().count()).toEqual(0);
        });
    });

    test("ADM-10 Админ сбрасывает все фильтры (ClearAll) @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Добавить любые фильтры`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Status');
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Status', ['Freeze'])

            await authorizedUsersPage.filterBlock.addFilter('Role');
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Role', ['Cashup'])

            await authorizedUsersPage.filterBlock.filterApplyButton().click();

            const countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i++) {
                const roleBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Role"));
                expect(roleBlock).toEqual("Cashup");
                const statusBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Status"));
                expect(statusBlock).toEqual("Freeze");
            }
        });

        await test.step(`Нажать на кнопку "Сбросить всё"`, async () => {
            await authorizedUsersPage.filterBlock.filterClearAllButton().click();
            expect(await authorizedUsersPage.filterBlock.filterAccordionList().count()).toEqual(0);
        });

        await test.step(`Добавить произвольный фильтр; не нажимать "Применить"`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Status');
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Status', ['Freeze'])

            await authorizedUsersPage.filterBlock.filterClearAllButton().click();
            expect(await authorizedUsersPage.filterBlock.filterAccordionList().count()).toEqual(0);
        });

        await test.step(`Нажать на "+ Добавить"`, async () => {
            await authorizedUsersPage.filterBlock.addFilterButton().click();
            await expect(authorizedUsersPage.filterBlock.addFilterList().getByText("Status")).toBeVisible();
        });
    });

    test("ADM-12 Админ скрыл активные фильтры @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Применить произвольный фильтр`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Status');
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Status', ['Freeze'])

            await authorizedUsersPage.filterBlock.addFilter('Role');
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Role', ['Cashup'])

            await authorizedUsersPage.filterBlock.filterApplyButton().click();
            expect(await authorizedUsersPage.filterBlock.countFiltersOnPage()).toEqual(2);
        });

        await test.step(`Нажать на кнопку с изображением стрелки, расположенную над основным содержимым страницы`, async () => {
            await authorizedUsersPage.filterBlock.hideOrOpenFilters();

            const countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i++) {
                const roleBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Role"));
                expect(roleBlock).toEqual("Cashup");
                const statusBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Status"));
                expect(statusBlock).toEqual("Freeze");
            }

            expect(await authorizedUsersPage.filterBlock.countFiltersOnPage()).toEqual(0);
        });

        await test.step(`Развернуть список фильтров`, async () => {
            await authorizedUsersPage.filterBlock.hideOrOpenFilters();
            expect(await authorizedUsersPage.filterBlock.countFiltersOnPage()).toEqual(2);
        });
    });

    test("ADM-16 Админ очистил все данные фильтров (ClearValues) @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        let countRow: number;

        await test.step(`Установить фильтры Status и Role`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Status');
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Status', ['Freeze']);

            await authorizedUsersPage.filterBlock.addFilter('Role');
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Role', ['Cashup']);

            await authorizedUsersPage.filterBlock.filterApplyButton().click();

            countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i++) {
                const roleBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Role"));
                expect(roleBlock).toEqual("Cashup");
                const statusBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Status"));
                expect(statusBlock).toEqual("Freeze");
            }
        });

        await test.step(`Нажать на кнопку "ClearValues"`, async () => {
            await authorizedUsersPage.filterBlock.filterClearValues().click();

            for (let i = 1; i <= countRow; i++) {
                const roleBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Role"));
                expect(roleBlock).toEqual("Cashup");
                const statusBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Status"));
                expect(statusBlock).toEqual("Freeze");
            }

            await expect(authorizedUsersPage.filterBlock.filterAccordion().getByText("Role")).toBeVisible();
            await expect(authorizedUsersPage.filterBlock.filterAccordion().getByText("Status")).toBeVisible();
        });

        let idBeforeClearValues = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(1, "ID"));

        await test.step(`Нажать на кнопку "Применить""`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        let idAfterClearValues = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(1, "ID"));

        expect(idBeforeClearValues).not.toEqual(idAfterClearValues);

        await test.step(`Выбрать произвольное количество фильтров, не нажимать "Применить", нажать на кнопку "ClearValues"`, async () => {
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Status', ['Freeze']);
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Role', ['Cashup']);

            idBeforeClearValues = await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(1, "ID");

            await authorizedUsersPage.filterBlock.filterClearValues().click();

            idAfterClearValues = await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(1, "ID");
            expect(idBeforeClearValues).toEqual(idAfterClearValues);
        });
    });

    test("ADM-18 Проверка наличия всех необходимых фильтров на странице @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Перейти в админку`, async () => {
            await authorizedUsersPage.filterBlock.addFilterButton().click();
        });

        await test.step(`Визуально проверить отображение необходимых фильтров для раздела`, async () => {
            await expect(authorizedUsersPage.filterBlock.addFilterList().locator('li')).toContainText(["Search by id/nickname", "Registered at", "Status", "Role", "Currency", "Balance", "Deposit sum", "SC"]);

            await authorizedUsersPage.selectLanguage("Русский");

            await authorizedUsersPage.filterBlock.addFilterButton().click();
            await expect(authorizedUsersPage.filterBlock.addFilterList().locator('li')).toContainText(["Поиск по id/nickname игрока", "Дата регистрации", "Статус", "Роль", "Валюта", "Баланс", "Сумма депозита", "SC", "Ставки на реальный баланс", "Есть депозиты"]);
        });
    });

    test("ADM-19 Сделать рефреш страницы и проверить отображение выбранных ранее фильтров @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Добавить несколько фильтров на странице`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Deposit sum');
        });

        let countRow: number;
        await test.step(`Ввести данные в фильтры и применить`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Deposit sum from', '5000');
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Deposit sum to', '11000');
            await authorizedUsersPage.filterBlock.filterApplyButton().click();

            countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i++) {
                const tableBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Deposits")).split('\n');
                const balance = tableBlock[tableBlock.length - 1];
                expect(parseFloat(balance)).toBeGreaterThanOrEqual(5000);
                expect(parseFloat(balance)).toBeLessThanOrEqual(11000);
            }
        });

        await test.step(`Сделать рефреш страницы`, async () => {
            await page.reload();
        });

        await test.step(`Совершить любое навигационное действие, например перейти в профиль игрока, затем вернуться обратно`, async () => {
            const countRowAfterReload = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toEqual(countRowAfterReload);

            for (let i = 1; i <= countRowAfterReload; i++) {
                const tableBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Deposits")).split('\n');
                const balance = tableBlock[tableBlock.length - 1];
                expect(parseFloat(balance)).toBeGreaterThanOrEqual(5000);
                expect(parseFloat(balance)).toBeLessThanOrEqual(11000);
            }
        });
    });

    test("ADM-22 Проверка фильтра Наличие депозитов @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Добавить фильтр Наличие депозитов`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Has deposits');
            await expect(authorizedUsersPage.filterBlock.filterAccordionList().getByText('Has deposits: All')).toBeVisible();
            await authorizedUsersPage.filterBlock.setBooleanValuesFilter("Has deposits", false, true);
        });

        let countRow: number;
        await test.step(`Нажать Apply`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
            const countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
          
            for (let i = 1; i <= countRow; i++) {
                const depositsBlock = await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Deposits");
                expect(depositsBlock).toEqual("–");
            }
            await expect(authorizedUsersPage.filterBlock.filterAccordionList().getByText('Has deposits: No')).toBeVisible();
        });

        await test.step(`Снять галочку с параметра YES, Нажать Apply`, async () => {
            await authorizedUsersPage.filterBlock.setBooleanValuesFilter("Has deposits", true, false);
            await authorizedUsersPage.filterBlock.filterApplyButton().click()

            for (let i = 1; i <= countRow; i++) {
                const depositsBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Deposits"));
                expect(depositsBlock).not.toEqual("–");
            }

            await expect(authorizedUsersPage.filterBlock.filterAccordionList().getByText('Has deposits: Yes')).toBeVisible();
        });

        await test.step(`Снять галочку с параметра YES`, async () => {
            await authorizedUsersPage.filterBlock.setBooleanValuesFilter("Has deposits", true, true);
            await expect(authorizedUsersPage.filterBlock.filterAccordionList().getByText('Has deposits: All')).toBeVisible();
        });
    });

    test("ADM-26 Проверка фильтра Ставки с р/счета @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Добавить фильтр Real balance bets`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Real balance bets');
            await expect(authorizedUsersPage.filterBlock.filterAccordionList().getByText('Real balance bets: All')).toBeVisible();
        });

        let countRow: number;
        await test.step(`Снять галочку с параметра YES, нажать Apply`, async () => {
            await authorizedUsersPage.filterBlock.setBooleanValuesFilter("Real balance bets", false, true);
            await authorizedUsersPage.filterBlock.filterApplyButton().click();

            countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i++) {
                const realBalanceCancelIcon = ((await authorizedUsersPage.tableBlock.findCellInRowByNumberAndColumnHeader(i, "RB")).locator('[data-testid="CancelIcon"]'));
                await expect(realBalanceCancelIcon).toBeVisible();
            }

            await expect(authorizedUsersPage.filterBlock.filterAccordionList().getByText('Real balance bets: No')).toBeVisible();
        });

        await test.step(`Поставить галочку YES, снять галочку с параметра NO, нажать Apply`, async () => {
            await authorizedUsersPage.filterBlock.setBooleanValuesFilter("Real balance bets", true, false);
            await authorizedUsersPage.filterBlock.filterApplyButton().click()

            for (let i = 1; i <= countRow; i++) {
                const realBalanceCheckCircleIcon = ((await authorizedUsersPage.tableBlock.findCellInRowByNumberAndColumnHeader(i, "RB")).locator('[data-testid="CheckCircleIcon"]'));
                await expect(realBalanceCheckCircleIcon).toBeVisible();
            }
        });

        await test.step(`Снять галочку с параметра YES`, async () => {
            await expect(authorizedUsersPage.filterBlock.filterAccordionList().getByText('Real balance bets: Yes')).toBeVisible();

            await authorizedUsersPage.filterBlock.setBooleanValuesFilter("Real balance bets", true, true);
            await expect(authorizedUsersPage.filterBlock.filterAccordionList().getByText('Real balance bets: All')).toBeVisible();
        });
    });


    test("ADM-57 autotest.admin. В админке можно найти пользователей по дате регистрации @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        const dateStart = moment("2023-06-1", "YYYY-MM-DD");
        const dateFinish = moment("2023-08-5", "YYYY-MM-DD");

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр registered at`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Registered at');
        });

        await test.step(`Выбрать в data picker-е "Registered at" две даты`, async () => {
            await authorizedUsersPage.filterBlock.addTwoDateInDateFilter('Registered at', 1, "June 2023", 5, "August 2023");
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить столбец "Registered at"`, async () => {
            const countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i++) {
                const registeredAtValue = moment(await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Registered at"), "DD-MM-YYYY HH:mm");
                const isBetween = moment(registeredAtValue).isBetween(dateStart, dateFinish);
                expect(isBetween).toBeTruthy();
            }
        });
    });

    test("ADM-58 autotest.admin. В админке можно найти пользователей по статусу @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Status`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Status');
        });

        await test.step(`Выбрать в выпадающем списке "Status" значение "Freeze"`, async () => {
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Status', ['Freeze'])
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить столбец "Status"`, async () => {
            const countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i++) {
                const status = await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Status");
                 expect(status).toEqual('Freeze');
            }
        });
    });

    test("ADM-59 autotest.admin. В админке можно найти пользователей по роли @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Role`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Role');
        });

        await test.step(`Выбрать в выпадающем списке "Role" значение "Administrator"`, async () => {
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Role', ['Administrator'])
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить столбец "Role"`, async () => {
            const countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i++) {
                const status = await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Role");
                expect(status).toEqual('Administrator');
            }
        });
    });

    test("ADM-60 autotest.admin. В админке можно найти пользователей по валюте @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Currency`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Currency');
        });

        await test.step(`Выбрать в выпадающем списке "Currency" значение "DOGE"`, async () => {
            await authorizedUsersPage.filterBlock.addValueInDropdownFilter('Currency', ['DOGE'])
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить столбец "Deposits"`, async () => {
            const countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            let boolean: boolean = false;
            for (let i = 1; i <= countRow; i++) {
                const deposit = await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Deposits");
                if (deposit.includes('DOGE')) {
                    boolean = true;
                    break;
                }
            }
            expect(boolean).toBeTruthy();
        });
    });

    test("ADM-61 autotest.admin. В админке можно найти пользователей по балансу @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Balance`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Balance');
        });

        await test.step(`Ввести в Balance from значение`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Balance from', '5000');
        });

        await test.step(`Ввести в Balance to значение`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Balance to', '11000');
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить столбец "Balance"`, async () => {
            const countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i++) {
                const tableBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Balance")).split('\n');
                const balance = tableBlock[tableBlock.length - 1];
                expect(parseFloat(balance)).toBeGreaterThanOrEqual(5000);
                expect(parseFloat(balance)).toBeLessThanOrEqual(11000);
            }
        });
    });

    test("ADM-62 autotest.admin. В админке можно найти пользователей по SC @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр SC`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('SC');
        });

        await test.step(`Ввести в SC from значение`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('SC from', '2');
        });

        await test.step(`Ввести в SC to значение`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('SC to', '84');
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить столбец "SC"`, async () => {
            const countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i++) {
                const sc = await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "SC");
                expect(parseFloat(sc)).toBeGreaterThanOrEqual(2);
                expect(parseFloat(sc)).toBeLessThanOrEqual(84);
            }
        });
    });

    test("ADM-63 autotest.admin. В админке можно найти пользователей по депозиту @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Deposit sum`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Deposit sum');
        });

        await test.step(`Ввести в Deposit sum from значение`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Deposit sum from', '5000');
        });

        await test.step(`Ввести в Deposit sum to значение`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Deposit sum to', '11000');
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить столбец "Deposit"`, async () => {
            const countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);

            for (let i = 1; i <= countRow; i++) {
                const tableBlock = (await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(i, "Deposits")).split('\n');
                const balance = tableBlock[tableBlock.length - 1];
                expect(parseFloat(balance)).toBeGreaterThanOrEqual(5000);
                expect(parseFloat(balance)).toBeLessThanOrEqual(11000);
            }
        });
    });

    test("ADM-101 autotest.admin. В админке можно найти пользователя по ID пользователя @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        const userId = "222362";

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Search by id/nickname`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
        });

        await test.step(`Ввести в input значение "Search withdraw request by user id"`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', userId);
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`Проверить таблицу`, async () => {
            const countRow = await authorizedUsersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toEqual(1);

            const userIDInTable = await authorizedUsersPage.tableBlock.findValueInRowByNumberAndColumnHeader(1, "ID");
            expect(userIDInTable).toEqual(userId);
        });
    });
})