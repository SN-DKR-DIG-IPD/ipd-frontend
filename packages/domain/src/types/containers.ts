import { ContainersResult } from "./containers-result";

type Containers = {
    type: "SUCCESS";
    msg: string;
    result: ContainersResult;
};

export type { Containers };