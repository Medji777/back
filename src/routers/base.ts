import {Router} from 'express';
import {sanitizationBody} from "../middlewares";
import {videoController} from "../controllers";

export const baseRouter = Router({});

const sanitizationBodyBase = sanitizationBody(['title','author','canBeDownloaded','minAgeRestriction','publicationDate','availableResolutions'])

baseRouter.get('/',videoController.getVideos.bind(videoController))
baseRouter.get('/:id',videoController.getVideoById.bind(videoController))
baseRouter.post('/',videoController.createVideo.bind(videoController))
baseRouter.put('/:id',sanitizationBodyBase,videoController.updateVideo.bind(videoController))
baseRouter.delete('/:id',videoController.deleteVideo.bind(videoController))