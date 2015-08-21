var ss = require("sdk/simple-storage");
var sp = require("sdk/simple-prefs");
var { setTimeout } = require("sdk/timers");
var { Request } = require("sdk/request");
var { PageMod } = require("sdk/page-mod");
var panel;

// check to see if storage exists
if(!ss.storage.visitCounter) {
    ss.storage.visitCounter = 0;
    // Tracks the visitCounter
}
if(!ss.storage.urlwhitelist) {
    ss.storage.urlwhitelist = ["about:", "resource://"];
    // An array for the urls
}

// On load see if the page is in whitelist, if not increment counter.
require("sdk/tabs").on("ready", checkPage);
function checkPage(tab) {
    var isWhite = false;
    for(var i in ss.storage.urlwhitelist) {
        if(tab.url.search(ss.storage.urlwhitelist[i]) != -1) {
            // Easy matching for domains or pages.
            isWhite = true;
        }
    }
    if(!isWhite) {
        // Increment counter in storage, then send results to server.
        ss.storage.visitCounter = ss.storage.visitCounter + 1;
        Request({
            url: sp.prefs.statsurl + "?apikey=" + sp.prefs.apikey + "&count=" + ss.storage.visitCounter
        }).get();
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
    setTimeout(function() {panel.hide();panel.destroy();}, sp.prefs.timeout * 1000);
}

PageMod({
    include: "resource://workaccounter-at-arenlor-dot-com/data/whitelist.html",
    contentScriptFile: "./../lib/whitelist.js",
    contentScriptWhen: "ready",
    onAttach: whitelisteditor
});

function whitelisteditor(worker) {
    // Sends and receives the whitelist, and lets it know it's okay to reload when saved.
    worker.port.emit("liststorage", ss.storage.urlwhitelist);
    worker.port.on("editstorage", function(editstorage) {ss.storage.urlwhitelist = editstorage; worker.port.emit("listsaved",true);});
}

// Launches the editor
sp.on("wleditor", function() {require("sdk/tabs").open("resource://workaccounter-at-arenlor-dot-com/data/whitelist.html");});

// Resets the counter to 0 both in storage and on the server.
sp.on("counterReset",function() {Request({url: sp.prefs.statsurl + "?apikey=" + sp.prefs.apikey + "&count=0"}).get();ss.storage.visitCounter = 0;});