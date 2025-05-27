export const InitImageOverLayControls = () => {
  // Initialize overlay object
  let selectedImage = null;

  // Create overlay element
  const createOverlay = () => {
    if (!selectedImage) return;

    // Create a pseudo-element style for the overlay
    const styleId = `overlay-style-${selectedImage.id}`;
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Set initial overlay styles
    updateOverlayStyles({
      backgroundColor: "#E13C335E",
      position: "absolute",
      content: "''",
      display: "block",
      top: "0",
      left: "0",
      width: "100%",
      height: "100%",
      zIndex: "1",
    });
  };

  // Update overlay styles
  const updateOverlayStyles = (styles) => {
    if (!selectedImage) return;

    const styleId = `overlay-style-${selectedImage.id}`;
    const styleElement = document.getElementById(styleId);

    if (styleElement) {
      const cssText =
        `#${selectedImage.id} .sqs-image-content > :nth-child(-n+2)::before { ` +
        Object.entries(styles)
          .map(([key, value]) => `${key}: ${value};`)
          .join(" ") +
        " }";
      styleElement.textContent = cssText;
    }
  };

  // Toggle overlay visibility
  const toggleOverlayVisibility = (isVisible) => {
    if (!selectedImage) return;

    updateOverlayStyles({
      display: isVisible ? "block" : "none",
    });
  };

  // Set overlay color
  const setOverlayColor = (color) => {
    if (!selectedImage) return;

    updateOverlayStyles({
      backgroundColor: color,
    });
  };

  // Set overlay dimensions
  const setOverlayDimensions = (width, height) => {
    if (!selectedImage) return;

    updateOverlayStyles({
      width: `${width}px`,
      height: `${height}px`,
    });
  };

  // Set overlay position
  const setOverlayPosition = (x, y) => {
    if (!selectedImage) return;

    updateOverlayStyles({
      top: `${y}px`,
      left: `${x}px`,
    });
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
        const color = "#E13C335E"; // Default color
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
        setOverlayDimensions(e.target.value, selectedImage.offsetHeight);
      });

      heightInput.addEventListener("change", (e) => {
        setOverlayDimensions(selectedImage.offsetWidth, e.target.value);
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
        setOverlayPosition(e.target.value, 0);
      });

      yAxisInput.addEventListener("change", (e) => {
        setOverlayPosition(0, e.target.value);
      });
    }
  };

  // Set selected image
  const setSelectedImage = (imageElement) => {
    selectedImage = imageElement;
    createOverlay();
  };

  // Initialize the overlay controls
  const init = (imageElement) => {
    setSelectedImage(imageElement);
    initEventListeners();
  };

  return {
    init,
    setSelectedImage,
    toggleOverlayVisibility,
    setOverlayColor,
    setOverlayDimensions,
    setOverlayPosition,
  };
};
