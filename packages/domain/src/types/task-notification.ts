import { Timestamp } from "./timestamp";

type TaskNotification= {
    id : number;
    name : string;
    "notify-at" : Timestamp;
    users : string[];
    groups : string[];
    emails : string[];
    active : boolean;
    subject : string;
    content : string;
};

export type { TaskNotification };