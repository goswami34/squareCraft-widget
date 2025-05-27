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
        width: 100px;
        height: 100px;
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

  // X axis slider: left = -100, center = 0, right = 100
  const initSlider = (selector, key) => {
    const field = document.querySelector(selector);
    const bullet = field?.querySelector(".sc-custom-overlay-bullet");
    if (!field || !bullet) return;
    let value = 0;
    const updateUI = (px) => {
      const dimension = field.offsetWidth;
      value = Math.round((px / dimension) * 200 - 100);
      overlayState[key] = value;
      bullet.style.left = `${px}px`;
      bullet.style.transform = "translateX(-50%)";
      updateOverlayStyles();
      const valueDisplay = field
        .closest(".sc-w-full")
        ?.querySelector(".sc-text-xs");
      if (valueDisplay) valueDisplay.textContent = `${value}px`;
    };
    const drag = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const rect = field.getBoundingClientRect();
      let px = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      updateUI(px);
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
    bullet.addEventListener("touchstart", (e) => {
      document.addEventListener("touchmove", drag);
      document.addEventListener(
        "touchend",
        () => {
          document.removeEventListener("touchmove", drag);
        },
        { once: true }
      );
    });
    setTimeout(() => {
      const center = field.offsetWidth / 2;
      updateUI(center);
    }, 50);
  };

  // Y axis slider: top = -100, center = 0, bottom = 100
  const initSliderY = (selector, key) => {
    const field = document.querySelector(selector);
    const bullet = field?.querySelector(".sc-custom-overlay-bullet");
    if (!field || !bullet) return;
    let value = 0;
    const updateUI = (py) => {
      const dimension = field.offsetHeight;
      value = Math.round((py / dimension) * 200 - 100);
      overlayState[key] = value;
      bullet.style.top = `${py}px`;
      bullet.style.transform = "translateY(-50%)";
      updateOverlayStyles();
      const valueDisplay = field
        .closest(".sc-w-full")
        ?.querySelector(".sc-text-xs");
      if (valueDisplay) valueDisplay.textContent = `${value}px`;
    };
    const drag = (e) => {
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = field.getBoundingClientRect();
      let py = Math.min(Math.max(clientY - rect.top, 0), rect.height);
      updateUI(py);
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
    bullet.addEventListener("touchstart", (e) => {
      document.addEventListener("touchmove", drag);
      document.addEventListener(
        "touchend",
        () => {
          document.removeEventListener("touchmove", drag);
        },
        { once: true }
      );
    });
    setTimeout(() => {
      const center = field.offsetHeight / 2;
      updateUI(center);
    }, 50);
  };

  const initEventListeners = () => {
    document.querySelector("#overLayButton")?.addEventListener("click", () => {
      document.querySelector("#overLaySection")?.classList.toggle("sc-hidden");
    });

    document.querySelector(".sc-square-6")?.addEventListener("click", () => {
      const color = "#363544";
      overlayState.color = color;
      updateOverlayStyles();
    });

    // Handle Width / Height buttons
    document.querySelectorAll(".sc-text-sm").forEach((el, idx) => {
      el.addEventListener("click", () => {
        const val = parseInt(el.textContent.replace("px", "")) || 100;
        if (idx === 1) overlayState.width = val;
        if (idx === 2) overlayState.height = val;
        updateOverlayStyles();
      });
    });

    // X and Y axis sliders
    initSlider(".mt-3 .sc-w-full:nth-child(1)", "x"); // X axis
    initSliderY(".mt-3 .sc-w-full:nth-child(2)", "y"); // Y axis
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
