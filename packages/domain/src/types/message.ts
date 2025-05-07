import { Timestamp } from "./timestamp";

type Message = {
    severity: "INFO" | "WARNING" | "ERROR";
    timestamp: Timestamp;
    content: string[];
};

export type { Message };