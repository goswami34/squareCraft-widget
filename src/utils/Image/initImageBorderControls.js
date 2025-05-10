export function initImageBorderControls(selectedElement) {
  const allButton = document.getElementById("allBorder");
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

  let activeBorderType = "all";
  let allBorderWidth = 0;
  let topBorderWidth = 0;
  let isDragging = false;

  function updateSliderPosition(width) {
    const maxWidth = 100;
    const percent = (width / maxWidth) * 100;
    const sliderWidth = borderWidthSlider.offsetWidth;
    const newPosition = (percent / 100) * sliderWidth;

    borderWidthBullet.style.left = `${newPosition}px`;
    borderWidthBullet.style.transform = "translateX(-50%)";
    borderWidthFill.style.width = `${newPosition}px`;
    borderWidthDisplay.textContent = `${width}px`;
  }

  function handleDrag(e) {
    if (!isDragging && e.type !== "click") return;

    const imageContent = document.querySelector(".sc-selected-image");
    if (!imageContent) return;

    const blockElement = imageContent.closest('[id^="block-"]');
    if (!blockElement) return;

    const blockId = blockElement.id;
    const selector = `#${blockId} div.sqs-image-content`;

    const rect = borderWidthSlider.getBoundingClientRect();
    const clientX = e.clientX || e.touches?.[0]?.clientX;
    let offsetX = clientX - rect.left;

    const max = borderWidthSlider.offsetWidth;
    const bulletRadius = borderWidthBullet.offsetWidth / 2;
    offsetX = Math.max(bulletRadius, Math.min(offsetX, max - bulletRadius));

    const percent = offsetX / max;
    const borderWidth = Math.round(percent * 100);

    updateSliderPosition(borderWidth);

    let styleElement = document.getElementById("sc-image-border-style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "sc-image-border-style";
      document.head.appendChild(styleElement);
      styleElement.textContent = "";
    }

    const currentCSS = styleElement.textContent;
    const blockRegex = new RegExp(`${selector}\\s*{([\\s\\S]*?)}`, "g");
    const match = blockRegex.exec(currentCSS);

    if (activeBorderType === "all") {
      allBorderWidth = borderWidth;
      const css = `
  ${selector} {
    border-width: ${allBorderWidth}px;
    box-sizing: border-box;
    border-style: solid;
    border-color: red;
  }`;
      styleElement.textContent = css;
      return;
    }

    if (activeBorderType === "top") {
      topBorderWidth = borderWidth;

      let newCSS;
      if (match) {
        // Extract existing styles
        let existingBlock = match[1];

        // Keep the original border-width if it exists
        const borderWidthMatch = existingBlock.match(/border-width:\s*(\d+)px/);
        const originalBorderWidth = borderWidthMatch
          ? borderWidthMatch[1]
          : allBorderWidth;

        // Remove any previous border-top-width
        existingBlock = existingBlock
          .replace(/border-top-width\s*:\s*[^;]+;?/g, "")
          .trim();

        // Create new block content with preserved border-width
        const newBlockContent = `
    border-width: ${originalBorderWidth}px;
    border-top-width: ${topBorderWidth}px !important;
    box-sizing: border-box;
    border-style: solid;
    border-color: red;`;

        // Combine existing + new styles
        newCSS = currentCSS.replace(
          blockRegex,
          `${selector} {\n  ${newBlockContent}\n}`
        );
      } else {
        // Create new block with both border-width and border-top-width
        newCSS =
          currentCSS +
          `
${selector} {
  border-width: ${allBorderWidth}px;
  border-top-width: ${topBorderWidth}px !important;
  box-sizing: border-box;
  border-style: solid;
  border-color: red;
}`;
      }

      styleElement.textContent = newCSS;
    }
  }

  function startDrag(e) {
    e.preventDefault();
    isDragging = true;
    document.addEventListener("mousemove", handleDrag);
    document.addEventListener("mouseup", stopDrag);
    document.addEventListener("touchmove", handleDrag);
    document.addEventListener("touchend", stopDrag);
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", handleDrag);
    document.removeEventListener("touchend", stopDrag);
  }

  allButton.addEventListener("click", () => {
    activeBorderType = "all";

    const initial = 5;
    allBorderWidth = initial;
    updateSliderPosition(initial);

    const fakeEvent = {
      type: "click",
      clientX:
        borderWidthSlider.getBoundingClientRect().left +
        (initial / 100) * borderWidthSlider.offsetWidth,
    };
    handleDrag(fakeEvent);
  });

  topButton.addEventListener("click", () => {
    activeBorderType = "top";

    const sliderWidth = borderWidthSlider.offsetWidth;
    const currentLeft = parseFloat(borderWidthBullet.style.left) || 0;
    const width = Math.round((currentLeft / sliderWidth) * 100);

    topBorderWidth = width;
    updateSliderPosition(width);

    const fakeEvent = {
      type: "click",
      clientX:
        borderWidthSlider.getBoundingClientRect().left +
        (width / 100) * sliderWidth,
    };
    handleDrag(fakeEvent);
  });

  borderWidthBullet.addEventListener("mousedown", startDrag);
  borderWidthBullet.addEventListener("touchstart", startDrag);

  document.addEventListener("click", (e) => {
    const imageContent = e.target.closest(".sqs-image-content");
    if (imageContent) {
      document.querySelectorAll(".sqs-image-content").forEach((img) => {
        img.classList.remove("sc-selected-image");
      });
      imageContent.classList.add("sc-selected-image");
    }
  });
}
