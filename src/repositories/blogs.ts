import {BlogsViewModel,BlogsInputModel} from '../types/blogs'

const blogs = [] as Array<BlogsViewModel>

export const blogsRepository = {
    getAll(){
        return blogs
    },
    findById(id: string) {
        return blogs.find((v:BlogsViewModel)=>v.id === id)
    },
    create(payload: BlogsInputModel): BlogsViewModel {
        const newBlog = {
            id:	`${++blogs.length}`,
            name: payload.name,
            description: payload.description,
            websiteUrl:	payload.websiteUrl
        }
        blogs.push(newBlog)
        return newBlog
    },
    update(id: string,payload:BlogsInputModel): boolean {
        const index = blogs.findIndex((v: BlogsViewModel)=>v.id === id);
        if(index < 0) return false;
        blogs[index] = {...blogs[index], ...payload}
        return true
    },
    deleteById(id: string): boolean {
        const index = blogs.findIndex((v: BlogsViewModel)=>v.id === id);
        if(index < 0) return false;
        blogs.splice(index,1)
        return true
    },
    deleteAll(){
        blogs.splice(0)
    }
}