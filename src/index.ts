import { Color, getComplement } from "./cmath";

/**
 * Supported calculation algorithms
 */
export type Method = "W3C" | "Luminosity" | "LuminosityContrast";

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
export function getReadableComplement(color: Color, method: Method = "LuminosityContrast"): Color {
  const backgroundLuminosity = color.luminosity();
  let output = color;
  const minContrast = 0.65;
  let modifier = (color: Color) => {
    return new Color(
      Math.max(0, Math.round(color.r * 0.8)),
      Math.max(0, Math.round(color.g * 0.8)),
      Math.max(0, Math.round(color.b * 0.8)),
    )
  };

  if (backgroundLuminosity < 0.43) {
    modifier = (color: Color) => {
      return new Color(
        Math.min(255, Math.round(color.r * 1.2)),
        Math.min(255, Math.round(color.g * 1.2)),
        Math.min(255, Math.round(color.b * 1.2)),
      )
    };
  }
  output = modifier(color);
  // Prevent endless loops for colors where the conditions cannot be met and the
  // contrast will always be below the minimum contrast using a max-number of
  // iterations.
  let iterations = 0;
  while (Math.abs(backgroundLuminosity - output.luminosity()) < minContrast && iterations < 50 ) {
    output = modifier(output);
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
  return Math.abs(a.r - b.r) + Math.abs(a.g - b.g) + Math.abs(a.b - b.b);
}

export { Color };
