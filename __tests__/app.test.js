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
describe("GET /api/topics", () => {
  test("Status: 200, returns an array of topic objects with matching slug", () => {
    return request(app)
      .get("/api/topics")
      .send({
        slug: "mitch",
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.topics).toBeInstanceOf(Array);
        expect(body.topics).toHaveLength(1);
        expect(body.topics[0].slug).toEqual("mitch");
      });
  });
  test("Status: 200 errors in the body return a normal GET request result", () => {
    return request(app)
      .get("/api/topics/")
      .send({ TEST: "TEST" })
      .expect(200)
      .then(({ body }) => {
        expect(body.topics[0]).toEqual(
          expect.objectContaining({
            slug: expect.any(String),
            description: expect.any(String),
          })
        );
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
describe("REFACTOR GET/api/articles", () => {
  test("Status: 200, responds with array of article objects sorted by date", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&&order=desc&&limit=10&&p=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
  test("Status: 200, responds with array of article objects sorted by date in ascending order", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&&order=asc")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", {
          ascending: true,
        });
      });
  });
  test("Status: 200, responds with array of article objects sorted by author", () => {
    return request(app)
      .get("/api/articles?sort_by=author")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("author", {
          descending: true,
        });
      });
  });
  test("Status: 200, responds with array of article objects filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(1);
      });
  });
  test("Status: 200, responds with array of article objects filtered by topic in ascending date order limited to 10", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&&order=asc&&topic=mitch")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(10);
        expect(body.articles).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("Status: 200, responds with an array of articles limited by the limit query (5)", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at&&order=asc&&topic=mitch&&limit=5")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(5);
        expect(body.articles).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("Status: 200, responds with an array of articles listing one article on final page", () => {
    return request(app)
      .get(
        "/api/articles?sort_by=created_at&&order=asc&&topic=mitch&&limit=10&&p=2"
      )
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toHaveLength(1);
        expect(body.articles).toBeSortedBy("created_at", { ascending: true });
      });
  }); // the above test sets the page to 2, where there should only be one item listed as there are 11 in total
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
      // body: "The beautiful thing about treasure is that it exists. Got to find out what kind of sheets these are; not cotton, not rayon, silky.",
      body: "I find this existence challenging",
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
describe("GET /api/users/:username", () => {
  test("Status: 200", () => {
    return request(app).get("/api/users/butter_bridge").expect(200);
  });
  test("Status: 200, returns a specific object with corresponding keys based on input", () => {
    return request(app)
      .get("/api/users/butter_bridge")
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            username: "butter_bridge",
            name: "jonny",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          })
        );
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
  test("Status: 200, returns an array limited to 10 items by default", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=10&&p=1")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(10);
      });
  });
  test("Status: 200, returns an array limited to 5 items when L is passed in the query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(5);
      });
  });
  test("Status: 200, returns an array limited to 5 items when L is passed in the query", () => {
    return request(app)
      .get("/api/articles/1/comments?limit=5&&p=3")
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(1);
      }); // expects a return of 1 as there are 11 comments, the third page has a single comment when l = 5
  });
});
describe("GET /api", () => {
  test("Exports the API endpoints file as a JSON object", () => {
    return request(app).get("/api").expect(200);
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
describe("PATCH /api/comments/:comment_id", () => {
  test("Status: 200, votes key on object updated when positive number passed in", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: 1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 1,
          article_id: expect.any(Number),
          author: "butter_bridge",
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          created_at: expect.any(String),
          votes: 17,
        });
      });
  });
  test("Status: 200, votes key on object updated when negative number passed in", () => {
    return request(app)
      .patch("/api/comments/1")
      .send({ inc_votes: -1 })
      .expect(200)
      .then(({ body }) => {
        expect(body.comment).toEqual({
          comment_id: 1,
          article_id: expect.any(Number),
          author: "butter_bridge",
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          created_at: expect.any(String),
          votes: 15,
        });
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
describe("POST /api/topics", () => {
  test("Status: 200, topic is added, topic object is returned", () => {
    const testObject = { body: "Test comment" };
    return request(app)
      .post("/api/topics")
      .send({ slug: "Test", description: "Test topic" })
      .expect(200)
      .then(({ body }) => {
        expect(body.topic.slug).toEqual("Test");
        expect(body.topic.description).toEqual("Test topic");
      });
  });
  test("Status: 200, topic is added, topic table is updated", () => {
    const testObject = { body: "Test comment" };
    return request(app)
      .post("/api/topics")
      .send({ slug: "Test", description: "Test topic" })
      .expect(200)
      .then(() => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(({ body }) => {
            expect(body.topics).toHaveLength(4);
          }); // this test adds a comment and then checks that the number of topic objects has been updated to 4
      });
  });
});
describe("POST /api/articles/", () => {
  test("Status: 200, article is posted to table", () => {
    return request(app)
      .post("/api/articles/")
      .send({
        author: "butter_bridge",
        title: "Test",
        body: "Test article text",
        topic: "mitch",
      })
      .expect(200);
  });
  test("Status: 200, article object is returned", () => {
    const testObject = {
      author: "butter_bridge",
      title: "Test",
      body: "Test article text",
      topic: "mitch",
    };
    return request(app)
      .post("/api/articles/")
      .send({
        author: "butter_bridge",
        title: "Test",
        body: "Test article text",
        topic: "mitch",
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject(testObject);
      });
  });
});
describe("POST /api/users/new", () => {
  test("Status: 200, returns a new user object based on input", () => {
    return request(app)
      .post("/api/users/new")
      .send({
        username: "testUser",
        name: "test name",
        avatar_url: "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
      })
      .expect(200)
      .then(({ body }) => {
        expect(body.user).toEqual(
          expect.objectContaining({
            username: "testUser",
            name: "test name",
            avatar_url:
              "https://www.healthytherapies.com/wp-content/uploads/2016/06/Lime3.jpg",
          })
        );
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
});
describe("DELETE/api/articles/:article_id", () => {
  test("Status: 204, article is deleted", () => {
    return request(app).delete("/api/articles/1").expect(204);
  });
  test("Status: 204, article is deleted, length of table is reduced", () => {
    return request(app)
      .delete("/api/articles/1")
      .expect(204)
      .then(() => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then((response) => {
            expect(response.body.articles).toHaveLength(10);
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
          expect(body.message).toEqual("Invalid URL Passed");
        });
    });
  });
  describe("Topic Errors", () => {
    test("Status: 400 if the slug has no matches", () => {
      return request(app)
        .get("/api/topics/")
        .send({ slug: "TEST" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Topic does not exist");
        });
    });
    test("Status: 400 if object keys are invalid", () => {
      return request(app)
        .post("/api/topics/")
        .send({ ERROR: "TEST", description: "Test Description" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Invalid input");
        });
    });
    test("Status: 400 if object keys are invalid", () => {
      return request(app)
        .post("/api/topics/")
        .send({ slug: "TEST", ERROR: "Test Description" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Invalid input");
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
    test("Status: 400 if the sort is invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=ERROR&&order=asc&&topic=mitch")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Invalid sort query");
        });
    });
    test("Status: 400 if the order by is invalid", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&&order=ERROR&&topic=mitch")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Invalid order query");
        });
    });
    test("Status: 404 if the topic does not exist in the topic table", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&&order=asc&&topic=ERROR")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual("Topic does not exist");
        });
    });
    test("Status: 404 if the topic exists but there are no associated articles", () => {
      return request(app)
        .get("/api/articles?sort_by=created_at&&order=asc&&topic=paper")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual("Topic has no matching articles");
        });
    });
    test("Status: 400 if the topic is not in the topics table", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "butter_bridge",
          title: "Test",
          body: "Test article text",
          topic: "TEST",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Topic does not exist");
        });
    });
    test("Status: 400 if the author is not in the authors table", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "TEST",
          title: "Test",
          body: "Test article text",
          topic: "mitch",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("User does not exist");
        });
    });
    test("Status: 400 if there is no body text", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "butter_bridge",
          title: "Test",
          topic: "mitch",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Please complete all fields");
        });
    });
    test("Status: 400 if there is no title text", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "butter_bridge",
          body: "Test",
          topic: "mitch",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Please complete all fields");
        });
    });
    test("Status: 400 if there is no topic text", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "butter_bridge",
          body: "Test",
          title: "Test",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Please complete all fields");
        });
    });
    test("Status: 400 if body is empty", () => {
      return request(app)
        .post("/api/articles")
        .send({
          author: "butter_bridge",
          title: "Test",
          topic: "mitch",
          body: "",
        })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Please complete all fields");
        });
    });
    test("Status 400 - p query is invalid", () => {
      return request(app)
        .get("/api/articles?p=ERROR")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid page query");
        });
    });
    test("Status 400 - limit is not a number", () => {
      return request(app)
        .get("/api/articles?limit=ERROR")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Invalid limit query");
        });
    });
    test("Status 400 - comments p query is invalid", () => {
      return request(app)
        .get("/api/articles/1/comments?p=ERROR")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Query parameters invalid");
        });
    });
    test("Status 400 - comments limit is not a number", () => {
      return request(app)
        .get("/api/articles/1/comments?limit=ERROR")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Query parameters invalid");
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
          expect(body.message).toEqual("Bad Request");
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
    test("Status: 400 if the vote change is not a number", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ inc_votes: "ERROR" })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Data entry error");
        });
    });
    test("Status: 404 if the url is not valid", () => {
      return request(app)
        .patch("/api/comments/ERROR")
        .send({ inc_votes: 10 })
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual("Comment ID not found!");
        });
    });
    test("Status: 400 if the object key is not valid", () => {
      return request(app)
        .patch("/api/comments/1")
        .send({ INVALIDKEY: 10 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Data entry error");
        });
    });
    test("Status: 400 if the comment is valid format but does not exist", () => {
      return request(app)
        .patch("/api/comments/99999")
        .send({ inc_votes: 1 })
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Comment ID Does Not Exist!");
        });
    });
  });
  describe("Delete Comment Errors", () => {
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
  describe("Retrieve user info by ID errors", () => {
    test("Status: 400, user is not found", () => {
      return request(app)
        .get("/api/users/ERROR")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("User does not exist");
        });
    });
  });
  describe("Delete Article Errors", () => {
    test("Status: 404, comment is not found", () => {
      return request(app)
        .delete("/api/articles/99999")
        .expect(404)
        .then(({ body }) => {
          expect(body.message).toEqual("Article not found");
        });
    });
    test("Status: 400, comment is invalid", () => {
      return request(app)
        .delete("/api/articles/ERROR")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Bad Request");
        });
    });
  });
  describe("Post New User Errors", () => {
    test("Status: 400, username is invalid", () => {
      return request(app)
        .post("/api/users/new")
        .send({ username: null, name: "Test User"})
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Please complete all fields");
        });
    });
    test("Status: 400, name is invalid", () => {
      return request(app)
        .post("/api/users/new")
        .send({ username: "Test", name: null})
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toEqual("Please complete all fields");
        });
    });
  });
});
