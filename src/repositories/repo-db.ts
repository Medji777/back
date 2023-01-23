import {CreateVideoInputModel, IUpdateVideoInputModel, IVideo} from "../types/videos";
import {videosCollection} from "./db";

export const videosRepository = {
    async getAll(): Promise<IVideo[]> {
        return videosCollection.find({},{projection: {_id:0}}).toArray()
    },
    async findById(id: number): Promise<IVideo | null>{
        return videosCollection.findOne({id},{projection: {_id:0}})
    },
    async createVideo(payload: CreateVideoInputModel): Promise<IVideo> {
        const date = new Date();
        const newVideo = {
            id: +date,
            title: payload.title,
            author: payload.author,
            canBeDownloaded:false,
            minAgeRestriction: null,
            createdAt: date.toISOString(),
            publicationDate: new Date(date.setDate(date.getDate() + 1)).toISOString(),
            availableResolutions: payload.availableResolutions || null
        };
        await videosCollection.insertOne(newVideo)
        return newVideo
    },
    async updateVideo(id: number,payload: IUpdateVideoInputModel): Promise<boolean>{
        const result = await videosCollection.updateOne({id},{$set:{...payload}});
        return result.matchedCount === 1
    },
    async deleteVideo(id: number): Promise<boolean>{
        const result = await videosCollection.deleteOne({id});
        return result.deletedCount === 1
    },
    async deleteAll(): Promise<void>{
        await videosCollection.deleteMany({})
    }
}