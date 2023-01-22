import {PostsViewModel, PostInputModel, BlogName} from '../types/posts'

const posts = [] as Array<PostsViewModel>;

export const postsRepository = {
    getAll(): Array<PostsViewModel>{
        return posts
    },
    findById(id: string): PostsViewModel | undefined {
        return posts.find((v:PostsViewModel)=>v.id === id)
    },
    create(payload: PostInputModel & BlogName): PostsViewModel {
        const id = posts.length + 1;
        const newPost = {
            id:	`${id}`,
            title: payload.title,
            shortDescription: payload.shortDescription,
            content: payload.content,
            blogId: payload.blogId,
            blogName: payload.blogName
        }
        posts.push(newPost)
        return newPost
    },
    update(id: string,payload:PostInputModel): boolean {
        const index = posts.findIndex((v: PostsViewModel)=>v.id === id);
        if(index < 0) return false;
        posts[index] = {...posts[index], ...payload}
        return true
    },
    deleteById(id: string): boolean {
        const index = posts.findIndex((v: PostsViewModel)=>v.id === id);
        if(index < 0) return false;
        posts.splice(index,1)
        return true
    },
    deleteAll(): void {
        posts.splice(0)
    }
}