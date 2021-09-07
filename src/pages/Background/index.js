console.log('This is the background page.');
console.log('Put the background scripts here.');

const getCookies = (domain, name, callback) => {
    chrome.cookies.get({ "url": domain, "name": name }, function (cookie) {
        if (callback) {
            callback(cookie.value);
        }
    });
}

const setCookies = (domain, name, callback) => {
    chrome.cookies.set({ "url": domain, "name": name }, function (cookie) {
        if (callback) {
            callback(cookie.value);
        }
    });
}

setInterval(() => {
    getCookies("https://www.linkedin.com", "JSESSIONID", function (id) {
        // Save it using the Chrome extension storage API.
        chrome.storage.sync.set({ 'JSESSIONID': id }, function () {
            console.log('Session ID saved');
        });
    });
}, 10000)


