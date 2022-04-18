export function i18n(runtime, ids) {
    ids.forEach(i18nString => {
        const element = document.getElementById(i18nString);
        element.innerHTML = runtime.i18n.getMessage(i18nString);
    });
}
