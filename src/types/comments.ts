import {LikesInfoViewModel, LikeInfoModel} from "./likes";

export type CommentInputModel = {
    content: string
}

export type CommentatorInfo = {
    userId: string,
    userLogin: string
}

export type CommentViewModel = {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string,
    likesInfo: LikesInfoViewModel
}

export type CommentDBModel = {
    id: string,
    content: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string,
    likesInfo: LikeInfoModel
}

export type PostId = {
    postId: string
}

export type CommentModel = CommentDBModel & PostId