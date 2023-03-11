import express,{Request,Response} from 'express';
import cookieParser from 'cookie-parser';
import {securityRouter, usersRouter, baseRouter, blogsRouter, postsRouter, resetRouter, authRouter, commentsRouter} from "./routers";
import {runDb} from "./repositories/db";
import {settings} from "./settings";

export const app = express();
const port = settings.PORT;

const parseMiddleware = express.json()
app.set('trust proxy', true)
app.use(cookieParser())
app.use(parseMiddleware)

app.get('/',(req:Request,res:Response)=>{
    res.send('This is Work!')
})

app.use('/auth',authRouter)
app.use('/security',securityRouter)
app.use('/users',usersRouter)
app.use('/videos',baseRouter)
app.use('/blogs',blogsRouter)
app.use('/posts',postsRouter)
app.use('/comments',commentsRouter)
app.use('/testing',resetRouter)

const bootstrap = async () => {
    await runDb()
    app.listen(port,()=>{
        console.log("Listen " + port)
    })
}

bootstrap()