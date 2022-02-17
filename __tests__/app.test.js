const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");
const connection = require("../db/connection");

beforeEach(() => {
  return seed(data);
});

afterAll(() => {
  connection.end();
});

describe("GET /api/topics", () => {
  test("Status: 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("Status: 200, returns array of 3 test objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body.topics).toHaveLength(3);
      });
  });
  test("Status: 200, returns array of 3 test objects with the keys of slug and description", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        response.body.topics.forEach((topic) => {
          expect(topic).toEqual(
            expect.objectContaining({
              slug: expect.any(String),
              description: expect.any(String),
            })
          );
        });
      });
  });
});
describe("GET /api/articles/:article_id", () => {
  test("Status: 200", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("Status: 200, returns an object with corresponding keys", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual(
          expect.objectContaining({
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          })
        );
      });
  });
  test("Status: 200, returns a specific object based on input", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
});
describe("GET /api/users", () => {
  test("Status: 200", () => {
    return request(app).get("/api/users").expect(200);
  });
  test("Status: 200, returns array of 4 test objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body.users).toHaveLength(4);
      });
  });
  test("Status: 200, returns an array of objects with username key", () => {
    return request(app)
      .get("/api/users/")
      .expect(200)
      .then(({ body }) => {
        body.users.forEach((username) => {
          expect(username).toEqual(
            expect.objectContaining({
              username: expect.any(String),
            })
          );
        });
      });
  });
});
describe("PATCH /api/articles/:article_id", () => {
  test("Status: 200, votes key on object updated when positive number passed in", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 101,
        });
      });
  });
  test("Status: 200, votes key on object updated when negative number passed in", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 99,
        });
      });
  });
});
describe("GET/api/articles", () => {
  test("Status: 200, responds with array of article objects, containing correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(12);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
          });
        });
      });
  });
  test.only("Status: 200, objects are sorted in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        console.log(body.articles);
        expect(body.articles[0]).toEqual({
          article_id: 3,
          title: "Eight pug gifs that remind me of mitch",
          topic: "mitch",
          author: "icellusedkars",
          created_at: expect.any(String),
          votes: expect.any(Number),
        });
      });
  });
});

describe("Error handling", () => {
  describe("General errors", () => {
    test("Status: 404, returns url not found message", () => {
      return request(app)
        .get("/api/NOT-A-VALID-URL")
        .expect(404)
        .then(({ body }) => {
          expect(body.msg).toEqual("Invalid URL Passed");
        });
    });
  });
  describe("Article errors", () => {
    test("Status: 400, not found if article_id is invalid", () => {
      return request(app)
        .get("/api/articles/ERROR")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Data entry error");
        });
    });
    test("Status: 404, not found if article_id is valid but no records exist", () => {
      return request(app)
        .get("/api/articles/9999")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual("Article ID Does Not Exist!");
        });
    });
    test("Status: 400 if the vote change is not a number", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: "ERROR" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Data entry error");
        });
    });
    test("Status: 400 if the url is not valid", () => {
      return request(app)
        .patch("/api/articles/ERROR")
        .send({ inc_votes: 10 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Data entry error");
        });
    });
    test("Status: 400 if the object key is not valid", () => {
      return request(app)
        .patch("/api/articles/1")
        .send({ INVALIDKEY: 10 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Article ID Does Not Exist!");
        });
    });
    test("Status: 404 if the article is valid format but does not exist", () => {
      return request(app)
        .patch("/api/articles/99999")
        .send({ inc_votes: 1 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual("Article ID Does Not Exist!");
        });
    });
  });
});
