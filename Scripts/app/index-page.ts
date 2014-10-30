var timeFormat = "/HH-mm";
var dateFormat = "/YYYY-MM-DD";

var fromLocal = ko.observableArray();
var toLocal = ko.observableArray();

var webApi: TrainNotifier.WebApi;
var locations: Array<IStationLookup> = [];

declare var Bloodhound: any;

interface JQuery {
    typeahead(options: any, datasets: any);
}

interface IStationLookup {
    value: string;
    crs: string;
}

$(function () {

    var now = moment();

    $("#date-picker").val(now.format("YYYY-MM-DD"));
    $("#time-picker").val(now.format("HH:mm"));

    webApi = new TrainNotifier.WebApi();

    $("form").submit(function () {
        return doSearch();
    });
    $(".station-lookup").attr("placeholder", "Loading stations ...");
    ko.applyBindings(fromLocal, $("#from-local").get(0));
    ko.applyBindings(toLocal, $("#to-local").get(0));
    loadStations();
});

function loadStations() {
    webApi.getTiplocs().done(function (results: StationTiploc[]) {

        locations = results.filter(function (value) { return value.StationName && value.CRS && value.CRS.length > 0; }).map(function (value) {
            return {
                value: value.StationName,
                crs: value.CRS
            };
        });

        var locationLookup = new Bloodhound({
            name: 'stations-lookup',
            datumTokenizer: function (datum: IStationLookup) {
                var nameTokens: Array<any> = Bloodhound.tokenizers.whitespace(datum.value);
                var crsTokens: Array<any> = Bloodhound.tokenizers.whitespace(datum.crs);

                return nameTokens.concat(crsTokens);
            },
            queryTokenizer: Bloodhound.tokenizers.whitespace,
            local: locations
        });

        locationLookup.initialize();

        $(".station-lookup").typeahead({
            highlight: true,
            autoselect: true
        }, {
                source: locationLookup.ttAdapter()
            });
        $("#from-crs").attr("placeholder", "Type from station name here");
        $("#to-crs").attr("placeholder", "Type to station name here");
    });
}

function findStation(value: string): IStationLookup {
    var matches = locations.filter(function (item) {
        return item.value.toLowerCase() == value.toLowerCase() &&
            item.crs && item.crs.length > 0;
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
            dateVal = moment(dateVal, "YYYY-MM-DD");
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
        webApi.getStationByLocation(position.coords.latitude, position.coords.longitude).done(function (stations: StationTiploc[]) {
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
        webApi.getStationByLocation(position.coords.latitude, position.coords.longitude).done(function (stations: StationTiploc[]) {
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