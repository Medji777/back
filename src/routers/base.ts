import {Router} from 'express';
import {sanitizationBody} from "../middlewares";
import {videoController} from "../controllers";

export const baseRouter = Router({});

const sanitizationBodyBase = sanitizationBody(['title','author','canBeDownloaded','minAgeRestriction','publicationDate','availableResolutions'])

baseRouter.get('/',videoController.getVideos)
baseRouter.get('/:id',videoController.getVideoById)
baseRouter.post('/',videoController.createVideo)
baseRouter.put('/:id',sanitizationBodyBase,videoController.updateVideo)
baseRouter.delete('/:id',videoController.deleteVideo)