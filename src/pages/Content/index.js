import { printLine } from './modules/print';

console.log('Content script works!');
console.log('Must reload extension for modifications to take effect.');

printLine("Using the 'printLine' function from the Print Module");


chrome.storage.sync.get(['JSESSIONID'], function (items) {
    message('SessionID retrieved', items);
});