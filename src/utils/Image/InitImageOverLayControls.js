export const InitImageOverLayControls = () => {
  let selectedImage = null;

  const createOverlay = () => {
    if (!selectedImage) return;

    const content = selectedImage.querySelector(".sqs-image-content");
    if (!content) return;

    if (content.querySelector(".sc-custom-overlay")) return;

    const overlay = document.createElement("div");
    overlay.className = "sc-custom-overlay";
    overlay.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(225, 60, 51, 0.37);
        z-index: 2;
        pointer-events: none;
        border-radius: inherit;
      `;

    content.style.position = "relative";
    content.appendChild(overlay);
  };

  const updateOverlayStyles = (styles) => {
    if (!selectedImage) return;
    const overlay = selectedImage.querySelector(".sc-custom-overlay");
    if (!overlay) return;

    Object.entries(styles).forEach(([key, value]) => {
      overlay.style[key] = value;
    });
  };

  const getTextValue = (selector) => {
    const el = document.querySelector(selector);
    if (!el) return null;
    const text = el.textContent.trim();
    return text.replace("px", "").replace("#", "").trim();
  };

  const applyOverlayFromUI = () => {
    if (!selectedImage) return;

    const colorHex =
      getTextValue(".sc-inActiveTab-border p.sc-text-xs") || "363544";
    const color = `#${colorHex}`;

    const width =
      parseInt(
        getTextValue(
          ".sc-flex.sc-mt-2.sc-items-center:nth-child(2) .sc-text-sm"
        )
      ) || 100;

    const height =
      parseInt(
        getTextValue(
          ".sc-flex.sc-mt-2.sc-items-center:nth-child(3) .sc-text-sm"
        )
      ) || 100;

    const x =
      parseInt(getTextValue(".mt-3 .sc-w-full:nth-child(1) .sc-text-xs")) || 0;

    const y =
      parseInt(getTextValue(".mt-3 .sc-w-full:nth-child(2) .sc-text-xs")) || 0;

    updateOverlayStyles({
      backgroundColor: color,
      width: `${width}px`,
      height: `${height}px`,
      left: `${x}px`,
      top: `${y}px`,
    });
  };

  const initEventListeners = () => {
    // Toggle visibility of the overlay panel
    const toggleBtn = document.querySelector("#overLayButton");
    toggleBtn?.addEventListener("click", () => {
      document.querySelector("#overLaySection")?.classList.toggle("sc-hidden");
    });

    // Apply overlay when color swatch clicked
    document
      .querySelector(".sc-square-6")
      ?.addEventListener("click", applyOverlayFromUI);

    // Also apply when width/height/position changed — you can improve this using MutationObserver if needed
    document
      .querySelectorAll("#overLaySection .sc-cursor-pointer")
      .forEach((el) => {
        el.addEventListener("click", applyOverlayFromUI);
      });
  };

  const setSelectedImage = (imageElement) => {
    selectedImage = imageElement;
    createOverlay();
    applyOverlayFromUI(); // Apply values on load
  };

  const init = (imageElement) => {
    setSelectedImage(imageElement);
    initEventListeners();
  };

  return {
    init,
    setSelectedImage,
    toggleOverlayVisibility: (isVisible) =>
      updateOverlayStyles({ display: isVisible ? "block" : "none" }),
    setOverlayColor: (color) => updateOverlayStyles({ backgroundColor: color }),
    setOverlayDimensions: (w, h) =>
      updateOverlayStyles({ width: `${w}px`, height: `${h}px` }),
    setOverlayPosition: (x, y) =>
      updateOverlayStyles({ top: `${y}px`, left: `${x}px` }),
  };
};
