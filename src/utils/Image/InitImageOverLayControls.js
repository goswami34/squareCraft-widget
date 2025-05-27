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

  const initSlider = (selector, key) => {
    const field = document.querySelector(selector);
    const bullet = field?.querySelector(".sc-custom-overlay-bullet");

    if (!field || !bullet) return;

    const updateUI = (px) => {
      const percent = px / field.offsetWidth;
      const value = Math.round(percent * 200 - 100); // -100 to +100
      overlayState[key] = value;
      bullet.style.left = `${px}px`;
      bullet.style.transform = "translateX(-50%)";
      updateOverlayStyles();

      // Optional: update display value (if you have one)
      const valueDisplay = field
        .closest(".sc-w-full")
        ?.querySelector(".sc-text-xs");
      if (valueDisplay) valueDisplay.textContent = `${value}px`;
    };

    const drag = (e) => {
      const clientX = e.clientX || e.touches?.[0]?.clientX;
      const rect = field.getBoundingClientRect();
      const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
      updateUI(offsetX);
    };

    bullet.addEventListener("mousedown", (e) => {
      e.preventDefault();
      document.addEventListener("mousemove", drag);
      document.addEventListener("mouseup", () => {
        document.removeEventListener("mousemove", drag);
      });
    });

    // Initialize bullet at center (0px)
    setTimeout(() => {
      const center = field.offsetWidth / 2;
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

    initSlider(".mt-3 .sc-w-full:nth-child(1)", "x", true); // X axis
    initSlider(".mt-3 .sc-w-full:nth-child(2)", "y", true); // Y axis
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
