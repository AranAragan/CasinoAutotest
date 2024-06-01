import { test, expect } from '@playwright/test';
import { RequestsBody } from './requestsBody';
import { handbookAppRpcClient } from './grpc-client';
import { firstValueFrom } from 'rxjs'
import { handbookApp } from '@greencodeorg/handbook-rpc/nest-client'

test.describe('Базовые сценарии сервиса новых справочников', () => {
    test('FB-119 Добавить валюту (happy path)', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        const createCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));
        expect(createCurrency.data?.currency?.code, 'Код не совпадает с отправленным').toEqual(requestsBody.code.toUpperCase());
        expect(createCurrency.data?.currency?.availableForRegistration, 'Доступность для регистрации не совпадает с отправленным').toBeFalsy();
        expect(createCurrency.data?.currency?.availableForWallet, 'Доступность для кошелька не совпадает с отправленным').toBeFalsy();
        expect(createCurrency.data?.currency?.name, 'Имя не совпадает с отправленным').toEqual(requestsBody.code);
        expect(createCurrency.data?.currency?.legacyId, 'Legacy id не совпадает с отправленным').toEqual(0);
        expect(createCurrency.data?.currency?.status, 'Status не совпадает со статусом "Создано"').toEqual(0);
        expect(createCurrency.data?.currency?.type, 'Type не совпадает с отправленной валютой').toEqual(1);
        expect(createCurrency.data?.currency?.unit, 'Точность (unit) не совпадает с отправленной').toEqual(0);

        const deleteBody = requestsBody.deleteCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.delete(deleteBody));
    });

    test('FB-120 Изменить валюту (happy path)', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const changeBody = requestsBody.changeCurrency;
        const changeCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.change(changeBody));
        expect(changeCurrency.data?.currency?.code, 'Код не совпадает с отправленным').toEqual(requestsBody.code.toUpperCase());
        expect(changeCurrency.data?.currency?.availableForRegistration, 'Доступность для регистрации не совпадает с отправленным').toBeFalsy();
        expect(changeCurrency.data?.currency?.availableForWallet, 'Доступность для кошелька не совпадает с отправленным').toBeTruthy();
        expect(changeCurrency.data?.currency?.name, 'Имя не совпадает с отправленным').toEqual(requestsBody.code);
        expect(changeCurrency.data?.currency?.legacyId, 'Legacy id не совпадает с отправленным').toEqual(0);
        expect(changeCurrency.data?.currency?.status, 'Status не совпадает со статусом "Создано"').toEqual(0);
        expect(changeCurrency.data?.currency?.type, 'Type не совпадает с отправленной валютой').toEqual(1);
        expect(changeCurrency.data?.currency?.unit, 'Точность (unit) не совпадает с отправленной').toEqual(0);

        const deleteBody = requestsBody.deleteCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.delete(deleteBody));
    });

    test('FB-121 Удалить валюту (happy path)', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const deleteBody = requestsBody.deleteCurrency;
        const deleteCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.delete(deleteBody));
        expect(deleteCurrency.data?.status, 'Валюта не удалена, статус != true').toBeTruthy();
    });

    test('FB-122 Скрыть валюту (happy path)', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const activateBody = requestsBody.activateCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody))

        const publishBody = requestsBody.publishCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.publish(publishBody));

        const hideBody = requestsBody.hideCurrency;
        const hideCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.hide(hideBody));

        expect(hideCurrency.data?.currency?.code, 'Код не совпадает с отправленным').toEqual(requestsBody.code.toUpperCase());
        expect(hideCurrency.data?.currency?.availableForRegistration, 'Доступность для регистрации не совпадает с отправленным').toBeFalsy();
        expect(hideCurrency.data?.currency?.availableForWallet, 'Доступность для кошелька не совпадает с отправленным').toBeFalsy();
        expect(hideCurrency.data?.currency?.name, 'Имя не совпадает с отправленным').toEqual(requestsBody.code);
        expect(hideCurrency.data?.currency?.legacyId, 'Legacy id не совпадает с отправленным').toEqual(0);
        expect(hideCurrency.data?.currency?.status, 'Status не совпадает со статусом "Активным"').toEqual(1);
        expect(hideCurrency.data?.currency?.type, 'Type не совпадает с отправленной валютой').toEqual(1);
        expect(hideCurrency.data?.currency?.unit, 'Точность (unit) не совпадает с отправленной').toEqual(0);

        const archiveBody = requestsBody.archiveCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));
    });

    test('FB-123 Активировать валюту (happy path)', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const activateBody = requestsBody.activateCurrency;
        const activateCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));

        expect(activateCurrency.data?.currency?.code, 'Код не совпадает с отправленным').toEqual(requestsBody.code.toUpperCase());
        expect(activateCurrency.data?.currency?.availableForRegistration, 'Доступность для регистрации не совпадает с отправленным').toBeFalsy();
        expect(activateCurrency.data?.currency?.availableForWallet, 'Доступность для кошелька не совпадает с отправленным').toBeFalsy();
        expect(activateCurrency.data?.currency?.name, 'Имя не совпадает с отправленным').toEqual(requestsBody.code);
        expect(activateCurrency.data?.currency?.legacyId, 'Legacy id не совпадает с отправленным').toEqual(0);
        expect(activateCurrency.data?.currency?.status, 'Status не совпадает со статусом "Активным"').toEqual(1);
        expect(activateCurrency.data?.currency?.type, 'Type не совпадает с отправленной валютой').toEqual(1);
        expect(activateCurrency.data?.currency?.unit, 'Точность (unit) не совпадает с отправленной').toEqual(0);

        const archiveBody = requestsBody.archiveCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));
    });

    test('FB-125 Архивировать валюту (happy path)', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const activateBody = requestsBody.activateCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));

        const archiveBody = requestsBody.archiveCurrency;
        const archiveCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));

        expect(archiveCurrency.data?.currency?.code, 'Код не совпадает с отправленным').toEqual(requestsBody.code.toUpperCase());
        expect(archiveCurrency.data?.currency?.availableForRegistration, 'Доступность для регистрации не совпадает с отправленным').toBeFalsy();
        expect(archiveCurrency.data?.currency?.availableForWallet, 'Доступность для кошелька не совпадает с отправленным').toBeFalsy();
        expect(archiveCurrency.data?.currency?.name, 'Имя не совпадает с отправленным').toEqual(requestsBody.code);
        expect(archiveCurrency.data?.currency?.legacyId, 'Legacy id не совпадает с отправленным').toEqual(0);
        expect(archiveCurrency.data?.currency?.status, 'Status не совпадает со статусом "Архивирован"').toEqual(3);
        expect(archiveCurrency.data?.currency?.type, 'Type не совпадает с отправленной валютой').toEqual(1);
        expect(archiveCurrency.data?.currency?.unit, 'Точность (unit) не совпадает с отправленной').toEqual(0);
    });

    test('FB-126 Опубликовать валюту (happy path)', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const activateBody = requestsBody.activateCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));

        const publishBody = requestsBody.publishCurrency;
        const publishCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.publish(publishBody));

        expect(publishCurrency.data?.currency?.code, 'Код не совпадает с отправленным').toEqual(requestsBody.code.toUpperCase());
        expect(publishCurrency.data?.currency?.availableForRegistration, 'Доступность для регистрации не совпадает с отправленным').toBeFalsy();
        expect(publishCurrency.data?.currency?.availableForWallet, 'Доступность для кошелька не совпадает с отправленным').toBeFalsy();
        expect(publishCurrency.data?.currency?.name, 'Имя не совпадает с отправленным').toEqual(requestsBody.code);
        expect(publishCurrency.data?.currency?.legacyId, 'Legacy id не совпадает с отправленным').toEqual(0);
        expect(publishCurrency.data?.currency?.status, 'Status не совпадает со статусом "Опубликованным"').toEqual(2);
        expect(publishCurrency.data?.currency?.type, 'Type не совпадает с отправленной валютой').toEqual(1);
        expect(publishCurrency.data?.currency?.unit, 'Точность (unit) не совпадает с отправленной').toEqual(0);

        const hideBody = requestsBody.hideCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.hide(hideBody));

        const archiveBody = requestsBody.archiveCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));
    });

    test('FB-127 Повторное добавление валюты', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        let createCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        createCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));
        expect(createCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_ALREADY_EXISTS);
        expect(createCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта с таким кодом уже существуует');

        const deleteBody = requestsBody.deleteCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.delete(deleteBody));
    });

    test('FB-128 Повторное удаление валюты', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const deleteBody = requestsBody.deleteCurrency;
        let deleteCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.delete(deleteBody));

        deleteCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.delete(deleteBody));
        expect(deleteCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_NOT_FOUND);
        expect(deleteCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не найдена');
    });

    test('FB-129 Повторное скрытие валюты', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const activateBody = requestsBody.activateCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));

        const publishBody = requestsBody.publishCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.publish(publishBody));

        const hideBody = requestsBody.hideCurrency;
        let hideCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.hide(hideBody));

        hideCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.hide(hideBody));
        expect(hideCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_HIDDEN);
        expect(hideCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Не может быть скрыта');

        const archiveBody = requestsBody.archiveCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));
    });

    test('FB-134 Повторно активировать валюту', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const activateBody = requestsBody.activateCurrency;
        let activateCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));
        activateCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));

        expect(activateCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_ACTIVATED);
        expect(activateCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть активирована');

        const archiveBody = requestsBody.archiveCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));
    });

    test('FB-135 Повторное архивирование валюты', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const activateBody = requestsBody.activateCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));

        const archiveBody = requestsBody.archiveCurrency;
        let archiveCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));
        archiveCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));

        expect(archiveCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_ARCHIVED);
        expect(archiveCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть заархивирована');
    });

    test('FB-136 Повторно опубликовать валюту', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const activateBody = requestsBody.activateCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));

        const publishBody = requestsBody.publishCurrency;
        let publishCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.publish(publishBody));
        publishCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.publish(publishBody));
        
        expect(publishCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_PUBLISHED);
        expect(publishCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть опубликована');

        const hideBody = requestsBody.hideCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.hide(hideBody));

        const archiveBody = requestsBody.archiveCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));
    });

    test('FB-140 Недоступные действия для созданной валюты', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const archiveBody = requestsBody.archiveCurrency;
        const archiveCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));
        expect(archiveCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_ARCHIVED);
        expect(archiveCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть заархивирована');

        const publishBody = requestsBody.publishCurrency;
        const publishCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.publish(publishBody));
        expect(publishCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_PUBLISHED);
        expect(publishCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть опубликована');

        const hideBody = requestsBody.hideCurrency;
        const hideCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.hide(hideBody));
        expect(hideCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_HIDDEN);
        expect(hideCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Не может быть скрыта');
    });

    test('FB-141 Недоступные действия для измененной валюты', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const changeBody = requestsBody.changeCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.change(changeBody));

        const archiveBody = requestsBody.archiveCurrency;
        const archiveCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));
        expect(archiveCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_ARCHIVED);
        expect(archiveCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть заархивирована');
        
        const publishBody = requestsBody.publishCurrency;
        const publishCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.publish(publishBody));
        expect(publishCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_PUBLISHED);
        expect(publishCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть опубликована');

        const hideBody = requestsBody.hideCurrency;
        const hideCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.hide(hideBody));
        expect(hideCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_HIDDEN);
        expect(hideCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Не может быть скрыта');
    });

    test('FB-142 Недоступные действия для удаленной валюты', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const deleteBody = requestsBody.deleteCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.delete(deleteBody));

        const archiveBody = requestsBody.archiveCurrency;
        const archiveCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));
        expect(archiveCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_NOT_FOUND);
        expect(archiveCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не найдена');

        const publishBody = requestsBody.publishCurrency;
        const publishCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.publish(publishBody));
        expect(publishCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_NOT_FOUND);
        expect(publishCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не найдена');

        const hideBody = requestsBody.hideCurrency;
        const hideCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.hide(hideBody));
        expect(hideCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_NOT_FOUND);
        expect(hideCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не найдена');

        const activateBody = requestsBody.activateCurrency;
        const activateCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));
        expect(activateCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_NOT_FOUND);
        expect(activateCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не найдена');
    });

    test('FB-143 Недоступные действия для скрытой валюты', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const activateBody = requestsBody.activateCurrency;
        let activateCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));

        const publishBody = requestsBody.publishCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.publish(publishBody));

        const hideBody = requestsBody.hideCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.hide(hideBody));
        
        activateCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));
        expect(activateCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_ACTIVATED);
        expect(activateCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть активирована');

        const deleteBody = requestsBody.deleteCurrency;
        const deleteCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.delete(deleteBody));

        expect(deleteCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_DELETED);
        expect(deleteCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть удалена');
    });

    test('FB-144 Недоступные действия для активированной валюты', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const activateBody = requestsBody.activateCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));

        const hideBody = requestsBody.hideCurrency;
        const hideCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.hide(hideBody));
        expect(hideCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_HIDDEN);
        expect(hideCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Не может быть скрыта');

        const deleteBody = requestsBody.deleteCurrency;
        const deleteCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.delete(deleteBody));

        expect(deleteCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_DELETED);
        expect(deleteCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть удалена');
    });

    test('FB-145 Недоступные действия для архивированной валюты', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const activateBody = requestsBody.activateCurrency;
        let activateCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));

        const archiveBody = requestsBody.archiveCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));

        const hideBody = requestsBody.hideCurrency;
        const hideCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.hide(hideBody));
        expect(hideCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_HIDDEN);
        expect(hideCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Не может быть скрыта');

        const deleteBody = requestsBody.deleteCurrency;
        const deleteCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.delete(deleteBody));
        expect(deleteCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_DELETED);
        expect(deleteCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть удалена');

        activateCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));
        expect(activateCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_ACTIVATED);
        expect(activateCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть активирована');

        const publishBody = requestsBody.publishCurrency;
        const publishCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.publish(publishBody));
        expect(publishCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_PUBLISHED);
        expect(publishCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть опубликована');
    });

    test('FB-146 Недоступные действия для опубликованной валюты', async () => {
        const requestsBody = new RequestsBody();
        const addBody = requestsBody.addCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.add(addBody));

        const activateBody = requestsBody.activateCurrency;
        let activateCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));

        const publishBody = requestsBody.publishCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.publish(publishBody));

        const deleteBody = requestsBody.deleteCurrency;
        const deleteCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.delete(deleteBody));
        expect(deleteCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_DELETED);
        expect(deleteCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть удалена');

        activateCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.activate(activateBody));
        expect(activateCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_ACTIVATED);
        expect(activateCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть активирована');

        const archiveBody = requestsBody.archiveCurrency;
        let archiveCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));
        expect(archiveCurrency.error?.code, 'Код ошибки не отправлен или не совпадает с ожидаемым').toEqual(handbookApp.models.HandbookErrorCode.CURRENCY_CANNOT_BE_ARCHIVED);
        expect(archiveCurrency.error?.message, 'Текст ошибки не соответствует ожидаемому').toEqual('Валюта не может быть заархивирована');

        const hideBody = requestsBody.hideCurrency;
        await firstValueFrom(handbookAppRpcClient.currencyService.hide(hideBody));

        archiveCurrency = await firstValueFrom(handbookAppRpcClient.currencyService.archive(archiveBody));
    });
});