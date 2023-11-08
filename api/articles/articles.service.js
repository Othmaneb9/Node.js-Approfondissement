const Article = require("./articles.model");
const bcrypt = require("bcrypt");

class ArticleService {
  getAll() {
    return Article.find({});
  }
  get(id) {
    return Article.findById(id);
  }
  create(data, userId) {
    const article = new Article({ ...data, user: userId });
    return article.save();
  }
  update(id, data) {
    return Article.findByIdAndUpdate(id, data, { new: true });
  }
  delete(id) {
    return Article.deleteOne({ _id: id });
  }
  async checkIdArticle(id) {
    const article = await Article.findOne({ id });
    if (!article) {
      return false;
    }
    const bool = await bcrypt.compare(id, article.id);
    if (!bool) {
      return false;
    }
    return article._id;
  }
  async getArticlesByUser(userId) {
    return Article.find({ user: userId }, "-password").populate("user", "-password");
  }
}

module.exports = new ArticleService();
