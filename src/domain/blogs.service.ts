import {BlogsInputModel, BlogsViewModel} from "../types/blogs";
import {blogsRepository} from "../repositories";

export const blogsService = {
    async create(payload: BlogsInputModel): Promise<BlogsViewModel>{
        const date = new Date();
        const newBlog = {
            id:	`${+date}`,
            name: payload.name,
            description: payload.description,
            websiteUrl:	payload.websiteUrl,
            createdAt: date.toISOString(),
            isMembership: false
        }
        return blogsRepository.create(newBlog)
    },
    async update(id: string, payload: BlogsInputModel): Promise<boolean> {
        return blogsRepository.update(id,payload);
    },
    async delete(id: string): Promise<boolean>{
        return blogsRepository.deleteById(id)
    }
}