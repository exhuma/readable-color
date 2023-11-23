import { Color, getComplement } from "./cmath";

/**
 * Supported calculation algorithms
 */
type Method = "W3C" | "Luminosity" | "LuminosityContrast";

/**
 * Determines whether two colors are considered readable if one of them is
 * the background, the other the foreground.
 *
 * @param color_a The first color
 * @param color_b The second color
 * @param method The method used to calculate the difference score
 * @return true if the colors are a good mix, false otherwise
 */
export function isGoodColorMix(
  color_a: Color,
  color_b: Color,
  method: Method
): boolean {
  let lum_a;
  let lum_b;
  let lum_n;
  switch (method) {
    default:
    case "W3C":
      return W3CColorDifference(color_a, color_b) >= 500;
    case "Luminosity":
      lum_a = color_a.luminosity();
      lum_b = color_b.luminosity();
      const ratio = Math.min(lum_a, lum_b) / Math.max(lum_a, lum_b);
      return ratio <= 1.0 / 10.0;
    case "LuminosityContrast":
      lum_a = color_a.luminosity();
      lum_b = color_b.luminosity();
      lum_n = 255.0;
      const delta =
        116.0 * Math.pow(Math.abs(lum_a - lum_b) / lum_n, 1.0 / 3.0);
      return delta > 100.0;
  }
}

/**
 * Find the best complementary color for text readability.
 *
 * @param color A color
 * @return the "best" complementary color
 */
export function getReadableComplement(color: Color): Color {
  let complement = getComplement(color);
  const textHSL = complement.hsl();
  const lumin = color.luminosity();

  while (
    !isGoodColorMix(color, complement, "LuminosityContrast") &&
    textHSL[2] < 100 &&
    textHSL[2] > 0
  ) {
    if (lumin < 128.0) {
      textHSL[2] += 1;
    } else {
      textHSL[2] -= 1;
    }
    complement = Color.fromHSL(textHSL);
  }
  return complement;
}

/**
 * Color difference as defined <a href="http://www.w3.org/TR/AERT#color-contrast>by W3c</a>
 *
 * @param a First color
 * @param b Second color
 * @return
 */
export function W3CColorDifference(a: Color, b: Color): number {
  return Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
}

export { Color };
