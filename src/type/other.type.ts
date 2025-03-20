export type GetIPFunction = (error: string) => string;
export type ErrorFormatFunction = (errorPath: string, errorCode: string, errorMessage: string) => Error;

export interface StringToErrorMap {
    [key: string]: string
}

export interface MapRaw {
    [key: string]: any
}
