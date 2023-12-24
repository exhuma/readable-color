# readable-color

The project provides a function to determine a color that - according to
established algorithms - should be easily readable on a given background.

Example use-case: You want to display text on a GUI element with an unknown
background color f.ex. if the user can pick the color or if the color is
generated from other values.

**Important**: See https://github.com/exhuma/readable-color/issues/1

See demo at https://codepen.io/Michel-Albert/pen/eYxrXeG

Example:

```javascript
import { getReadableColor } from "@exhuma/readable-color";
import { Color } from "@exhuma/readable-color/cmath";

// Create a "color" instance from red/green/blue components
var color = new Color(r, g, b);

// Determine the "readable" color
var complement = getReadableColor(color);

// Set the text-color to the newly computed color
const swatch = document.getElementById("my-element");
swatch.style.color = complement.hex;
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
