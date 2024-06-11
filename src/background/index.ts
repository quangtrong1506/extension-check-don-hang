const handleVideo = () => {
    console.log('abc video');
};

setInterval(async () => {
    const result = await chrome.storage.local.get('settings');
    console.log(result);
}, 5000);
