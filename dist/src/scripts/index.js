"use strict";
const getSelectedText = () => {
    var _a, _b;
    if (window.getSelection)
        return (_a = window.getSelection()) === null || _a === void 0 ? void 0 : _a.toString();
    else if (document.getSelection())
        return (_b = document.getSelection()) === null || _b === void 0 ? void 0 : _b.toString();
    return null;
};
const _handleCheck = () => {
    const selectedText = getSelectedText();
    if (!selectedText)
        return;
    window.open('https://www.google.com/search?q=' + selectedText, '_blank');
};
const _handleAdd = () => {
    const selectedText = getSelectedText();
    if (!selectedText)
        return;
    window.alert(selectedText);
};
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log(message);
    if (message.action === 'alert')
        return alert(message.message);
    if (message.action === 'event') {
        if (message.message === 'check')
            return _handleCheck();
        if (message.message === 'add')
            return _handleAdd();
    }
    if (message.action === 'log') {
        console.log(message.message);
    }
});
