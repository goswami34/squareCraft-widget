const hoverShadowState = {
  X: 0,
  Y: 0,
  Blur: 0,
  Spread: 0,
};

// .sqs-button-element--primary:hover {
//   border-style: solid !important;
//   border-color: black !important;
//   border-radius: 0px !important;
//   border-top-width: 5px !important;
//   border-right-width: 5px !important;
//   border-bottom-width: 5px !important;
//   border-left-width: 5px !important;
// }

export function initHoverButtonShadowControls(
  getSelectedElement,
  saveButtonModifications,
  addPendingModification,
  showNotification
) {
  async function saveToDatabase() {
    const el = getSelectedElement?.();
    if (!el) return;

    const btn = el.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const cls = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!cls) return;

    const blockId = el.id;
    if (!blockId || blockId === "block-id") return;

    const v = hoverShadowState;
    const shadow = `${v.X}px ${v.Y}px ${v.Blur}px ${v.Spread}px rgba(0,0,0,0.3)`;

    const cssPayload = {
      buttonPrimary: {
        selector: `.${cls}`,
        styles: {
          boxShadow: shadow,
        },
      },
    };

    // Add to pending modifications
    if (typeof addPendingModification === "function") {
      addPendingModification(blockId, cssPayload, "buttonShadow");
    }

    // Save to database
    if (typeof saveButtonModifications === "function") {
      try {
        const result = await saveButtonModifications(blockId, cssPayload);
        if (result.success && typeof showNotification === "function") {
          showNotification("Hover shadow saved!", "success");
        }
      } catch (error) {
        console.error("❌ Error saving hover shadow:", error);
        if (typeof showNotification === "function") {
          showNotification("Failed to save hover shadow", "error");
        }
      }
    }
  }

  function applyHoverShadow() {
    const el = getSelectedElement?.();
    if (!el) return;

    const btn = el.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const cls = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!cls) return;

    const styleId = `sc-hover-shadow-${cls.replace(/--/g, "-")}`;
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    const v = hoverShadowState;
    const shadow = `${v.X}px ${v.Y}px ${v.Blur}px ${v.Spread}px rgba(0,0,0,0.3)`;

    style.innerHTML = `
.${cls}:hover {
  box-shadow: ${shadow} !important;
}
`;

    // Save to database after a short delay to avoid too many requests
    clearTimeout(window.hoverShadowSaveTimeout);
    window.hoverShadowSaveTimeout = setTimeout(() => {
      saveToDatabase();
    }, 500);
  }

  function setup(typeKey, domKey, range = 50) {
    const bullet = document.getElementById(`hover-buttonShadow${domKey}Bullet`);
    const field = document.getElementById(`hover-buttonShadow${domKey}Field`);
    const label = document.getElementById(`hover-buttonShadow${domKey}Count`);
    const inc = document.getElementById(`hover-ButtonShadow${domKey}Increase`);
    const dec = document.getElementById(`hover-ButtonShadow${domKey}Decrease`);

    if (!bullet || !field || !label) return;

    const min = typeKey === "X" || typeKey === "Y" ? -range : 0;
    const max = range;
    let value = hoverShadowState[typeKey] ?? 0;

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
      field.insertBefore(fill, bullet);
    }

    function update(val) {
      value = Math.max(min, Math.min(max, val));
      hoverShadowState[typeKey] = value;

      const percent = ((value - min) / (max - min)) * 100;
      const centerPercent = ((0 - min) / (max - min)) * 100;

      bullet.style.left = `${percent}%`;
      fill.style.left = `${Math.min(percent, centerPercent)}%`;
      fill.style.width = `${Math.abs(percent - centerPercent)}%`;

      label.textContent = `${value}px`;
      applyHoverShadow();
    }

    inc?.addEventListener("click", () => update(value + 1));
    dec?.addEventListener("click", () => update(value - 1));

    bullet.addEventListener("mousedown", (e) => {
      e.preventDefault();
      const rect = field.getBoundingClientRect();
      const move = (eMove) => {
        const x = Math.min(Math.max(eMove.clientX - rect.left, 0), rect.width);
        const val = Math.round(min + (x / rect.width) * (max - min));
        update(val);
      };
      const up = () => {
        document.removeEventListener("mousemove", move);
        document.removeEventListener("mouseup", up);
        // Save when user stops dragging
        saveToDatabase();
      };
      document.addEventListener("mousemove", move);
      document.addEventListener("mouseup", up);
    });

    field.addEventListener("click", (e) => {
      const rect = field.getBoundingClientRect();
      const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
      const val = Math.round(min + (x / rect.width) * (max - min));
      update(val);
    });

    update(value);
  }

  setup("X", "Xaxis", 30);
  setup("Y", "Yaxis", 30);
  setup("Blur", "Blur", 50);
  setup("Spread", "Spread", 30);

  // Fetch existing hover shadow data
  // fetchButtonHoverBorderModifications(); // This line is removed
}

let hoverRotationInitialized = false;

export function initHoverButtonIconRotationControl(
  getSelectedElement,
  saveButtonIconModifications,
  addPendingModification,
  showNotification
) {
  if (hoverRotationInitialized) return;
  hoverRotationInitialized = true;

  const bullet = document.getElementById(
    "hover-buttonIconRotationradiusBullet"
  );
  const fill = document.getElementById("hover-buttonIconRotationradiusFill");
  const field = document.getElementById("hover-buttonIconRotationradiusField");
  const label = document.getElementById("hover-buttoniconRotationradiusCount");
  const incBtn = document.getElementById("hover-iconRotationIncrease");
  const decBtn = document.getElementById("hover-iconRotationDecrease");

  if (!bullet || !fill || !field || !label) return;

  let value = 0;
  const min = -180;
  const max = 180;
  let hasInteracted = false;

  function applyStyle() {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const cls = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!cls) return;

    const id = `sc-hover-style-transform-${cls.replace(/--/g, "-")}`;
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      document.head.appendChild(style);
    }

    style.innerHTML = `a.${cls}:hover .sqscraft-button-icon { transform: rotate(${value}deg) !important; }`;
  }

  async function saveToDatabase() {
    const selected = getSelectedElement?.();
    if (!selected) return;

    const btn = selected.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const cls = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!cls) return;

    const blockId = selected.id;
    if (!blockId || blockId === "block-id") return;

    const cssPayload = {
      iconProperties: {
        selector: `.${cls}`,
        styles: {
          transform: `rotate(${value}deg)`,
        },
      },
    };

    // Add to pending modifications
    if (typeof addPendingModification === "function") {
      addPendingModification(blockId, cssPayload, "buttonIcon");
    }

    // Save to database
    if (typeof saveButtonIconModifications === "function") {
      try {
        const result = await saveButtonIconModifications(blockId, cssPayload);
        if (result.success && typeof showNotification === "function") {
          showNotification("Hover icon rotation saved!", "success");
        }
      } catch (error) {
        console.error("❌ Error saving hover icon rotation:", error);
        if (typeof showNotification === "function") {
          showNotification("Failed to save hover icon rotation", "error");
        }
      }
    }
  }

  function updateUI() {
    const percent = ((value - min) / (max - min)) * 100;
    bullet.style.left = `${percent}%`;
    fill.style.left = hasInteracted ? `${Math.min(percent, 50)}%` : `50%`;
    fill.style.width = `${Math.abs(percent - 50)}%`;
    label.textContent = `${value}deg`;
    applyStyle();

    // Save to database after a short delay to avoid too many requests
    clearTimeout(window.hoverRotationSaveTimeout);
    window.hoverRotationSaveTimeout = setTimeout(() => {
      saveToDatabase();
    }, 500);
  }

  function setValue(newVal, reason = "") {
    const oldValue = value;
    value = Math.max(min, Math.min(max, newVal));
    updateUI();

    if (value === oldValue && reason !== "initial sync") {
      console.warn(
        `⚠️ Hover rotation didn't change from ${oldValue} ➝ ${newVal}`
      );
    }
  }

  bullet.addEventListener("mousedown", (e) => {
    e.preventDefault();
    hasInteracted = true;
    const rect = field.getBoundingClientRect();
    const move = (eMove) => {
      const x = Math.min(Math.max(eMove.clientX - rect.left, 0), rect.width);
      const mapped = min + (x / rect.width) * (max - min);
      setValue(Math.round(mapped), "drag");
    };
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      // Save when user stops dragging
      saveToDatabase();
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  field.addEventListener("click", (e) => {
    hasInteracted = true;
    const rect = field.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    const mapped = min + (x / rect.width) * (max - min);
    setValue(Math.round(mapped), "click");
  });

  incBtn?.addEventListener("click", () => {
    hasInteracted = true;
    setValue(value + 1, "increase");
  });

  decBtn?.addEventListener("click", () => {
    hasInteracted = true;
    setValue(value - 1, "decrease");
  });

  setTimeout(() => {
    const selected = getSelectedElement?.();
    const icon = selected?.querySelector(
      ".sqscraft-button-icon, .sqscraft-image-icon"
    );
    if (icon) {
      const match = icon.style.transform?.match(
        /rotate\((-?\d+(?:\.\d+)?)deg\)/
      );
      if (match) {
        const rotation = parseFloat(match[1]);
        if (!isNaN(rotation)) {
          setValue(rotation, "initial sync");
          return;
        }
      }
    }
    setValue(0, "initial sync");
  }, 50);

  // Fetch existing hover icon rotation data
  // fetchButtonHoverBorderModifications(); // This line is removed
}

let hoverSizeInitialized = false;

export function initHoverButtonIconSizeControl(
  getSelectedElement,
  saveButtonIconModifications,
  addPendingModification,
  showNotification
) {
  if (hoverSizeInitialized) return;
  hoverSizeInitialized = true;

  const bullet = document.getElementById("hover-buttonIconSizeradiusBullet");
  const fill = document.getElementById("hover-buttonIconSizeradiusFill");
  const field = document.getElementById("hover-buttonIconSizeradiusField");
  const label = document.getElementById("hover-buttoniconSizeradiusCount");
  const incBtn = document.getElementById("hover-iconSizeIncrease");
  const decBtn = document.getElementById("hover-iconSizeDecrease");

  if (!bullet || !fill || !field || !label) return;

  let value = 0;
  const max = 50;

  function applyStyle() {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const cls = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!cls) return;

    const id = `sc-hover-style-size-${cls.replace(/--/g, "-")}`;
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      document.head.appendChild(style);
    }

    style.innerHTML = `a.${cls}:hover .sqscraft-button-icon { width: ${value}px !important; height: auto !important; }`;
  }

  async function saveToDatabase() {
    const selected = getSelectedElement?.();
    if (!selected) return;

    const btn = selected.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const cls = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!cls) return;

    const blockId = selected.id;
    if (!blockId || blockId === "block-id") return;

    const cssPayload = {
      iconProperties: {
        selector: `.${cls}`,
        styles: {
          width: `${value}px`,
          height: "auto",
        },
      },
    };

    // Add to pending modifications
    if (typeof addPendingModification === "function") {
      addPendingModification(blockId, cssPayload, "buttonIcon");
    }

    // Save to database
    if (typeof saveButtonIconModifications === "function") {
      try {
        const result = await saveButtonIconModifications(blockId, cssPayload);
        if (result.success && typeof showNotification === "function") {
          showNotification("Hover icon size saved!", "success");
        }
      } catch (error) {
        console.error("❌ Error saving hover icon size:", error);
        if (typeof showNotification === "function") {
          showNotification("Failed to save hover icon size", "error");
        }
      }
    }
  }

  function updateUI() {
    const percent = (value / max) * 100;
    bullet.style.left = `${percent}%`;
    fill.style.width = `${percent}%`;
    label.textContent = `${value}px`;
    applyStyle();

    // Save to database after a short delay to avoid too many requests
    clearTimeout(window.hoverSizeSaveTimeout);
    window.hoverSizeSaveTimeout = setTimeout(() => {
      saveToDatabase();
    }, 500);
  }

  function setValue(newVal, reason = "") {
    const oldValue = value;
    value = Math.max(0, Math.min(max, newVal));
    updateUI();

    if (value === oldValue && reason !== "initial sync") {
      console.warn(`⚠️ Hover size didn't change from ${oldValue} ➝ ${newVal}`);
    }
  }

  bullet.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const rect = field.getBoundingClientRect();
    const move = (eMove) => {
      const x = Math.min(Math.max(eMove.clientX - rect.left, 0), rect.width);
      setValue(Math.round((x / rect.width) * max), "drag");
    };
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      // Save when user stops dragging
      saveToDatabase();
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  field.addEventListener("click", (e) => {
    const rect = field.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    setValue(Math.round((x / rect.width) * max), "click");
  });

  incBtn?.addEventListener("click", () => setValue(value + 1, "increase"));
  decBtn?.addEventListener("click", () => setValue(value - 1, "decrease"));

  setTimeout(() => {
    const selected = getSelectedElement?.();
    const icon = selected?.querySelector(
      ".sqscraft-button-icon, .sqscraft-image-icon"
    );
    if (icon) {
      const width = icon.style.width;
      if (width) {
        const size = parseInt(width);
        if (!isNaN(size)) {
          setValue(size, "initial sync");
          return;
        }
      }
    }
    setValue(0, "initial sync");
  }, 50);

  // Fetch existing hover icon size data
  // fetchButtonHoverBorderModifications(); // This line is removed
}

let hoverSpacingInitialized = false;

export function initHoverButtonIconSpacingControl(
  getSelectedElement,
  saveButtonIconModifications,
  addPendingModification,
  showNotification
) {
  if (hoverSpacingInitialized) return;
  hoverSpacingInitialized = true;

  const bullet = document.getElementById("hover-buttonIconSpacingradiusBullet");
  const fill = document.getElementById("hover-buttonIconSpacingradiusFill");
  const field = document.getElementById("hover-buttonIconSpacingradiusField");
  const label = document.getElementById("hover-buttoniconSpacingradiusCount");
  const incBtn = document.getElementById("hover-iconSpacingIncrease");
  const decBtn = document.getElementById("hover-iconSpacingDecrease");

  if (!bullet || !fill || !field || !label) return;

  let value = 0;
  const max = 50;

  function applyStyle() {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const cls = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!cls) return;

    const id = `sc-hover-style-spacing-${cls.replace(/--/g, "-")}`;
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      document.head.appendChild(style);
    }

    style.innerHTML = `a.${cls}:hover { gap: ${value}px !important; }`;
  }

  async function saveToDatabase() {
    const selected = getSelectedElement?.();
    if (!selected) return;

    const btn = selected.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const cls = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!cls) return;

    const blockId = selected.id;
    if (!blockId || blockId === "block-id") return;

    const cssPayload = {
      iconProperties: {
        selector: `.${cls}`,
        styles: {
          gap: `${value}px`,
        },
      },
    };

    // Add to pending modifications
    if (typeof addPendingModification === "function") {
      addPendingModification(blockId, cssPayload, "buttonIcon");
    }

    // Save to database
    if (typeof saveButtonIconModifications === "function") {
      try {
        const result = await saveButtonIconModifications(blockId, cssPayload);
        if (result.success && typeof showNotification === "function") {
          showNotification("Hover icon spacing saved!", "success");
        }
      } catch (error) {
        console.error("❌ Error saving hover icon spacing:", error);
        if (typeof showNotification === "function") {
          showNotification("Failed to save hover icon spacing", "error");
        }
      }
    }
  }

  function updateUI() {
    const percent = (value / max) * 100;
    bullet.style.left = `${percent}%`;
    fill.style.width = `${percent}%`;
    label.textContent = `${value}px`;
    applyStyle();

    // Save to database after a short delay to avoid too many requests
    clearTimeout(window.hoverSpacingSaveTimeout);
    window.hoverSpacingSaveTimeout = setTimeout(() => {
      saveToDatabase();
    }, 500);
  }

  function setValue(newVal, reason = "") {
    const oldValue = value;
    value = Math.max(0, Math.min(max, newVal));
    updateUI();

    if (value === oldValue && reason !== "initial sync") {
      console.warn(
        `⚠️ Hover spacing didn't change from ${oldValue} ➝ ${newVal}`
      );
    }
  }

  bullet.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const rect = field.getBoundingClientRect();
    const move = (eMove) => {
      const x = Math.min(Math.max(eMove.clientX - rect.left, 0), rect.width);
      setValue(Math.round((x / rect.width) * max), "drag");
    };
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      // Save when user stops dragging
      saveToDatabase();
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  field.addEventListener("click", (e) => {
    const rect = field.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    setValue(Math.round((x / rect.width) * max), "click");
  });

  incBtn?.addEventListener("click", () => setValue(value + 1, "increase"));
  decBtn?.addEventListener("click", () => setValue(value - 1, "decrease"));

  setTimeout(() => {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (btn) {
      const gap = window.getComputedStyle(btn).gap;
      if (gap && gap !== "normal") {
        const spacing = parseInt(gap);
        if (!isNaN(spacing)) {
          setValue(spacing, "initial sync");
        }
      }
    }
    setValue(0, "initial sync");
  }, 50);

  // Fetch existing hover icon spacing data
  // fetchButtonHoverBorderModifications(); // This line is removed
}

let hoverRadiusInitialized = false;

export function initHoverButtonBorderRadiusControl(
  getSelectedElement,
  saveButtonHoverBorderModifications,
  addPendingModification,
  showNotification
) {
  if (hoverRadiusInitialized) return;
  hoverRadiusInitialized = true;

  const fillField = document.getElementById("hover-buttonBorderradiusField");
  const bullet = document.getElementById("hover-buttonBorderradiusBullet");
  const fill = document.getElementById("hover-buttonBorderradiusFill");
  const valueText = document.getElementById("hover-buttonBorderradiusCount");
  const incBtn = document.getElementById("hover-buttonBorderradiusIncrease");
  const decBtn = document.getElementById("hover-buttonBorderradiusDecrease");
  const resetBtn =
    fillField?.previousElementSibling?.querySelector("img[alt='reset']");

  if (!fillField || !bullet || !fill || !valueText) return;

  let value = 0;

  function apply() {
    const el = getSelectedElement?.();
    if (!el) return;

    const btn = el.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const cls = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!cls) return;

    const id = `sc-hover-radius-${cls.replace(/--/g, "-")}`;
    let style = document.getElementById(id);
    if (!style) {
      style = document.createElement("style");
      style.id = id;
      document.head.appendChild(style);
      console.log(`🎨 Created new style tag: ${id}`);
    } else {
      console.log(`🎨 Updated existing style tag: ${id}`);
    }

    const cssContent = `
.${cls}:hover {
  border-radius: ${value}px !important;
  overflow: hidden !important;
}
`;
    style.innerHTML = cssContent;
    console.log(`🎨 Applied radius styles: ${value}px to ${cls}`);
  }

  async function saveToDatabase() {
    const el = getSelectedElement?.();
    if (!el) return;

    const btn = el.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const cls = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!cls) return;

    const blockId = el.id;
    if (!blockId || blockId === "block-id") return;

    // Get all current border properties from global state
    const currentBorderWidth =
      window.__squareCraftHoverBorderStateMap?.get(`${blockId}--${cls}`)
        ?.value || 0;
    const currentBorderStyle = window.__squareCraftBorderStyle || "solid";
    const currentBorderColor = window.__squareCraftHoverBorderColor || "black";
    const currentBorderRadius = value; // Current radius value

    // Create complete styles object with all border properties
    const completeStyles = {
      borderRadius: `${currentBorderRadius}px`,
      overflow: "hidden",
      borderTopWidth: `${currentBorderWidth}px`,
      borderRightWidth: `${currentBorderWidth}px`,
      borderBottomWidth: `${currentBorderWidth}px`,
      borderLeftWidth: `${currentBorderWidth}px`,
      borderStyle: currentBorderStyle,
      borderColor: currentBorderColor,
    };

    console.log("📤 Complete hover border styles:", completeStyles);

    // Determine the correct button type key based on the class
    let buttonTypeKey = "buttonPrimary"; // Default
    if (cls.includes("--secondary")) {
      buttonTypeKey = "buttonSecondary";
    } else if (cls.includes("--tertiary")) {
      buttonTypeKey = "buttonTertiary";
    }

    const cssPayload = {
      [buttonTypeKey]: {
        selector: `.${cls}`,
        styles: completeStyles,
      },
    };

    console.log("📤 Saving complete hover border payload:", cssPayload);

    if (typeof saveButtonHoverBorderModifications === "function") {
      try {
        const result = await saveButtonHoverBorderModifications(
          blockId,
          cssPayload
        );
        if (result.success && typeof showNotification === "function") {
          showNotification("Hover border radius saved!", "success");
        }
      } catch (error) {
        console.error("❌ Error saving hover border radius:", error);
        if (typeof showNotification === "function") {
          showNotification("Failed to save hover border radius", "error");
        }
      }
    }
  }

  function update(val) {
    value = Math.max(0, Math.min(50, val));
    const percent = (value / 50) * 100;
    bullet.style.left = `${percent}%`;
    fill.style.width = `${percent}%`;
    valueText.textContent = `${value}px`;

    console.log(`🔄 Radius update: ${value}px (${percent}%)`);

    // Update global state
    window.__squareCraftHoverRadius = value;

    apply();

    // Save to database after a short delay to avoid too many requests
    clearTimeout(window.hoverRadiusSaveTimeout);
    window.hoverRadiusSaveTimeout = setTimeout(() => {
      console.log(`💾 Saving radius to database: ${value}px`);
      saveToDatabase();
    }, 500);
  }

  bullet.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const rect = fillField.getBoundingClientRect();
    const move = (eMove) => {
      const x = Math.min(Math.max(eMove.clientX - rect.left, 0), rect.width);
      update(Math.round((x / rect.width) * 50));
    };
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      // Save when user stops dragging
      saveToDatabase();
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  fillField.addEventListener("click", (e) => {
    const rect = fillField.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    update(Math.round((x / rect.width) * 50));
  });

  incBtn?.addEventListener("click", () => update(value + 1));
  decBtn?.addEventListener("click", () => update(value - 1));
  resetBtn?.addEventListener("click", () => update(0));

  // update(0); // Initialize with default value
  update(window.__squareCraftHoverRadius || 0);

  // Fetch existing hover border radius data
  // fetchButtonHoverBorderModifications(); // This line is removed
}

export function initHoverButtonBorderTypeToggle(
  getSelectedElement,
  saveButtonHoverBorderModifications,
  addPendingModification,
  showNotification
) {
  const typeButtons = [
    { id: "hover-buttonBorderTypeSolid", type: "solid" },
    { id: "hover-buttonBorderTypeDashed", type: "dashed" },
    { id: "hover-buttonBorderTypeDotted", type: "dotted" },
  ];

  async function saveToDatabase(borderType) {
    const selected = getSelectedElement?.();
    if (!selected) return;

    const btn = selected.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!btn) return;

    const cls = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    if (!cls) return;

    const blockId = selected.id;
    if (!blockId || blockId === "block-id") return;

    // Get all current border properties from global state
    const currentBorderWidth =
      window.__squareCraftHoverBorderStateMap?.get(`${blockId}--${cls}`)
        ?.value || 0;
    const currentBorderColor = window.__squareCraftHoverBorderColor || "black";
    const currentBorderRadius = window.__squareCraftHoverRadius || 0;

    // Create complete styles object with all border properties
    const completeStyles = {
      borderRadius: `${currentBorderRadius}px`,
      overflow: "hidden",
      borderTopWidth: `${currentBorderWidth}px`,
      borderRightWidth: `${currentBorderWidth}px`,
      borderBottomWidth: `${currentBorderWidth}px`,
      borderLeftWidth: `${currentBorderWidth}px`,
      borderStyle: borderType,
      borderColor: currentBorderColor,
    };

    console.log("📤 Complete hover border styles:", completeStyles);

    // Determine the correct button type key based on the class
    let buttonTypeKey = "buttonPrimary"; // Default
    if (cls.includes("--secondary")) {
      buttonTypeKey = "buttonSecondary";
    } else if (cls.includes("--tertiary")) {
      buttonTypeKey = "buttonTertiary";
    }

    const cssPayload = {
      [buttonTypeKey]: {
        selector: `.${cls}`,
        styles: completeStyles,
      },
    };

    console.log("📤 Saving complete hover border payload:", cssPayload);

    if (typeof saveButtonHoverBorderModifications === "function") {
      try {
        const result = await saveButtonHoverBorderModifications(
          blockId,
          cssPayload
        );
        if (result.success && typeof showNotification === "function") {
          showNotification("Hover border style saved!", "success");
        }
      } catch (error) {
        console.error("❌ Error saving hover border style:", error);
        if (typeof showNotification === "function") {
          showNotification("Failed to save hover border style", "error");
        }
      }
    }
  }

  typeButtons.forEach(({ id, type }) => {
    const el = document.getElementById(id);
    if (!el) return;

    el.onclick = () => {
      typeButtons.forEach(({ id }) => {
        document.getElementById(id)?.classList.remove("sc-bg-454545");
      });
      el.classList.add("sc-bg-454545");

      const selected = getSelectedElement?.();
      if (!selected) return;

      const btn = selected.querySelector(
        "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
      );
      if (!btn) return;

      const cls = [...btn.classList].find((c) =>
        c.startsWith("sqs-button-element--")
      );
      if (!cls) return;

      const styleId = `sc-hover-border-style-${cls.replace(/--/g, "-")}`;
      let style = document.getElementById(styleId);
      if (!style) {
        style = document.createElement("style");
        style.id = styleId;
        document.head.appendChild(style);
      }

      style.innerHTML = `
.${cls}:hover {
  border-style: ${type} !important;
}
`;

      // Save to database
      saveToDatabase(type);
    };
  });

  // Fetch existing hover border type data
  // fetchButtonHoverBorderModifications(); // This line is removed
}

let hoverBorderInitialized = false;

export function initHoverButtonBorderControl(
  getSelectedElement,
  saveButtonHoverBorderModifications,
  addPendingModification,
  showNotification
) {
  if (hoverBorderInitialized) return;
  hoverBorderInitialized = true;

  const fill = document.getElementById("hover-buttonBorderFill");
  const bullet = document.getElementById("hover-buttonBorderBullet");
  const field = document.getElementById("hover-buttonBorderField");
  const valueText = document.getElementById("hover-buttonBorderCount");
  const incBtn = document.getElementById("hover-BorderIncrease");
  const decBtn = document.getElementById("hover-BorderDecrease");
  const resetBtn = valueText
    ?.closest(".sc-flex")
    ?.querySelector("img[alt='reset']");

  if (!fill || !bullet || !field || !valueText) return;
  if (!window.__squareCraftHoverBorderStateMap)
    window.__squareCraftHoverBorderStateMap = new Map();

  const sides = ["Top", "Right", "Bottom", "Left"];
  let currentSide = "All";
  let value = 0;

  function getTypeClassAndBlock() {
    const selected = getSelectedElement?.();
    const btn = selected?.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    );
    if (!selected || !btn) return {};
    const typeClass = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
    return { selected, blockId: selected.id || "block-id", typeClass };
  }

  function applyStyle() {
    const { blockId, typeClass } = getTypeClassAndBlock();
    if (!typeClass) return;

    const key = `${blockId}--${typeClass}`;
    const state = window.__squareCraftHoverBorderStateMap.get(key) || {
      value: 0,
      side: "All",
    };
    const val = `${state.value}px`;
    const t = state.side === "Top" || state.side === "All" ? val : "0px";
    const r = state.side === "Right" || state.side === "All" ? val : "0px";
    const b = state.side === "Bottom" || state.side === "All" ? val : "0px";
    const l = state.side === "Left" || state.side === "All" ? val : "0px";

    const styleId = `sc-hover-border-${typeClass.replace(/--/g, "-")}`;
    let style = document.getElementById(styleId);
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.innerHTML = `
.${typeClass}:hover {
  border-style: ${window.__squareCraftBorderStyle || "solid"} !important;
  border-color: ${window.__squareCraftHoverBorderColor || "black"} !important;
  border-radius: ${window.__squareCraftHoverRadius || 0}px !important;
  border-top-width: ${t} !important;
  border-right-width: ${r} !important;
  border-bottom-width: ${b} !important;
  border-left-width: ${l} !important;
}
`;
  }

  async function saveToDatabase() {
    const { blockId, typeClass } = getTypeClassAndBlock();
    if (!typeClass || !blockId || blockId === "block-id") return;

    const key = `${blockId}--${typeClass}`;
    const state = window.__squareCraftHoverBorderStateMap.get(key) || {
      value: 0,
      side: "All",
    };

    const val = `${state.value}px`;
    const t = state.side === "Top" || state.side === "All" ? val : "0px";
    const r = state.side === "Right" || state.side === "All" ? val : "0px";
    const b = state.side === "Bottom" || state.side === "All" ? val : "0px";
    const l = state.side === "Left" || state.side === "All" ? val : "0px";

    // Create complete styles object with all border properties
    const completeStyles = {
      borderRadius: `${window.__squareCraftHoverRadius || 0}px`,
      overflow: "hidden",
      borderTopWidth: t,
      borderRightWidth: r,
      borderBottomWidth: b,
      borderLeftWidth: l,
      borderStyle: window.__squareCraftBorderStyle || "solid",
      borderColor: window.__squareCraftHoverBorderColor || "black",
    };

    console.log("📤 Complete hover border styles:", completeStyles);

    // Determine the correct button type key based on the typeClass
    let buttonTypeKey = "buttonPrimary"; // Default
    if (typeClass.includes("--secondary")) {
      buttonTypeKey = "buttonSecondary";
    } else if (typeClass.includes("--tertiary")) {
      buttonTypeKey = "buttonTertiary";
    }

    const cssPayload = {
      [buttonTypeKey]: {
        selector: `.${typeClass}`,
        styles: completeStyles,
      },
    };

    console.log("📤 Saving complete hover border payload:", cssPayload);

    if (typeof saveButtonHoverBorderModifications === "function") {
      try {
        const result = await saveButtonHoverBorderModifications(
          blockId,
          cssPayload
        );
        if (result.success && typeof showNotification === "function") {
          showNotification("Hover border saved!", "success");
        }
      } catch (error) {
        console.error("❌ Error saving hover border:", error);
        if (typeof showNotification === "function") {
          showNotification("Failed to save hover border", "error");
        }
      }
    }
  }

  function update(val) {
    value = Math.max(0, Math.min(10, val));
    const percent = (value / 10) * 100;
    bullet.style.left = `${percent}%`;
    fill.style.width = `${percent}%`;
    valueText.textContent = `${value}px`;

    const { blockId, typeClass } = getTypeClassAndBlock();
    if (!typeClass) return;

    const key = `${blockId}--${typeClass}`;
    let state = window.__squareCraftHoverBorderStateMap.get(key) || {
      value: 0,
      side: "All",
    };
    state.value = value;
    window.__squareCraftHoverBorderStateMap.set(key, state);
    applyStyle();

    // Save to database after a short delay to avoid too many requests
    clearTimeout(window.hoverBorderSaveTimeout);
    window.hoverBorderSaveTimeout = setTimeout(() => {
      saveToDatabase();
    }, 500);
  }

  bullet.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const rect = field.getBoundingClientRect();
    const move = (eMove) => {
      const x = Math.min(Math.max(eMove.clientX - rect.left, 0), rect.width);
      update(Math.round((x / rect.width) * 10));
    };
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
      // Save when user stops dragging
      saveToDatabase();
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  field.addEventListener("click", (e) => {
    const rect = field.getBoundingClientRect();
    const x = Math.min(Math.max(e.clientX - rect.left, 0), rect.width);
    update(Math.round((x / rect.width) * 10));
  });

  incBtn?.addEventListener("click", () => update(value + 1));
  decBtn?.addEventListener("click", () => update(value - 1));
  resetBtn?.addEventListener("click", () => update(0));

  ["All", ...sides].forEach((side) => {
    const btn = document.getElementById(`hover-buttonBorder${side}`);
    if (!btn) return;
    btn.addEventListener("click", () => {
      ["All", ...sides].forEach((s) =>
        document
          .getElementById(`hover-buttonBorder${s}`)
          ?.classList.remove("sc-bg-454545")
      );
      btn.classList.add("sc-bg-454545");

      const { blockId, typeClass } = getTypeClassAndBlock();
      if (!typeClass) return;
      const key = `${blockId}--${typeClass}`;
      let state = window.__squareCraftHoverBorderStateMap.get(key) || {
        value: 0,
        side: "All",
      };
      state.side = side;
      currentSide = side;
      window.__squareCraftHoverBorderStateMap.set(key, state);
      applyStyle();

      // Save to database when side changes
      saveToDatabase();
    });
  });

  update(value);

  // Fetch existing hover border data
  // fetchButtonHoverBorderModifications(); // This line is removed
}

export function applyHoverButtonEffects(getSelectedElement) {
  const transition =
    document
      .getElementById("hover-buttonTransitionTypeLabel")
      ?.textContent?.trim() || "none";
  const duration =
    document.getElementById("hover-buttonDurationLabel")?.textContent?.trim() ||
    "0";
  const delay =
    document.getElementById("hover-buttonDelayLabel")?.textContent?.trim() ||
    "0";
  const transformType =
    document
      .getElementById("hover-buttonTransformTypeLabel")
      ?.textContent?.trim() || "none";

  const bullet = document.getElementById(
    "hover-buttonIconTransformPositionBullet"
  );
  const fill = document.getElementById("hover-buttonIconTransformPositionFill");
  const field = document.getElementById(
    "hover-buttonIconTransformPositionField"
  );
  const label = document.getElementById(
    "hover-buttoniconTransformPositionCount"
  );

  const incBtn = document.getElementById(
    "hover-buttonTransformPositionIncrease"
  );
  const decBtn = document.getElementById(
    "hover-buttonTransformPositionDecrease"
  );

  if (!bullet || !fill || !field || !label) return;

  const min = -90;
  const max = 90;
  let value = window.__squareCraftTransformDistance ?? 0;

  function applyHoverStyles() {
    const distance = value;
    window.__squareCraftTransformDistance = distance;

    const selected = getSelectedElement?.();
    if (!selected) return;

    const button = selected.querySelector(
      ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
    );
    if (!button) return;

    const typeClass = [...button.classList].find((cls) =>
      cls.startsWith("sqs-button-element--")
    );
    if (!typeClass) return;

    const transformRule = (() => {
      if (transformType === "TranslateX") return `translateX(${distance}px)`;
      if (transformType === "TranslateY") return `translateY(${distance}px)`;
      if (transformType === "RotateX") return `rotateX(${distance}deg)`;
      if (transformType === "RotateY") return `rotateY(${distance}deg)`;
      if (transformType === "Scale") return `scale(${1 + distance / 100})`;
      return "none";
    })();

    const styleId = `sc-hover-effects-${typeClass.replace(/--/g, "-")}`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    styleTag.innerHTML = `
.${typeClass}:hover {
  transition: all ${duration}ms ${transition} ${delay}ms !important;
  transform: ${transformRule} !important;
}
`;
  }

  function update(newVal) {
    value = Math.max(min, Math.min(max, newVal));
    const percent = ((value - min) / (max - min)) * 100;
    const centerPercent = ((0 - min) / (max - min)) * 100;

    bullet.style.left = `${percent}%`;
    fill.style.left = `${Math.min(percent, centerPercent)}%`;
    fill.style.width = `${Math.abs(percent - centerPercent)}%`;
    label.textContent = `${value}px`;

    applyHoverStyles();
  }

  function updateFromClientX(clientX) {
    const rect = field.getBoundingClientRect();
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width);
    const val = Math.round(min + (x / rect.width) * (max - min));
    update(val);
  }

  bullet.addEventListener("mousedown", (e) => {
    e.preventDefault();
    const move = (eMove) => updateFromClientX(eMove.clientX);
    const up = () => {
      document.removeEventListener("mousemove", move);
      document.removeEventListener("mouseup", up);
    };
    document.addEventListener("mousemove", move);
    document.addEventListener("mouseup", up);
  });

  field.addEventListener("click", (e) => updateFromClientX(e.clientX));

  incBtn?.addEventListener("click", () => update(value + 1));
  decBtn?.addEventListener("click", () => update(value - 1));

  setTimeout(() => update(window.__squareCraftTransformDistance || 0), 50);

  // Fetch existing hover effects data
  // fetchButtonHoverBorderModifications(); // This line is removed
}

window.syncHoverButtonStylesFromElement = function (selectedElement) {
  if (!selectedElement) return;

  const sample = selectedElement.querySelector(
    "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
  );
  if (!sample) return;

  const typeClass = [...sample.classList].find((cls) =>
    cls.startsWith("sqs-button-element--")
  );
  if (!typeClass) return;

  const hoverKey = `hover--${typeClass}`;

  // Read applied hover styles directly from the DOM
  // Look for all dynamically injected style tags that contain hover styles
  const styleTagPatterns = [
    'style[id*="sc-hover-border-"]',
    'style[id*="sc-hover-radius-"]',
    'style[id*="sc-hover-border-style-"]',
    'style[id*="sc-hover-border-fetched-"]',
  ];

  let foundHoverStyles = {
    borderWidth: 0,
    borderStyle: "solid",
    borderColor: "black",
    borderRadius: 0,
  };

  // Aggregate properties from all relevant style tags
  console.log(
    "🔍 syncHoverButtonStylesFromElement: Searching for style tags with patterns:",
    styleTagPatterns
  );

  for (const pattern of styleTagPatterns) {
    const styleTags = document.querySelectorAll(pattern);
    console.log(
      `🔍 Found ${styleTags.length} style tags with pattern: ${pattern}`
    );

    for (const styleTag of styleTags) {
      const styleContent = styleTag.textContent;
      console.log(
        `🔍 Style tag ID: ${styleTag.id}, Content: ${styleContent.substring(
          0,
          100
        )}...`
      );

      if (styleContent.includes(typeClass) && styleContent.includes(":hover")) {
        console.log(`✅ Found matching style tag for ${typeClass}`);

        // Extract the CSS rules from the style content
        const cssRules = styleContent.match(/\{[^}]+\}/);
        if (cssRules) {
          const ruleText = cssRules[0];
          console.log(`🔍 CSS rule: ${ruleText}`);

          // Extract border properties and update foundHoverStyles
          const borderWidthMatch = ruleText.match(
            /border-top-width:\s*([^;]+)/
          );
          const borderStyleMatch = ruleText.match(/border-style:\s*([^;]+)/);
          const borderColorMatch = ruleText.match(/border-color:\s*([^;]+)/);
          const borderRadiusMatch = ruleText.match(/border-radius:\s*([^;]+)/);

          if (borderWidthMatch) {
            foundHoverStyles.borderWidth = parseInt(borderWidthMatch[1]);
            console.log(
              `📏 Found border width: ${foundHoverStyles.borderWidth}`
            );
          }
          if (borderStyleMatch) {
            foundHoverStyles.borderStyle = borderStyleMatch[1].trim();
            console.log(
              `📏 Found border style: ${foundHoverStyles.borderStyle}`
            );
          }
          if (borderColorMatch) {
            foundHoverStyles.borderColor = borderColorMatch[1].trim();
            console.log(
              `📏 Found border color: ${foundHoverStyles.borderColor}`
            );
          }
          if (borderRadiusMatch) {
            foundHoverStyles.borderRadius = parseInt(borderRadiusMatch[1]);
            console.log(
              `📏 Found border radius: ${foundHoverStyles.borderRadius}`
            );
          }
        }
      }
    }
  }

  // If no styles found in DOM, fall back to global state
  const hasStylesInDOM =
    foundHoverStyles.borderWidth > 0 ||
    foundHoverStyles.borderRadius > 0 ||
    foundHoverStyles.borderStyle !== "solid" ||
    foundHoverStyles.borderColor !== "black";

  console.log(`🔍 Has styles in DOM: ${hasStylesInDOM}`);
  console.log(`🔍 Found hover styles:`, foundHoverStyles);

  if (!hasStylesInDOM) {
    console.log("⚠️ No styles found in DOM, falling back to global state");
    const borderState = window.__squareCraftHoverBorderStateMap?.get(
      hoverKey
    ) || { value: 0, side: "All" };
    foundHoverStyles = {
      borderWidth: borderState.value || 0,
      borderStyle: window.__squareCraftBorderStyle || "solid",
      borderColor: window.__squareCraftHoverBorderColor || "#000000",
      borderRadius: parseInt(window.__squareCraftHoverRadius || 0),
    };
    console.log(`🔍 Using global state:`, foundHoverStyles);
  }

  // Update global state with the found values
  window.__squareCraftHoverBorderStateMap =
    window.__squareCraftHoverBorderStateMap || new Map();
  window.__squareCraftHoverBorderStateMap.set(hoverKey, {
    value: foundHoverStyles.borderWidth,
    side: "All",
  });
  window.__squareCraftBorderStyle = foundHoverStyles.borderStyle;
  window.__squareCraftHoverBorderColor = foundHoverStyles.borderColor;
  window.__squareCraftHoverRadius = foundHoverStyles.borderRadius;

  // 1. 🔄 Border Width
  const getPercent = (val, max) => `${(val / max) * 100}%`;

  const fill = document.getElementById("hover-buttonBorderFill");
  const bullet = document.getElementById("hover-buttonBorderBullet");
  const valueText = document.getElementById("hover-buttonBorderCount");

  const percent = (foundHoverStyles.borderWidth / 10) * 100;
  if (fill && bullet && valueText) {
    fill.style.width = `${percent}%`;
    bullet.style.left = `${percent}%`;
    valueText.textContent = `${foundHoverStyles.borderWidth}px`;
  }

  // 2. 🟢 Border Side Tab Sync
  const sides = ["Top", "Right", "Bottom", "Left", "All"];
  sides.forEach((side) => {
    const el = document.getElementById(`hover-buttonBorder${side}`);
    if (el) {
      el.classList.toggle("sc-bg-454545", side === "All");
    }
  });

  // 3. 🔄 Border Style Type
  ["Solid", "Dashed", "Dotted"].forEach((type) => {
    const btn = document.getElementById(`hover-buttonBorderType${type}`);
    if (btn)
      btn.classList.toggle(
        "sc-bg-454545",
        foundHoverStyles.borderStyle === type.toLowerCase()
      );
  });

  // 4. 🔄 Radius
  const radPercent = (foundHoverStyles.borderRadius / 50) * 100;
  const radiusFill = document.getElementById("hover-buttonBorderradiusFill");
  const radiusBullet = document.getElementById(
    "hover-buttonBorderradiusBullet"
  );
  const radiusCount = document.getElementById("hover-buttonBorderradiusCount");

  console.log(
    `🔍 Updating radius UI: ${foundHoverStyles.borderRadius}px (${radPercent}%)`
  );
  console.log(`🔍 Radius elements found:`, {
    radiusFill: !!radiusFill,
    radiusBullet: !!radiusBullet,
    radiusCount: !!radiusCount,
  });

  if (radiusFill && radiusBullet && radiusCount) {
    radiusFill.style.width = `${radPercent}%`;
    radiusBullet.style.left = `${radPercent}%`;
    radiusCount.textContent = `${foundHoverStyles.borderRadius}px`;
    console.log(`✅ Updated radius UI to ${foundHoverStyles.borderRadius}px`);
  } else {
    console.log("⚠️ Some radius UI elements not found");
  }

  // 5. 🔄 Shadow
  const hoverShadow = window.hoverShadowState || {};
  ["Xaxis", "Yaxis", "Blur", "Spread"].forEach((type) => {
    const val = hoverShadow[type] || 0;
    const percent = `${(val / (type === "Blur" ? 50 : 30)) * 100}%`;

    const count = document.getElementById(`hover-buttonShadow${type}Count`);
    const fill = document.getElementById(`hover-buttonShadow${type}Fill`);
    const bullet = document.getElementById(`hover-buttonShadow${type}Bullet`);

    if (count) count.textContent = `${val}px`;
    if (fill) fill.style.width = percent;
    if (bullet) bullet.style.left = percent;
  });

  // You can similarly add for:
  // - hover icon rotation
  // - hover icon size
  // - hover spacing
  // - transform type and distance if needed
};
