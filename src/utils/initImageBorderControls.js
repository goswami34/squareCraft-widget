export function initImageBorderControls(selectedElement) {
  const allButton = document.getElementById("allRadious");
  const borderWidthSlider = document.getElementById("radiousField");
  const borderWidthBullet = document.getElementById("radiousBullet");
  const borderWidthFill = document.getElementById("radiousFill");
  const borderWidthDisplay = document.getElementById("radiousCount");

  if (
    !allButton ||
    !borderWidthSlider ||
    !borderWidthBullet ||
    !borderWidthFill ||
    !borderWidthDisplay
  )
    return;

  // Handle All button click
  allButton.addEventListener("click", () => {
    console.log("allButton clicked");

    // Find the selected image content
    const imageContent = document.querySelector(".sqs-image-content");
    if (!imageContent) {
      console.log("No image content found");
      return;
    }

    // Apply initial border
    imageContent.style.borderWidth = "5px";
    imageContent.style.borderStyle = "solid";
    imageContent.style.boxSizing = "border-box";
    imageContent.style.borderColor = "red";

    // Update slider to match current border width
    const currentWidth = parseInt(imageContent.style.borderWidth) || 5;
    updateSliderPosition(currentWidth);
  });

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

    const imageContent = document.querySelector(".sqs-image-content");
    if (!imageContent) return;

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

    // Update image border
    imageContent.style.borderWidth = `${borderWidth}px`;
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
