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

  function updateStyleElement(blockId, borderWidth) {
    let styleElement = document.getElementById("sc-image-border-style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "sc-image-border-style";
      document.head.appendChild(styleElement);
    }

    let css = "";
    if (activeBorderType === "all") {
      allBorderWidth = borderWidth;
      css = `
        #${blockId} div.sqs-image-content {
          border-width: ${borderWidth}px;
          box-sizing: border-box;
          border-style: solid;
          border-color: red;
        }
      `;
    } else if (activeBorderType === "top") {
      topBorderWidth = borderWidth;
      css = `
        #${blockId} div.sqs-image-content {
          border-width: ${allBorderWidth}px;
          border-top-width: ${topBorderWidth}px !important;
          box-sizing: border-box;
          border-style: solid;
          border-color: red;
        }
      `;
    }

    styleElement.textContent = css;
  }

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

  allButton.addEventListener("click", () => {
    console.log("allButton clicked");
    activeBorderType = "all";

    const imageContent = document.querySelector(".sc-selected-image");
    if (!imageContent) return;

    const blockElement = imageContent.closest('[id^="block-"]');
    if (!blockElement) return;

    const blockId = blockElement.id;
    const initialBorderWidth = 5;

    allBorderWidth = initialBorderWidth;
    updateStyleElement(blockId, initialBorderWidth);
    updateSliderPosition(initialBorderWidth);
  });

  topButton.addEventListener("click", () => {
    console.log("topButton clicked");
    activeBorderType = "top";

    const imageContent = document.querySelector(".sc-selected-image");
    if (!imageContent) return;

    const blockElement = imageContent.closest('[id^="block-"]');
    if (!blockElement) return;

    const blockId = blockElement.id;

    const currentPosition = parseFloat(borderWidthBullet.style.left) || 0;
    const max = borderWidthSlider.offsetWidth;
    const currentWidth = Math.round((currentPosition / max) * 100);

    topBorderWidth = currentWidth;

    if (allBorderWidth === 0) {
      allBorderWidth = currentWidth;
    }

    updateStyleElement(blockId, topBorderWidth);
    updateSliderPosition(topBorderWidth);
  });

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

    const max = borderWidthSlider.offsetWidth;
    const bulletRadius = borderWidthBullet.offsetWidth / 2;
    offsetX = Math.max(bulletRadius, Math.min(offsetX, max - bulletRadius));

    const percent = offsetX / max;
    const borderWidth = Math.round(percent * 100);

    borderWidthBullet.style.left = `${offsetX}px`;
    borderWidthBullet.style.transform = "translateX(-50%)";
    borderWidthFill.style.width = `${offsetX}px`;
    borderWidthDisplay.textContent = `${borderWidth}px`;

    let styleElement = document.getElementById("sc-image-border-style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "sc-image-border-style";
      document.head.appendChild(styleElement);
    }

    let currentCSS = styleElement.textContent;

    const blockSelector = `#${blockId} div.sqs-image-content`;

    if (activeBorderType === "all") {
      allBorderWidth = borderWidth;

      const allRule = `
  ${blockSelector} {
    border-width: ${allBorderWidth}px;
    box-sizing: border-box;
    border-style: solid;
    border-color: red;
  }
  `;

      // Replace or add the all-border rule
      if (currentCSS.includes(blockSelector)) {
        currentCSS = currentCSS.replace(
          new RegExp(`${blockSelector}\\s*{[^}]*}`, "g"),
          allRule.trim()
        );
      } else {
        currentCSS += allRule;
      }

      styleElement.textContent = currentCSS;
    }

    if (activeBorderType === "top") {
      topBorderWidth = borderWidth;

      const topLine = `border-top-width: ${topBorderWidth}px !important;`;

      if (currentCSS.includes(blockSelector)) {
        // Replace border-top-width line only (or add it if missing)
        if (currentCSS.includes("border-top-width")) {
          currentCSS = currentCSS.replace(
            new RegExp(
              `(${blockSelector}\\s*{[^}]*?)border-top-width:\\s*[^;]+;`,
              "g"
            ),
            `$1${topLine}`
          );
        } else {
          currentCSS = currentCSS.replace(
            new RegExp(`${blockSelector}\\s*{`),
            `${blockSelector} {\n  ${topLine}`
          );
        }
      } else {
        // No existing rule: create new
        currentCSS += `
  ${blockSelector} {
    border-width: ${allBorderWidth}px;
    ${topLine}
    box-sizing: border-box;
    border-style: solid;
    border-color: red;
  }
  `;
      }

      styleElement.textContent = currentCSS;
    }
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", handleDrag);
    document.removeEventListener("touchend", stopDrag);
  }

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
