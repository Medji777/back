import {tokensCollection} from "../db";
import {TokensModel} from "../../types/tokens";

export const tokensQueryRepository = {
    async findById(userId: string): Promise<TokensModel | null>{
        return tokensCollection.findOne({userId},{projection: {_id:0}})
    }
}