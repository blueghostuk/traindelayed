/// <reference path="../typings/bootstrap/bootstrap.d.ts" />
/// <reference path="webApi.ts" />
/// <reference path="../typings/moment/moment.d.ts" />

interface ServerSettings {
    apiUrl: string;
    trainLink: string;
    apiName: string;
}

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

module TrainNotifier {

    export class Common {
        static serverSettings: ServerSettings;
    };

    export class DateTimeFormats {
        public static timeUrlFormat = "HH-mm";
        public static timeFormat = "HH:mm:ss";
        public static shortTimeFormat = "HH:mm";
        public static dateFormat = "DD/MM/YY";
        public static dateTimeFormat = "DD/MM/YY HH:mm:ss";
        public static dateTimeHashFormat = "YYYY-MM-DD/HH-mm";
        public static dateQueryFormat = "YYYY-MM-DD";
        public static dateTitleFormat = "ddd Do MMM YYYY";
        public static dateTimeApiFormat = "YYYY-MM-DDTHH:mm";
        public static timeFrameHours = 2;
        public static timeFrameBeforeHours = 2;

        public static formatTimeString(time: string): string {
            if (time) {
                var timeMoment = moment(time, TrainNotifier.DateTimeFormats.timeFormat);
                var ts = timeMoment.format(TrainNotifier.DateTimeFormats.shortTimeFormat);
                if (timeMoment.seconds() === 30) {
                    ts += TrainNotifier.CommonStrings.halfMinute;
                }
                return ts;
            }
            return null;
        }

        public static formatDateTimeString(dateTime: string, format: string = DateTimeFormats.shortTimeFormat): string {
            if (dateTime) {
                var timeMoment = moment(dateTime);
                var ts = timeMoment.format(format);
                if (timeMoment.seconds() === 30) {
                    ts += TrainNotifier.CommonStrings.halfMinute;
                }
                return ts;
            }
            return null;
        }
    };

    export class CommonStrings {
        public static halfMinute = "½";
    };

}