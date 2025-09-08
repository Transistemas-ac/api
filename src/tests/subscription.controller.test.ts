import request from "supertest";
import app from "../index";
import jwt from "jsonwebtoken";

jest.mock("../libs/prisma");
import prismaMock from "../__mocks__/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "testsecret";

describe("Subscription Controller", () => {
  let token: string;

  beforeAll(() => {
    token = jwt.sign({ id: 1, credentials: "student" }, JWT_SECRET, {
      expiresIn: "1h",
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("GET /subscription → should return subscriptions", async () => {
    (prismaMock.subscription.findMany as jest.Mock).mockResolvedValue([
      { id: 1, courseId: 1, userId: 1 },
    ]);

    const res = await request(app)
      .get("/subscription")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1, courseId: 1, userId: 1 }]);
  });
});
