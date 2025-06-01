import { initOverLayColorPalate } from "../initOverLayColorPalate/initOverLayColorPalate.js";

export const InitImageOverLayControls = (themeColors) => {
  let selectedImage = null;

  const overlayState = {
    x: 0,
    y: 0,
    width: 20,
    height: 20,
    color: "#363544",
  };

  const createOverlay = () => {
    if (!selectedImage) return;
    const content = selectedImage.querySelector(".sqs-image-content");
    if (!content || content.querySelector(".sc-custom-overlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "sc-custom-overlay";
    overlay.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: ${overlayState.width}px;
      height: ${overlayState.height}px;
      background-color: ${overlayState.color};
      z-index: 2;
      pointer-events: none;
      border-radius: inherit;
      transition: background-color 0.3s ease;
    `;
    content.style.position = "relative";
    content.style.zIndex = "0";
    content.appendChild(overlay);
  };

  const updateOverlayStyles = () => {
    if (!selectedImage) return;
    const overlay = selectedImage.querySelector(".sc-custom-overlay");
    if (!overlay) return;
    Object.assign(overlay.style, {
      top: `${overlayState.y}px`,
      left: `${overlayState.x}px`,
      width: `${overlayState.width}px`,
      height: `${overlayState.height}px`,
      backgroundColor: overlayState.color,
    });

    const widthValue = document.getElementById("overlayWidthValue");
    const heightValue = document.getElementById("overlayHeightValue");
    if (widthValue) widthValue.textContent = `${overlayState.width}px`;
    if (heightValue) heightValue.textContent = `${overlayState.height}px`;
  };

  const initOverlaySlider = (selector, key, isYAxis = false) => {
    const field = document.querySelector(selector);
    const bullet = field?.querySelector(".sc-custom-overlay-bullet");
    const valueDisplay = field
      ?.closest(".sc-w-full")
      ?.querySelector(".sc-text-xs");

    if (!field || !bullet) return;

    const updateUI = (px) => {
      const dimension = isYAxis ? field.offsetHeight : field.offsetWidth;
      const percent = px / dimension;
      const value = isYAxis
        ? Math.round((1 - percent) * 200 - 100)
        : Math.round(percent * 200 - 100);
      overlayState[key] = value;

      if (isYAxis) {
        bullet.style.top = `${px}px`;
        bullet.style.transform = "translateY(-50%)";
      } else {
        bullet.style.left = `${px}px`;
        bullet.style.transform = "translateX(-50%)";
      }

      if (valueDisplay) valueDisplay.textContent = `${value}px`;
      updateOverlayStyles();
    };

    const drag = (e) => {
      const clientPos = isYAxis
        ? e.clientY || e.touches?.[0]?.clientY
        : e.clientX || e.touches?.[0]?.clientX;

      const rect = field.getBoundingClientRect();
      const offset = isYAxis
        ? Math.min(Math.max(clientPos - rect.top, 0), rect.height)
        : Math.min(Math.max(clientPos - rect.left, 0), rect.width);

      updateUI(offset);
    };

    bullet.addEventListener("mousedown", (e) => {
      e.preventDefault();
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", drag);
      });
    });

    setTimeout(() => {
      const center = isYAxis ? field.offsetHeight / 2 : field.offsetWidth / 2;
      updateUI(center);
    }, 50);
  };

  const setupIncrementControl = (controlId, valueId, key) => {
    const control = document.getElementById(controlId);
    const valueDisplay = document.getElementById(valueId);
    if (!control || !valueDisplay) return;

    const up = control.querySelector(".overlay-arrow-up");
    const down = control.querySelector(".overlay-arrow-down");

    const updateDisplay = () => {
      valueDisplay.textContent = `${overlayState[key]}px`;
      updateOverlayStyles();
    };

    up?.addEventListener("click", () => {
      overlayState[key] += 10;
      updateDisplay();
    });

    down?.addEventListener("click", () => {
      overlayState[key] = Math.max(0, overlayState[key] - 10);
      updateDisplay();
    });
  };

  const initEventListeners = () => {
    document.querySelector("#overLayButton")?.addEventListener("click", () => {
      document.querySelector("#overLaySection")?.classList.toggle("sc-hidden");
    });

    // ✅ Setup width/height up-down controls
    setupIncrementControl("overlayWidthControl", "overlayWidthValue", "width");
    setupIncrementControl(
      "overlayHeightControl",
      "overlayHeightValue",
      "height"
    );

    // ✅ X/Y bullet sliders
    initOverlaySlider(".mt-3 .sc-w-full:nth-child(1) .sc-rounded-15px", "x");
    initOverlaySlider(
      ".mt-3 .sc-w-full:nth-child(2) .sc-rounded-15px",
      "y",
      true
    );

    // ✅ Color palette
    setTimeout(() => {
      const colorPicker = document.getElementById("overLayFontColorPalate");
      if (colorPicker) {
        initOverLayColorPalate(
          themeColors,
          () => selectedImage,
          "overlay-",
          (color, alpha) => {
            overlayState.color = color.startsWith("rgb(")
              ? color.replace("rgb(", "rgba(").replace(")", `, ${alpha})`)
              : color;
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
