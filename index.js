var ss = require("sdk/simple-storage");
var preferences = require("sdk/simple-prefs").prefs;
var { setTimeout } = require("sdk/timers");
var { Request } = require("sdk/request");
var panel;

// check to see if storage exists
if(!ss.storage.visitCounter) {
    ss.storage.visitCounter = 0;
    // Tracks the visitCounter
}
if(!ss.storage.urlwhitelist) {
    ss.storage.urlwhitelist = [];
    // An array for the urls
}

// On load see if the page is in whitelist, if not increment counter.
require("sdk/tabs").on("ready", checkPage);
function checkPage(tab) {
    var isWhite = false;
    for(var i in ss.storage.urlwhitelist) {
        if(tab.url.search(ss.storage.urlwhitelist[i]) != -1) {
            isWhite = true;
        }
    }
    if(!isWhite) {
        ss.storage.visitCounter = ss.storage.visitCounter + 1;
        Request({
            url: preferences.statsurl + "?apikey=" + preferences.apikey + "&count=" + ss.storage.visitCounter,
        });
        makePanel();
    }
}

function makePanel() {
    // Sets the panel.
    panel = require("sdk/panel").Panel({
        contentURL: "./counter.html",
        contentScriptWhen: "end",
        contentScriptFile: "./../lib/counter.js"
    });
    panel.port.emit("counter", ss.storage.visitCounter);
    panel.show();
    setTimeout(function() {panel.hide();panel.destroy();}, preferences.timeout * 1000);
}