"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const src_1 = require("../../src");
const types_1 = require("../../src/types/types");
const instance = (0, supertest_1.default)(src_1.app);
describe('test functional', () => {
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield instance.delete('/testing/all-data');
    }));
    it('should return 200 and empty array', () => __awaiter(void 0, void 0, void 0, function* () {
        yield instance.get('/videos')
            .expect(types_1.Statuses.OK, []);
    }));
    it('should return 404 for not existing videos', () => __awaiter(void 0, void 0, void 0, function* () {
        yield instance.get('/videos/1')
            .expect(types_1.Statuses.NOT_FOUND);
    }));
    it(`shouldn't create video with incorrect input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        yield instance.post('/videos')
            .send({ title: null })
            .expect(types_1.Statuses.BAD_REQUEST);
        yield instance.get('/videos')
            .expect(types_1.Statuses.OK, []);
    }));
    it(`should create video with correct input data`, () => __awaiter(void 0, void 0, void 0, function* () {
        const inputData = { title: "new video", author: "new author" };
        const { body } = yield instance.post('/videos')
            .send(inputData)
            .expect(types_1.Statuses.CREATED);
        expect(body).toEqual(expect.objectContaining(Object.assign({ id: expect.any(Number) }, inputData)));
        yield instance.get('/videos')
            .expect(types_1.Statuses.OK, [body]);
    }));
});
