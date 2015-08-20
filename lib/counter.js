var count = document.getElementById("counter");
self.port.on("counter", function(counter) {
    count.textContent = counter;
});