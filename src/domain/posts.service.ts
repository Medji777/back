import {postsRepository} from "../repositories";
import {BlogName, PostInputModel, PostsDBModel, PostsViewModel} from "../types/posts";
import {postsQueryRepository} from "../repositories/query";
import {postsLikesRepository} from "../repositories/postsLikes-db";
import {LikeStatus} from "../types/types";
import {postsLikeQueryRepository} from "../repositories/query/postsLikeQuery";
import {likeCalculateService} from "../application/likeCalculate.service";

export const postsService = {
    async create(payload:PostInputModel & BlogName): Promise<PostsViewModel>{
        const date = new Date();
        const newPost = {
            id:	`${+date}`,
            title: payload.title,
            shortDescription: payload.shortDescription,
            content: payload.content,
            blogId: payload.blogId,
            blogName: payload.blogName,
            createdAt: date.toISOString(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0
            }
        }
        const post = await postsRepository.create(newPost)
        return this._likeCreateTransform(post)
    },
    async update(id: string,payload:PostInputModel): Promise<boolean>{
        return postsRepository.update(id,payload);
    },
    async delete(id: string): Promise<boolean>{
        return postsRepository.deleteById(id)
    },
    async updateStatusLike(userId: string, login: string, postId: string, newStatus: LikeStatus): Promise<boolean> {
        let lastStatus: LikeStatus = LikeStatus.None
        const post = await postsQueryRepository.findById(postId)
        if (!post) return false
        const likeInfo = await postsLikeQueryRepository.getLike(userId, postId)
        if (!likeInfo) {
            const newLike = {
                userId,
                postId,
                myStatus: newStatus,
                login,
                addedAt: new Date().toISOString()
            }
            await postsLikesRepository.create(newLike)
        } else {
            await postsLikesRepository.update(userId, postId, newStatus)
            lastStatus = likeInfo.myStatus
        }
        const newLikesInfo = await likeCalculateService.getUpdatedLike(
            {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount
            },
            lastStatus,
            newStatus
        )
        return await postsRepository.updateLikeInPost(post.id, newLikesInfo)
    },
    _likeCreateTransform(post: PostsDBModel): PostsViewModel{
        return {
            ...post,
            extendedLikesInfo: {
                ...post.extendedLikesInfo,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        }
    }
}