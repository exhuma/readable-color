import { Color, getComplement } from "./cmath";

/**
 * Supported calculation algorithms
 */
export type Method = "W3C" | "Luminosity" | "LuminosityContrast";

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

export { Color };
