import {LikeInfoModel} from "../types/likes";
import {LikeStatus} from "../types/types";

class LikeCalculateService {
    async getUpdatedLike(likesInfo: LikeInfoModel, lastStatus: LikeStatus, newStatus: LikeStatus): Promise<LikeInfoModel> {
        if (newStatus === LikeStatus.None && lastStatus === LikeStatus.Like) {
            return { ...likesInfo, likesCount: --likesInfo.likesCount }
        }
        if (newStatus === LikeStatus.None && lastStatus === LikeStatus.Dislike) {
            return { ...likesInfo, dislikesCount: --likesInfo.dislikesCount }
        }
        if (newStatus === LikeStatus.Like && lastStatus === LikeStatus.None) {
            return { ...likesInfo, likesCount: ++likesInfo.likesCount }
        }
        if (newStatus === LikeStatus.Like && lastStatus === LikeStatus.Dislike) {
            return {
                ...likesInfo,
                likesCount: ++likesInfo.likesCount,
                dislikesCount: --likesInfo.dislikesCount
            }
        }
        if (newStatus === LikeStatus.Dislike && lastStatus === LikeStatus.None) {
            return { ...likesInfo, dislikesCount: ++likesInfo.dislikesCount }
        }
        if (newStatus === LikeStatus.Dislike && lastStatus === LikeStatus.Like) {
            return {
                ...likesInfo,
                likesCount: --likesInfo.likesCount,
                dislikesCount: ++likesInfo.dislikesCount
            }
        }
        return likesInfo
    }
}

export const likeCalculateService = new LikeCalculateService()