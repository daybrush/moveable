export interface TypeDefInterface {
    kind: "typedef";
    name: string;
    longname: string;
    properties: { [key: string]: PropertyInterface };
}
export interface PropertyInterface {
    name: string;
    types: string[];
    description: string;
    optional: boolean;
}

export interface FunctionInterface {
    kind: "function",
    name: string;
    longname: string;
    description: string;
    params: ParamInterface[];
    returns: ReturnInterface[];
}

export interface ParamInterface {
    name: string;
    description: string;
    types: string[];
}
export interface ReturnInterface {
    description: string;
    types: string[];
}

export interface MemberInterface {
    kind: "member";
    name: string;
    longname: string;
    scope: string;
    description: string;
    types: string[];
}

export interface EventInterface {
    kind: "event";
    name: string;
    longname: string;
    description: string;
    params: ParamInterface[];
}

export interface NamespaceInterface {
    kind: "namespace";
    name: string;
    longname: string;
    description: string;
}
