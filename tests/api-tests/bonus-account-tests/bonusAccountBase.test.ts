import { test, expect } from '@playwright/test';
import { bonusRpcClient } from './grpc-client'
import { bonusApp } from '@greencodeorg/bonus-rpc/nest-client'
import { RequestsBody } from './requestsBody';
import { firstValueFrom } from 'rxjs';
import { Utils } from '../../../utils/generators';

test.describe('Базовые сценарии создания бонусного счета', () => {
    test('BONUS-1 Создать бонусный счет', async () => {
        const clientId = Utils.generateRandomNumber(20);
        const referenceId = Utils.generateRandomNumber(20)

        const requestBody = new RequestsBody(clientId, referenceId);

        const body = requestBody.createBonusAccount;
        const createAccount: bonusApp.commands.OpenBonusAccountResponseData = (await firstValueFrom(bonusRpcClient.bonusAccountService.open(requestBody.createBonusAccount))).data!;

        expect(createAccount.account!.id, 'ID не должен быть пустой').not.toEqual("");
        expect(createAccount.account!.status, 'Статус создания аккаунта не равен 1').toEqual(bonusApp.models.BonusAccountStatus.OPEN)
        expect(createAccount.account!.clientId, 'Полученный client id не равен отправленному').toEqual(body.clientId);
        expect(createAccount.account!.referenceId, 'Полученный reference id не равен отправленному').toEqual(body.referenceId);
        expect(createAccount.account!.referenceType, 'Полученный reference type не равен отправленному').toEqual(body.referenceType);
        expect(createAccount.account!.currency, 'Полученная currency не равна отправленной').toEqual(body.currency);
        expect(createAccount.account!.startAmount, 'Полученное значение стартового баланса не равно отправленному').toEqual(body.amount);
        expect(createAccount.account!.currentAmount, 'Полученный баланс не равен изначальному').toEqual(body.amount);
        expect(createAccount.account!.amountWithdrawMax, 'Полученный максимальный размер вывода не соответствует отправленному').toEqual(body.withdrawMax);
    });

    test('BONUS-2 Создание бонусного счета, создание перевода, получение статуса перевода и total balance', async () => {
        const clientId = Utils.generateRandomNumber(20);
        const referenceId = Utils.generateRandomNumber(20)

        const requestBody = new RequestsBody(clientId, referenceId);

        const createAccountBody = requestBody.createBonusAccount;

        const createAccount: bonusApp.commands.OpenBonusAccountResponseData = (await firstValueFrom(bonusRpcClient.bonusAccountService.open(requestBody.createBonusAccount))).data!;
        expect(createAccount.account!.id, 'ID не должен быть пустой').not.toEqual("");
        expect(createAccount.account!.status, 'Статус создания аккаунта не равен 1').toEqual(bonusApp.models.BonusAccountStatus.OPEN);
        expect(createAccount.account!.clientId, 'Полученный client id не равен отправленному').toEqual(createAccountBody.clientId);
        expect(createAccount.account!.referenceId, 'Полученный reference id не равен отправленному').toEqual(createAccountBody.referenceId);
        expect(createAccount.account!.referenceType, 'Полученный reference type не равен отправленному').toEqual(createAccountBody.referenceType);
        expect(createAccount.account!.currency, 'Полученная currency не равна отправленному').toEqual(createAccountBody.currency);
        expect(createAccount.account!.startAmount, 'Полученное значение стартового баланса не равно отправленному').toEqual(createAccountBody.amount);
        expect(createAccount.account!.currentAmount, 'Полученный баланс не равен изначальному').toEqual(createAccountBody.amount);
        expect(createAccount.account!.amountWithdrawMax, 'Полученный максимальный размер вывода не соответствует отправленному').toEqual(createAccountBody.withdrawMax);

        const startTransferBody = requestBody.startTransfer;
        const startTransfer: bonusApp.commands.StartTransferBonusResponseData = (await firstValueFrom(bonusRpcClient.bonusTransferService.start(startTransferBody))).data!;
        expect(startTransfer.amount, 'Amount не равен указанному при создании').toEqual(createAccountBody.amount)

        const statusTransferBody = requestBody.statusTransfer;
        const statusTransfer: bonusApp.commands.StatusTransferBonusResponseData = (await firstValueFrom(bonusRpcClient.bonusTransferService.status(statusTransferBody))).data!;
        expect(statusTransfer.operation!.accountId, 'ID не равен ID при создании').toEqual(createAccount.account!.id);
        expect(statusTransfer.operation!.status, 'Статус операции не равен 1').toEqual(bonusApp.models.BonusOperationStatus.CREATED);
        expect(statusTransfer.operation!.clientId, 'Полученный client id не равен отправленному').toEqual(createAccountBody.clientId);
        expect(statusTransfer.operation!.type, 'Полученный тип операции не равен снятию со счета').toEqual(bonusApp.models.BonusOperationType.WITHDRAW);
        // expect(statusTransfer.currency, 'Полученная currency не равна отправленной').toEqual(createAccountBody.currency);
        expect(statusTransfer.operation!.withdrawTarget, 'Полученная цель вывода не соответствует ожидаемой').toEqual(startTransferBody.withdrawTarget);

        const totalBalanceBody = requestBody.totalBalance;
        const totalBalance: bonusApp.commands.TotalBalanceAccountResponseData = (await firstValueFrom(bonusRpcClient.bonusAccountService.totalBalance(totalBalanceBody))).data!;

        expect(totalBalance.items[0].clientId, 'Полученный client id не равен отправленному').toEqual(totalBalanceBody.clientId);
        expect(totalBalance.items[0].referenceType, 'Полученный reference type не равен отправленному при создании бонусного счета').toEqual(createAccountBody.referenceType);
        expect(totalBalance.items[0].currency, 'Полученная currency не равна отправленной').toEqual(createAccountBody.currency);
        expect(totalBalance.items[0].total, 'Amount не равен указанному при создании').toEqual(createAccountBody.amount);
    });

    test('BONUS-3 Создание бонусного счета, создание перевода, перевод перевод статуса в cancel, удаление бонусного перевода.', async () => {
        const clientId = Utils.generateRandomNumber(20);
        const referenceId = Utils.generateRandomNumber(20)

        const requestBody = new RequestsBody(clientId, referenceId);

        const createAccountBody = requestBody.createBonusAccount;
        const createAccount: bonusApp.commands.OpenBonusAccountResponseData = (await firstValueFrom(bonusRpcClient.bonusAccountService.open(requestBody.createBonusAccount))).data!;
        expect(createAccount.account!.id, 'ID не должен быть пустой').not.toEqual("");
        expect(createAccount.account!.status, 'Статус создания аккаунта не равен 1').toEqual(bonusApp.models.BonusAccountStatus.OPEN);
        expect(createAccount.account!.clientId, 'Полученный client id не равен отправленному').toEqual(createAccountBody.clientId);
        expect(createAccount.account!.referenceId, 'Полученный reference id не равен отправленному').toEqual(createAccountBody.referenceId);
        expect(createAccount.account!.referenceType, 'Полученный reference type не равен отправленному').toEqual(createAccountBody.referenceType);
        expect(createAccount.account!.currency, 'Полученная currency не равна отправленному').toEqual(createAccountBody.currency);
        expect(createAccount.account!.startAmount, 'Полученное значение стартового баланса не равно отправленному').toEqual(createAccountBody.amount);
        expect(createAccount.account!.currentAmount, 'Полученный баланс не равен изначальному').toEqual(createAccountBody.amount);
        expect(createAccount.account!.amountWithdrawMax, 'Полученный максимальный размер вывода не соответствует отправленному').toEqual(createAccountBody.withdrawMax);


        const startTransferBody = requestBody.startTransfer;
        const startTransfer: bonusApp.commands.StartTransferBonusResponseData = (await firstValueFrom(bonusRpcClient.bonusTransferService.start(startTransferBody))).data!;
        expect(startTransfer.amount, 'Amount не равен указанному при создании').toEqual(createAccountBody.amount)

        const cancelTransferBody = requestBody.cancelTransfer;
        const cancelTransfer: bonusApp.commands.CancelTransferBonusResponseData = (await firstValueFrom(bonusRpcClient.bonusTransferService.cancel(cancelTransferBody))).data!;
        expect(cancelTransfer.status, 'Статус ').toEqual(true)

        const closeAccountBody = requestBody.closeAccount;
        const closeAccount: bonusApp.commands.CloseBonusAccountResponseData = (await firstValueFrom(bonusRpcClient.bonusAccountService.close(closeAccountBody))).data!;
        expect(closeAccount.status, 'Статус ').toEqual(true)
    });

    test('BONUS-4 Создание бонусного счета, создание перевода и перевод в статус Success', async () => {
        const clientId = Utils.generateRandomNumber(20);
        const referenceId = Utils.generateRandomNumber(20)

        const requestBody = new RequestsBody(clientId, referenceId);
       
        const createAccountBody = requestBody.createBonusAccount;
        const createAccount: bonusApp.commands.OpenBonusAccountResponseData  = (await firstValueFrom(bonusRpcClient.bonusAccountService.open(requestBody.createBonusAccount))).data!;
        expect(createAccount.account!.id, 'ID не должен быть пустой').not.toEqual("");
        expect(createAccount.account!.status, 'Статус создания аккаунта не равен 1').toEqual(bonusApp.models.BonusAccountStatus.OPEN);
        expect(createAccount.account!.clientId, 'Полученный client id не равен отправленному').toEqual(createAccountBody.clientId);
        expect(createAccount.account!.referenceId, 'Полученный reference id не равен отправленному').toEqual(createAccountBody.referenceId);
        expect(createAccount.account!.referenceType, 'Полученный reference type не равен отправленному').toEqual(createAccountBody.referenceType);
        expect(createAccount.account!.currency, 'Полученная currency не равна отправленному').toEqual(createAccountBody.currency);
        expect(createAccount.account!.startAmount, 'Полученное значение стартового баланса не равно отправленному').toEqual(createAccountBody.amount);
        expect(createAccount.account!.currentAmount, 'Полученный баланс не равен изначальному').toEqual(createAccountBody.amount);
        expect(createAccount.account!.amountWithdrawMax, 'Полученный максимальный размер вывода не соответствует отправленному').toEqual(createAccountBody.withdrawMax);    

        const startTransferBody = requestBody.startTransfer;
        const startTransfer:  bonusApp.commands.StartTransferBonusResponseData = (await firstValueFrom(bonusRpcClient.bonusTransferService.start(startTransferBody))).data!;
        expect(startTransfer.amount, 'Amount не равен указанному при создании').toEqual(createAccountBody.amount)

        const successTransferBody = requestBody.successTransfer;
        const successTransfer:  bonusApp.commands.SuccessTransferBonusResponseData = (await firstValueFrom(bonusRpcClient.bonusTransferService.success(successTransferBody))).data!;
        expect(successTransfer.status, 'Статус ').toEqual(true)
    })
});
