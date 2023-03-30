import {LikeStatus} from "./types";

export type LikeInputModel = {
    likeStatus: LikeStatus
}

export type MyStatus = {
    myStatus: LikeStatus
}

export type LikeInfoModel = {
    likesCount: number,
    dislikesCount: number,
}

export type LikesInfoModel = {
    likesInfo: LikeInfoModel
}

export type LikesInfoViewModel = LikeInfoModel & MyStatus

export type LikesCommentModel = {
    userId: string,
    commentId: string,
} & MyStatus

export type LikesPostsModel = {
    userId: string,
    postId: string,
    login: string,
    addedAt: string
} & MyStatus