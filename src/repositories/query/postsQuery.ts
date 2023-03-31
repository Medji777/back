import {HydratedDocument} from "mongoose";
import {PostsModel} from "../db";
import {postsLikeQueryRepository} from "./postsLikeQuery";
import {getSortNumber} from "../../utils/sort";
import {transformPagination} from "../../utils/transform";
import {LikeStatus, Paginator, SortDirections} from "../../types/types";
import {PostsDBModel, PostsViewModel} from "../../types/posts";

export type QueryPosts = {
    sortBy: string,
    sortDirection: SortDirections,
    pageNumber: number,
    pageSize: number
}

export const postsQueryRepository = {
    async getAll(query: QueryPosts, userId?: string): Promise<Paginator<PostsViewModel>> {
        const {sortBy,sortDirection,pageNumber,pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        const skipNumber = (pageNumber - 1) * pageSize;
        const count = await PostsModel.countDocuments();
        const doc = await PostsModel
            .find({},{_id:0,__v:0})
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)

        const mappedPost = doc.map(this._getOutputPost)
        const mappedPostWithStatusLike = await this._setStatusLikeMapped(mappedPost, userId)
        const mappedFinishPost = await this._setThreeLastUserMapped(mappedPostWithStatusLike)

        return transformPagination<PostsViewModel>(mappedFinishPost,pageSize,pageNumber,count)
    },
    async findById(id: string, userId?: string): Promise<PostsViewModel | null> {
        const doc = await PostsModel.findOne({id},{_id:0,__v:0})
        if(!doc) return null;
        const mappedResult = this._getOutputPost(doc)
        if (userId && mappedResult) {
            await this._setLike(userId, mappedResult)
        }
        if (mappedResult) {
            await this._setLastLike(mappedResult)
        }
        return mappedResult
    },
    async getPostsByBlogId(id: string, query: QueryPosts, userId?: string): Promise<Paginator<PostsViewModel>>{
        const filter = {blogId: id};
        const {sortBy,sortDirection,pageNumber,pageSize} = query;
        const sortNumber = getSortNumber(sortDirection);
        const skipNumber = (pageNumber - 1) * pageSize;
        const count = await PostsModel.countDocuments(filter);
        const doc = await PostsModel
            .find(filter,{_id:0, __v:0})
            .sort({[sortBy]: sortNumber})
            .skip(skipNumber)
            .limit(pageSize)

        const mappedPost = doc.map(this._getOutputPost)
        const mappedPostWithStatusLike = await this._setStatusLikeMapped(mappedPost, userId!)
        const mappedFinishPost = await this._setThreeLastUserMapped(mappedPostWithStatusLike)

        return transformPagination<PostsViewModel>(mappedFinishPost,pageSize,pageNumber,count)
    },
    _getOutputPost(post: HydratedDocument<PostsDBModel>): PostsViewModel {
        return {
            id: post.id,
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId,
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: post.extendedLikesInfo.likesCount,
                dislikesCount: post.extendedLikesInfo.dislikesCount,
                myStatus: LikeStatus.None,
                newestLikes: []
            }
        }
    },
    async _setStatusLikeMapped(posts: Array<PostsViewModel>, userId?: string) {
        if (!userId) return posts
        await Promise.all(posts.map(async (post: PostsViewModel)=>{
            await this._setLike(userId, post)
        }))
        return posts
    },
    async _setThreeLastUserMapped(posts: Array<PostsViewModel>) {
        await Promise.all(posts.map(async (post: PostsViewModel)=>{
            await this._setLastLike(post)
        }))
        return posts
    },
    async _setLike(userId: string, model: PostsViewModel): Promise<void>{
        const like = await postsLikeQueryRepository.getLike(userId, model.id)
        if (like) {
            model.extendedLikesInfo.myStatus = like.myStatus
        }
    },
    async _setLastLike(model: PostsViewModel): Promise<void>{
        const lastThreeLikes = await postsLikeQueryRepository.getLastThreeLikes(model.id)
        if (lastThreeLikes) {
            model.extendedLikesInfo.newestLikes = lastThreeLikes
        }
    }
}