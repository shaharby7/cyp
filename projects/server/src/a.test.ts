import { GetGreeting } from ".";

describe("GetGreeting", () => {
  it("should return a greeting message", () => {
    const name = "World";
    const expectedGreeting = `Hello ${name}!`;
    expect(GetGreeting(name)).toBe(expectedGreeting);
  });
});
