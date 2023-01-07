export type APIErrorResult = {
    errorsMessages: Array<FieldError>
}

export type FieldError = {
    message: string | null,
    field: string | null
}

export type CreateVideoInputModel = {
    title: string,
    author: string,
    availableResolutions?: Array<string> | null
}

export enum Resolutions {
    P144="P144",
    P240="P240",
    P360="P360",
    P480="P480",
    P720="P720",
    P1080="P1080",
    P1440="P1440",
    P2160="P2160"
}

export interface IVideo {
    id?: number,
    title: string,
    author: string,
    canBeDownloaded?: boolean,
    minAgeRestriction?: number | null,
    createdAt?: string,
    publicationDate?: string,
    availableResolutions?: Array<string> | null
}

export interface IUpdateVideoInputModel {
    title: string,
    author: string,
    canBeDownloaded?: boolean,
    minAgeRestriction?: number | null,
    publicationDate?: string,
    availableResolutions?: Array<string> | null
}