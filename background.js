chrome.runtime.onMessage.addListener(function(message,sender,sendResponse){
    if(message == "getLocalStorage"){
        sendResponse(localStorage);
    }
});