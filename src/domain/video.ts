import {model, Schema} from "mongoose";
import {Resolutions} from "../types/types";
import {IVideo} from "../types/videos";

const videoSchema = new Schema({
    id: Number,
    title: {type: String, required: true},
    author: {type: String, required: true},
    canBeDownloaded: Boolean,
    minAgeRestriction: Number || null,
    createdAt: String,
    publicationDate: String,
    availableResolutions: {type: [{type: String, enum: Object.values(Resolutions)}]} || null
})

export const VideoModelInstance = model<IVideo>('videos', videoSchema);