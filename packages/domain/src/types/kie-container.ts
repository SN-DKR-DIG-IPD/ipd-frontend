import { ConfigItem } from "./config-item";
import { Message } from "./message";
import { ReleaseId } from "./release-id";
import { Scanner } from "./scanner";

type KieContainer = {
    'container-id': string;
    'release-id': ReleaseId;
    'resolved-release-id': ReleaseId;
    status: 'STARTED';
    scanner: Scanner;
    'config-items': ConfigItem[];
    messages: Message[];
    'container-alias': string;
};

export type { KieContainer };