import { test as baseTest} from '@playwright/test';
import UnauthorizedMainPage from "../pages/basePages/unauthorizedMainPage";
import AuthorizedMainPage from '../pages/basePages/authorizedMainPage';
import GamePage from '../pages/gamePage';
import UnauthorizedSlotsPage from '../pages/unauthorized/unauthorizedSlotsPage';
import AuthorizedSlotsPage from '../pages/authorized/authorizedSlotsPage';
import AuthorizedInHousePage from '../pages/authorized/authorizedInHousePage';
import UnauthorizedInHousePage from '../pages/unauthorized/unauthorizedInHousePage';
import AuthorizedProfilePage from '../pages/authorized/authorizedProfilePage';
import AuthorizedMyBonusesPage from '../pages/authorized/authorizedMyBonusesPage';
import AuthorizedReferralPage from '../pages/authorized/authorizedReferralPage';
import CryptosGamePage from '../pages/cryptosGamePage';

type pages = {
    unauthorizedMainPage: UnauthorizedMainPage;
    authorizedMainPage: AuthorizedMainPage;
    unauthorizedSlotsPage: UnauthorizedSlotsPage;
    authorizedSlotsPage: AuthorizedSlotsPage;
    gamePage: GamePage;
    cryptosGamePage: CryptosGamePage;
    authorizedInHousePage: AuthorizedInHousePage;
    unauthorizedInHousePage: UnauthorizedInHousePage;
    authorizedProfilePage: AuthorizedProfilePage;
    authorizedReferralPage: AuthorizedReferralPage;
    authorizedMyBonusesPage: AuthorizedMyBonusesPage;
}

const allPages = baseTest.extend<pages>({
    unauthorizedInHousePage: async ({ page }, use) => {
        await use(new UnauthorizedInHousePage(page));
    },

    authorizedInHousePage: async ({ page }, use) => {
        await use(new AuthorizedInHousePage(page));
    },

    unauthorizedSlotsPage:  async ({ page }, use) => {
        await use(new UnauthorizedSlotsPage(page));
    },

    authorizedSlotsPage:  async ({ page }, use) => {
        await use(new AuthorizedSlotsPage(page));
    },

    authorizedProfilePage:  async ({ page }, use) => {
        await use(new AuthorizedProfilePage(page));
    },

    authorizedReferralPage:  async ({ page }, use) => {
        await use(new AuthorizedReferralPage(page));
    },

    gamePage: async  ({ page }, use) => {
        await use(new GamePage(page));
    },

    authorizedMyBonusesPage: async  ({ page }, use) => {
        await use(new AuthorizedMyBonusesPage(page));
    },

    cryptosGamePage: async ({page}, use) => {
        await use(new CryptosGamePage(page));
    },
})

export const test = allPages;
export const expect = allPages.expect;