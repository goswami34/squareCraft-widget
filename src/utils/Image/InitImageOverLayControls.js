import { initOverLayColorPalate } from "../initOverLayColorPalate/initOverLayColorPalate.js";

const overlayState = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  color: "",
};

// Store pending modifications
const pendingOverlayModifications = new Map();

// Helper function to convert rgb to rgba with alpha
function rgbToRgba(rgb, alpha) {
  const result = rgb.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!result) return rgb;
  return `rgba(${result[1]}, ${result[2]}, ${result[3]}, ${alpha})`;
}

export const InitImageOverLayControls = (themeColors, context = {}) => {
  const {
    addPendingModification,
    saveImageOverlayModifications,
    token,
    userId,
    widgetId,
  } = context;

  let selectedImage = null;

  if (typeof addPendingModification !== "function") {
    console.warn(
      "❌ addPendingModification is not provided or not a function."
    );
    return;
  }
  console.log(addPendingModification);

  const createOverlay = () => {
    if (!selectedImage) return;
    const content = selectedImage.querySelector(".sqs-image-content");
    if (!content) return;

    // Remove any existing .sc-custom-overlay div (if present)
    const existing = content.querySelector(".sc-custom-overlay");
    if (existing) existing.remove();

    // ✅ Do NOT create a new .sc-custom-overlay div
    // Only use the pseudo-element overlay
    content.style.position = "relative";
  };

  function storeOverlayStyles(blockId) {
    if (!blockId) return;

    // ✅ Only store styles if there's a valid color
    if (
      !overlayState.color ||
      overlayState.color === "transparent" ||
      overlayState.color === "rgba(0, 0, 0, 0)" ||
      overlayState.color === "null"
    ) {
      console.log("[Overlay Store] No valid color, skipping style storage");
      return;
    }

    const pageId = document
      .querySelector("article[data-page-sections]")
      ?.getAttribute("data-page-sections");

    if (!pageId) {
      console.warn("⚠️ Missing pageId for overlay save");
      return;
    }

    const selector = `#${blockId} .sqs-image-content > :nth-child(-n+2)::before`;

    // Store the modification locally
    pendingOverlayModifications.set(blockId, {
      pageId,
      elementId: blockId,
      selector,
      styles: {
        content: " ",
        top: `${overlayState.y}px`,
        left: `${overlayState.x}px`,
        width: `${overlayState.width}%`,
        height: `${overlayState.height}%`,
        "background-color": overlayState.color,
        "pointer-events": "none",
        "z-index": "5",
        display: "block",
      },
    });

    // Show notification that changes are pending
    if (typeof context.showNotification === "function") {
      context.showNotification(
        "Changes saved locally. Click Publish to save to database.",
        "info"
      );
    }
  }

  const updateOverlayStyles = () => {
    if (!selectedImage) return;

    const blockId = selectedImage.closest('[id^="block-"]')?.id;
    if (!blockId) return;

    const rgbaColor = overlayState.color;
    const styleId = `sc-overlay-style-${blockId}`;
    let styleTag = document.getElementById(styleId);

    // ✅ CRITICAL FIX: Only inject overlay CSS if a color is set
    if (
      !rgbaColor ||
      rgbaColor === "transparent" ||
      rgbaColor === "rgba(0, 0, 0, 0)" ||
      rgbaColor === "null"
    ) {
      // If no color, remove overlay style tag if it exists
      if (styleTag) styleTag.remove();
      console.log("[Overlay CSS] No valid color set, removing overlay styles");
      return;
    }

    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    // 💡 Apply CSS to the pseudo element using `::before`
    console.log(
      "[Overlay CSS] Updating overlay with color:",
      overlayState.color
    );
    styleTag.textContent = `
      #${blockId} .sqs-image-content > :nth-child(-n+2)::before {
        position: absolute;
        top: ${overlayState.y}px;
        left: ${overlayState.x}px;
        width: ${overlayState.width}%;
        height: ${overlayState.height}%;
        background-color: ${rgbaColor};
        pointer-events: none;
        z-index: 5;
        display: block;
        content: " ";
      }
  
      #${blockId} .sqs-image-content > :nth-child(-n+2) {
        position: relative;
      }
    `;

    const overlayEl = selectedImage?.querySelector(".sc-custom-overlay");
    if (overlayEl) {
      overlayEl.style.left = `${overlayState.y}px`; // ← treat 'y' as horizontal
      overlayEl.style.top = `${overlayState.x}px`;
      overlayEl.style.backgroundColor = overlayState.color;
      // optional: swap if you want
    }

    // Store styles locally instead of saving to database
    storeOverlayStyles(blockId);

    // ✅ Optional: Update display values in UI
    const widthValue = document.getElementById("overlayWidthValue");
    const heightValue = document.getElementById("overlayHeightValue");
    if (widthValue) widthValue.textContent = `${overlayState.width}%`;
    if (heightValue) heightValue.textContent = `${overlayState.height}%`;
  };

  const initOverlaySlider = (
    selector,
    key,
    bulletId,
    treatAsVertical = false
  ) => {
    const field = document.querySelector(selector);
    const bullet = document.getElementById(bulletId);
    const valueDisplay = document.getElementById(
      key === "x" ? "xAxisValue" : "yAxisValue"
    );

    if (!field || !bullet || !valueDisplay) return;

    const getDimension = () => field.offsetWidth; // Always horizontal layout

    const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

    const setBulletPosition = () => {
      const dimension = getDimension();
      const center = dimension / 2;
      const offset = overlayState[key]; // logical value
      const pos = clamp(center + offset, 0, dimension);

      bullet.style.left = `${pos}px`;
      bullet.style.top = "50%";
      bullet.style.transform = "translate(-50%, -50%)";
    };

    // Add custom event to reposition bullet
    bullet.addEventListener("reposition", setBulletPosition);

    const updateStateAndUI = (pixelPos) => {
      const dimension = getDimension();
      const center = dimension / 2;
      const offset = clamp(Math.round(pixelPos - center), -100, 100);

      overlayState[key] = offset; // update logical Y or X
      valueDisplay.textContent = `${offset}px`;
      setBulletPosition();

      // ✅ Only update overlay styles if a color is selected
      if (
        overlayState.color &&
        overlayState.color !== "transparent" &&
        overlayState.color !== "rgba(0, 0, 0, 0)" &&
        overlayState.color !== "null"
      ) {
        updateOverlayStyles();
      }
    };

    const drag = (e) => {
      const clientX = e.touches?.[0]?.clientX || e.clientX;
      const rect = field.getBoundingClientRect();
      const pos = clientX - rect.left;
      updateStateAndUI(pos);
    };

    const startDrag = (e) => {
      e.preventDefault();
      document.addEventListener("mousemove", drag);
      document.addEventListener("touchmove", drag);
      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", drag);
          document.removeEventListener("touchmove", drag);
        },
        { once: true }
      );
      document.addEventListener(
        "touchend",
        () => {
          document.removeEventListener("mousemove", drag);
          document.removeEventListener("touchmove", drag);
        },
        { once: true }
      );
    };

    bullet.addEventListener("mousedown", startDrag);
    bullet.addEventListener("touchstart", startDrag);

    setTimeout(() => {
      setBulletPosition();
      valueDisplay.textContent = `${overlayState[key]}px`;
    }, 200);
  };

  // const setupIncrementControl = (controlId, valueId, key) => {
  //   const control = document.getElementById(controlId);
  //   const valueDisplay = document.getElementById(valueId);
  //   if (!control || !valueDisplay) return;

  //   const up = control.querySelector(".overlay-arrow-up");
  //   const down = control.querySelector(".overlay-arrow-down");

  //   const updateDisplay = () => {
  //     valueDisplay.textContent = `${overlayState[key]}%`;
  //     updateOverlayStyles();
  //   };

  //   up?.addEventListener("click", () => {
  //     overlayState[key] = Math.min(100, overlayState[key] + 1);
  //     updateDisplay();
  //   });

  //   down?.addEventListener("click", () => {
  //     overlayState[key] = Math.max(0, overlayState[key] - 1);
  //     updateDisplay();
  //   });
  // };

  const setupIncrementControl = (controlId, valueId, key) => {
    const control = document.getElementById(controlId);
    const valueDisplay = document.getElementById(valueId);
    if (!control || !valueDisplay) return;

    const up = control.querySelector(".overlay-arrow-up");
    const down = control.querySelector(".overlay-arrow-down");

    const updateDisplay = () => {
      // Clamp to 0–100
      overlayState[key] = Math.max(0, Math.min(100, overlayState[key]));
      valueDisplay.textContent = `${overlayState[key]}%`;

      // ✅ Only update overlay styles if a color is selected
      if (
        overlayState.color &&
        overlayState.color !== "transparent" &&
        overlayState.color !== "rgba(0, 0, 0, 0)" &&
        overlayState.color !== "null"
      ) {
        updateOverlayStyles();
      }
    };

    up?.addEventListener("click", () => {
      overlayState[key] = Math.min(100, overlayState[key] + 1);
      updateDisplay();
    });

    down?.addEventListener("click", () => {
      overlayState[key] = Math.max(0, overlayState[key] - 1);
      updateDisplay();
    });
  };

  const initEventListeners = () => {
    document.querySelector("#overLayButton")?.addEventListener("click", () => {
      const section = document.querySelector("#overLaySection");
      section?.classList.toggle("sc-hidden");

      // Wait for the section to be visible and then update bullet positions
      setTimeout(() => {
        const xSlider = document.getElementById("xAxisBullet");
        const ySlider = document.getElementById("yAxisBullet");
        if (xSlider) xSlider.dispatchEvent(new Event("reposition"));
        if (ySlider) ySlider.dispatchEvent(new Event("reposition"));

        // Attach dropdown handlers after overlay section is visible
        attachOverlayVisibilityDropdownHandler();
        attachOverlayDropdownArrowHandler();
      }, 100); // Adjust delay as needed
    });

    // Add click handler to the existing publish button
    const publishButton = document.getElementById("publish");
    if (publishButton) {
      publishButton.addEventListener("click", async () => {
        try {
          // Show loading state
          publishButton.disabled = true;
          publishButton.textContent = "Publishing...";

          await publishPendingModifications();
        } catch (error) {
          if (typeof context.showNotification === "function") {
            context.showNotification(error.message, "error");
          }
        } finally {
          // Reset button state
          publishButton.disabled = false;
          publishButton.textContent = "Publish";
        }
      });
    }

    // Setup width/height up-down controls
    setupIncrementControl("overlayWidthControl", "overlayWidthValue", "width");
    setupIncrementControl(
      "overlayHeightControl",
      "overlayHeightValue",
      "height"
    );

    // X/Y bullet sliders
    initOverlaySlider("#xAxisSlider", "x", "xAxisBullet", false);
    initOverlaySlider("#yAxisSlider", "y", "yAxisBullet", false);

    // Color palette
    setTimeout(() => {
      const colorPicker = document.getElementById("overLayFontColorPalate");
      if (colorPicker) {
        initOverLayColorPalate(
          themeColors,
          () => selectedImage,
          "",
          (color, alpha) => {
            let rgbaColor = color;
            if (color.startsWith("rgb(")) {
              rgbaColor = rgbToRgba(color, alpha);
            }
            console.log(
              "[Overlay Color Palette] Picked color:",
              color,
              "alpha:",
              alpha,
              "rgbaColor:",
              rgbaColor
            );
            overlayState.color = rgbaColor;
            updateOverlayStyles();
          }
        );
      }
    }, 100);
  };

  const setSelectedImage = (imageElement) => {
    selectedImage = imageElement;

    // Read initial values from DOM text and update state
    const widthText = document.getElementById("overlayWidthValue")?.textContent;
    const heightText =
      document.getElementById("overlayHeightValue")?.textContent;

    const width = parseInt(widthText?.replace("px", "").trim());
    const height = parseInt(heightText?.replace("px", "").trim());

    if (!isNaN(width)) overlayState.width = width;
    if (!isNaN(height)) overlayState.height = height;

    // Reset overlay color when selecting a new image
    overlayState.color = "";

    createOverlay();

    // Always remove overlay style tag if no color is set
    const blockId = selectedImage?.closest('[id^="block-"]')?.id;
    if (blockId) {
      const styleId = `sc-overlay-style-${blockId}`;
      const styleTag = document.getElementById(styleId);
      if (styleTag) styleTag.remove();
    }

    // Only apply overlay if color is valid
    if (
      overlayState.color &&
      overlayState.color !== "transparent" &&
      overlayState.color !== "rgba(0, 0, 0, 0)" &&
      overlayState.color !== "null"
    ) {
      updateOverlayStyles();
    }
  };

  const init = (imageElement) => {
    setSelectedImage(imageElement);
    initEventListeners();
  };

  // Function to publish all pending modifications
  const publishPendingModifications = async () => {
    if (pendingOverlayModifications.size === 0) {
      if (typeof context.showNotification === "function") {
        context.showNotification("No changes to publish", "info");
      }
      return;
    }

    try {
      for (const [blockId, modification] of pendingOverlayModifications) {
        if (typeof saveImageOverlayModifications === "function") {
          await saveImageOverlayModifications(blockId, modification.styles);
        }
      }

      // Clear pending modifications after successful publish
      pendingOverlayModifications.clear();

      if (typeof context.showNotification === "function") {
        context.showNotification(
          "All changes published successfully!",
          "success"
        );
      }
    } catch (error) {
      console.error("Failed to publish modifications:", error);
      if (typeof context.showNotification === "function") {
        context.showNotification("Failed to publish changes", "error");
      }
    }
  };

  function attachOverlayVisibilityDropdownHandler() {
    const overlayVisibilityDropdown = document.getElementById(
      "overlayVisibleDropdown"
    );
    if (!overlayVisibilityDropdown) return;

    overlayVisibilityDropdown.addEventListener("change", () => {
      const value = overlayVisibilityDropdown.value;
      const blockId = selectedImage?.closest('[id^="block-"]')?.id;
      if (!blockId) return;

      // Always ensure the style tag exists
      let styleTag = document.getElementById(`sc-overlay-style-${blockId}`);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = `sc-overlay-style-${blockId}`;
        document.head.appendChild(styleTag);
      }

      if (value === "no") {
        // Remove all overlay styles (hide overlay)
        styleTag.textContent = `
          #${blockId} .sqs-image-content > :nth-child(-n+2)::before {
            visibility: hidden !important;
          }
        `;
      } else if (value === "yes") {
        // ✅ Only restore overlay styles if a color is selected
        if (
          overlayState.color &&
          overlayState.color !== "transparent" &&
          overlayState.color !== "rgba(0, 0, 0, 0)" &&
          overlayState.color !== "null"
        ) {
          updateOverlayStyles();
        } else {
          // If no color is selected, just remove the style tag
          styleTag.remove();
        }
      }
    });
  }

  function attachOverlayDropdownArrowHandler() {
    const arrow = document.getElementById("overlayVisibleDropdownArrow");
    const select = document.getElementById("overlayVisibleDropdown");
    if (arrow && select) {
      arrow.addEventListener("click", function () {
        select.focus();
        select.click();
      });
    }
  }

  return {
    init,
    setSelectedImage,
    publishPendingModifications, // Export the publish function
  };
};
