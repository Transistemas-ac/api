import request from "supertest";
import app from "../index";
import jwt from "jsonwebtoken";

jest.mock("../libs/prisma");
import prismaMock from "../__mocks__/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";

describe("Course Controller", () => {
  let token: string;

  beforeAll(() => {
    token = jwt.sign({ id: 1, credentials: "admin" }, JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GET /course → should return courses", async () => {
    (prismaMock.course.findMany as jest.Mock).mockResolvedValue([
      { id: 1, name: "Math" },
    ]);

    const res = await request(app).get("/course");

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, name: "Math" }]);
  });

  it("POST /course → should create course (auth required)", async () => {
    (prismaMock.course.create as jest.Mock).mockResolvedValue({
      id: 2,
      name: "History",
    });

    const res = await request(app)
      .post("/course")
      .set("Authorization", `Bearer ${token}`)
      .send({ name: "History" });

    expect(res.status).toBe(201);
    expect(res.body).toEqual({ id: 2, name: "History" });
  });
});
