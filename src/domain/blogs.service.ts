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
        const createdBlog = await blogsRepository.createV2(newBlog);
        await blogsRepository.save(createdBlog)
        return newBlog
    },
    async update(id: string, payload: BlogsInputModel): Promise<boolean> {
        const blog = await blogsRepository.findBlogById(id)
        if(!blog) return false
        blog.update(payload)
        await blogsRepository.save(blog)
        return true;
    },
    async delete(id: string): Promise<boolean>{
        return blogsRepository.deleteById(id)
    }
}