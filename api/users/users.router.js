const express = require("express");
const usersController = require("./users.controller");
const authMiddleware = require("../../middlewares/auth");
const router = express.Router();

router.get("/", authMiddleware, usersController.getAll);
router.get("/:id", authMiddleware, usersController.getById);
router.get("/:userId/articles", usersController.getArticlesByUser);
router.post("/", usersController.create);
router.put("/:id", authMiddleware, usersController.update);
router.delete("/:id",authMiddleware,  usersController.delete);

module.exports = router;
