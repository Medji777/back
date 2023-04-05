import {injectable} from "inversify";
import {VideoModel} from "./db";
import {CreateVideoInputModel, IUpdateVideoInputModel, IVideo} from "../types/videos";

@injectable()
export class VideosRepository {
    async getAll(): Promise<IVideo[]> {
        return VideoModel.find({},{_id:0,__v:0}).lean()
    }
    async findById(id: number): Promise<IVideo | null>{
        return VideoModel.findOne({id},{_id:0,__v:0}).lean()
    }
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
        await VideoModel.create(newVideo)
        return newVideo
    }
    async updateVideo(id: number,payload: IUpdateVideoInputModel): Promise<boolean>{
        const result = await VideoModel.updateOne({id},{$set:{...payload}});
        return result.matchedCount === 1
    }
    async deleteVideo(id: number): Promise<boolean>{
        const result = await VideoModel.deleteOne({id});
        return result.deletedCount === 1
    }
    async deleteAll(): Promise<void>{
        await VideoModel.deleteMany({})
    }
}

export const videosRepository = new VideosRepository()