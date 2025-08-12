export function ButtonHoverColorModification(
  themeColors,
  selectedElement,
  saveButtonHoverTextModifications,
  addPendingModification,
  showNotification
) {
  const palette = document.getElementById("hover-button-text-color-palette");
  const container = document.getElementById("hover-button-text-colors");
  const selectorField = document.getElementById(
    "hover-button-text-border-color-selection-field"
  );
  const bullet = document.getElementById(
    "hover-button-text-border-color-selection-bar"
  );
  const colorCode = document.getElementById(
    "hover-button-text-border-color-code"
  );
  const transparencyCount = document.getElementById(
    "hover-button-text-border-color-transparency-count"
  );
  const allColorField = document.getElementById(
    "hover-button-text-color-selection-field"
  );
  const allColorBullet = document.getElementById(
    "hover-button-text-border-color-all-color-selction-bar"
  );
  const transparencyField = document.getElementById(
    "hover-button-text-border-color-transparency-field"
  );
  const transparencyBullet = document.getElementById(
    "hover-button-text-border-color-transparency-bar"
  );

  if (
    !palette ||
    !container ||
    !selectorField ||
    !bullet ||
    !colorCode ||
    !transparencyCount
  ) {
    console.warn("⚠️ Required elements not found:", {
      palette: !!palette,
      container: !!container,
      selectorField: !!selectorField,
      bullet: !!bullet,
      colorCode: !!colorCode,
      transparencyCount: !!transparencyCount,
    });
    return;
  }

  // Additional check for transparency elements
  if (!transparencyField || !transparencyBullet) {
    console.warn("⚠️ Transparency elements not found:", {
      transparencyField: !!transparencyField,
      transparencyBullet: !!transparencyBullet,
    });
  }

  let dynamicHue = 0;
  let currentTransparency = 100;

  // Helper function to convert any color format to RGB string
  function convertToRGB(color) {
    if (!color) return "rgb(255, 0, 0)";

    // If already RGB format, return as is
    if (color.startsWith("rgb(")) {
      return color;
    }

    // Convert HSL to RGB
    if (color.startsWith("hsl(")) {
      const hsl = rgbToHslFromAny(color);
      if (hsl) {
        const h = hsl.h / 360;
        const s = hsl.s;
        const l = hsl.l;

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

        return toRGBString(r * 255, g * 255, b * 255);
      }
    }

    // Convert Hex to RGB
    if (color.startsWith("#")) {
      const hex = color.replace("#", "");
      let r, g, b;
      if (hex.length === 3) {
        r = parseInt(hex[0] + hex[0], 16);
        g = parseInt(hex[1] + hex[1], 16);
        b = parseInt(hex[2] + hex[2], 16);
      } else {
        r = parseInt(hex.slice(0, 2), 16);
        g = parseInt(hex.slice(2, 4), 16);
        b = parseInt(hex.slice(4, 6), 16);
      }
      return toRGBString(r, g, b);
    }

    // Default fallback
    return "rgb(255, 0, 0)";
  }

  // Function to apply background color to button on hover
  function applyButtonHoverColor(color, alpha = 1) {
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

    const allButtons = currentElement.querySelectorAll(
      `a.${buttonType}, button.${buttonType}`
    );

    allButtons.forEach((btn) => {
      const styleId = `sc-hover-background-style-global-${buttonType}`;
      let styleTag = document.getElementById(styleId);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }

      styleTag.textContent = `
          a.${buttonType}:hover,
          button.${buttonType}:hover {
            background-color: ${rgbaColor} !important;
          }
        `;

      btn.dataset.scButtonHoverBackgroundColor = rgbaColor;
    });

    console.log(
      "🖌️ APPLYING HOVER BACKGROUND COLOR:",
      rgbaColor,
      "on",
      buttonType
    );

    // Save modifications if functions are provided
    if (
      typeof saveButtonHoverShadowModifications === "function" &&
      typeof addPendingModification === "function"
    ) {
      const blockId = currentElement.id;
      if (blockId) {
        const stylePayload = {
          buttonPrimary: {
            selector: `.${buttonType}:hover`,
            styles: {
              backgroundColor: rgbaColor,
            },
          },
        };
        addPendingModification(blockId, stylePayload, "buttonBackground");
        if (showNotification) {
          showNotification(
            `Hover background color applied to ${buttonType}`,
            "success"
          );
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
    // Remove conflicting CSS classes
    transparencyField.classList.remove("sc-h-full", "sc-w-3");

    // Force apply our styles with !important
    transparencyField.style.setProperty(
      "background",
      `linear-gradient(to bottom, hsla(${dynamicHue}, 100%, 50%, 1), hsla(${dynamicHue}, 100%, 50%, 0))`,
      "important"
    );
    transparencyField.style.setProperty("width", "24px", "important");
    transparencyField.style.setProperty("height", "100px", "important");
    transparencyField.style.setProperty(
      "border",
      "1px solid #666",
      "important"
    );
    transparencyField.style.setProperty("borderRadius", "15px", "important");
    transparencyField.style.setProperty("overflow", "hidden", "important");
  }

  // Initialize the main color selection field with a default gradient
  if (selectorField) {
    selectorField.style.background = `
      linear-gradient(
        to right,
        hsl(0, 100%, 50%),
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

  // Initialize transparency bar position and ensure it's visible
  if (transparencyField && transparencyBullet) {
    console.log("🎨 Initializing transparency field and bar...");

    // Remove conflicting CSS classes
    transparencyField.classList.remove("sc-h-full", "sc-w-3");

    // Set initial position to middle of the field
    transparencyBullet.style.top = "50%";
    transparencyBullet.style.transform = "translateY(-50%)";

    // Ensure the transparency bar is visible with proper styling
    transparencyBullet.style.width = "20px";
    transparencyBullet.style.height = "8px";
    transparencyBullet.style.backgroundColor = "#f2f2f2";
    transparencyBullet.style.border = "1px solid #999";
    transparencyBullet.style.borderRadius = "4px";
    transparencyBullet.style.cursor = "grab";
    transparencyBullet.style.zIndex = "10";

    // Force apply our styles
    transparencyField.style.setProperty("width", "24px", "important");
    transparencyField.style.setProperty("height", "100px", "important");
    transparencyField.style.setProperty(
      "background",
      `linear-gradient(to bottom, hsla(${dynamicHue}, 100%, 50%, 1), hsla(${dynamicHue}, 100%, 50%, 0))`,
      "important"
    );
    transparencyField.style.setProperty(
      "border",
      "1px solid #666",
      "important"
    );
    transparencyField.style.setProperty("borderRadius", "15px", "important");
    transparencyField.style.setProperty("overflow", "hidden", "important");

    // Ensure the transparency bar is properly positioned
    transparencyBullet.style.setProperty("position", "absolute", "important");
    transparencyBullet.style.setProperty("left", "2px", "important");

    console.log(
      "✅ Transparency field initialized with dimensions:",
      transparencyField.offsetWidth,
      "x",
      transparencyField.offsetHeight
    );
    console.log(
      "✅ Transparency bar positioned at:",
      transparencyBullet.offsetLeft,
      transparencyBullet.offsetTop
    );
  } else {
    console.warn("⚠️ Transparency field or bullet not found:", {
      transparencyField,
      transparencyBullet,
    });
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
          colorCode.textContent = convertToRGB(finalColor);
        }

        if (transparencyField) {
          // Remove conflicting CSS classes
          transparencyField.classList.remove("sc-h-full", "sc-w-3");

          // Force apply our styles with !important
          transparencyField.style.setProperty(
            "background",
            `linear-gradient(to bottom, hsla(${dynamicHue}, 100%, 50%, 1), hsla(${dynamicHue}, 100%, 50%, 0))`,
            "important"
          );
          transparencyField.style.setProperty("width", "24px", "important");
          transparencyField.style.setProperty("height", "100px", "important");
          transparencyField.style.setProperty(
            "border",
            "1px solid #666",
            "important"
          );
          transparencyField.style.setProperty(
            "borderRadius",
            "15px",
            "important"
          );
          transparencyField.style.setProperty(
            "overflow",
            "hidden",
            "important"
          );
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
        applyButtonHoverColor(finalColor, currentTransparency / 100);
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
          colorCode.textContent = convertToRGB(finalColor);
        }

        // Apply the color to button border
        applyButtonHoverColor(finalColor, currentTransparency / 100);
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

        const transparencyPercent = Math.max(
          0,
          Math.min(100, 100 - Math.round((offsetY / rect.height) * 100))
        );
        currentTransparency = transparencyPercent;

        if (transparencyCount) {
          transparencyCount.textContent = `${transparencyPercent}%`;
        }

        // Apply current color with new transparency
        if (colorCode && colorCode.textContent) {
          applyButtonHoverColor(
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

  // Ensure transparency field is properly initialized after a short delay
  setTimeout(() => {
    if (transparencyField && transparencyBullet) {
      console.log("🎨 Delayed initialization of transparency field...");

      // Remove conflicting CSS classes
      transparencyField.classList.remove("sc-h-full", "sc-w-3");

      // Force apply our styles with !important
      transparencyField.style.setProperty("width", "24px", "important");
      transparencyField.style.setProperty("height", "100px", "important");
      transparencyField.style.setProperty(
        "background",
        `linear-gradient(to bottom, hsla(${dynamicHue}, 100%, 50%, 1), hsla(${dynamicHue}, 100%, 50%, 0))`,
        "important"
      );
      transparencyField.style.setProperty(
        "border",
        "1px solid #666",
        "important"
      );
      transparencyField.style.setProperty("borderRadius", "15px", "important");
      transparencyField.style.setProperty("overflow", "hidden", "important");

      // Ensure the transparency bar is properly positioned
      transparencyBullet.style.setProperty("position", "absolute", "important");
      transparencyBullet.style.setProperty("left", "2px", "important");
      transparencyBullet.style.setProperty("top", "50%", "important");
      transparencyBullet.style.setProperty(
        "transform",
        "translateY(-50%)",
        "important"
      );

      console.log("✅ Delayed transparency field initialization complete");
    }
  }, 100);

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
      colorCode.textContent = convertToRGB(cleanColor);

      // Apply the color to button border
      applyButtonHoverColor(cleanColor, currentTransparency / 100);
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

    // Update transparency field with new hue
    if (transparencyField) {
      // Remove conflicting CSS classes
      transparencyField.classList.remove("sc-h-full", "sc-w-3");

      // Force apply our styles with !important
      transparencyField.style.setProperty(
        "background",
        `linear-gradient(to bottom, hsla(${dynamicHue}, 100%, 50%, 1), hsla(${dynamicHue}, 100%, 50%, 0))`,
        "important"
      );
      transparencyField.style.setProperty("width", "24px", "important");
      transparencyField.style.setProperty("height", "100px", "important");
      transparencyField.style.setProperty(
        "border",
        "1px solid #666",
        "important"
      );
      transparencyField.style.setProperty("borderRadius", "15px", "important");
      transparencyField.style.setProperty("overflow", "hidden", "important");
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
          colorCode.textContent = convertToRGB(finalColor);
        }

        // Apply the color to button border
        applyButtonHoverColor(finalColor, currentTransparency / 100);
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
    colorCode.textContent = convertToRGB(firstColor);

    // Ensure transparency count is properly initialized
    if (transparencyCount) {
      transparencyCount.textContent = `${currentTransparency}%`;
    }

    applyButtonHoverColor(firstColor, currentTransparency / 100);
  }
}
