import { hash } from "bcrypt";
import request from "supertest";
import { Connection } from "typeorm";
import { v4 as uuidV4 } from "uuid";

import { app } from "@shared/infra/http/app";
import createConnection from "@shared/infra/typeorm";

let connection: Connection;
describe("List Category Controller", () => {
  beforeAll(async () => {
    connection = await createConnection();

    try {
      await connection.runMigrations();
    } catch (error) {
      console.error(error);
    }

    const id = uuidV4();
    const password = await hash("admin", 8);

    await connection.query(
      `INSERT INTO 
      USERS(id, name, email, password, "isAdmin", driver_license, created_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [id, "Admin", "admin@rentx.com", password, true, "XXXXXXX", "now()"]
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to list all available categories", async () => {
    const {
      body: { token },
    } = await request(app).post("/sessions").send({
      email: "admin@rentx.com",
      password: "admin",
    });

    await request(app)
      .post("/categories")
      .set({
        authorization: `Bearer ${token}`,
      })
      .send({
        name: "teste",
        description: "teste",
      });

    const response = await request(app).get("/categories");

    expect(response.statusCode).toBe(201);
    expect(response.body.length).toBe(1);
    expect(response.body[0]).toHaveProperty("id");
    expect(response.body[0]).toHaveProperty("name");
  });
});
