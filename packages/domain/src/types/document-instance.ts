import { Timestamp } from "./timestamp";

type DocumentInstanceType = {
	"document-id": string;
	"document-name": string;
	"document-link": string;
	"document-size": number;
	"document-last-mod": Timestamp;
	"document-content": string;
};

export type { DocumentInstanceType };
