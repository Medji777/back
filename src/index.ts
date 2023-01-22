import express,{Request,Response} from 'express';
import {config} from 'dotenv';
import {baseRouter,blogsRouter,postsRouter,resetRouter} from "./routers";
import {runDb} from "./repositories/db";

config()

export const app = express();
const port = process.env.PORT || 3000;

const parseMiddleware = express.json()
app.use(parseMiddleware)

app.get('/',(req:Request,res:Response)=>{
    const str = 'This is Work!';
    res.send(str)
})

app.use('/',baseRouter)
app.use('/',blogsRouter)
app.use('/',postsRouter)
app.use('/',resetRouter)

const bootstrap = async () => {
    await runDb()
    app.listen(port,()=>{
        console.log("Listen " + port)
    })
}

bootstrap()