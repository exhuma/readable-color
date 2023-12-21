import { Color, getComplement } from "./cmath";

/**
 * Supported calculation algorithms
 */
export type Method = "W3C" | "Luminosity" | "LuminosityContrast" | "WCAG";

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
  method: Method,
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
      const diff = Math.abs(lum_a - lum_b);

      let l_star;
      if (diff <= 0.008856) {
        l_star = diff * 903.3;
      } else {
        l_star = Math.pow(diff, 1 / 3) * 116 - 16;
      }

      lum_n = 1.0;
      const delta = 116.0 * Math.pow(diff / lum_n, 1.0 / 3.0);
      return delta > 100.0;
    case "WCAG":
      return WCAGLuminosityRatio(color_a, color_b) >= 4.5;
  }
}

/**
 * Find the best complementary color for text readability.
 *
 * @param color A color
 * @return the "best" complementary color
 */
export function getReadableComplement(
  color: Color,
  method: Method = "LuminosityContrast",
): Color {
  const backgroundLuminosity = color.luminosity();
  let output = color;
  let [h, s, l] = color.hsl();
  // lightness must be at least 1 for the multipliers to work in the modifier
  l = Math.max(1, l);
  let modifier = (value: number) => Math.max(0, value * 0.8);
  if (backgroundLuminosity < 0.43) {
    modifier = (value: number) => Math.min(100, value * 1.2);
  }
  l = modifier(l);
  output = Color.fromHSL([h, s, l]);
  // Prevent endless loops for colors where the conditions cannot be met and the
  // contrast will always be below the minimum contrast using a max-number of
  // iterations.
  let iterations = 0;
  while (!isGoodColorMix(color, output, method) && iterations < 50) {
    l = modifier(l);
    output = Color.fromHSL([h, s, l]);
    iterations += 1;
  }
  return output;
}

/**
 * Color difference as defined <a href="http://www.w3.org/TR/AERT#color-contrast>by W3c</a>
 *
 * @param a First color
 * @param b Second color
 * @return
 */
export function W3CColorDifference(a: Color, b: Color): number {
  let output =
    Math.max(a.r, b.r) -
    Math.min(a.r, b.r) +
    (Math.max(a.g, b.g) - Math.min(a.g, b.g)) +
    (Math.max(a.b, b.b) - Math.min(a.b, b.b));
  return output;
}

/**
 * Calculate the WCAG contrast ratio between two colors
 *
 * @param a First color
 * @param b Second color
 * @returns The luminosiy ratio
 */
export function WCAGLuminosityRatio(a: Color, b: Color): number {
  const l1 = a.luminosity();
  const l2 = b.luminosity();
  const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
  return ratio;
}

export { Color };
