var editstorage;
self.port.on("liststorage", function(liststorage) {
    editstorage = liststorage;
    for(var i in liststorage) {
        var url = document.createElement("input");
        url.setAttribute("type","text");
        url.setAttribute("name",i);
        url.setAttribute("value",liststorage[i]);
        var br = document.createElement("br");
        var cb = document.createElement("input");
        cb.setAttribute("type","checkbox");
        cb.setAttribute("name","del"+i);
        document.getElementsByTagName("form")[0].appendChild(url);
        document.getElementsByTagName("form")[0].appendChild(cb);
        document.getElementsByTagName("form")[0].appendChild(br);
    }
});

document.getElementsByTagName("button")[0].addEventListener("click",updateList);

function updateList() {
    for(var i in editstorage) {
        if(document.getElementsByName("del"+i)[0].checked) {
            delete editstorage[i];
        }
    }
    for(var i in editstorage) {
        editstorage[i] = document.getElementsByName(i)[0].value;
    }
    self.port.emit("editstorage", editstorage);
    location.reload();
}