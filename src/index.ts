import express,{Request,Response} from 'express';
import {config} from 'dotenv';
import {usersRouter, baseRouter, blogsRouter, postsRouter, resetRouter, authRouter} from "./routers";
import {runDb} from "./repositories/db";

config()

export const app = express();
const port = process.env.PORT || 3000;

const parseMiddleware = express.json()
app.use(parseMiddleware)

app.get('/',(req:Request,res:Response)=>{
    res.send('This is Work!')
})

app.use('/auth',authRouter)
app.use('/users',usersRouter)
app.use('/videos',baseRouter)
app.use('/blogs',blogsRouter)
app.use('/posts',postsRouter)
app.use('/testing',resetRouter)

const bootstrap = async () => {
    await runDb()
    app.listen(port,()=>{
        console.log("Listen " + port)
    })
}

bootstrap()