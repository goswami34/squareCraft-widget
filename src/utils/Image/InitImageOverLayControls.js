export const InitImageOverLayControls = (fabric, canvas) => {
  // Initialize overlay object
  let overlay = null;

  // Create overlay rectangle
  const createOverlay = () => {
    overlay = new fabric.Rect({
      width: 20,
      height: 20,
      fill: "#363544",
      opacity: 0.5,
      left: 50,
      top: 50,
      selectable: false,
      evented: false,
    });
    canvas.add(overlay);
    canvas.renderAll();
  };

  // Toggle overlay visibility
  const toggleOverlayVisibility = (isVisible) => {
    if (!overlay) {
      createOverlay();
    }
    overlay.set("visible", isVisible);
    canvas.renderAll();
  };

  // Set overlay color
  const setOverlayColor = (color) => {
    if (!overlay) {
      createOverlay();
    }
    overlay.set("fill", color);
    canvas.renderAll();
  };

  // Set overlay dimensions
  const setOverlayDimensions = (width, height) => {
    if (!overlay) {
      createOverlay();
    }
    overlay.set({
      width: parseInt(width),
      height: parseInt(height),
    });
    canvas.renderAll();
  };

  // Set overlay position
  const setOverlayPosition = (x, y) => {
    if (!overlay) {
      createOverlay();
    }
    overlay.set({
      left: parseInt(x),
      top: parseInt(y),
    });
    canvas.renderAll();
  };

  // Initialize event listeners
  const initEventListeners = () => {
    // Overlay visibility toggle
    const visibilityToggle = document.querySelector("#overLayButton");
    if (visibilityToggle) {
      visibilityToggle.addEventListener("click", () => {
        const overlaySection = document.querySelector("#overLaySection");
        overlaySection.classList.toggle("sc-hidden");
      });
    }

    // Color picker
    const colorPicker = document.querySelector(".sc-square-6");
    if (colorPicker) {
      colorPicker.addEventListener("click", () => {
        // Implement color picker functionality
        const color = "#363544"; // Default color
        setOverlayColor(color);
      });
    }

    // Width and Height controls
    const widthInput = document.querySelector(
      ".sc-flex.sc-mt-2.sc-items-center:nth-child(1) .sc-universal"
    );
    const heightInput = document.querySelector(
      ".sc-flex.sc-mt-2.sc-items-center:nth-child(2) .sc-universal"
    );

    if (widthInput && heightInput) {
      widthInput.addEventListener("change", (e) => {
        setOverlayDimensions(e.target.value, overlay.height);
      });

      heightInput.addEventListener("change", (e) => {
        setOverlayDimensions(overlay.width, e.target.value);
      });
    }

    // Position controls (X and Y)
    const xAxisInput = document.querySelector(
      ".sc-flex.sc-gap-2.sc-items-center.sc-justify-between:nth-child(1) .sc-text-xs"
    );
    const yAxisInput = document.querySelector(
      ".sc-flex.sc-gap-2.sc-items-center.sc-justify-between:nth-child(2) .sc-text-xs"
    );

    if (xAxisInput && yAxisInput) {
      xAxisInput.addEventListener("change", (e) => {
        setOverlayPosition(e.target.value, overlay.top);
      });

      yAxisInput.addEventListener("change", (e) => {
        setOverlayPosition(overlay.left, e.target.value);
      });
    }
  };

  // Initialize the overlay controls
  const init = () => {
    createOverlay();
    initEventListeners();
  };

  return {
    init,
    toggleOverlayVisibility,
    setOverlayColor,
    setOverlayDimensions,
    setOverlayPosition,
  };
};
