import { assert, expect, test } from "vitest";
import { Color } from "../src/cmath";
import { isGoodColorMix, getReadableComplement, Method } from "../src/core";

test("isGoodColorMix", () => {
  const color1 = new Color(0, 0, 0);
  const color2 = new Color(255, 255, 255);
  expect(isGoodColorMix(color1, color2, "Luminosity")).toBe(true);
});

test("isGoodColorMix", () => {
  const color1 = new Color(0, 0, 0);
  const color2 = new Color(0, 0, 0);
  expect(isGoodColorMix(color1, color2, "Luminosity")).toBe(false);
});

test("isGoodColorMix LuminosityContrast", () => {
  const color1 = new Color(0, 0, 0);
  const color2 = new Color(255, 255, 255);
  expect(isGoodColorMix(color1, color2, "LuminosityContrast")).toBe(true);
});

test("isGoodColorMix W3C", () => {
  const color1 = new Color(0, 0, 0);
  const color2 = new Color(255, 255, 255);
  expect(isGoodColorMix(color1, color2, "W3C")).toBe(true);
});

function test_grc(
  input: Color,
  expected: Color,
  method: Method = "LuminosityContrast",
) {
  test(`getReadableComplement: ${method}`, () => {
    expect(getReadableComplement(input, method)).toEqual(expected);
  });
}

test_grc(new Color(10, 20, 30), new Color(200, 218, 237), "W3C");
test_grc(new Color(200, 200, 200), new Color(33, 33, 33), "W3C");
test_grc(new Color(10, 20, 30), new Color(30, 61, 91), "Luminosity");
test_grc(new Color(200, 200, 200), new Color(65, 65, 65), "Luminosity");
test_grc(new Color(10, 20, 30), new Color(200, 218, 237), "LuminosityContrast");
test_grc(new Color(200, 200, 200), new Color(0, 0, 0), "LuminosityContrast");
