/// <reference path="common.ts" />
/// <reference path="Tocs.ts" />
/// <reference path="webApi.ts" />

module TrainDelayed.Search {

    export class Train {

        public headcode: string;
        public url: string;
        public originStation: string;
        public destStation: string;
        public fromStation: string;
        public changeOfOriginStation: string;
        public expectedDeparture: string;
        public actualDeparture: string;
        public toStation: string;
        public cancelledAtStation: string;
        public expectedArrival: string;
        public actualArrival: string;
        public delay: string;
        public toc: ITrainOperatingCompany;

        constructor(fromTiploc: IStationTiploc, toTiploc: IStationTiploc, train: ITrainMovementResult, tiplocs: IStationTiploc[], tocs: ITrainOperatingCompany[]) {
            
            this.headcode = train.Actual.HeadCode;
            this.url = Common.serverSettings.trainLink + "/"
                + train.Schedule.TrainUid + "/"
                + moment(train.Actual.OriginDepartTimestamp).format(DateTimeFormats.dateUrlFormat);

            var origin = train.Schedule.Stops[0];
            var originTiploc = StationTiploc.findStationTiploc(origin.TiplocStanoxCode, tiplocs);
            this.originStation = originTiploc.StationName.toLowerCase();

            var dest = train.Schedule.Stops[train.Schedule.Stops.length - 1];
            var destTiploc = StationTiploc.findStationTiploc(dest.TiplocStanoxCode, tiplocs);
            this.destStation = destTiploc.StationName.toLowerCase();


            this.fromStation = fromTiploc.StationName.toLowerCase();


            this.toStation = toTiploc.StationName.toLowerCase();

        }

    }

}