/// <reference path="common.ts" />
/// <reference path="webApi.ts" />
/// <reference path="../typings/knockout/knockout.d.ts" />
/// <reference path="../typings/bootstrap.datepicker/bootstrap.datepicker.d.ts" />
/// <reference path="../typings/moment/moment.d.ts" />
/// <reference path="../typings/bootstrap/bootstrap.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />

var timeFormat = "/HH-mm";
var dateFormat = "/YYYY-MM-DD";

var fromLocal = ko.observableArray();
var toLocal = ko.observableArray();

var webApi: IWebApi;

$(function () {
    webApi = new TrainDelayed.WebApi();
    TrainDelayed.Common.webApi = webApi;

    $('.datepicker').datepicker({
        format: 'dd/mm/yyyy'
    }).on("changeDate", function () {
        $(this).datepicker('hide');
    });
    $("form").submit(function () {
        return doSearch();
    });
    $(".station-lookup").attr("placeholder", "Loading stations ...");
    ko.applyBindings(fromLocal, $("#from-local").get(0));
    ko.applyBindings(toLocal, $("#to-local").get(0));
    loadStations();
});

function loadStations() {
    webApi.getStations().done(function (stations: IStationTiploc[]) {
        var locations = [];
        for (var i in stations) {
            locations.push(stations[i].StationName + ' (' + stations[i].CRS + ' - ' + stations[i].Tiploc + ')');
        }
        $(".station-lookup").typeahead({
            source: locations,
            sorter: function (items: string[]) {
                var self = this;
                return items.sort(function (a: string, b: string) {
                    var aCrs = a.substr(a.lastIndexOf('(') + 1, 3);
                    var bCrs = b.substr(b.lastIndexOf('(') + 1, 3);

                    if (self.query.toLowerCase() == aCrs.toLowerCase())
                        return -1;
                    else if (self.query.toLowerCase() == bCrs.toLowerCase())
                        return 1;
                    else
                        return aCrs > bCrs ? 1 : -1;
                });
            }
        });
        $("#from-crs").attr("placeholder", "Type from station name here");
        $("#to-crs").attr("placeholder", "Type to station name here");
    });
}

function doSearch() {
    var fromStation = $("#from-crs").val();
    var toStation = $("#to-crs").val();
    var fromCrs = fromStation.substr(fromStation.lastIndexOf('(') + 1, 3);
    var toCRS = toStation.substr(toStation.lastIndexOf('(') + 1, 3);
    if (fromCrs && fromCrs.length === 3 && toCRS && toCRS.length === 3) {
        var date = "";
        var dateVal = $("#date-picker").val();
        if (dateVal && dateVal.length > 0) {
            dateVal = moment(dateVal, "DD-MM-YYYY");
            if (dateVal.isValid()) {
                date = dateVal.format(dateFormat);
            }
        } else {
            date = moment().format(dateFormat);
        }
        var time = "";
        var timeVal = $("#time-picker").val();
        if (timeVal && timeVal.length > 0) {
            timeVal = moment(timeVal, timeFormat);
            if (timeVal.isValid()) {
                time = timeVal.format(timeFormat);
            }
        } else {
            time = moment().format(timeFormat);
        }
        document.location.href = "search/from/" + fromCrs + "/to/" + toCRS + date + time;
    }
    return false;
}

function lookupLocalFrom() {
    navigator.geolocation.getCurrentPosition(function (position) {
        webApi.getStationByLocation(position.coords.latitude, position.coords.longitude).done(function (stations: IStationTiploc[]) {
            fromLocal.removeAll();
            if (stations && stations.length > 0) {
                for (var i in stations) {
                    fromLocal.push(stations[i].StationName + ' (' + stations[i].CRS + ' - ' + stations[i].Tiploc + ')');
                }
            }
        });
    });
}

function lookupLocalTo() {
    navigator.geolocation.getCurrentPosition(function (position) {
        webApi.getStationByLocation(position.coords.latitude, position.coords.longitude).done(function (stations: IStationTiploc[]) {
            toLocal.removeAll();
            if (stations && stations.length > 0) {
                for (var i in stations) {
                    toLocal.push(stations[i].StationName + ' (' + stations[i].CRS + ' - ' + stations[i].Tiploc + ')');
                }
            }
        });
    });
}