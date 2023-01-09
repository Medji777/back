import request from 'supertest';
import {app} from "../../src";
import {Statuses} from "../../src/types/types";

const instance = request(app);

describe('test functional',()=>{
    beforeAll(async ()=>{
        await instance.delete('/testing/all-data')
    })

    it('should return 200 and empty array',async () => {
        await instance.get('/videos')
            .expect(Statuses.OK,[])
    })

    it('should return 404 for not existing videos',async () => {
        await instance.get('/videos/1')
            .expect(Statuses.NOT_FOUND)
    })

    it(`shouldn't create video with incorrect input data`,async () => {
        await instance.post('/videos')
            .send({title: null})
            .expect(Statuses.BAD_REQUEST)

        await instance.get('/videos')
            .expect(Statuses.OK,[])
    })

    it(`should create video with correct input data`,async () => {
        const inputData = {title: "new video", author: "new author"};
        const {body} = await instance.post('/videos')
            .send(inputData)
            .expect(Statuses.CREATED)

        expect(body).toEqual(
            expect.objectContaining(
                {
                        id: expect.any(Number),
                        ...inputData
                    }
            ))

        await instance.get('/videos')
            .expect(Statuses.OK,[body])
    })

    it('should update video with unnecessary input data and exclude them',async () => {
        const inputData = {title: "new video 1", author: "new author 1"};
        const unnecessaryData = {ascucduh: "cuisabci"};
        const resCreatedVideo = await instance.post('/videos')
            .send(inputData)
            .expect(Statuses.CREATED)

        expect(resCreatedVideo.body).toEqual(
            expect.objectContaining(
                {
                    id: expect.any(Number),
                    ...inputData
                }
            ))

        const resAllVideos = await instance.get('/videos')
            .expect(Statuses.OK)

        expect(resAllVideos.body).toEqual(expect.arrayContaining([resCreatedVideo.body]))

        await instance.put('/videos/' + resCreatedVideo.body.id)
            .send({
                ...inputData,
                ...unnecessaryData
            })
            .expect(Statuses.NO_CONTENT)

        const resUpdateVideo = await instance.get('/videos/' + resCreatedVideo.body.id)
            .expect(Statuses.OK)

        expect(resUpdateVideo.body)
            .toEqual(expect.not.objectContaining(unnecessaryData))
    })
})