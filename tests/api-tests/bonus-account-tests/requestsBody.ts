import { bonusApp } from '@greencodeorg/bonus-rpc/nest-client';

export class RequestsBody {
    clientId: string;
    referenceId: string;

    // Constructor to initialize clientId and referenceId
    constructor(clientId: string, referenceId: string) {
        this.clientId = clientId;
        this.referenceId = referenceId;

        // Move the initialization of class properties here
        this.createBonusAccount = {
            amount: "14",
            currency: "USD",
            clientId: this.clientId,
            referenceId: this.referenceId,
            referenceType: bonusApp.models.BonusAccountReferenceType.OFFER,
            withdrawMax: "100"
        };

        this.startTransfer = {
            clientId: this.clientId,
            referenceId: this.referenceId,
            referenceType: bonusApp.models.BonusAccountReferenceType.OFFER,
            withdrawTarget: "100"
        };

        this.statusTransfer = {
            clientId: this.clientId,
            referenceId: this.referenceId,
            referenceType: bonusApp.models.BonusAccountReferenceType.OFFER
        };

        this.totalBalance = {
            clientId: this.clientId,
            referenceType: bonusApp.models.BonusAccountReferenceType.OFFER
        };

        this.cancelTransfer = {
            clientId: this.clientId,
            referenceId: this.referenceId,
            referenceType: bonusApp.models.BonusAccountReferenceType.OFFER,
            reason: "test"
        };

        this.closeAccount = {
            clientId: this.clientId,
            referenceId: this.referenceId,
            referenceType: bonusApp.models.BonusAccountReferenceType.OFFER
        };

        this.successTransfer = {
            clientId: this.clientId,
            referenceId: this.referenceId,
            referenceType: bonusApp.models.BonusAccountReferenceType.OFFER
        };
    }

    createBonusAccount: bonusApp.commands.OpenBonusAccountRequest;
    startTransfer: bonusApp.commands.StartTransferBonusRequest;
    statusTransfer: bonusApp.commands.StatusTransferBonusRequest;
    totalBalance: bonusApp.commands.TotalBalanceAccountRequest;
    cancelTransfer: bonusApp.commands.CancelTransferBonusRequest;
    closeAccount: bonusApp.commands.CloseBonusAccountRequest;
    successTransfer: bonusApp.commands.SuccessTransferBonusRequest;
}
