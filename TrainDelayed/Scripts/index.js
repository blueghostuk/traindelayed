/// <reference path="jquery-1.9.1.js" />
/// <reference path="moment-datepicker.js" />
/// <reference path="moment.js" />

var timeFormat = "HH:mm";
var dateFormat = "YYYY-MM-DD";

$(function () {
    $('.datepicker').datepicker({
        format: 'DD-MM-YYYY',
        autoHide: true
    });
    $(".station-lookup").attr("placeholder", "Loading stations ...");
    loadStations();
});

function loadStations() {
    $.getJSON("http://" + server + ":" + apiPort + "/Station/")
    .done(function (stations) {
        var locations = [];
        for (i in stations) {
            locations.push(stations[i].StationName + ' (' + stations[i].CRS + ' - ' + stations[i].Tiploc + ')');
        }
        $(".station-lookup").typeahead({
            source: locations
        });
        $("#from-crs").attr("placeholder", "Type from station name here");
        $("#to-crs").attr("placeholder", "Type to station name here");
    });
}

function doSearch() {
    var fromStation = $("#from-crs").val();
    var toStation = $("#to-crs").val();
    var fromCrs = fromStation.substr(fromStation.indexOf('(') + 1, 3);
    var toCRS = toStation.substr(toStation.indexOf('(') + 1, 3);
    if (fromCrs && fromCrs.length == 3 && toCRS && toCRS.length == 3) {
        var date = "";
        var dateVal = $("#date-picker").val();
        if (dateVal && dateVal.length > 0) {
            dateVal = moment(dateVal, "DD-MM-YYYY");
            if (dateVal.isValid()) {
                date = ":" + dateVal.format(dateFormat);
            }
        } else {
            date = ":" + moment().format(dateFormat);
        }
        var time = "";
        var timeVal = $("#time-picker").val();
        if (timeVal && timeVal.length > 0) {
            timeVal = moment(timeVal, timeFormat);
            if (timeVal.isValid()) {
                time = ":" + timeVal.format(timeFormat)
            }
        } else {
            time = ":" + moment().format(timeFormat);
        }
        document.location.href = "search-results#from:" + fromCrs + ":to:" + toCRS + date + time;
        return false;
    } else {
        return false;
    }
}