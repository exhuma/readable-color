/**
 * Collection of algoritms found on various places on the web.
 * Credit is given where I could find it.
 *
 * @author malbert
 */

export class Color {
  r = 0;
  g = 0;
  b = 0;
  constructor(r = 0, g = 0, b = 0) {
    this.r = r;
    this.g = g;
    this.b = b;
  }
  toHex(): string {
    var fragments = [this.r, this.g, this.b].map((value) => {
      var hexval = Math.round(value).toString(16);
      if (hexval.length < 2) {
        hexval = `0${hexval}`;
      }
      return hexval;
    });
    return `#${fragments.join("")}`;
  }

  /**
   * Convenience method to return a color given a HSL array;
   * @param hsl
   * @return
   */
  static fromHSL(hsl: [number, number, number]): Color {
    const rgb = hsl2rgb(hsl[0], hsl[1], hsl[2]);
    return new Color(rgb[0], rgb[1], rgb[2]);
  }

  /**
   * Creates an HSL array from a given color
   * @param color the input color
   * @param hsl the HSL triple
   */
  hsl() {
    return rgb2hsl(this.r, this.g, this.b);
  }

  /**
   * Returns the relative luminosity (luminance) of the given color. The value ranges from 0-255.
   * The weights were taken from http://en.wikipedia.org/wiki/Luminance_(relative)
   * Another, more authoritative reference mentioning these weights:
   * https://www.w3.org/WAI/WCAG22/Techniques/general/G18.html and
   * https://www.w3.org/TR/WCAG22/#dfn-relative-luminance
   *
   * @param color
   * @return
   */
  luminosity() {
    const rn = this.r / 255;
    const gn = this.g / 255;
    const bn = this.b / 255;
    return (
      0.2126 * Math.pow(rn, 2.2) +
      0.7152 * Math.pow(gn, 2.2) +
      0.0722 * Math.pow(bn, 2.2)
    );
  }
}

/**
 * Return the complementary color
 *
 * @return
 */
export function getComplement(input: Color): Color {
  let rgb: [number, number, number];
  const hsl = rgb2hsl(input.r, input.g, input.b);
  let new_hsl;
  if (input.r === input.g && input.g === input.b) {
    // TODO: Verify that 50 is a good fit here (might not have enough contrast)
    let new_l = hsl[2] + 50;
    if (new_l >= 100) {
      new_l -= 100;
    }
    new_hsl = [hsl[0], hsl[1], new_l];
  } else {
    let new_h = hsl[0] + 180;
    if (new_h >= 360) {
      new_h -= 360;
    }
    new_hsl = [new_h, hsl[1], hsl[2]];
  }
  rgb = hsl2rgb(new_hsl[0], new_hsl[1], new_hsl[2]);
  return new Color(rgb[0], rgb[1], rgb[2]);
}

/**
 * Convert RGB to HSL components H ranges from 0-360, S and L ranges from 0 to 100
 * @param r Red
 * @param g Green
 * @param b Blue
 * @param hsl This array will be assigned the HSL values (3 ints)
 */
export function rgb2hsl(
  r: number,
  g: number,
  b: number,
): [number, number, number] {
  const red = r / 255.0;
  const green = g / 255.0;
  const blue = b / 255.0;

  const min = Math.min(red, Math.min(green, blue));
  const max = Math.max(red, Math.max(green, blue));

  const delta = max - min;

  let h = 0;
  let s: number;
  let l: number;

  l = (max + min) / 2.0;

  if (delta == 0) {
    h = 0;
    s = 0;
  } else {
    if (l < 0.5) {
      s = delta / (max + min);
    } else {
      s = delta / (2 - max - min);
    }

    const delta_r = ((max - red) / 6.0 + delta / 2.0) / delta;
    const delta_g = ((max - green) / 6.0 + delta / 2.0) / delta;
    const delta_b = ((max - blue) / 6.0 + delta / 2.0) / delta;

    if (red == max) {
      h = delta_b - delta_g;
    } else if (green == max) {
      h = 1 / 3.0 + delta_r - delta_b;
    } else if (blue == max) {
      h = 2 / 3.0 + delta_g - delta_r;
    }
    if (h < 0) {
      h += 1;
    }
    if (h > 1) {
      h -= 1;
    }
  }
  return [Math.round(360 * h), Math.round(s * 100), Math.round(l * 100)];
}

/**
 * Convert HSL values to RGB
 *
 * @param h
 * @param s
 * @param x
 * @param rgb This array will be assigned the RGB values (3 ints)
 */

export function hsl2rgb(
  h: number,
  s: number,
  l: number,
): [number, number, number] {
  const hue = h / 360.0;
  const saturation = s / 100.0;
  const lightness = l / 100.0;
  let r: number;
  let g: number;
  let b: number;
  let tmp1: number;
  let tmp2: number;

  if (saturation == 0) {
    r = lightness * 255.0;
    g = lightness * 255.0;
    b = lightness * 255.0;
  } else {
    if (lightness < 0.5) {
      tmp2 = lightness * (1 + saturation);
    } else {
      tmp2 = lightness + saturation - saturation * lightness;
    }

    tmp1 = 2 * lightness - tmp2;

    r = 255 * hue2rgb(tmp1, tmp2, hue + 1.0 / 3.0);
    g = 255 * hue2rgb(tmp1, tmp2, hue);
    b = 255 * hue2rgb(tmp1, tmp2, hue - 1.0 / 3.0);
  }

  return [Math.round(r), Math.round(g), Math.round(b)];
}

/**
 * Convert a hue value into the appropriate RGB value
 * @see <a href="http://www.easyrgb.com/index.php?X=MATH&H=19#text19">EasyRGB</a>
 *
 * @param v1 ?
 * @param v2 ?
 * @param vH ?
 * @return
 */
export function hue2rgb(v1: number, v2: number, vH: number): number {
  if (vH < 0) {
    vH += 1;
  }
  if (vH > 1) {
    vH -= 1;
  }
  if (6.0 * vH < 1) {
    return v1 + (v2 - v1) * 6.0 * vH;
  }
  if (2.0 * vH < 1) {
    return v2;
  }
  if (3.0 * vH < 2) {
    return v1 + (v2 - v1) * (2.0 / 3.0 - vH) * 6;
  }
  return v1;
}
