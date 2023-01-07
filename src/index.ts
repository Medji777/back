import express,{Request,Response} from 'express';
import {baseRouter,resetRouter} from "./routers";

const app = express();
const port = process.env.PORT || 3000;

const parseMiddleware = express.json()
app.use(parseMiddleware)

app.get('/',(req:Request,res:Response)=>{
    const str = 'This is Work!';
    res.send(str)
})

app.use('/hometask_01/api',baseRouter)
app.use('/ht_01/api',resetRouter)

app.listen(port,()=>{
    console.log("Listen " + port)
})