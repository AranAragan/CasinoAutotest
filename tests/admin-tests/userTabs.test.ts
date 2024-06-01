import { expect, test } from "../../src/admin/base/pomFixture"
import * as data from "../../src/web/data/login-data.json"

test.describe("Проверки табов", () => {
    test("ADM-47 autotest.admin. В админке можно найти пользователя по имени и перейти в его профиль @regression @dev @admin", async ({ page, authorizedUsersPage, unauthorizedLoginPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Search by id/nickname`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
        });

        await test.step(`Ввести в поле имя пользователя`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', data.login);
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`В таблице пользователей нажать на иконку глаза в колонке "Profile" для выбранного пользователя`, async () => {
            const row = await authorizedUsersPage.tableBlock.findOrderRowByValue("name", data.login);
            await authorizedUsersPage.tableBlock.openProfileUserByOrder(row);
        });

    });

    test('ADM-48 autotest.admin. В открытом табе пользователя "Ставки на слоты" можно найти ставки пользователя @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedProfilePage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Search by id/nickname`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
        });

        await test.step(`Ввести в поле имя пользователя`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', data.login);
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`В таблице пользователей нажать на иконку глаза в колонке "Profile" для пользователя`, async () => {
            const row = await authorizedUsersPage.tableBlock.findOrderRowByValue("name", data.login);
            await authorizedUsersPage.tableBlock.openProfileUserByOrder(row);
        });

        await test.step(`Нажать на таб "Ставки на слоты"`, async () => {
            await authorizedProfilePage.openTab('Slot bids');
        });

        await test.step(`В таблице найти строку с валютой "BTC"`, async () => {
            const rowWithDeposit = await authorizedProfilePage.depositsTab.tableBlock.findOrderRowByValue('currency', 'BTC');
            await expect(authorizedProfilePage.depositsTab.tableBlock.findRowByOrder(rowWithDeposit)).toBeVisible();
        });
    });

    test('ADM-49 autotest.admin. В открытом табе пользователя "Ставки на спорт" можно найти ставки пользователя @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedProfilePage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Search by id/nickname`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
        });

        await test.step(`Ввести в поле имя пользователя`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', data.login);
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`В таблице пользователей нажать на иконку глаза в колонке "Profile"`, async () => {
            const row = await authorizedUsersPage.tableBlock.findOrderRowByValue("name", data.login);
            await authorizedUsersPage.tableBlock.openProfileUserByOrder(row);
        });

        await test.step(`Нажать на таб "Ставки на спорт"`, async () => {
            await authorizedProfilePage.openTab('Sport bids');
        });

        await test.step(`В таблице найти строку с валютой "BTC"`, async () => {
            const rowWithDeposit = await authorizedProfilePage.depositsTab.tableBlock.findOrderRowByValue('currency', 'BTC');
            await expect(authorizedProfilePage.depositsTab.tableBlock.findRowByOrder(rowWithDeposit)).toBeVisible();
        });
    });

    test('ADM-50 autotest.admin. В открытом табе пользователя "Выводы" можно найти выводы пользователя @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedProfilePage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Search by id/nickname`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
        });

        await test.step(`Ввести в поле имя пользователя`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', data.login);
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`В таблице пользователей нажать на иконку глаза в колонке "Profile"`, async () => {
            const row = await authorizedUsersPage.tableBlock.findOrderRowByValue("name", data.login);
            await authorizedUsersPage.tableBlock.openProfileUserByOrder(row);
        });

        await test.step(`Нажать на таб "Выводы"`, async () => {
            await authorizedProfilePage.openTab('Withdrawals');
        });

        await test.step(`В таблице найти строку с валютой "BTC"`, async () => {
            const rowWithDeposit = await authorizedProfilePage.depositsTab.tableBlock.findOrderRowByValue('currency', 'BTC');
            await expect(authorizedProfilePage.depositsTab.tableBlock.findRowByOrder(rowWithDeposit)).toBeVisible();
        });
    });

    // таб заблокирован - не доделан
    test.skip('ADM-51 autotest.admin. В открытом табе пользователя "Депозиты" можно найти депозиты пользователя @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedProfilePage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Search by id/nickname`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
        });

        await test.step(`Ввести в поле имя пользователя`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', data.login);
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`В таблице пользователей нажать на иконку глаза в колонке "Profile"`, async () => {
            const row = await authorizedUsersPage.tableBlock.findOrderRowByValue("name", data.login);
            await authorizedUsersPage.tableBlock.openProfileUserByOrder(row);
        });

        await test.step(`Нажать на таб "Депозиты"`, async () => {
            await authorizedProfilePage.openTab('Deposits');
        });

        await test.step(`В таблице найти строку со статусом Success`, async () => {
            const rowWithDeposit = await authorizedProfilePage.depositsTab.tableBlock.findOrderRowByValue('status', 'Success');
            await expect(authorizedProfilePage.depositsTab.tableBlock.findRowByOrder(rowWithDeposit)).toBeVisible();
        });
    });

    // таб заблокирован - не доделан
    test.skip('ADM-52 autotest.admin. В открытом табе пользователя "Список транзакций" можно найти транзакции пользователя @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedProfilePage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Search by id/nickname`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
        });

        await test.step(`Ввести в поле имя пользователя`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', data.login);
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`В таблице пользователей нажать на иконку глаза в колонке "Profile"`, async () => {
            const row = await authorizedUsersPage.tableBlock.findOrderRowByValue("name", data.login);
            await authorizedUsersPage.tableBlock.openProfileUserByOrder(row);
        });

        await test.step(`Нажать на таб "Список транзакций"`, async () => {
            await authorizedProfilePage.openTab('Transactions');
        });

        await test.step(`Найти строку с типом транзакции "Депозит"`, async () => {
            const rowWithDeposit = await authorizedProfilePage.depositsTab.tableBlock.findOrderRowByValue('Transaction type', 'Deposit');
            await expect(authorizedProfilePage.depositsTab.tableBlock.findRowByOrder(rowWithDeposit)).toBeVisible();
        });
    });

    // таб заблокирован - не доделан
    test.skip('ADM-53 autotest.admin. В открытом табе пользователя "Действия админа" можно найти действия админа @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedProfilePage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Search by id/nickname`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
        });

        await test.step(`Ввести в поле имя пользователя`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', data.login);
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`В таблице пользователей нажать на иконку глаза в колонке "Profile"`, async () => {
            const row = await authorizedUsersPage.tableBlock.findOrderRowByValue("name", data.login);
            await authorizedUsersPage.tableBlock.openProfileUserByOrder(row);
        });

        await test.step(`Нажать на таб "Действия админа"`, async () => {
            await authorizedProfilePage.openTab('Admin actions');
        });

        await test.step(`В таблице найти строку с действиями админа (переводами)`, async () => {
            const rowWithDeposit = await authorizedProfilePage.depositsTab.tableBlock.findOrderRowByValue('Employee action', 'Transfer');
            await expect(authorizedProfilePage.depositsTab.tableBlock.findRowByOrder(rowWithDeposit)).toBeVisible();
        });
    });

    // таб заблокирован - не доделан
    test.skip('ADM-54 autotest.admin. В открытом табе пользователя "Действия пользователя" можно найти действия пользователя @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedProfilePage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Search by id/nickname`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
        });

        await test.step(`Ввести в поле имя пользователя`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', data.login);
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`В таблице пользователей нажать на иконку глаза в колонке "Profile"`, async () => {
            const row = await authorizedUsersPage.tableBlock.findOrderRowByValue("name", data.login);
            await authorizedUsersPage.tableBlock.openProfileUserByOrder(row);
        });

        await test.step(`Нажать на таб "Действия пользователя"`, async () => {
            await authorizedProfilePage.openTab('User actions');
        });

        await test.step(`В таблице найти строку с действием пользователя "Регистрация"`, async () => {
            const rowWithDeposit = await authorizedProfilePage.depositsTab.tableBlock.findOrderRowByValue('User action', 'Регистрация');
            await expect(authorizedProfilePage.depositsTab.tableBlock.findRowByOrder(rowWithDeposit)).toBeVisible();
        });
    });

    // таб заблокирован - не доделан
    test.skip('ADM-55 autotest.admin. В открытом табе пользователя "Начисления и списания" можно найти начисления и списания пользователя @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedProfilePage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`Нажать на кнопку "Add filter" и выбрать фильтр Search by id/nickname`, async () => {
            await authorizedUsersPage.filterBlock.addFilter('Search by id/nickname');
        });

        await test.step(`Ввести в поле имя пользователя`, async () => {
            await authorizedUsersPage.filterBlock.addValueInInputFilter('Search by id/nickname', data.login);
        });

        await test.step(`Нажать на "Apply filters"`, async () => {
            await authorizedUsersPage.filterBlock.filterApplyButton().click();
        });

        await test.step(`В таблице пользователей нажать на иконку глаза в колонке "Profile"`, async () => {
            const row = await authorizedUsersPage.tableBlock.findOrderRowByValue("name", data.login);
            await authorizedUsersPage.tableBlock.openProfileUserByOrder(row);
        });

        await test.step(`Нажать на таб "Начисления и списания"`, async () => {
            await authorizedProfilePage.openTab('Deposits and withdrawals');
        });

        await test.step(`В таблице найти строку с типом транзакции "Депозит"`, async () => {
            const rowWithDeposit = await authorizedProfilePage.depositsTab.tableBlock.findOrderRowByValue('Transaction type', 'Deposit');
            await expect(authorizedProfilePage.depositsTab.tableBlock.findRowByOrder(rowWithDeposit)).toBeVisible();
        });
    });
})