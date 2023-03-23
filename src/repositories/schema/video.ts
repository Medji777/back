import {Schema} from "mongoose";
import {Resolutions} from "../../types/types";

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

export default videoSchema;