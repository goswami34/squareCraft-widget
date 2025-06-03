import { initOverLayColorPalate } from "../initOverLayColorPalate/initOverLayColorPalate.js";

const overlayState = {
  x: 0,
  y: 0,
  width: 100,
  height: 100,
  color: "rgba(0,0,0,0.5)",
};

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
    });

    content.appendChild(overlay);
  };

  function saveOverlayStyles(blockId) {
    if (typeof saveImageOverlayModifications !== "function") return;
    saveImageOverlayModifications(
      blockId,
      {
        overlay: {
          selector: `#${blockId} .sc-custom-overlay`,
          styles: {
            backgroundColor: overlayState.color,
            top: `${overlayState.y}px`,
            left: `${overlayState.x}px`,
            width: `${overlayState.width}%`,
            height: `${overlayState.height}%`,
            zIndex: "9999",
            pointerEvents: "none",
            borderRadius: "inherit",
            transition: "all 0.3s ease",
          },
        },
      },
      "overlay"
    );
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
        content: '';
        position: absolute;
        top: ${overlayState.y}px;
        left: ${overlayState.x}px;
        width: ${overlayState.width}%;
        height: ${overlayState.height}%;
        background-color: ${rgbaColor};
        pointer-events: none;
        z-index: 5;
        display: block;
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

    // Save overlay styles to database
    saveOverlayStyles(blockId);

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

  return {
    init,
    setSelectedImage,
  };
};
