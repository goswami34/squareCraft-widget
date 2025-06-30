// // At the top of initShadowColorPalate.js

// export function initOverLayColorPalate(
//   themeColors,
//   selectedElement,
//   prefix = "",
//   saveFn
// ) {
//   const palette = document.getElementById(`${prefix}overLayFontColorPalate`);
//   const container = document.getElementById(`${prefix}overlay-border-colors`);
//   const selectorField = document.getElementById(
//     `${prefix}overlay-color-selection-field`
//   );
//   const bullet = document.getElementById(
//     `${prefix}overlay-color-selection-bar`
//   );
//   const colorCode = document.getElementById(
//     `${prefix}overlay-image-color-code`
//   );
//   const transparencyCount = document.getElementById(
//     `${prefix}overlay-image-color-transparency-count`
//   );
//   const allColorField = document.getElementById(
//     `${prefix}overlay-image-all-color-selection-field`
//   );
//   const allColorBullet = document.getElementById(
//     `${prefix}overlay-image-all-color-selection-bar`
//   );
//   const transparencyField = document.getElementById(
//     `${prefix}overlay-image-color-transparency-field`
//   );
//   const transparencyBullet = document.getElementById(
//     `${prefix}overlay-image-color-transparency-bar`
//   );

//   function updateTransparencyField(hue) {
//     if (transparencyField) {
//       transparencyField.style.background = `linear-gradient(to bottom,
//         hsla(${hue}, 100%, 50%, 1),
//         hsla(${hue}, 100%, 50%, 0)
//       )`;
//     }
//   }
//   console.log("clicked element", selectedElement);
//   function getHueFromColorString(colorStr) {
//     const tempDiv = document.createElement("div");
//     tempDiv.style.color = colorStr;
//     document.body.appendChild(tempDiv);
//     const rgb = getComputedStyle(tempDiv).color;
//     document.body.removeChild(tempDiv);

//     const match = rgb.match(/rgb\((\d+), (\d+), (\d+)\)/);
//     if (!match) return null;

//     const r = parseInt(match[1]) / 255;
//     const g = parseInt(match[2]) / 255;
//     const b = parseInt(match[3]) / 255;

//     const max = Math.max(r, g, b),
//       min = Math.min(r, g, b);
//     let h = 0,
//       s = 0,
//       l = (max + min) / 2;
//     if (max !== min) {
//       const d = max - min;
//       s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
//       if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
//       else if (max === g) h = (b - r) / d + 2;
//       else h = (r - g) / d + 4;
//       h /= 6;
//     }
//     return h * 360;
//   }
//   function setSelectorCanvas(hue) {
//     selectorField.innerHTML = "";

//     const canvas = getGradientCanvas(
//       hue,
//       selectorField.offsetWidth,
//       selectorField.offsetHeight
//     );
//     canvas.style.position = "absolute";
//     canvas.style.top = "0";
//     canvas.style.left = "0";
//     canvas.style.zIndex = "0";

//     selectorField.style.position = "relative";
//     selectorField.appendChild(canvas);
//     selectorField.appendChild(bullet);
//   }
//   function hslToRgb(h, s = 1, l = 0.5) {
//     function hueToRgb(p, q, t) {
//       if (t < 0) t += 1;
//       if (t > 1) t -= 1;
//       if (t < 1 / 6) return p + (q - p) * 6 * t;
//       if (t < 1 / 2) return q;
//       if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
//       return p;
//     }

//     const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
//     const p = 2 * l - q;

//     const r = hueToRgb(p, q, h + 1 / 3);
//     const g = hueToRgb(p, q, h);
//     const b = hueToRgb(p, q, h - 1 / 3);

//     return `rgb(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(
//       b * 255
//     )})`;
//   }

//   function updateSelectorField(hueOrColor) {
//     let hue = typeof hueOrColor === "number" ? hueOrColor : null;

//     if (!hue) {
//       hue = getHueFromColorString(hueOrColor);
//     }

//     dynamicHue = hue;
//     setSelectorCanvas(hue);
//     updateTransparencyField(dynamicHue);
//   }

//   function applyButtonBackgroundColor(color, alpha = 1) {
//     const currentElement = selectedElement?.();
//     if (!currentElement) return;

//     const buttonTypes = [
//       "sqs-button-element--primary",
//       "sqs-button-element--secondary",
//       "sqs-button-element--tertiary",
//     ];

//     let buttonType = null;
//     for (let type of buttonTypes) {
//       if (currentElement.querySelector(`a.${type}`)) {
//         buttonType = type;
//         break;
//       }
//     }

//     if (!buttonType) {
//       console.warn("⚠️ No Squarespace button found in block.");
//       return;
//     }

//     const rgbaColor = color.startsWith("rgb(")
//       ? color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
//       : color;

//     const styleId = `sc-style-global-${buttonType}`;
//     let styleTag = document.getElementById(styleId);
//     if (!styleTag) {
//       styleTag = document.createElement("style");
//       styleTag.id = styleId;
//       document.head.appendChild(styleTag);
//     }

//     styleTag.textContent = `
//       a.${buttonType},
//       button.${buttonType} {
//         background-color: ${rgbaColor} !important;
//       }
//       a.${buttonType}:hover,
//       button.${buttonType}:hover {
//         background-color: ${rgbaColor} !important;
//         filter: brightness(0.95);
//       }
//     `;

//     const allButtons = currentElement.querySelectorAll(
//       `a.${buttonType}, button.${buttonType}`
//     );
//     allButtons.forEach((btn) => {
//       btn.dataset.scButtonBg = color;
//     });
//   }

//   // function applyOverlayColorSmart(color, alpha = 1) {
//   //   const currentElement = selectedElement?.();
//   //   if (!currentElement) return;

//   //   const isImage = currentElement.querySelector(".sqs-image-content");
//   //   if (isImage) {
//   //     const overlay = currentElement.querySelector(".sc-custom-overlay");
//   //     if (overlay) {
//   //       const rgbaColor = color.startsWith("rgb(")
//   //         ? color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
//   //         : color;
//   //       overlay.style.backgroundColor = rgbaColor;
//   //     }
//   //   }
//   // }

//   // function applyOverlayColorSmart(color, alpha = 1) {
//   //   const currentElement = selectedElement?.();
//   //   if (!currentElement) return;

//   //   const blockId = currentElement.closest('[id^="block-"]')?.id;
//   //   if (!blockId) return;

//   //   const rgbaColor = color.startsWith("rgb(")
//   //     ? color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
//   //     : color;

//   //   const styleId = `sc-overlay-style-${blockId}`;
//   //   let styleTag = document.getElementById(styleId);
//   //   if (!styleTag) {
//   //     styleTag = document.createElement("style");
//   //     styleTag.id = styleId;
//   //     document.head.appendChild(styleTag);
//   //   }

//   //   styleTag.textContent = `
//   //     #${blockId} .sqs-image-content > :nth-child(-n+2)::before {
//   //       content: '';
//   //       position: absolute;
//   //       top: 0;
//   //       left: 0;
//   //       width: 100%;
//   //       height: 100%;
//   //       background-color: ${rgbaColor};
//   //       z-index: 5;
//   //       pointer-events: none;
//   //       display: block;
//   //     }

//   //     #${blockId} .sqs-image-content > .imageEffectContainer {
//   //       position: relative;
//   //     }
//   //   `;
//   // }

//   function applyOverlayColorSmart(color, alpha = 1) {
//     const currentElement = selectedElement?.();
//     if (!currentElement) return;

//     const blockId = currentElement.closest('[id^="block-"]')?.id;
//     if (!blockId) return;

//     const rgbaColor = color.startsWith("rgb(")
//       ? color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
//       : color;

//     const styleId = `sc-overlay-style-${blockId}`;
//     let styleTag = document.getElementById(styleId);
//     if (!styleTag) {
//       styleTag = document.createElement("style");
//       styleTag.id = styleId;
//       document.head.appendChild(styleTag);
//     }

//     styleTag.textContent = `
//       #${blockId} .sqs-image-content > :nth-child(-n+2)::before {
//         content: '';
//         position: absolute;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         background-color: ${rgbaColor};
//         z-index: 5;
//         pointer-events: none;
//         display: block;
//       }

//       #${blockId} .sqs-image-content > .imageEffectContainer {
//         position: relative;
//       }
//     `;
//   }

//   if (
//     !palette ||
//     !container ||
//     !selectorField ||
//     !bullet ||
//     !colorCode ||
//     !transparencyCount
//   )
//     return;

//   let dynamicHue = 0;

//   let currentTransparency = 100;

//   if (allColorField) {
//     allColorField.style.background = `linear-gradient(to bottom,
//         hsl(0, 100%, 50%),
//         hsl(60, 100%, 50%),
//         hsl(120, 100%, 50%),
//         hsl(180, 100%, 50%),
//         hsl(240, 100%, 50%),
//         hsl(300, 100%, 50%),
//         hsl(360, 100%, 50%)
//       )`;
//   }

//   if (
//     allColorField &&
//     allColorBullet &&
//     transparencyField &&
//     selectorField &&
//     bullet
//   ) {
//     allColorBullet.onmousedown = function (e) {
//       e.preventDefault();

//       document.onmousemove = function (e) {
//         const rect = allColorField.getBoundingClientRect();
//         let offsetY = e.clientY - rect.top;
//         offsetY = Math.max(
//           0,
//           Math.min(rect.height - allColorBullet.offsetHeight, offsetY)
//         );
//         allColorBullet.style.top = `${offsetY}px`;

//         const percentage = offsetY / rect.height;
//         dynamicHue = Math.round(360 * percentage);

//         const finalColor = hslToRgb(dynamicHue / 360);

//         if (colorCode) {
//           colorCode.textContent = finalColor;
//         }

//         if (selectorField) {
//           setSelectorCanvas(dynamicHue);
//         }

//         updateTransparencyField(dynamicHue);

//         if (typeof saveFn === "function") {
//           saveFn(finalColor, currentTransparency / 100);

//           const rgbaColor = finalColor.startsWith("rgb(")
//             ? finalColor
//                 .replace("rgb(", "rgba(")
//                 .replace(")", `, ${currentTransparency / 100})`)
//             : finalColor;

//           overlayState.color = rgbaColor;
//           updateOverlayStyles();
//         }
//       };

//       document.onmouseup = () => {
//         document.onmousemove = null;
//         document.onmouseup = null;
//       };
//     };
//   }

//   if (selectorField && bullet) {
//     bullet.onmousedown = function (e) {
//       e.preventDefault();
//       document.onmousemove = function (e) {
//         const rect = selectorField.getBoundingClientRect();
//         let offsetX = e.clientX - rect.left;
//         let offsetY = e.clientY - rect.top;

//         offsetX = Math.max(
//           0,
//           Math.min(rect.width - bullet.offsetWidth, offsetX)
//         );
//         offsetY = Math.max(
//           0,
//           Math.min(rect.height - bullet.offsetHeight, offsetY)
//         );

//         bullet.style.left = `${offsetX}px`;
//         bullet.style.top = `${offsetY}px`;
//         const canvas = selectorField.querySelector("canvas");
//         const ctx = canvas.getContext("2d", { willReadFrequently: true });
//         if (!ctx) return;

//         const data = ctx.getImageData(offsetX, offsetY, 1, 1).data;
//         const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;

//         if (colorCode) {
//           colorCode.textContent = rgb;
//         }

//         if (typeof saveFn === "function") {
//           saveFn(rgb, currentTransparency / 100);
//         }
//       };

//       document.onmouseup = () => {
//         document.onmousemove = null;
//         document.onmouseup = null;
//       };
//     };
//   }

//   function getGradientCanvas(hue, width, height) {
//     const canvas = document.createElement("canvas");
//     const ctx = canvas.getContext("2d", { willReadFrequently: true });

//     canvas.width = width;
//     canvas.height = height;

//     const gradient1 = ctx.createLinearGradient(0, 0, width, 0);
//     gradient1.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
//     gradient1.addColorStop(1, "white");

//     const gradient2 = ctx.createLinearGradient(0, height, 0, 0);
//     gradient2.addColorStop(0, "black");
//     gradient2.addColorStop(1, "transparent");

//     ctx.fillStyle = gradient1;
//     ctx.fillRect(0, 0, width, height);
//     ctx.globalCompositeOperation = "multiply";
//     ctx.fillStyle = gradient2;
//     ctx.fillRect(0, 0, width, height);

//     return canvas;
//   }

//   function moveBullet(offsetX, offsetY) {
//     bullet.style.left = `${offsetX}px`;
//     bullet.style.top = `${offsetY}px`;

//     const width = selectorField.offsetWidth;
//     const height = selectorField.offsetHeight;
//     if (!width || !height) return;

//     const canvas = selectorField.querySelector("canvas");
//     const ctx = canvas?.getContext("2d");
//     if (!ctx) return;
//     const data = ctx.getImageData(offsetX, offsetY, 1, 1).data;
//     const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;

//     colorCode.textContent = rgb;
//     // applyButtonBackgroundColor(rgb);
//     // applyOverlayColorSmart(rgb, currentTransparency / 100);
//   }

//   if (transparencyField && transparencyBullet) {
//     transparencyBullet.onmousedown = function (e) {
//       e.preventDefault();
//       document.onmousemove = function (e) {
//         const rect = transparencyField.getBoundingClientRect();
//         let offsetY = e.clientY - rect.top;
//         offsetY = Math.max(
//           0,
//           Math.min(rect.height - transparencyBullet.offsetHeight, offsetY)
//         );
//         transparencyBullet.style.top = `${offsetY}px`;

//         const transparencyPercent =
//           100 - Math.round((offsetY / rect.height) * 100);
//         currentTransparency = transparencyPercent;
//         if (transparencyCount) {
//           transparencyCount.textContent = `${currentTransparency}%`;
//         }
//         const currentColor = colorCode?.textContent;
//         if (currentColor && typeof saveFn === "function") {
//           saveFn(currentColor, currentTransparency / 100);
//           // applyOverlayColorSmart(rgb, currentTransparency / 100);
//         }
//       };
//       document.onmouseup = () => {
//         document.onmousemove = null;
//         document.onmouseup = null;
//       };
//     };
//   }

//   if (container.innerHTML.trim() !== "") return;

//   Object.values(themeColors).forEach((color) => {
//     const cleanColor = color.replace(/['"]+/g, "");
//     const swatch = document.createElement("div");
//     swatch.className = "sc-border-colors sc-cursor-pointer";
//     swatch.style.backgroundColor = cleanColor;
//     swatch.style.width = "18px";
//     swatch.style.height = "18px";
//     swatch.style.borderRadius = "6px";
//     swatch.title = cleanColor;

//     swatch.onclick = () => {
//       const color = swatch.style.backgroundColor;

//       updateSelectorField(color);
//       if (allColorField && allColorBullet) {
//         const rect = allColorField.getBoundingClientRect();
//         const huePercentage = dynamicHue / 360;
//         const bulletTop = huePercentage * rect.height;
//         allColorBullet.style.top = `${bulletTop}px`;
//       }

//       if (typeof saveFn === "function") {
//         saveFn(color, currentTransparency / 100);
//       }

//       requestAnimationFrame(() => {
//         const canvas = selectorField.querySelector("canvas");
//         const ctx = canvas.getContext("2d");
//         const width = canvas.width;
//         const height = canvas.height;

//         let bestMatch = { x: 0, y: 0, diff: Infinity };

//         const [cr, cg, cb] = color
//           .replace(/[^\d,]/g, "")
//           .split(",")
//           .map((n) => parseInt(n.trim()));

//         for (let y = 0; y < height; y += 2) {
//           for (let x = 0; x < width; x += 2) {
//             const data = ctx.getImageData(x, y, 1, 1).data;
//             const diff =
//               Math.abs(data[0] - cr) +
//               Math.abs(data[1] - cg) +
//               Math.abs(data[2] - cb);
//             if (diff < bestMatch.diff) {
//               bestMatch = { x, y, diff };
//               if (diff <= 3) break;
//             }
//           }
//         }

//         moveBullet(bestMatch.x, bestMatch.y);
//         if (transparencyBullet && transparencyField) {
//           transparencyBullet.style.top = `0px`;
//         }
//         currentTransparency = 100;
//         if (transparencyCount) {
//           transparencyCount.textContent = `100%`;
//         }

//         if (colorCode) {
//           colorCode.textContent = color;
//         }
//       });
//     };

//     container.appendChild(swatch);
//   });

//   // Initialize with first color
//   // if (container.children.length > 0) {
//   //   const firstSwatchColor = container.children[0].style.backgroundColor;
//   //   updateSelectorField(firstSwatchColor);

//   //   const rect = selectorField.getBoundingClientRect();
//   //   const defaultX = Math.round(rect.width * 0.5);
//   //   const defaultY = Math.round(rect.height * 0.5);
//   //   bullet.style.left = `${defaultX}px`;
//   //   bullet.style.top = `${defaultY}px`;

//   //   const canvas = selectorField.querySelector("canvas");
//   //   const ctx = canvas?.getContext("2d");
//   //   if (ctx) {
//   //     const data = ctx.getImageData(defaultX, defaultY, 1, 1).data;
//   //     const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
//   //     colorCode.textContent = rgb;
//   //   }

//   //   transparencyBullet.style.top = `0px`;
//   //   currentTransparency = 100;
//   //   transparencyCount.textContent = `100%`;

//   //   if (typeof saveFn === "function") {
//   //     saveFn(firstSwatchColor, 1);
//   //   }
//   // }

//   if (container.children.length > 0) {
//     const firstSwatchColor = container.children[0].style.backgroundColor;

//     requestAnimationFrame(() => {
//       updateSelectorField(firstSwatchColor);

//       const rect = selectorField.getBoundingClientRect();
//       const defaultX = Math.round(rect.width * 0.5);
//       const defaultY = Math.round(rect.height * 0.5);
//       bullet.style.left = `${defaultX}px`;
//       bullet.style.top = `${defaultY}px`;

//       const canvas = selectorField.querySelector("canvas");
//       const ctx = canvas?.getContext("2d");
//       if (ctx) {
//         const data = ctx.getImageData(defaultX, defaultY, 1, 1).data;
//         colorCode.textContent = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
//       }

//       transparencyBullet.style.top = `0px`;
//       currentTransparency = 100;
//       transparencyCount.textContent = `100%`;

//       if (typeof saveFn === "function") {
//         saveFn(firstSwatchColor, 1);
//       }
//     });
//   }

//   function applyImageOverlayColor(color, alpha = 1) {
//     const selected = selectedElement?.();
//     if (!selected) return;

//     const blockId = selected.closest('[id^="block-"]')?.id;
//     if (!blockId) return;

//     // Compose the color in hex with alpha if needed
//     let rgbaColor = color.startsWith("rgb(")
//       ? color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
//       : color;

//     // If you want to convert rgb to hex with alpha, add a helper function

//     const styleId = `sc-overlay-style-${blockId}`;
//     let styleTag = document.getElementById(styleId);
//     if (!styleTag) {
//       styleTag = document.createElement("style");
//       styleTag.id = styleId;
//       document.head.appendChild(styleTag);
//     }
//   }

//   // applyImageOverlayColor("color", 1);
// }

export function initOverLayColorPalate(themeColors, prefix = "", saveFn) {
  const palette = document.getElementById(`${prefix}overLayFontColorPalate`);
  const container = document.getElementById(`${prefix}overlay-border-colors`);
  const selectorField = document.getElementById(
    `${prefix}overlay-color-selection-field`
  );
  const bullet = document.getElementById(
    `${prefix}overlay-color-selection-bar`
  );
  const colorCode = document.getElementById(
    `${prefix}overlay-image-color-code`
  );
  const transparencyCount = document.getElementById(
    `${prefix}overlay-image-color-transparency-count`
  );
  const allColorField = document.getElementById(
    `${prefix}overlay-image-all-color-selection-field`
  );
  const allColorBullet = document.getElementById(
    `${prefix}overlay-image-all-color-selection-bar`
  );
  const transparencyField = document.getElementById(
    `${prefix}overlay-image-color-transparency-field`
  );
  const transparencyBullet = document.getElementById(
    `${prefix}overlay-image-color-transparency-bar`
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

  const toRGBString = (r, g, b) =>
    `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;

  const renderCanvas = (hue) => {
    selectorField.innerHTML = "";
    selectorField.style.position = "relative";
    const canvas = document.createElement("canvas");
    canvas.width = selectorField.offsetWidth;
    canvas.height = selectorField.offsetHeight;
    const ctx = canvas.getContext("2d");

    const gradientX = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradientX.addColorStop(0, `hsl(${hue}, 100%, 50%)`);
    gradientX.addColorStop(1, "#fff");

    ctx.fillStyle = gradientX;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const gradientY = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradientY.addColorStop(0, "rgba(0,0,0,0)");
    gradientY.addColorStop(1, "rgba(0,0,0,1)");

    ctx.fillStyle = gradientY;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    canvas.style.position = "absolute";
    canvas.style.top = 0;
    canvas.style.left = 0;
    canvas.style.zIndex = 0;
    selectorField.appendChild(canvas);
    selectorField.appendChild(bullet);
  };

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

  if (allColorBullet) {
    allColorBullet.onmousedown = function (e) {
      e.preventDefault();
      document.onmousemove = function (e) {
        const rect = allColorField.getBoundingClientRect();
        let offsetY = Math.max(
          0,
          Math.min(
            rect.height - allColorBullet.offsetHeight,
            e.clientY - rect.top
          )
        );
        allColorBullet.style.top = `${offsetY}px`;

        dynamicHue = Math.round((offsetY / rect.height) * 360);
        renderCanvas(dynamicHue);

        transparencyField.style.background = `linear-gradient(to bottom,
          hsla(${dynamicHue}, 100%, 50%, 1),
          hsla(${dynamicHue}, 100%, 50%, 0)
        )`;
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }

  if (bullet && selectorField) {
    bullet.onmousedown = function (e) {
      e.preventDefault();
      document.onmousemove = function (e) {
        const rect = selectorField.getBoundingClientRect();
        let x = Math.max(0, Math.min(rect.width, e.clientX - rect.left));
        let y = Math.max(0, Math.min(rect.height, e.clientY - rect.top));

        bullet.style.left = `${x}px`;
        bullet.style.top = `${y}px`;

        const canvas = selectorField.querySelector("canvas");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const data = ctx.getImageData(x, y, 1, 1).data;
        const rgb = toRGBString(data[0], data[1], data[2]);
        colorCode.textContent = rgb;
        if (typeof saveFn === "function")
          saveFn(rgb, currentTransparency / 100);
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }

  if (transparencyBullet) {
    transparencyBullet.onmousedown = function (e) {
      e.preventDefault();
      document.onmousemove = function (e) {
        const rect = transparencyField.getBoundingClientRect();
        let offsetY = Math.max(
          0,
          Math.min(
            rect.height - transparencyBullet.offsetHeight,
            e.clientY - rect.top
          )
        );
        transparencyBullet.style.top = `${offsetY}px`;
        currentTransparency = 100 - Math.round((offsetY / rect.height) * 100);
        transparencyCount.textContent = `${currentTransparency}%`;

        const currentColor = colorCode.textContent;
        if (currentColor && typeof saveFn === "function") {
          saveFn(currentColor, currentTransparency / 100);
        }
      };
      document.onmouseup = () => {
        document.onmousemove = null;
        document.onmouseup = null;
      };
    };
  }

  palette.classList.toggle("sc-hidden");

  if (container.innerHTML.trim() !== "") return;

  Object.values(themeColors).forEach((color) => {
    const swatch = document.createElement("div");
    swatch.className = "sc-border-colors sc-cursor-pointer";
    swatch.style.backgroundColor = color;
    swatch.style.width = "18px";
    swatch.style.height = "18px";
    swatch.style.borderRadius = "6px";
    swatch.title = color;

    swatch.addEventListener("click", () => {
      const hsl = rgbToHslFromAny(color);
      if (hsl) dynamicHue = hsl.h;
      renderCanvas(dynamicHue);
      colorCode.textContent = color;
      if (typeof saveFn === "function")
        saveFn(color, currentTransparency / 100);
    });

    container.appendChild(swatch);
  });

  const firstColor = Object.values(themeColors)[0];
  if (firstColor) {
    const hsl = rgbToHslFromAny(firstColor);
    if (hsl) dynamicHue = hsl.h;
    renderCanvas(dynamicHue);
    colorCode.textContent = firstColor;
    if (typeof saveFn === "function") saveFn(firstColor, 1);
  }

  function rgbToHslFromAny(color) {
    let r, g, b;
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
    } else if (color.startsWith("rgb")) {
      const parts = color.match(/\d+/g);
      if (!parts) return null;
      r = parseInt(parts[0]);
      g = parseInt(parts[1]);
      b = parseInt(parts[2]);
    } else return null;

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
    return { h: Math.round(h), s, l };
  }
}
