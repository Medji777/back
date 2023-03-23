export type BlogsViewModel = {
    id:	string
    name: string
    description: string
    websiteUrl:	string
    createdAt?: string
    isMembership?: boolean
}

export type BlogsInputModel = {
    name: string
    description: string
    websiteUrl: string
}