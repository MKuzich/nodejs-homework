const authController = require("../controller/authController");
const authService = require("../services/authService");

const user = {
  token: "validtoken",
  email: "validemail@gmail.com",
  subscription: "valid subscription",
};

describe("signUpController tests", () => {
  it("Should be 201 OK response", async () => {
    const next = jest.fn((data) => data);
    authService.signUp = jest.fn(() => user);
    const req = {
      body: { email: "validemail@gmail.com", password: "validpassword" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => data),
    };
    const result = await authController.signUpController(req, res, next);

    expect(result.code).toBe(201);
  });
  it("Answer should have token", async () => {
    const next = jest.fn((data) => data);
    authService.signUp = jest.fn(() => user);
    const req = {
      body: { email: "validemail@gmail.com", password: "validpassword" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => data),
    };
    const result = await authController.signUpController(req, res, next);

    expect(result.token).toBeDefined();
  });
  it("Answer should have user with 2 fields email and subscription, it shoul be strings", async () => {
    const next = jest.fn((data) => data);
    authService.signUp = jest.fn(() => user);
    const req = {
      body: { email: "validemail@gmail.com", password: "validpassword" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn((data) => data),
    };
    const result = await authController.signUpController(req, res, next);
    expect(typeof result.user.email).toBe("string");
    expect(typeof result.user.subscription).toBe("string");
  });
});
