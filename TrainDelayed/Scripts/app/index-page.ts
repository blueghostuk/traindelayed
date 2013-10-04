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

interface IStationLookup {
    value: string;
    crs: string;
    tokens?: Array<string>
}

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
var locations: Array<IStationLookup> = [];

declare var Hogan: any;

function loadStations() {
    webApi.getStations().done(function (results: IStationTiploc[]) {
        for (var i = 0; i < results.length; i++) {
            locations.push({
                value: results[i].StationName,
                crs: results[i].CRS,
                tokens: [results[i].StationName, results[i].CRS, results[i].Tiploc]
            });
        }
        $(".station-lookup").typeahead({
            name: 'stations-lookup',
            local: locations,
            template: '<p><strong>{{value}}</strong>&nbsp;({{crs}})</p>',
            engine: Hogan
        });
        $("#from-crs").attr("placeholder", "Type from station name here");
        $("#to-crs").attr("placeholder", "Type to station name here");
    });
}

function findStation(value: string): IStationLookup {
    var matches = locations.filter(function (item) {
        return item.value.toLowerCase() == value.toLowerCase();
    });
    return matches.length > 0 ? matches[0] : null;
}

function doSearch() {
    var fromStation: string = $("#from-crs").val();
    var fromCrs: any = findStation(fromStation);
    if (fromCrs) {
        fromCrs = fromCrs.crs;
    } else {
        if (fromStation.length > 0)
            fromCrs = fromStation.substring(0, 4);
    }
    var toStation: string = $("#to-crs").val();
    var toCrs: any = findStation(toStation);
    if (toCrs) {
        toCrs = toCrs.crs;
    } else {
        if (toStation.length > 0)
            toCrs = toStation.substring(0, 4);
    }
    if (fromCrs && fromCrs.length === 3 && toCrs && toCrs.length === 3) {
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
        document.location.href = "search/from/" + fromCrs + "/to/" + toCrs + date + time;
    }
    return false;
}

function lookupLocalFrom() {
    navigator.geolocation.getCurrentPosition(function (position) {
        webApi.getStationByLocation(position.coords.latitude, position.coords.longitude).done(function (stations: IStationTiploc[]) {
            fromLocal.removeAll();
            if (stations && stations.length > 0) {
                for (var i in stations) {
                    fromLocal.push(stations[i].StationName);
                    locations.push({
                        value: stations[i].StationName,
                        crs: stations[i].CRS
                    });
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
                    toLocal.push(stations[i].StationName);
                    locations.push({
                        value: stations[i].StationName,
                        crs: stations[i].CRS
                    });
                }
            }
        });
    });
}