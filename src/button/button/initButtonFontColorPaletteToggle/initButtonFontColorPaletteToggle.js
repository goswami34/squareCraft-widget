export function initButtonFontColorPaletteToggle(themeColors, selectedElement) {
  let isFirstBulletMove = true;
  let dynamicHue = 0;
  let currentTransparency = 100;

  const palette = document.getElementById("buttonFontColorPalate");

  const container = document.getElementById("button-border-colors");
  const selectorField = document.getElementById("button-color-selection-field");
  const bullet = document.getElementById("button-color-selection-bar");
  const colorCode = document.getElementById("button-color-code");
  const transparencyCount = document.getElementById(
    "button-color-transparency-count"
  );
  const allColorField = document.getElementById(
    "button-all-color-selection-field"
  );
  const allColorBullet = document.getElementById(
    "button-all-color-selection-bar"
  );
  const transparencyField = document.getElementById(
    "button-color-transparency-field"
  );
  const transparencyBullet = document.getElementById(
    "button-color-transparency-bar"
  );

  function updateTransparencyField(hue) {
    if (transparencyField) {
      transparencyField.style.background = `linear-gradient(to bottom, 
      hsla(${hue}, 100%, 50%, 1), 
      hsla(${hue}, 100%, 50%, 0)
    )`;
    }
  }
  console.log("clicked element", selectedElement);
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

    requestAnimationFrame(() => {
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const centerX = Math.floor(canvas.width / 2);
      const centerY = Math.floor(canvas.height / 2);
      const data = ctx.getImageData(centerX, centerY, 1, 1).data;
      const rgba = `rgba(${data[0]}, ${data[1]}, ${data[2]}, ${data[3] / 255})`;
      console.log(`🖼️ Canvas rendered (center pixel): ${rgba}`);
    });
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
  function formatColorOutput(r, g, b, alpha = 1) {
    const label = document.getElementById("color-code-label");
    const format = label?.textContent?.trim().toUpperCase();

    if (format === "HEX") {
      const toHex = (v) => v.toString(16).padStart(2, "0");
      return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
    }

    if (format === "HSL") {
      r /= 255;
      g /= 255;
      b /= 255;
      const max = Math.max(r, g, b),
        min = Math.min(r, g, b);
      let h,
        s,
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
        h *= 60;
      }

      return `hsl(${Math.round(h)}, ${Math.round(s * 100)}%, ${Math.round(
        l * 100
      )}%)`;
    }

    return `rgba(${r}, ${g}, ${b}, ${alpha})`; // fallback: RGB
  }
  
  function updateSelectorField(hueOrColor) {
    let hue = typeof hueOrColor === "number" ? hueOrColor : null;
    if (!hue) {
      hue = getHueFromColorString(hueOrColor);
    }

    dynamicHue = hue;
    setSelectorCanvas(hue);
    updateTransparencyField(dynamicHue);
    selectorField.style.background = `linear-gradient(to right, hsl(${hue}, 100%, 50%), white), linear-gradient(to top, black, transparent)`;
    selectorField.style.backgroundBlendMode = "multiply";

    function syncBulletWithCanvasColor() {
      const canvas = selectorField.querySelector("canvas");
      if (!canvas) {
        requestAnimationFrame(syncBulletWithCanvasColor);
        return;
      }

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const bulletRect = bullet.getBoundingClientRect();
      const fieldRect = selectorField.getBoundingClientRect();
      const offsetX = bulletRect.left - fieldRect.left;
      const offsetY = bulletRect.top - fieldRect.top;

      const data = ctx.getImageData(offsetX, offsetY, 1, 1).data;
      const isValidColor = data[0] + data[1] + data[2] > 30; // Skip if too dark

      if (!isValidColor) {
        requestAnimationFrame(syncBulletWithCanvasColor);
        return;
      }

      const rgba = formatColorOutput(data[0], data[1], data[2], currentTransparency / 100)
      colorCode.textContent = rgba;
      if (palette) palette.style.backgroundColor = rgba;
      applyButtonBackgroundColor(rgba, currentTransparency / 100);
    }
    requestAnimationFrame(syncBulletWithCanvasColor);
  }

  function applyButtonBackgroundColor(color, alpha = 1) {
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

    const styleId = `sc-style-global-${buttonType}`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = `
      a.${buttonType},
      button.${buttonType} {
        background-color: ${rgbaColor} !important;
      }
      a.${buttonType}:hover,
      button.${buttonType}:hover {
        background-color: ${rgbaColor} !important;
        filter: brightness(0.95);
      }
    `;
    const allButtons = currentElement.querySelectorAll(
      `a.${buttonType}, button.${buttonType}`
    );
    allButtons.forEach((btn) => {
      btn.dataset.scButtonBg = color;
    });
    console.log("🖌️ APPLYING COLOR:", rgbaColor, "on", buttonType);
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
        applyButtonBackgroundColor(finalColor, currentTransparency / 100);
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
      console.log("🎨 Updated dynamicHue from palette:", dynamicHue);
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
        const rgba = formatColorOutput(
          data[0],
          data[1],
          data[2],
          currentTransparency / 100
        );


        if (colorCode) colorCode.textContent = rgba;
        if (palette) palette.style.backgroundColor = rgba;
        applyButtonBackgroundColor(rgba, currentTransparency / 100);
      };

      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }



  function moveBullet(offsetX, offsetY) {
    bullet.style.left = `${offsetX}px`;
    bullet.style.top = `${offsetY}px`;

    const canvas = selectorField.querySelector("canvas");
    const ctx = canvas?.getContext("2d");
    if (!ctx) return;

    const data = ctx.getImageData(offsetX, offsetY, 1, 1).data;
    const rgba = formatColorOutput(
      data[0],
      data[1],
      data[2],
      currentTransparency / 100
    );

    colorCode.textContent = rgba;
    if (palette) palette.style.backgroundColor = rgba;
    applyButtonBackgroundColor(rgba, currentTransparency / 100);
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

        const bulletRect = bullet.getBoundingClientRect();
        const fieldRect = selectorField.getBoundingClientRect();
        const offsetX = bulletRect.left - fieldRect.left;
        const offsetY2 = bulletRect.top - fieldRect.top;

        const canvas = selectorField.querySelector("canvas");
        const ctx = canvas?.getContext("2d");
        if (!ctx) return;

        const data = ctx.getImageData(offsetX, offsetY2, 1, 1).data;
        const rgba = formatColorOutput(
          data[0],
          data[1],
          data[2],
          currentTransparency / 100
        );


        if (colorCode) colorCode.textContent = rgba;
        if (palette) palette.style.backgroundColor = rgba;
        applyButtonBackgroundColor(rgba, currentTransparency / 100);
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
      console.log(`🎯 Swatch clicked: ${color}`);

      if (allColorField && allColorBullet) {
        const rect = allColorField.getBoundingClientRect();
        const huePercentage = dynamicHue / 360;
        const bulletTop = huePercentage * rect.height;
        allColorBullet.style.top = `${bulletTop}px`;
      }

      applyButtonBackgroundColor(color, currentTransparency / 100);

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
      });
    };

    container.appendChild(swatch);
  });

  if (container.children.length > 0) {
    const firstSwatchColor = container.children[0].style.backgroundColor;

    updateSelectorField(firstSwatchColor);

    bullet.style.left = `0px`;
    bullet.style.top = `0px`;

    const rect = selectorField.getBoundingClientRect();
    const centerX = Math.round(rect.width * 0.5);
    const centerY = Math.round(rect.height * 0.5);

    function waitAndCenterBullet() {
      if (rect.width < 50 || rect.height < 20) {
        requestAnimationFrame(waitAndCenterBullet);
        return;
      }

      const canvas = selectorField.querySelector("canvas");
      const ctx = canvas?.getContext("2d", { willReadFrequently: true });
      if (!ctx) {
        requestAnimationFrame(waitAndCenterBullet);
        return;
      }


      const pixel = ctx.getImageData(centerX, centerY, 1, 1).data;
      const [r, g, b] = pixel;

      if (r + g + b <= 20) {
        requestAnimationFrame(waitAndCenterBullet);
        return;
      }

      bullet.style.left = `${centerX}px`;
      bullet.style.top = `${centerY}px`;

      const rgba = `rgba(${r}, ${g}, ${b}, ${currentTransparency / 100})`;
      colorCode.textContent = rgba;
      palette.style.backgroundColor = rgba;
      applyButtonBackgroundColor(rgba);

      console.log(`✅ Bullet synced after canvas painted → ${rgba}`);
    }

    requestAnimationFrame(waitAndCenterBullet);

    const canvas = selectorField.querySelector("canvas");
    const ctx = canvas?.getContext("2d");
    if (ctx) {
      const data = ctx.getImageData(defaultX, defaultY, 1, 1).data;
      const rgba = formatColorOutput(data[0], data[1], data[2], currentTransparency / 100)
      colorCode.textContent = rgba;
    }

    transparencyBullet.style.top = `0px`;
    currentTransparency = 100;
    transparencyCount.textContent = `100%`;

    function waitForCanvasReadyAndSyncBullet(x, y) {
      const canvas = selectorField.querySelector("canvas");
      if (!canvas) {
        console.log("⏳ Canvas not found yet");
        requestAnimationFrame(() => waitForCanvasReadyAndSyncBullet(x, y));
        return;
      }

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const data = ctx.getImageData(x, y, 1, 1).data;

      let painted = false;
      for (let i = 0; i < 10; i++) {
        const sampleX = Math.floor((selectorField.offsetWidth / 10) * i);
        const sampleY = Math.floor(selectorField.offsetHeight / 2);
        const sample = ctx.getImageData(sampleX, sampleY, 1, 1).data;
        if (sample[0] > 10 || sample[1] > 10 || sample[2] > 10) {
          painted = true;
          break;
        }
      }

      if (!painted) {
        console.log("🕐 Canvas not fully painted, retrying...");
        requestAnimationFrame(() => waitForCanvasReadyAndSyncBullet(x, y));
        return;
      }

      const rgba = formatColorOutput(data[0], data[1], data[2], currentTransparency / 100)
      bullet.style.left = `${x}px`;
      bullet.style.top = `${y}px`;
      colorCode.textContent = rgba;
      applyButtonBackgroundColor(rgba);
      console.log(`✅ Bullet synced at (${x}, ${y}) → ${rgba} (initial load)`);
    }

    waitForCanvasReadyAndSyncBullet(defaultX, defaultY);
  }

  if (container.children.length === 0) {
    const defaultColor =
      Object.values(themeColors)[0]?.replace(/['"]+/g, "") || "rgb(255, 0, 0)";
    updateSelectorField(defaultColor);

    function waitForCanvasReadyAndSyncBullet(x, y) {
      const canvas = selectorField.querySelector("canvas");
      if (!canvas) {
        requestAnimationFrame(() => waitForCanvasReadyAndSyncBullet(x, y));
        return;
      }

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const data = ctx.getImageData(x, y, 1, 1).data;
      if (data[0] === 0 && data[1] === 0 && data[2] === 0) {
        requestAnimationFrame(() => waitForCanvasReadyAndSyncBullet(x, y));
        return;
      }

      bullet.style.left = `${x}px`;
      bullet.style.top = `${y}px`;
      const rgba = formatColorOutput(data[0], data[1], data[2], currentTransparency / 100)
      colorCode.textContent = rgba;
    }

    const defaultX = Math.round(selectorField.offsetWidth * 0.5);
    const defaultY = Math.round(selectorField.offsetHeight * 0.5);
    waitForCanvasReadyAndSyncBullet(defaultX, defaultY);

    if (transparencyBullet && transparencyField) {
      transparencyBullet.style.top = `0px`;
    }
    currentTransparency = 100;
    if (transparencyCount) {
      transparencyCount.textContent = `100%`;
    }
  }
}
