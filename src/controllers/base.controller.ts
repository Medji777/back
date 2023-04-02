import {Request, Response} from "express";
import {videosRepository} from "../repositories";
import {Statuses} from "../types/types";
import {bodyFieldValidator} from "../validations";
import {CreateVideoInputModel} from "../types/videos";

class VideoController {
    async getVideos(req: Request,res: Response){
        const videos = await videosRepository.getAll();
        res.status(Statuses.OK).send(videos)
    }
    async getVideoById(req: Request,res: Response){
        const video = await videosRepository.findById(+req.params.id);
        if(!video) {
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.status(Statuses.OK).send(video)
    }
    async createVideo(req: Request,res: Response){
        const {title,author,availableResolutions} = req.body;
        const errors = bodyFieldValidator(req.body);
        if(!!errors){
            return res.status(Statuses.BAD_REQUEST).send(errors)
        }
        const payload: CreateVideoInputModel = {title,author,availableResolutions}
        const video = await videosRepository.createVideo(payload);
        res.status(Statuses.CREATED).send(video)
    }
    async updateVideo(req: Request,res: Response){
        const videoId = +req.params.id;
        const errors = bodyFieldValidator(req.body);
        if(!!errors){
            return res.status(Statuses.BAD_REQUEST).send(errors)
        }
        const isUpdated = await videosRepository.updateVideo(videoId,req.body);
        if(!isUpdated){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
    async deleteVideo(req: Request,res: Response){
        const isDeleted = await videosRepository.deleteVideo(+req.params.id)
        if(!isDeleted){
            return res.sendStatus(Statuses.NOT_FOUND)
        }
        res.sendStatus(Statuses.NO_CONTENT)
    }
}

export const videoController = new VideoController()