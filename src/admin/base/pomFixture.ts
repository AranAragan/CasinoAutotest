import { test as baseTest } from '@playwright/test';
import UnauthorizedLoginPage from '../pages/unauthorized/UnauthorizedLoginPage';
import AuthorizedUsersPage from '../pages/authorized/AuthorizedUsersPage';
import AuthorizedProfilePage from '../pages/authorized/AuthorizedProfilePage';
import AuthorizedWithdrawalsPage from '../pages/authorized/AuthorizedWithdrawalsPage';
import AuthorizedOffersPage from '../pages/authorized/AuthorizedOffersPage';
import AuthorizedOfferPage from '../pages/authorized/AuthorizedOfferPage';

type pages = {
    unauthorizedLoginPage: UnauthorizedLoginPage;
    authorizedUsersPage: AuthorizedUsersPage;
    authorizedProfilePage: AuthorizedProfilePage;
    authorizedWithdrawalsPage: AuthorizedWithdrawalsPage;
    authorizedOffersPage: AuthorizedOffersPage;
    authorizedOfferPage: AuthorizedOfferPage;
}

const allPages = baseTest.extend<pages>({
    unauthorizedLoginPage: async ({ page }, use) => {
        await use(new UnauthorizedLoginPage(page));
    },

    authorizedUsersPage: async ({ page }, use) => {
        await use(new AuthorizedUsersPage(page));
    },

    authorizedProfilePage: async ({ page }, use) => {
        await use(new AuthorizedProfilePage(page));
    }, 

    authorizedWithdrawalsPage: async ({ page }, use) => {
        await use(new AuthorizedWithdrawalsPage(page));
    }, 

    authorizedOffersPage: async ({ page }, use) => {
        await use(new AuthorizedOffersPage(page));
    }, 

    authorizedOfferPage: async ({ page }, use) => {
        await use(new AuthorizedOfferPage(page));
    }, 
})

export const test = allPages;
export const expect = allPages.expect;