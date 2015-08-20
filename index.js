var preferences = require("sdk/simple-prefs").prefs;
var { setTimeout } = require("sdk/timers");
var panel;

// On load see if the page is in whitelist, if not increment counter.
require("sdk/tabs").on("ready", checkPage);
function checkPage(tab) {
    if(true) {
        preferences.visitCounter = preferences.visitCounter + 1;
    }
}

function makePanel() {
    // Sets the panel.
    panel = require("sdk/panel").Panel({
        contentURL: "./counter.html",
        contentScriptWhen: "end",
        contentScriptFile: "./../lib/counter.js"
    });
    panel.port.emit("counter", preferences.visitCounter);
    panel.show();
    setTimeout(function() {panel.hide();panel.destroy();}, preferences.timeout * 1000);
}

//When the counter increments in checkPage, show the panel for the timeout time.
require("sdk/simple-prefs").on("visitCounter", makePanel);