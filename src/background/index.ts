const _KEY_COOKIE = 'user_dev';
const _WEBSITE_URL = 'https://stackoverflow.com';
const CONTEXT_MENU_ID = {
    add: 'chrome.extension.check-don-hang.add',
    check: 'chrome.extension.check-don-hang.update',
};
async function getUserCookie_BG() {
    const c = await chrome.cookies.get({ name: _KEY_COOKIE, url: _WEBSITE_URL });
    return c;
}

async function handleCheck() {
    const user = await getUserCookie_BG();
    if (!user) sendMessageToTabActive('Vui lòng đăng nhập');
    sendMessageToTabActive('check', 'event');
}
const handleAdd = async () => {
    const user = await getUserCookie_BG();
    if (!user) sendMessageToTabActive('Vui lòng đăng nhập');
    sendMessageToTabActive('add', 'event');
};
const sendMessageToTabActive = (message: string, action: 'alert' | 'log' | 'event' = 'alert') => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (tabs[0].url?.includes(_WEBSITE_URL)) {
            if (tabs[0]) chrome.tabs.sendMessage(tabs[0].id || -1, { action, message: message });
        } else console.log('Không focus');
    });
};

chrome.runtime.onInstalled.addListener(async () => {
    chrome.contextMenus.create({
        id: CONTEXT_MENU_ID.add,
        title: 'Thêm đơn hàng mới',
        type: 'normal',
        contexts: ['selection'],
    });

    chrome.contextMenus.create({
        id: CONTEXT_MENU_ID.check,
        title: 'Kiểm tra đơn hàng',
        type: 'normal',
        contexts: ['selection'],
    });
    chrome.contextMenus.onClicked.addListener((info, tab) => {
        if (info.menuItemId === CONTEXT_MENU_ID.add) {
            handleAdd();
        } else if (info.menuItemId === CONTEXT_MENU_ID.check) {
            handleCheck();
        }
    });
});
