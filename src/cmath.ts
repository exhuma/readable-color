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
   *
   * @param color
   * @return
   */
  luminosity() {
    return 0.2126 * this.r + 0.7152 * this.g + 0.0722 * this.b;
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
  let new_h = hsl[0] + 180;
  if (new_h >= 360) {
    new_h -= 360;
  }
  rgb = hsl2rgb(new_h, hsl[1], hsl[2]);
  try {
    return new Color(rgb[0], rgb[1], rgb[2]);
  } catch (error) {
    console.error(error);
    return new Color(0, 0, 0);
  }
}

/**
 * Convert RGB to HSL components H ranges from 0-360, S and L ranges from 0 to 100
 * @param r Red
 * @param g Green
 * @param b Blue
 * @param hsl This array will be assigned the HSL values (3 ints)
 */
export function rgb2hsl(r: number, g: number, b: number): [number, number, number] {
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

export function hsl2rgb(h: number, s: number, l: number): [number, number, number] {
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

// ######################################################################
// The following code has been nicked from
// http://www.f4.fhtw-berlin.de/~barthel/ImageJ/ColorInspector//HTMLHelp/farbraumJava.htm
// They will be adapted to be more usable
export function rgb2ycbcr(r: number, g: number, b: number): number[] {
  const y = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
  const cb = Math.floor(-0.16874 * r - 0.33126 * g + 0.5 * b);
  const cr = Math.floor(0.5 * r - 0.41869 * g - 0.08131 * b);
  return [y, cb, cr];
}

export function rgb2yuv(r: number, g: number, b: number): number[] {
  const y = Math.floor(0.299 * r + 0.587 * g + 0.114 * b);
  const u = Math.floor((b - y) * 0.492);
  const v = Math.floor((r - y) * 0.877);
  return [y, u, v];
}

export function rgb2hsb(r: number, g: number, b: number): number[] {
  throw new Error("Not yet implemented");
}

// TODO void rgb2hmmd(int r, int g, int b, int[] hmmd) {
// TODO
// TODO     float max = (int) Math.max(Math.max(r, g), Math.max(g, b));
// TODO     float min = (int) Math.min(Math.min(r, g), Math.min(g, b));
// TODO     float diff = (max - min);
// TODO     float sum = (float) ((max + min) / 2.);
// TODO
// TODO     float hue = 0;
// TODO     if (diff == 0) {
// TODO         hue = 0;
// TODO     } else if (r == max && (g - b) > 0) {
// TODO         hue = 60 * (g - b) / (max - min);
// TODO     } else if (r == max && (g - b) <= 0) {
// TODO         hue = 60 * (g - b) / (max - min) + 360;
// TODO     } else if (g == max) {
// TODO         hue = (float) (60 * (2. + (b - r) / (max - min)));
// TODO     } else if (b == max) {
// TODO         hue = (float) (60 * (4. + (r - g) / (max - min)));
// TODO     }
// TODO
// TODO     hmmd[0] = (int) (hue);
// TODO     hmmd[1] = (int) (max);
// TODO     hmmd[2] = (int) (min);
// TODO     hmmd[3] = (int) (diff);
// TODO }

// TODO private void rgb2hsv(int r, int g, int b, int hsv[]) {
//
// TODO     int min;    //Min. value of RGB
// TODO     int max;    //Max. value of RGB
// TODO     int delMax; //Delta RGB value
//
// TODO     if (r > g) {
// TODO         min = g;
// TODO         max = r;
// TODO     } else {
// TODO         min = r;
// TODO         max = g;
// TODO     }
// TODO     if (b > max) {
// TODO         max = b;
// TODO     }
// TODO     if (b < min) {
// TODO         min = b;
// TODO     }
//
// TODO     delMax = max - min;
//
// TODO     float H = 0, S;
// TODO     float V = max;
//
// TODO     if (delMax == 0) {
// TODO         H = 0;
// TODO         S = 0;
// TODO     } else {
// TODO         S = delMax / 255f;
// TODO         if (r == max) {
// TODO         H = ((g - b) / (float) delMax) * 60;
// TODO         } else if (g == max) {
// TODO         H = (2 + (b - r) / (float) delMax) * 60;
// TODO         } else if (b == max) {
// TODO         H = (4 + (r - g) / (float) delMax) * 60;
// TODO         }
// TODO     }
//
// TODO     hsv[0] = (int) (H);
// TODO     hsv[1] = (int) (S * 100);
// TODO     hsv[2] = (int) (V * 100);
// TODO }

// TODO public void rgb2xyY(int R, int G, int B, int[] xyy) {
// TODO     //http://www.brucelindbloom.com
// TODO
// TODO     float rf, gf, bf;
// TODO     float r, g, b, X, Y, Z;
// TODO
// TODO     // RGB to XYZ
// TODO     r = R / 255.f; //R 0..1
// TODO     g = G / 255.f; //G 0..1
// TODO     b = B / 255.f; //B 0..1
// TODO
// TODO     if (r <= 0.04045) {
// TODO         r = r / 12;
// TODO     } else {
// TODO         r = (float) Math.pow((r + 0.055) / 1.055, 2.4);
// TODO     }
// TODO
// TODO     if (g <= 0.04045) {
// TODO         g = g / 12;
// TODO     } else {
// TODO         g = (float) Math.pow((g + 0.055) / 1.055, 2.4);
// TODO     }
// TODO
// TODO     if (b <= 0.04045) {
// TODO         b = b / 12;
// TODO     } else {
// TODO         b = (float) Math.pow((b + 0.055) / 1.055, 2.4);
// TODO     }
// TODO
// TODO     X = 0.436052025f * r + 0.385081593f * g + 0.143087414f * b;
// TODO     Y = 0.222491598f * r + 0.71688606f * g + 0.060621486f * b;
// TODO     Z = 0.013929122f * r + 0.097097002f * g + 0.71418547f * b;
// TODO
// TODO     float x;
// TODO     float y;
// TODO
// TODO     float sum = X + Y + Z;
// TODO     if (sum != 0) {
// TODO         x = X / sum;
// TODO         y = Y / sum;
// TODO     } else {
// TODO         float Xr = 0.964221f;  // reference white
// TODO         float Yr = 1.0f;
// TODO         float Zr = 0.825211f;
// TODO
// TODO         x = Xr / (Xr + Yr + Zr);
// TODO         y = Yr / (Xr + Yr + Zr);
// TODO     }
// TODO
// TODO     xyy[0] = (int) (255 * x + .5);
// TODO     xyy[1] = (int) (255 * y + .5);
// TODO     xyy[2] = (int) (255 * Y + .5);
// TODO
// TODO }

// TODO public void rgb2xyz(int R, int G, int B, int[] xyz) {
// TODO     float rf, gf, bf;
// TODO     float r, g, b, X, Y, Z;
// TODO
// TODO     r = R / 255.f; //R 0..1
// TODO     g = G / 255.f; //G 0..1
// TODO     b = B / 255.f; //B 0..1
// TODO
// TODO     if (r <= 0.04045) {
// TODO         r = r / 12;
// TODO     } else {
// TODO         r = (float) Math.pow((r + 0.055) / 1.055, 2.4);
// TODO     }
// TODO
// TODO     if (g <= 0.04045) {
// TODO         g = g / 12;
// TODO     } else {
// TODO         g = (float) Math.pow((g + 0.055) / 1.055, 2.4);
// TODO     }
// TODO
// TODO     if (b <= 0.04045) {
// TODO         b = b / 12;
// TODO     } else {
// TODO         b = (float) Math.pow((b + 0.055) / 1.055, 2.4);
// TODO     }
// TODO
// TODO     X = 0.436052025f * r + 0.385081593f * g + 0.143087414f * b;
// TODO     Y = 0.222491598f * r + 0.71688606f * g + 0.060621486f * b;
// TODO     Z = 0.013929122f * r + 0.097097002f * g + 0.71418547f * b;
// TODO
// TODO     xyz[1] = (int) (255 * Y + .5);
// TODO     xyz[0] = (int) (255 * X + .5);
// TODO     xyz[2] = (int) (255 * Z + .5);
// TODO }

// TODO public void rgb2lab(int R, int G, int B, int[] lab) {
// TODO     //http://www.brucelindbloom.com
// TODO
// TODO     float r, g, b, X, Y, Z, fx, fy, fz, xr, yr, zr;
// TODO     float Ls, as, bs;
// TODO     float eps = 216.f / 24389.f;
// TODO     float k = 24389.f / 27.f;
// TODO
// TODO     float Xr = 0.964221f;  // reference white D50
// TODO     float Yr = 1.0f;
// TODO     float Zr = 0.825211f;
// TODO
// TODO     // RGB to XYZ
// TODO     r = R / 255.f; //R 0..1
// TODO     g = G / 255.f; //G 0..1
// TODO     b = B / 255.f; //B 0..1
// TODO
// TODO     // assuming sRGB (D65)
// TODO     if (r <= 0.04045) {
// TODO         r = r / 12;
// TODO     } else {
// TODO         r = (float) Math.pow((r + 0.055) / 1.055, 2.4);
// TODO     }
// TODO
// TODO     if (g <= 0.04045) {
// TODO         g = g / 12;
// TODO     } else {
// TODO         g = (float) Math.pow((g + 0.055) / 1.055, 2.4);
// TODO     }
// TODO
// TODO     if (b <= 0.04045) {
// TODO         b = b / 12;
// TODO     } else {
// TODO         b = (float) Math.pow((b + 0.055) / 1.055, 2.4);
// TODO     }
// TODO
// TODO
// TODO     X = 0.436052025f * r + 0.385081593f * g + 0.143087414f * b;
// TODO     Y = 0.222491598f * r + 0.71688606f * g + 0.060621486f * b;
// TODO     Z = 0.013929122f * r + 0.097097002f * g + 0.71418547f * b;
// TODO
// TODO     // XYZ to Lab
// TODO     xr = X / Xr;
// TODO     yr = Y / Yr;
// TODO     zr = Z / Zr;
// TODO
// TODO     if (xr > eps) {
// TODO         fx = (float) Math.pow(xr, 1 / 3.);
// TODO     } else {
// TODO         fx = (float) ((k * xr + 16.) / 116.);
// TODO     }
// TODO
// TODO     if (yr > eps) {
// TODO         fy = (float) Math.pow(yr, 1 / 3.);
// TODO     } else {
// TODO         fy = (float) ((k * yr + 16.) / 116.);
// TODO     }
// TODO
// TODO     if (zr > eps) {
// TODO         fz = (float) Math.pow(zr, 1 / 3.);
// TODO     } else {
// TODO         fz = (float) ((k * zr + 16.) / 116);
// TODO     }
// TODO
// TODO     Ls = (116 * fy) - 16;
// TODO     as = 500 * (fx - fy);
// TODO     bs = 200 * (fy - fz);
// TODO
// TODO     lab[0] = (int) (2.55 * Ls + .5);
// TODO     lab[1] = (int) (as + .5);
// TODO     lab[2] = (int) (bs + .5);
// TODO }

// TODO public void rgb2luv(int R, int G, int B, int[] luv) {
// TODO     //http://www.brucelindbloom.com
// TODO
// TODO     float rf, gf, bf;
// TODO     float r, g, b, X_, Y_, Z_, X, Y, Z, fx, fy, fz, xr, yr, zr;
// TODO     float L;
// TODO     float eps = 216.f / 24389.f;
// TODO     float k = 24389.f / 27.f;
// TODO
// TODO     float Xr = 0.964221f;  // reference white D50
// TODO     float Yr = 1.0f;
// TODO     float Zr = 0.825211f;
// TODO
// TODO     // RGB to XYZ
// TODO
// TODO     r = R / 255.f; //R 0..1
// TODO     g = G / 255.f; //G 0..1
// TODO     b = B / 255.f; //B 0..1
// TODO
// TODO     // assuming sRGB (D65)
// TODO     if (r <= 0.04045) {
// TODO         r = r / 12;
// TODO     } else {
// TODO         r = (float) Math.pow((r + 0.055) / 1.055, 2.4);
// TODO     }
// TODO
// TODO     if (g <= 0.04045) {
// TODO         g = g / 12;
// TODO     } else {
// TODO         g = (float) Math.pow((g + 0.055) / 1.055, 2.4);
// TODO     }
// TODO
// TODO     if (b <= 0.04045) {
// TODO         b = b / 12;
// TODO     } else {
// TODO         b = (float) Math.pow((b + 0.055) / 1.055, 2.4);
// TODO     }
// TODO
// TODO
// TODO     X = 0.436052025f * r + 0.385081593f * g + 0.143087414f * b;
// TODO     Y = 0.222491598f * r + 0.71688606f * g + 0.060621486f * b;
// TODO     Z = 0.013929122f * r + 0.097097002f * g + 0.71418547f * b;
// TODO
// TODO     // XYZ to Luv
// TODO
// TODO     float u, v, u_, v_, ur_, vr_;
// TODO
// TODO     u_ = 4 * X / (X + 15 * Y + 3 * Z);
// TODO     v_ = 9 * Y / (X + 15 * Y + 3 * Z);
// TODO
// TODO     ur_ = 4 * Xr / (Xr + 15 * Yr + 3 * Zr);
// TODO     vr_ = 9 * Yr / (Xr + 15 * Yr + 3 * Zr);
// TODO
// TODO     yr = Y / Yr;
// TODO
// TODO     if (yr > eps) {
// TODO         L = (float) (116 * Math.pow(yr, 1 / 3.) - 16);
// TODO     } else {
// TODO         L = k * yr;
// TODO     }
// TODO
// TODO     u = 13 * L * (u_ - ur_);
// TODO     v = 13 * L * (v_ - vr_);
// TODO
// TODO     luv[0] = (int) (2.55 * L + .5);
// TODO     luv[1] = (int) (u + .5);
// TODO     luv[2] = (int) (v + .5);
// TODO }
