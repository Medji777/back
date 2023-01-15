import {Router,Request,Response} from 'express';
import {videosRepository} from "../repositories";
import {bodyFieldValidator} from "../validations";
import {CreateVideoInputModel, Statuses} from "../types/types";
import {sanitizationBody} from "../middlewares";

export const baseRouter = Router({});

const sanitizationBodyBase = sanitizationBody(['title','author','canBeDownloaded','minAgeRestriction','publicationDate','availableResolutions'])

baseRouter.get('/videos',(req: Request,res: Response)=>{
    const videos = videosRepository.getAll();
    res.status(Statuses.OK).send(videos)
})

baseRouter.get('/videos/:id',(req: Request,res: Response)=>{
    const video = videosRepository.findById(+req.params.id);
    if(video) {
        res.status(Statuses.OK).send(video)
    } else {
        res.sendStatus(Statuses.NOT_FOUND)
    }
})

baseRouter.post('/videos',(req: Request,res: Response)=>{
    const {title,author,availableResolutions} = req.body;
    const errors = bodyFieldValidator(req.body);
    if(!!errors){
        return res.status(Statuses.BAD_REQUEST).send(errors)
    }
    const payload: CreateVideoInputModel = {title,author,availableResolutions}
    const video = videosRepository.createVideo(payload);
    res.status(Statuses.CREATED).send(video)
})

baseRouter.put('/videos/:id', sanitizationBodyBase, (req: Request,res: Response)=>{
    const videoId = +req.params.id;

    const errors = bodyFieldValidator(req.body);
    if(!!errors){
        return res.status(Statuses.BAD_REQUEST).send(errors)
    }

    const isUpdated = videosRepository.updateVideo(videoId,req.body);
    if(!isUpdated){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
})

baseRouter.delete('/videos/:id',(req: Request,res: Response)=>{
    const isDeleted = videosRepository.deleteVideo(+req.params.id)
    if(!isDeleted){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    res.sendStatus(Statuses.NO_CONTENT)
})