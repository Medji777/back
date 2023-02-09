export type CommentInputModel = {
    content: string
}

export type CommentatorInfo = {
    userId: string,
    userLogin: string
}

export type CommentViewModel = {
    id?: string,
    content: string,
    commentatorInfo: CommentatorInfo,
    createdAt: string
}

export type PostId = {
    postId: string
}

export type CommentModel = CommentViewModel & PostId