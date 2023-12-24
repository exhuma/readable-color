/**
 * This module contains tests that ensure that we have an easy-to-use external
 * API
 */

import { expect, test } from "vitest";
import { getReadableColor, Method } from "../src";

test("default method", () => {
  const result = getReadableColor("#123456");
  expect(typeof result).toBe("string");
  expect(result[0]).toEqual("#");
  expect(result.length).toEqual(7);
});

function testMethod(method: Method) {
  test(`specific method ${method}`, () => {
    const result = getReadableColor("#123456", method);
    expect(typeof result).toBe("string");
    expect(result[0]).toEqual("#");
    expect(result.length).toEqual(7);
  });
}

testMethod("Luminosity");
testMethod("LuminosityContrast");
testMethod("W3C");
testMethod("WCAG");
