// // Store pending modifications locally (like image border controls)
// const pendingButtonTextColorModifications = new Map();

// // Make available globally for clearing after publish
// window.pendingButtonTextColorModifications =
//   pendingButtonTextColorModifications;

// // Function to merge and save button text color styles locally
// function mergeAndSaveButtonTextColorStyles(blockId, newStyles) {
//   console.log("🔄 mergeAndSaveButtonTextColorStyles called with:", {
//     blockId,
//     newStyles,
//   });

//   const prevStyles = pendingButtonTextColorModifications.get(blockId) || {
//     buttonPrimary: {
//       selector: ".sqs-button-element--primary",
//       styles: {},
//     },
//     buttonSecondary: {
//       selector: ".sqs-button-element--secondary",
//       styles: {},
//     },
//     buttonTertiary: {
//       selector: ".sqs-button-element--tertiary",
//       styles: {},
//     },
//   };

//   const finalData = {
//     buttonPrimary: {
//       selector: prevStyles.buttonPrimary.selector,
//       styles: {
//         ...prevStyles.buttonPrimary.styles,
//         ...(newStyles.buttonPrimary?.styles || {}),
//       },
//     },
//     buttonSecondary: {
//       selector: prevStyles.buttonSecondary.selector,
//       styles: {
//         ...prevStyles.buttonSecondary.styles,
//         ...(newStyles.buttonSecondary?.styles || {}),
//       },
//     },
//     buttonTertiary: {
//       selector: prevStyles.buttonTertiary.selector,
//       styles: {
//         ...prevStyles.buttonTertiary.styles,
//         ...(newStyles.buttonTertiary?.styles || {}),
//       },
//     },
//   };

//   // Save to local pending modifications
//   pendingButtonTextColorModifications.set(blockId, finalData);

//   console.log("💾 Added to pending button text color modifications:", {
//     blockId,
//     finalData,
//     pendingCount: pendingButtonTextColorModifications.size,
//   });
// }

// // Note: Individual publish function removed - now handled by global handlePublish in squareCraft.js
// // This ensures proper merging of background and text colors

// export function ButtonTextColorPalate(
//   themeColors,
//   selectedElement,
//   addPendingModification,
//   showNotification
// ) {
//   // Use correct IDs matching the HTML
//   const palette = document.getElementById("button-text-color-palette");
//   const container = document.getElementById("button-text-colors-palette");
//   const selectorField = document.getElementById(
//     "button-text-border-color-selection-field"
//   );
//   const bullet = document.getElementById(
//     "button-text-border-color-selection-bar"
//   );
//   const colorCode = document.getElementById("button-text-border-color-code");
//   const transparencyCount = document.getElementById(
//     "button-text-border-color-transparency-count"
//   );
//   const allColorField = document.getElementById(
//     "button-text-border-color-all-color-selction-field"
//   );
//   const allColorBullet = document.getElementById(
//     "button-text-border-color-all-color-selction-bar"
//   );
//   const transparencyField = document.getElementById(
//     "button-text-border-color-transparency-field"
//   );
//   const transparencyBullet = document.getElementById(
//     "button-text-border-color-transparency-bar"
//   );

//   // Button-specific text color application function
//   function applyButtonTextColorFromPalette(color, alpha = 1) {
//     const currentElement = selectedElement?.();
//     if (!currentElement) return;

//     const btn = currentElement.querySelector(
//       ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
//     );
//     if (!btn) return;

//     const typeClass = [...btn.classList].find((cls) =>
//       cls.startsWith("sqs-button-element--")
//     );
//     if (!typeClass) return;

//     // Convert color to rgba
//     let rgbaColor;
//     if (color.startsWith("rgb(")) {
//       rgbaColor = color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
//     } else if (color.startsWith("rgba(")) {
//       rgbaColor = color.replace(
//         /rgba\(([^,]+),([^,]+),([^,]+),([^)]+)\)/,
//         (_, r, g, b) => `rgba(${r},${g},${b},${alpha})`
//       );
//     } else {
//       const tempDiv = document.createElement("div");
//       tempDiv.style.color = color;
//       document.body.appendChild(tempDiv);
//       const rgb = getComputedStyle(tempDiv).color;
//       document.body.removeChild(tempDiv);
//       rgbaColor = rgb.replace("rgb(", "rgba(").replace(")", `, ${alpha})`);
//     }

//     // Apply text color to button
//     const styleId = `sc-button-text-color-${typeClass}`;
//     let styleTag = document.getElementById(styleId);
//     if (!styleTag) {
//       styleTag = document.createElement("style");
//       styleTag.id = styleId;
//       document.head.appendChild(styleTag);
//     }

//     styleTag.innerHTML = `
//         .${typeClass} {
//           color: ${rgbaColor} !important;
//         }
//         .${typeClass} span,
//         .${typeClass} .sqs-add-to-cart-button-inner {
//           color: ${rgbaColor} !important;
//         }
//         .${typeClass}:hover {
//           color: ${rgbaColor} !important;
//         }
//         .${typeClass}:hover span,
//         .${typeClass}:hover .sqs-add-to-cart-button-inner {
//           color: ${rgbaColor} !important;
//         }
//       `;

//     // Add to local pending modifications (like image border controls)
//     const blockId = currentElement.id;
//     if (blockId) {
//       // Create proper data structure for button color modifications
//       // Only set color for the specific button type that was clicked
//       const stylePayload = {
//         buttonPrimary: {
//           selector: ".sqs-button-element--primary",
//           styles:
//             typeClass === "sqs-button-element--primary"
//               ? { color: rgbaColor }
//               : {},
//         },
//         buttonSecondary: {
//           selector: ".sqs-button-element--secondary",
//           styles:
//             typeClass === "sqs-button-element--secondary"
//               ? { color: rgbaColor }
//               : {},
//         },
//         buttonTertiary: {
//           selector: ".sqs-button-element--tertiary",
//           styles:
//             typeClass === "sqs-button-element--tertiary"
//               ? { color: rgbaColor }
//               : {},
//         },
//       };

//       // Check if background color exists and merge with text color
//       const existingBackgroundColorData =
//         pendingButtonBackgroundColorModifications.get(blockId);
//       if (existingBackgroundColorData) {
//         console.log("🔄 Merging text color with existing background color");

//         // Merge background color into text color data
//         const mergedData = {
//           buttonPrimary: {
//             selector: ".sqs-button-element--primary",
//             styles: {
//               ...existingBackgroundColorData.buttonPrimary.styles,
//               ...stylePayload.buttonPrimary.styles,
//             },
//           },
//           buttonSecondary: {
//             selector: ".sqs-button-element--secondary",
//             styles: {
//               ...existingBackgroundColorData.buttonSecondary.styles,
//               ...stylePayload.buttonSecondary.styles,
//             },
//           },
//           buttonTertiary: {
//             selector: ".sqs-button-element--tertiary",
//             styles: {
//               ...existingBackgroundColorData.buttonTertiary.styles,
//               ...stylePayload.buttonTertiary.styles,
//             },
//           },
//         };

//         // Save merged data to text color storage
//         pendingButtonTextColorModifications.set(blockId, mergedData);
//         console.log("✅ Text color merged with background color and saved");
//       } else {
//         // Save to local pending modifications (for individual publish)
//         mergeAndSaveButtonTextColorStyles(blockId, stylePayload);
//         console.log("✅ Text color saved to local pending modifications");
//       }

//       if (showNotification) {
//         showNotification(
//           `Button text color applied to ${typeClass.replace(
//             "sqs-button-element--",
//             ""
//           )} button`,
//           "success"
//         );
//       }
//     }
//   }

//   function updateTransparencyField(hue) {
//     if (transparencyField) {
//       transparencyField.style.background = `linear-gradient(to bottom,
//           hsla(${hue}, 100%, 50%, 1),
//           hsla(${hue}, 100%, 50%, 0)
//         )`;
//     }
//   }

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
//           hsl(0, 100%, 50%),
//           hsl(60, 100%, 50%),
//           hsl(120, 100%, 50%),
//           hsl(180, 100%, 50%),
//           hsl(240, 100%, 50%),
//           hsl(300, 100%, 50%),
//           hsl(360, 100%, 50%)
//         )`;
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
//         applyButtonTextColorFromPalette(finalColor, currentTransparency / 100);
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

//         applyButtonTextColorFromPalette(rgb, currentTransparency / 100);
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
//     applyButtonTextColorFromPalette(rgb, currentTransparency / 100);
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
//         if (currentColor) {
//           applyButtonTextColorFromPalette(
//             currentColor,
//             currentTransparency / 100
//           );
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
//       // Move allColorBullet to match dynamicHue
//       if (allColorField && allColorBullet) {
//         const rect = allColorField.getBoundingClientRect();
//         const huePercentage = dynamicHue / 360;
//         const bulletTop = huePercentage * rect.height;
//         allColorBullet.style.top = `${bulletTop}px`;
//       }

//       applyButtonTextColorFromPalette(color, currentTransparency / 100);

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

//         // Update the color code display
//         if (colorCode) {
//           colorCode.textContent = color;
//         }
//       });

//       applyButtonTextColorFromPalette(color, currentTransparency / 100);
//     };

//     container.appendChild(swatch);
//   });

//   if (container.children.length > 0) {
//     const firstSwatchColor = container.children[0].style.backgroundColor;

//     updateSelectorField(firstSwatchColor);

//     const rect = selectorField.getBoundingClientRect();
//     const defaultX = Math.round(rect.width * 0.5);
//     const defaultY = Math.round(rect.height * 0.5);
//     bullet.style.left = `${defaultX}px`;
//     bullet.style.top = `${defaultY}px`;

//     const canvas = selectorField.querySelector("canvas");
//     const ctx = canvas?.getContext("2d");
//     if (ctx) {
//       const data = ctx.getImageData(defaultX, defaultY, 1, 1).data;
//       const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
//       colorCode.textContent = rgb;
//     }

//     transparencyBullet.style.top = `0px`;
//     currentTransparency = 100;
//     transparencyCount.textContent = `100%`;

//     requestAnimationFrame(() => {
//       setTimeout(() => {
//         updateSelectorField(firstSwatchColor);

//         const rect = selectorField.getBoundingClientRect();
//         const defaultX = Math.round(rect.width * 0.5);
//         const defaultY = Math.round(rect.height * 0.5);
//         bullet.style.left = `${defaultX}px`;
//         bullet.style.top = `${defaultY}px`;

//         const canvas = selectorField.querySelector("canvas");
//         const ctx = canvas?.getContext("2d");
//         if (ctx) {
//           const data = ctx.getImageData(defaultX, defaultY, 1, 1).data;
//           const rgb = `rgb(${data[0]}, ${data[1]}, ${data[2]})`;
//           colorCode.textContent = rgb;
//         }

//         transparencyBullet.style.top = `0px`;
//         currentTransparency = 100;
//         transparencyCount.textContent = `100%`;
//       }, 50);
//     });
//   }

//   if (container.children.length === 0) {
//     const defaultColor =
//       Object.values(themeColors)[0]?.replace(/['"]+/g, "") || "rgb(255, 0, 0)";
//     updateSelectorField(defaultColor);
//     moveBullet(0, 0);

//     if (transparencyBullet && transparencyField) {
//       transparencyBullet.style.top = `0px`;
//     }
//     currentTransparency = 100;
//     if (transparencyCount) {
//       transparencyCount.textContent = `100%`;
//     }
//   }

//   // Add publish button handler for text color
//   const publishButton = document.getElementById("publish");
//   if (publishButton) {
//     // Remove existing listener to avoid duplicates
//     publishButton.removeEventListener(
//       "click",
//       publishButton.buttonTextColorPublishHandler
//     );

//     // Create new handler
//     publishButton.buttonTextColorPublishHandler = async () => {
//       try {
//         console.log("🚀 Text color publish button clicked");

//         if (pendingButtonTextColorModifications.size === 0) {
//           console.log("No text color changes to publish");
//           return;
//         }

//         // Import saveButtonColorModifications if not available
//         let saveButtonColorModifications;
//         if (typeof window.saveButtonColorModifications === "function") {
//           saveButtonColorModifications = window.saveButtonColorModifications;
//         } else {
//           const { saveButtonColorModifications: importedFunction } =
//             await import(
//               "https://goswami34.github.io/squareCraft-widget/html.js"
//             );
//           saveButtonColorModifications = importedFunction;
//         }

//         // Save each pending modification
//         for (const [
//           blockId,
//           buttonTextColorData,
//         ] of pendingButtonTextColorModifications) {
//           console.log(
//             "Publishing text color for block:",
//             blockId,
//             buttonTextColorData
//           );
//           await saveButtonColorModifications(blockId, buttonTextColorData);
//         }

//         // Clear both pending modifications after successful publish
//         pendingButtonTextColorModifications.clear();
//         pendingButtonBackgroundColorModifications.clear();
//         console.log("All button color changes published successfully!");

//         if (showNotification) {
//           showNotification("Text color saved successfully!", "success");
//         }
//       } catch (error) {
//         console.error("Failed to publish text color modifications:", error);
//         if (showNotification) {
//           showNotification(
//             `Failed to save text color: ${error.message}`,
//             "error"
//           );
//         }
//       }
//     };

//     // Add the handler
//     publishButton.addEventListener(
//       "click",
//       publishButton.buttonTextColorPublishHandler
//     );
//     console.log("✅ Text color publish button handler added");
//   }
// }

// // Note: Export removed - function no longer exists, handled by global handlePublish
