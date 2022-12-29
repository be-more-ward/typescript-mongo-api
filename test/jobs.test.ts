import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server"

import request from "supertest";
import app from "../app";


describe("Testing jobs routes",()=>{

    const testUser = {name:"john", email:"john@gmail.com", password:"password"}
    let token:string, id:string

    // CREATE IN MEMORY SERVER
    let mongod: MongoMemoryServer

    beforeAll(async()=>{
        mongod = await MongoMemoryServer.create()
        const uri = mongod.getUri()
        await mongoose.connect(uri)

        // register and login
        await request(app).post("/api/v1/auth/register").send(testUser)
        const response = await request(app).post("/api/v1/auth/login").send({email: testUser.email, password: testUser.password})
        
        token = response.body.token // get the token
    })

    afterAll(async () => {
        await mongoose.disconnect()
        await mongod.stop()
    })

    describe("POST Request /api/v1/jobs", ()=>{
        test("should create a job and return 200", async ()=>{
            const response = await request(app).post("/api/v1/jobs/")
            .set("Authorization", `Bearer ${token}`) //set the token
            .send({company:"randomCompany", position: "randomPosition"})

            id = response.body["job"]._id // set the id for GET, PATCH and DELETE Request
            
            expect(response.status).toBe(200)
            expect(response.body["job"].company).toEqual("randomCompany")
            expect(response.body["job"].position).toEqual("randomPosition")
        })

        test("should not create a job with empty body and return 400", async ()=>{
            const response = await request(app).post("/api/v1/jobs/")
            .set("Authorization", `Bearer ${token}`) //set the token
            .send({})

            expect(response.status).toBe(400)
            expect(response.body.msg).toEqual(`req.body cannot be empty`)
        })

        test("should not create a job with missing properties and return 400", async ()=>{
            const response = await request(app).post("/api/v1/jobs/")
            .set("Authorization", `Bearer ${token}`) //set the token
            .send({company:"randomCompany"})

            expect(response.status).toBe(400)
            expect(response.body.msg).toEqual(`\"position\" is required`)
        })
    })

    describe("GET Request /api/v1/jobs/", ()=>{
        test("should get all jobs from authenticated user and return 200", async()=>{
            const response = await request(app).get("/api/v1/jobs/")
            .set("Authorization", `Bearer ${token}`) //set the token

            expect(response.status).toBe(200)
            expect(response.headers["content-type"]).toContain("json")
            expect(response.body["jobs"][0].company).toEqual("randomCompany")
            expect(response.body["jobs"][0].position).toEqual("randomPosition")
            expect(response.body["jobs"][0].status).toEqual("pending")
        })

        test("should return 401 for invalid credentials", async()=>{
            const response = await request(app).get("/api/v1/jobs/")
            .set("Authorization", `Bearer BLABLABLA`) //set the token

            expect(response.status).toBe(401)
            expect(response.headers["content-type"]).toContain("json")
            expect(response.body.msg).toEqual("Invalid credentials- not auth to this route")
    
        })
    })

    describe("GET Request /api/v1/jobs/:id", ()=>{
        test("should return 200 with valid 'id' ", async()=>{
            const response = await request(app).get(`/api/v1/jobs/${id}`)
            .set("Authorization", `Bearer ${token}`) //set the token

            expect(response.status).toBe(200)
            expect(response.headers["content-type"]).toContain("json")
            expect(response.body["job"].company).toEqual("randomCompany")
            expect(response.body["job"].position).toEqual("randomPosition")
        })

        test("should return 400 with invalid 'id' ", async()=>{
            const response = await request(app).get(`/api/v1/jobs/111555`)
            .set("Authorization", `Bearer ${token}`) //set the token

            expect(response.status).toBe(404)
            expect(response.headers["content-type"]).toContain("json")
            expect(response.body.msg).toEqual(`Not job with id: 111555`)
        })

        test("should return 401 for invalid token and valid 'id' ", async()=>{
            const response = await request(app).get(`/api/v1/jobs/${id}`)
            .set("Authorization", `Bearer BLABABBA`) //set the token

            expect(response.status).toBe(401)
            expect(response.headers["content-type"]).toContain("json")
            expect(response.body.msg).toEqual(`Invalid credentials- not auth to this route`)
        })
    })

    describe("PATCH Request /api/v1/jobs/:id", ()=>{
        test("should return 200 with valid 'id' and update 'company' ", async()=>{
            const response = await request(app).patch(`/api/v1/jobs/${id}`)
            .set("Authorization", `Bearer ${token}`) //set the token
            .send({company:"newCompany"})
            
            expect(response.status).toBe(200)
            expect(response.headers["content-type"]).toContain("json")
            expect(response.body["job"].company).toEqual("newCompany")
        })

        test("should return 400 with empty body and valid 'id' ", async()=>{
            const response = await request(app).patch(`/api/v1/jobs/${id}`)
            .set("Authorization", `Bearer ${token}`) //set the token
            .send({})            

            expect(response.status).toBe(400)
            expect(response.headers["content-type"]).toContain("json")
            expect(response.body.msg).toEqual("req.body cannot be empty")
        })

        test("should return 404 with invalid 'id' ", async()=>{
            const response = await request(app).patch(`/api/v1/jobs/11111111155`)
            .set("Authorization", `Bearer ${token}`) //set the token
            .send({company:"newCompany"})
            
            expect(response.status).toBe(404)
            expect(response.headers["content-type"]).toContain("json")
        })
    })

    describe("DELETE Request /api/v1/jobs/:id", ()=>{
        test("should return 404 with invalid 'id' ", async()=>{
            const response = await request(app).delete(`/api/v1/jobs/1111`)
            .set("Authorization", `Bearer ${token}`) //set the token
            
            expect(response.status).toBe(404)
            expect(response.headers["content-type"]).toContain("json")
            expect(response.body.msg).toEqual(`Not job with id: 1111`)
        })
        
        test("should return 200 with valid 'id' ", async()=>{
            const response = await request(app).delete(`/api/v1/jobs/${id}`)
            .set("Authorization", `Bearer ${token}`) //set the token
    
            expect(response.status).toBe(200)
        })
    })

})