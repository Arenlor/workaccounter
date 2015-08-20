var ss = require("sdk/simple-storage");
var preferences = require("sdk/simple-prefs").prefs;
var { setTimeout } = require("sdk/timers");
var panel;

// check to see if storage exists
if(!ss.storage.visitCounter) {
    ss.storage.visitCounter = 0;
    // Tracks the visitCounter
}
if(!ss.storage.apikey) {
    ss.storage.apikey = "";
    // The apikey used
}
if(!ss.storage.urlwhitelist) {
    ss.storage.urlwhitelist = [];
    // An array for the urls
}

// On load see if the page is in whitelist, if not increment counter.
require("sdk/tabs").on("ready", checkPage);
function checkPage(tab) {
    if(true) {
        ss.storage.visitCounter = ss.storage.visitCounter + 1;
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