class Options {

    constructor() {
        var self = this;
        this.loaded = new Promise(function (resolve, reject) {
            chrome.runtime.sendMessage("getLocalStorage", function(store) {
                if(store == undefined && chrome.runtime.lastError){
                    reject(store);
                    return;
                }
                self.highlight = store['highlight'] != "false";
                self.fade = store['fade'] != "false";
                self.cursor = store['cursor'] != "false";
                self.countdown = store['countdown'] != "false";
                self.signature = store['signature'] != "false";
                self.fade_time = store['fade_time'] != "false";
                resolve(store);
            })
        });
    }

}