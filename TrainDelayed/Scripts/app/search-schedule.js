/// <reference path="../typings/jquery.hashchange/jquery.hashchange.d.ts" />
/// <reference path="searchModels.ts" />
/// <reference path="../typings/moment/moment.d.ts" />
/// <reference path="../typings/knockout/knockout.d.ts" />
/// <reference path="../typings/jquery/jquery.d.ts" />
var titleFormat = "ddd Do MMM YYYY";
var dateFormat = "ddd DD MMM YY";
var dateFormatQuery = "YYYY-MM-DD";
var dateApiQuery = "YYYY-MM-DDTHH:mm";
var timeFormat = "HH:mm:ss";
var shortTimeFormat = "HH:mm";

var titleModel = new TrainDelayed.Search.TitleViewModel();

var webApi;

$(function () {
    webApi = new TrainDelayed.WebApi();
    TrainDelayed.Common.webApi = webApi;

    ko.applyBindings(titleModel, $("#parent").get(0));

    loadHashCommand();

    $(window).hashchange(function () {
        loadHashCommand();
    });

    $("#neg-2hrs,#plus-2hrs").click(function () {
        document.location.href = $(this).attr("href");
        window.location.reload();
    });
});

function loadHashCommand() {
    if (document.location.hash.length > 0) {
        var cmdString = document.location.hash;

        var elements = cmdString.split('/');
        if (elements.length >= 4) {
            var from = elements[1];
            var to = elements[3];
            var date = null;
            if (elements.length >= 5) {
                date = moment(elements[4], dateFormatQuery);
            } else {
                date = moment();
            }
            if (elements.length === 6) {
                var time = elements[5].split('-');
                if (time.length === 2) {
                    date.hour(time[0]);
                    date.minute(time[1]);
                }
            }
            getCallingBetween(from, to, date);
            var neg2 = moment(date).subtract({
                hours: TrainDelayed.DateTimeFormats.timeFrameHours
            });
            var plus2 = moment(date).add({
                hours: TrainDelayed.DateTimeFormats.timeFrameHours
            });
            $("#neg-2hrs").attr("href", "search/from/" + from + "/to/" + to + "/" + neg2.format("YYYY-MM-DD/HH-mm"));
            $("#plus-2hrs").attr("href", "search/from/" + from + "/to/" + to + "/" + plus2.format("YYYY-MM-DD/HH-mm"));
        } else {
            // TODO: display error
        }
    }
    return false;
}

function getCallingBetween(from, to, date) {
    preAjax();
    titleModel.results.removeAll();
    $.when(webApi.getStanoxByCrsCode(from), webApi.getStanoxByCrsCode(to)).done(function (from, to) {
        var fromTiploc = from[0];
        var toTiploc = to[0];
        if (!date) {
            date = moment();
        }
        titleModel.from(TrainDelayed.StationTiploc.toDisplayString(fromTiploc));
        titleModel.to(TrainDelayed.StationTiploc.toDisplayString(toTiploc));
        getCallingBetweenByStanox(fromTiploc, toTiploc, date);
    }).fail(function () {
        hide($(".progress"));
        show($("#error-row"));
    });
}

function getCallingBetweenByStanox(from, to, date) {
    var startDate = moment(date).subtract({
        hours: TrainDelayed.DateTimeFormats.timeFrameHours
    });
    var endDate = moment(date).add({
        hours: TrainDelayed.DateTimeFormats.timeFrameHours
    });

    titleModel.dateString(startDate.format(shortTimeFormat) + "-" + endDate.format(shortTimeFormat));

    var query;
    var startDateQuery = startDate.format(TrainDelayed.DateTimeFormats.dateTimeApiFormat);
    var endDateQuery = endDate.format(TrainDelayed.DateTimeFormats.dateTimeApiFormat);
    if (from.CRS && from.CRS.length == 3 && to.CRS && to.CRS.length == 3) {
        query = webApi.getTrainMovementsBetweenStations(from.CRS, to.CRS, startDateQuery, endDateQuery);
    } else {
        query = webApi.getTrainMovementsBetweenLocations(from.Stanox, to.Stanox, startDateQuery, endDateQuery);
    }
    query.done(function (data) {
        if (data && data.Movements.length > 0) {
            var viewModels = data.Movements.map(function (movement) {
                return new TrainDelayed.Search.Train(from, to, movement, data.Tiplocs);
            });
            for (var i = 0; i < viewModels.length; i++) {
                if (viewModels[i].headcode) {
                    titleModel.results.push(viewModels[i]);
                }
            }
        } else {
            show($("#no-results-row"));
        }
    }).always(function () {
        hide($(".progress"));
    }).fail(function () {
        hide($(".progress"));
        show($("#error-row"));
    });
}
