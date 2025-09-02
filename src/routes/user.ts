const { Router } = require("express");
const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

const router = Router();

router.get("/", (req: Request, res: Response) => {
  getUsers(req, res);
});

router.get("/:id", (req: Request, res: Response) => {
  getUserById(req, res);
});

router.post("/", (req: Request, res: Response) => {
  createUser(req, res);
});

router.put("/:id", (req: Request, res: Response) => {
  updateUser(req, res);
});

router.delete("/:id", (req: Request, res: Response) => {
  deleteUser(req, res);
});

export default router;
