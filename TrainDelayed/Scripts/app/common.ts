/// <reference path="../typings/bootstrap/bootstrap.d.ts" />
/// <reference path="webApi.ts" />
/// <reference path="../typings/moment/moment.d.ts" />

interface IServerSettings {
    apiUrl: string;
    trainLink: string;
    apiName: string;
}

module TrainDelayed {

    export class Common {

        static serverSettings: IServerSettings;
        static webApi: IWebApi;

        static displayStanox(stanox: IStationTiploc) {
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
        }
    };

    export class DateTimeFormats {
        public static timeUrlFormat = "HH-mm";
        public static timeFormat = "HH:mm:ss";
        public static shortTimeFormat = "HH:mm";
        public static dateFormat = "DD/MM/YY";
        public static dateTimeFormat = "DD/MM/YY HH:mm:ss";
        public static dateTimeHashFormat = "YYYY-MM-DD/HH-mm";
        public static dateQueryFormat = "YYYY-MM-DD";
        public static dateUrlFormat = "YYYY/MM/DD";
        public static dateTitleFormat = "ddd Do MMM YYYY";
        public static dateTimeApiFormat = "YYYY-MM-DDTHH:mm";
        public static timeFrameHours = 1;

        public static formatTimeString(time: string): string {
            if (time) {
                var timeMoment = moment(time, TrainDelayed.DateTimeFormats.timeFormat);
                var ts = timeMoment.format(TrainDelayed.DateTimeFormats.shortTimeFormat);
                if (timeMoment.seconds() === 30) {
                    ts += TrainDelayed.CommonStrings.halfMinute;
                }
                return ts;
            }
            return null;
        }

        public static formatDateTimeString(dateTime: string): string {
            if (dateTime) {
                var timeMoment = moment(dateTime);
                var ts = timeMoment.format(TrainDelayed.DateTimeFormats.shortTimeFormat);
                if (timeMoment.seconds() === 30) {
                    ts += TrainDelayed.CommonStrings.halfMinute;
                }
                return ts;
            }
            return null;
        }
    };

    export class CommonStrings {
        public static halfMinute = "�";
    };

}