const {
  fahrenheitToCelsius,
  celsiusToFahrenheit,
} = require("../playground/math");

it("it should convert the farheite 32 to the celsius 0", () => {
  expect(fahrenheitToCelsius(32)).toBe(0);
});
it("it should convert the celsius to the farheite", () => {
  expect(celsiusToFahrenheit(0)).toBe(32);
});
