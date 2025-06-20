import { GetGreeting } from ".";

describe("GetGreeting", () => {
  it("should return a greeting message", () => {
    const name = "shahar";
    const expectedGreeting = `Hello ${name}!`;
    expect(GetGreeting(name)).toBe(expectedGreeting);
  });
});
