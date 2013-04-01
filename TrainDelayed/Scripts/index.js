/// <reference path="jquery-1.9.1.js" />

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