import { Method, getReadableColor } from "../src";
import { Color } from "../src/cmath";

const ELEMENT_ID_NAMES = ["Red", "Green", "Blue"];
let GRAYSCALE = false;

function rgbToHex(rgb: [number, number, number]): string {
  return rgb
    .map((value) => {
      var hexval = Math.round(value).toString(16);
      if (hexval.length < 2) {
        hexval = `0${hexval}`;
      }
      return hexval;
    })
    .join("");
}

function setRandomColor(method: string, bgElement: HTMLElement) {
  autoState.innerHTML = auto ? "On" : "Off";
  if (!auto) {
    return;
  }
  const rgb = [0, 0, 0].map(() => {
    return Math.round(Math.random() * 255);
  }) as [number, number, number];
  var bgHex = rgbToHex(rgb);
  rgb.map((value, index) => {
    var sliderName = `Slider${ELEMENT_ID_NAMES[index]}`;
    var slider = _findOne(sliderName) as HTMLInputElement;
    slider.value = `${value}`;
  });
  var complement = getReadableColor(rgbToHex(rgb), method as Method);
  bgElement.style.backgroundColor = `#${bgHex}`;
  bgElement.style.color = complement;
}

export function initUI() {
  var swatch = _findOne("Swatch");
  let method = "W3C";
  window.setInterval(() => setRandomColor(method, swatch), 1000);
  setColor(method);
  ELEMENT_ID_NAMES.map((name) => {
    _findOne(`Slider${name}`).addEventListener("input", () => setColor(method));
    _findOne(`Sub${name}`).addEventListener("click", decrementor(name, method));
    _findOne(`Add${name}`).addEventListener("click", incrementor(name, method));
  });
  _findOne("MethodDropDown").addEventListener("change", (evt) => {
    const elmt = evt.target as HTMLInputElement | null;
    method = elmt?.value ?? "Luminosity";
    setColor(method);
  });
}

function _findOne(name: string): HTMLElement {
  const maybe = document.getElementById(name);
  if (!maybe) {
    throw new Error(`No element found with ID ${name}`);
  }
  return maybe;
}

function setGrayscale(activeSlider: HTMLInputElement, state: boolean) {
  let lightness = activeSlider.value;
  ELEMENT_ID_NAMES.slice(1).map((name) => {
    let elmt = _findOne(`Slider${name}`) as HTMLInputElement;
    elmt.disabled = state;
    elmt.value = lightness;
    let subElement = _findOne(`Sub${name}`) as HTMLInputElement;
    subElement.disabled = state;
    let addElement = _findOne(`Add${name}`) as HTMLInputElement;
    addElement.disabled = state;
  });
}

function incrementor(name: string, method: string) {
  return () => {
    const slider = _findOne(`Slider${name}`) as HTMLInputElement;
    slider.value = `${Number.parseInt(slider.value) + 1}`;
    setColor(method);
  };
}
function decrementor(name: string, method: string) {
  return () => {
    const slider = document.getElementById(`Slider${name}`) as HTMLInputElement;
    slider.value = `${Number.parseInt(slider.value) - 1}`;
    setColor(method);
  };
}

function setColor(method: string = "Luminosity") {
  var rgb = ELEMENT_ID_NAMES.map((name) => {
    var slider = _findOne(`Slider${name}`) as HTMLInputElement;
    const value = Number.parseInt(slider.value);
    const valueDisplay = _findOne(`${name}Value`);
    valueDisplay.innerHTML = `${value}`;
    return value;
  });
  if (GRAYSCALE) {
    rgb = [rgb[0], rgb[0], rgb[0]];
    ELEMENT_ID_NAMES.map((name) => {
      var slider = _findOne(`Slider${name}`) as HTMLInputElement;
      slider.value = `${rgb[0]}`;
    });
  }
  var bgHex = rgb.map((value) => {
    var hexval = Math.round(value).toString(16);
    if (hexval.length < 2) {
      hexval = `0${hexval}`;
    }
    return hexval;
  });
  const swatch = _findOne("Swatch");
  var bgColor = new Color(...rgb);
  var fgColor = getReadableColor(bgColor, method as Method);
  swatch.style.backgroundColor = `#${bgHex.join("")}`;
  swatch.style.color = fgColor.hex;
  _findOne("BGLuminance").innerHTML = bgColor.luminosity().toFixed(4);
  _findOne("FGLuminance").innerHTML = fgColor.luminosity().toFixed(4);
  _findOne("BGColor").innerHTML = bgColor.hex;
  _findOne("FGColor").innerHTML = fgColor.hex;
  _findOne("LuminanceDiff").innerHTML = Math.abs(
    fgColor.luminosity() - bgColor.luminosity(),
  ).toFixed(4);
}

let auto = false;
var autoButton = _findOne("ButtonAuto");
autoButton.addEventListener("click", () => {
  auto = !auto;
  if (auto) {
    var linkSliders = _findOne("LinkSlidersToggle") as HTMLInputElement;
    linkSliders.checked = false;
  }
});

var autoState = _findOne("AutoState");

var linkSliders = _findOne("LinkSlidersToggle");
linkSliders.addEventListener("input", (event) => {
  const checkbox = event.target as HTMLInputElement | null;
  GRAYSCALE = checkbox?.checked ?? false;
  const linkSlider = _findOne(
    `Slider${ELEMENT_ID_NAMES[0]}`,
  ) as HTMLInputElement;
  setGrayscale(linkSlider, GRAYSCALE);
});
