/// <reference path="../typings/bootstrap/bootstrap.d.ts" />
/// <reference path="webApi.ts" />
/// <reference path="../typings/moment/moment.d.ts" />
function preAjax() {
    show($(".progress"));
    hide($("#error-row"));
    hide($("#no-results-row"));
}

function show(element) {
    $(element).removeClass("hide");
    $(element).show();
}

function hide(element) {
    $(element).hide();
    $(element).addClass("hide");
}

var TrainDelayed;
(function (TrainDelayed) {
    var Common = (function () {
        function Common() {
        }
        Common.displayStanox = function (stanox) {
            if (!stanox)
                return;
            var html = "";
            if (stanox.StationName) {
                html = stanox.StationName.toLowerCase();
            } else {
                html = stanox.Tiploc.toLowerCase();
            }
            if (stanox.CRS) {
                html += " (" + stanox.CRS + ")";
            }
            $(".stanox-" + stanox.Stanox).html(html);
            $(".stanox-" + stanox.Stanox).tooltip({
                title: stanox.Stanox
            });
            $(".stanox-" + stanox.Stanox).addClass("stationName");
        };
        return Common;
    })();
    TrainDelayed.Common = Common;
    ;

    var DateTimeFormats = (function () {
        function DateTimeFormats() {
        }
        DateTimeFormats.formatTimeString = function (time) {
            if (time) {
                var timeMoment = moment(time, TrainDelayed.DateTimeFormats.timeFormat);
                var ts = timeMoment.format(TrainDelayed.DateTimeFormats.shortTimeFormat);
                if (timeMoment.seconds() === 30) {
                    ts += TrainDelayed.CommonStrings.halfMinute;
                }
                return ts;
            }
            return null;
        };

        DateTimeFormats.formatDateTimeString = function (dateTime) {
            if (dateTime) {
                var timeMoment = moment(dateTime);
                var ts = timeMoment.format(TrainDelayed.DateTimeFormats.shortTimeFormat);
                if (timeMoment.seconds() === 30) {
                    ts += TrainDelayed.CommonStrings.halfMinute;
                }
                return ts;
            }
            return null;
        };
        DateTimeFormats.timeUrlFormat = "HH-mm";
        DateTimeFormats.timeFormat = "HH:mm:ss";
        DateTimeFormats.shortTimeFormat = "HH:mm";
        DateTimeFormats.dateFormat = "DD/MM/YY";
        DateTimeFormats.dateTimeFormat = "DD/MM/YY HH:mm:ss";
        DateTimeFormats.dateTimeHashFormat = "YYYY-MM-DD/HH-mm";
        DateTimeFormats.dateQueryFormat = "YYYY-MM-DD";
        DateTimeFormats.dateUrlFormat = "YYYY/MM/DD";
        DateTimeFormats.dateTitleFormat = "ddd Do MMM YYYY";
        DateTimeFormats.dateTimeApiFormat = "YYYY-MM-DDTHH:mm";
        DateTimeFormats.timeFrameHours = 1;
        return DateTimeFormats;
    })();
    TrainDelayed.DateTimeFormats = DateTimeFormats;
    ;

    var CommonStrings = (function () {
        function CommonStrings() {
        }
        CommonStrings.halfMinute = "½";
        return CommonStrings;
    })();
    TrainDelayed.CommonStrings = CommonStrings;
    ;
})(TrainDelayed || (TrainDelayed = {}));
