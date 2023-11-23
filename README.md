# color-a11y

The project provides a function to determine a color that - according to
established algorithms - should be easily readable on a given background.

Example use-case: You want to display text on a GUI element with an unknown
background color f.ex. if the user can pick the color or if the color is
generated from other values.

**Important**: See https://github.com/exhuma/color-a11y/issues/1

Example:

```javascript
import { getReadableComplement } from '@exhuma/color-a11y';
import { Color } from "@exhuma/color-a11y/cmath";

// Create a "color" instance from red/green/blue components
var color = new Color(r, g, b);

// Determine the "readable" color
var complement = getReadableComplement(color);

// Set the text-color to the newly computed color
const swatch = document.getElementById("my-element");
swatch.style.color = complement.toHex();
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

This project was created using `bun init` in bun v1.0.14. [Bun](https://bun.sh)
is a fast all-in-one JavaScript runtime.
