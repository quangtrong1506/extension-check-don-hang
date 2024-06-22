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
const handleChange = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    const settings = (yield getDataPopup('settings'));
    settings[key] = value;
    saveDataPopup('settings', settings);
});
const saveDataPopup = (key, value) => {
    chrome.storage.local.set({ [key]: value });
};
const getDataPopup = (key) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield chrome.storage.local.get(key);
    if (!result[key]) {
        let newData = {
            skip_ads: true,
            auto_next_video: true,
            hide_banner: true,
            hide_short_video: true,
        };
        saveDataPopup(key, newData);
        return newData;
    }
    return result[key];
});
window.onload = () => __awaiter(void 0, void 0, void 0, function* () {
    const settings = (yield getDataPopup('settings'));
    document.querySelectorAll('.content input').forEach((element) => {
        const InputTag = element;
        console.log(InputTag); //27
        InputTag.checked = settings[InputTag.id];
        element.addEventListener('input', (event) => {
            const InputTag = event.target;
            handleChange(InputTag === null || InputTag === void 0 ? void 0 : InputTag.id, InputTag === null || InputTag === void 0 ? void 0 : InputTag.checked);
        });
    });
});
