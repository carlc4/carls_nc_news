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
describe("GET /api/comments", () => {
  test("Status: 200", () => {
    return request(app).get("/api/comments").expect(200);
  });
  test("Status: 200, returns array of test comments", () => {
    return request(app)
      .get("/api/comments")
      .expect(200)
      .then((response) => {
        expect(response.body.comments).toHaveLength(18);
      });
  });
  test("Status: 200, returns array of test objects with correct keys", () => {
    return request(app)
      .get("/api/comments")
      .expect(200)
      .then((comments) => {
        comments.body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              body: expect.any(String),
              author: expect.any(String),
              created_at: expect.any(String),
              votes: expect.any(Number),
              article_id: expect.any(Number),
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
    const testObject = {
      article_id: 1,
      title: "Living in the shadow of a great man",
      topic: "mitch",
      author: "butter_bridge",
      body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
      votes: expect.any(Number),
    };
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject(testObject);
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
describe("REFACTOR - GET /api/articles/:article_id", () => {
  test("Status: 200, returns an updated object", () => {
    return request(app).get("/api/articles/1").expect(200);
  });
  test("Status: 200, returns an updated object with a comment count key", () => {
    const testObject = { comment_count: "1" };
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject(testObject);
      });
  });
});
describe("GET /api/articles/:article_id/comments", () => {
  test("Status: 200", () => {
    return request(app).get("/api/articles/1/comments/").expect(200);
  });
  test("Status: 200, returns an array", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
      });
  });
  test("Status: 200, returns an array of comment objects with correct keys", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        body.comments.forEach((comment) => {
          expect(comment).toEqual(
            expect.objectContaining({
              comment_id: expect.any(Number),
              votes: expect.any(Number),
              created_at: expect.any(String),
              author: expect.any(String),
              body: expect.any(String),
            })
          );
        });
      });
  });
  test("Status: 200, first comment object matches first entry in test database", () => {
    return request(app)
      .get("/api/articles/1/comments")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments[0]).toEqual(
          expect.objectContaining({
            comment_id: 2,
            votes: 14,
            created_at: expect.any(String),
            author: "butter_bridge",
            body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
          })
        );
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("Status: 200, comment object is returned", () => {
    const testObject = { body: "Test comment" };
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge", comment: "Test comment" })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toMatchObject(testObject);
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
describe("GET/api/articles", () => {
  test("Status: 200, responds with array of article objects, containing correct properties", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
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
  test("Status: 200, objects are sorted in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("Status: 200, GET request to this endpoint includes comment count for the articles", () => {
    const testObject = { comment_count: "1" };
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject(testObject);
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
          expect(body.message).toEqual("Invalid URL Passed");
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
    test("Status: 400, bad request if article_id is invalid", () => {
      return request(app)
        .get("/api/articles/ERROR/comment")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual("Invalid URL Passed");
        });
    });
    test("Status: 404 if the article is valid format but does not exist", () => {
      return request(app)
        .patch("/api/articles/99999/comment")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual("Invalid URL Passed");
        });
    });
  });
  describe("Comment Errors", () => {
    test("Status: 400 if the article is valid format but does not exist", () => {
      return request(app)
        .post("/api/articles/99999/comments")
        .send({ username: "butter_bridge", comment: "Test comment" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Article ID Does Not Exist");
        });
    });
    test("Status: 404 if username is not in the usernames database", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "TEST", comment: "Test comment" })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual(
            "Username not found, please register first"
          );
        });
    });
    test("Status: 400 if comment is incorrect type", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge", comment: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Missing info");
        });
    });
    test("Status: 400 if username is missing", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ comment: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Missing info");
        });
    });
    test("Status: 400 if comment is missing", () => {
      return request(app)
        .post("/api/articles/1/comments")
        .send({ username: "butter_bridge" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Missing info");
        });
    });
  });
});

describe("DELETE/api/comments/1", () => {
  test("Status: 204, comment is deleted", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204)
      .then(() => {
        // this test checks for a 204 but also requests the entire comments table and checks the length has been reduced by 1
        return request(app)
          .get("/api/comments")
          .expect(200)
          .then(({ body }) => {
            expect(body.comments).toHaveLength(17);
          });
      });
  });
  test("Status: 400, comment is not found", () => {
    return request(app)
      .delete("/api/comments/99999")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toEqual("Comment ID Does Not Exist!");
      });
  });
  test("Status: 404, comment is invalid", () => {
    return request(app)
      .delete("/api/comments/ERROR")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toEqual("Bad request");
      });
  });
});
