import {baseRouter} from "./base";
import {blogsRouter} from "./blogs";
import {postsRouter} from "./posts";
import {resetRouter} from "./reset";
import {usersRouter} from "./users";
import {authRouter} from "./auth";
import {commentsRouter} from "./comments";
import {securityRouter} from "./security";

export {
    authRouter,
    securityRouter,
    usersRouter,
    baseRouter,
    blogsRouter,
    postsRouter,
    commentsRouter,
    resetRouter
}