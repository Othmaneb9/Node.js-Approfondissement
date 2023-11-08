const NotFoundError = require("../../errors/not-found");
const UnauthorizedError = require("../../errors/unauthorized");
const jwt = require("jsonwebtoken");
const config = require("../../config");
const articlesService = require("./articles.service");

class ArticlesController {
  async getAll(req, res, next) {
    try {
      const articles = await articlesService.getAll();
      res.json(articles);
    } catch (err) {
      next(err);
    }
  }
  async getById(req, res, next) {
    try {
      const id = req.params.id;
      const article = await articlesService.get(id);
      if (!article) {
        throw new NotFoundError();
      }
      res.json(article);
    } catch (err) {
      next(err);
    }
  }
  async create(req, res, next) {
    try {
      const userId = req.user._id; 
      const articleData = req.body;

      articleData.user = userId;
      const article = await articlesService.create(articleData, userId);
      req.io.emit("article:create", article);
      res.status(201).json(article);
    } catch (err) {
      next(err);
    }
  }
  async update(req, res, next) {
    try {
      const id = req.params.id;
      const data = req.body;
      const article = await articlesService.get(id);

      if (!article) {
        throw new NotFoundError();
      }

      if (req.user.role !== "admin") {
        throw new UnauthorizedError("You are not authorized to update this article");
      }

      const articleModified = await articlesService.update(id, data);
      articleModified.content = undefined;
      res.json(articleModified);
    } catch (err) {
      next(err);
    }
  }
  async delete(req, res, next) {
    try {
      const id = req.params.id;
      const article = await articlesService.get(id);

      if (!article) {
        throw new NotFoundError();
      }
      if (req.user.role !== "admin") {
        throw new UnauthorizedError("You are not authorized to delete this article");
      }
      await articlesService.delete(id);
      req.io.emit("article:delete", { id });
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new ArticlesController();
