import request from "supertest";
import app from "../index";
import jwt from "jsonwebtoken";

jest.mock("../libs/prisma");
import prismaMock from "../__mocks__/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";

describe("User Controller", () => {
  let token: string;

  beforeAll(() => {
    token = jwt.sign({ id: 1, credentials: "admin" }, JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GET /user → should return users", async () => {
    (prismaMock.user.findMany as jest.Mock).mockResolvedValue([
      { id: 1, username: "test" },
    ]);

    const res = await request(app)
      .get("/user")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, username: "test" }]);
  });
});
