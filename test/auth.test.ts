import mongoose from "mongoose";
import {MongoMemoryServer} from "mongodb-memory-server"

import request from "supertest";
import app from "../app";


describe("Testing auth routes",  () => {
  
  let mongod: MongoMemoryServer

  beforeAll(async()=>{
    mongod = await MongoMemoryServer.create()
    const uri = mongod.getUri()
    await mongoose.connect(uri)
  })
  
  afterAll( async()=>{
    await mongoose.disconnect()
    await mongod.stop()
  })

  describe("POST request to /api/v1/auth/register",()=>{
    test("should return 201 with valid data ", async() => {
      const response = await request(app).post("/api/v1/auth/register").send(
        {
          name: "john",
          email: "john@gmail.com",
          password: "password",
        });
        
        expect(response.status).toBe(201)
        expect(response.headers["content-type"]).toContain("json")
      });

    test("should return 400, user already sign up ", async() => {
      const response = await request(app).post("/api/v1/auth/register").send(
        {
          name: "john",
          email: "john@gmail.com",
          password: "password",
        });
        
        expect(response.status).toBe(400)
        expect(response.headers["content-type"]).toContain("json")
        expect(response.body.msg).toEqual("Duplication value for email field")
      });
      
    test("should return 400 with missing data ", async() => {
      const response = await request(app).post("/api/v1/auth/register").send({email:"john@gmail.com"});

      expect(response.status).toBe(400)
      expect(response.headers["content-type"]).toContain("json")
      expect(response.body.msg).toEqual(`\"name\" is required`)
    });

    test("should return 400 with empty body ", async() => {
      const response = await request(app).post("/api/v1/auth/register").send({});
      
      expect(response.status).toBe(400)
      expect(response.headers["content-type"]).toContain("json")
      expect(response.body.msg).toEqual(`req.body cannot be empty`)
    });
  })
  
  describe("POST Request to /api/v1/auth/login",()=>{
    test("should return 200 with valid data", async()=>{
      const response = await request(app).post("/api/v1/auth/login").send({email:"john@gmail.com", password:"password"})
      
      expect(response.status).toBe(200)
      expect(response.headers["content-type"]).toContain("json")
      expect(response.body.user).toEqual({name:"john"})
    })
    
    test("should return 400 with wrong email ", async()=>{
      const response = await request(app).post("/api/v1/auth/login").send({email:"gmail.com", password:"password"})

      expect(response.status).toBe(400)
      expect(response.headers["content-type"]).toContain("json")
      expect(response.body.msg).toEqual(`\"email\" must be a valid email`)
    })
    test("should return 401 with wrong password ", async()=>{
      const response = await request(app).post("/api/v1/auth/login").send({email:"john@gmail.com", password:"passwordddd"})

      expect(response.status).toBe(401)
      expect(response.headers["content-type"]).toContain("json")
      expect(response.body.msg).toEqual(`Invalid credentials. Wrong password`)
    })
  })
});
