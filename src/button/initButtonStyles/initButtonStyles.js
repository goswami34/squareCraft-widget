setTimeout(() => {
  let selectedElement = null;
  function getSelectedElement() {
    return selectedElement;
  }
  const section = document.getElementById("buttoniconPositionSection");
  if (section) {
    initButtonIconPositionToggle(getSelectedElement);
  } else {
    console.warn("⛔ buttoniconPositionSection not found");
  }
}, 200);

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

    // Add to pending modifications
    if (typeof addPendingModification === "function") {
      addPendingModification(blockId, merged, tagType);
    }

    // Show success notification
    if (typeof showNotification === "function") {
      showNotification("Button style updated!", "success");
    }

    // Log for debugging
    console.log("✅ Button styles merged:", {
      blockId,
      typeClass,
      newStyles,
      merged,
    });
  } catch (error) {
    console.error("❌ Error merging button styles:", error);
    if (typeof showNotification === "function") {
      showNotification("Failed to update button style", "error");
    }
  }
}

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
      div.style.fontFamily = `"${family}", sans-serif`;

      div.addEventListener("click", async () => {
        const selectedElement = getSelectedElement?.();
        if (!selectedElement) return;

        const label = document.getElementById("font-name");
        const fontFace = `"${family}", sans-serif`;

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

export function initButtonIconPositionToggle(
  getSelectedElement,
  addPendingModification,
  showNotification,
  saveButtonModifications
) {
  const iconPositionMap = new Map();

  function updateIconPosition(blockId, typeClass, position) {
    if (!blockId || !typeClass) {
      console.warn("❌ Missing required data for icon position:", {
        blockId,
        typeClass,
      });
      return;
    }

    try {
      const styleId = `sc-icon-position-${typeClass}`;
      let style = document.getElementById(styleId);
      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        document.head.appendChild(style);
      }

      const flexDirection = position === "left" ? "row" : "row-reverse";
      style.innerHTML = `
        .${typeClass} {
          flex-direction: ${flexDirection} !important;
        }
      `;

      mergeAndSaveButtonStyles(
        blockId,
        typeClass,
        { flexDirection },
        saveButtonModifications,
        addPendingModification,
        showNotification,
        "icon"
      );
    } catch (error) {
      console.error("❌ Error updating icon position:", error);
      if (typeof showNotification === "function") {
        showNotification("Failed to update icon position", "error");
      }
    }
  }

  document.getElementById("buttoniconPositionSection").onclick = () => {
    document
      .getElementById("iconPositionDropdown")
      .classList.toggle("sc-hidden");
  };

  document
    .querySelectorAll("#iconPositionDropdown [data-value]")
    .forEach((option) => {
      option.onclick = () => {
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
      };
    });
}

let normalRotationInitialized = false;

export function initButtonIconRotationControl(getSelectedElement) {
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
  function applyRotation() {
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
    applyRotation();
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
    applyRotation();
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

export function initButtonIconSizeControl(getSelectedElement) {
  const bullet = document.getElementById("buttonIconSizeradiusBullet");
  const fill = document.getElementById("buttonIconSizeradiusFill");
  const field = document.getElementById("buttonIconSizeradiusField");
  const label = document.getElementById("buttoniconSizeradiusCount");
  const incBtn = document.getElementById("buttoniconSizeIncrease");
  const decBtn = document.getElementById("buttoniconSizeDecrease");
  const maxSize = 50;
  let currentSize = 0;
  function applySize() {
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
      });
    });
  }
  function updateFromSizeValue(value) {
    currentSize = Math.max(0, Math.min(maxSize, value));
    const percent = (currentSize / maxSize) * 100;
    bullet.style.left = `${percent}%`;
    fill.style.width = `${percent}%`;
    label.textContent = `${currentSize}px`;
    applySize();
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

export function initButtonIconSpacingControl(getSelectedElement) {
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
  function applyGap() {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;
    const btnClass = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!btnClass) return;
    document.querySelectorAll(`a.${btnClass}`).forEach((el) => {
      const hasIcon = el.querySelector(
        ".sqscraft-button-icon, .sqscraft-image-icon"
      );
      if (hasIcon) {
        el.classList.add("sc-flex", "sc-items-center");
        el.style.gap = `${gapValue}px`;
      } else {
        el.classList.remove("sc-flex", "sc-items-center");
        el.style.gap = "";
      }
    });
  }
  function updateUI(val) {
    gapValue = Math.max(0, Math.min(maxGap, val));
    const percent = (gapValue / maxGap) * 100;
    fill.style.width = `${percent}%`;
    bullet.style.left = `${percent}%`;
    valueText.textContent = `${gapValue}px`;
    applyGap();
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
      if (!isNaN(computedGap)) updateUI(computedGap);
    }
  }, 50);
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

    // Create border styles object for local state
    const borderStyles = {
      boxSizing: "border-box",
      borderStyle: window.__squareCraftBorderStyle || "solid",
      borderColor: "black",
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
        border-style: ${window.__squareCraftBorderStyle || "solid"} !important;
        border-color: black !important;
        border-top-width: ${state.values.Top || 0}px !important;
        border-right-width: ${state.values.Right || 0}px !important;
        border-bottom-width: ${state.values.Bottom || 0}px !important;
        border-left-width: ${state.values.Left || 0}px !important;
        borderRadius: btn ? window.getComputedStyle(btn).borderRadius : "0px",
        overflow: btn ? window.getComputedStyle(btn).overflow : "hidden",
      }
    `;

    // Only update local state, do not save to DB
    if (blockId && blockId !== "block-id") {
      const stylePayload = {
        buttonPrimary: {
          selector: ".sqs-button-element--primary",
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

      // Only update local state, do not save to DB
      const stylePayload = {
        buttonPrimary: {
          selector: ".sqs-button-element--primary",
          styles: { borderStyle: borderType },
        },
      };
      addPendingModification(blockId, stylePayload, "button", "border");
      if (saveToDB && typeof saveButtonBorderModifications === "function") {
        saveButtonBorderModifications(blockId, stylePayload);
      }
      if (typeof showNotification === "function") {
        showNotification("Border style updated locally!", "info");
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

      updateBorderType(blockId, typeClass, type);
    };
  });
}

export function initButtonBorderRadiusControl(
  getSelectedElement,
  addPendingModification,
  showNotification,
  saveButtonBorderModifications
) {
  const borderRadiusMap = new Map();

  function getButtonTypeClass(btn) {
    if (btn.classList.contains("sqs-button-element--secondary"))
      return "sqs-button-element--secondary";
    if (btn.classList.contains("sqs-button-element--tertiary"))
      return "sqs-button-element--tertiary";
    return "sqs-button-element--primary";
  }

  function applyBorderRadius(saveToDB = false) {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
    );
    if (!btn) return;

    const typeClass = getButtonTypeClass(btn);
    const styleId = `sc-normal-radius-${typeClass.replace(/--/g, "-")}`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.textContent = `
.${typeClass} {
  border-radius: ${radiusValue}px !important;
  overflow: hidden !important;
}
.${typeClass} span,
.${typeClass} .sqs-add-to-cart-button-inner {
  border-radius: ${radiusValue}px !important;
}
.${typeClass}:hover {
  border-radius: ${radiusValue}px !important;
  overflow: hidden !important;
}
.${typeClass}:hover span,
.${typeClass}:hover .sqs-add-to-cart-button-inner {
  border-radius: ${radiusValue}px !important;
}
    `;

    // Only update local state, do not save to DB
    const blockId = selected.id;
    if (blockId && blockId !== "block-id") {
      const computed = window.getComputedStyle(btn);
      const currentStyles = {
        boxSizing: computed.boxSizing,
        borderStyle: computed.borderStyle,
        borderColor: computed.borderColor,
        borderTopWidth: computed.borderTopWidth,
        borderRightWidth: computed.borderRightWidth,
        borderBottomWidth: computed.borderBottomWidth,
        borderLeftWidth: computed.borderLeftWidth,
        borderRadius: `${radiusValue}px`,
        overflow: "hidden",
      };
      const stylePayload = {
        buttonPrimary: {
          selector: ".sqs-button-element--primary",
          styles: currentStyles,
        },
      };
      addPendingModification(blockId, stylePayload, "button", "border");
      if (saveToDB && typeof saveButtonBorderModifications === "function") {
        saveButtonBorderModifications(blockId, stylePayload);
      }
      if (typeof showNotification === "function") {
        showNotification("Border radius updated locally!", "info");
      }
    }
  }

  const fillField = document.getElementById("buttonBorderradiusField");
  const bullet = document.getElementById("buttonBorderradiusBullet");
  const fill = document.getElementById("buttonBorderradiusFill");
  const valueText = document.getElementById("buttonBorderradiusCount");
  const incBtn = document.getElementById("buttonBorderradiusIncrease");
  const decBtn = document.getElementById("buttonBorderradiusDecrease");
  const resetBtn = valueText
    ?.closest(".sc-flex")
    ?.querySelector('img[alt="reset"]');

  if (!fillField || !bullet || !fill || !valueText) return;

  const max = 50;
  let radiusValue = 0;

  function updateUIFromValue(value) {
    radiusValue = Math.max(0, Math.min(max, value));
    const percent = (radiusValue / max) * 100;

    bullet.style.left = `${percent}%`;
    fill.style.width = `${percent}%`;
    valueText.textContent = `${radiusValue}px`;

    applyBorderRadius();
  }

  bullet.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const move = (eMove) => {
      const rect = fillField.getBoundingClientRect();
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

  fillField.addEventListener("click", (e) => {
    const rect = fillField.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const value = Math.round((x / rect.width) * max);
    updateUIFromValue(value);
  });

  incBtn?.addEventListener("click", () => updateUIFromValue(radiusValue + 1));
  decBtn?.addEventListener("click", () => updateUIFromValue(radiusValue - 1));
  resetBtn?.addEventListener("click", () => updateUIFromValue(0));

  setTimeout(() => {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
    );
    if (!btn) return;

    const computed = parseInt(window.getComputedStyle(btn).borderRadius || "0");
    if (!isNaN(computed)) updateUIFromValue(computed);
  }, 50);
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
    const value = `${shadowState.Xaxis}px ${shadowState.Yaxis}px ${shadowState.Blur}px ${shadowState.Spread}px rgba(0,0,0,0.3)`;

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
        styles: { boxShadow: value },
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
}

window.syncButtonStylesFromElement = function (selectedElement) {
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
    document.getElementById(
      "buttoniconRotationradiusCount"
    ).textContent = `${rotation}deg`;
    document.getElementById(
      "buttonIconRotationradiusBullet"
    ).style.left = `${percent}%`;
    document.getElementById(
      "buttonIconRotationradiusFill"
    ).style.left = `${Math.min(percent, 50)}%`;
    document.getElementById(
      "buttonIconRotationradiusFill"
    ).style.width = `${Math.abs(percent - 50)}%`;
  }

  const spacing = {
    top: parseInt(icon?.style.marginTop || "0"),
    bottom: parseInt(icon?.style.marginBottom || "0"),
    left: parseInt(icon?.style.marginLeft || "0"),
    right: parseInt(icon?.style.marginRight || "0"),
  };
  const spacingValue = Math.max(...Object.values(spacing));
  const spacingPercent = getPercent(spacingValue, 30);
  document.getElementById(
    "buttoniconSpacingradiusCount"
  ).textContent = `${spacingValue}px`;
  document.getElementById("buttonIconSpacingradiusFill").style.width =
    spacingPercent;
  document.getElementById("buttonIconSpacingradiusBullet").style.left =
    spacingPercent;
  ["Top", "Bottom", "Left", "Right"].forEach((dir) => {
    const el = document.getElementById(`buttonIconSpacing${dir}`);
    if (el) el.classList.toggle("sc-bg-454545", spacing[dir.toLowerCase()] > 0);
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
        saveButtonModifications
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

setTimeout(() => {
  if (typeof window.syncButtonStylesFromElement === "function") {
    window.syncButtonStylesFromElement(getSelectedElement);
  }

  if (typeof initButtonBorderRadiusControl === "function") {
    initButtonBorderRadiusControl(
      getSelectedElement,
      addPendingModification,
      showNotification,
      saveButtonModifications
    );
  }

  if (typeof initButtonBorderTypeToggle === "function") {
    initButtonBorderTypeToggle(
      getSelectedElement,
      addPendingModification,
      showNotification,
      saveButtonModifications
    );
  }

  document.getElementById("buttonBorderTypeSolid")?.click();
}, 100);

import { initButtonFontColorPaletteToggle } from "./initButtonFontColorPaletteToggle/initButtonFontColorPaletteToggle";

// At the end of your main initialization or after rendering the HTML:

// Example themeColors object (replace with your actual theme colors)
const themeColors = {
  color1: "#EF7C2F",
  color2: "#363544",
  color3: "#FF0000",
  // ...add more as needed
};

// Ensure this runs after the HTML is rendered
setTimeout(() => {
  initButtonFontColorPaletteToggle(themeColors, getSelectedElement);
}, 0);
