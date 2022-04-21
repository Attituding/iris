"use strict";
(() => {
    const userHistory = {
        lastSearchCleared: false,
        lastSearch: null,
        history: [],
    };
    const userSettings = {
        apiKey: '',
        firstLogin: true,
        gameStats: true,
        hypixelAPI: false,
        lastLogout: false,
        relativeTimestamps: true,
        sentences: false,
        thirdPerson: false, //Use Third Person
    };
    const runtime = chrome ?? browser;
    //Install/Update Handling
    runtime.runtime.onInstalled.addListener(async (details) => {
        if (details.reason === runtime.runtime.OnInstalledReason.INSTALL ||
            details.reason === runtime.runtime.OnInstalledReason.UPDATE) {
            const local = await runtime.storage.local.get(null) ?? {};
            const sync = await runtime.storage.sync.get(null) ?? {};
            const flatLocal = 'playerHistory' in local ? local.playerHistory : local;
            const newLocal = {
                ...userHistory,
                ...flatLocal,
                lastSearch: flatLocal.lastSearches?.[0] ??
                    null,
                history: flatLocal.lastSearches ??
                    userHistory.history,
            };
            const flatSync = 'userOptions' in sync ? sync.userOptions : sync;
            const newSync = {
                ...userSettings,
                ...flatSync,
                thirdPerson: flatSync.authorNameOutput ?? //Legacy Key Handling
                    userSettings.thirdPerson,
                sentences: flatSync.paragraphOutput ??
                    userSettings.sentences,
                hypixelAPI: flatSync.useHypixelAPI ??
                    userSettings.hypixelAPI,
            };
            await runtime.storage.local.set(newLocal);
            await runtime.storage.sync.set(newSync);
            console.log('Set settings', newLocal, newSync);
        }
    });
})();
