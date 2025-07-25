export function ButtonBorderColorPalateToggle(
  themeColors,
  selectedElement,
  saveButtonModifications,
  addPendingModification,
  showNotification
) {
  const palette = document.getElementById("button-border-color-palette");
  const container = document.getElementById("button-border-colors-palette");
  const selectorField = document.getElementById(
    "button-border-color-selection-field"
  );
  const bullet = document.getElementById("button-border-color-selection-bar");
  const colorCode = document.getElementById("button-border-color-code");
  const transparencyCount = document.getElementById(
    "button-border-color-transparency-count"
  );
  const allColorField = document.getElementById(
    "button-border-color-all-color-selction-field"
  );
  const allColorBullet = document.getElementById(
    "button-border-color-all-color-selction-bar"
  );
  const transparencyField = document.getElementById(
    "button-border-color-transparency-field"
  );
  const transparencyBullet = document.getElementById(
    "button-border-color-transparency-bar"
  );

  if (
    !palette ||
    !container ||
    !selectorField ||
    !bullet ||
    !colorCode ||
    !transparencyCount
  )
    return;

  let dynamicHue = 0;
  let currentTransparency = 100;

  // Function to apply border color to button
  function applyButtonBorderColor(color, alpha = 1) {
    const currentElement = selectedElement?.();
    if (!currentElement) return;

    const buttonTypes = [
      "sqs-button-element--primary",
      "sqs-button-element--secondary",
      "sqs-button-element--tertiary",
    ];

    let buttonType = null;
    for (let type of buttonTypes) {
      if (currentElement.querySelector(`a.${type}`)) {
        buttonType = type;
        break;
      }
    }

    if (!buttonType) {
      console.warn("⚠️ No Squarespace button found in block.");
      return;
    }

    const rgbaColor = color.startsWith("rgb(")
      ? color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
      : color;

    const styleId = `sc-border-style-global-${buttonType}`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = `
      a.${buttonType},
      button.${buttonType} {
        border-color: ${rgbaColor} !important;
      }
      a.${buttonType}:hover,
      button.${buttonType}:hover {
        border-color: ${rgbaColor} !important;
      }
    `;

    const allButtons = currentElement.querySelectorAll(
      `a.${buttonType}, button.${buttonType}`
    );
    allButtons.forEach((btn) => {
      btn.dataset.scButtonBorderColor = color;
    });
    console.log("🖌️ APPLYING BORDER COLOR:", rgbaColor, "on", buttonType);

    // Save modifications if functions are provided
    if (
      typeof saveButtonModifications === "function" &&
      typeof addPendingModification === "function"
    ) {
      const blockId = currentElement.id;
      if (blockId) {
        const stylePayload = {
          buttonPrimary: {
            selector: `.${buttonType}`,
            styles: { borderColor: rgbaColor },
          },
        };
        addPendingModification(blockId, stylePayload, "button");
        if (showNotification) {
          showNotification(`Border color applied to ${buttonType}`, "success");
        }
      }
    }
  }

  if (allColorField) {
    allColorField.style.background = `linear-gradient(to bottom,
        hsl(0, 100%, 50%),
        hsl(60, 100%, 50%),
        hsl(120, 100%, 50%),
        hsl(180, 100%, 50%),
        hsl(240, 100%, 50%),
        hsl(300, 100%, 50%),
        hsl(360, 100%, 50%)
      )`;
  }

  if (transparencyField) {
    transparencyField.style.background = `linear-gradient(to bottom,
        hsla(0, 100%, 50%, 1),
        hsla(0, 100%, 50%, 0)
      )`;
  }

  if (
    allColorField &&
    allColorBullet &&
    transparencyField &&
    selectorField &&
    bullet
  ) {
    allColorBullet.onmousedown = function (e) {
      e.preventDefault();
      document.onmousemove = function (e) {
        const rect = allColorField.getBoundingClientRect();
        let offsetY = e.clientY - rect.top;
        offsetY = Math.max(
          0,
          Math.min(rect.height - allColorBullet.offsetHeight, offsetY)
        );
        allColorBullet.style.top = `${offsetY}px`;

        const percentage = offsetY / rect.height;
        dynamicHue = Math.round(360 * percentage);

        const h = dynamicHue / 360;
        const l = 0.5; // center lightness
        const s = 1;

        function hueToRgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        }

        let r, g, b;
        if (s === 0) {
          r = g = b = l;
        } else {
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          r = hueToRgb(p, q, h + 1 / 3);
          g = hueToRgb(p, q, h);
          b = hueToRgb(p, q, h - 1 / 3);
        }

        const finalColor = toRGBString(r * 255, g * 255, b * 255);

        if (colorCode) {
          colorCode.textContent = finalColor;
        }

        if (transparencyField) {
          transparencyField.style.background = `linear-gradient(to bottom,
              hsla(${dynamicHue}, 100%, 50%, 1),
              hsla(${dynamicHue}, 100%, 50%, 0)
            )`;
        }

        if (selectorField) {
          selectorField.innerHTML = "";
          selectorField.appendChild(bullet);

          selectorField.style.background = `
              linear-gradient(
                to right,
                hsl(${dynamicHue}, 100%, 50%),
                white
              ),
              linear-gradient(
                to top,
                black,
                transparent
              )
            `;
          selectorField.style.backgroundBlendMode = "multiply";
          selectorField.style.backgroundSize = "100% 100%";
          selectorField.style.backgroundRepeat = "no-repeat";
        }

        // Apply the color to button border
        applyButtonBorderColor(finalColor, currentTransparency / 100);
      };
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }

  if (selectorField && bullet) {
    bullet.onmousedown = function (e) {
      e.preventDefault();
      document.onmousemove = function (e) {
        const rect = selectorField.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        let offsetY = e.clientY - rect.top;

        offsetX = Math.max(
          0,
          Math.min(rect.width - bullet.offsetWidth, offsetX)
        );
        offsetY = Math.max(
          0,
          Math.min(rect.height - bullet.offsetHeight, offsetY)
        );

        bullet.style.left = `${offsetX}px`;
        bullet.style.top = `${offsetY}px`;

        const percentX = offsetX / rect.width;
        const percentY = offsetY / rect.height;

        const lightness = 50 + percentX * 50;
        const darkness = 100 - percentY * 100;
        const finalLightness = Math.max(
          0,
          Math.min(100, (lightness * darkness) / 100)
        );

        const h = dynamicHue / 360;
        const l = finalLightness / 100;
        const s = 1;

        function hueToRgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        }

        let r, g, b;
        if (s === 0) {
          r = g = b = l;
        } else {
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          r = hueToRgb(p, q, h + 1 / 3);
          g = hueToRgb(p, q, h);
          b = hueToRgb(p, q, h - 1 / 3);
        }

        const finalColor = toRGBString(r * 255, g * 255, b * 255);

        if (colorCode) {
          colorCode.textContent = finalColor;
        }

        // Apply the color to button border
        applyButtonBorderColor(finalColor, currentTransparency / 100);
      };
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }

  if (transparencyField && transparencyBullet) {
    transparencyBullet.onmousedown = function (e) {
      e.preventDefault();
      document.onmousemove = function (e) {
        const rect = transparencyField.getBoundingClientRect();
        let offsetY = e.clientY - rect.top;
        offsetY = Math.max(
          0,
          Math.min(rect.height - transparencyBullet.offsetHeight, offsetY)
        );
        transparencyBullet.style.top = `${offsetY}px`;

        const transparencyPercent =
          100 - Math.round((offsetY / rect.height) * 100);
        currentTransparency = transparencyPercent;

        if (transparencyCount) {
          transparencyCount.textContent = `${transparencyPercent}%`;
        }

        // Apply current color with new transparency
        if (colorCode && colorCode.textContent) {
          applyButtonBorderColor(
            colorCode.textContent,
            currentTransparency / 100
          );
        }
      };
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }

  // Show the palette
  palette.classList.remove("sc-hidden");

  if (container.innerHTML.trim() !== "") return;

  Object.values(themeColors).forEach((color) => {
    const cleanColor = color.replace(/['"]+/g, "");
    const swatch = document.createElement("div");
    swatch.className = "sc-border-colors sc-cursor-pointer";
    swatch.style.backgroundColor = cleanColor;
    swatch.style.width = "18px";
    swatch.style.height = "18px";
    swatch.style.borderRadius = "6px";
    swatch.title = cleanColor;

    swatch.addEventListener("click", () => {
      renderVerticalColorShades(cleanColor);

      // add color code to the color code from default page color field
      const hsl = rgbToHslFromAny(cleanColor);
      if (hsl) dynamicHue = hsl.h;
      colorCode.textContent = cleanColor;

      // Apply the color to button border
      applyButtonBorderColor(cleanColor, currentTransparency / 100);
    });

    container.appendChild(swatch);
  });

  function rgbToHslFromAny(color) {
    let r, g, b;

    // Handle hex
    if (color.startsWith("#")) {
      const hex = color.replace("#", "");
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      }
    }

    // Handle rgb()
    else if (color.startsWith("rgb")) {
      const parts = color.match(/\d+/g);
      if (!parts) return null;
      r = parseInt(parts[0]);
      g = parseInt(parts[1]);
      b = parseInt(parts[2]);
    } else return null;

    // Normalize
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h, s, l;

    l = (max + min) / 2;
    if (max === min) {
      h = s = 0;
    } else {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h = h * 60; // degrees
    }

    return { h: Math.round(h), s, l };
  }

  function toRGBString(r, g, b) {
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  }

  function renderVerticalColorShades(baseColor) {
    if (!selectorField) return;

    const hsl = rgbToHslFromAny(baseColor);
    if (hsl) {
      dynamicHue = hsl.h;
    }

    selectorField.innerHTML = "";
    selectorField.appendChild(bullet);

    selectorField.style.background = `
        linear-gradient(
          to right,
          ${baseColor},
          white
        ),
        linear-gradient(
          to top,
          black,
          transparent
        )
      `;
    selectorField.style.backgroundBlendMode = "multiply";
    selectorField.style.backgroundSize = "100% 100%";
    selectorField.style.backgroundRepeat = "no-repeat";

    bullet.onmousedown = function (e) {
      e.preventDefault();
      document.onmousemove = function (e) {
        const rect = selectorField.getBoundingClientRect();
        let offsetX = e.clientX - rect.left;
        let offsetY = e.clientY - rect.top;

        offsetX = Math.max(
          0,
          Math.min(rect.width - bullet.offsetWidth, offsetX)
        );
        offsetY = Math.max(
          0,
          Math.min(rect.height - bullet.offsetHeight, offsetY)
        );

        bullet.style.left = `${offsetX}px`;
        bullet.style.top = `${offsetY}px`;

        const percentX = offsetX / rect.width;
        const percentY = offsetY / rect.height;

        const lightness = 50 + percentX * 50;
        const darkness = 100 - percentY * 100;
        const finalLightness = Math.max(
          0,
          Math.min(100, (lightness * darkness) / 100)
        );

        const h = dynamicHue / 360;
        const s = 1;
        const l = finalLightness / 100;

        function hueToRgb(p, q, t) {
          if (t < 0) t += 1;
          if (t > 1) t -= 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
          return p;
        }

        let r, g, b;
        if (s === 0) {
          r = g = b = l;
        } else {
          const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
          const p = 2 * l - q;
          r = hueToRgb(p, q, h + 1 / 3);
          g = hueToRgb(p, q, h);
          b = hueToRgb(p, q, h - 1 / 3);
        }

        const finalColor = toRGBString(r * 255, g * 255, b * 255);

        if (colorCode) {
          colorCode.textContent = finalColor;
        }

        // Apply the color to button border
        applyButtonBorderColor(finalColor, currentTransparency / 100);
      };
      document.onmouseup = function () {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }

  const firstColor = Object.values(themeColors)[0];
  if (firstColor) {
    renderVerticalColorShades(firstColor);
    colorCode.textContent = firstColor;
    applyButtonBorderColor(firstColor, currentTransparency / 100);
  }
}
