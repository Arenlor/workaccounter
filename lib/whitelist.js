var editstorage;

self.port.on("liststorage", function(liststorage) {
    editstorage = liststorage;
    // needed for below
    for(var i in liststorage) {
        // create three new elements, a text input with the current match, a checkbox to delete, and a line break to make it easier to read.
        var url = document.createElement("input");
        url.setAttribute("type","text");
        url.setAttribute("name",i);
        url.setAttribute("value",liststorage[i]);
        var cb = document.createElement("input");
        cb.setAttribute("type","checkbox");
        cb.setAttribute("name","del"+i);
        var br = document.createElement("br");
        document.getElementsByTagName("form")[0].appendChild(url);
        document.getElementsByTagName("form")[0].appendChild(cb);
        document.getElementsByTagName("form")[0].appendChild(br);
    }
    // create the blank text input for a new one.
    var neo = document.createElement("input");
    neo.setAttribute("type","text");
    neo.setAttribute("name",liststorage.length);
    document.getElementsByTagName("form")[0].appendChild(neo);
});

document.getElementsByTagName("button")[0].addEventListener("click",updateList);
// Listens for the button to be clicked.

function updateList() {
    // Deletes anything that's needed.
    for(var i in editstorage) {
        if(document.getElementsByName("del"+i)[0].checked) {
            delete editstorage[i];
        }
    }
    // Edits any values
    for(var i in editstorage) {
        editstorage[i] = document.getElementsByName(i)[0].value;
    }
    // adds any new entry
    if(document.getElementsByName(editstorage.length)[0].value.length > 0) {
        editstorage.push(document.getElementsByName(editstorage.length)[0].value);
    }
    self.port.emit("editstorage", editstorage);
    self.port.on("listsaved", function() {location.reload();});
}