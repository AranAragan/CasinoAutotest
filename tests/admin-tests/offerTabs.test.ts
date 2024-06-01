import { expect, test } from "../../src/admin/base/pomFixture"
import { Utils } from "../../utils/generators";

test.describe("Проверки офферов", () => {
    test('ADM-238 Открытие Раздела "Офферы" @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedOffersPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Офферы"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openOffersPage();
        });

        await test.step(`Изменить язык на русский"`, async () => {
            await authorizedUsersPage.selectLanguage("Русский");
        });

        await test.step(`Проверить отображение страницы`, async () => {
            const theadText = await authorizedOffersPage.tableBlock.theadElements().allInnerTexts();
            expect(theadText).toContain("НАЗВАНИЕ");
            expect(theadText).toContain("ТИП НАГРАДЫ");
            expect(theadText).toContain("НАГРАДА");
            expect(theadText).toContain("СУММА");
            expect(theadText).toContain("ГЕО");
            expect(theadText).toContain("ТИП АКТИВАЦИИ");
            expect(theadText).toContain("НАЧАЛО");
            expect(theadText).toContain("КОНЕЦ");
            expect(theadText).toContain("СТАТУС ОФФЕРА");
        });

        await test.step(`Проверить заполненность таблицы`, async () => {
            const countRow = await authorizedOffersPage.tableBlock.findCountRowsInTable();
            expect(countRow).toBeGreaterThanOrEqual(1);
        });

        await test.step(`Проверить наличие кнопок`, async () => {
            await expect(authorizedOffersPage.tableBlock.getCheckBoxInRow(1)).toBeVisible();
            await expect(authorizedOffersPage.createButton()).toBeVisible();
            await expect(authorizedOffersPage.selectAllCheckbox()).toBeVisible();
        });
    });

    test('ADM-237 Пагинация таблицы "Офферы" @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedOffersPage }) => {
        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Офферы"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openOffersPage();
        });

        await test.step(`Проверить отображение пагинатора`, async () => {
            expect(await authorizedOffersPage.paginator().innerText()).toEqual('10');
        });

        await test.step(`Проверить переключение пагинатора`, async () => {
            await authorizedOffersPage.changePaginatorValue(25);
            expect(await authorizedOffersPage.paginator().innerText()).toEqual('25');
        });

        await test.step(`Проверить переключение стрелок пагинатора (next)`, async () => {
            await expect(authorizedOffersPage.paginatorPrevButton()).toBeVisible();
            while (await authorizedOffersPage.paginatorNextButtonBlocked().isHidden()) {
                await authorizedOffersPage.paginatorNextButton().click();
            }
            await expect(authorizedOffersPage.paginatorNextButtonBlocked()).toBeVisible();
        });

        await test.step(`Проверить переключение стрелок пагинатора (prev)`, async () => {
            while (await authorizedOffersPage.paginatorPrevButtonBlocked().isHidden()) {
                await authorizedOffersPage.paginatorPrevButton().click();
            }
            await expect(authorizedOffersPage.paginatorPrevButtonBlocked()).toBeVisible();
        });
    });

    test('ADM-232 CJM UC создание оффера @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedOffersPage, authorizedOfferPage }) => {
        const nameOffer = Utils.generateRandomNumber(15);

        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Офферы"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openOffersPage();
        });

        await authorizedUsersPage.selectLanguage("Русский");

        await test.step(`Открыть окно созданния оффера`, async () => {
            await authorizedOffersPage.openCreateOfferWindow();
        });

        await test.step(`Ввести данные в tabs parameters`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(nameOffer);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency('BTC');
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount('23');
            await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit('10')
        });

        await test.step(`Перейти на таб "Сегменты пользователей"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
        });

        await test.step(`Перейти на таб "Параметры отыгрыша оффера"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
        });

        await test.step(`Заполнить поля на табе "Параметры отыгрыша оффера"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier("123");
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays("12");
        });

        await test.step(`Нажать на + возле "Отыгрыш по провайдерам"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
        });

        await test.step(`Выбрать произвольного провайдера и процент"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput("Ezugi");
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput("10");
        });

        await test.step(`Добавить дополнительного провайдера с помощью кнопки Add"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addProvider();
        });

        await test.step(`Удалить произвольного провайдера"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.deleteProvider(2);
        });

        await test.step(`Нажать "Применить"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
        });

        await test.step(`Нажать на + возле "Отыгрыш по слотам"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.openWageringSlotsWindow();
        });

        await test.step(`Выбрать слот с помощью чек бокса"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.clickOnGameCheckbox("Goblin Tower");
        });

        await test.step(`Нажать "Применить"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.applyWageringWindow();
        });

        await test.step(`Перейти в сегменты пользователей`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
        });

        await test.step(`Выбрать сегмент "Все пользователи`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
        });

        await test.step(`Нажать "Создать"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });

        await test.step(`Проверить открытие оффера`, async () => {
            expect(await authorizedOfferPage.nameOfferTitle().innerText()).toEqual(nameOffer)
        });
    });

    test('ADM-246 Создание оффера без заполнения обязательных полей @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedOffersPage, authorizedOfferPage }) => {
        const nameOffer = Utils.generateRandomNumber(15);

        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Офферы"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openOffersPage();
        });

        await authorizedUsersPage.selectLanguage("Русский");

        await test.step(`Открыть окно созданния оффера`, async () => {
            await authorizedOffersPage.openCreateOfferWindow();
        });

        await test.step(`Ввести данные в tabs parameters`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(nameOffer);
        });

        await test.step(`Нажать "Создать"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });

        await test.step(`Проверить отображение ошибок`, async () => {
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("reward.bonus.amount: Число должно быть больше 0");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("wagering.multiplier: Поле обязательно");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("wagering.period: Поле обязательно");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("deposit.min: Поле обязательно");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("segment: analyticStaticSegment field is required for analytic static segment type");
        });

        await test.step(`Заполнить "Валюта вознаграждения"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency('BTC');
        });

        await test.step(`Нажать "Создать"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });

        await test.step(`Проверить отображение ошибок`, async () => {
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("reward.bonus.amount: Число должно быть больше 0");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("wagering.multiplier: Поле обязательно");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("wagering.period: Поле обязательно");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("deposit.min: Поле обязательно");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("segment: analyticStaticSegment field is required for analytic static segment type");
        });

        await test.step(`Заполнить "Размер вознаграждения"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount('23');
        });

        await test.step(`Нажать "Создать"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });

        await test.step(`Проверить отображение ошибок`, async () => {
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("wagering.multiplier: Поле обязательно");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("wagering.period: Поле обязательно");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("deposit.min: Поле обязательно");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("segment: analyticStaticSegment field is required for analytic static segment type");
        });

        await test.step(`Заполнить поля на табе "Параметры отыгрыша оффера"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier("123");
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays("12");
        });

        await test.step(`Нажать "Создать"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });

        await test.step(`Проверить отображение ошибок`, async () => {
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("deposit.min: Поле обязательно");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("segment: analyticStaticSegment field is required for analytic static segment type");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("wagering.byProvidersBetPercent: Массив должен содержать как минимум 1 элемент");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("wagering.bySlotsBetPercent: Массив должен содержать как минимум 1 элемент");
        });

        await test.step(`Нажать на + возле "Отыгрыш по провайдерам"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
        });

        await test.step(`Выбрать произвольного провайдера и процент"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput("Ezugi");
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput("10");
        });

        await test.step(`Нажать "Применить"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
        });

        await test.step(`Нажать "Создать"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });

        await test.step(`Проверить отображение ошибок`, async () => {
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("deposit.min: Поле обязательно");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("segment: analyticStaticSegment field is required for analytic static segment type");
        });

        await test.step(`Перейти в сегменты пользователей`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
        });

        await test.step(`Выбрать сегмент "Все пользователи`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
        });

        await test.step(`Переключиться на "Параметры оффера"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.tabsParameters().click();
        });

        await test.step(`Заполнить "Мин. депозит"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit('10')
        });

        await test.step(`Нажать "Создать"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });

        await test.step(`Проверить открытие оффера`, async () => {
            expect(await authorizedOfferPage.nameOfferTitle().innerText()).toEqual(nameOffer)
        });
    });

    test('ADM-247 Нажатие на чекбос "Начислять сразу" @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedOffersPage, authorizedOfferPage }) => {
        const nameOffer = Utils.generateRandomNumber(15);

        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Офферы"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openOffersPage();
        });

        await authorizedUsersPage.selectLanguage("Русский");

        await test.step(`Открыть окно созданния оффера`, async () => {
            await authorizedOffersPage.openCreateOfferWindow();
        });


        await test.step(`Ввести данные в tabs parameters`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(nameOffer);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency('BTC');
        });

        await test.step(`Нажать "Создать"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });

        await test.step(`Проверить отображение ошибок`, async () => {
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("reward.bonus.amount: Число должно быть больше 0");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("wagering.multiplier: Поле обязательно");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("deposit.min: Поле обязательно");
        });

        await test.step(`Заполнить "Размер вознаграждения"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount('23');
        });

        await test.step(`Нажать "Создать"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });

        await test.step(`Проверить отображение ошибок`, async () => {
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("wagering.multiplier: Поле обязательно");
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("deposit.min: Поле обязательно");
        });

        await test.step(`Указать чек-бокс "Начислять сразу"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.clickWageringCheckbox();
        });


        await test.step(`Нажать "Создать"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });

        await test.step(`Проверить отображение ошибок`, async () => {
            expect(await authorizedOffersPage.createAndEditOfferWindow.alertMessages().allInnerTexts()).toContain("deposit.min: Поле обязательно");
        });

        await test.step(`Переключиться на "Параметры оффера"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.tabsParameters().click();
        });

        await test.step(`Заполнить "Мин. депозит"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit('10')
        });

        await test.step(`Перейти в сегменты пользователей`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
        });

        await test.step(`Выбрать сегмент "Все пользователи`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
        });

        await test.step(`Нажать "Создать"`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });

        await test.step(`Проверить открытие оффера`, async () => {
            expect(await authorizedOfferPage.nameOfferTitle().innerText()).toEqual(nameOffer)
        });
    });

    test('ADM-244 CJM Happy Path @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedOffersPage, authorizedOfferPage }) => {
        const nameOffer = Utils.generateRandomNumber(15);
        const rewardCurrency = 'BTC';
        const rewardAmount = '23';
        const minDeposit = '10';
        const wagerAmountMultiplier = '123';
        const wagerPeriodInDays = '12';
        const wageringByProvider = 'Ezugi';
        const wageringByProviderProcent = '10';
        const wageringBySlotsGame = 'Goblin Tower';

        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Офферы"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openOffersPage();
        });

        await authorizedUsersPage.selectLanguage("Русский");

        await test.step(`Создать оффер`, async () => {
            await authorizedOffersPage.openCreateOfferWindow();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(nameOffer);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit(minDeposit)
            await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
            await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
            await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier(wagerAmountMultiplier);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays(wagerPeriodInDays);
            await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput(wageringByProvider);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput(wageringByProviderProcent);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.openWageringSlotsWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.clickOnGameCheckbox(wageringBySlotsGame);
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });


        await test.step(`Перейти на страницу со списком офферов`, async () => {
            await authorizedOfferPage.backToOffersPage();
        });

        await test.step(`Открыть созданный оффер`, async () => {
            const orderRow = await authorizedOffersPage.tableBlock.findOrderRowByValue("Название", nameOffer);
            await authorizedOffersPage.openOffer(orderRow);
        });

        await test.step(`Проверить наличие всех элементов`, async () => {
            expect(await authorizedOfferPage.nameOfferTitle().innerText()).toEqual(nameOffer);
            await expect(authorizedOfferPage.backToOffersPageButton()).toBeVisible();
            expect(await authorizedOfferPage.statusTitle().innerText()).toEqual('DRAFT');
            await expect(authorizedOfferPage.editButton()).toBeVisible();
            await expect(authorizedOfferPage.offerParametersButton()).toBeVisible();
            await expect(authorizedOfferPage.usersSegmentsButton()).toBeVisible();
            await expect(authorizedOfferPage.offerWageringParametersButton()).toBeVisible();
        });

        await test.step(`Нажать на кнопку Действия`, async () => {
            await authorizedOfferPage.openActionMenu();
            await expect(authorizedOfferPage.actionListValues()).toHaveText(['Удалить оффер', 'Включить оффер']);
        });

        await test.step(`Нажать на кнопку Редактирование`, async () => {
            await authorizedOfferPage.openEditMenu();
            await expect(authorizedOfferPage.createAndEditOfferWindow.offerWindow()).toBeVisible();
        });

        await test.step(`Проверить содержимое таба Параметры оффера`, async () => {
            expect(await authorizedOffersPage.createAndEditOfferWindow.activateOfferWindowParameters.offerNameInput().inputValue()).toEqual(nameOffer);
            expect(await authorizedOffersPage.createAndEditOfferWindow.activateOfferWindowParameters.rewardCurrency().innerText()).toContain(rewardCurrency);
            expect(await authorizedOffersPage.createAndEditOfferWindow.activateOfferWindowParameters.rewardAmount().inputValue()).toEqual(rewardAmount);
            expect(await authorizedOffersPage.createAndEditOfferWindow.activateOfferWindowParameters.minDeposit().inputValue()).toEqual(minDeposit);
        });

        await test.step(`Проверить содержимое таба Сегменты пользователей`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
            expect(await authorizedOffersPage.createAndEditOfferWindow.activateOfferWindowUserSegments.segmentTypeSelected().innerText()).toEqual("Все пользователи");
        });

        await test.step(`Проверить содержимое таба Параметры отыгрыша Оффера`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
            expect(await authorizedOffersPage.createAndEditOfferWindow.activateOfferWindowWagerParams.wagerAmountMultiplier().inputValue()).toEqual(wagerAmountMultiplier);
            expect(await authorizedOffersPage.createAndEditOfferWindow.activateOfferWindowWagerParams.wagerPeriodInDays().inputValue()).toEqual(wagerPeriodInDays);
        });

        await test.step(`Нажать на "Смотреть все" в поле Отыгрыш по провайдерам`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
            expect(await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.providerInput().innerText()).toContain(wageringByProvider);
            expect(await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.percentInput().inputValue()).toEqual(wageringByProviderProcent);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.cancelChangesWageringWindow();
        });

        await test.step(`Нажать на "Смотреть все" в поле Отыгрыш по слотам`, async () => {
            await authorizedOffersPage.createAndEditOfferWindow.openWageringSlotsWindow();
            // expect(await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.gameIsChecked(wageringBySlotsGame)).toBeTruthy();
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.cancelChangesWageringWindow();
        });
    });

    test('ADM-242 Открытие офферов в разных статусах, чек actions @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedOffersPage, authorizedOfferPage }) => {
        const nameOffer = Utils.generateRandomNumber(15);
        const rewardCurrency = 'BTC';
        const rewardAmount = '23';
        const minDeposit = '10';
        const wagerAmountMultiplier = '123';
        const wagerPeriodInDays = '12';
        const wageringByProvider = 'Ezugi';
        const wageringByProviderProcent = '10';
        const wageringBySlotsGame = 'Goblin Tower';

        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Офферы"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openOffersPage();
        });

        await authorizedUsersPage.selectLanguage("Русский");

        await test.step(`Создать оффер`, async () => {
            await authorizedOffersPage.openCreateOfferWindow();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(nameOffer);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit(minDeposit)
            await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
            await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
            await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier(wagerAmountMultiplier);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays(wagerPeriodInDays);
            await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput(wageringByProvider);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput(wageringByProviderProcent);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.openWageringSlotsWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.clickOnGameCheckbox(wageringBySlotsGame);
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });


        await test.step(`Нажать на кнопку "Действия" и проверить доступные действия в статусе DRAFT`, async () => {
            await authorizedOfferPage.openActionMenu();
            await expect(authorizedOfferPage.actionListValues()).toHaveText(['Удалить оффер', 'Включить оффер']);
            await authorizedOfferPage.closeActionMenu();
        });

        await test.step(`Сменить статус на PENDING`, async () => {
            await authorizedOfferPage.changeOfferStatus('Включить оффер');
            await authorizedOfferPage.activateOffer();
        });

        await test.step(`Проверить смену статуса на PENDING`, async () => {
            expect(await authorizedOfferPage.statusTitle().innerText()).toEqual('PENDING');
        });

        await test.step(`Нажать на кнопку "Действия" и проверить доступные действия в статусе PENDING`, async () => {
            await authorizedOfferPage.openActionMenu();
            await expect(authorizedOfferPage.actionListValues()).toHaveText(['Запустить оффер', 'Выключить оффер']);
            await authorizedOfferPage.closeActionMenu();
        });

        await test.step(`Сменить статус на ACTIVE`, async () => {
            await authorizedOfferPage.changeOfferStatus('Запустить оффер');
            await authorizedOfferPage.startOffer();
        });

        await test.step(`Проверить смену статуса на ACTIVE`, async () => {
            expect(await authorizedOfferPage.statusTitle().innerText()).toEqual('ACTIVE');
            await expect(authorizedOfferPage.editButton()).not.toBeVisible();
        });

        await test.step(`Нажать на кнопку "Действия" и проверить доступные действия в статусе ACTIVE`, async () => {
            await authorizedOfferPage.openActionMenu();
            await expect(authorizedOfferPage.actionListValues()).toHaveText(['Отменить оффер']);
            await authorizedOfferPage.closeActionMenu();
        });

        await test.step(`Сменить статус на CANCEL`, async () => {
            await authorizedOfferPage.changeOfferStatus('Отменить оффер');
            await authorizedOfferPage.cancelOfferForInvalidValue("test string")
        });

        await test.step(`Открыть созданный оффер`, async () => {
            const orderRow = await authorizedOffersPage.tableBlock.findOrderRowByValue("Название", nameOffer);
            await authorizedOffersPage.openOffer(orderRow);
        });


        await test.step(`Нажать на кнопку "Действия" и проверить доступные действия в статусе CANCEL`, async () => {
            await authorizedOfferPage.openActionMenu();
            await expect(authorizedOfferPage.actionList(), "Кнопка действий не заблокирована в статусе Cancel").not.toBeVisible();
        });
    });

    test('ADM-216 CJM Включить оффер @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedOffersPage, authorizedOfferPage }) => {
        const nameOffer = Utils.generateRandomNumber(15);
        const rewardCurrency = 'BTC';
        const rewardAmount = '23';
        const minDeposit = '10';
        const wagerAmountMultiplier = '123';
        const wagerPeriodInDays = '12';
        const wageringByProvider = 'Ezugi';
        const wageringByProviderProcent = '10';
        const wageringBySlotsGame = 'Goblin Tower';

        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Офферы"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openOffersPage();
        });

        await authorizedUsersPage.selectLanguage("Русский");

        await test.step(`Создать оффер`, async () => {
            await authorizedOffersPage.openCreateOfferWindow();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(nameOffer);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit(minDeposit)
            await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
            await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
            await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier(wagerAmountMultiplier);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays(wagerPeriodInDays);
            await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput(wageringByProvider);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput(wageringByProviderProcent);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.openWageringSlotsWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.clickOnGameCheckbox(wageringBySlotsGame);
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });


        await test.step(`Перейти на страницу со списком офферов`, async () => {
            await authorizedOfferPage.backToOffersPage();
        });

        await test.step(`Открыть созданный оффер`, async () => {
            const orderRow = await authorizedOffersPage.tableBlock.findOrderRowByValue("Название", nameOffer);
            await authorizedOffersPage.openOffer(orderRow);
        });

        await test.step(`Сменить статус на PENDING`, async () => {
            await authorizedOfferPage.changeOfferStatus('Включить оффер');
            await authorizedOfferPage.activateOffer();
        });

        await test.step(`Проверить смену статуса на PENDING`, async () => {
            expect(await authorizedOfferPage.statusTitle().innerText()).toEqual('PENDING');
            await expect(authorizedOfferPage.editButton()).not.toBeVisible();
        });

    });

    test('ADM-218 CJM Выключить оффер @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedOffersPage, authorizedOfferPage }) => {
        const nameOffer = Utils.generateRandomNumber(15);
        const rewardCurrency = 'BTC';
        const rewardAmount = '23';
        const minDeposit = '10';
        const wagerAmountMultiplier = '123';
        const wagerPeriodInDays = '12';
        const wageringByProvider = 'Ezugi';
        const wageringByProviderProcent = '10';
        const wageringBySlotsGame = 'Goblin Tower';

        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Офферы"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openOffersPage();
        });

        await authorizedUsersPage.selectLanguage("Русский");

        await test.step(`Создать оффер`, async () => {
            await authorizedOffersPage.openCreateOfferWindow();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(nameOffer);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit(minDeposit)
            await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
            await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
            await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier(wagerAmountMultiplier);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays(wagerPeriodInDays);
            await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput(wageringByProvider);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput(wageringByProviderProcent);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.openWageringSlotsWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.clickOnGameCheckbox(wageringBySlotsGame);
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });


        await test.step(`Перейти на страницу со списком офферов`, async () => {
            await authorizedOfferPage.backToOffersPage();
        });

        await test.step(`Открыть созданный оффер`, async () => {
            const orderRow = await authorizedOffersPage.tableBlock.findOrderRowByValue("Название", nameOffer);
            await authorizedOffersPage.openOffer(orderRow);
        });

        await test.step(`Сменить статус на PENDING`, async () => {
            await authorizedOfferPage.changeOfferStatus('Включить оффер');
            await authorizedOfferPage.activateOffer();
        });

        await test.step(`Проверить смену статуса на PENDING`, async () => {
            expect(await authorizedOfferPage.statusTitle().innerText()).toEqual('PENDING');
            await expect(authorizedOfferPage.editButton()).not.toBeVisible();
        });

        await test.step(`Сменить статус на DRAFT`, async () => {
            await authorizedOfferPage.changeOfferStatus('Выключить оффер');
            await authorizedOfferPage.unactivateOffer();
        });

        await test.step(`Проверить смену статуса на DRAFT`, async () => {
            expect(await authorizedOfferPage.statusTitle().innerText()).toEqual('DRAFT');
        });
    });

    test('ADM-219 CJM CJM Offer cancelation @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedOffersPage, authorizedOfferPage }) => {
        const nameOffer = Utils.generateRandomNumber(15);
        const rewardCurrency = 'BTC';
        const rewardAmount = '23';
        const minDeposit = '10';
        const wagerAmountMultiplier = '123';
        const wagerPeriodInDays = '12';
        const wageringByProvider = 'Ezugi';
        const wageringByProviderProcent = '10';
        const wageringBySlotsGame = 'Goblin Tower';

        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Офферы"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openOffersPage();
        });

        await authorizedUsersPage.selectLanguage("Русский");

        await test.step(`Создать оффер`, async () => {
            await authorizedOffersPage.openCreateOfferWindow();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(nameOffer);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit(minDeposit)
            await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
            await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
            await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier(wagerAmountMultiplier);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays(wagerPeriodInDays);
            await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput(wageringByProvider);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput(wageringByProviderProcent);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.openWageringSlotsWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.clickOnGameCheckbox(wageringBySlotsGame);
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });


        await test.step(`Перейти на страницу со списком офферов`, async () => {
            await authorizedOfferPage.backToOffersPage();
        });

        await test.step(`Открыть созданный оффер`, async () => {
            const orderRow = await authorizedOffersPage.tableBlock.findOrderRowByValue("Название", nameOffer);
            await authorizedOffersPage.openOffer(orderRow);
        });

        await test.step(`Сменить статус на PENDING`, async () => {
            await authorizedOfferPage.changeOfferStatus('Включить оффер');
            await authorizedOfferPage.activateOffer();
        });


        await test.step(`Сменить статус на ACTIVE`, async () => {
            await authorizedOfferPage.changeOfferStatus('Запустить оффер');
            await authorizedOfferPage.startOffer();
        });

        await test.step(`Сменить статус на CANCEL`, async () => {
            await authorizedOfferPage.changeOfferStatus('Отменить оффер');
            await authorizedOfferPage.cancelOfferForInvalidValue("test string")
        });

        await test.step(`Открыть созданный оффер`, async () => {
            const orderRow = await authorizedOffersPage.tableBlock.findOrderRowByValue("Название", nameOffer);
            await authorizedOffersPage.openOffer(orderRow);
        });

        await test.step(`Проверить смену статуса на CANCELED`, async () => {
            expect(await authorizedOfferPage.statusTitle().innerText()).toEqual('CANCELED');
        });
    });

    test('ADM-220 CJM Запуск оффера @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedOffersPage, authorizedOfferPage }) => {
        const nameOffer = Utils.generateRandomNumber(15);
        const rewardCurrency = 'BTC';
        const rewardAmount = '23';
        const minDeposit = '10';
        const wagerAmountMultiplier = '123';
        const wagerPeriodInDays = '12';
        const wageringByProvider = 'Ezugi';
        const wageringByProviderProcent = '10';
        const wageringBySlotsGame = 'Goblin Tower';

        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Офферы"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openOffersPage();
        });

        await authorizedUsersPage.selectLanguage("Русский");

        await test.step(`Создать оффер`, async () => {
            await authorizedOffersPage.openCreateOfferWindow();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(nameOffer);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit(minDeposit)
            await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
            await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
            await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier(wagerAmountMultiplier);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays(wagerPeriodInDays);
            await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput(wageringByProvider);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput(wageringByProviderProcent);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.openWageringSlotsWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.clickOnGameCheckbox(wageringBySlotsGame);
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });


        await test.step(`Перейти на страницу со списком офферов`, async () => {
            await authorizedOfferPage.backToOffersPage();
        });

        await test.step(`Открыть созданный оффер`, async () => {
            const orderRow = await authorizedOffersPage.tableBlock.findOrderRowByValue("Название", nameOffer);
            await authorizedOffersPage.openOffer(orderRow);
        });

        await test.step(`Сменить статус на PENDING`, async () => {
            await authorizedOfferPage.changeOfferStatus('Включить оффер');
            await authorizedOfferPage.activateOffer();
        });

        await test.step(`Проверить смену статуса на PENDING`, async () => {
            expect(await authorizedOfferPage.statusTitle().innerText()).toEqual('PENDING');
            await expect(authorizedOfferPage.editButton()).not.toBeVisible();
        });

        await test.step(`Сменить статус на ACTIVE`, async () => {
            await authorizedOfferPage.changeOfferStatus('Запустить оффер');
            await authorizedOfferPage.startOffer();
        });

        await test.step(`Проверить смену статуса на ACTIVE`, async () => {
            expect(await authorizedOfferPage.statusTitle().innerText()).toEqual('ACTIVE');
            await expect(authorizedOfferPage.editButton()).not.toBeVisible();
        });
    });

    test('ADM-248 Удалить оффер из таблицы @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedOffersPage, authorizedOfferPage }) => {
        const nameOffer = Utils.generateRandomNumber(15);
        const rewardCurrency = 'BTC';
        const rewardAmount = '23';
        const minDeposit = '10';
        const wagerAmountMultiplier = '123';
        const wagerPeriodInDays = '12';
        const wageringByProvider = 'Ezugi';
        const wageringByProviderProcent = '10';
        const wageringBySlotsGame = 'Goblin Tower';

        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Офферы"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openOffersPage();
        });

        await authorizedUsersPage.selectLanguage("Русский");

        await test.step(`Создать оффер`, async () => {
            await authorizedOffersPage.openCreateOfferWindow();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(nameOffer);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit(minDeposit)
            await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
            await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
            await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier(wagerAmountMultiplier);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays(wagerPeriodInDays);
            await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput(wageringByProvider);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput(wageringByProviderProcent);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.openWageringSlotsWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.clickOnGameCheckbox(wageringBySlotsGame);
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });


        await test.step(`Перейти на страницу со списком офферов`, async () => {
            await authorizedOfferPage.backToOffersPage();
        });

        await test.step(`Удалить созданный оффер`, async () => {
            const orderRow = await authorizedOffersPage.tableBlock.findOrderRowByValue("Название", nameOffer);
            await authorizedOffersPage.deleteOffer(orderRow);
        });

        await test.step(`Проверить удаление оффера`, async () => {
            const orderRow = await authorizedOffersPage.tableBlock.findOrderRowByValue("Название", nameOffer);
            expect(orderRow).toEqual(-1);
        });
    });

    test('ADM-249 Удалить оффер из карточки оффера @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedOffersPage, authorizedOfferPage }) => {
        const nameOffer = Utils.generateRandomNumber(15);
        const rewardCurrency = 'BTC';
        const rewardAmount = '23';
        const minDeposit = '10';
        const wagerAmountMultiplier = '123';
        const wagerPeriodInDays = '12';
        const wageringByProvider = 'Ezugi';
        const wageringByProviderProcent = '10';
        const wageringBySlotsGame = 'Goblin Tower';

        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Офферы"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openOffersPage();
        });

        await authorizedUsersPage.selectLanguage("Русский");

        await test.step(`Создать оффер`, async () => {
            await authorizedOffersPage.openCreateOfferWindow();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(nameOffer);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit(minDeposit)
            await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
            await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
            await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier(wagerAmountMultiplier);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays(wagerPeriodInDays);
            await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput(wageringByProvider);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput(wageringByProviderProcent);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.openWageringSlotsWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.clickOnGameCheckbox(wageringBySlotsGame);
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });


        await test.step(`Удалить оффер на странице оффера`, async () => {
            await authorizedOfferPage.openActionMenu();
            await authorizedOfferPage.deleteOffer();
        });

        await test.step(`Удалить созданный оффер`, async () => {
            const orderRow = await authorizedOffersPage.tableBlock.findOrderRowByValue("Название", nameOffer);
            expect(orderRow).toEqual(-1);
        });
    });

    test('ADM-250 Попытка удалить оффер не в статусе DRAFT @regression @dev @admin', async ({ page, authorizedUsersPage, unauthorizedLoginPage, authorizedOffersPage, authorizedOfferPage }) => {
        const nameOffer = Utils.generateRandomNumber(15);
        const rewardCurrency = 'BTC';
        const rewardAmount = '23';
        const minDeposit = '10';
        const wagerAmountMultiplier = '123';
        const wagerPeriodInDays = '12';
        const wageringByProvider = 'Ezugi';
        const wageringByProviderProcent = '10';
        const wageringBySlotsGame = 'Goblin Tower';

        await test.step(`Перейти в админку`, async () => {
            await page.goto(process.env.ADMIN_URL!, { waitUntil: 'load' });
            await unauthorizedLoginPage.loginUser('admin_dev', 'qwerty');
        });

        await test.step(`В левом меню выбрать "Офферы"`, async () => {
            await authorizedUsersPage.mainLeftSidebar.openOffersPage();
        });

        await authorizedUsersPage.selectLanguage("Русский");

        await test.step(`Создать оффер`, async () => {
            await authorizedOffersPage.openCreateOfferWindow();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInOfferNameInput(nameOffer);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardCurrency(rewardCurrency);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInRewardAmount(rewardAmount);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInMinDeposit(minDeposit)
            await authorizedOffersPage.createAndEditOfferWindow.tabsUserSegments().click();
            await authorizedOffersPage.createAndEditOfferWindow.setSegmentTypeAll();
            await authorizedOffersPage.createAndEditOfferWindow.tabsWagerParams().click();
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerAmountMultiplier(wagerAmountMultiplier);
            await authorizedOffersPage.createAndEditOfferWindow.setValueInWagerPeriodInDays(wagerPeriodInDays);
            await authorizedOffersPage.createAndEditOfferWindow.openWageringProvidersWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.addValueInProviderInput(wageringByProvider);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.setValueInPercentInput(wageringByProviderProcent);
            await authorizedOffersPage.createAndEditOfferWindow.wageringByProvidersWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.openWageringSlotsWindow();
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.clickOnGameCheckbox(wageringBySlotsGame);
            await authorizedOffersPage.createAndEditOfferWindow.wageringBySlotsWindow.applyWageringWindow();
            await authorizedOffersPage.createAndEditOfferWindow.createOffer();
        });


        await test.step(`Сменить статус на PENDING`, async () => {
            await authorizedOfferPage.changeOfferStatus('Включить оффер');
            await authorizedOfferPage.activateOffer();
        });

        await test.step(`Проверить смену статуса на PENDING`, async () => {
            expect(await authorizedOfferPage.statusTitle().innerText()).toEqual('PENDING');
            await expect(authorizedOfferPage.editButton()).not.toBeVisible();
        });

        await test.step(`Проверить невозможность удаление оффера`, async () => {
            await authorizedOfferPage.openActionMenu();
            await expect(authorizedOfferPage.offerMenuDeleteButton(), 'Кнопка удаления отображается на странице').not.toBeVisible();
            await authorizedOfferPage.closeActionMenu();
        });

        await test.step(`Сменить статус на ACTIVE`, async () => {
            await authorizedOfferPage.changeOfferStatus('Запустить оффер');
            await authorizedOfferPage.startOffer();
        });

        await test.step(`Проверить смену статуса на ACTIVE`, async () => {
            expect(await authorizedOfferPage.statusTitle().innerText()).toEqual('ACTIVE');
            await expect(authorizedOfferPage.editButton()).not.toBeVisible();
        });

        await test.step(`Проверить невозможность удаление оффера`, async () => {
            await authorizedOfferPage.openActionMenu();
            await expect(authorizedOfferPage.offerMenuDeleteButton(), 'Кнопка удаления отображается на странице').not.toBeVisible();
            await authorizedOfferPage.closeActionMenu();
        });

        await test.step(`Сменить статус на CANCEL`, async () => {
            await authorizedOfferPage.changeOfferStatus('Отменить оффер');
            await authorizedOfferPage.cancelOfferForInvalidValue("test string")
        });

    });
});