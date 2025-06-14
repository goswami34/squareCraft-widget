import { initOverLayColorPalate } from "../initOverLayColorPalate/initOverLayColorPalate.js";

const overlayState = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  color: "rgba(0,0,0,0.5)",
};

// Store pending modifications
const pendingOverlayModifications = new Map();

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

    const existing = content.querySelector(".sc-custom-overlay");
    if (existing) existing.remove();

    // ✅ Make sure parent is positioned correctly
    content.style.position = "relative";

    const overlay = document.createElement("div");
    overlay.className = "sc-custom-overlay";

    Object.assign(overlay.style, {
      position: "absolute",
      top: `${overlayState.y}px`,
      left: `${overlayState.x}px`,
      width: `${overlayState.width}%`,
      height: `${overlayState.height}%`,
      backgroundColor: overlayState.color || "rgba(0,0,0,0.5)", // ✅ ADD THIS
      zIndex: "9999", // ensure on top
      pointerEvents: "none",
      borderRadius: "inherit",
      transition: "all 0.3s ease",
      content: " ",
    });

    content.appendChild(overlay);
  };

  function storeOverlayStyles(blockId) {
    if (!blockId) return;

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
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }

    // 💡 Apply CSS to the pseudo element using `::before`
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

  const initOverlaySlider = (selector, key, bulletId, isYAxis = false) => {
    const field = document.querySelector(selector);
    const bullet = document.getElementById(bulletId); // Use unique bullet ID
    const valueDisplay = document.getElementById(
      key === "x" ? "xAxisValue" : "yAxisValue"
    );

    if (!field || !bullet || !valueDisplay) return;

    const getDimension = () =>
      isYAxis ? field.offsetHeight : field.offsetWidth;

    const setBulletPosition = () => {
      const dimension = getDimension();
      const center = dimension / 2;
      const offset = overlayState[key];
      const pixel = center + offset;

      if (isYAxis) {
        bullet.style.top = `${pixel}px`;
        bullet.style.left = "50%";
        bullet.style.transform = "translate(-50%, -50%)";
      } else {
        bullet.style.left = `${pixel}px`;
        bullet.style.top = "50%";
        bullet.style.transform = "translate(-50%, -50%)";
      }
    };

    const updateStateAndUI = (pixelPos) => {
      const dimension = getDimension();
      const center = dimension / 2;
      const offset = Math.round(pixelPos - center);

      overlayState[key] = offset;
      valueDisplay.textContent = `${offset}px`;
      setBulletPosition();

      const overlayEl = selectedImage?.querySelector(".sc-custom-overlay");
      if (overlayEl) {
        overlayEl.style[key === "x" ? "left" : "top"] = `${offset}px`;
      }

      updateOverlayStyles();
    };

    const drag = (e) => {
      const clientPos = isYAxis
        ? e.clientY || e.touches?.[0]?.clientY
        : e.clientX || e.touches?.[0]?.clientX;

      const rect = field.getBoundingClientRect();
      const pos = isYAxis ? clientPos - rect.top : clientPos - rect.left;

      updateStateAndUI(pos);
    };

    bullet.addEventListener("mousedown", (e) => {
      e.preventDefault();
      document.addEventListener("mousemove", drag);
      document.addEventListener(
        "mouseup",
        () => {
          document.removeEventListener("mousemove", drag);
        },
        { once: true }
      );
    });

    setTimeout(() => {
      setBulletPosition();
      valueDisplay.textContent = `${overlayState[key]}px`;
    }, 150);
  };

  const setupIncrementControl = (controlId, valueId, key) => {
    const control = document.getElementById(controlId);
    const valueDisplay = document.getElementById(valueId);
    if (!control || !valueDisplay) return;

    const up = control.querySelector(".overlay-arrow-up");
    const down = control.querySelector(".overlay-arrow-down");

    const updateDisplay = () => {
      valueDisplay.textContent = `${overlayState[key]}%`;
      updateOverlayStyles();
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
      document.querySelector("#overLaySection")?.classList.toggle("sc-hidden");
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
    // initOverlaySlider("#xAxisSlider", "x");
    // initOverlaySlider("#yAxisSlider", "y", true);
    // initOverlaySlider("#xAxisSlider", "x", "xAxisBullet");
    // initOverlaySlider("#yAxisSlider", "y", "yAxisBullet", true);

    initOverlaySlider("#xAxisSlider", "x", "xAxisBullet");
    initOverlaySlider("#yAxisSlider", "y", "yAxisBullet", false);

    // Color palette
    // setTimeout(() => {
    //   const colorPicker = document.getElementById("overLayFontColorPalate");
    //   if (colorPicker) {
    //     initOverLayColorPalate(
    //       themeColors,
    //       () => selectedImage,
    //       "overlay-",
    //       // (color, alpha) => {
    //       //   const rgbaColor = color.startsWith("rgb(")
    //       //     ? color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
    //       //     : color;

    //       //   overlayState.color = rgbaColor;

    //       //   const overlayEl =
    //       //     selectedImage?.querySelector(".sc-custom-overlay");
    //       //   if (overlayEl) {
    //       //     overlayEl.style.backgroundColor = rgbaColor;
    //       //   }

    //       //   updateOverlayStyles();
    //       // }
    //       (color, alpha) => {
    //         const rgbaColor = color.startsWith("rgb(")
    //           ? color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
    //           : color;

    //         overlayState.color = rgbaColor;

    //         // ✅ Update inline overlay div (visible overlay)
    //         const overlayEl =
    //           selectedImage?.querySelector(".sc-custom-overlay");
    //         if (overlayEl) {
    //           overlayEl.style.backgroundColor = rgbaColor;
    //         } else {
    //           console.log("No overlay element found");
    //         }

    //         // ✅ Also update the ::before overlay via style tag
    //         updateOverlayStyles();
    //       }
    //     );
    //   }
    // }, 100);

    setTimeout(() => {
      const colorPicker = document.getElementById("overLayFontColorPalate");
      if (colorPicker) {
        initOverLayColorPalate(
          themeColors,
          () => selectedImage,
          "overlay-",
          (color, alpha) => {
            const rgbaColor = color.startsWith("rgb(")
              ? color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
              : color;

            overlayState.color = rgbaColor;

            const overlayEl =
              selectedImage?.querySelector(".sc-custom-overlay");
            if (overlayEl) {
              overlayEl.style.backgroundColor = rgbaColor;
            }

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

    if (!overlayState.color) {
      overlayState.color = "rgba(0,0,0,0.5)";
    }

    createOverlay();
    updateOverlayStyles();
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

  return {
    init,
    setSelectedImage,
    publishPendingModifications, // Export the publish function
  };
};
