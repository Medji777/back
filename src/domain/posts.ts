import {model, Model, Schema} from "mongoose";
import {PostInputModel, PostsDBModel} from "../types/posts";

export type PostsMethodsModel = {
    update(payload: PostInputModel): void
}

export type PostsModelType = Model<PostsDBModel,{},PostsMethodsModel>

const postsSchema = new Schema<PostsDBModel,PostsModelType,PostsMethodsModel>({
    id: {type: String, required: true},
    title: {type: String, required: true},
    shortDescription: {type: String, required: true},
    content: {type: String, required: true},
    blogId: {type: String, required: true},
    blogName: {type: String, required: true},
    createdAt: String,
    extendedLikesInfo: {
        likesCount: {type: Number, required: true},
        dislikesCount: {type: Number, required: true},
    }
})

postsSchema.methods.update = function(payload: PostInputModel) {
    this.title = payload.title
    this.shortDescription = payload.shortDescription
    this.content = payload.content
    this.blogId = payload.blogId
}

export const PostsModelInstance = model<PostsDBModel,PostsModelType>('posts', postsSchema);