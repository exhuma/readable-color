import { assert, expect, test } from "vitest";
import { Color, getComplement, hsl2rgb, rgb2hsl } from "../src/cmath";

type TColor = {
  hex: string;
  rgb: [number, number, number];
  hsl: [number, number, number];
};

const colors: TColor[] = [
  { hex: "#123456", rgb: [18, 51, 86], hsl: [210, 65.0, 20.4] },
  { hex: "#000000", rgb: [0, 0, 0], hsl: [0, 0, 0] },
  { hex: "#ffffff", rgb: [255, 255, 255], hsl: [0, 0, 100] },
];

[0, 50, 128, 130, 255].map((r) => {
  [0, 50, 128, 130, 255].map((g) => {
    [0, 50, 128, 130, 255].map((b) => {
      test(`testComplementIsDifferent ${r}, ${g}, ${b}`, () => {
        const color = new Color(r, g, b);
        const complement = getComplement(color);
        expect([complement.r, complement.g, complement.b]).not.toEqual([
          r,
          g,
          b,
        ]);
      });
    });
  });
});

test("getComplement", () => {
  const result = new Color(10, 101, 200);
  const expected = new Color(199, 108, 10);
  expect(getComplement(result)).toEqual(expected);
});

function test_conversions(color: TColor) {
  test(`RGB to HSL: ${color.rgb} -> ${color.hsl}`, () => {
    const result = rgb2hsl(...color.rgb);
    result.map((value, index) =>
      expect(value / 100).toBeCloseTo(color.hsl[index] / 100, 1)
    );
  });
  test(`HSL to RGB: ${color.hsl} -> ${color.rgb}`, () => {
    const result = hsl2rgb(...color.hsl);
    result.map((value, index) =>
      expect(value / 100).toBeCloseTo(color.rgb[index] / 100, 1)
    );
  });
  test(`HSL to RGB to HSL: ${color.hsl} -> ${color.rgb} -> ${color.hsl}`, () => {
    const result = rgb2hsl(...hsl2rgb(...color.hsl)).map((value) => value);
    result.map((value, index) =>
      expect(value / 100).toBeCloseTo(color.hsl[index] / 100, 1)
    );
  });
  test(`RGB to HSL to RGB: ${color.rgb} -> ${color.hsl} -> ${color.rgb}`, () => {
    const result = hsl2rgb(...rgb2hsl(...color.rgb)).map((value) => value);
    result.map((value, index) =>
      expect(value / 100).toBeCloseTo(color.rgb[index] / 100, 1)
    );
  });
}

colors.map(test_conversions);
