import { Utils } from '../../../utils/generators';
import { handbookApp } from '@greencodeorg/handbook-rpc/nest-client';

export class RequestsBody {
    code = Utils.generateRandomNumber(10);

    addCurrency: handbookApp.commands.AddCurrencyRequest = {
        code: this.code.toUpperCase(),
        name: this.code,
        type: handbookApp.models.CurrencyType.CRYPTO,
        unit: 0,
        availableForWallet: false,
        availableForRegistration: false,
        legacyId: 0,
    };

    changeCurrency: handbookApp.commands.AddCurrencyRequest = {
        code: this.code.toUpperCase(),
        name: this.code,
        type: handbookApp.models.CurrencyType.CRYPTO,
        unit: 0,
        availableForWallet: true,
        availableForRegistration: false,
        legacyId: 0,
    };

    deleteCurrency: handbookApp.commands.DeleteCurrencyRequest = {
        code: this.code.toUpperCase()
    };

    hideCurrency: handbookApp.commands.HideCurrencyRequest = {
        code: this.code.toUpperCase()
    };

    publishCurrency: handbookApp.commands.PublishCurrencyRequest = {
        code: this.code.toUpperCase()
    }

    activateCurrency: handbookApp.commands.ActivateCurrencyRequest = {
        code: this.code.toUpperCase()
    }

    archiveCurrency: handbookApp.commands.ArchiveCurrencyRequest = {
        code: this.code.toUpperCase()
    }
}

