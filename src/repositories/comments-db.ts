import {CommentViewModel, CommentModel, CommentInputModel} from "../types/comments";
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
    async update(id: string, payload: CommentInputModel): Promise<boolean>{
        const result = await commentsCollection.updateOne({id},{$set: {...payload}});
        return result.matchedCount === 1
    },
    async delete(id: string): Promise<boolean>{
        const result = await commentsCollection.deleteOne({id})
        return result.deletedCount === 1
    },
    async deleteAll(): Promise<void>{
        await commentsCollection.deleteMany({})
    }
}