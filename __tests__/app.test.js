const request = require("supertest");
const app = require("../app");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data");

// beforeEach(() => {
//   return seed(data);
// });

describe("GET /api/topics", () => {
  test("Status: 200", () => {
    return request(app).get("/api/topics").expect(200);
  });
  test("Status: 200, returns array of 3 test objects", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveLength(3);
      });
  });
  test("Status: 404, returns url not found message", () => {
    return request(app)
      .get("/api/NOT-A-VALID-URL")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toEqual("Invalid URL Passed");
      });
  });
});
