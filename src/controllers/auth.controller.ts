import {Response} from "express";
import {usersService} from "../domain/users.service";
import {RequestWithBody, Statuses} from "../types/types";
import {LoginInputModel} from "../types/auth";

export const login = async (req:RequestWithBody<LoginInputModel>,res:Response) => {
    const check = await usersService.checkCredentials(req.body.loginOrEmail,req.body.password);
    if(!check){
        return res.sendStatus(Statuses.UN_AUTHORIZED)
    }
    res.sendStatus(Statuses.NO_CONTENT)
}