/// <reference path="moment.js" />
/// <reference path="knockout-2.2.0.js" />


function TitleViewModel() {
    var self = this;

    self.Text = ko.observable();
}

function TrainViewModel(json, callingAt) {
    var self = this;

    self.id = json.HeadCode;
    self.tocCode = json.AtocCode ? json.AtocCode.Code : "";
    self.tocName = json.AtocCode ? json.AtocCode.Name : "";
    self.from = json.Origin.Description.toLowerCase();
    self.to = json.Destination.Description.toLowerCase();
    self.callingAt = callingAt.toLowerCase();
    self.expectedArrival = json.DestExpectedArrival ? moment(json.DestExpectedArrival, "HH:mm:ss").format("HH:mm") : "Unknown";
    self.actualArrival = json.DestActualArrival ? moment(json.DestActualArrival).format("HH:mm") : "Unknown";
    self.delay = json.DestExpectedArrival && json.DestActualArrival ?
        moment(self.actualArrival, "HH:mm:ss").diff(moment(self.expectedArrival, "HH:mm:ss"), "minutes") : "Unknown";
    self.webLink = json.AtocCode ? (tocs[json.AtocCode.Code] && tocs[json.AtocCode.Code].webLink ? tocs[json.AtocCode.Code].webLink : null) : null;
    self.webLinkText = self.tocName;
    self.uniqueLink = "#getuid:" + json.TrainUid + "#" + moment(json.SchedOriginDeparture).format("YYYY-MM-DD");
    self.cancelled = json.Cancellation != null;
    self.title = json.Cancellation ? "Cancelled " + json.Cancellation.Type +
        (json.Cancellation.CancelledAt ? " at " + json.Cancellation.CancelledAt.Description : "") : "";
}