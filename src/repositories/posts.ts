import {PostsViewModel,PostInputModel} from '../types/posts'

const posts = [] as Array<PostsViewModel>;

export const postsRepository = {
    getAll(){
        return posts
    },
    findById(id: string) {
        return posts.find((v:PostsViewModel)=>v.id === id)
    },
    create(payload: PostInputModel): PostsViewModel {
        const id = ++posts.length;
        const newPost = {
            id:	`${id}`,
            title: payload.title,
            shortDescription: payload.shortDescription,
            content: payload.content,
            blogId: payload.blogId,
            blogName: `new blog ${id}`
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
    deleteAll(){
        posts.splice(0)
    }
}