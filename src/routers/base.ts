import {Router,Request,Response} from 'express';
import {repoRepository} from "../repositories/repo";
export const baseRouter = Router({});

baseRouter.get('/',(req: Request,res: Response)=>{
    const repoAll = repoRepository.getRepo();
    res.status(200).send(repoAll)
})

baseRouter.post('/',(req: Request,res: Response)=>{
    const repo = repoRepository.createRepo(req.body.title)
    if(repo){
        res.status(200).send(repo)
    } else {
        res.status(400).send({
            errorMessages: [
                {
                    message: 'Repo exiting in repos or not found',
                    field: 'title'
                }
            ],
            resultCode: 1
        })
    }
})