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

  const initOverlaySlider = (selector, key) => {
    const field = document.querySelector(selector);
    const bullet = field?.querySelector(".sc-custom-overlay-bullet");
    const valueDisplay = field
      ?.closest(".sc-w-full")
      ?.querySelector(".sc-text-xs");

    if (!field || !bullet) return;

    // Set initial value
    const setUI = (percent) => {
      const sliderWidth = field.offsetWidth;
      const px = (percent / 100) * sliderWidth;
      bullet.style.left = `${px}px`;
      bullet.style.transform = "translateX(-50%)";

      // Map percent (0-100) to value (-100 to 100)
      const value = Math.round((percent / 100) * 200 - 100);
      overlayState[key] = value;
      if (valueDisplay) valueDisplay.textContent = `${value}px`;
      updateOverlayStyles();
    };

    // Initialize to current overlay value
    setTimeout(() => {
      const percent = ((overlayState[key] + 100) / 200) * 100;
      setUI(percent);
    }, 50);

    const startDrag = (e) => {
      e.preventDefault();
      const moveHandler = (ev) => {
        const clientX = ev.clientX || ev.touches?.[0]?.clientX;
        const rect = field.getBoundingClientRect();
        const offsetX = Math.min(Math.max(clientX - rect.left, 0), rect.width);
        const percent = (offsetX / rect.width) * 100;
        setUI(percent);
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

    // X and Y axis sliders (use the .sc-rounded-15px bar inside each .sc-w-full)
    initOverlaySlider(".mt-3 .sc-w-full:nth-child(1) .sc-rounded-15px", "x"); // X axis
    initOverlaySlider(".mt-3 .sc-w-full:nth-child(2) .sc-rounded-15px", "y"); // Y axis
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
