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
const KEY_COOKIE = 'user_dev';
const WEBSITE_URL = 'https://stackoverflow.com';
const COOKIE_EXPIRES = 7;
const getUserCookie = () => __awaiter(void 0, void 0, void 0, function* () {
    const c = yield chrome.cookies.get({ name: KEY_COOKIE, url: WEBSITE_URL });
    return c;
});
const setUserCookie = (value) => {
    const expiresDate = new Date();
    expiresDate.setTime(expiresDate.getTime() + COOKIE_EXPIRES * 24 * 60 * 60 * 1000);
    chrome.cookies.set({
        url: WEBSITE_URL,
        name: KEY_COOKIE,
        value: value,
        path: '/',
        expirationDate: expiresDate.getTime(),
    });
};
const clearUserCookie = () => {
    chrome.cookies.remove({ name: KEY_COOKIE, url: WEBSITE_URL });
};
const onLogin = () => __awaiter(void 0, void 0, void 0, function* () {
    const username = document.getElementById('username');
    const password = document.getElementById('password');
    // Call API to login
    if (username.value !== 'admin') {
        const errorMessageElement = document.getElementById('username-error-message');
        if (errorMessageElement) {
            errorMessageElement.textContent = 'Tài khoản không tồn tại';
        }
        return;
    }
    if (password.value !== '12345') {
        const errorMessageElement = document.getElementById('password-error-message');
        if (errorMessageElement) {
            errorMessageElement.textContent = 'Mật khẩu không đúng';
        }
        return;
    }
    //Call API
    alert('Đăng nhập thành công');
    //Set TOKEN vào COOKIE
    setUserCookie('true');
    showUI();
});
const showUI = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield getUserCookie();
    console.log(user);
    const a = document.getElementById('login');
    const b = document.getElementById('logged');
    if (user && Object.keys(user).length > 0 && a && b) {
        b.style.display = 'block';
        a.style.display = 'none';
    }
    else if (a && b) {
        a.style.display = 'block';
        b.style.display = 'none';
    }
});
window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    showUI();
    (_a = document.getElementById('form-login')) === null || _a === void 0 ? void 0 : _a.addEventListener('submit', (event) => {
        event.preventDefault();
        onLogin();
    });
    (_b = document.getElementById('logout-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => __awaiter(void 0, void 0, void 0, function* () {
        console.log('logout');
        yield clearUserCookie();
        showUI();
    }));
});
