"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServiceTypeEnum = exports.DayOfWeekEnum = exports.RequestEnum = exports.RequestStatus = exports.UserRole = exports.SlotsStatusEnum = void 0;
var SlotsStatusEnum;
(function (SlotsStatusEnum) {
    SlotsStatusEnum["Available"] = "available";
    SlotsStatusEnum["Reserved"] = "reserved";
    SlotsStatusEnum["Booked"] = "booked";
    SlotsStatusEnum["Cancelled"] = "cancelled";
    SlotsStatusEnum["Completed"] = "completed";
})(SlotsStatusEnum || (exports.SlotsStatusEnum = SlotsStatusEnum = {}));
var UserRole;
(function (UserRole) {
    UserRole["User"] = "user";
    UserRole["SuperAdmin"] = "superAdmin";
    UserRole["Admin"] = "admin";
    UserRole["Clerk"] = "clerk";
    UserRole["OrthodonticTherapist"] = "orthodonticTherapist";
    UserRole["DentalHygienist"] = "dentalHygienist";
    UserRole["DentalNurse"] = "dentalNurse";
    UserRole["DentalTechnician"] = "dentalTechnician";
    UserRole["DentalTherapist"] = "dentalTherapist";
    UserRole["Dentist"] = "dentist";
})(UserRole || (exports.UserRole = UserRole = {}));
;
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["Accepted"] = "accepted";
    RequestStatus["Rejected"] = "rejected";
    RequestStatus["Pending"] = "pending";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var RequestEnum;
(function (RequestEnum) {
    RequestEnum["BeingDoctor"] = "beingDoctor";
    RequestEnum["BeingClerk"] = "beingClerk";
    RequestEnum["BeingOrthodonticTherapist"] = "beingOrthodonticTherapist";
    RequestEnum["BeingDentalHygienist"] = "beingDentalHygienist";
    RequestEnum["BeingDentalNurse"] = "beingDentalNurse";
    RequestEnum["BeingDentalTechnician"] = "beingDentalTechnician";
    RequestEnum["BeingDentalTherapist"] = "beingDentalTherapist";
    RequestEnum["BeingDentist"] = "beingDentist";
})(RequestEnum || (exports.RequestEnum = RequestEnum = {}));
var DayOfWeekEnum;
(function (DayOfWeekEnum) {
    DayOfWeekEnum["Saturday"] = "saturday";
    DayOfWeekEnum["Sunday"] = "sunday";
    DayOfWeekEnum["Monday"] = "monday";
    DayOfWeekEnum["Tuesday"] = "tuesday";
    DayOfWeekEnum["Wednesday"] = "wednesday";
    DayOfWeekEnum["Thursday"] = "thursday";
    DayOfWeekEnum["Friday"] = "friday";
})(DayOfWeekEnum || (exports.DayOfWeekEnum = DayOfWeekEnum = {}));
var ServiceTypeEnum;
(function (ServiceTypeEnum) {
    ServiceTypeEnum["Filling"] = "filling";
    ServiceTypeEnum["RootCanal"] = "rootCanal";
    ServiceTypeEnum["Extraction"] = "extraction";
    ServiceTypeEnum["Scaling"] = "scaling";
    ServiceTypeEnum["Crowns"] = "crowns";
    ServiceTypeEnum["WireReplacement"] = "wireReplacement";
    ServiceTypeEnum["RetainerFitting"] = "retainerFitting";
    ServiceTypeEnum["OrthodonticImpression"] = "orthodonticImpression";
})(ServiceTypeEnum || (exports.ServiceTypeEnum = ServiceTypeEnum = {}));
