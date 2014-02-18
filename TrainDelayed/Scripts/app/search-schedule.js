var titleFormat = "ddd Do MMM YYYY";
var dateFormat = "ddd DD MMM YY";
var dateFormatQuery = "YYYY-MM-DD";
var dateApiQuery = "YYYY-MM-DDTHH:mm";
var timeFormat = "HH:mm:ss";
var shortTimeFormat = "HH:mm";

var titleModel = new TrainDelayed.Search.TitleViewModel();

var webApi;

$(function () {
    webApi = new TrainNotifier.WebApi();
    TrainNotifier.Common.webApi = webApi;

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
        cmdString = cmdString.replace("!", "");

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
                hours: TrainNotifier.DateTimeFormats.timeFrameHours
            });
            var plus2 = moment(date).add({
                hours: TrainNotifier.DateTimeFormats.timeFrameHours
            });
            $("#neg-2hrs").attr("href", "search/from/" + from + "/to/" + to + "/" + neg2.format("YYYY-MM-DD/HH-mm"));
            $("#plus-2hrs").attr("href", "search/from/" + from + "/to/" + to + "/" + plus2.format("YYYY-MM-DD/HH-mm"));
        } else {
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
        titleModel.from(TrainNotifier.StationTiploc.toDisplayString(fromTiploc));
        titleModel.to(TrainNotifier.StationTiploc.toDisplayString(toTiploc));
        getCallingBetweenByStanox(fromTiploc, toTiploc, date);
    }).fail(function () {
        hide($(".progress"));
        show($("#error-row"));
    });
}

function getCallingBetweenByStanox(from, to, date) {
    var startDate = moment(date).subtract({
        hours: TrainNotifier.DateTimeFormats.timeFrameBeforeHours
    });
    var endDate = moment(date).add({
        hours: TrainNotifier.DateTimeFormats.timeFrameHours
    });

    titleModel.dateString(startDate.format(shortTimeFormat) + "-" + endDate.format(shortTimeFormat));

    var query;
    var startDateQuery = startDate.format(TrainNotifier.DateTimeFormats.dateTimeApiFormat);
    var endDateQuery = endDate.format(TrainNotifier.DateTimeFormats.dateTimeApiFormat);
    if (from.CRS && from.CRS.length == 3 && to.CRS && to.CRS.length == 3) {
        query = webApi.getTrainMovementsBetweenStations(from.CRS, to.CRS, startDateQuery, endDateQuery);
    } else {
        query = webApi.getTrainMovementsBetweenLocations(from.Stanox, to.Stanox, startDateQuery, endDateQuery);
    }
    query.done(function (data) {
        if (data && data.Movements.length > 0) {
            var filteredData = data.Movements.filter(function (movement) {
                return movement.Schedule.AtocCode && movement.Schedule.AtocCode.Code.length > 0 && movement.Schedule.AtocCode.Code != TrainDelayed.TrainOperatingCompany.Freight;
            });

            var viewModels = filteredData.map(function (movement) {
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
        show($("#error-row"));
    });
}
