const request = require("supertest");
const { expect } = require("chai");

const app = require("../app");

describe("predict", function () {
  this.timeout(20 * 1000); // We're invoking a ml model in the background. That may take some time

  it("should respond with 400 if no json with data is submitted", async () => {
    await request(app).post("/predict").send({ a: 1 }).expect("Content-Type", /json/).expect(400);
  });

  it("should respond model timeout error if operation takes to long", async () => {
    await request(app)
      .post("/predict")
      .send({ data: 33 })
      .expect("Content-Type", /json/)
      .expect(500)
      .then((res) => expect(res.body.error).to.equal("model timeout"));
  });

  it("should respond with ice found if not timed out", async () => {
    await request(app)
      .post("/predict")
      .send({ data: 2 })
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => expect(res.body.ice_found).to.exist);
  });
});
