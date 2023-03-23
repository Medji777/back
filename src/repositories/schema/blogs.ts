import {Schema} from "mongoose";

const blogsSchema = new Schema({
    id:	{type: String, required: true},
    name: {type: String, required: true},
    description: {type: String, required: true},
    websiteUrl:	{type: String, required: true},
    createdAt: String,
    isMembership: Boolean
})

export default blogsSchema