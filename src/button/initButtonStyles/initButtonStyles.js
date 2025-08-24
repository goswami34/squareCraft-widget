const { buttonShadowColorPalate } = await import(
  "https://goswami34.github.io/squareCraft-widget/src/button/ButtonShadowColorPalate/buttonShadowColorPalate.js"
);

const { saveButtonIconModifications, saveButtonShadowModifications } =
  await import("https://goswami34.github.io/squareCraft-widget/html.js");

// Add this helper function after the imports and before the existing functions
async function updateIconStyles(blockId, typeClass, newStyles) {
  if (!blockId || !typeClass || !newStyles) {
    console.warn("❌ Missing required data for icon styles update:", {
      blockId,
      typeClass,
      newStyles,
    });
    return;
  }

  try {
    console.log("🔄 Updating icon styles:", { blockId, typeClass, newStyles });

    // First, try to fetch existing icon data to merge with
    let existingStyles = {};
    try {
      const userId = localStorage.getItem("sc_u_id");
      const token = localStorage.getItem("sc_auth_token");
      const widgetId = localStorage.getItem("sc_w_id");
      const pageId = document
        .querySelector("article[data-page-sections]")
        ?.getAttribute("data-page-sections");

      if (userId && token && widgetId && pageId) {
        const url = `https://admin.squareplugin.com/api/v1/fetch-button-icon-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}&elementId=${blockId}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const result = await res.json();
          const modifications = result.modifications || [];
          modifications.forEach((mod) => {
            const elements = mod.elements || [];
            elements.forEach(({ elementId, icon }) => {
              if (elementId === blockId && icon) {
                const buttonType = typeClass.replace(
                  "sqs-button-element--",
                  ""
                );
                const existingIconData =
                  icon[
                    `button${
                      buttonType.charAt(0).toUpperCase() + buttonType.slice(1)
                    }`
                  ];
                if (existingIconData && existingIconData.styles) {
                  existingStyles = { ...existingIconData.styles };
                  console.log("📥 Found existing styles:", existingStyles);
                }
              }
            });
          });
        }
      }
    } catch (fetchError) {
      console.warn(
        "⚠️ Could not fetch existing styles from database:",
        fetchError
      );
    }

    // Fallback: Get ALL existing properties from DOM if not found in database
    if (Object.keys(existingStyles).length === 0 || !existingStyles.src) {
      const selectedElement = document.getElementById(blockId);
      if (selectedElement) {
        const btn = selectedElement.querySelector(`a.${typeClass}`);
        if (btn) {
          const icon = btn.querySelector(
            ".sqscraft-button-icon, .sqscraft-image-icon"
          );
          if (icon) {
            // Get all computed styles from the icon
            const computedStyles = window.getComputedStyle(icon);
            const buttonComputedStyles = window.getComputedStyle(btn);

            // Preserve essential properties
            if (icon.src) existingStyles.src = icon.src;
            if (icon.style.width) existingStyles.width = icon.style.width;
            if (icon.style.height) existingStyles.height = icon.style.height;
            if (icon.style.transform)
              existingStyles.transform = icon.style.transform;

            // Gap is applied to the button element, not the icon
            if (btn.style.gap) existingStyles.gap = btn.style.gap;

            // Also get from computed styles if inline styles are not set
            if (!existingStyles.width && computedStyles.width !== "auto") {
              existingStyles.width = computedStyles.width;
            }
            if (!existingStyles.height && computedStyles.height !== "auto") {
              existingStyles.height = computedStyles.height;
            }
            if (
              !existingStyles.transform &&
              computedStyles.transform !== "none"
            ) {
              existingStyles.transform = computedStyles.transform;
            }
            // Gap is applied to the button element, not the icon
            if (!existingStyles.gap && buttonComputedStyles.gap !== "normal") {
              existingStyles.gap = buttonComputedStyles.gap;
            }

            console.log("📥 Found properties from DOM:", existingStyles);
          }
        }
      }
    }

    // Merge existing styles with new styles
    const mergedStyles = { ...existingStyles, ...newStyles };

    // CRITICAL: Always preserve the src property from existing styles
    // This prevents the icon from being removed when updating other properties
    if (existingStyles.src) {
      mergedStyles.src = existingStyles.src;
      console.log("🔒 Preserved src property:", existingStyles.src);
    }

    // CRITICAL: Preserve ALL existing properties that are not being updated
    // This prevents properties from being lost when updating other properties
    Object.keys(existingStyles).forEach((key) => {
      if (!newStyles.hasOwnProperty(key)) {
        mergedStyles[key] = existingStyles[key];
        console.log(
          `🔒 Preserved existing property: ${key} = ${existingStyles[key]}`
        );
      }
    });

    console.log("🔀 Merged styles:", mergedStyles);

    // CRITICAL: Don't save if we don't have a src property
    // This prevents the icon from being removed
    if (!mergedStyles.src) {
      console.warn(
        "⚠️ No src property found, skipping save to prevent icon removal"
      );
      return { success: false, error: "No src property found" };
    }

    // Debug: Log what we're sending to the database
    console.log("🟢 Saving to DB:", {
      blockId,
      selector: `.${typeClass} .sqscraft-button-icon`,
      mergedStyles,
    });

    // Store in pending modifications instead of saving immediately
    if (!window.pendingModifications) {
      window.pendingModifications = new Map();
    }

    if (!window.pendingModifications.has(blockId)) {
      window.pendingModifications.set(blockId, []);
    }

    // Remove any existing buttonIcon modifications for this block
    const existingModifications = window.pendingModifications.get(blockId);
    const filteredModifications = existingModifications.filter(
      (mod) => mod.tagType !== "buttonIcon"
    );

    // Add the new modification
    filteredModifications.push({
      tagType: "buttonIcon",
      css: {
        iconProperties: {
          selector: `.${typeClass} .sqscraft-button-icon`,
          styles: mergedStyles,
        },
        buttonType: typeClass.replace("sqs-button-element--", ""),
        applyToAllTypes: false,
      },
    });

    window.pendingModifications.set(blockId, filteredModifications);

    console.log(
      "📝 Icon styles stored in pending modifications for block:",
      blockId
    );
    console.log(
      "📝 Current pending modifications:",
      window.pendingModifications
    );

    // Show success notification
    if (typeof window.showNotification === "function") {
      window.showNotification(
        "Icon styles updated! Click Publish to save.",
        "success"
      );
    }

    return { success: true, data: "Stored in pending modifications" };
  } catch (error) {
    console.error("❌ Error updating icon styles:", error);
    // Show error notification
    if (typeof window.showNotification === "function") {
      window.showNotification(
        `Error updating icon styles: ${error.message}`,
        "error"
      );
    }
    return { success: false, error: error.message };
  }
}

// Removed problematic setTimeout block that was creating scope issues with getSelectedElement

// Store pending button modifications locally (like shadow controls)
const pendingButtonModifications = new Map();

// Add a map to track button styles by block/type
const buttonStyleMap = new Map();

function mergeAndSaveButtonStyles(
  blockId,
  typeClass,
  newStyles,
  saveButtonModifications,
  addPendingModification,
  showNotification,
  tagType = "button"
) {
  if (!blockId || !typeClass || !newStyles) {
    console.warn("❌ Missing required data for button styles:", {
      blockId,
      typeClass,
      newStyles,
    });
    return;
  }

  try {
    // Get previous styles for this block/type
    const prev = buttonStyleMap.get(blockId) || {
      buttonPrimary: { selector: ".sqs-button-element--primary", styles: {} },
      buttonSecondary: {
        selector: ".sqs-button-element--secondary",
        styles: {},
      },
      buttonTertiary: { selector: ".sqs-button-element--tertiary", styles: {} },
    };

    // Merge new styles into the correct type
    const merged = { ...prev };
    if (typeClass === "sqs-button-element--primary") {
      merged.buttonPrimary = {
        ...merged.buttonPrimary,
        styles: { ...merged.buttonPrimary.styles, ...newStyles },
      };
    } else if (typeClass === "sqs-button-element--secondary") {
      merged.buttonSecondary = {
        ...merged.buttonSecondary,
        styles: { ...merged.buttonSecondary.styles, ...newStyles },
      };
    } else if (typeClass === "sqs-button-element--tertiary") {
      merged.buttonTertiary = {
        ...merged.buttonTertiary,
        styles: { ...merged.buttonTertiary.styles, ...newStyles },
      };
    }

    // Store in map
    buttonStyleMap.set(blockId, merged);

    // Store in pending modifications (like shadow controls)
    pendingButtonModifications.set(blockId, merged);

    // ALSO add to global pending modifications for publish button
    if (typeof addPendingModification === "function") {
      addPendingModification(blockId, merged, tagType);
      console.log("✅ Added to global pending modifications:", {
        blockId,
        tagType,
        merged,
        globalPendingCount: window.pendingModifications?.size || 0,
      });
    } else {
      console.warn("❌ addPendingModification function not available");
    }

    // Show success notification
    if (typeof showNotification === "function") {
      showNotification("Button style updated locally!", "info");
    }

    // Log for debugging
    console.log("✅ Button styles merged and stored locally:", {
      blockId,
      typeClass,
      newStyles,
      merged,
      pendingCount: pendingButtonModifications.size,
      tagType,
    });
  } catch (error) {
    console.error("❌ Error merging button styles:", error);
    if (typeof showNotification === "function") {
      showNotification("Failed to update button style", "error");
    }
  }
}

// Function to publish all pending button modifications (like shadow controls)
const publishPendingButtonModifications = async (saveButtonModifications) => {
  if (pendingButtonModifications.size === 0) {
    console.log("No button changes to publish");
    return;
  }

  try {
    for (const [blockId, buttonData] of pendingButtonModifications) {
      if (typeof saveButtonModifications === "function") {
        console.log("Publishing button for block:", blockId, buttonData);
        await saveButtonModifications(blockId, buttonData);
      }
    }

    // Clear pending modifications after successful publish
    pendingButtonModifications.clear();
    console.log("All button changes published successfully!");
  } catch (error) {
    console.error("Failed to publish button modifications:", error);
    throw error;
  }
};

export function initButtonFontFamilyControls(
  getSelectedElement,
  addPendingModification,
  showNotification,
  saveButtonModifications
) {
  const GOOGLE_FONTS_API =
    "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBPpLHcfY1Z1SfUIe78z6UvPe-wF31iwRk";

  const fontFamilyOptions = document.getElementById("buttonFontFamilyOptions");
  if (!fontFamilyOptions) return;

  const loader = document.createElement("div");
  loader.id = "sc-font-loader";
  loader.innerHTML = `<div style="width: 24px; height: 24px; margin: 12px auto; border: 3px solid rgba(0, 0, 0, 0.1); border-top: 3px solid #EF7C2F; border-radius: 50%; animation: scSpin 0.8s linear infinite;"></div>`;
  document.head.insertAdjacentHTML(
    "beforeend",
    `
    <style>
      @keyframes scSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `
  );
  fontFamilyOptions.appendChild(loader);

  let fontsList = [];
  let fontIndex = 0;
  const fontsPerPage = 20;

  fetchFonts();

  async function fetchFonts() {
    try {
      const res = await fetch(GOOGLE_FONTS_API);
      const data = await res.json();
      fontsList = data.items;
      loader.remove();
      renderFontBatch();
    } catch (err) {
      loader.remove();
      console.error("❌ Failed to fetch Google Fonts:", err);
    }
  }

  fontFamilyOptions.addEventListener("scroll", () => {
    if (
      fontFamilyOptions.scrollTop + fontFamilyOptions.clientHeight >=
      fontFamilyOptions.scrollHeight - 5
    ) {
      renderFontBatch();
    }
  });

  function renderFontBatch() {
    const slice = fontsList.slice(fontIndex, fontIndex + fontsPerPage);

    slice.forEach((fontItem) => {
      const family = fontItem.family;
      const fontId = `font-${family.replace(/\s+/g, "-")}`;
      const fontUrl = fontItem.files?.regular;

      if (fontUrl && !document.getElementById(fontId)) {
        const link = document.createElement("link");
        link.id = fontId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${family.replace(
          /\s+/g,
          "+"
        )}&display=swap`;
        document.head.appendChild(link);
      }

      const div = document.createElement("div");
      div.className =
        "sc-dropdown-item sc-py-1px sc-text-center sc-cursor-pointer";
      div.textContent = family;
      div.style.fontFamily = `${family}`;

      div.addEventListener("click", async () => {
        const selectedElement = getSelectedElement?.();
        if (!selectedElement) return;

        const label = document.getElementById("font-name");
        const fontFace = `${family}`;

        try {
          await document.fonts.load(`1em ${fontFace}`);
          await new Promise((r) => setTimeout(r, 50));
        } catch (_) {}

        if (label) {
          label.innerText = family;
          label.classList.remove("sc-roboto");
          label.style.setProperty("font-family", fontFace, "important");
        }

        const btn = selectedElement.querySelector(
          "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary," +
            "button.sqs-button-element--primary, button.sqs-button-element--secondary, button.sqs-button-element--tertiary"
        );
        if (!btn) return;

        const typeClass = [...btn.classList].find((cls) =>
          cls.startsWith("sqs-button-element--")
        );
        if (!typeClass) return;

        const blockId = selectedElement.id;
        if (!blockId) {
          console.warn("❌ No block ID found for selected element");
          return;
        }

        // Apply style to DOM
        const styleId = `sc-font-style-${typeClass}`;
        let style = document.getElementById(styleId);
        if (!style) {
          style = document.createElement("style");
          style.id = styleId;
          document.head.appendChild(style);
        }

        style.innerHTML = `
          .${typeClass}, .${typeClass} span, .${typeClass} .sqs-add-to-cart-button-inner {
            font-family: ${fontFace} !important;
          }
        `;

        // Save to pending modifications
        mergeAndSaveButtonStyles(
          blockId,
          typeClass,
          { fontFamily: fontFace },
          saveButtonModifications,
          addPendingModification,
          showNotification,
          "font"
        );

        // Handle font weight options
        const fontWeightOptions = document.getElementById(
          "scButtonFontWeightOptions"
        );
        const fontWeightSelectedLabel = document.getElementById(
          "scButtonFontWeightSelected"
        );

        if (fontWeightOptions && fontItem.variants) {
          fontWeightOptions.innerHTML = "";

          const variants = fontItem.variants
            .filter((v) => v !== "italic")
            .map((v) => (v === "regular" ? "400" : v));

          variants.forEach((weight) => {
            const item = document.createElement("div");
            item.className =
              "sc-dropdown-item sc-py-1px sc-text-center sc-font-size-12 sc-cursor-pointer";
            item.innerText = weight;

            item.onclick = () => {
              fontWeightSelectedLabel.innerText = weight;
              fontWeightOptions.classList.add("sc-hidden");

              // Apply weight style to DOM
              const weightStyleId = `sc-font-weight-${typeClass}`;
              let weightStyle = document.getElementById(weightStyleId);
              if (!weightStyle) {
                weightStyle = document.createElement("style");
                weightStyle.id = weightStyleId;
                document.head.appendChild(weightStyle);
              }

              weightStyle.innerHTML = `
                .${typeClass} span,
                .${typeClass} .sqs-add-to-cart-button-inner {
                  font-weight: ${weight} !important;
                }
              `;

              // Save weight to pending modifications
              mergeAndSaveButtonStyles(
                blockId,
                typeClass,
                { fontWeight: weight },
                saveButtonModifications,
                addPendingModification,
                showNotification,
                "font"
              );
            };

            fontWeightOptions.appendChild(item);
          });

          fontWeightSelectedLabel.innerText = variants.includes("400")
            ? "400"
            : variants[0] || "";
        }
      });

      fontFamilyOptions.appendChild(div);
    });

    fontIndex += fontsPerPage;
  }
}

export function initButtonStyles(
  getSelectedElement,
  addPendingModification,
  showNotification,
  saveButtonModifications
) {
  // Remove the local buttonStyleMap and mergeAndSaveButtonStyles function
  // Use the global ones instead

  // Fix: Check if getSelectedElement is a function before calling it
  if (typeof getSelectedElement !== "function") {
    console.warn("getSelectedElement is not a function");
    return;
  }

  const selected = getSelectedElement();
  if (!selected) {
    console.warn("No selected element found");
    return;
  }

  const fontSizeInput = document.getElementById("scButtonFontSizeInput");
  const letterSpacingInput = document.getElementById(
    "scButtonLetterSpacingInput"
  );
  const fontSizeOptions = document.getElementById("scButtonFontSizeOptions");

  const buttonElement =
    selected.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    ) ||
    selected.querySelector(
      "button.sqs-button-element--primary, button.sqs-button-element--secondary, button.sqs-button-element--tertiary"
    );

  if (!buttonElement) {
    console.warn("No button element found in selected element");
    return;
  }

  const typeClass = [...buttonElement.classList].find((cls) =>
    cls.startsWith("sqs-button-element--")
  );
  if (!typeClass) return;

  function updateGlobalStyle(property, value) {
    const styleId = `sc-style-${typeClass}`;
    let styleTag = document.getElementById(styleId);

    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    const baseSelector = `.${typeClass}`;
    const textSelector = `
      .${typeClass} span,
      .${typeClass} .sqs-add-to-cart-button-inner
    `.trim();

    const allRules = styleTag.innerHTML
      .split("}")
      .filter(Boolean)
      .map((r) => r + "}");

    function updateRule(selector) {
      const index = allRules.findIndex((r) => r.includes(selector));
      const newRule = `${selector} { ${property}: ${value} !important; }`;

      if (index !== -1) {
        allRules[index] = allRules[index]
          .replace(new RegExp(`${property}:.*?;`, "g"), "")
          .replace("}", ` ${property}: ${value} !important; }`);
      } else {
        allRules.push(newRule);
      }
    }

    updateRule(baseSelector);
    updateRule(textSelector);

    styleTag.innerHTML = allRules.join("\n");

    // Save to database using the global mergeAndSaveButtonStyles function
    const blockId = selected.id;
    if (blockId) {
      mergeAndSaveButtonStyles(
        blockId,
        typeClass,
        { [property]: value },
        saveButtonModifications,
        addPendingModification,
        showNotification,
        "button"
      );
    }
  }

  if (fontSizeOptions && fontSizeInput) {
    fontSizeOptions.querySelectorAll(".sc-dropdown-item").forEach((item) => {
      item.onclick = () => {
        const selectedSize = item.getAttribute("data-value");
        fontSizeInput.value = selectedSize;
        fontSizeInput.dispatchEvent(new Event("input"));
      };
    });

    fontSizeInput.oninput = (e) => {
      const fontSize = e.target.value;
      updateGlobalStyle("font-size", `${fontSize}px`);
    };
  }

  if (letterSpacingInput) {
    letterSpacingInput.oninput = (e) => {
      const spacing = e.target.value;
      updateGlobalStyle("letter-spacing", `${spacing}px`);
    };
  }

  // Text transform controls
  const textTransformButtons = [
    { id: "scButtonAllCapital", value: "uppercase" },
    { id: "scButtonAllSmall", value: "lowercase" },
    { id: "scButtonFirstCapital", value: "capitalize" },
  ];

  textTransformButtons.forEach(({ id, value }) => {
    const button = document.getElementById(id);
    if (!button) return;

    button.addEventListener("click", () => {
      // Remove active class from all buttons
      textTransformButtons.forEach(({ id }) => {
        const btn = document.getElementById(id);
        if (btn) {
          btn.classList.remove("sc-activeTab-border");
          btn.classList.add("sc-inActiveTab-border");
        }
      });

      // Add active class to clicked button
      button.classList.remove("sc-inActiveTab-border");
      button.classList.add("sc-activeTab-border");

      updateGlobalStyle("text-transform", value);
    });
  });

  // Font weight controls
  const fontWeightButtons = [
    { id: "scButtonFontWeightLight", value: "300" },
    { id: "scButtonFontWeightNormal", value: "400" },
    { id: "scButtonFontWeightMedium", value: "500" },
    { id: "scButtonFontWeightSemiBold", value: "600" },
    { id: "scButtonFontWeightBold", value: "700" },
    { id: "scButtonFontWeightExtraBold", value: "800" },
  ];

  fontWeightButtons.forEach(({ id, value }) => {
    const button = document.getElementById(id);
    if (!button) return;

    button.addEventListener("click", () => {
      // Remove active class from all buttons
      fontWeightButtons.forEach(({ id }) => {
        const btn = document.getElementById(id);
        if (btn) {
          btn.classList.remove("sc-activeTab-border");
          btn.classList.add("sc-inActiveTab-border");
        }
      });

      // Add active class to clicked button
      button.classList.remove("sc-inActiveTab-border");
      button.classList.add("sc-activeTab-border");

      updateGlobalStyle("font-weight", value);
    });
  });
}

// export function initButtonStyles(
//   getSelectedElement,
//   addPendingModification, // can be undefined; we handle both cases
//   showNotification,
//   saveButtonModifications // used only by the publish handler below
// ) {
//   if (typeof getSelectedElement !== "function") {
//     console.warn("getSelectedElement is not a function");
//     return;
//   }

//   const selected = getSelectedElement();
//   if (!selected) {
//     console.warn("No selected element found");
//     return;
//   }

//   // Ensure shared maps exist
//   window.pendingModifications ||= new Map(); // Map<blockId, Array<{tagType, css}>>

//   // ---- helpers ----
//   const findTypeClass = () => {
//     const btn =
//       selected.querySelector(
//         "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
//       ) ||
//       selected.querySelector(
//         "button.sqs-button-element--primary, button.sqs-button-element--secondary, button.sqs-button-element--tertiary"
//       );
//     if (!btn) return null;
//     return (
//       [...btn.classList].find((c) => c.startsWith("sqs-button-element--")) ||
//       null
//     );
//   };

//   const typeClass = findTypeClass();
//   if (!typeClass) {
//     console.warn("No button element found in selected element");
//     return;
//   }

//   const typeKeyFromClass = (tc) => {
//     if (tc.includes("--primary")) return "buttonPrimary";
//     if (tc.includes("--secondary")) return "buttonSecondary";
//     if (tc.includes("--tertiary")) return "buttonTertiary";
//     return "buttonPrimary";
//   };
//   const typeKey = typeKeyFromClass(typeClass);

//   const camelProp = (prop) =>
//     prop.replace(/-([a-z])/g, (_, g) => g.toUpperCase());

//   const ensureStyleTag = (tc) => {
//     const id = `sc-style-${tc}`;
//     let tag = document.getElementById(id);
//     if (!tag) {
//       tag = document.createElement("style");
//       tag.id = id;
//       document.head.appendChild(tag);
//     }
//     return tag;
//   };

//   // Strict, type-scoped CSS write
//   function writeScopedCSS(property, value) {
//     const styleTag = ensureStyleTag(typeClass);

//     // to affect the visible text reliably across Squarespace buttons:
//     const selectors = [
//       `.${typeClass}`,
//       `.${typeClass} span`,
//       `.${typeClass} .sqs-add-to-cart-button-inner`,
//     ];

//     // keep/update just these selectors in this style tag
//     const rules = styleTag.innerHTML
//       .split("}")
//       .filter(Boolean)
//       .map((r) => r + "}");

//     const upsert = (sel) => {
//       const idx = rules.findIndex((r) => r.includes(sel));
//       const newRule = `${sel} { ${property}: ${value} !important; }`;
//       if (idx >= 0) {
//         rules[idx] = rules[idx]
//           .replace(new RegExp(`${property}\\s*:[^;]*;`, "g"), "")
//           .replace(/\}\s*$/, ` ${property}: ${value} !important; }`);
//       } else {
//         rules.push(newRule);
//       }
//     };

//     selectors.forEach(upsert);
//     styleTag.innerHTML = rules.join("\n");
//   }

//   // Queue a per-type payload in pending (NO DB write here)
//   function enqueueStyle(property, value) {
//     const blockId = selected.id;
//     if (!blockId) {
//       console.warn("❌ No block ID on selected element");
//       return;
//     }

//     const selector = `.${typeClass}`;
//     const stylesObj = { [camelProp(property)]: value };

//     const payload = {
//       css: {
//         [typeKey]: [
//           {
//             selector,
//             styles: stylesObj,
//           },
//           // we also apply to inner text containers so text-transform/spacing/weight stick
//           {
//             selector: `.${typeClass} span`,
//             styles: stylesObj,
//           },
//           {
//             selector: `.${typeClass} .sqs-add-to-cart-button-inner`,
//             styles: stylesObj,
//           },
//         ],
//       },
//     };

//     // Prefer host-provided API if present
//     if (typeof addPendingModification === "function") {
//       const arity = addPendingModification.length;
//       if (arity >= 4) {
//         // (blockId, payload, "button", "buttonStyles")
//         addPendingModification(blockId, payload, "button", "buttonStyles");
//       } else {
//         // (blockId, payload, "buttonStyles")
//         addPendingModification(blockId, payload, "buttonStyles");
//       }
//       return;
//     }

//     // Fallback: window.pendingModifications
//     const list = window.pendingModifications.get(blockId) || [];
//     let entry = list.find((m) => m.tagType === "buttonStyles");
//     if (!entry) {
//       entry = { tagType: "buttonStyles", css: {} };
//       list.push(entry);
//     }
//     entry.css[typeKey] ||= [];

//     // merge by selector (dedupe)
//     const pushOrReplace = (arr, item) => {
//       const i = arr.findIndex((x) => x.selector === item.selector);
//       if (i >= 0)
//         arr[i] = { ...arr[i], styles: { ...arr[i].styles, ...item.styles } };
//       else arr.push(item);
//     };
//     payload.css[typeKey].forEach((it) => pushOrReplace(entry.css[typeKey], it));

//     window.pendingModifications.set(blockId, list);
//   }

//   // Single updater used by all UI controls
//   const updateGlobalStyle = (property, value) => {
//     writeScopedCSS(property, value);
//     enqueueStyle(property, value);
//     showNotification?.("Button style updated (pending)", "success");
//   };

//   // ---- Wire inputs ----
//   const fontSizeInput = document.getElementById("scButtonFontSizeInput");
//   const fontSizeOptions = document.getElementById("scButtonFontSizeOptions");
//   const letterSpacingInput = document.getElementById(
//     "scButtonLetterSpacingInput"
//   );

//   if (fontSizeOptions && fontSizeInput) {
//     fontSizeOptions.querySelectorAll(".sc-dropdown-item").forEach((item) => {
//       item.onclick = () => {
//         const v = item.getAttribute("data-value");
//         fontSizeInput.value = v;
//         fontSizeInput.dispatchEvent(new Event("input"));
//       };
//     });
//     fontSizeInput.oninput = (e) => {
//       const px = `${e.target.value}px`;
//       updateGlobalStyle("font-size", px);
//     };
//   }

//   if (letterSpacingInput) {
//     letterSpacingInput.oninput = (e) => {
//       const px = `${e.target.value}px`;
//       updateGlobalStyle("letter-spacing", px);
//     };
//   }

//   // Text-transform
//   [
//     { id: "scButtonAllCapital", value: "uppercase" },
//     { id: "scButtonAllSmall", value: "lowercase" },
//     { id: "scButtonFirstCapital", value: "capitalize" },
//   ].forEach(({ id, value }) => {
//     const btn = document.getElementById(id);
//     if (!btn) return;
//     btn.addEventListener("click", () => {
//       // toggle UI states
//       [
//         "scButtonAllCapital",
//         "scButtonAllSmall",
//         "scButtonFirstCapital",
//       ].forEach((x) => {
//         const b = document.getElementById(x);
//         if (b) {
//           b.classList.remove("sc-activeTab-border");
//           b.classList.add("sc-inActiveTab-border");
//         }
//       });
//       btn.classList.remove("sc-inActiveTab-border");
//       btn.classList.add("sc-activeTab-border");

//       updateGlobalStyle("text-transform", value);
//     });
//   });

//   // Font-weight
//   [
//     { id: "scButtonFontWeightLight", value: "300" },
//     { id: "scButtonFontWeightNormal", value: "400" },
//     { id: "scButtonFontWeightMedium", value: "500" },
//     { id: "scButtonFontWeightSemiBold", value: "600" },
//     { id: "scButtonFontWeightBold", value: "700" },
//     { id: "scButtonFontWeightExtraBold", value: "800" },
//   ].forEach(({ id, value }) => {
//     const btn = document.getElementById(id);
//     if (!btn) return;
//     btn.addEventListener("click", () => {
//       [
//         "scButtonFontWeightLight",
//         "scButtonFontWeightNormal",
//         "scButtonFontWeightMedium",
//         "scButtonFontWeightSemiBold",
//         "scButtonFontWeightBold",
//         "scButtonFontWeightExtraBold",
//       ].forEach((x) => {
//         const b = document.getElementById(x);
//         if (b) {
//           b.classList.remove("sc-activeTab-border");
//           b.classList.add("sc-inActiveTab-border");
//         }
//       });
//       btn.classList.remove("sc-inActiveTab-border");
//       btn.classList.add("sc-activeTab-border");

//       updateGlobalStyle("font-weight", value);
//     });
//   });
// }

async function replaceImgWithInlineSVG(imgElement) {
  const src = imgElement.getAttribute("src");
  if (!src || !src.endsWith(".svg")) return null;

  try {
    const res = await fetch(src);
    const svgText = await res.text();
    const parser = new DOMParser();
    const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
    const svgElement = svgDoc.querySelector("svg");

    if (!svgElement) return null;

    svgElement.classList.add(...imgElement.classList);
    svgElement.setAttribute("width", imgElement.getAttribute("width") || "20");
    svgElement.setAttribute(
      "height",
      imgElement.getAttribute("height") || "20"
    );

    // Remove all fill, stroke, color, and style attributes to make it colorable
    svgElement.querySelectorAll("*").forEach((el) => {
      el.removeAttribute("fill");
      el.removeAttribute("stroke");
      el.removeAttribute("color");
      el.removeAttribute("style");
    });

    svgElement.removeAttribute("fill");
    svgElement.removeAttribute("stroke");
    svgElement.removeAttribute("color");
    svgElement.removeAttribute("style");

    return svgElement;
  } catch (err) {
    console.error("❌ Failed to inline SVG:", err);
    return null;
  }
}

// modify data
// Function to convert all img icons to SVG in a button
async function convertButtonIconsToSVG(buttonElement) {
  const imgIcons = buttonElement.querySelectorAll("img.sqscraft-button-icon");

  for (const imgIcon of imgIcons) {
    const svgIcon = await replaceImgWithInlineSVG(imgIcon);
    if (svgIcon) {
      // Replace the img with the SVG
      imgIcon.parentNode.replaceChild(svgIcon, imgIcon);
      console.log("✅ Converted img icon to SVG:", svgIcon);
    }
  }
}

// Function to convert all img icons to SVG in all buttons of a specific type
async function convertAllButtonIconsToSVG(typeClass) {
  const buttons = document.querySelectorAll(`a.${typeClass}`);

  for (const button of buttons) {
    await convertButtonIconsToSVG(button);
  }
}

export function initButtonIconPositionToggle(
  getSelectedElement,
  saveButtonIconModifications,
  addPendingModification,
  showNotification
) {
  document.getElementById("buttoniconPositionSection").onclick = () => {
    document
      .getElementById("iconPositionDropdown")
      .classList.toggle("sc-hidden");
  };

  document
    .querySelectorAll("#iconPositionDropdown [data-value]")
    .forEach((option) => {
      option.onclick = async () => {
        const value = option.dataset.value;
        document.getElementById(
          "iconPositionLabel"
        ).innerHTML = `<p class="sc-universal sc-roboto sc-font-size-12">${
          value.charAt(0).toUpperCase() + value.slice(1)
        }</p>`;
        document
          .getElementById("iconPositionDropdown")
          .classList.add("sc-hidden");

        const selectedElement = getSelectedElement();
        const sampleButton = selectedElement?.querySelector(
          "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
        );
        if (!sampleButton) return;

        let typeClass = "sqs-button-element--primary";
        if (sampleButton.classList.contains("sqs-button-element--secondary"))
          typeClass = "sqs-button-element--secondary";
        else if (
          sampleButton.classList.contains("sqs-button-element--tertiary")
        )
          typeClass = "sqs-button-element--tertiary";

        const allButtons = document.querySelectorAll(`a.${typeClass}`);
        allButtons.forEach((buttonLink) => {
          const icon = buttonLink.querySelector(".sqscraft-button-icon");
          const textDiv = buttonLink.querySelector(".sqs-html");

          if (!icon || !textDiv) return;

          icon.style.marginLeft = "";
          icon.style.marginRight = "";

          if (value === "after") {
            icon.style.marginLeft = "8px";
            buttonLink.insertBefore(icon, textDiv.nextSibling);
          } else {
            icon.style.marginRight = "8px";
            buttonLink.insertBefore(icon, textDiv);
          }
        });

        // ✅ Save to database
        const blockId = getSelectedElement()?.id;
        if (blockId) {
          const marginStyle =
            value === "after"
              ? { marginLeft: "8px", marginRight: "" }
              : { marginRight: "8px", marginLeft: "" };

          const result = await updateIconStyles(
            blockId,
            typeClass,
            marginStyle
          );

          // If updateIconStyles was successful, save to database
          if (
            result &&
            result.success &&
            typeof saveButtonIconModifications === "function"
          ) {
            // Get the merged styles from the pending modifications
            const pendingMods = window.pendingModifications?.get(blockId) || [];
            const iconMod = pendingMods.find(
              (mod) => mod.tagType === "buttonIcon"
            );

            if (iconMod && iconMod.css.iconProperties.styles) {
              await saveButtonIconModifications(blockId, iconMod.css);

              if (typeof showNotification === "function") {
                showNotification("Icon position saved!", "success");
              }
            }
          }
        }
      };
    });
}

let normalRotationInitialized = false;

export function initButtonIconRotationControl(
  getSelectedElement,
  saveButtonIconModifications,
  addPendingModification,
  showNotification
) {
  if (normalRotationInitialized) return;
  normalRotationInitialized = true;

  const bullet = document.getElementById("buttonIconRotationradiusBullet");
  const fill = document.getElementById("buttonIconRotationradiusFill");
  const field = document.getElementById("buttonIconRotationradiusField");
  const label = document.getElementById("buttoniconRotationradiusCount");

  const incBtn = document.getElementById("buttoniconRotationIncrease");
  const decBtn = document.getElementById("buttoniconRotationDecrease");

  let currentRotation = 0;
  let userInteracted = false;
  let saveTimeout = null; // For debouncing save operations

  // Function to apply visual changes only (no database save)
  function applyRotationVisualChanges() {
    const selectedElement = getSelectedElement?.();
    const btn = selectedElement?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const typeClass = [...btn.classList].find((cls) =>
      cls.startsWith("sqs-button-element--")
    );
    if (!typeClass) return;

    const buttons = document.querySelectorAll(`a.${typeClass}`);
    buttons.forEach((button) => {
      const icon = button.querySelector(
        ".sqscraft-button-icon, .sqscraft-image-icon"
      );
      if (icon) {
        icon.style.transform = `rotate(${currentRotation}deg)`;
      }
    });
  }

  // Function to save to database only
  async function applyRotationSave() {
    const selectedElement = getSelectedElement?.();
    const btn = selectedElement?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const typeClass = [...btn.classList].find((cls) =>
      cls.startsWith("sqs-button-element--")
    );
    if (!typeClass) return;

    // ✅ Save to database
    const blockId = selectedElement?.id;
    if (blockId) {
      const result = await updateIconStyles(blockId, typeClass, {
        transform: `rotate(${currentRotation}deg)`,
      });

      // If updateIconStyles was successful, save to database
      if (
        result &&
        result.success &&
        typeof saveButtonIconModifications === "function"
      ) {
        // Get the merged styles from the pending modifications
        const pendingMods = window.pendingModifications?.get(blockId) || [];
        const iconMod = pendingMods.find((mod) => mod.tagType === "buttonIcon");

        if (iconMod && iconMod.css.iconProperties.styles) {
          await saveButtonIconModifications(blockId, iconMod.css);

          if (typeof showNotification === "function") {
            showNotification("Icon rotation saved!", "success");
          }
        }
      }
    }
  }

  function updateUI(clientX) {
    const rect = field.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const centerX = rect.width / 2;
    const deltaX = x - centerX;
    currentRotation = Math.round((deltaX / centerX) * 180);

    const percent = (x / rect.width) * 100;
    bullet.style.left = `${percent}%`;

    const fillStart = 50;
    fill.style.left = `${Math.min(percent, fillStart)}%`;
    fill.style.width = `${Math.abs(percent - fillStart)}%`;

    label.textContent = `${currentRotation}deg`;

    // Apply visual changes immediately
    applyRotationVisualChanges();

    // Debounce the save operation
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(() => {
      applyRotationSave().catch(console.error);
    }, 500); // Wait 500ms after last change before saving
  }

  function updateFromRotationValue(value) {
    const clamped = Math.max(-180, Math.min(180, value));
    currentRotation = clamped;
    const percent = ((clamped + 180) / 360) * 100;

    bullet.style.left = `${percent}%`;

    const center = 50;
    fill.style.left = `${Math.min(percent, center)}%`;
    fill.style.width = `${Math.abs(percent - center)}%`;

    label.textContent = `${clamped}deg`;

    // Apply visual changes immediately
    applyRotationVisualChanges();

    // Debounce the save operation
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(() => {
      applyRotationSave().catch(console.error);
    }, 500); // Wait 500ms after last change before saving
  }

  function syncFromIconRotation() {
    if (userInteracted) return;

    const selectedElement = getSelectedElement?.();
    const btn = selectedElement?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const icon = btn.querySelector(
      ".sqscraft-button-icon, .sqscraft-image-icon"
    );
    if (!icon) {
      updateFromRotationValue(0);
      return;
    }

    const match = icon.style.transform?.match(/rotate\((-?\d+(?:\.\d+)?)deg\)/);
    if (match) {
      const rotation = parseFloat(match[1]);
      if (!isNaN(rotation)) {
        updateFromRotationValue(rotation);
        return;
      }
    }

    updateFromRotationValue(0);
  }

  bullet.addEventListener("mousedown", (e) => {
    e.preventDefault();
    userInteracted = true;
    const move = (e) => updateUI(e.clientX);
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  field.addEventListener("click", (e) => {
    userInteracted = true;
    updateUI(e.clientX);
  });

  incBtn?.addEventListener("click", () => {
    userInteracted = true;
    updateFromRotationValue(currentRotation + 1);
  });

  decBtn?.addEventListener("click", () => {
    userInteracted = true;
    updateFromRotationValue(currentRotation - 1);
  });

  setTimeout(syncFromIconRotation, 50);
}

export function initButtonIconSizeControl(
  getSelectedElement,
  saveButtonIconModifications,
  addPendingModification,
  showNotification
) {
  const bullet = document.getElementById("buttonIconSizeradiusBullet");
  const fill = document.getElementById("buttonIconSizeradiusFill");
  const field = document.getElementById("buttonIconSizeradiusField");
  const label = document.getElementById("buttoniconSizeradiusCount");

  const incBtn = document.getElementById("buttoniconSizeIncrease");
  const decBtn = document.getElementById("buttoniconSizeDecrease");

  const maxSize = 50;
  let currentSize = 0;
  let saveTimeout = null; // For debouncing save operations

  // Function to apply visual changes only (no database save)
  function applySizeVisualChanges() {
    const selectedElement = getSelectedElement?.();
    if (!selectedElement) return;

    const btn = selectedElement.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary, " +
        "button.sqs-button-element--primary, button.sqs-button-element--secondary, button.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const typeClass = [...btn.classList].find((cls) =>
      cls.startsWith("sqs-button-element--")
    );
    if (!typeClass) return;

    console.log("📏 Icon size applySizeVisualChanges called with:", {
      currentSize: currentSize,
      sizeStyle: `${currentSize}px`,
      typeClass: typeClass,
    });

    const allButtons = document.querySelectorAll(
      `a.${typeClass}, button.${typeClass}`
    );
    allButtons.forEach((button) => {
      const icons = button.querySelectorAll(
        ".sqscraft-button-icon, .sqscraft-image-icon"
      );
      icons.forEach((icon) => {
        icon.style.width = `${currentSize}px`;
        icon.style.height = "auto";
        console.log("📏 Applied size to icon:", {
          icon: icon,
          width: icon.style.width,
          height: icon.style.height,
        });
      });
    });
  }

  // Function to save to database only
  async function applySizeSave() {
    const selectedElement = getSelectedElement?.();
    if (!selectedElement) return;

    const btn = selectedElement.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary, " +
        "button.sqs-button-element--primary, button.sqs-button-element--secondary, button.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const typeClass = [...btn.classList].find((cls) =>
      cls.startsWith("sqs-button-element--")
    );
    if (!typeClass) return;

    // ✅ Save to database
    const blockId = getSelectedElement()?.id;
    if (blockId) {
      console.log("📏 Saving size to database:", {
        blockId: blockId,
        typeClass: typeClass,
        currentSize: currentSize,
        sizeStyle: `${currentSize}px`,
      });

      const result = await updateIconStyles(blockId, typeClass, {
        width: `${currentSize}px`,
        height: "auto",
      });

      // If updateIconStyles was successful, save to database
      if (
        result &&
        result.success &&
        typeof saveButtonIconModifications === "function"
      ) {
        // Get the merged styles from the pending modifications
        const pendingMods = window.pendingModifications?.get(blockId) || [];
        const iconMod = pendingMods.find((mod) => mod.tagType === "buttonIcon");

        if (iconMod && iconMod.css.iconProperties.styles) {
          console.log(
            "📏 Final merged styles being saved:",
            iconMod.css.iconProperties.styles
          );
          await saveButtonIconModifications(blockId, iconMod.css);

          if (typeof showNotification === "function") {
            showNotification("Icon size saved!", "success");
          }
        }
      }
    }
  }

  function updateFromSizeValue(value) {
    currentSize = Math.max(0, Math.min(maxSize, value));
    const percent = (currentSize / maxSize) * 100;

    bullet.style.left = `${percent}%`;
    fill.style.width = `${percent}%`;
    label.textContent = `${currentSize}px`;

    // Apply visual changes immediately
    applySizeVisualChanges();

    // Debounce the save operation
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(() => {
      applySizeSave().catch(console.error);
    }, 500); // Wait 500ms after last change before saving
  }

  function updateUI(clientX) {
    const rect = field.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const newSize = Math.round((x / rect.width) * maxSize);
    updateFromSizeValue(newSize);
  }

  function syncFromIcon() {
    const selectedElement = getSelectedElement?.();
    const btn = selectedElement?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary, " +
        "button.sqs-button-element--primary, button.sqs-button-element--secondary, button.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const icon = btn.querySelector(
      ".sqscraft-button-icon, .sqscraft-image-icon"
    );
    if (!icon || !icon.style.width) return;

    const size = parseInt(icon.style.width, 10);
    if (!isNaN(size)) {
      updateFromSizeValue(size);
    }
  }

  bullet.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const move = (e) => updateUI(e.clientX);
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  field.addEventListener("click", (e) => updateUI(e.clientX));

  if (incBtn) {
    incBtn.addEventListener("click", () => {
      updateFromSizeValue(currentSize + 1);
    });
  }

  if (decBtn) {
    decBtn.addEventListener("click", () => {
      updateFromSizeValue(currentSize - 1);
    });
  }

  setTimeout(syncFromIcon, 50);
}

export function initButtonIconSpacingControl(
  getSelectedElement,
  saveButtonIconModifications,
  addPendingModification,
  showNotification
) {
  const fill = document.getElementById("buttonIconSpacingradiusFill");
  const bullet = document.getElementById("buttonIconSpacingradiusBullet");
  const field = document.getElementById("buttonIconSpacingradiusField");
  const valueText = document.getElementById("buttoniconSpacingCount");
  const incBtn = document.getElementById("buttoniconSpacingIncrease");
  const decBtn = document.getElementById("buttoniconSpacingDecrease");
  const resetBtn =
    field?.previousElementSibling?.querySelector('img[alt="reset"]');

  if (!fill || !bullet || !field || !valueText) return;

  const maxGap = 30;
  let gapValue = 0;
  let saveTimeout = null; // For debouncing save operations

  // Function to apply visual changes only (no database save)
  function applyGapVisualChanges() {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const btnClass = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!btnClass) return;

    console.log("🎯 Icon spacing applyGapVisualChanges called with:", {
      gapValue: gapValue,
      gapStyle: `${gapValue}px`,
      btnClass: btnClass,
    });

    document.querySelectorAll(`a.${btnClass}`).forEach((el) => {
      const hasIcon = el.querySelector(
        ".sqscraft-button-icon, .sqscraft-image-icon"
      );
      if (hasIcon) {
        el.classList.add("sc-flex", "sc-items-center");
        el.style.gap = `${gapValue}px`;
        console.log("🎯 Applied gap to button:", {
          button: el,
          gap: el.style.gap,
          classes: el.className,
        });
      } else {
        el.classList.remove("sc-flex", "sc-items-center");
        el.style.gap = "";
      }
    });
  }

  // Function to save to database only
  async function applyGapSave() {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const btnClass = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!btnClass) return;

    // ✅ Save to database
    const blockId = getSelectedElement()?.id;
    if (blockId) {
      console.log("🎯 Saving gap to database:", {
        blockId: blockId,
        btnClass: btnClass,
        gapValue: gapValue,
        gapStyle: `${gapValue}px`,
      });

      const result = await updateIconStyles(blockId, btnClass, {
        gap: `${gapValue}px`,
      });

      // If updateIconStyles was successful, save to database
      if (
        result &&
        result.success &&
        typeof saveButtonIconModifications === "function"
      ) {
        // Get the merged styles from the pending modifications
        const pendingMods = window.pendingModifications?.get(blockId) || [];
        const iconMod = pendingMods.find((mod) => mod.tagType === "buttonIcon");

        if (iconMod && iconMod.css.iconProperties.styles) {
          console.log(
            "🎯 Final merged styles being saved:",
            iconMod.css.iconProperties.styles
          );
          await saveButtonIconModifications(blockId, iconMod.css);

          if (typeof showNotification === "function") {
            showNotification("Icon spacing saved!", "success");
          }
        }
      }
    }
  }

  function updateUI(val) {
    gapValue = Math.max(0, Math.min(maxGap, val));
    const percent = (gapValue / maxGap) * 100;
    fill.style.width = `${percent}%`;
    bullet.style.left = `${percent}%`;
    valueText.textContent = `${gapValue}px`;

    console.log("🎯 Icon spacing updateUI called with:", {
      inputValue: val,
      gapValue: gapValue,
      displayValue: `${gapValue}px`,
      percent: percent,
    });

    // Apply visual changes immediately
    applyGapVisualChanges();

    // Debounce the save operation
    if (saveTimeout) {
      clearTimeout(saveTimeout);
    }
    saveTimeout = setTimeout(() => {
      applyGapSave().catch(console.error);
    }, 500); // Wait 500ms after last change before saving
  }

  bullet.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const move = (eMove) => {
      const rect = field.getBoundingClientRect();
      const x = Math.min(Math.max(eMove.clientX - rect.left, 0), rect.width);
      const val = Math.round((x / rect.width) * maxGap);
      updateUI(val);
    };
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  field.addEventListener("click", (e) => {
    const rect = field.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const val = Math.round((x / rect.width) * maxGap);
    updateUI(val);
  });

  incBtn?.addEventListener("click", () => updateUI(gapValue + 1));
  decBtn?.addEventListener("click", () => updateUI(gapValue - 1));
  resetBtn?.addEventListener("click", () => updateUI(8));

  setTimeout(() => {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (btn) {
      const computedGap = parseInt(window.getComputedStyle(btn).gap);
      console.log("🎯 Icon spacing syncFromIcon:", {
        btn: btn,
        computedGap: computedGap,
        btnStyleGap: btn.style.gap,
        isNaN: isNaN(computedGap),
      });
      if (!isNaN(computedGap)) updateUI(computedGap);
    }
  }, 50);
}

export function initButtonIconColorPalate(
  themeColors,
  selectedElement,
  saveButtonIconModifications,
  addPendingModification,
  showNotification
) {
  // Use correct IDs matching the HTML
  const palette = document.getElementById("button-icon-color-palette");
  const container = document.getElementById("button-icon-colors-palette");
  const selectorField = document.getElementById(
    "button-icon-color-selection-field"
  );
  const bullet = document.getElementById("button-icon-color-selection-bar");
  const colorCode = document.getElementById("button-icon-color-code");
  const transparencyCount = document.getElementById(
    "button-icon-color-transparency-count"
  );
  const allColorField = document.getElementById(
    "button-icon-color-all-color-selection-field"
  );
  const allColorBullet = document.getElementById(
    "button-icon-color-all-color-selection-bar"
  );
  const transparencyField = document.getElementById(
    "button-icon-color-transparency-field"
  );
  const transparencyBullet = document.getElementById(
    "button-icon-color-transparency-bar"
  );

  // Button-specific icon color application function
  async function applyButtonIconColorFromPalette(color, alpha = 1) {
    console.log("🎨 Applying icon color:", color, "with alpha:", alpha);

    const currentElement = selectedElement?.();
    if (!currentElement) {
      console.log("❌ No current element found");
      return;
    }
    console.log("📍 Current element:", currentElement);

    const btn = currentElement.querySelector(
      ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
    );
    if (!btn) {
      console.log("❌ No button element found");
      return;
    }
    console.log("🔘 Button element:", btn);

    const typeClass = [...btn.classList].find((cls) =>
      cls.startsWith("sqs-button-element--")
    );
    if (!typeClass) {
      console.log("❌ No button type class found");
      return;
    }
    console.log("🏷️ Button type class:", typeClass);

    // Convert any img icons to SVG first (fire and forget)
    convertAllButtonIconsToSVG(typeClass)
      .then(() => {
        console.log("✅ Icon conversion completed");
      })
      .catch((err) => {
        console.error("❌ Icon conversion failed:", err);
      });

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

    // Apply icon color to button
    const styleId = `sc-button-icon-color-${typeClass}`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    const cssRules = `
  .${typeClass} svg,
  .${typeClass} svg *,
  .${typeClass} .sqs-button-element--icon svg,
  .${typeClass} .sqs-button-element--icon svg *,
  .${typeClass} [data-icon] svg,
  .${typeClass} [data-icon] svg * {
    color: ${rgbaColor} !important;
    fill: ${rgbaColor} !important;
    stroke: ${rgbaColor} !important;
  }

  .${typeClass}:hover svg,
  .${typeClass}:hover svg *,
  .${typeClass}:hover .sqs-button-element--icon svg,
  .${typeClass}:hover .sqs-button-element--icon svg *,
  .${typeClass}:hover [data-icon] svg,
  .${typeClass}:hover [data-icon] svg * {
    color: ${rgbaColor} !important;
    fill: ${rgbaColor} !important;
    stroke: ${rgbaColor} !important;
  }
`;

    styleTag.innerHTML = cssRules;
    console.log("🎨 Applied CSS rules:", cssRules);
    console.log("🎨 Style tag ID:", styleId);

    // Check for icons in the button
    const icons = btn.querySelectorAll("svg");

    console.log("🔍 Found icons:", icons.length);
    icons.forEach((icon, index) => {
      console.log(
        `🔍 Icon ${index + 1}:`,
        icon.tagName,
        icon.className,
        icon.getAttribute("src")
      );
    });

    // Also check for img icons that need conversion
    const imgIcons = btn.querySelectorAll("img.sqscraft-button-icon");
    console.log("🖼️ Found img icons:", imgIcons.length);
    if (imgIcons.length > 0) {
      console.log("🔄 Converting img icons to SVG...");
      convertButtonIconsToSVG(btn).then(() => {
        console.log("✅ Icon conversion completed for this button");
      });
    }

    // Save to database using updateIconStyles to merge color with all icon properties
    const blockId = currentElement.id;
    if (blockId) {
      // Always use the icon selector for updateIconStyles
      const result = await updateIconStyles(blockId, typeClass, {
        color: rgbaColor,
        fill: rgbaColor,
        stroke: rgbaColor,
      });

      // If updateIconStyles was successful, save to database
      if (
        result &&
        result.success &&
        typeof saveButtonIconModifications === "function"
      ) {
        // Get the merged styles from the pending modifications
        const pendingMods = window.pendingModifications?.get(blockId) || [];
        const iconMod = pendingMods.find((mod) => mod.tagType === "buttonIcon");

        if (iconMod && iconMod.css.iconProperties.styles) {
          await saveButtonIconModifications(blockId, iconMod.css);

          if (typeof showNotification === "function") {
            showNotification("Icon color saved!", "success");
          }
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
        applyButtonIconColorFromPalette(
          finalColor,
          currentTransparency / 100
        ).catch(console.error);
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

        applyButtonIconColorFromPalette(rgb, currentTransparency / 100).catch(
          console.error
        );
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
    applyButtonIconColorFromPalette(rgb, currentTransparency / 100).catch(
      console.error
    );
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
          applyButtonIconColorFromPalette(
            currentColor,
            currentTransparency / 100
          ).catch(console.error);
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

      applyButtonIconColorFromPalette(color, currentTransparency / 100).catch(
        console.error
      );

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

      applyButtonIconColorFromPalette(color, currentTransparency / 100).catch(
        console.error
      );
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
}

export function initButtonBorderControl(
  getSelectedElement,
  addPendingModification,
  showNotification,
  saveButtonBorderModifications
) {
  const borderMap = new Map();

  function updateBorder(blockId, typeClass, border) {
    if (!blockId || !typeClass) {
      console.warn("❌ Missing required data for border:", {
        blockId,
        typeClass,
      });
      return;
    }

    try {
      const styleId = `sc-border-${typeClass}`;
      let style = document.getElementById(styleId);
      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        document.head.appendChild(style);
      }

      style.innerHTML = `
        .${typeClass} {
          border: ${border} !important;
        }
      `;

      // Only update local state, do not save to DB
      addPendingModification(blockId, { border }, "border");
      if (typeof showNotification === "function") {
        showNotification("Border updated locally!", "info");
      }
    } catch (error) {
      console.error("❌ Error updating border:", error);
      if (typeof showNotification === "function") {
        showNotification("Failed to update border", "error");
      }
    }
  }

  const fill = document.getElementById("buttonBorderFill");
  const bullet = document.getElementById("buttonBorderBullet");
  const field = document.getElementById("buttonBorderField");
  const valueText = document.getElementById("buttonBorderCount");
  const incBtn = document.getElementById("buttonBorderIncrease");
  const decBtn = document.getElementById("buttonBorderDecrease");
  const resetBtn = valueText
    ?.closest(".sc-flex")
    ?.querySelector('img[alt="reset"]');

  if (!fill || !bullet || !field || !valueText) return;

  const max = 10;
  let currentValue = 0;

  if (!window.__squareCraftBorderStateMap)
    window.__squareCraftBorderStateMap = new Map();
  const sides = ["Top", "Right", "Bottom", "Left"];

  ["All", ...sides].forEach((side) => {
    const el = document.getElementById(`buttonBorder${side}`);
    if (!el) return;

    el.addEventListener("click", () => {
      ["All", ...sides].forEach((s) => {
        const btn = document.getElementById(`buttonBorder${s}`);
        btn?.classList.remove("sc-bg-454545");
      });
      el.classList.add("sc-bg-454545");

      const selectedElement = getSelectedElement?.();
      if (!selectedElement) return;

      const btn = selectedElement.querySelector(
        "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary, button.sqs-button-element--primary, button.sqs-button-element--secondary, button.sqs-button-element--tertiary"
      );
      if (!btn) return;

      const typeClass = [...btn.classList].find((c) =>
        c.startsWith("sqs-button-element--")
      );
      const blockId = selectedElement.id || "block-id";
      const key = `${blockId}--${typeClass}`;

      const state = window.__squareCraftBorderStateMap.get(key) || {
        values: {},
        side: "All",
      };
      state.side = side;

      if (side === "All") {
        const v = state.values;
        const avg =
          ((v.Top ?? 0) + (v.Right ?? 0) + (v.Bottom ?? 0) + (v.Left ?? 0)) / 4;
        currentValue = Math.round(avg);
      } else {
        state.values[side] = state.values[side] || 0;
        currentValue = state.values[side];
      }

      window.__squareCraftBorderStateMap.set(key, state);
      updateUIFromValue(currentValue);
    });
  });

  function applyBorder(saveToDB = false) {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary, button.sqs-button-element--primary, button.sqs-button-element--secondary, button.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const typeClass = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!typeClass) return;

    const blockId = selected.id || "block-id";
    const key = `${blockId}--${typeClass}`;
    const state = window.__squareCraftBorderStateMap.get(key) || {
      values: {},
      side: "All",
    };

    if (state.side === "All") {
      sides.forEach((side) => {
        state.values[side] = currentValue;
      });
    } else {
      state.values[state.side] = currentValue;
    }

    window.__squareCraftBorderStateMap.set(key, state);

    const styleId = `sc-button-border-${typeClass}`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    // ✅ FIXED: Get the current border style from global state
    const currentBorderStyle = window.__squareCraftBorderStyle || "solid";
    const currentBorderColor = window.__squareCraftBorderColor || "black";

    // Create border styles object for local state
    const borderStyles = {
      boxSizing: "border-box",
      borderStyle: currentBorderStyle,
      borderColor: currentBorderColor,
      borderTopWidth: `${state.values.Top || 0}px`,
      borderRightWidth: `${state.values.Right || 0}px`,
      borderBottomWidth: `${state.values.Bottom || 0}px`,
      borderLeftWidth: `${state.values.Left || 0}px`,
      borderRadius: btn ? window.getComputedStyle(btn).borderRadius : "0px",
      overflow: btn ? window.getComputedStyle(btn).overflow : "hidden",
    };

    styleTag.innerHTML = `
      .${typeClass} {
        box-sizing: border-box !important;
        border-style: ${currentBorderStyle} !important;
        border-color: ${currentBorderColor} !important;
        border-top-width: ${state.values.Top || 0}px !important;
        border-right-width: ${state.values.Right || 0}px !important;
        border-bottom-width: ${state.values.Bottom || 0}px !important;
        border-left-width: ${state.values.Left || 0}px !important;
        border-radius: ${
          btn ? window.getComputedStyle(btn).borderRadius : "0px"
        } !important;
        overflow: ${
          btn ? window.getComputedStyle(btn).overflow : "hidden"
        } !important;
      }
    `;

    // Only update local state, do not save to DB
    if (blockId && blockId !== "block-id") {
      // ✅ CRITICAL FIX: Create payload based on ACTUAL button type being modified
      const buttonType = typeClass.includes("--primary")
        ? "buttonPrimary"
        : typeClass.includes("--secondary")
        ? "buttonSecondary"
        : typeClass.includes("--tertiary")
        ? "buttonTertiary"
        : "buttonPrimary";

      const stylePayload = {
        [buttonType]: {
          selector: `.${typeClass}`,
          styles: borderStyles,
        },
      };
      addPendingModification(blockId, stylePayload, "button", "border");
      if (saveToDB && typeof saveButtonBorderModifications === "function") {
        saveButtonBorderModifications(blockId, stylePayload);
      }
      if (typeof showNotification === "function") {
        showNotification("Border updated locally!", "info");
      }
    }
  }

  function updateUIFromValue(value) {
    currentValue = Math.max(0, Math.min(max, value));
    const percent = (currentValue / max) * 100;
    bullet.style.left = `${percent}%`;
    fill.style.width = `${percent}%`;
    valueText.textContent = `${currentValue}px`;
    applyBorder();
  }

  bullet.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const move = (eMove) => {
      const rect = field.getBoundingClientRect();
      const x = Math.min(Math.max(eMove.clientX - rect.left, 0), rect.width);
      const value = Math.round((x / rect.width) * max);
      updateUIFromValue(value);
    };
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  field.addEventListener("click", (e) => {
    const rect = field.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const value = Math.round((x / rect.width) * max);
    updateUIFromValue(value);
  });

  incBtn?.addEventListener("click", () => updateUIFromValue(currentValue + 1));
  decBtn?.addEventListener("click", () => updateUIFromValue(currentValue - 1));
  resetBtn?.addEventListener("click", () => updateUIFromValue(0));

  setTimeout(() => {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary, button.sqs-button-element--primary, button.sqs-button-element--secondary, button.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const typeClass = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    const blockId = selected.id || "block-id";
    const key = `${blockId}--${typeClass}`;
    const stored = window.__squareCraftBorderStateMap.get(key);
    if (stored?.side) {
      if (stored.side === "All") {
        const v = stored.values;
        const avg =
          ((v.Top ?? 0) + (v.Right ?? 0) + (v.Bottom ?? 0) + (v.Left ?? 0)) / 4;
        currentValue = Math.round(avg);
      } else {
        currentValue = stored.values[stored.side] || 0;
      }
      updateUIFromValue(currentValue);
    }
  }, 50);
}

export function initButtonBorderTypeToggle(
  getSelectedElement,
  addPendingModification,
  showNotification,
  saveButtonBorderModifications
) {
  const borderTypeMap = new Map();

  function updateBorderType(blockId, typeClass, borderType, saveToDB = false) {
    if (!blockId || !typeClass) {
      console.warn("❌ Missing required data for border type:", {
        blockId,
        typeClass,
      });
      return;
    }

    try {
      const styleId = `sc-border-type-${typeClass}`;
      let style = document.getElementById(styleId);
      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        document.head.appendChild(style);
      }

      style.innerHTML = `
        .${typeClass} {
          border-style: ${borderType} !important;
        }
      `;

      // ✅ FIXED: Create payload based on ACTUAL button type being modified
      const buttonType = typeClass.includes("--primary")
        ? "buttonPrimary"
        : typeClass.includes("--secondary")
        ? "buttonSecondary"
        : typeClass.includes("--tertiary")
        ? "buttonTertiary"
        : "buttonPrimary";

      const stylePayload = {
        [buttonType]: {
          selector: `.${typeClass}`,
          styles: {
            borderStyle: borderType,
            borderColor: window.__squareCraftBorderColor || "black", // Include selected border color
          },
        },
      };
      addPendingModification(blockId, stylePayload, "button", "border");

      // ✅ FIXED: Always save border style changes to database
      if (typeof saveButtonBorderModifications === "function") {
        console.log(`💾 Saving border style change to database: ${borderType}`);
        saveButtonBorderModifications(blockId, stylePayload);
      }

      if (typeof showNotification === "function") {
        showNotification(`Border style changed to ${borderType}!`, "success");
      }
    } catch (error) {
      console.error("❌ Error updating border type:", error);
      if (typeof showNotification === "function") {
        showNotification("Failed to update border type", "error");
      }
    }
  }

  const typeButtons = [
    { id: "buttonBorderTypeSolid", type: "solid" },
    { id: "buttonBorderTypeDashed", type: "dashed" },
    { id: "buttonBorderTypeDotted", type: "dotted" },
  ];

  typeButtons.forEach(({ id, type }) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.onclick = () => {
      typeButtons.forEach(({ id }) => {
        const btn = document.getElementById(id);
        btn?.classList.remove("sc-bg-454545");
      });

      el.classList.add("sc-bg-454545");
      window.__squareCraftBorderStyle = type;

      const selected = getSelectedElement?.();
      if (!selected) return;

      const btn = selected.querySelector(
        "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary, button.sqs-button-element--primary, button.sqs-button-element--secondary, button.sqs-button-element--tertiary"
      );
      if (!btn) return;

      const typeClass = [...btn.classList].find((cls) =>
        cls.startsWith("sqs-button-element--")
      );
      if (!typeClass) return;

      const blockId = selected.id || "block-id";
      const key = `${blockId}--${typeClass}`;
      const state = window.__squareCraftBorderStateMap.get(key) || {
        values: {},
        side: "All",
        color: "#000000",
      };
      window.__squareCraftBorderStateMap.set(key, { ...state });

      // ✅ FIXED: Update border type and also trigger border update to apply new style
      updateBorderType(blockId, typeClass, type);

      // ✅ NEW: Force update the border to apply the new style immediately
      if (window.__squareCraftBorderStateMap.has(key)) {
        const currentState = window.__squareCraftBorderStateMap.get(key);
        if (currentState && currentState.values) {
          // Get current border width value
          let currentWidth = 0;
          if (currentState.side === "All") {
            const v = currentState.values;
            currentWidth = Math.round(
              ((v.Top ?? 0) +
                (v.Right ?? 0) +
                (v.Bottom ?? 0) +
                (v.Left ?? 0)) /
                4
            );
          } else {
            currentWidth = currentState.values[currentState.side] || 0;
          }

          // Force apply border with new style
          if (currentWidth > 0) {
            console.log(
              `🔄 Forcing border update with new style: ${type}, width: ${currentWidth}px`
            );
            // Trigger border update by calling applyBorder directly
            setTimeout(() => {
              const selectedElement = getSelectedElement?.();
              if (selectedElement && selectedElement.id === blockId) {
                // Update the current value and trigger applyBorder
                currentValue = currentWidth;
                applyBorder();
              }
            }, 10);
          }
        }
      }
    };
  });
}

export function initButtonBorderRadiusControl(
  getSelectedElement,
  addPendingModification,
  showNotification,
  saveButtonBorderModifications
) {
  // --- State Management ---
  if (!window.__scButtonStyleMap) {
    window.__scButtonStyleMap = new Map();
  }

  // Store pending modifications locally
  const pendingBorderRadiusModifications = new Map();

  // --- State ---
  let activeRadiusTarget = "all";
  let radiusValues = {
    all: 0,
    topLeft: 0,
    topRight: 0,
    bottomRight: 0,
    bottomLeft: 0,
  };
  const max = 100;

  // --- UI Elements (matching your HTML) ---
  const allBtn = document.getElementById("allradiusBorder");
  const topLeftBtn = document.getElementById("buttontopLeftradiusBorder");
  const topRightBtn = document.getElementById("buttontopRightradiusBorder");
  const bottomRightBtn = document.getElementById(
    "buttonbottomRightradiusBorder"
  );
  const bottomLeftBtn = document.getElementById("buttonbottomLeftradiusBorder");
  const fillField = document.getElementById("buttonBorderradiusField");
  const bullet = document.getElementById("buttonBorderradiusBullet");
  const fill = document.getElementById("buttonBorderradiusFill");
  const valueText = document.getElementById("buttonBorderradiusCount");
  const incBtn = document.getElementById("buttonBorderradiusIncrease");
  const decBtn = document.getElementById("buttonBorderradiusDecrease");
  const resetBtn = document.querySelector(
    '#border-radius-reset img[alt="reset"]'
  );

  if (
    !fillField ||
    !bullet ||
    !fill ||
    !valueText ||
    !allBtn ||
    !topLeftBtn ||
    !topRightBtn ||
    !bottomRightBtn ||
    !bottomLeftBtn
  )
    return;

  // --- Helper: Get Button Type Class ---
  function getButtonTypeClass(btn) {
    if (btn.classList.contains("sqs-button-element--secondary"))
      return "sqs-button-element--secondary";
    if (btn.classList.contains("sqs-button-element--tertiary"))
      return "sqs-button-element--tertiary";
    return "sqs-button-element--primary";
  }

  // --- Merge and Save Button Styles ---
  function mergeAndSaveButtonRadiusStyles(blockId, typeClass, newStyles) {
    console.log("🔄 mergeAndSaveButtonRadiusStyles called with:", {
      blockId,
      typeClass,
      newStyles,
    });

    // ✅ FIXED: Determine the correct button type key
    const buttonType = typeClass.includes("--primary")
      ? "buttonPrimary"
      : typeClass.includes("--secondary")
      ? "buttonSecondary"
      : typeClass.includes("--tertiary")
      ? "buttonTertiary"
      : "buttonPrimary";

    const prevStyles = window.__scButtonStyleMap.get(blockId) || {
      [buttonType]: {
        selector: `.${typeClass}`,
        styles: {},
      },
    };

    const mergedStyles = {
      ...prevStyles[buttonType]?.styles,
      ...(newStyles || {}),
    };

    const finalData = {
      [buttonType]: {
        selector: `.${typeClass}`,
        styles: mergedStyles,
      },
    };

    // Save to map only (no DB call)
    window.__scButtonStyleMap.set(blockId, finalData);

    // Store in local pendingModifications
    pendingBorderRadiusModifications.set(blockId, finalData);

    console.log("💾 Added to pending radius modifications:", {
      blockId,
      buttonType,
      finalData,
      pendingCount: pendingBorderRadiusModifications.size,
    });
  }

  // --- Apply Border Radius to Button ---

  // function applyBorderRadius(type, value) {
  //   const selected = getSelectedElement?.();
  //   const btn = selected?.querySelector(
  //     ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
  //   );
  //   if (!btn) return;

  //   const typeClass = getButtonTypeClass(btn);
  //   const styleId = `sc-button-radius-${typeClass.replace(/--/g, "-")}`;
  //   let styleTag = document.getElementById(styleId);
  //   if (!styleTag) {
  //     styleTag = document.createElement("style");
  //     styleTag.id = styleId;
  //     document.head.appendChild(styleTag);
  //   }

  //   // Force all others to 0 if specific corner is selected
  //   if (type !== "all") {
  //     radiusValues = {
  //       all: 0,
  //       topLeft: 0,
  //       topRight: 0,
  //       bottomRight: 0,
  //       bottomLeft: 0,
  //     };
  //     radiusValues[type] = value;
  //   } else {
  //     radiusValues = {
  //       all: value,
  //       topLeft: value,
  //       topRight: value,
  //       bottomRight: value,
  //       bottomLeft: value,
  //     };
  //   }

  //   // --- Compose CSS
  //   let css = `.${typeClass} {\n`;
  //   if (type === "all") {
  //     css += `  border-radius: ${value}px !important;\n`;
  //   } else {
  //     css += `  border-top-left-radius: ${radiusValues.topLeft}px !important;\n`;
  //     css += `  border-top-right-radius: ${radiusValues.topRight}px !important;\n`;
  //     css += `  border-bottom-right-radius: ${radiusValues.bottomRight}px !important;\n`;
  //     css += `  border-bottom-left-radius: ${radiusValues.bottomLeft}px !important;\n`;
  //   }
  //   css += `  overflow: hidden !important;\n`;
  //   css += `}\n`;

  //   css += `.${typeClass} span,\n.${typeClass} .sqs-add-to-cart-button-inner {\n  border-radius: inherit !important;\n}\n`;
  //   css += `.${typeClass}:hover {\n  border-radius: inherit !important;\n  overflow: hidden !important;\n}\n`;
  //   css += `.${typeClass}:hover span,\n.${typeClass}:hover .sqs-add-to-cart-button-inner {\n  border-radius: inherit !important;\n}`;

  //   styleTag.textContent = css;

  //   const blockId = selected.id;
  //   if (blockId && blockId !== "block-id") {
  //     const cssData = {
  //       overflow: "hidden",
  //     };

  //     if (type === "all") {
  //       cssData["border-radius"] = `${value}px`;
  //     } else {
  //       // Apply only the active corner style
  //       const cornerMap = {
  //         topLeft: "border-top-left-radius",
  //         topRight: "border-top-right-radius",
  //         bottomRight: "border-bottom-right-radius",
  //         bottomLeft: "border-bottom-left-radius",
  //       };
  //       cssData[cornerMap[type]] = `${value}px`;
  //     }

  //     mergeAndSaveButtonRadiusStyles(blockId, typeClass, cssData);

  //     if (typeof showNotification === "function") {
  //       showNotification("Border radius updated locally!", "info");
  //     }
  //   }
  // }

  function applyBorderRadius(type, value) {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
    );
    if (!btn) return;

    const typeClass = getButtonTypeClass(btn);
    const styleId = `sc-button-radius-${typeClass.replace(/--/g, "-")}`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    // ✅ Just update value (DO NOT reset other corners)
    if (type === "all") {
      radiusValues.all = value;
      radiusValues.topLeft = value;
      radiusValues.topRight = value;
      radiusValues.bottomRight = value;
      radiusValues.bottomLeft = value;
    } else {
      radiusValues.all = 0;
      radiusValues[type] = value;
    }

    // ✅ Compose CSS with current state
    let css = `.${typeClass} {\n`;
    if (type === "all") {
      css += `  border-radius: ${value}px !important;\n`;
    } else {
      css += `  border-top-left-radius: ${radiusValues.topLeft}px !important;\n`;
      css += `  border-top-right-radius: ${radiusValues.topRight}px !important;\n`;
      css += `  border-bottom-right-radius: ${radiusValues.bottomRight}px !important;\n`;
      css += `  border-bottom-left-radius: ${radiusValues.bottomLeft}px !important;\n`;
    }
    css += `  overflow: hidden !important;\n`;
    css += `}\n`;

    css += `.${typeClass} span,\n.${typeClass} .sqs-add-to-cart-button-inner {\n  border-radius: inherit !important;\n}\n`;
    css += `.${typeClass}:hover {\n  border-radius: inherit !important;\n  overflow: hidden !important;\n}\n`;
    css += `.${typeClass}:hover span,\n.${typeClass}:hover .sqs-add-to-cart-button-inner {\n  border-radius: inherit !important;\n}`;

    styleTag.textContent = css;

    const blockId = selected.id;
    if (blockId && blockId !== "block-id") {
      const styleData = {
        overflow: "hidden",
        borderColor: window.__squareCraftBorderColor || "black", // Include selected border color
      };

      if (type === "all") {
        styleData["border-radius"] = `${value}px`;
      } else {
        styleData["border-top-left-radius"] = `${radiusValues.topLeft}px`;
        styleData["border-top-right-radius"] = `${radiusValues.topRight}px`;
        styleData[
          "border-bottom-right-radius"
        ] = `${radiusValues.bottomRight}px`;
        styleData["border-bottom-left-radius"] = `${radiusValues.bottomLeft}px`;
      }

      mergeAndSaveButtonRadiusStyles(blockId, typeClass, styleData);

      if (typeof showNotification === "function") {
        showNotification("Border radius updated locally!", "info");
      }
    }
  }

  // --- UI Update ---
  function updateUIForTarget(target) {
    // Highlight selected button
    [allBtn, topLeftBtn, topRightBtn, bottomRightBtn, bottomLeftBtn].forEach(
      (btn) => btn.classList.remove("sc-bg-454545")
    );
    if (target === "all") allBtn.classList.add("sc-bg-454545");
    if (target === "topLeft") topLeftBtn.classList.add("sc-bg-454545");
    if (target === "topRight") topRightBtn.classList.add("sc-bg-454545");
    if (target === "bottomRight") bottomRightBtn.classList.add("sc-bg-454545");
    if (target === "bottomLeft") bottomLeftBtn.classList.add("sc-bg-454545");

    // Update slider and value to match the active target
    const value = Math.min(max, radiusValues[target]);
    const percent = (value / max) * 100;
    bullet.style.left = `${percent}%`;
    fill.style.width = `${percent}%`;
    valueText.textContent = `${value}px`;
  }

  // --- Function to sync UI controls with restored styles ---
  function syncUIWithRestoredStyles(blockId, typeClass) {
    const prevStyles =
      window.__scButtonStyleMap.get(blockId)?.[typeClass]?.styles || {};
    const borderRadius = prevStyles["border-radius"];

    if (borderRadius) {
      // Parse border-radius value
      let values = borderRadius.split(" ").map((v) => parseInt(v));
      if (values.length === 1)
        values = [values[0], values[0], values[0], values[0]];
      if (values.length === 2)
        values = [values[0], values[1], values[0], values[1]];
      if (values.length === 3)
        values = [values[0], values[1], values[2], values[1]];
      if (values.length === 4) values = values;

      radiusValues.topLeft = values[0] || 0;
      radiusValues.topRight = values[1] || 0;
      radiusValues.bottomRight = values[2] || 0;
      radiusValues.bottomLeft = values[3] || 0;
      radiusValues.all = values[0] || 0;

      updateUIForTarget(activeRadiusTarget);
      console.log("🔄 Synced border radius UI:", borderRadius);
    }
  }

  // --- Slider/Field Events ---
  bullet.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const move = (eMove) => {
      const rect = fillField.getBoundingClientRect();
      const x = Math.min(Math.max(eMove.clientX - rect.left, 0), rect.width);
      const value = Math.min(max, Math.round((x / rect.width) * max));
      if (activeRadiusTarget === "all") {
        radiusValues.all = value;
        radiusValues.topLeft = value;
        radiusValues.topRight = value;
        radiusValues.bottomRight = value;
        radiusValues.bottomLeft = value;
      } else {
        // Set only the active corner, others to 0
        // ["topLeft", "topRight", "bottomRight", "bottomLeft"].forEach((side) => {
        //   radiusValues[side] = side === activeRadiusTarget ? value : 0;
        // });
        // radiusValues[activeRadiusTarget] = value;
        radiusValues[activeRadiusTarget] = value;
        radiusValues.all = 0;
      }
      updateUIForTarget(activeRadiusTarget);
      applyBorderRadius(activeRadiusTarget, value);
    };
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  fillField.addEventListener("click", (e) => {
    const rect = fillField.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const value = Math.min(max, Math.round((x / rect.width) * max));
    if (activeRadiusTarget === "all") {
      radiusValues.all = value;
      radiusValues.topLeft = value;
      radiusValues.topRight = value;
      radiusValues.bottomRight = value;
      radiusValues.bottomLeft = value;
    } else {
      // ["topLeft", "topRight", "bottomRight", "bottomLeft"].forEach((side) => {
      //   radiusValues[side] = side === activeRadiusTarget ? value : 0;
      // });
      radiusValues[activeRadiusTarget] = value;
      radiusValues.all = 0;
    }
    updateUIForTarget(activeRadiusTarget);
    applyBorderRadius(activeRadiusTarget, value);
  });

  incBtn?.addEventListener("click", () => {
    let value = Math.min(max, radiusValues[activeRadiusTarget] + 1);
    if (activeRadiusTarget === "all") {
      radiusValues.all = value;
      radiusValues.topLeft = value;
      radiusValues.topRight = value;
      radiusValues.bottomRight = value;
      radiusValues.bottomLeft = value;
    } else {
      // ["topLeft", "topRight", "bottomRight", "bottomLeft"].forEach((side) => {
      //   radiusValues[side] = side === activeRadiusTarget ? value : 0;
      // });
      radiusValues[activeRadiusTarget] = value;
      radiusValues.all = 0;
    }
    updateUIForTarget(activeRadiusTarget);
    applyBorderRadius(activeRadiusTarget, value);
  });

  decBtn?.addEventListener("click", () => {
    let value = Math.max(0, radiusValues[activeRadiusTarget] - 1);
    if (activeRadiusTarget === "all") {
      radiusValues.all = value;
      radiusValues.topLeft = value;
      radiusValues.topRight = value;
      radiusValues.bottomRight = value;
      radiusValues.bottomLeft = value;
    } else {
      // ["topLeft", "topRight", "bottomRight", "bottomLeft"].forEach((side) => {
      //   radiusValues[side] = side === activeRadiusTarget ? value : 0;
      // });
      radiusValues[activeRadiusTarget] = value;
      radiusValues.all = 0;
    }
    updateUIForTarget(activeRadiusTarget);
    applyBorderRadius(activeRadiusTarget, value);
  });

  // --- Corner Button Events ---
  allBtn.addEventListener("click", () => {
    activeRadiusTarget = "all";
    // Set all corners to the current value of 'all'
    const value = radiusValues.all;
    radiusValues.topLeft = value;
    radiusValues.topRight = value;
    radiusValues.bottomRight = value;
    radiusValues.bottomLeft = value;
    updateUIForTarget("all");
    applyBorderRadius("all", value);
  });
  topLeftBtn.addEventListener("click", () => {
    activeRadiusTarget = "topLeft";
    // Set only topLeft to its value, others to 0
    const value = radiusValues.topLeft;
    radiusValues.topLeft = value;
    radiusValues.topRight = 0;
    radiusValues.bottomRight = 0;
    radiusValues.bottomLeft = 0;
    radiusValues.all = 0;
    updateUIForTarget("topLeft");
    applyBorderRadius("topLeft", value);
  });
  topRightBtn.addEventListener("click", () => {
    activeRadiusTarget = "topRight";
    const value = radiusValues.topRight;
    radiusValues.topLeft = 0;
    radiusValues.topRight = value;
    radiusValues.bottomRight = 0;
    radiusValues.bottomLeft = 0;
    radiusValues.all = 0;
    updateUIForTarget("topRight");
    applyBorderRadius("topRight", value);
  });
  bottomRightBtn.addEventListener("click", () => {
    activeRadiusTarget = "bottomRight";
    const value = radiusValues.bottomRight;
    radiusValues.topLeft = 0;
    radiusValues.topRight = 0;
    radiusValues.bottomRight = value;
    radiusValues.bottomLeft = 0;
    radiusValues.all = 0;
    updateUIForTarget("bottomRight");
    applyBorderRadius("bottomRight", value);
  });
  bottomLeftBtn.addEventListener("click", () => {
    activeRadiusTarget = "bottomLeft";
    const value = radiusValues.bottomLeft;
    radiusValues.topLeft = 0;
    radiusValues.topRight = 0;
    radiusValues.bottomRight = 0;
    radiusValues.bottomLeft = value;
    radiusValues.all = 0;
    updateUIForTarget("bottomLeft");
    applyBorderRadius("bottomLeft", value);
  });

  // --- Reset functionality ---
  function resetBorderRadiusStyles() {
    const selected = getSelectedElement?.();
    if (!selected) {
      console.warn("❌ No button selected for border-radius reset");
      return;
    }

    const btn = selected.querySelector(
      ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
    );
    if (!btn) return;

    const typeClass = getButtonTypeClass(btn);
    const blockId = selected.id;

    // Remove border-radius styles from style tag
    const styleId = `sc-button-radius-${typeClass.replace(/--/g, "-")}`;
    const styleTag = document.getElementById(styleId);
    if (styleTag) {
      styleTag.remove();
    }

    // Reset radius values
    radiusValues = {
      all: 0,
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0,
    };

    // Reset UI
    updateUIForTarget(activeRadiusTarget);

    // Update map and pending modifications
    const currentStyles = window.__scButtonStyleMap.get(blockId) || {};
    const updatedStyles = {
      ...currentStyles,
      [typeClass]: {
        ...currentStyles[typeClass],
        styles: {
          ...currentStyles[typeClass]?.styles,
          "border-radius": undefined,
          overflow: undefined,
        },
      },
    };

    // Clean up undefined values
    Object.keys(updatedStyles[typeClass].styles).forEach((key) => {
      if (updatedStyles[typeClass].styles[key] === undefined) {
        delete updatedStyles[typeClass].styles[key];
      }
    });

    window.__scButtonStyleMap.set(blockId, updatedStyles);
    pendingBorderRadiusModifications.set(blockId, updatedStyles);

    console.log("✅ Border-radius styles reset locally");
  }

  // --- Reset button event listener ---
  resetBtn?.addEventListener("click", () => {
    console.log("🔄 Reset button clicked for border-radius");
    resetBorderRadiusStyles();
  });

  // --- Initialize UI with current button border radius ---
  setTimeout(() => {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
    );
    if (!btn) return;

    const typeClass = getButtonTypeClass(btn);
    const blockId = selected.id;

    // Try to sync with restored styles first
    if (blockId) {
      syncUIWithRestoredStyles(blockId, typeClass);
    }

    // Fallback to computed styles if no restored data
    if (radiusValues.all === 0) {
      const computed = window.getComputedStyle(btn).borderRadius || "0";
      let values = computed.split(" ").map((v) => parseInt(v));
      if (values.length === 1)
        values = [values[0], values[0], values[0], values[0]];
      if (values.length === 2)
        values = [values[0], values[1], values[0], values[1]];
      if (values.length === 3)
        values = [values[0], values[1], values[2], values[1]];
      if (values.length === 4) values = values;

      radiusValues.topLeft = values[0] || 0;
      radiusValues.topRight = values[1] || 0;
      radiusValues.bottomRight = values[2] || 0;
      radiusValues.bottomLeft = values[3] || 0;
      radiusValues.all = values[0] || 0;
      updateUIForTarget(activeRadiusTarget);
    }
  }, 50);

  // ✅ NEW: Initialize border style buttons to show current selection
  setTimeout(() => {
    const currentStyle = window.__squareCraftBorderStyle || "solid";
    const styleButtons = [
      { id: "buttonBorderTypeSolid", type: "solid" },
      { id: "buttonBorderTypeDashed", type: "dashed" },
      { id: "buttonBorderTypeDotted", type: "dotted" },
    ];

    styleButtons.forEach(({ id, type }) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.classList.remove("sc-bg-454545");
        if (type === currentStyle) {
          btn.classList.add("sc-bg-454545");
        }
      }
    });

    console.log(
      `🎨 Initialized border style UI with current style: ${currentStyle}`
    );
  }, 100);
}

export function ensurePublishButtonInShadow(
  getSelectedElement,
  saveButtonShadowModifications,
  showNotification
) {
  if (window.shadowPublishBound) return;

  const publishButton = document.getElementById("publish");
  if (!publishButton) return; // widget not ready yet
  if (publishButton.dataset.shadowBound === "1") return;

  publishButton.dataset.shadowBound = "1";
  window.shadowPublishBound = true;

  publishButton.addEventListener("click", async () => {
    try {
      const currentElement = getSelectedElement?.();
      const blockId = currentElement?.id;

      if (!blockId) {
        console.warn("❌ Missing blockId");
        return;
      }

      // Check both window.pendingModifications and shadowStatesByType
      const pendingList = window.pendingModifications?.get(blockId) || [];
      const shadowMods = pendingList.filter(
        (m) => m.tagType === "buttonShadow"
      );

      console.log("🔍 Debug publish data:", {
        blockId,
        pendingModifications: window.pendingModifications,
        pendingList,
        shadowMods,
        shadowStatesByType: window.shadowStatesByType,
      });

      // If no pending modifications, try to get current shadow states
      let shadowData = null;
      if (shadowMods.length > 0) {
        shadowData = shadowMods[0];
        console.log("✅ Using pending shadow data:", shadowData);
      } else if (
        window.shadowStatesByType &&
        window.shadowStatesByType.size > 0
      ) {
        // Create shadow data from current states
        shadowData = {
          tagType: "buttonShadow",
          css: {},
        };

        // Get all button types that have shadow states
        for (const [typeClass, state] of window.shadowStatesByType) {
          if (
            state &&
            (state.Xaxis !== 0 ||
              state.Yaxis !== 0 ||
              state.Blur !== 0 ||
              state.Spread !== 0)
          ) {
            const typeKey = typeKeyFromClass(typeClass);
            const color = state.Color || "rgba(0,0,0,0.3)";
            const shadowValue = `${state.Xaxis}px ${state.Yaxis}px ${state.Blur}px ${state.Spread}px ${color}`;

            shadowData.css[typeKey] = [
              {
                selector: typeClass,
                styles: {
                  boxShadow: shadowValue,
                  borderColor: window.__squareCraftBorderColor || "black",
                },
              },
            ];
          }
        }
        console.log("✅ Created shadow data from states:", shadowData);
      }

      if (
        !shadowData ||
        !shadowData.css ||
        Object.keys(shadowData.css).length === 0
      ) {
        console.warn("❌ No shadow data to save");
        return;
      }

      // UI state
      const originalText = publishButton.textContent;
      const originalBg = publishButton.style.backgroundColor;
      publishButton.textContent = "Publishing...";
      publishButton.disabled = true;

      // Merge css by button type
      const merged = {
        buttonPrimary: [],
        buttonSecondary: [],
        buttonTertiary: [],
      };

      const pushAll = (src, dest) => {
        if (Array.isArray(src)) {
          src.forEach((it) => {
            if (it?.selector && it?.styles && Object.keys(it.styles).length) {
              dest.push(it);
            }
          });
        } else if (src?.selector && src?.styles) {
          dest.push(src);
        }
      };

      for (const mod of [shadowData]) {
        const css = mod?.css || {};
        pushAll(css.buttonPrimary, merged.buttonPrimary);
        pushAll(css.buttonSecondary, merged.buttonSecondary);
        pushAll(css.buttonTertiary, merged.buttonTertiary);
      }

      if (
        merged.buttonPrimary.length +
          merged.buttonSecondary.length +
          merged.buttonTertiary.length ===
        0
      ) {
        console.warn("❌ No valid shadow data to save");
        publishButton.textContent = originalText;
        publishButton.disabled = false;
        return;
      }

      console.log("📤 Publishing shadow data:", { blockId, merged });
      const result = await saveButtonShadowModifications(blockId, merged);

      // Clear only buttonShadow entries if saved OK
      if (result?.success) {
        const remaining = pendingList.filter(
          (m) => m.tagType !== "buttonShadow"
        );
        if (remaining.length)
          window.pendingModifications.set(blockId, remaining);
        else window.pendingModifications.delete(blockId);

        // Also clear the shadow states after successful save
        if (window.shadowStatesByType) {
          window.shadowStatesByType.clear();
        }
      }

      // UI feedback
      publishButton.textContent = "Published";
      publishButton.style.backgroundColor = "#4CAF50";
      setTimeout(() => {
        publishButton.textContent = originalText;
        publishButton.style.backgroundColor = originalBg || "#EF7C2F";
        publishButton.disabled = false;
      }, 1200);

      showNotification?.(
        "Button shadow changes published",
        result?.success ? "success" : "error"
      );
    } catch (err) {
      console.error("Error publishing button shadow changes:", err);
      publishButton.textContent = "Publish";
      publishButton.style.backgroundColor = "#EF7C2F";
      publishButton.disabled = false;
      showNotification?.("Publish failed", "error");
    }
  });
}

// Helper function to get button type key from class
function typeKeyFromClass(typeClass) {
  if (!typeClass) return "buttonPrimary";
  if (typeClass.includes("--primary")) return "buttonPrimary";
  if (typeClass.includes("--secondary")) return "buttonSecondary";
  if (typeClass.includes("--tertiary")) return "buttonTertiary";
  return "buttonPrimary";
}

export function initButtonShadowControls(
  getSelectedElement,
  addPendingModification,
  showNotification,
  saveButtonShadowModifications
) {
  if (!window.shadowStatesByType) {
    window.shadowStatesByType = new Map();
  }

  function applyShadow(saveToDB = false) {
    const el = getSelectedElement?.();
    if (!el) return;

    const btn = el.querySelector(
      ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
    );
    if (!btn) return;

    const typeClass = [...btn.classList].find((cls) =>
      cls.startsWith("sqs-button-element--")
    );
    if (!typeClass) return;

    if (!window.shadowStatesByType.has(typeClass)) {
      window.shadowStatesByType.set(typeClass, {
        Xaxis: 0,
        Yaxis: 0,
        Blur: 0,
        Spread: 0,
      });
    }

    const shadowState = window.shadowStatesByType.get(typeClass);
    // const value = `${shadowState.Xaxis}px ${shadowState.Yaxis}px ${shadowState.Blur}px ${shadowState.Spread}px rgba(0,0,0,0.3)`;
    const color = shadowState.Color || "rgba(0,0,0,0.3)";
    const value = `${shadowState.Xaxis}px ${shadowState.Yaxis}px ${shadowState.Blur}px ${shadowState.Spread}px ${color}`;
    // Apply to DOM
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

    // Save to database and local state
    const blockId = el.id;
    if (!blockId) {
      console.warn("❌ No block ID found for selected element");
      return;
    }

    const stylePayload = {
      buttonPrimary: {
        selector: ".sqs-button-element--primary",
        styles: {
          boxShadow: value,
          borderColor: window.__squareCraftBorderColor || "black", // Include selected border color
        },
      },
    };

    // Add to pending modifications
    addPendingModification(blockId, stylePayload, "button", "shadow");

    // Save to database if requested
    if (saveToDB && typeof saveButtonShadowModifications === "function") {
      saveButtonShadowModifications(blockId, stylePayload);
    }

    if (typeof showNotification === "function") {
      showNotification("Shadow updated!", "success");
    }
  }

  function setupShadowControl(type, range = 50) {
    const bullet = document.getElementById(`buttonShadow${type}Bullet`);
    const field = document.getElementById(`buttonShadow${type}Field`);
    const label = document.getElementById(`buttonShadow${type}Count`);
    const idPrefix = type.replace("axis", "");
    const incBtn =
      document.getElementById(`buttonshadow${type}Increase`) ||
      document.getElementById(`buttonshadow${idPrefix}Increase`);
    const decBtn =
      document.getElementById(`buttonshadow${type}Decrease`) ||
      document.getElementById(`buttonshadow${idPrefix}Decrease`);

    if (!bullet || !field || !label) return;

    field.style.position = "relative";

    let minValue = 0;
    if (type === "Xaxis" || type === "Yaxis") minValue = -range;
    const maxValue = range;

    let fill = field.querySelector(".sc-shadow-fill");
    if (!fill) {
      fill = document.createElement("div");
      fill.className = "sc-shadow-fill";
      fill.style.position = "absolute";
      fill.style.top = "0";
      fill.style.left = "0";
      fill.style.height = "100%";
      fill.style.width = "0%";
      fill.style.backgroundColor = "#EF7C2F";
      fill.style.zIndex = "0";
      field.appendChild(fill);
    }

    bullet.style.position = "absolute";
    bullet.style.transform = "translateX(-50%)";
    bullet.style.zIndex = "1";

    function updateUI(value, saveToDB = false) {
      const el = getSelectedElement?.();
      if (!el) return;

      const btn = el.querySelector(
        ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
      );
      if (!btn) return;

      const typeClass = [...btn.classList].find((cls) =>
        cls.startsWith("sqs-button-element--")
      );
      if (!typeClass) return;

      if (!window.shadowStatesByType.has(typeClass)) {
        window.shadowStatesByType.set(typeClass, {
          Xaxis: 0,
          Yaxis: 0,
          Blur: 0,
          Spread: 0,
        });
      }

      const shadowState = window.shadowStatesByType.get(typeClass);
      const val = Math.max(minValue, Math.min(maxValue, value));
      shadowState[type] = val;

      const percent = ((val - minValue) / (maxValue - minValue)) * 100;
      const centerPercent = ((0 - minValue) / (maxValue - minValue)) * 100;

      bullet.style.left = `${percent}%`;
      fill.style.left = `${Math.min(percent, centerPercent)}%`;
      fill.style.width = `${Math.abs(percent - centerPercent)}%`;

      label.textContent = `${val}px`;
      applyShadow(saveToDB);
    }

    bullet.addEventListener("mousedown", (e) => {
      e.preventDefault();
      const rect = field.getBoundingClientRect();
      const move = (eMove) => {
        const x = Math.min(Math.max(eMove.clientX - rect.left, 0), rect.width);
        const percent = x / rect.width;
        const val = Math.round(percent * (maxValue - minValue) + minValue);
        updateUI(val, false); // Don't save to DB during drag
      };
      const up = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        // Save to DB when drag ends
        const el = getSelectedElement?.();
        if (el) {
          const btn = el.querySelector(
            ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
          );
          if (btn) {
            const typeClass = [...btn.classList].find((cls) =>
              cls.startsWith("sqs-button-element--")
            );
            if (typeClass && window.shadowStatesByType.has(typeClass)) {
              const shadowState = window.shadowStatesByType.get(typeClass);
              const value = `${shadowState.Xaxis}px ${shadowState.Yaxis}px ${shadowState.Blur}px ${shadowState.Spread}px rgba(0,0,0,0.3)`;
              const stylePayload = {
                buttonPrimary: {
                  selector: ".sqs-button-element--primary",
                  styles: { boxShadow: value },
                },
              };
              if (typeof saveButtonShadowModifications === "function") {
                saveButtonShadowModifications(el.id, stylePayload);
              }
            }
          }
        }
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    });

    field.addEventListener("click", (e) => {
      const rect = field.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
      const percent = x / rect.width;
      const val = Math.round(percent * (maxValue - minValue) + minValue);
      updateUI(val, true); // Save to DB on click
    });

    if (incBtn) {
      incBtn.onclick = () => {
        const el = getSelectedElement?.();
        if (!el) return;

        const btn = el.querySelector(
          ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
        );
        if (!btn) return;

        const typeClass = [...btn.classList].find((cls) =>
          cls.startsWith("sqs-button-element--")
        );
        if (!typeClass) return;

        const state = window.shadowStatesByType.get(typeClass) || {};
        const current = state[type] || 0;
        updateUI(current + 1, true); // Save to DB on button click
      };
    }

    if (decBtn) {
      decBtn.onclick = () => {
        const el = getSelectedElement?.();
        if (!el) return;

        const btn = el.querySelector(
          ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
        );
        if (!btn) return;

        const typeClass = [...btn.classList].find((cls) =>
          cls.startsWith("sqs-button-element--")
        );
        if (!typeClass) return;

        const state = window.shadowStatesByType.get(typeClass) || {};
        const current = state[type] || 0;
        updateUI(current - 1, true); // Save to DB on button click
      };
    }

    // Initial render
    const el = getSelectedElement?.();
    if (el) {
      const btn = el.querySelector(
        ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
      );
      if (btn) {
        const typeClass = [...btn.classList].find((cls) =>
          cls.startsWith("sqs-button-element--")
        );
        if (typeClass && window.shadowStatesByType.has(typeClass)) {
          const current = window.shadowStatesByType.get(typeClass)[type] || 0;
          updateUI(current, false); // Don't save to DB on initial load
        }
      }
    }
  }

  setupShadowControl("Xaxis", 30);
  setupShadowControl("Yaxis", 30);
  setupShadowControl("Blur", 50);
  setupShadowControl("Spread", 30);

  // Initialize the button shadow color palette
  // You may need to pass themeColors from your context or config
  const themeColors = window.themeColors || {};
  buttonShadowColorPalate(
    themeColors,
    getSelectedElement,
    saveButtonShadowModifications
  );

  // Call the publish button binding function
  ensurePublishButtonInShadow(
    getSelectedElement,
    saveButtonShadowModifications,
    showNotification
  );
}

window.syncButtonStylesFromElement = function (selectedElement) {
  try {
    if (!selectedElement) return;

    const sampleButton = selectedElement.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!sampleButton) return;

    const icon = sampleButton.querySelector(
      ".sqscraft-button-icon, .sqscraft-image-icon"
    );

    const getPercent = (val, max) => `${(val / max) * 100}%`;
    const set = (id, value, max) => {
      const count = document.getElementById(id + "Count");
      const fill = document.getElementById(id + "Fill");
      const bullet = document.getElementById(id + "Bullet");
      if (!count || !fill || !bullet) return;
      count.textContent = `${value}px`;
      fill.style.width = getPercent(value, max);
      bullet.style.left = getPercent(value, max);
    };

    set("buttonBorder", parseInt(sampleButton.style.borderWidth || "0"), 10);

    window.__squareCraftBorderStyle = sampleButton.style.borderStyle || "solid";
    [
      "buttonBorderTypeSolid",
      "buttonBorderTypeDashed",
      "buttonBorderTypeDotted",
    ].forEach((id) => {
      const btn = document.getElementById(id);
      if (btn)
        btn.classList.toggle(
          "sc-bg-454545",
          id.includes(window.__squareCraftBorderStyle)
        );
    });

    set(
      "buttonBorderradius",
      parseInt(sampleButton.style.borderRadius || "0"),
      50
    );

    const size = parseInt(icon?.style.width || "0");
    set("buttonIconSizeradius", size, 50);

    const transformMatch = icon?.style.transform?.match(
      /rotate\((-?\d+(?:\.\d+)?)deg\)/
    );
    if (transformMatch) {
      const rotation = parseFloat(transformMatch[1]);
      const percent = ((rotation + 180) / 360) * 100;

      const rotationCountEl = document.getElementById(
        "buttoniconRotationradiusCount"
      );
      const rotationBulletEl = document.getElementById(
        "buttonIconRotationradiusBullet"
      );
      const rotationFillEl = document.getElementById(
        "buttonIconRotationradiusFill"
      );

      if (rotationCountEl) rotationCountEl.textContent = `${rotation}deg`;
      if (rotationBulletEl) rotationBulletEl.style.left = `${percent}%`;
      if (rotationFillEl) {
        rotationFillEl.style.left = `${Math.min(percent, 50)}%`;
        rotationFillEl.style.width = `${Math.abs(percent - 50)}%`;
      }
    }

    const spacing = {
      top: parseInt(icon?.style.marginTop || "0"),
      bottom: parseInt(icon?.style.marginBottom || "0"),
      left: parseInt(icon?.style.marginLeft || "0"),
      right: parseInt(icon?.style.marginRight || "0"),
    };
    const spacingValue = Math.max(...Object.values(spacing));
    const spacingPercent = getPercent(spacingValue, 30);

    const spacingCountEl = document.getElementById(
      "buttoniconSpacingradiusCount"
    );
    const spacingFillEl = document.getElementById(
      "buttonIconSpacingradiusFill"
    );
    const spacingBulletEl = document.getElementById(
      "buttonIconSpacingradiusBullet"
    );

    if (spacingCountEl) spacingCountEl.textContent = `${spacingValue}px`;
    if (spacingFillEl) spacingFillEl.style.width = spacingPercent;
    if (spacingBulletEl) spacingBulletEl.style.left = spacingPercent;

    ["Top", "Bottom", "Left", "Right"].forEach((dir) => {
      const el = document.getElementById(`buttonIconSpacing${dir}`);
      if (el)
        el.classList.toggle("sc-bg-454545", spacing[dir.toLowerCase()] > 0);
    });

    const shadow = sampleButton.style.boxShadow || "";
    const match = shadow.match(/(-?\d+)px\s+(-?\d+)px\s+(\d+)px\s+(\d+)px/);
    if (match) {
      const [x, y, blur, spread] = match.slice(1).map(Number);
      const props = {
        Xaxis: [x, 30],
        Yaxis: [y, 30],
        Blur: [blur, 50],
        Spread: [spread, 30],
      };
      Object.entries(props).forEach(([type, [val, max]]) => {
        const count = document.getElementById(`buttonShadow${type}Count`);
        const bullet = document.getElementById(`buttonShadow${type}Bullet`);
        const fill = document.querySelector(
          `#buttonShadow${type}Field .sc-shadow-fill`
        );
        if (count) count.textContent = `${val}px`;
        if (bullet) bullet.style.left = getPercent(val, max);
        if (fill) fill.style.width = getPercent(val, max);
      });
    }

    window.updateActiveButtonBars?.();
  } catch (error) {
    console.warn("❌ Error syncing button styles from element:", error);
  }
};

export function resetAllButtonStyles(
  getSelectedElement,
  addPendingModification,
  showNotification,
  saveButtonModifications
) {
  function resetStyles(blockId, typeClass) {
    if (!blockId || !typeClass) {
      console.warn("❌ Missing required data for reset:", {
        blockId,
        typeClass,
      });
      return;
    }

    try {
      // Remove all style tags
      const styleTags = document.querySelectorAll(`style[id^="sc-"]`);
      styleTags.forEach((tag) => tag.remove());

      // Reset all maps
      buttonStyleMap.delete(blockId);
      iconPositionMap.delete(blockId);
      iconRotationMap.delete(blockId);
      iconSizeMap.delete(blockId);
      iconSpacingMap.delete(blockId);
      borderMap.delete(blockId);
      borderTypeMap.delete(blockId);
      borderRadiusMap.delete(blockId);

      // Save reset state
      mergeAndSaveButtonStyles(
        blockId,
        typeClass,
        {
          fontFamily: "inherit",
          fontWeight: "normal",
          fontSize: "inherit",
          color: "inherit",
          backgroundColor: "inherit",
          border: "none",
          borderRadius: "0",
          boxShadow: "none",
          transform: "none",
          marginRight: "0",
          flexDirection: "row",
        },
        saveButtonModifications,
        addPendingModification,
        showNotification,
        "reset"
      );

      if (typeof showNotification === "function") {
        showNotification("All button styles have been reset!", "success");
      }
    } catch (error) {
      console.error("❌ Error resetting styles:", error);
      if (typeof showNotification === "function") {
        showNotification("Failed to reset styles", "error");
      }
    }
  }

  const resetTrigger = document.getElementById("buttonResetAll");
  const resetIcon = document.getElementById("buttonResetAll-icon");
  if (!resetTrigger) return;

  resetTrigger.addEventListener("click", async () => {
    const selected = getSelectedElement?.();
    if (!selected) return;

    const button = selected.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary, " +
        "button.sqs-button-element--primary, button.sqs-button-element--secondary, button.sqs-button-element--tertiary"
    );
    if (!button) return;

    const typeClass = [...button.classList].find((cls) =>
      cls.startsWith("sqs-button-element--")
    );
    if (!typeClass) return;

    const blockId = selected.id || "block-id";
    const classKey = typeClass.replace(/--/g, "-");
    const fullKey = `${blockId}--${typeClass}`;
    const borderIds = [
      "buttonBorderAll",
      "buttonBorderTop",
      "buttonBorderBottom",
      "buttonBorderLeft",
      "buttonBorderRight",
    ];

    borderIds.forEach((id) => {
      const el = document.getElementById(id);
      if (el && el.classList.contains("sc-bg-454545")) {
        el.classList.remove("sc-bg-454545");
      }
    });

    const normalStyleIds = [
      `sc-font-style-${typeClass}`,
      `sc-font-weight-${typeClass}`,
      `sc-style-${typeClass}`,
      `sc-transform-style-${typeClass}`,
      `sc-button-border-${typeClass}`,
      `sc-normal-radius-${classKey}`,
      `sc-button-shadow-${typeClass}`,
    ];

    const hoverStyleIds = [
      `sc-hover-border-style-${classKey}`,
      `sc-hover-radius-${classKey}`,
      `sc-hover-shadow-${classKey}`,
      `sc-hover-style-size-${classKey}`,
      `sc-hover-style-gap-${classKey}`,
      `sc-hover-style-transform-${classKey}`,
      `sc-hover-effects-${classKey}`,
      `hover-button-border-${blockId}-${typeClass}`,
    ];

    [...normalStyleIds, ...hoverStyleIds].forEach((id) =>
      document.getElementById(id)?.remove()
    );

    const allBtns = document.querySelectorAll(`.${typeClass}`);
    allBtns.forEach((btn) => {
      btn.removeAttribute("style");
      btn.classList.remove("sc-flex", "sc-items-center");
      btn.style.gap = "";
      btn.style.borderWidth = "";
      btn.style.borderStyle = "";
      btn.style.borderRadius = "";
      btn.style.borderColor = "";
      btn.style.boxShadow = "";

      const spans = btn.querySelectorAll("span, .sqs-add-to-cart-button-inner");
      spans.forEach((span) => {
        span.removeAttribute("style");
        span.style.fontSize = "";
        span.style.letterSpacing = "";
        span.style.textTransform = "";
        span.style.fontFamily = "";
        span.style.fontWeight = "";
        span.style.transform = "";
      });

      const icons = btn.querySelectorAll(
        ".sqscraft-button-icon, .sqscraft-image-icon"
      );
      icons.forEach((icon) => icon.remove());

      const htmlSpans = btn.querySelectorAll(".sqs-html");
      htmlSpans.forEach((el) => el.removeAttribute("style"));
    });

    selected.querySelectorAll("*").forEach((el) => {
      [...el.classList].forEach((cls) => {
        if (cls.startsWith("sc-") || cls.startsWith("sqscraft-")) {
          el.classList.remove(cls);
        }
      });
    });

    document.querySelectorAll(".sc-active-bar").forEach((el) => el.remove());

    if (window.__squareCraftBorderStateMap) {
      window.__squareCraftBorderStateMap.delete(fullKey);
    }
    if (window.__squareCraftHoverBorderStateMap) {
      window.__squareCraftHoverBorderStateMap.delete(fullKey);
    }

    window.__squareCraftBorderStyle = "solid";
    window.__squareCraftHoverBorderColor = "black";
    window.__squareCraftHoverRadius = 0;
    window.__squareCraftTransformDistance = 0;
    window.shadowState = { Xaxis: 0, Yaxis: 0, Blur: 0, Spread: 0 };

    setTimeout(async () => {
      const selected = getSelectedElement?.();
      if (!selected) return;

      const inputSync = (id, value, percent) => {
        const bullet = document.getElementById(id + "Bullet");
        const fill = document.getElementById(id + "Fill");
        const count = document.getElementById(id + "Count");
        if (bullet) bullet.style.left = percent;
        if (fill) {
          fill.style.left = percent;
          fill.style.width = id.includes("Rotation") ? "0%" : percent;
        }
        if (count) count.textContent = value;
      };

      inputSync("buttonIconRotationradius", "0deg", "50%");
      document.getElementById("buttoniconRotationradiusCount").textContent =
        "0deg";

      inputSync("buttonIconSizeradius", "0px", "0%");
      document.getElementById("buttoniconSizeradiusCount").textContent = "0px";

      inputSync("buttonIconSpacingradius", "0px", "0%");
      document.getElementById("buttoniconSpacingCount").textContent = "0px";

      inputSync("hover-buttonIconTransformPosition", "0px", "50%");
      inputSync("hover-buttonBorder", "0px", "0%");
      inputSync("hover-buttonBorderradius", "0px", "0%");

      const fontSizeInput = document.getElementById("scButtonFontSizeInput");
      const letterSpacingInput = document.getElementById(
        "scButtonLetterSpacingInput"
      );
      if (fontSizeInput) {
        fontSizeInput.value = "";
        fontSizeInput.dispatchEvent(new Event("input"));
      }
      if (letterSpacingInput) {
        letterSpacingInput.value = "";
        letterSpacingInput.dispatchEvent(new Event("input"));
      }

      [
        "scButtonAllCapital",
        "scButtonAllSmall",
        "scButtonFirstCapital",
      ].forEach((id) => {
        const btn = document.getElementById(id);
        if (btn) {
          btn.classList.remove("sc-activeTab-border");
          btn.classList.add("sc-inActiveTab-border");
        }
      });

      const fontLabel = document.getElementById("font-name");
      if (fontLabel) {
        fontLabel.textContent = "Select";
        fontLabel.style.fontFamily = "";
      }

      const weightLabel = document.getElementById("scButtonFontWeightSelected");
      if (weightLabel) {
        weightLabel.textContent = "Select";
      }

      const iconLabel = document.getElementById("iconPositionLabel");
      if (iconLabel) {
        iconLabel.textContent = "Select";
      }

      ["buttonIconTransformNone", "buttoniconRotationTypeNone"].forEach(
        (id) => {
          const el = document.getElementById(id);
          if (el) el.classList.add("sc-bg-454545");
        }
      );

      ["Top", "Bottom", "Left", "Right"].forEach((dir) => {
        document
          .getElementById(`buttonIconSpacing${dir}`)
          ?.classList.remove("sc-bg-454545");
        document
          .getElementById(`buttoniconRotationType${dir}`)
          ?.classList.remove("sc-bg-454545");
      });

      if (typeof window.syncButtonStylesFromElement === "function") {
        window.syncButtonStylesFromElement(selected);
      }

      initButtonFontFamilyControls(getSelectedElement);
      initButtonStyles(getSelectedElement?.());
      initButtonIconPositionToggle(getSelectedElement);
      initButtonIconRotationControl(getSelectedElement);
      initButtonIconSizeControl(getSelectedElement);
      initButtonIconSpacingControl(getSelectedElement);
      initButtonBorderControl(
        getSelectedElement,
        addPendingModification,
        showNotification,
        saveButtonModifications
      );
      initButtonBorderTypeToggle(
        getSelectedElement,
        addPendingModification,
        showNotification,
        saveButtonModifications
      );
      initButtonBorderRadiusControl(
        getSelectedElement,
        addPendingModification,
        showNotification,
        saveButtonModifications
      );
      initButtonShadowControls(
        getSelectedElement,
        addPendingModification,
        showNotification,
        saveButtonShadowModifications
      );

      // Import and call ensurePublishButtonInShadow for shadow publish binding
      // const { ensurePublishButtonInShadow } = await import(
      //   "https://fatin-webefo.github.io/squareCraft-plugin/src/utils/initButtonStyles/initButtonHoverStyles.js"
      // );
      ensurePublishButtonInShadow(
        getSelectedElement,
        saveButtonShadowModifications,
        showNotification
      );

      const {
        initHoverButtonShadowControls,
        initHoverButtonIconRotationControl,
        initHoverButtonIconSizeControl,
        initHoverButtonIconSpacingControl,
        initHoverButtonBorderRadiusControl,
        initHoverButtonBorderTypeToggle,
        initHoverButtonBorderControl,
        applyHoverButtonEffects,
      } = await import(
        "https://fatin-webefo.github.io/squareCraft-plugin/src/utils/initButtonStyles/initButtonHoverStyles.js"
      );

      initHoverButtonShadowControls(getSelectedElement);
      initHoverButtonIconRotationControl(getSelectedElement);
      initHoverButtonIconSizeControl(getSelectedElement);
      initHoverButtonIconSpacingControl(getSelectedElement);
      initHoverButtonBorderRadiusControl(getSelectedElement);
      initHoverButtonBorderTypeToggle(getSelectedElement);
      initHoverButtonBorderControl(getSelectedElement);
      applyHoverButtonEffects(getSelectedElement);

      document.getElementById("buttonBorderTypeSolid")?.click();
      document.getElementById("hover-buttonBorderTypeSolid")?.click();
    }, 300);

    if (resetIcon) {
      resetIcon.classList.remove("sc-rotate-once");
      void resetIcon.offsetWidth;
      resetIcon.classList.add("sc-rotate-once");
      setTimeout(() => {
        resetIcon.classList.remove("sc-rotate-once");
      }, 600);
    }
  });
}

export { publishPendingButtonModifications };

export function initButtonBorderResetHandlers(
  getSelectedElement,
  addPendingModification,
  showNotification,
  saveButtonModifications
) {
  function resetBorder(blockId, typeClass) {
    if (!blockId || !typeClass) {
      console.warn("❌ Missing required data for border reset:", {
        blockId,
        typeClass,
      });
      return;
    }

    try {
      // Remove border style tag
      const styleTag = document.getElementById(`sc-border-${typeClass}`);
      if (styleTag) styleTag.remove();

      // Reset border map
      borderMap.delete(blockId);

      // Save reset state
      mergeAndSaveButtonStyles(
        blockId,
        typeClass,
        { border: "none" },
        saveButtonModifications,
        addPendingModification,
        showNotification,
        "border"
      );

      if (typeof showNotification === "function") {
        showNotification("Border styles have been reset!", "success");
      }
    } catch (error) {
      console.error("❌ Error resetting border:", error);
      if (typeof showNotification === "function") {
        showNotification("Failed to reset border", "error");
      }
    }
  }

  const resetMap = {
    "border-reset": [
      "buttonBorderBullet",
      "buttonBorderFill",
      "buttonBorderCount",
      "sc-button-border-ICON",
      "__squareCraftBorderStateMap",
    ],
  };

  Object.entries(resetMap).forEach(([resetId, config]) => {
    const resetBtn = document.getElementById(resetId);
    if (!resetBtn) return;

    resetBtn.addEventListener("click", () => {
      const selected = getSelectedElement?.();
      if (!selected) return;

      const img = resetBtn.querySelector("img");
      if (img) {
        img.style.transition = "transform 0.4s ease";
        img.style.transform = "rotate(360deg)";
        setTimeout(() => {
          img.style.transform = "rotate(0deg)";
        }, 400);
      }

      const btn = selected.querySelector(
        "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary, " +
          "button.sqs-button-element--primary, button.sqs-button-element--secondary, button.sqs-button-element--tertiary"
      );
      if (!btn) return;

      const typeClass = [...btn.classList].find((c) =>
        c.startsWith("sqs-button-element--")
      );
      if (!typeClass) return;

      const blockId = selected.id || "block-id";
      const key = `${blockId}--${typeClass}`;
      const ids = [
        "buttonBorderAll",
        "buttonBorderTop",
        "buttonBorderBottom",
        "buttonBorderLeft",
        "buttonBorderRight",
      ];

      ids.forEach((id) => {
        const el = document.getElementById(id);
        if (el && el.classList.contains("sc-bg-454545")) {
          el.classList.remove("sc-bg-454545");
        }
      });

      if (resetId === "shadow-axis-reset") {
        const xConf = config[0];
        const yConf = config[1];
        const styleIdRaw = config[2];
        const stateMapName = config[3];

        [xConf, yConf].forEach((pair) => {
          const bulletId = pair[0];
          const countId = pair[1];
          const bullet = document.getElementById(bulletId);
          const count = document.getElementById(countId);
          if (bullet) bullet.style.left = "0px";
          if (count) count.textContent = "0px";
        });

        const styleId = styleIdRaw.replace("ICON", typeClass);
        document.getElementById(styleId)?.remove();
        if (window[stateMapName]) {
          window[stateMapName].delete?.(key);
        }
        return;
      }

      const [bulletId, fillId, countId, styleIdRaw, stateMapName] = config;

      const bullet = document.getElementById(bulletId);
      if (bullet) bullet.style.left = "0px";

      if (fillId) {
        const fill = document.getElementById(fillId);
        if (fill) fill.style.width = "0px";
      }

      const count = document.getElementById(countId);
      if (count) count.textContent = "0px";

      const styleId = styleIdRaw.replace("ICON", typeClass);
      document.getElementById(styleId)?.remove();

      if (stateMapName && window[stateMapName]) {
        window[stateMapName].delete?.(key);
      }
    });
  });
}

// Removed problematic setTimeout block that was trying to access undefined getSelectedElement

// Test function to debug icon saving
export function testIconSaving(getSelectedElement) {
  console.log("🧪 Testing icon saving...");

  const selectedElement = getSelectedElement?.();
  if (!selectedElement) {
    console.error("❌ No element selected");
    return;
  }

  const btn = selectedElement.querySelector(
    "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
  );
  if (!btn) {
    console.error("❌ No button found");
    return;
  }

  const typeClass = [...btn.classList].find((cls) =>
    cls.startsWith("sqs-button-element--")
  );
  if (!typeClass) {
    console.error("❌ No button type class found");
    return;
  }

  const blockId = selectedElement.id;
  if (!blockId) {
    console.error("❌ No block ID found");
    return;
  }

  // Check if icon exists
  const icon = btn.querySelector(".sqscraft-button-icon, .sqscraft-image-icon");
  if (!icon) {
    console.error("❌ No icon found in button");
    return;
  }

  console.log("🧪 Test data:", { blockId, typeClass, iconSrc: icon.src });

  // Test with multiple properties to ensure they're all preserved
  console.log("🧪 Testing with multiple properties...");

  // First, set rotation
  updateIconStyles(blockId, typeClass, {
    transform: "rotate(45deg)",
  }).then((result) => {
    console.log("🧪 Rotation test result:", result);

    // Then, set size
    setTimeout(() => {
      updateIconStyles(blockId, typeClass, {
        width: "30px",
        height: "auto",
      }).then((result2) => {
        console.log("🧪 Size test result:", result2);

        // Finally, set spacing
        setTimeout(() => {
          updateIconStyles(blockId, typeClass, {
            gap: "15px",
          }).then((result3) => {
            console.log("🧪 Spacing test result:", result3);
          });
        }, 1000);
      });
    }, 1000);
  });
}

// Test function to debug API directly
export async function testAPIDirectly() {
  console.log("🧪 Testing API directly...");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");
  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  console.log("🧪 Credentials:", { userId, token, widgetId, pageId });

  if (!userId || !token || !widgetId || !pageId) {
    console.error("❌ Missing credentials");
    return;
  }

  const testPayload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: "test-block-id",
    iconProperties: {
      selector: ".sqs-button-element--primary .sqscraft-button-icon",
      styles: {
        transform: "rotate(45deg)",
        width: "25px",
        height: "auto",
      },
    },
    buttonType: "primary",
    applyToAllTypes: false,
  };

  console.log("🧪 Test payload:", JSON.stringify(testPayload, null, 2));

  try {
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-button-icon-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(testPayload),
      }
    );

    console.log("🧪 Response status:", response.status);
    const result = await response.json();
    console.log("🧪 Response result:", result);

    if (!response.ok) {
      console.error("🧪 API test failed:", result);
    } else {
      console.log("🧪 API test successful:", result);
    }
  } catch (error) {
    console.error("🧪 API test error:", error);
  }
}

// Make the test functions available globally for debugging
window.testIconSaving = testIconSaving;
window.testAPIDirectly = testAPIDirectly;

// Add debug function for pending modifications
window.debugPendingModifications = function () {
  console.log("🔍 Current pending modifications:", window.pendingModifications);
  if (window.pendingModifications) {
    for (const [blockId, mods] of window.pendingModifications) {
      console.log(`Block ${blockId}:`, mods);
    }
  }
};
