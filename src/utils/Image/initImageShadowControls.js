const imageStyleMap = new Map();

// ✅ initImageShadowControls.js

// Track previous saved values to avoid unnecessary database calls
const previousSavedValues = new Map();

// Debounce mechanism for color changes
let colorChangeTimeout = null;

function mergeAndSaveImageStyles(blockId, newStyles) {
  // Get existing styles from the map
  const prevStyles = imageStyleMap.get(blockId) || {
    image: {
      selector: `#${blockId} div.sqs-image-content`,
      styles: {},
    },
    imageTag: {
      selector: `#${blockId} .sqs-image-content img`,
      styles: {
        "box-sizing": "border-box",
        "object-fit": "cover",
      },
    },
  };

  // Merge the new styles with existing styles
  const mergedImageStyles = {
    ...prevStyles.image.styles, // Keep existing styles
    ...(newStyles.image?.styles || {}), // Add new styles
  };

  const finalData = {
    image: {
      selector: prevStyles.image.selector,
      styles: mergedImageStyles,
    },
    imageTag: {
      selector: prevStyles.imageTag.selector,
      styles: {
        ...prevStyles.imageTag.styles,
        ...(newStyles.imageTag?.styles || {}),
      },
    },
  };

  // Check if values have actually changed
  const currentShadowValue = finalData.image.styles["box-shadow"];
  const previousShadowValue = previousSavedValues.get(blockId);

  if (currentShadowValue === previousShadowValue) {
    console.log("🔄 Shadow values unchanged, skipping local update");
    return;
  }

  // Save to map only (no database call)
  imageStyleMap.set(blockId, finalData);
  previousSavedValues.set(blockId, currentShadowValue);
}

const shadowState = {
  x: 0, // centered
  y: 0, // centered
  blur: 10, // default blur
  spread: 2, // default spread
  color: "rgba(0,0,0,0.5)",
};

function updateShadowCSS(blockId) {
  const { x, y, blur, spread, color } = shadowState;
  const selector = `#${blockId} div.sqs-image-content`;
  const styleId = `sc-shadow-style-${blockId}`;
  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  // Get existing styles from the map
  const existingStyles = imageStyleMap.get(blockId)?.image?.styles || {};

  // Update live style
  styleTag.textContent = `
      ${selector} {
        ${Object.entries(existingStyles)
          .map(([key, value]) => `${key}: ${value} !important;`)
          .join("\n        ")}
        box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${color} !important;
        -webkit-mask-image: none !important;
      }
    `;

  // Queue the change for publish (no database call)
  if (typeof window !== "undefined" && window.pendingModifications) {
    const cssPayload = {
      image: {
        selector,
        styles: {
          ...existingStyles,
          "box-shadow": `${x}px ${y}px ${blur}px ${spread}px ${color}`,
          "-webkit-mask-image": "none",
        },
      },
      imageTag: {
        selector: `#siteWrapper #${blockId} .intrinsic, #siteWrapper #${blockId} .sqs-image`,
        styles: {
          overflow: "visible",
        },
      },
    };
    if (!window.pendingModifications.has(blockId)) {
      window.pendingModifications.set(blockId, []);
    }
    window.pendingModifications.get(blockId).push({
      css: cssPayload,
      tagType: "image",
    });
  }
}

function applyOverflowVisible(blockId) {
  const styleId = `sc-overflow-style-${blockId}`;
  const selector = `#siteWrapper #${blockId} .intrinsic, #siteWrapper #${blockId} .sqs-image`;

  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.textContent = `
      ${selector} {
        overflow: visible !important;
      }
    `;
}

function initShadowSlider(controlId, key, getSelectedElement) {
  const field = document.getElementById(controlId);
  const bullet = field?.querySelector(".shadow-bullet");
  const label = field?.previousElementSibling?.querySelector("p.sc-text-xs");
  const externalValueLabel = document.getElementById(
    `shadow${key.charAt(0).toUpperCase() + key.slice(1)}Value`
  );
  const fill = field?.querySelector(
    `#${controlId} > .sc-bg-color-EF7C2F:not(.shadow-bullet)`
  );

  if (!field || !bullet) return;

  const isCentered = key === "x" || key === "y";
  const initial = shadowState[key];
  const initialPercent = isCentered ? (initial + 100) / 2 : initial;

  const setUI = (percent) => {
    const sliderWidth = field.offsetWidth;
    const px = (percent / 100) * sliderWidth;
    bullet.style.left = `${px}px`;
    bullet.style.transform = "translateX(-50%)";

    if (fill) fill.style.width = `${px}px`;

    const rawVal = isCentered
      ? (percent / 100) * 200 - 100
      : (percent / 100) * 100;
    const displayVal = Math.round(rawVal);

    if (label) label.textContent = `${displayVal}px`;
    if (externalValueLabel) externalValueLabel.textContent = `${displayVal}px`;
    shadowState[key] = displayVal;
  };

  setTimeout(() => {
    setUI(initialPercent);
  }, 50);

  const startDrag = (e) => {
    e.preventDefault();
    let isDragging = true;

    const moveHandler = (ev) => {
      const clientX = ev.clientX || ev.touches?.[0]?.clientX;
      const rect = field.getBoundingClientRect();
      const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const percent = (offsetX / rect.width) * 100;

      setUI(percent);

      const selected = getSelectedElement?.();
      const blockId = selected?.closest('[id^="block-"]')?.id;
      if (blockId) {
        updateShadowCSSLive(blockId);
        if (key === "blur") applyOverflowVisible(blockId);
      }
    };

    const stopDrag = () => {
      isDragging = false;
      const selected = getSelectedElement?.();
      const blockId = selected?.closest('[id^="block-"]')?.id;
      if (blockId) {
        updateShadowCSS(blockId);
      }
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("touchend", stopDrag);
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", moveHandler);
    document.addEventListener("touchend", stopDrag);
  };

  bullet.addEventListener("mousedown", startDrag);
  bullet.addEventListener("touchstart", startDrag);
}

// New function to update CSS without saving to database
function updateShadowCSSLive(blockId) {
  const { x, y, blur, spread, color } = shadowState;
  const selector = `#${blockId} div.sqs-image-content`;
  const styleId = `sc-shadow-style-${blockId}`;
  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  // Get existing styles from the map
  const existingStyles = imageStyleMap.get(blockId)?.image?.styles || {};

  // Update live style only (no database save)
  styleTag.textContent = `
      ${selector} {
        ${Object.entries(existingStyles)
          .map(([key, value]) => `${key}: ${value} !important;`)
          .join("\n        ")}
        box-shadow: ${x}px ${y}px ${blur}px ${spread}px ${color} !important;
        -webkit-mask-image: none !important;
      }
    `;
}

function applyShadowColorFromPalette(color, alpha = 1, getSelectedElement) {
  const selected = getSelectedElement?.();
  if (!selected) return;

  const blockId = selected.closest('[id^="block-"]')?.id;
  if (!blockId) return;

  // Get existing styles
  const existingStyles = imageStyleMap.get(blockId)?.image?.styles || {};

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

  // Update shadow state
  shadowState.color = rgbaColor;
  const { x, y, blur, spread } = shadowState;

  // Visual live update
  updateShadowCSSLive(blockId);

  // Queue the change for publish (no database call)
  if (typeof window !== "undefined" && window.pendingModifications) {
    const cssPayload = {
      image: {
        selector: `#${blockId} div.sqs-image-content`,
        styles: {
          ...existingStyles,
          "box-shadow": `${x}px ${y}px ${blur}px ${spread}px ${rgbaColor}`,
          "-webkit-mask-image": "none",
        },
      },
      imageTag: {
        selector: `#siteWrapper #${blockId} .intrinsic, #siteWrapper #${blockId} .sqs-image`,
        styles: {
          overflow: "visible",
        },
      },
    };
    if (!window.pendingModifications.has(blockId)) {
      window.pendingModifications.set(blockId, []);
    }
    window.pendingModifications.get(blockId).push({
      css: cssPayload,
      tagType: "image",
    });
  }
}

export function initImageShadowControls(getSelectedElement) {
  initShadowSlider("shadowXSlider", "x", getSelectedElement); // ✅ -100 to +100
  initShadowSlider("shadowYSlider", "y", getSelectedElement); // ✅ -100 to +100
  initShadowSlider("shadowBlurSlider", "blur", getSelectedElement); // ✅ 0 to 100
  initShadowSlider("shadowSpreadSlider", "spread", getSelectedElement); // ✅ 0 to 100
}

export { applyShadowColorFromPalette };
