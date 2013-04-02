/// <reference path="jquery-1.9.1.js" />
/// <reference path="viewmodels.js" />

var titleModel = new TitleViewModel();

var titleFormat = "ddd Do MMM YYYY";
var dateFormat = "ddd DD MMM YY";
var dateFormatQuery = "YYYY-MM-DD";
var dateApiQuery = "YYYY-MM-DDTHH:mm";
var timeFormat = "HH:mm:ss";
var shortTimeFormat = "HH:mm";

$(function () {
    ko.applyBindings(titleModel, $("#title").get(0));

    loadHashCommand();
});

function loadHashCommand() {
    if (document.location.hash.length > 0) {
        var cmdString = document.location.hash;

        var elements = cmdString.split(':');
        if (elements.length >= 4) {
            var from = elements[1];
            var to = elements[3];
            var date = null;
            if (elements.length >= 5) {
                date = moment(elements[4], dateFormatQuery);
            } else {
                date = moment();
            }
            var time = null;
            if (elements.length == 7) {
                date.hour(elements[5]);
                date.minute(elements[6]);
            }
            getCallingBetween(from, to, date);
        } else {
            // TODO: display error
        }
    }
    return false;
}

function getCallingBetween(from, to, date) {
    $(".progress").show();
    $("#error-row").hide();
    $("#no-results-row").hide();
    $.when(
        $.getJSON("http://" + server + ":" + apiPort + "/Stanox/?GetByCrs&crsCode=" + from),
        $.getJSON("http://" + server + ":" + apiPort + "/Stanox/?GetByCrs&crsCode=" + to))
    .done(function (from, to) {
        var title = "Trains from " + from[0].Description.toLowerCase() + " to " + to[0].Description.toLowerCase();
        if (!date) {
            title += " on " + new moment().format(titleFormat);
        } else {
            title += " on " + date.format(titleFormat);
        }
        titleModel.Text(title);
        getCallingBetweenByStanox(from[0], to[0], date);
    }).fail(function () {
        $(".progress").hide();
        $("#error-row").show();
    });
}

function getCallingBetweenByStanox(from, to, date) {
    var startDate = moment(date).subtract(2, 'hours');
    var endDate = moment(date).add(2, 'hours');
    titleModel.Text(titleModel.Text() + " " + startDate.format(shortTimeFormat) + "-" + endDate.format(shortTimeFormat));
    $.getJSON("http://" + server + ":" + apiPort + "/TrainMovement/" + from.Name + "/" + to.Name +
        "?startDate=" + startDate.format(dateApiQuery) +
        "&endDate=" + endDate.format(dateApiQuery)
    ).done(function (data) {
        if (data && data.length) {

            var results = Array();
            for (i in data) {
                results.push(new TrainViewModel(data[i], to.Description));
            }

            ko.applyBindings(results, $("#search-results").get(0));
        } else {
            $("#no-results-row").show();
        }
    }
    ).complete(function () {
        $(".progress").hide();
    }).fail(function () {
        $("#error-row").show();
    });

}