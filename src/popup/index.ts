const KEY_COOKIE = 'user_dev';
const WEBSITE_URL = 'https://stackoverflow.com';
const COOKIE_EXPIRES = 7;

const getUserCookie = async () => {
    const c = await chrome.cookies.get({ name: KEY_COOKIE, url: WEBSITE_URL });
    return c;
};

const setUserCookie = (value: string) => {
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

const onLogin = async () => {
    const username = document.getElementById('username') as HTMLInputElement;
    const password = document.getElementById('password') as HTMLInputElement;
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
};
const showUI = async () => {
    const user = await getUserCookie();
    console.log(user);
    const a = document.getElementById('login');
    const b = document.getElementById('logged');
    if (user && Object.keys(user).length > 0 && a && b) {
        b.style.display = 'block';
        a.style.display = 'none';
    } else if (a && b) {
        a.style.display = 'block';
        b.style.display = 'none';
    }
};

window.onload = async () => {
    showUI();
    document.getElementById('form-login')?.addEventListener('submit', (event: any) => {
        event.preventDefault();
        onLogin();
    });
    document.getElementById('logout-btn')?.addEventListener('click', async () => {
        console.log('logout');
        await clearUserCookie();
        showUI();
    });
};
