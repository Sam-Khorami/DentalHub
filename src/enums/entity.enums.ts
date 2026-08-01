export enum SlotsStatusEnum { 
    Available = "available",
    Reserved = "reserved",
    Booked = "booked", 
    Cancelled = "cancelled", 
    Completed = "completed"
}

export enum UserRole { 
    User = "user", 
    SuperAdmin = "superAdmin", 
    Admin = "admin", 
    Clerk = "clerk", 
    OrthodonticTherapist = "orthodonticTherapist", 
    DentalHygienist = "dentalHygienist", 
    DentalNurse = "dentalNurse", 
    DentalTechnician = "dentalTechnician", 
    DentalTherapist = "dentalTherapist", 
    Dentist = "dentist"
};

export enum RequestStatus { 
    Accepted = "accepted", 
    Rejected = "rejected", 
    Pending = "pending" 
}

export enum RequestEnum { 
    BeingDoctor = "beingDoctor",
    BeingClerk = "beingClerk",
    BeingOrthodonticTherapist = "beingOrthodonticTherapist",
    BeingDentalHygienist = "beingDentalHygienist",
    BeingDentalNurse = "beingDentalNurse",
    BeingDentalTechnician = "beingDentalTechnician",
    BeingDentalTherapist = "beingDentalTherapist",
    BeingDentist = "beingDentist"
}

export enum DayOfWeekEnum { 
    Saturday = "saturday", 
    Sunday = "sunday", 
    Monday = "monday", 
    Tuesday = "tuesday", 
    Wednesday = "wednesday", 
    Thursday = "thursday", 
    Friday = "friday" 
}

export enum ServiceTypeEnum { 
    Filling = "filling", 
    RootCanal = "rootCanal", 
    Extraction = "extraction", 
    Scaling = "scaling", 
    Crowns = "crowns", 
    WireReplacement = "wireReplacement", 
    RetainerFitting = "retainerFitting", 
    OrthodonticImpression = "orthodonticImpression" 
}

export enum OrderStatusEnum { 
    Pending = "pending", 
    Payed = "payed", 
    Canceled = "canceled"
}

export enum CurrencyEnum { 
    IRT = "irt", 
    IRR = "irr" 
} 

export enum WalletStatus {
    Active = "active",
    Closed = "closed",
    Blocked = "blocked"
}