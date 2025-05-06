export function initImageBorderControls(selectedElement) {
  const allButton = document.getElementById("allBorder");
  const topButton = document.getElementById("topBorder");
  const borderWidthSlider = document.getElementById("radiousField");
  const borderWidthBullet = document.getElementById("radiousBullet");
  const borderWidthFill = document.getElementById("radiousFill");
  const borderWidthValue = document.getElementById("radiousCount");

  if (
    !allButton ||
    !topButton ||
    !borderWidthSlider ||
    !borderWidthBullet ||
    !borderWidthFill ||
    !borderWidthValue
  ) {
    console.error("❌ Required elements not found");
    return;
  }

  let activeBorderType = "all"; // Track active border type
  let currentBorderWidth = 0; // Store current border width
  let currentBorderStyle = "solid"; // Store current border style
  let currentBorderColor = "red"; // Store current border color

  function updateStyleElement(blockId, borderWidth) {
    const styleId = `style-${blockId}`;
    let styleElement = document.getElementById(styleId);

    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = styleId;
      document.head.appendChild(styleElement);
    }

    // Base CSS properties that should always be present
    const baseCSS = `
      #${blockId} div.sqs-image-content {
        box-sizing: border-box;
        border-style: ${currentBorderStyle};
        border-color: ${currentBorderColor};
    `;

    // Add specific border width based on active type
    if (activeBorderType === "all") {
      styleElement.innerHTML = `${baseCSS}
        border-width: ${borderWidth}px;
      }`;
    } else if (activeBorderType === "top") {
      styleElement.innerHTML = `${baseCSS}
        border-width: ${currentBorderWidth}px;
        border-top-width: ${borderWidth}px;
      }`;
    }
  }

  function updateSliderPosition(width) {
    const maxWidth = borderWidthSlider.offsetWidth;
    const bulletRadius = borderWidthBullet.offsetWidth / 2;
    const position = Math.max(
      bulletRadius,
      Math.min(width, maxWidth - bulletRadius)
    );

    borderWidthBullet.style.left = `${position}px`;
    borderWidthBullet.style.transform = "translateX(-50%)";
    borderWidthFill.style.width = `${position}px`;
    borderWidthValue.textContent = `${width}px`;
  }

  function startDrag(e) {
    e.preventDefault();
    const moveHandler = (moveEvent) => {
      const clientX = moveEvent.clientX || moveEvent.touches?.[0]?.clientX;
      if (clientX) {
        const rect = borderWidthSlider.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const maxWidth = borderWidthSlider.offsetWidth;
        const bulletRadius = borderWidthBullet.offsetWidth / 2;
        const position = Math.max(
          bulletRadius,
          Math.min(offsetX, maxWidth - bulletRadius)
        );
        const width = Math.round((position / maxWidth) * 100);

        updateSliderPosition(width);
        updateStyleElement(selectedElement.id, width);
      }
    };

    const stopHandler = () => {
      document.removeEventListener("mousemove", moveHandler);
      document.removeEventListener("mouseup", stopHandler);
      document.removeEventListener("touchmove", moveHandler);
      document.removeEventListener("touchend", stopHandler);
    };

    document.addEventListener("mousemove", moveHandler);
    document.addEventListener("mouseup", stopHandler);
    document.addEventListener("touchmove", moveHandler);
    document.addEventListener("touchend", stopHandler);
  }

  borderWidthBullet.addEventListener("mousedown", startDrag);
  borderWidthBullet.addEventListener("touchstart", startDrag);

  // Click handler for "All" button
  allButton.addEventListener("click", () => {
    activeBorderType = "all";
    // Store current border width before switching
    currentBorderWidth = parseInt(borderWidthValue.textContent) || 0;
    // Apply the current border width to all sides
    updateStyleElement(selectedElement.id, currentBorderWidth);
    updateSliderPosition(currentBorderWidth);
  });

  // Click handler for "Top" button
  topButton.addEventListener("click", () => {
    activeBorderType = "top";
    // Store current border width before switching
    currentBorderWidth = parseInt(borderWidthValue.textContent) || 0;
    // Apply the current border width to all sides and top
    updateStyleElement(selectedElement.id, currentBorderWidth);
    updateSliderPosition(currentBorderWidth);
  });

  // Initialize with default values
  const initialWidth = 0;
  updateSliderPosition(initialWidth);
  updateStyleElement(selectedElement.id, initialWidth);
}
