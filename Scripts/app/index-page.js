var timeFormat = "/HH-mm";
var dateFormat = "/YYYY-MM-DD";
var fromLocal = ko.observableArray();
var toLocal = ko.observableArray();
var webApi;
var locations = [];
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
    webApi.getTiplocs().done(function (results) {
        locations = results.filter(function (value) {
            return value.StationName && value.CRS && value.CRS.length > 0;
        }).map(function (value) {
            return {
                value: value.StationName,
                crs: value.CRS
            };
        });
        var locationLookup = new Bloodhound({
            name: 'stations-lookup',
            datumTokenizer: function (datum) {
                var nameTokens = Bloodhound.tokenizers.whitespace(datum.value);
                var crsTokens = Bloodhound.tokenizers.whitespace(datum.crs);
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
function findStation(value) {
    var matches = locations.filter(function (item) {
        return item.value.toLowerCase() == value.toLowerCase() && item.crs && item.crs.length > 0;
    });
    return matches.length > 0 ? matches[0] : null;
}
function doSearch() {
    var fromStation = $("#from-crs").val();
    var fromCrs = findStation(fromStation);
    if (fromCrs) {
        fromCrs = fromCrs.crs;
    }
    else {
        if (fromStation.length > 0)
            fromCrs = fromStation.substring(0, 4);
    }
    var toStation = $("#to-crs").val();
    var toCrs = findStation(toStation);
    if (toCrs) {
        toCrs = toCrs.crs;
    }
    else {
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
        }
        else {
            date = moment().format(dateFormat);
        }
        var time = "";
        var timeVal = $("#time-picker").val();
        if (timeVal && timeVal.length > 0) {
            timeVal = moment(timeVal, timeFormat);
            if (timeVal.isValid()) {
                time = timeVal.format(timeFormat);
            }
        }
        else {
            time = moment().format(timeFormat);
        }
        document.location.href = "search-results/#!" + fromCrs + "/" + toCrs + date + time;
    }
    return false;
}
function lookupLocalFrom() {
    $("#from-local > li:first").show();
    navigator.geolocation.getCurrentPosition(function (position) {
        webApi.getStationByLocation(position.coords.latitude, position.coords.longitude).done(function (stations) {
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
            $("#from-local > li:first").hide();
        });
    });
}
function lookupLocalTo() {
    $("#to-local > li:first").show();
    navigator.geolocation.getCurrentPosition(function (position) {
        webApi.getStationByLocation(position.coords.latitude, position.coords.longitude).done(function (stations) {
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
            $("#to-local > li:first").hide();
        });
    });
}
