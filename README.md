# readable-color

The project provides a function to determine a color that - according to
established algorithms - should be easily readable on a given background.

Example use-case: You want to display text on a GUI element with an unknown
background color f.ex. if the user can pick the color or if the color is
generated from other values.

The project exposes four algorithms/methods:

- W3C (default if no method is specified): See
  http://www.w3.org/TR/AERT#color-contrast
- WCAG: See https://www.w3.org/WAI/WCAG22/Techniques/general/G18.html
- Luminosity: Simple 10% luminosity difference between foreground and background
- LuminosityContrast: See https://colorusage.arc.nasa.gov/luminance_cont.php

See demo at https://codepen.io/Michel-Albert/pen/eYxrXeG

The library shifts the "lightness" of the background-color until a readable
value is found. If none is found, it will stop at either "full-black" or
"full-white". This latter "cutoff" may lead to colors that are still unreadable
in edge-cases, depending on the chosen method.

NOTE: The best results have so far been achieved with the `W3C` and `WCAG`
methods. The others are still present for backwards-compatibility and
reference.

Example:

```javascript
import { getReadableColor } from "@exhuma/readable-color";

// Get a readable color with the default method.
const readableColor = getReadableColor("#123456");

// example using another method.
const anotherColor = getReadableColor("#123456", "WCAG");

const theElement = document.getElementById("my-element");
theElement.style.color = readableColor;
```

## Development

To install dependencies:

```bash
npm install
```

To build:

```bash
npm run build
```

To run a dev-server:

```bash
npm run dev
```

Then access: http://localhost:5173/src/index.html
