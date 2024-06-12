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
let _time = new Date().getTime();
const getCurrentTime = () => {
    return new Date().getTime();
};
const video = {
    list: {
        index: 0,
    },
};
const typeOfAdvertisement = {
    shortAds: Symbol('short_ad'),
    adsCanBeSkipped: Symbol('ads_can_be_skipped'),
    nextVideo: Symbol('next_video'),
};
const isFullScreen = () => {
    if (document.fullscreenElement)
        return true;
    return false;
};
const SETTINGS = {
    skip_ads: true,
};
const checkStatus = () => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b, _c, _d;
    let url = location.href;
    let id = (_a = url.split('?v=')[1]) === null || _a === void 0 ? void 0 : _a.split('&')[0];
    let arr = url.split('&');
    if (id) {
        video.id = id;
        video.list.id = (_b = arr.find((text) => text.match('list='))) === null || _b === void 0 ? void 0 : _b.split('=')[1];
        video.list.index = parseInt(((_c = arr.find((text) => text.match('index='))) === null || _c === void 0 ? void 0 : _c.split('=')[1]) || ((_d = arr.find((text) => text.match('start_radio='))) === null || _d === void 0 ? void 0 : _d.split('=')[1]) || '0');
    }
});
const saveData = (key, value) => {
    chrome.storage.local.set({ [key]: value });
};
const getData = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield chrome.storage.local.get(key);
    return result[key];
});
// yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-only-default
const handle = () => __awaiter(void 0, void 0, void 0, function* () {
    //Home page
    const shorts = document.querySelectorAll('ytd-rich-shelf-renderer');
    if (shorts.length > 0) {
        shorts.forEach((node) => {
            if (SETTINGS.hide_short_video)
                node.style.display = 'none';
            else
                node.removeAttribute('style');
        });
    }
    const Banner1Home = document.querySelectorAll('ytd-ad-slot-renderer');
    if (Banner1Home.length > 0) {
        Banner1Home.forEach((node) => {
            if (SETTINGS.hide_short_video)
                node.style.display = 'none';
            else
                node.removeAttribute('style');
        });
    }
    const banner = document.querySelector('ytd-banner-promo-renderer');
    if (banner)
        if (SETTINGS.hide_banner)
            banner.style.display = 'none';
        else
            banner.removeAttribute('style');
    const banner2 = document.querySelector('ytd-statement-banner-renderer');
    if (banner2)
        if (SETTINGS.hide_banner)
            banner2.style.display = 'none';
        else
            banner2.removeAttribute('style');
    // Banner quảng cáo có gắn video
    const banner3Home = document.querySelector('ytd-ad-slot-renderer');
    if (banner3Home)
        if (SETTINGS.hide_banner)
            banner3Home.style.display = 'none';
        else
            banner3Home.removeAttribute('style');
    const banner4Home = document.querySelector('#masthead-ad');
    if (banner4Home)
        if (SETTINGS.hide_banner)
            banner4Home.style.display = 'none';
        else
            banner4Home.removeAttribute('style');
    //? Watch
    const banner3Top = document.querySelector('ytd-player-legacy-desktop-watch-ads-renderer');
    if (banner3Top)
        if (SETTINGS.hide_banner)
            banner3Top.style.display = 'none';
        else
            banner3Top.removeAttribute('style');
    const shorts2Watch = document.querySelector('ytd-reel-shelf-renderer');
    if (shorts2Watch)
        if (SETTINGS.hide_short_video)
            shorts2Watch.style.display = 'none';
        else
            shorts2Watch.removeAttribute('style');
    // Handle Ads
    if (SETTINGS.skip_ads) {
        // loading = true;
        let a = document.querySelector('.ytp-skip-ad-button');
        if (a) {
            console.log('Click');
            a.click();
            return;
        }
        if (document.querySelector('.ytp-preview-ad') || document.querySelector('.ytp-preview-ad__text')) {
            console.log("Can't skip ads");
            if (getCurrentTime() - _time > 500 && video.id) {
                _time = getCurrentTime();
                let query = '?t=' + video.time;
                if (video.list.id)
                    query += `&list=${video.list.id}&index=${video.list.index}`;
                window.location.href = `https://youtu.be/${video.id}${query}`;
            }
            return;
        }
        let videoTag = document.querySelector('#ytd-player video');
        if (videoTag) {
            video.time = videoTag.currentTime.toString();
        }
    }
    if (SETTINGS.auto_next_video) {
        let videoTag = document.querySelector('#ytd-player video');
        if (videoTag && videoTag.duration - videoTag.currentTime < 1) {
            let button = document.querySelectorAll('.ytp-autonav-endscreen-upnext-button')[1];
            if (button)
                button.click();
        }
    }
});
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    checkStatus();
    handle();
}), 10);
setInterval(() => __awaiter(void 0, void 0, void 0, function* () {
    const settings = (yield getData('settings'));
    if (settings) {
        SETTINGS.skip_ads = settings.skip_ads;
        SETTINGS.hide_banner = settings.hide_banner;
        SETTINGS.hide_short_video = settings.hide_short_video;
        SETTINGS.auto_next_video = settings.auto_next_video;
    }
}), 1000);
//ytp-autonav-endscreen-upnext-button ytp-autonav-endscreen-upnext-cancel-button ytp-autonav-endscreen-upnext-button-rounded
