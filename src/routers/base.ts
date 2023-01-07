import {Router,Request,Response} from 'express';
import {videosRepository} from "../repositories/repo";
import {bodyFieldValidator} from "../validations";
import {CreateVideoInputModel, IVideo} from "../types/types";

export const baseRouter = Router({});

baseRouter.get('/videos',(req: Request,res: Response)=>{
    const videos = videosRepository.getAll();
    res.status(200).send(videos)
})

baseRouter.get('/videos/:id',(req: Request,res: Response)=>{
    const video = videosRepository.findById(+req.params.id);
    if(video) {
        res.status(200).send(video)
    } else {
        res.sendStatus(404)
    }
})

baseRouter.post('/videos',(req: Request,res: Response)=>{

    const {title,author,availableResolutions} = req.body;

    const errors = bodyFieldValidator(req.body);

    if(!!errors){
        return res.status(400).send(errors)
    }

    const payload: CreateVideoInputModel = {title,author,availableResolutions}

    const video = videosRepository.createVideo(payload);
    res.status(201).send(video)
})

baseRouter.put('/videos/:id',(req: Request,res: Response)=>{

    const videoId = +req.params.id;
    const video = videosRepository.findById(videoId);
    if(!video) {
        return res.sendStatus(404)
    }

    const errors = bodyFieldValidator(req.body);

    if(!!errors){
        return res.status(400).send(errors)
    }

    //TODO: add pick object body transformer

    videosRepository.updateVideo(videoId,req.body)
    res.sendStatus(204)
})

baseRouter.delete('/videos/:id',(req: Request,res: Response)=>{

    const videoId = +req.params.id;
    const videos = videosRepository.getAll();
    if(!videos.find((v:IVideo)=>v?.id === videoId)){
        return res.sendStatus(404)
    }

    videosRepository.deleteVideo(videoId)
    res.sendStatus(204)
})