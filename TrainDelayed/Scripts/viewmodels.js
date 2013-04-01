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
    self.expectedArrival = "00:00";
    self.actualArrival = "00:00";
    self.delay = 0;
    self.webLink = "http://www.londonmidland.com";
}