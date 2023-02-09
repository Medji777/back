import {CommentViewModel,CommentModel} from "../types/comments";
import {commentsCollection} from "./db";

export const commentsRepository = {
    async create(payload: CommentModel): Promise<CommentViewModel>{
        await commentsCollection.insertOne({...payload})
        return {
            id: payload.id,
            content: payload.content,
            commentatorInfo: payload.commentatorInfo,
            createdAt: payload.createdAt
        }
    },
    update(){

    },
    delete(){

    },
    deleteAll(){

    }
}