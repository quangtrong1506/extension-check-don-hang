interface ISettings {
    skip_ads?: boolean;
    hide_banner?: boolean;
    hide_short_video?: boolean;
    auto_next_video?: boolean;
}
let _time = new Date().getTime();
const getCurrentTime = () => {
    return new Date().getTime();
};

const video: {
    id?: string;
    time?: string;
    list: {
        index?: number;
        id?: string;
    };
} = {
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
    if (document.fullscreenElement) return true;
    return false;
};
const SETTINGS: ISettings = {
    skip_ads: true,
};
const checkStatus = async () => {
    let url = location.href;
    let id = url.split('?v=')[1]?.split('&')[0];
    let arr = url.split('&');
    if (id) {
        video.id = id;
        video.list.id = arr.find((text) => text.match('list='))?.split('=')[1];
        video.list.index = parseInt(
            arr.find((text) => text.match('index='))?.split('=')[1] ||
                arr.find((text) => text.match('start_radio='))?.split('=')[1] ||
                '0'
        );
    }
};
const saveData = (key: string, value: unknown) => {
    chrome.storage.local.set({ [key]: value });
};
const getData = async (key: string) => {
    const result = await chrome.storage.local.get(key);
    return result[key];
};
// yt-spec-button-shape-next yt-spec-button-shape-next--text yt-spec-button-shape-next--mono yt-spec-button-shape-next--size-m yt-spec-button-shape-next--icon-only-default
const handle: () => void = async () => {
    //Home page
    const shorts: NodeListOf<HTMLDivElement> = document.querySelectorAll(
        'ytd-rich-shelf-renderer'
    ) as NodeListOf<HTMLDivElement>;
    shorts.forEach((node) => {
        if (SETTINGS.hide_short_video) node.style.display = 'none';
        else node.removeAttribute('style');
    });

    const Banner1Home: NodeListOf<HTMLDivElement> = document.querySelectorAll(
        'ytd-ad-slot-renderer'
    ) as NodeListOf<HTMLDivElement>;
    Banner1Home.forEach((node) => {
        if (SETTINGS.hide_short_video) node.style.display = 'none';
        else node.removeAttribute('style');
    });

    const banners: NodeListOf<HTMLDivElement> = document.querySelectorAll(
        'ytd-banner-promo-renderer'
    ) as NodeListOf<HTMLDivElement>;
    banners.forEach((node) => {
        if (SETTINGS.hide_banner) node.style.display = 'none';
        else node.removeAttribute('style');
    });
    const banners2: NodeListOf<HTMLDivElement> = document.querySelectorAll(
        'ytd-statement-banner-renderer'
    ) as NodeListOf<HTMLDivElement>;
    banners2.forEach((node) => {
        if (SETTINGS.hide_banner) node.style.display = 'none';
        else node.removeAttribute('style');
    });
    // Banner quảng cáo có gắn video
    const banner3Home: NodeListOf<HTMLDivElement> = document.querySelectorAll(
        'ytd-ad-slot-renderer'
    ) as NodeListOf<HTMLDivElement>;
    banner3Home.forEach((node) => {
        if (SETTINGS.hide_banner) node.style.display = 'none';
        else node.removeAttribute('style');
    });
    const banner4Home: HTMLDivElement = document.querySelector('#masthead-ad') as HTMLDivElement;
    if (banner4Home)
        if (SETTINGS.hide_banner) banner4Home.style.display = 'none';
        else banner4Home.removeAttribute('style');

    //? Watch
    const banner3Top: NodeListOf<HTMLDivElement> = document.querySelectorAll(
        'ytd-player-legacy-desktop-watch-ads-renderer'
    ) as NodeListOf<HTMLDivElement>;
    banner3Top.forEach((node) => {
        if (SETTINGS.hide_banner) node.style.display = 'none';
        else node.removeAttribute('style');
    });
    const shorts2Watch: NodeListOf<HTMLDivElement> = document.querySelectorAll(
        'ytd-reel-shelf-renderer'
    ) as NodeListOf<HTMLDivElement>;
    shorts2Watch.forEach((node) => {
        if (SETTINGS.hide_banner) node.style.display = 'none';
        else node.removeAttribute('style');
    });
    //Search

    const qcSearch: NodeListOf<HTMLDivElement> = document.querySelectorAll(
        'ytd-in-feed-ad-layout-renderer.ytd-ad-slot-renderer'
    ) as NodeListOf<HTMLDivElement>;
    qcSearch.forEach((node) => {
        if (SETTINGS.hide_banner) node.style.display = 'none';
        else node.removeAttribute('style');
    });
    // Handle Ads
    if (SETTINGS.skip_ads) {
        // loading = true;
        let a: HTMLButtonElement = document.querySelector('.ytp-skip-ad-button') as HTMLButtonElement;
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
                if (video.list.id) query += `&list=${video.list.id}&index=${video.list.index}`;
                window.location.href = `https://youtu.be/${video.id}${query}`;
            }
            return;
        }
        let videoTag: HTMLVideoElement = document.querySelector('#ytd-player video') as HTMLVideoElement;
        if (videoTag) {
            video.time = videoTag.currentTime.toString();
        }
    }
    if (SETTINGS.auto_next_video) {
        let videoTag: HTMLVideoElement = document.querySelector('#ytd-player video') as HTMLVideoElement;
        if (videoTag && videoTag.duration - videoTag.currentTime < 1) {
            let button: HTMLButtonElement = document.querySelectorAll(
                '.ytp-autonav-endscreen-upnext-button'
            )[1] as HTMLButtonElement;
            if (button) button.click();
        }
    }
};

setInterval(async () => {
    checkStatus();
    handle();
}, 10);
setInterval(async () => {
    const settings: ISettings = (await getData('settings')) as ISettings;
    if (settings) {
        SETTINGS.skip_ads = settings.skip_ads;
        SETTINGS.hide_banner = settings.hide_banner;
        SETTINGS.hide_short_video = settings.hide_short_video;
        SETTINGS.auto_next_video = settings.auto_next_video;
    }
}, 500);
//ytp-autonav-endscreen-upnext-button ytp-autonav-endscreen-upnext-cancel-button ytp-autonav-endscreen-upnext-button-rounded
