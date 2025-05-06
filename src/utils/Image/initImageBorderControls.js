export function initImageBorderControls(selectedElement) {
  const allButton = document.getElementById("allBorder");
  // const topButton = document.querySelector(
  //   'img[alt="top-radious"]'
  // ).parentElement;
  const topButton = document.getElementById("topBorder");
  const borderWidthSlider = document.getElementById("radiousField");
  const borderWidthBullet = document.getElementById("radiousBullet");
  const borderWidthFill = document.getElementById("radiousFill");
  const borderWidthDisplay = document.getElementById("radiousCount");

  if (
    !allButton ||
    !topButton ||
    !borderWidthSlider ||
    !borderWidthBullet ||
    !borderWidthFill ||
    !borderWidthDisplay
  )
    return;

  let activeBorderType = "all"; // Track which border type is active

  // Function to create or update style element
  function updateStyleElement(blockId, borderWidth) {
    let styleElement = document.getElementById("sc-image-border-style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "sc-image-border-style";
      document.head.appendChild(styleElement);
    }

    let css = "";
    if (activeBorderType === "all") {
      css = `
        #${blockId} div.sqs-image-content {
          border-width: ${borderWidth}px;
          box-sizing: border-box;
          border-style: solid;
          border-color: red;
        }
      `;
    } else if (activeBorderType === "top") {
      css = `
        #${blockId} div.sqs-image-content {
          border-width: ${borderWidth}px;
          box-sizing: border-box;
          border-style: solid;
          border-color: red;
          border-top-width: ${borderWidth}px !important;
        }
      `;
    }
    styleElement.textContent = css;
  }

  // Function to update slider position based on border width
  function updateSliderPosition(width) {
    const maxWidth = 100; // Maximum border width
    const percent = (width / maxWidth) * 100;
    const sliderWidth = borderWidthSlider.offsetWidth;
    const newPosition = (percent / 100) * sliderWidth;

    borderWidthBullet.style.left = `${newPosition}px`;
    borderWidthBullet.style.transform = "translateX(-50%)";
    borderWidthFill.style.width = `${newPosition}px`;
    borderWidthDisplay.textContent = `${width}px`;
  }

  // Handle All button click
  allButton.addEventListener("click", () => {
    console.log("allButton clicked");
    activeBorderType = "all";

    // Find the selected image content
    const imageContent = document.querySelector(".sc-selected-image");
    if (!imageContent) {
      console.log("No image selected");
      return;
    }

    // Get the block ID
    const blockElement = imageContent.closest('[id^="block-"]');
    if (!blockElement) {
      console.log("No block element found");
      return;
    }

    const blockId = blockElement.id;
    const initialBorderWidth = 5;

    // Apply initial border using external CSS
    updateStyleElement(blockId, initialBorderWidth);

    // Update slider to match current border width
    updateSliderPosition(initialBorderWidth);
  });

  // Handle Top button click
  topButton.addEventListener("click", () => {
    console.log("topButton clicked");
    activeBorderType = "top";

    // Find the selected image content
    const imageContent = document.querySelector(".sc-selected-image");
    if (!imageContent) {
      console.log("No image selected");
      return;
    }

    // Get the block ID
    const blockElement = imageContent.closest('[id^="block-"]');
    if (!blockElement) {
      console.log("No block element found");
      return;
    }

    const blockId = blockElement.id;
    const initialBorderWidth = 5;

    // Apply initial border using external CSS
    updateStyleElement(blockId, initialBorderWidth);

    // Update slider to match current border width
    updateSliderPosition(initialBorderWidth);
  });

  // Handle slider movement
  let isDragging = false;

  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("touchend", stopDrag);
  }

  function handleDrag(e) {
    if (!isDragging) return;

    const imageContent = document.querySelector(".sc-selected-image");
    if (!imageContent) return;

    const blockElement = imageContent.closest('[id^="block-"]');
    if (!blockElement) return;

    const blockId = blockElement.id;

    const rect = borderWidthSlider.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    let offsetX = clientX - rect.left;

    // Constrain to slider bounds
    const max = borderWidthSlider.offsetWidth;
    const bulletRadius = borderWidthBullet.offsetWidth / 2;
    offsetX = Math.max(bulletRadius, Math.min(offsetX, max - bulletRadius));

    // Calculate border width (0-100px)
    const percent = offsetX / max;
    const borderWidth = Math.round(percent * 100);

    // Update slider UI
    borderWidthBullet.style.left = `${offsetX}px`;
    borderWidthBullet.style.transform = "translateX(-50%)";
    borderWidthFill.style.width = `${offsetX}px`;
    borderWidthDisplay.textContent = `${borderWidth}px`;

    // Update image border using external CSS
    updateStyleElement(blockId, borderWidth);
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", handleDrag);
    document.removeEventListener("touchend", stopDrag);
  }

  // Add event listeners
  borderWidthBullet.addEventListener("mousedown", startDrag);
  borderWidthBullet.addEventListener("touchstart", startDrag);

  // Add click event listener to handle image selection
  document.addEventListener("click", (e) => {
    const imageContent = e.target.closest(".sqs-image-content");
    if (imageContent) {
      console.log("Image selected:", imageContent);
      // Remove selection from other images
      document.querySelectorAll(".sqs-image-content").forEach((img) => {
        img.classList.remove("sc-selected-image");
      });
      // Add selection to clicked image
      imageContent.classList.add("sc-selected-image");
    }
  });
}
