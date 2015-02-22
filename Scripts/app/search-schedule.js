var dateFormatQuery = "YYYY-MM-DD";
var shortTimeFormat = "HH:mm";
var titleModel = new TrainDelayed.Search.TitleViewModel();
var webApi;
$(function () {
    webApi = new TrainNotifier.WebApi();
    ko.applyBindings(titleModel, $("#parent").get(0));
    ko.applyBindings(titleModel, $("#results").get(0));
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
        cmdString = cmdString.replace("#!", "");
        var elements = cmdString.split('/');
        if (elements.length == 4) {
            var from = elements[0].toUpperCase();
            var to = elements[1].toUpperCase();
            var date = moment(elements[2], dateFormatQuery);
            var time = elements[3].split('-');
            if (time.length === 2) {
                date.hours(parseInt(time[0]));
                date.minutes(parseInt(time[1]));
            }
            getCallingBetween(from, to, date);
            var neg2 = moment(date).subtract({
                hours: TrainNotifier.DateTimeFormats.timeFrameHours
            });
            var plus2 = moment(date).add({
                hours: TrainNotifier.DateTimeFormats.timeFrameHours
            });
            $("#neg-2hrs").attr("href", "#!" + from + "/" + to + "/" + neg2.format("YYYY-MM-DD/HH-mm"));
            $("#plus-2hrs").attr("href", "#!" + from + "/" + to + "/" + plus2.format("YYYY-MM-DD/HH-mm"));
        }
        else {
        }
    }
    return false;
}
function getCallingBetween(from, to, date) {
    if (date === void 0) { date = moment(); }
    preAjax();
    titleModel.results.removeAll();
    $.when(webApi.getStanoxByCrsCode(from), webApi.getStanoxByCrsCode(to)).done(function (from, to) {
        titleModel.from(TrainNotifier.TiplocHelper.toDisplayString(from));
        titleModel.to(TrainNotifier.TiplocHelper.toDisplayString(to));
        getCallingBetweenByStanox(from, to, date);
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
    $.when(webApi.getTiplocs(), webApi.getDelays(from.CRS, to.CRS, startDate, endDate), webApi.getCancellations(from.CRS, to.CRS, startDate, endDate)).done(function (stations, delays, cancellations) {
        if (delays && delays.length > 0) {
            var viewModels = delays.map(function (delay) {
                return new TrainDelayed.Search.Train(from, to, delay, stations);
            }).concat(cancellations.map(function (cancellation) {
                return new TrainDelayed.Search.Train(from, to, cancellation, stations);
            })).sort(function (a, b) {
                return moment(a.expectedDeparture, TrainNotifier.DateTimeFormats.timeFormat).isAfter(moment(b.expectedDeparture, TrainNotifier.DateTimeFormats.timeFormat)) ? 1 : -1;
            });
            for (var i = 0; i < viewModels.length; i++) {
                if (viewModels[i].headcode) {
                    titleModel.results.push(viewModels[i]);
                }
            }
        }
        else {
            show($("#no-results-row"));
        }
    }).always(function () {
        hide($(".progress"));
    }).fail(function () {
        show($("#error-row"));
    });
}
