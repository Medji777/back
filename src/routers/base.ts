import {Router} from 'express';
import {sanitizationBody} from "../middlewares";
import {createVideo, deleteVideo, getVideoById, getVideos, updateVideo} from "../controllers/base.controller";

export const baseRouter = Router({});

const sanitizationBodyBase = sanitizationBody(['title','author','canBeDownloaded','minAgeRestriction','publicationDate','availableResolutions'])

baseRouter.get('/videos',getVideos)
baseRouter.get('/videos/:id',getVideoById)
baseRouter.post('/videos',createVideo)
baseRouter.put('/videos/:id',sanitizationBodyBase,updateVideo)
baseRouter.delete('/videos/:id',deleteVideo)