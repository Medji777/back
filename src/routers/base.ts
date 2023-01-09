import {Router,Request,Response} from 'express';
import {videosRepository} from "../repositories/repo";
import {bodyFieldValidator} from "../validations";
import {pick} from "../utils";
import {CreateVideoInputModel, IVideo, Statuses} from "../types/types";

export const baseRouter = Router({});

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

baseRouter.put('/videos/:id',(req: Request,res: Response)=>{
    const videoId = +req.params.id;
    const video = videosRepository.findById(videoId);
    if(!video) {
        return res.sendStatus(Statuses.NOT_FOUND)
    }

    const resultBody = pick(
        req.body,
        ['title','author','canBeDownloaded','minAgeRestriction','publicationDate','availableResolutions']
    )

    const errors = bodyFieldValidator(resultBody);
    if(!!errors){
        return res.status(Statuses.BAD_REQUEST).send(errors)
    }

    videosRepository.updateVideo(videoId,resultBody)
    res.sendStatus(Statuses.NO_CONTENT)
})

baseRouter.delete('/videos/:id',(req: Request,res: Response)=>{
    const videoId = +req.params.id;
    const videos = videosRepository.getAll();
    if(!videos.find((v:IVideo)=>v?.id === videoId)){
        return res.sendStatus(Statuses.NOT_FOUND)
    }
    videosRepository.deleteVideo(videoId)
    res.sendStatus(Statuses.NO_CONTENT)
})