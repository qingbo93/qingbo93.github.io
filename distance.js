function CalcDist(data) {
    var x1 = data.x1;
    var y1 = data.y1;
    var x2 = data.x2;
    var y2 = data.y2;

    var lat1 = x1 * Math.PI / 180;;
    var lon1 = y1 * Math.PI / 180;;
    var lat2 = x2 * Math.PI / 180;;
    var lon2 = y2 * Math.PI / 180;;

    var lat = lat2 - lat1;
    var lon = lon2 - lon1;

    var a = Math.pow(Math.sin(lat / 2), 2) + Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(lon / 2), 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    dkm = c * 6373;
    dkm = Math.round(dkm * 1000) / 1000;

    close();
}
self.onmessage = function(evt) {

    CalcDist(evt.data);
    postMessage("The Distance is: " + dkm + "km.");
}
