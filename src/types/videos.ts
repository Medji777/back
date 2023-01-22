import {Resolutions} from "./types";

export interface IVideo {
    id?: number,
    title: string,
    author: string,
    canBeDownloaded?: boolean,
    minAgeRestriction?: number | null,
    createdAt?: string,
    publicationDate?: string,
    availableResolutions?: Array<Resolutions> | null
}

export interface IUpdateVideoInputModel {
    title: string,
    author: string,
    canBeDownloaded?: boolean,
    minAgeRestriction?: number | null,
    publicationDate?: string,
    availableResolutions?: Array<Resolutions> | null
}

export type CreateVideoInputModel = {
    title: string,
    author: string,
    availableResolutions?: Array<Resolutions> | null
}