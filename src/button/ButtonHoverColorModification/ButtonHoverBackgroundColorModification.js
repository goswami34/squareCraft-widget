export function ButtonHoverBackgroundColorModification(
  themeColors,
  selectedElement,
  saveButtonHoverColorModifications,
  addPendingModification,
  showNotification
) {
  // Helper function to manage unified button hover styles
  function updateButtonHoverStyles(buttonType, newStyles) {
    const styleId = `sc-hover-button-styles-${buttonType}`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    // Get existing styles from the button's dataset
    const currentElement = selectedElement?.();
    if (!currentElement) return;

    const allButtons = currentElement.querySelectorAll(
      `a.${buttonType}, button.${buttonType}`
    );

    allButtons.forEach((btn) => {
      // Merge new styles with existing ones
      const existingStyles = {
        backgroundColor: btn.dataset.scButtonHoverBackgroundColor || "",
        color: btn.dataset.scButtonHoverTextColor || "",
        ...newStyles,
      };

      // Update dataset
      if (newStyles.backgroundColor !== undefined) {
        btn.dataset.scButtonHoverBackgroundColor = newStyles.backgroundColor;
      }
      if (newStyles.color !== undefined) {
        btn.dataset.scButtonHoverTextColor = newStyles.color;
      }

      // Build combined CSS
      const cssProperties = [];
      if (existingStyles.backgroundColor) {
        cssProperties.push(
          `background-color: ${existingStyles.backgroundColor} !important`
        );
      }
      if (existingStyles.color) {
        cssProperties.push(`color: ${existingStyles.color} !important`);
      }

      if (cssProperties.length > 0) {
        styleTag.textContent = `
          a.${buttonType}:hover,
          button.${buttonType}:hover {
            ${cssProperties.join(";\n            ")}
          }
        `;
      }
    });
  }

  // ✅ NEW: Function to create and handle publish button for background color
  // function createBackgroundColorPublishButton() {
  //   // Check if publish button already exists
  //   let publishButton = document.getElementById(
  //     "hover-background-color-publish-btn"
  //   );
  //   if (publishButton) {
  //     return publishButton;
  //   }

  //   // Create publish button
  //   publishButton = document.createElement("button");
  //   publishButton.id = "hover-background-color-publish-btn";
  //   publishButton.className = "sc-publish-btn sc-background-color-publish-btn";
  //   publishButton.innerHTML = `
  //     <span class="btn-text">💾 Save Background Color</span>
  //     <span class="btn-loading" style="display: none;">⏳ Saving...</span>
  //   `;
  //   publishButton.style.cssText = `
  //     background: linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%);
  //     color: white;
  //     border: none;
  //     border-radius: 8px;
  //     padding: 10px 20px;
  //     font-size: 14px;
  //     font-weight: 600;
  //     cursor: pointer;
  //     transition: all 0.3s ease;
  //     box-shadow: 0 4px 15px rgba(255, 107, 107, 0.3);
  //     margin-top: 15px;
  //     width: 100%;
  //     display: flex;
  //     align-items: center;
  //     justify-content: center;
  //     gap: 8px;
  //   `;

  //   // Add hover effects
  //   publishButton.addEventListener("mouseenter", () => {
  //     publishButton.style.transform = "translateY(-2px)";
  //     publishButton.style.boxShadow = "0 6px 20px rgba(255, 107, 107, 0.4)";
  //   });

  //   publishButton.addEventListener("mouseleave", () => {
  //     publishButton.style.transform = "translateY(0)";
  //     publishButton.style.boxShadow = "0 4px 15px rgba(255, 107, 107, 0.3)";
  //   });

  //   // Add click handler
  //   publishButton.addEventListener("click", async () => {
  //     try {
  //       // Show loading state
  //       const btnText = publishButton.querySelector(".btn-text");
  //       const btnLoading = publishButton.querySelector(".btn-loading");
  //       btnText.style.display = "none";
  //       btnLoading.style.display = "inline";
  //       publishButton.disabled = true;

  //       // Get current element and block ID
  //       const currentElement = selectedElement?.();
  //       console.log("🔍 DEBUG: Current element:", currentElement);

  //       if (!currentElement) {
  //         throw new Error("No element selected");
  //       }

  //       // Debug: Check all possible block ID sources
  //       const dataBlockId = currentElement.getAttribute("data-block-id");
  //       const elementId = currentElement.id;
  //       const closestDataBlockId = currentElement
  //         .closest("[data-block-id]")
  //         ?.getAttribute("data-block-id");

  //       console.log("🔍 DEBUG: Block ID sources:", {
  //         dataBlockId,
  //         elementId,
  //         closestDataBlockId,
  //         element: currentElement,
  //       });

  //       const blockId = dataBlockId || elementId || closestDataBlockId;

  //       console.log("🔍 DEBUG: Final block ID:", blockId);

  //       if (!blockId) {
  //         throw new Error("Could not determine block ID");
  //       }

  //       // Debug: Check if pendingModifications exists and has data
  //       console.log(
  //         "🔍 DEBUG: window.pendingModifications:",
  //         window.pendingModifications
  //       );
  //       console.log(
  //         "🔍 DEBUG: typeof window.pendingModifications:",
  //         typeof window.pendingModifications
  //       );
  //       console.log(
  //         "🔍 DEBUG: window.pendingModifications instanceof Map:",
  //         window.pendingModifications instanceof Map
  //       );

  //       if (window.pendingModifications) {
  //         console.log(
  //           "🔍 DEBUG: All pending modifications:",
  //           Array.from(window.pendingModifications.entries())
  //         );
  //         console.log(
  //           "🔍 DEBUG: Has blockId:",
  //           window.pendingModifications.has(blockId)
  //         );
  //         if (window.pendingModifications.has(blockId)) {
  //           console.log(
  //             "🔍 DEBUG: Modifications for this block:",
  //             window.pendingModifications.get(blockId)
  //           );
  //         }
  //       }

  //       // Get all button hover background color modifications for this block
  //       const backgroundColorMods =
  //         window.pendingModifications
  //           ?.get(blockId)
  //           ?.filter((mod) => mod.tagType === "buttonHoverBackgroundColor") ||
  //         [];

  //       console.log(
  //         "🔍 DEBUG: Background color modifications found:",
  //         backgroundColorMods
  //       );
  //       console.log(
  //         "🔍 DEBUG: Number of background color mods:",
  //         backgroundColorMods.length
  //       );

  //       if (backgroundColorMods.length === 0) {
  //         throw new Error("No background color modifications to save");
  //       }

  //       // Create the CSS payload for background color
  //       const cssPayload = {
  //         buttonPrimary: { styles: {} },
  //         buttonSecondary: { styles: {} },
  //         buttonTertiary: { styles: {} },
  //       };

  //       // Merge all background color modifications
  //       backgroundColorMods.forEach((mod) => {
  //         console.log("🔍 DEBUG: Processing modification:", mod);
  //         if (mod.css?.buttonPrimary?.styles?.backgroundColor) {
  //           cssPayload.buttonPrimary.styles.backgroundColor =
  //             mod.css.buttonPrimary.styles.backgroundColor;
  //         }
  //         if (mod.css?.buttonSecondary?.styles?.backgroundColor) {
  //           cssPayload.buttonSecondary.styles.backgroundColor =
  //             mod.css.buttonSecondary.styles.backgroundColor;
  //         }
  //         if (mod.css?.buttonTertiary?.styles?.backgroundColor) {
  //           cssPayload.buttonTertiary.styles.backgroundColor =
  //             mod.css.buttonTertiary.styles.backgroundColor;
  //         }
  //       });

  //       console.log("🔍 DEBUG: Final CSS payload:", cssPayload);

  //       // Save to database
  //       console.log(
  //         "🔍 DEBUG: About to call saveButtonHoverColorModifications with:",
  //         {
  //           blockId,
  //           cssPayload,
  //         }
  //       );

  //       const result = await saveButtonHoverColorModifications(
  //         blockId,
  //         cssPayload
  //       );

  //       console.log("🔍 DEBUG: Save result:", result);

  //       if (result.success) {
  //         showNotification(
  //           "✅ Background color saved successfully!",
  //           "success"
  //         );

  //         // Remove the saved modifications from pending
  //         if (window.pendingModifications?.has(blockId)) {
  //           const remainingMods = window.pendingModifications
  //             .get(blockId)
  //             .filter((mod) => mod.tagType !== "buttonHoverBackgroundColor");
  //           if (remainingMods.length === 0) {
  //             window.pendingModifications.delete(blockId);
  //           } else {
  //             window.pendingModifications.set(blockId, remainingMods);
  //           }
  //           console.log(
  //             "🔍 DEBUG: Updated pending modifications:",
  //             Array.from(window.pendingModifications.entries())
  //           );
  //         }
  //       } else {
  //         throw new Error(result.error || "Failed to save background color");
  //       }
  //     } catch (error) {
  //       console.error("❌ Error saving background color:", error);
  //       showNotification(`❌ ${error.message}`, "error");
  //     } finally {
  //       // Reset button state
  //       const btnText = publishButton.querySelector(".btn-text");
  //       const btnLoading = publishButton.querySelector(".btn-loading");
  //       btnText.style.display = "inline";
  //       btnLoading.style.display = "none";
  //       publishButton.disabled = false;
  //     }
  //   });

  //   return publishButton;
  // }

  // ✅ Reuse the global Publish button from html.js
  function createBackgroundColorPublishButton() {
    // Get the Publish button that html() renders
    let publishButton = document.getElementById("publish");

    // If it doesn't exist yet, bail out (html() may not have rendered yet)
    if (!publishButton) {
      console.warn("❌ 'publish' button not found in DOM yet.");
      return null;
    }

    // Prevent attaching the same handler multiple times
    if (publishButton.dataset.hoverBgBound === "1") {
      return publishButton;
    }
    publishButton.dataset.hoverBgBound = "1";
    publishButton.classList.add("sc-background-color-publish-btn");

    // Small helper to show a loading state without changing button structure
    const setLoading = (state) => {
      publishButton.style.pointerEvents = state ? "none" : "auto";
      publishButton.style.opacity = state ? "0.6" : "1";
      publishButton.dataset.loading = state ? "1" : "0";
      // keep the label consistent with your UI
      publishButton.textContent = state ? "⏳ Saving..." : "Publish";
    };

    // Attach click handler (migrated from your previous create button code)
    publishButton.addEventListener("click", async () => {
      try {
        setLoading(true);

        const currentElement = selectedElement?.();
        if (!currentElement) throw new Error("No element selected");

        const dataBlockId = currentElement.getAttribute("data-block-id");
        const elementId = currentElement.id;
        const closestDataBlockId = currentElement
          .closest?.("[data-block-id]")
          ?.getAttribute("data-block-id");
        const blockId = dataBlockId || elementId || closestDataBlockId;
        if (!blockId) throw new Error("Could not determine block ID");

        // Gather pending hover background-color mods for this block
        const backgroundColorMods =
          window.pendingModifications
            ?.get(blockId)
            ?.filter((m) => m.tagType === "buttonHoverBackgroundColor") || [];

        if (backgroundColorMods.length === 0) {
          throw new Error("No background color modifications to save");
        }

        // Build payload
        const cssPayload = {
          buttonPrimary: { styles: {} },
          buttonSecondary: { styles: {} },
          buttonTertiary: { styles: {} },
        };

        backgroundColorMods.forEach((mod) => {
          if (mod.css?.buttonPrimary?.styles?.backgroundColor) {
            cssPayload.buttonPrimary.styles.backgroundColor =
              mod.css.buttonPrimary.styles.backgroundColor;
          }
          if (mod.css?.buttonSecondary?.styles?.backgroundColor) {
            cssPayload.buttonSecondary.styles.backgroundColor =
              mod.css.buttonSecondary.styles.backgroundColor;
          }
          if (mod.css?.buttonTertiary?.styles?.backgroundColor) {
            cssPayload.buttonTertiary.styles.backgroundColor =
              mod.css.buttonTertiary.styles.backgroundColor;
          }
        });

        // Save
        const result = await saveButtonHoverColorModifications(
          blockId,
          cssPayload
        );

        if (result?.success) {
          showNotification(
            "✅ Background color saved successfully!",
            "success"
          );

          // Clear only the saved hover-bg-color mods for this block
          if (window.pendingModifications?.has(blockId)) {
            const remaining = window.pendingModifications
              .get(blockId)
              .filter((m) => m.tagType !== "buttonHoverBackgroundColor");
            if (remaining.length === 0)
              window.pendingModifications.delete(blockId);
            else window.pendingModifications.set(blockId, remaining);
          }
        } else {
          throw new Error(result?.error || "Failed to save background color");
        }
      } catch (err) {
        console.error("❌ Error saving background color:", err);
        showNotification(`❌ ${err.message}`, "error");
      } finally {
        setLoading(false);
      }
    });

    return publishButton;
  }

  const palette = document.getElementById(
    "hover-button-background-color-palette"
  );
  const container = document.getElementById("hover-button-hover-color-colors");
  const selectorField = document.getElementById(
    "button-hover-background-color-selection-field"
  );
  const bullet = document.getElementById(
    "button-hover-background-color-selection-bar"
  );
  const colorCode = document.getElementById(
    "button-hover-background-color-code"
  );
  const transparencyCount = document.getElementById(
    "button-hover-background-color-transparency-count"
  );
  const allColorField = document.getElementById(
    "button-hover-all-color-selection-field"
  );
  const allColorBullet = document.getElementById(
    "button-hover-all-color-selection-bar"
  );
  const transparencyField = document.getElementById(
    "button-hover-background-color-transparency-field"
  );
  const transparencyBullet = document.getElementById(
    "button-hover-background-color-transparency-bar"
  );

  if (
    !palette ||
    !container ||
    !selectorField ||
    !bullet ||
    !colorCode ||
    !transparencyCount
  ) {
    return;
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
      // Check for both <a> and <button> tags with the button class
      if (
        currentElement.querySelector(`a.${type}`) ||
        currentElement.querySelector(`button.${type}`)
      ) {
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

    // Use the unified style management function
    updateButtonHoverStyles(buttonType, { backgroundColor: rgbaColor });

    console.log(
      "🖌️ APPLYING HOVER BACKGROUND COLOR:",
      rgbaColor,
      "on",
      buttonType
    );

    // Save modifications if functions are provided
    if (
      typeof saveButtonHoverColorModifications === "function" &&
      typeof addPendingModification === "function"
    ) {
      const blockId = currentElement.id;
      console.log("🔍 DEBUG: applyButtonBackgroundColor - blockId:", blockId);
      console.log(
        "🔍 DEBUG: applyButtonBackgroundColor - currentElement:",
        currentElement
      );
      console.log(
        "🔍 DEBUG: applyButtonBackgroundColor - currentElement.id:",
        currentElement.id
      );
      console.log(
        "🔍 DEBUG: applyButtonBackgroundColor - currentElement.getAttribute('data-block-id'):",
        currentElement.getAttribute("data-block-id")
      );

      if (blockId) {
        // Map button type to the correct key
        const buttonKey =
          buttonType === "sqs-button-element--primary"
            ? "buttonPrimary"
            : buttonType === "sqs-button-element--secondary"
            ? "buttonSecondary"
            : buttonType === "sqs-button-element--tertiary"
            ? "buttonTertiary"
            : "buttonPrimary";

        const stylePayload = {
          buttonPrimary: {
            selector: ".sqs-button-element--primary:hover",
            styles:
              buttonKey === "buttonPrimary"
                ? { backgroundColor: rgbaColor }
                : {},
          },
          buttonSecondary: {
            selector: ".sqs-button-element--secondary:hover",
            styles:
              buttonKey === "buttonSecondary"
                ? { backgroundColor: rgbaColor }
                : {},
          },
          buttonTertiary: {
            selector: ".sqs-button-element--tertiary:hover",
            styles:
              buttonKey === "buttonTertiary"
                ? { backgroundColor: rgbaColor }
                : {},
          },
        };

        console.log("🔍 DEBUG: About to call addPendingModification with:", {
          blockId,
          stylePayload,
          tagType: "buttonHoverBackgroundColor",
          buttonType,
          buttonKey,
          rgbaColor,
        });

        addPendingModification(
          blockId,
          stylePayload,
          "buttonHoverBackgroundColor"
        );

        console.log("✅ DEBUG: addPendingModification called successfully");

        // Debug: Check if the modification was added
        console.log(
          "🔍 DEBUG: After addPendingModification - window.pendingModifications:",
          window.pendingModifications
        );
        if (
          window.pendingModifications &&
          window.pendingModifications.has(blockId)
        ) {
          console.log(
            "🔍 DEBUG: Modifications for this block after adding:",
            window.pendingModifications.get(blockId)
          );
        }

        if (showNotification) {
          showNotification(
            `Hover background color applied to ${buttonType}`,
            "success"
          );
        }
      } else {
        console.warn(
          "⚠️ No block ID found for currentElement:",
          currentElement
        );
      }
    } else {
      console.warn("⚠️ Required functions not available:", {
        saveButtonHoverColorModifications:
          typeof saveButtonHoverColorModifications,
        addPendingModification: typeof addPendingModification,
      });
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
              hsla(${dynamicHue}, 100%, 50%, 1),
              hsla(${dynamicHue}, 100%, 50%, 0)
            )`;
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
        applyButtonBackgroundColor(finalColor, currentTransparency / 100);
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
        applyButtonBackgroundColor(finalColor, currentTransparency / 100);
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
          applyButtonBackgroundColor(
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
      colorCode.textContent = convertToRGB(cleanColor);

      // Apply the color to button border
      applyButtonBackgroundColor(cleanColor, currentTransparency / 100);
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
          colorCode.textContent = convertToRGB(finalColor);
        }

        // Apply the color to button border
        applyButtonBackgroundColor(finalColor, currentTransparency / 100);
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

    applyButtonBackgroundColor(firstColor, currentTransparency / 100);
  }

  // ✅ NEW: Add publish button to the UI
  // function addPublishButtonToUI() {
  //   // Find the container to add the publish button
  //   const publishButtonContainer = document.getElementById(
  //     "hover-button-background-color-palette"
  //   );
  //   if (!publishButtonContainer) {
  //     console.warn(
  //       "❌ Could not find palette container for background color publish button"
  //     );
  //     return;
  //   }

  //   // Create and add the publish button
  //   const publishButton = createBackgroundColorPublishButton();

  //   // Check if button already exists in the container
  //   const existingButton = publishButtonContainer.querySelector(
  //     "#hover-background-color-publish-btn"
  //   );
  //   if (!existingButton) {
  //     publishButtonContainer.appendChild(publishButton);
  //     console.log("✅ Background color publish button added to UI");
  //   }
  // }

  // // Initialize the publish button
  // setTimeout(addPublishButtonToUI, 100);
}
