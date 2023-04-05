import {BlogsInputModel, BlogsViewModel, BlogsViewModelDTO} from "../types/blogs";
import {BlogsRepository} from "../repositories";

export class BlogsService {
    constructor(protected blogsRepository: BlogsRepository) {}
    async create(payload: BlogsInputModel): Promise<BlogsViewModel>{
        const date = new Date();
        const newBlog = new BlogsViewModelDTO(
            `${+date}`,
            payload.name,
            payload.description,
            payload.websiteUrl,
            date.toISOString(),
            false
        )
        const createdBlog = await this.blogsRepository.create(newBlog);
        await this.blogsRepository.save(createdBlog)
        return newBlog
    }
    async update(id: string, payload: BlogsInputModel): Promise<boolean> {
        const blog = await this.blogsRepository.findBlogById(id)
        if(!blog) return false
        blog.update(payload)
        await this.blogsRepository.save(blog)
        return true;
    }
    async delete(id: string): Promise<boolean>{
        return this.blogsRepository.deleteById(id)
    }
}