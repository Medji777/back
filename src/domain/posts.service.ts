import {postsRepository} from "../repositories";
import {BlogName, PostInputModel, PostsViewModel} from "../types/posts";

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
            createdAt: date.toISOString()
        }
        return postsRepository.create(newPost)
    },
    async update(id: string,payload:PostInputModel): Promise<boolean>{
        return postsRepository.update(id,payload);
    },
    async delete(id: string): Promise<boolean>{
        return postsRepository.deleteById(id)
    }
}