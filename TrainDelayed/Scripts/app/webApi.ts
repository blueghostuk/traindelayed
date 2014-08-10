module TrainNotifier {

    export class WebApi {

        private static tiplocsLocalStorageKey = "tn-tiplocs";

        constructor(public serverSettings?: ServerSettings) {
            if (!serverSettings) {
                this.serverSettings = TrainNotifier.Common.serverSettings;
            }
        }

        private getBaseUrl() {
            return "http://" + this.serverSettings.apiUrl;
        }

        private getArgs() {
            return {
                apiName: this.serverSettings.apiName
            };
        }

        getTiplocs(): JQueryPromise<Array<StationTiploc>> {
            var stations: string = localStorage.getItem(WebApi.tiplocsLocalStorageKey);
            if (stations) {
                return $.Deferred().resolve(JSON.parse(stations)).promise();
            } else {
                return $.getJSON(this.getBaseUrl() + "/Stanox/", this.getArgs()).then(function (stations: StationTiploc[]) {
                    localStorage.setItem(WebApi.tiplocsLocalStorageKey, JSON.stringify(stations));
                    return $.Deferred<StationTiploc[]>().resolve(stations).promise();
                });
            }
        }

        getStationByLocation(lat: number, lon: number, limit: number = 5) {
            return $.getJSON(this.getBaseUrl() + "/Station/GeoLookup", $.extend({}, this.getArgs(), {
                lat: lat,
                lon: lon,
                limit: limit
            }));
        }

        getStanoxByCrsCode(crsCode: string) {
            var self = this;
            return this.getTiplocs().then(function (stations: StationTiploc[]) {
                var match = TiplocHelper.findStationTiplocByCrsCode(crsCode, stations);
                return $.Deferred<StationTiploc>().resolve(match).promise();
            });
        }

        getDelays(fromCrs: string, toCrs: string, startDate: Moment, endDate: Moment): JQueryPromise<Delay[]> {
            var self = this;
            return $.when(
                this.getTiplocs(),
                $.getJSON(this.getBaseUrl() + "/delays/" + fromCrs + "/" + toCrs,
                    $.extend({}, this.getArgs(), {
                        startDate: startDate.format(DateTimeFormats.dateTimeApiFormat),
                        endDate: endDate.format(DateTimeFormats.dateTimeApiFormat)
                    }))).then(function (stations: Array<StationTiploc>, delaysResult) {
                    var delays: Array<Delay> = delaysResult[0];
                    for (var i = 0; i < delays.length; i++) {
                        delays[i].Origin = TiplocHelper.findStationTiplocByStanox(delays[i].OriginStanox, stations);
                        delays[i].Dest = TiplocHelper.findStationTiplocByStanox(delays[i].DestStanox, stations);
                    }
                    return $.Deferred<Delay[]>().resolve(delays).promise();
                });
        }
    }

    export class TiplocHelper {

        private static tiplocByStanoxCache: { [index: string]: Array<StationTiploc>; } = {};
        private static tiplocByCrsCodeCache: { [index: string]: Array<StationTiploc>; } = {};

        public static findStationTiplocsByStanox(stanoxCode: string, tiplocs: StationTiploc[]) {
            var cached = TiplocHelper.tiplocByStanoxCache[stanoxCode];
            if (!cached) {
                cached = tiplocs.filter(function (element: StationTiploc) {
                    return element.Stanox == stanoxCode;
                });
                TiplocHelper.tiplocByStanoxCache[stanoxCode] = cached;
            }
            return cached;
        }

        public static findStationTiplocByStanox(stanoxCode: string, tiplocs: StationTiploc[]) {
            var results = TiplocHelper.findStationTiplocsByStanox(stanoxCode, tiplocs);
            if (results && results.length > 0)
                return results[0];
            return null;
        }

        public static stationTiplocMatches(tiploc: StationTiploc, tiplocs: StationTiploc[]) {
            return tiplocs.some(function (t) {
                return t.CRS == tiploc.CRS ||
                    t.Stanox == tiploc.Stanox;
            });
        }

        public static findStationTiplocsByCrsCode(crsCode: string, tiplocs: StationTiploc[]) {
            var cached = TiplocHelper.tiplocByCrsCodeCache[crsCode];
            if (!cached) {
                cached = tiplocs.filter(function (element: StationTiploc) {
                    return element.CRS == crsCode;
                });
                TiplocHelper.tiplocByCrsCodeCache[crsCode] = cached;
            }
            return cached;
        }

        public static findStationTiplocByCrsCode(crsCode: string, tiplocs: StationTiploc[]) {
            var results = TiplocHelper.findStationTiplocsByCrsCode(crsCode, tiplocs);
            if (results && results.length > 0)
                return results[0];
            return null;
        }

        public static toDisplayString(tiploc: StationTiploc, lowercase: boolean = true, shorten: boolean = false) {
            var value = (tiploc.StationName && tiploc.StationName.length > 0 ? tiploc.StationName :
                tiploc.Description && tiploc.Description.length > 0 ? tiploc.Description : tiploc.Tiploc);
            var shortValue = shorten ? TiplocHelper.toShortDisplayString(tiploc.CRS) : null;
            if (!shortValue && lowercase)
                return value.toLowerCase();
            return shortValue!= null ? shortValue : value;
        }

        private static toShortDisplayString(crsCode: string) {
            if (!crsCode)
                return null;
            var shortCode = shortStations[crsCode];
            if (shortCode)
                return shortCode;
            return null;
        }
    }
}
interface AtocCode {
    Code: string;
    Name: string;
}

interface Delay {
    DelayTime: number;
    DestStanox: string;
    Dest: StationTiploc;
    From: DelayStop;
    Headcode: string;
    Operator: AtocCode;
    OriginStanox: string;
    Origin: StationTiploc;
    To: DelayStop;
    Uid: string;
}

interface DelayStop {
    Actual: string;
    Expected: string;
    Platform: string;
}

interface Tiploc {
    Tiploc: string;
    Nalco: string;
    Description: string;
    Stanox: string;
    CRS: string;
}

interface StationTiploc extends Tiploc {
    StationName: string;
    Lat: number;
    Lon: number;
}