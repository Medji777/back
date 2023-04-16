import {connect, disconnect} from "mongoose";
import {settings} from "../settings";

export async function runDb () {
    try {
        await connect(settings.mongoURI)
        console.log("Connected to DB Ok!")
    }
    catch (e) {
        console.log("Connected to DB failed!")
        await disconnect()
    }
}
