import { ContainerResult } from "./container-result";

type Container = {
    type: "SUCCESS";
    msg: string;
    result: ContainerResult;
};

export type { Container as ContainerType };