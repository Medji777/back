import {CreateVideoInputModel, IUpdateVideoInputModel, IVideo} from "../types/types";

const videos = [] as Array<IVideo>

export const videosRepository = {
    getAll(): IVideo[] {
        return videos
    },
    findById(id: number){
        return videos.find((v: IVideo)=>v.id === id)
    },
    createVideo(payload: CreateVideoInputModel): IVideo {
        const date = new Date();
        const newVideo = {
            id: videos.length + 1,
            title: payload.title,
            author: payload.author,
            canBeDownloaded:false,
            minAgeRestriction: null,
            createdAt: date.toISOString(),
            publicationDate: new Date(date.setDate(date.getDate() + 1)).toISOString(),
            availableResolutions: payload.availableResolutions || null
        };
        videos.push(newVideo)
        return newVideo
    },
    updateVideo(id: number,payload: IUpdateVideoInputModel){
        const index = videos.findIndex((v: IVideo)=>v.id === id);
        videos[index] = {...videos[index], ...payload}
    },
    deleteVideo(id: number){
        const index = videos.findIndex((v: IVideo)=>v.id === id);
        videos.splice(index,1)
    },
    deleteAll(){
        videos.splice(0)
    }
}