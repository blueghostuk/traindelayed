/// <reference path="../typings/knockout/knockout.d.ts" />
/// <reference path="common.ts" />
/// <reference path="Tocs.ts" />
/// <reference path="webApi.ts" />

module TrainDelayed.Search {

    export class TitleViewModel {
        public from = ko.observable<string>();
        public to = ko.observable<string>();
        public dateString = ko.observable<string>();
        public results = ko.observableArray<TrainDelayed.Search.Train>();
    }

    export class Train {

        public headcode: string;
        public url: string;
        public originStation: string;
        public originStationShort: string;
        public destStation: string;
        public destStationShort: string;
        public fromStation: string;
        public fromPlatform: string;
        public changeOfOriginStation: string = null;
        public expectedDeparture: string;
        public actualDeparture: string;
        public toStation: string;
        public toPlatform: string;
        public cancelledAtStation: string = null;
        public expectedArrival: string;
        public actualArrival: string;
        public delay: string;
        public delayText: string;
        public delayCss: string;
        public tocCode: string;
        public tocName: string;
        public tocUrl: string;
        public changeOfOrigin: boolean = false;
        public cancelled: boolean = false;
        public title: string = null;

        constructor(fromTiploc: StationTiploc, toTiploc: StationTiploc, train: any, tiplocs: StationTiploc[]) {

            var delayOrCancellation: TrainResult = train;

            this.headcode = delayOrCancellation.Headcode;

            var originTiploc = delayOrCancellation.Origin;
            this.originStation = TrainNotifier.TiplocHelper.toDisplayString(originTiploc);
            this.originStationShort = TrainNotifier.TiplocHelper.toDisplayString(originTiploc, true, true);

            var destTiploc = delayOrCancellation.Dest;
            this.destStation = TrainNotifier.TiplocHelper.toDisplayString(destTiploc);
            this.destStationShort = TrainNotifier.TiplocHelper.toDisplayString(destTiploc, true, true);

            this.fromStation = TrainNotifier.TiplocHelper.toDisplayString(fromTiploc);
            this.toStation = TrainNotifier.TiplocHelper.toDisplayString(toTiploc);

            var toc: TrainDelayed.TrainOperatingCompany;
            if (delayOrCancellation.Operator) {
                toc = tocs[train.Operator.Code];
            }
            if (toc) {
                this.tocCode = toc.code;
                this.tocName = toc.name;
                this.tocUrl = toc.webLink;
            } else {
                this.tocCode = null;
                this.tocName = null;
                this.tocUrl = null;
            }

            if (train.From) {
                var delay: Delay = train;
                this.url = TrainNotifier.Common.serverSettings.trainLink + "/" + delay.Uid + "/" + moment(delay.From.Expected).format(TrainNotifier.DateTimeFormats.dateQueryFormat);
                this.expectedDeparture = TrainNotifier.DateTimeFormats.formatDateTimeString(delay.From.Expected, TrainNotifier.DateTimeFormats.timeFormat);
                this.fromPlatform = delay.From.Platform;
                if (delay.From.Actual) {
                    this.actualDeparture = TrainNotifier.DateTimeFormats.formatDateTimeString(delay.From.Actual, TrainNotifier.DateTimeFormats.timeFormat);
                    this.fromPlatform = delay.From.Platform || this.fromPlatform;
                } else {
                    this.actualDeparture = "Unknown";
                }
                this.expectedArrival = TrainNotifier.DateTimeFormats.formatDateTimeString(delay.To.Expected, TrainNotifier.DateTimeFormats.timeFormat);
                this.toPlatform = delay.To.Platform;

                if (delay.To.Actual) {
                    this.actualArrival = TrainNotifier.DateTimeFormats.formatDateTimeString(delay.To.Actual, TrainNotifier.DateTimeFormats.timeFormat);
                    this.delay = delay.DelayTime.toString();
                    this.delayText = delay.DelayTime > 0 ? delay.DelayTime + "L" : delay.DelayTime == 0 ? "RT" : (delay.DelayTime * -1) + "E";
                    this.delayCss = delay.DelayTime >= 30 ? "danger" : delay.DelayTime > 0 ? "warning" : "success";
                    this.toPlatform = delay.To.Platform || this.toPlatform;
                } else {
                    this.actualArrival = "Unknown";
                    this.delay = "Unknown";
                    this.delayText = "not known";
                    this.delayCss = "";
                }
            } else {
                this.cancelled = true;
                var cancellation: Cancellation = train;
                this.url = TrainNotifier.Common.serverSettings.trainLink + "/" + cancellation.Uid + "/" + moment(cancellation.OriginDepartTimestamp).format(TrainNotifier.DateTimeFormats.dateQueryFormat);
                this.expectedDeparture = TrainNotifier.DateTimeFormats.formatTimeString(cancellation.FromExpected);
                this.fromPlatform = "";
                this.actualDeparture = "";
                this.expectedArrival = TrainNotifier.DateTimeFormats.formatTimeString(cancellation.ToExpected);
                this.toPlatform = "";
                this.actualArrival = "";

                this.delay = "C";
                this.delayText = "C";
                this.delayCss = "";
            }
        }

    }

}