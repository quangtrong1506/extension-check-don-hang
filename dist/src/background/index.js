"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const _KEY_COOKIE = 'user_dev';
const _WEBSITE_URL = 'https://stackoverflow.com';
const CONTEXT_MENU_ID = {
    add: 'chrome.extension.check-don-hang.add',
    check: 'chrome.extension.check-don-hang.update',
};
function getUserCookie_BG() {
    return __awaiter(this, void 0, void 0, function* () {
        const c = yield chrome.cookies.get({ name: _KEY_COOKIE, url: _WEBSITE_URL });
        return c;
    });
}
function handleCheck() {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield getUserCookie_BG();
        if (!user)
            sendMessageToTabActive('Vui lòng đăng nhập');
        sendMessageToTabActive('check', 'event');
    });
}
const handleAdd = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUserCookie_BG();
    if (!user)
        sendMessageToTabActive('Vui lòng đăng nhập');
    sendMessageToTabActive('add', 'event');
});
const sendMessageToTabActive = (message, action = 'alert') => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        var _a;
        if ((_a = tabs[0].url) === null || _a === void 0 ? void 0 : _a.includes(_WEBSITE_URL)) {
            if (tabs[0])
                chrome.tabs.sendMessage(tabs[0].id || -1, { action, message: message });
        }
        else
            console.log('Không focus');
    });
};
chrome.runtime.onInstalled.addListener(() => __awaiter(void 0, void 0, void 0, function* () {
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
        }
        else if (info.menuItemId === CONTEXT_MENU_ID.check) {
            handleCheck();
        }
    });
}));
