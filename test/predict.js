const request = require("supertest");
const { expect } = require("chai");

const app = require("../app");

describe("predict", function () {
  this.timeout(10 * 1000); // We're invoking a ml model in the background. That may take some time

  it("should respond with 400 if no number array was transmitted", () => {
    return request(app).post("/predict").send({ payload: 1 }).expect("Content-Type", /json/).expect(400);
  });

  it("should respond with 200 and response of model", () => {
    return request(app)
      .post("/predict")
      .send([1, 2, 3, 4])
      .expect("Content-Type", /json/)
      .expect(200)
      .then((res) => expect(res.body.ice_found).to.exist);
  });
});
