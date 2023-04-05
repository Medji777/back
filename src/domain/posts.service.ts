import {BlogName, PostInputModel, PostsDBModel, PostsViewModel} from "../types/posts";
import {LikeCalculateService} from "../application/likeCalculate.service";
import {PostsRepository, PostsLikesRepository} from "../repositories";
import {PostsQueryRepository, PostsLikeQueryRepository} from "../repositories/query";
import {LikeStatus} from "../types/types";
import {LikeInputModel, LikesPostsModelDTO} from "../types/likes";

export class PostsService {
    constructor(
        protected likeCalculateService: LikeCalculateService,
        protected postsRepository: PostsRepository,
        protected postsLikesRepository: PostsLikesRepository,
        protected postsQueryRepository: PostsQueryRepository,
        protected postsLikeQueryRepository: PostsLikeQueryRepository
    ) {}
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
        const post = await this.postsRepository.create(newPost)
        return this._likeCreateTransform(post)
    }
    async update(id: string,payload:PostInputModel): Promise<boolean>{
        return this.postsRepository.update(id,payload);
    }
    async delete(id: string): Promise<boolean>{
        return this.postsRepository.deleteById(id)
    }
    async updateStatusLike(userId: string, login: string, postId: string, newStatus: LikeInputModel ): Promise<boolean> {
        let lastStatus: LikeStatus = LikeStatus.None
        const post = await this.postsQueryRepository.findById(postId)
        if (!post) return false
        const likeInfo = await this.postsLikeQueryRepository.getLike(userId, postId)
        if (!likeInfo) {
            const newLike = new LikesPostsModelDTO(
                userId,postId,login,new Date().toISOString(),newStatus.likeStatus
            )
            await this.postsLikesRepository.create(newLike)
        } else {
            await this.postsLikesRepository.update(userId, postId, newStatus.likeStatus)
            lastStatus = likeInfo.myStatus
        }
        const newLikesInfo = await this.likeCalculateService.getUpdatedLike(
            {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount
            },
            lastStatus,
            newStatus.likeStatus
        )
        return await this.postsRepository.updateLikeInPost(post.id, newLikesInfo)
    }
    private _likeCreateTransform(post: PostsDBModel): PostsViewModel{
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