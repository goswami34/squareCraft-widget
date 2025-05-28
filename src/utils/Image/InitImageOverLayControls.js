import { initOverLayColorPalate } from "../initOverLayColorPalate/initOverLayColorPalate.js";

export const InitImageOverLayControls = () => {
  let selectedImage = null;

  const overlayState = {
    x: 0,
    y: 0,
    width: 100,
    height: 100,
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
      `;
    content.style.position = "relative";
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

    // Center bullet on init
    setTimeout(() => {
      const center = isYAxis ? field.offsetHeight / 2 : field.offsetWidth / 2;
      updateUI(center);
    }, 50);
  };

  const initEventListeners = () => {
    document.querySelector("#overLayButton")?.addEventListener("click", () => {
      document.querySelector("#overLaySection")?.classList.toggle("sc-hidden");
    });

    document.querySelectorAll(".sc-text-sm").forEach((el, idx) => {
      el.addEventListener("click", () => {
        const val = parseInt(el.textContent.replace("px", "")) || 100;
        if (idx === 1) overlayState.width = val;
        if (idx === 2) overlayState.height = val;
        updateOverlayStyles();
      });
    });

    initOverlaySlider(".mt-3 .sc-w-full:nth-child(1) .sc-rounded-15px", "x");
    initOverlaySlider(
      ".mt-3 .sc-w-full:nth-child(2) .sc-rounded-15px",
      "y",
      true
    );

    // ✅ Correct placement of initOverLayColorPalate
    setTimeout(() => {
      const colorPicker = document.getElementById("overlayColorPalate");
      if (colorPicker) {
        initOverLayColorPalate(
          {
            accent: "#EF7C2F",
            white: "#ffffff",
            black: "#000000",
            darkAccent: "#1c1c1c",
            lightAccent: "#eaeaea",
          },
          () => selectedImage,
          "overlay-",
          (color, alpha) => {
            overlayState.color = color;
            updateOverlayStyles();
          }
        );
      }
    }, 100);
  };

  const setSelectedImage = (imageElement) => {
    selectedImage = imageElement;
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
