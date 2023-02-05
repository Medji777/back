import {Router} from 'express';
import {sanitizationBody} from "../middlewares";
import {createVideo, deleteVideo, getVideoById, getVideos, updateVideo} from "../controllers/base.controller";

export const baseRouter = Router({});

const sanitizationBodyBase = sanitizationBody(['title','author','canBeDownloaded','minAgeRestriction','publicationDate','availableResolutions'])

baseRouter.get('/',getVideos)
baseRouter.get('/:id',getVideoById)
baseRouter.post('/',createVideo)
baseRouter.put('/:id',sanitizationBodyBase,updateVideo)
baseRouter.delete('/:id',deleteVideo)