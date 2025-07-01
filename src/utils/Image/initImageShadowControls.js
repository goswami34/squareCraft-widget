const imageStyleMap = new Map();

// ✅ initImageShadowControls.js

// Store pending modifications locally (like overlay)
const pendingShadowModifications = new Map();

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

  // Save to map only (no DB call)
  imageStyleMap.set(blockId, finalData);

  // Store in local pendingModifications (like overlay)
  pendingShadowModifications.set(blockId, finalData);
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

  // Save to map and pendingModifications only
  mergeAndSaveImageStyles(blockId, {
    image: {
      styles: {
        ...existingStyles, // Preserve existing styles
        "box-shadow": `${x}px ${y}px ${blur}px ${spread}px ${color}`,
        "-webkit-mask-image": "none",
      },
    },
  });
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
    let displayVal, px;
    if (isCentered) {
      // Map percent (0-100) to value (-100 to +100)
      const value = percent * 2 - 100;
      displayVal = Math.round(value);
      shadowState[key] = displayVal;
      // Map value (-100 to +100) to px (0 to sliderWidth)
      px = ((value + 100) / 200) * sliderWidth;
    } else {
      // For blur/spread (0-100)
      displayVal = Math.round((percent / 100) * 100);
      shadowState[key] = displayVal;
      px = (percent / 100) * sliderWidth;
    }

    // Move bullet
    bullet.style.left = `${px}px`;
    bullet.style.transform = "translateX(-50%)";

    // Update fill from center for X/Y
    if (fill && isCentered) {
      const center = sliderWidth / 2;
      const fillWidth = Math.abs((displayVal / 200) * sliderWidth);
      const isNegative = displayVal < 0;
      fill.style.width = `${fillWidth}px`;
      fill.style.left = isNegative ? `${center - fillWidth}px` : `${center}px`;
      fill.style.transform = "translateX(0%)";
    }

    // For blur/spread (not centered)
    if (fill && !isCentered) {
      fill.style.left = `0px`;
      fill.style.width = `${px}px`;
      fill.style.transform = `translateX(0%)`;
    }

    // Update text labels
    if (label) label.textContent = `${displayVal}px`;
    if (externalValueLabel) externalValueLabel.textContent = `${displayVal}px`;
  };

  setTimeout(() => {
    setUI(initialPercent);
  }, 50);

  const startDrag = (e) => {
    e.preventDefault();
    const moveHandler = (ev) => {
      const clientX = ev.clientX || ev.touches?.[0]?.clientX;
      const rect = field.getBoundingClientRect();
      const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      const percent = (offsetX / rect.width) * 100;

      setUI(percent);

      const selected = getSelectedElement?.();
      const blockId = selected?.closest('[id^="block-"]')?.id;
      if (blockId) {
        updateShadowCSS(blockId);
        if (key === "blur") applyOverflowVisible(blockId);
      }
    };

    const stopDrag = () => {
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

  // Save to map and pendingModifications only
  mergeAndSaveImageStyles(blockId, {
    image: {
      styles: {
        ...existingStyles, // Preserve existing styles
        "box-shadow": `${x}px ${y}px ${blur}px ${spread}px ${rgbaColor}`,
        "-webkit-mask-image": "none",
      },
    },
  });

  // Update live style
  updateShadowCSS(blockId);
}

// Function to publish all pending shadow modifications (like overlay)
const publishPendingShadowModifications = async (
  saveImageShadowModifications
) => {
  if (pendingShadowModifications.size === 0) {
    console.log("No shadow changes to publish");
    return;
  }

  try {
    for (const [blockId, shadowData] of pendingShadowModifications) {
      if (typeof saveImageShadowModifications === "function") {
        console.log("Publishing shadow for block:", blockId, shadowData);
        await saveImageShadowModifications(blockId, shadowData);
      }
    }

    // Clear pending modifications after successful publish
    pendingShadowModifications.clear();
    console.log("All shadow changes published successfully!");
  } catch (error) {
    console.error("Failed to publish shadow modifications:", error);
    throw error;
  }
};

export function initImageShadowControls(
  getSelectedElement,
  saveImageShadowModifications
) {
  initShadowSlider("shadowXSlider", "x", getSelectedElement); // ✅ -100 to +100
  initShadowSlider("shadowYSlider", "y", getSelectedElement); // ✅ -100 to +100
  initShadowSlider("shadowBlurSlider", "blur", getSelectedElement); // ✅ 0 to 100
  initShadowSlider("shadowSpreadSlider", "spread", getSelectedElement); // ✅ 0 to 100

  // Add publish button handler (like overlay)
  const publishButton = document.getElementById("publish");
  if (publishButton) {
    // Remove existing listener to avoid duplicates
    publishButton.removeEventListener(
      "click",
      publishButton.shadowPublishHandler
    );

    // Create new handler
    publishButton.shadowPublishHandler = async () => {
      try {
        await publishPendingShadowModifications(saveImageShadowModifications);
      } catch (error) {
        console.error("Shadow publish error:", error);
      }
    };

    // Add the handler
    publishButton.addEventListener("click", publishButton.shadowPublishHandler);
  }
}

export { applyShadowColorFromPalette, publishPendingShadowModifications };
