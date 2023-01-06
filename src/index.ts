import express,{Request,Response} from 'express';
import {baseRouter} from "./routers/base";

const app = express();
const port = process.env.PORT || 3000;

const parseMiddleware = express.json()
app.use(parseMiddleware)

app.get('/',(req:Request,res:Response)=>{
    let str = '1235';
    res.send(str)
})

app.use('/repo',baseRouter)

app.listen(port,()=>{
    console.log("Listen " + port)
})