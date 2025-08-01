export function buttonShadowColorPalate(
  themeColors,
  selectedElement,
  addPendingModification,
  showNotification
) {
  // Use correct IDs matching the HTML
  const palette = document.getElementById("button-shadow-color-palette");
  const container = document.getElementById("button-shadow-colors-palette");
  const selectorField = document.getElementById(
    "button-shadow-border-color-selection-field"
  );
  const bullet = document.getElementById(
    "button-shadow-border-color-selection-bar"
  );
  const colorCode = document.getElementById("button-shadow-border-color-code");
  const transparencyCount = document.getElementById(
    "button-shadow-border-color-transparency-count"
  );
  const allColorField = document.getElementById(
    "button-shadow-border-color-all-color-selction-field"
  );
  const allColorBullet = document.getElementById(
    "button-shadow-border-color-all-color-selction-bar"
  );
  const transparencyField = document.getElementById(
    "button-shadow-border-color-transparency-field"
  );
  const transparencyBullet = document.getElementById(
    "button-shadow-border-color-transparency-bar"
  );

  // Button-specific shadow color application function
  function applyButtonShadowColorFromPalette(color, alpha = 1) {
    const currentElement = selectedElement?.();
    if (!currentElement) return;

    const btn = currentElement.querySelector(
      ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
    );
    if (!btn) return;

    const typeClass = [...btn.classList].find((cls) =>
      cls.startsWith("sqs-button-element--")
    );
    if (!typeClass) return;

    // Get existing shadow state
    if (!window.shadowStatesByType) {
      window.shadowStatesByType = new Map();
    }

    if (!window.shadowStatesByType.has(typeClass)) {
      window.shadowStatesByType.set(typeClass, {
        Xaxis: 0,
        Yaxis: 0,
        Blur: 0,
        Spread: 0,
        Color: "rgba(0,0,0,0.3)",
      });
    }

    const shadowState = window.shadowStatesByType.get(typeClass);

    // Convert color to rgba
    let rgbaColor;
    if (color.startsWith("rgb(")) {
      rgbaColor = color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
    } else if (color.startsWith("rgba(")) {
      rgbaColor = color.replace(
        /rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/,
        (_, r, g, b) => `rgba(${r},${g},${b},${alpha})`
      );
    } else {
      const tempDiv = document.createElement("div");
      tempDiv.style.color = color;
      document.body.appendChild(tempDiv);
      const rgb = getComputedStyle(tempDiv).color;
      document.body.removeChild(tempDiv);
      rgbaColor = rgb.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
    }

    // Update shadow state with new color
    shadowState.Color = rgbaColor;

    // Apply shadow to button
    const value = `${shadowState.Xaxis}px ${shadowState.Yaxis}px ${shadowState.Blur}px ${shadowState.Spread}px ${rgbaColor}`;

    const styleId = `sc-button-shadow-${typeClass}`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.innerHTML = `
      .${typeClass} {
        box-shadow: ${value} !important;
      }
      .${typeClass}:hover {
        box-shadow: ${value} !important;
      }
    `;

    // Add to pending modifications if function provided
    if (typeof addPendingModification === "function") {
      const blockId = currentElement.id;
      if (blockId) {
        const stylePayload = {
          buttonPrimary: {
            selector: `.${typeClass}`,
            styles: { boxShadow: value },
          },
        };
        addPendingModification(blockId, stylePayload, "buttonShadow");
        if (showNotification) {
          showNotification(
            `Button shadow color applied to ${typeClass}`,
            "success"
          );
        }
      }
    }
  }

  function updateTransparencyField(hue) {
    if (transparencyField) {
      transparencyField.style.background = `linear-gradient(to bottom, 
        hsla(${hue}, 100%, 50%, 1), 
        hsla(${hue}, 100%, 50%, 0)
      )`;
    }
  }

  function getHueFromColorString(colorStr) {
    const tempDiv = document.createElement("div");
    tempDiv.style.color = colorStr;
    document.body.appendChild(tempDiv);
    const rgb = getComputedStyle(tempDiv).color;
    document.body.removeChild(tempDiv);
    const match = rgb.match(/rgb\((\d+), (\d+), (\d+)\)/);
    if (!match) return null;
    const r = parseInt(match[1]) / 255;
    const g = parseInt(match[2]) / 255;
    const b = parseInt(match[3]) / 255;
    const max = Math.max(r, g, b),
      min = Math.min(r, g, b);
    let h = 0,
      s = 0,
      l = (max + min) / 2;
    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
      else if (max === g) h = (b - r) / d + 2;
      else h = (r - g) / d + 4;
      h /= 6;
    }
    return h * 360;
  }

  function setSelectorCanvas(hue) {
    selectorField.innerHTML = "";
    const canvas = getGradientCanvas(
      hue,
      selectorField.offsetWidth,
      selectorField.offsetHeight
    );
    canvas.style.position = "absolute";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "0";
    selectorField.style.position = "relative";
    selectorField.appendChild(canvas);
    selectorField.appendChild(bullet);
  }

  function hslToRgb(h, s = 1, l = 0.5) {
    function hueToRgb(p, q, t) {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    }
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    const r = hueToRgb(p, q, h + 1 / 3);
    const g = hueToRgb(p, q, h);
    const b = hueToRgb(p, q, h - 1 / 3);
    return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
      b * 255
    )})`;
  }

  function updateSelectorField(hueOrColor) {
    let hue = typeof hueOrColor === "number" ? hueOrColor : null;
    if (!hue) {
      hue = getHueFromColorString(hueOrColor);
    }
    dynamicHue = hue;
    setSelectorCanvas(hue);
    updateTransparencyField(dynamicHue);
  }

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

        const finalColor = hslToRgb(dynamicHue / 360);

        if (colorCode) {
          colorCode.textContent = finalColor;
        }

        if (selectorField) {
          setSelectorCanvas(dynamicHue);
        }

        updateTransparencyField(dynamicHue);
        applyButtonShadowColorFromPalette(
          finalColor,
          currentTransparency / 100
        );
      };

      document.onmouseup = () => {
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
        const canvas = selectorField.querySelector("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;

        const data = ctx.getImageData(offsetX, offsetY, 1, 1).data;

        const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;

        if (colorCode) {
          colorCode.textContent = rgb;
        }

        applyButtonShadowColorFromPalette(rgb, currentTransparency / 100);
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }

  function getGradientCanvas(hue, width, height) {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });

    canvas.width = width;
    canvas.height = height;

    const gradient1 = ctx.createLinearGradient(0, 0, width, 0);
    gradient1.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
    gradient1.addColorStop(1, "white");

    const gradient2 = ctx.createLinearGradient(0, height, 0, 0);
    gradient2.addColorStop(0, "black");
    gradient2.addColorStop(1, "transparent");

    ctx.fillStyle = gradient1;
    ctx.fillRect(0, 0, width, height);
    ctx.globalCompositeOperation = "multiply";
    ctx.fillStyle = gradient2;
    ctx.fillRect(0, 0, width, height);

    return canvas;
  }

  function moveBullet(offsetX, offsetY) {
    bullet.style.left = `${offsetX}px`;
    bullet.style.top = `${offsetY}px`;

    const width = selectorField.offsetWidth;
    const height = selectorField.offsetHeight;
    if (!width || !height) return;

    const canvas = selectorField.querySelector("canvas");
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;
    const data = ctx.getImageData(offsetX, offsetY, 1, 1).data;
    const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;

    colorCode.textContent = rgb;
    applyButtonShadowColorFromPalette(rgb, currentTransparency / 100);
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
          transparencyCount.textContent = `${currentTransparency}%`;
        }
        const currentColor = colorCode?.textContent;
        if (currentColor) {
          applyButtonShadowColorFromPalette(
            currentColor,
            currentTransparency / 100
          );
        }
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }

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

    swatch.onclick = () => {
      const color = swatch.style.backgroundColor;

      updateSelectorField(color);
      // Move allColorBullet to match dynamicHue
      if (allColorField && allColorBullet) {
        const rect = allColorField.getBoundingClientRect();
        const huePercentage = dynamicHue / 360;
        const bulletTop = huePercentage * rect.height;
        allColorBullet.style.top = `${bulletTop}px`;
      }

      applyButtonShadowColorFromPalette(color, currentTransparency / 100);

      requestAnimationFrame(() => {
        const canvas = selectorField.querySelector("canvas");
        const ctx = canvas.getContext("2d");
        const width = canvas.width;
        const height = canvas.height;

        let bestMatch = { x: 0, y: 0, diff: Infinity };

        const [cr, cg, cb] = color
          .replace(/[^\d,]/g, "")
          .split(",")
          .map((n) => parseInt(n.trim()));

        for (let y = 0; y < height; y += 2) {
          for (let x = 0; x < width; x += 2) {
            const data = ctx.getImageData(x, y, 1, 1).data;
            const diff =
              Math.abs(data[0] - cr) +
              Math.abs(data[1] - cg) +
              Math.abs(data[2] - cb);
            if (diff < bestMatch.diff) {
              bestMatch = { x, y, diff };
              if (diff <= 3) break;
            }
          }
        }

        moveBullet(bestMatch.x, bestMatch.y);
        if (transparencyBullet && transparencyField) {
          transparencyBullet.style.top = `0px`;
        }
        currentTransparency = 100;
        if (transparencyCount) {
          transparencyCount.textContent = `100%`;
        }

        // Update the color code display
        if (colorCode) {
          colorCode.textContent = color;
        }
      });

      applyButtonShadowColorFromPalette(color, currentTransparency / 100);
    };

    container.appendChild(swatch);
  });

  if (container.children.length > 0) {
    const firstSwatchColor = container.children[0].style.backgroundColor;

    updateSelectorField(firstSwatchColor);

    const rect = selectorField.getBoundingClientRect();
    const defaultX = Math.round(rect.width * 0.5);
    const defaultY = Math.round(rect.height * 0.5);
    bullet.style.left = `${defaultX}px`;
    bullet.style.top = `${defaultY}px`;

    const canvas = selectorField.querySelector("canvas");
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      const data = ctx.getImageData(defaultX, defaultY, 1, 1).data;
      const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
      colorCode.textContent = rgb;
    }

    transparencyBullet.style.top = `0px`;
    currentTransparency = 100;
    transparencyCount.textContent = `100%`;

    requestAnimationFrame(() => {
      setTimeout(() => {
        updateSelectorField(firstSwatchColor);

        const rect = selectorField.getBoundingClientRect();
        const defaultX = Math.round(rect.width * 0.5);
        const defaultY = Math.round(rect.height * 0.5);
        bullet.style.left = `${defaultX}px`;
        bullet.style.top = `${defaultY}px`;

        const canvas = selectorField.querySelector("canvas");
        const ctx = canvas?.getContext("2d");
        if (ctx) {
          const data = ctx.getImageData(defaultX, defaultY, 1, 1).data;
          const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
          colorCode.textContent = rgb;
        }

        transparencyBullet.style.top = `0px`;
        currentTransparency = 100;
        transparencyCount.textContent = `100%`;
      }, 50);
    });
  }

  if (container.children.length === 0) {
    const defaultColor =
      Object.values(themeColors)[0]?.replace(/['"]+/g, "") || "rgb(255, 0, 0)";
    updateSelectorField(defaultColor);
    moveBullet(0, 0);

    if (transparencyBullet && transparencyField) {
      transparencyBullet.style.top = `0px`;
    }
    currentTransparency = 100;
    if (transparencyCount) {
      transparencyCount.textContent = `100%`;
    }
  }

  //color pallete code start here
  function applyImageShadowColor(color, alpha = 1) {
    const selected = selectedElement?.(); // from your context
    if (!selected) return;

    const blockId = selected.closest('[id^="block-"]')?.id;
    const imageWrapper = selected.querySelector(".sqs-image-content");
    if (!blockId || !imageWrapper) return;

    const rgbaColor = color.startsWith("rgb(")
      ? color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
      : color;

    const overlayId = `sc-image-overlay-${blockId}`;
    let overlay = document.getElementById(overlayId);

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.id = overlayId;
      overlay.style.position = "absolute";
      overlay.style.top = "0";
      overlay.style.left = "0";
      overlay.style.width = "100%";
      overlay.style.height = "100%";
      overlay.style.pointerEvents = "none";
      overlay.style.zIndex = "1";
      overlay.style.borderRadius = "inherit";

      imageWrapper.style.position = "relative";
      imageWrapper.appendChild(overlay);
    }

    overlay.style.backgroundColor = rgbaColor;
  }

  // applyImageShadowColor("rgba(0,0,0,0.5)");
}
//color pallete code end here
