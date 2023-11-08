const request = require("supertest");
const { app } = require("../server");
const jwt = require("jsonwebtoken");
const config = require("../config");
const mongoose = require("mongoose");
const mockingoose = require("mockingoose");
const Article = require("../api/articles/articles.model");

describe("Tester API articles", () => {
  let token;
  const ARTICLE_ID = "fake";
  const USER_ID = "fake";
  const MOCK_DATA = [
    {
      _id: ARTICLE_ID,
      title: "Article 1",
      content: "Au revoir de...",
      status: "draft",
    },
  ];
  const MOCK_DATA_CREATED = {
    title: "Article 2",
    content: "Bonjour voici un...",
    user: USER_ID,
    status: "draft",
  };

  beforeEach(() => {
    token = jwt.sign({ userId: USER_ID }, config.secretJwtToken);
    mockingoose(Article).toReturn(MOCK_DATA, "find");
    mockingoose(Article).toReturn(MOCK_DATA_CREATED, "save");
  });

  // test("[Articles] Get All", async () => {
  //   const res = await request(app)
  //     .get("/api/articles")
  //     .set("x-access-token", token);
  //   expect(res.status).toBe(200);
  //   expect(res.body.length).toBeGreaterThan(0);
  // });

  test("[Articles] Create Article", async () => {
    const res = await request(app)
      .post("/api/articles")
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(201);
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
  });

  test("[Articles] Update Article", async () => {
    const res = await request(app)
      .put(`/api/articles/${ARTICLE_ID}`)
      .send(MOCK_DATA_CREATED)
      .set("x-access-token", token);
    expect(res.status).toBe(200);
    expect(res.body.title).toBe(MOCK_DATA_CREATED.title);
  });

  test("[Articles] Delete Article", async () => {
    const res = await request(app)
      .delete(`/api/articles/${ARTICLE_ID}`)
      .set("x-access-token", token);
    expect(res.status).toBe(200);
  });


  afterEach(() => {
    jest.restoreAllMocks();
  });
});
