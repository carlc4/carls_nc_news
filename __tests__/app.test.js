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
        expect(body.articles).toEqual(
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
});
describe("Error handling", () => {
  test("Status: 404, returns url not found message", () => {
    return request(app)
      .get("/api/NOT-A-VALID-URL")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toEqual("Invalid URL Passed");
      });
  });
  test("Status: 400, not found if article_id is invalid", () => {
    return request(app)
      .get("/api/articles/ERROR")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Article ID Invalid!");
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
});
