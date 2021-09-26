const request = require("supertest");
const Url = require("../models/Url.model");
const app = require("../index");

describe("POST /addUrl", () => {
  describe("url shortening", () => {
    test("should respond with a status code 200", async () => {
      const response = await request(app).post("/addurl").send({
        url: "https://www.youtube.com/",
        slug: "fd_44-gf",
      });

      expect(response.statusCode).toBe(200);
    });

    test("should return status 200 if url has already been shortened", async () => {
      const response = await Url.findOne({ url: "https://www.youtube.com/" });

      expect(response.url).toBe("https://www.youtube.com/");
    });

    test("should return status 400 if slug contains invalid characters", async () => {
      const response = await await request(app).post("/addurl").send({
        slug: "fd_4$4-g&f",
      });

      expect(response.statusCode).toBe(403);
    });

    test("should return status 200 if url is not passed or invalid url is passed", async () => {
      const response = await request(app).post("/addUrl");
      
      expect(response.statusCode).toBe(403);
    });

    test("should specify json in the content type header", async () => {
      const response = await request(app).post("/addUrl").send({
        url: "https://translate.google.ru/",
        slug: "fd_44-gf",
      });

      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });
});

describe("GET /slug", () => {
  test("should return status 400 if url is not found in the database", async () => {
    const response = await request(app).get("/daaw_-");

    expect(response.statusCode).toBe(400);
  });
  test("Should return status 200 if the shortened url is in the database", async () => {
    const findUrls = await Url.find();
    for (let i = 0; i < findUrls.length; i++) {
      const response = await request(app).get(`/${findUrls[i].slug}`);

      expect(response.statusCode).toBe(302);
    }
  });
});
