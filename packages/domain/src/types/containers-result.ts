import { KieContainer } from "./kie-container";

type ContainersResult = {
    'kie-containers' : {
        'kie-container': KieContainer[]
    }
};

export type { ContainersResult };