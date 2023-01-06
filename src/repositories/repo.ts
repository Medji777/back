type IRepo = {
    id: number,
    title: string
}

const repo = [{id: 1, title:'1'},{id: 2, title:'2'}];

export const repoRepository = {
    getRepo(): Array<IRepo>{
        return repo
    },
    createRepo(title: string): IRepo | null{
        if(!title.trim() || !!repo.find((v)=>v.title === title)){
            return null
        }
        const newRepo = {id: repo.length + 1,title};
        repo.unshift(newRepo)
        return newRepo
    }
}