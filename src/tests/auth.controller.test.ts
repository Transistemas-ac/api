import request from "supertest";
import app from "../index";
import bcrypt from "bcrypt";

jest.mock("../libs/prisma");
import prismaMock from "../__mocks__/prisma";

jest.mock("bcrypt");

describe("Auth Controller", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("POST /register → should create a new user", async () => {
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed_password");

    (prismaMock.user.create as jest.Mock).mockResolvedValue({
      id: 21,
      username: "testuser",
      email: "test@example.com",
      password: "hashed_password",
      credentials: "student",
    });

    const res = await request(app).post("/register").send({
      username: "testuser",
      email: "test@example.com",
      password: "plainpassword",
    });

    expect(res.status).toBe(201);
    expect(res.body).toMatchObject({
      success: true,
      user: {
        id: 21,
        username: "testuser",
        email: "test@example.com",
        credentials: "student",
      },
    });
  });

  it("POST /login → should return token for valid credentials", async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "test@example.com",
      password: "hashed_password",
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(true);

    const res = await request(app).post("/login").send({
      username: "testuser",
      password: "plainpassword",
    });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("POST /login → should fail with invalid credentials", async () => {
    (prismaMock.user.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      username: "testuser",
      email: "test@example.com",
      password: "hashed_password",
    });

    (bcrypt.compare as jest.Mock).mockResolvedValue(false);

    const res = await request(app).post("/login").send({
      username: "testuser",
      password: "wrongpassword",
    });

    expect(res.status).toBe(401);
    expect(res.body).toMatchObject({
      success: false,
      message: "Password incorrect",
    });
  });
});
