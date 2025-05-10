// export function initImageBorderControls(selectedElement) {
//   const allButton = document.getElementById("allBorder");
//   const topButton = document.getElementById("topBorder");
//   const borderWidthSlider = document.getElementById("radiousField");
//   const borderWidthBullet = document.getElementById("radiousBullet");
//   const borderWidthFill = document.getElementById("radiousFill");
//   const borderWidthDisplay = document.getElementById("radiousCount");

//   if (
//     !allButton ||
//     !topButton ||
//     !borderWidthSlider ||
//     !borderWidthBullet ||
//     !borderWidthFill ||
//     !borderWidthDisplay
//   )
//     return;

//   // let activeBorderType = "all";
//   // window.__scActiveBorderType = "all";
//   if (!window.__scActiveBorderType) window.__scActiveBorderType = "all";
//   let allBorderWidth = 0;
//   let topBorderWidth = 0;

//   function updateStyleElement(blockId, borderWidth) {
//     let styleElement = document.getElementById("sc-image-border-style");
//     if (!styleElement) {
//       styleElement = document.createElement("style");
//       styleElement.id = "sc-image-border-style";
//       document.head.appendChild(styleElement);
//     }

//     const blockSelector = `#${blockId} div.sqs-image-content`;
//     let currentCSS = styleElement.textContent;

//     if (window.__scActiveBorderType === "all") {
//       allBorderWidth = borderWidth;

//       if (!currentCSS.includes(blockSelector)) {
//         currentCSS += `
//     ${blockSelector} {
//       border-width: ${allBorderWidth}px;
//       box-sizing: border-box;
//       border-style: solid;
//       border-color: red;
//     }`;
//       } else {
//         currentCSS = currentCSS.replace(
//           new RegExp(`${blockSelector}\\s*{[^}]*?border-width:\\s*[^;]+;`, "g"),
//           `${blockSelector} {\n  border-width: ${allBorderWidth}px;`
//         );
//       }

//       styleElement.textContent = currentCSS;
//     }

//     if (window.__scActiveBorderType === "top") {
//       topBorderWidth = borderWidth;

//       if (!currentCSS.includes(blockSelector)) {
//         currentCSS += `
//         ${blockSelector} {
//           border-top-width: ${topBorderWidth}px !important;
//           box-sizing: border-box;
//           border-style: solid;
//           border-color: red;
//         }`;
//       } else if (currentCSS.includes("border-top-width")) {
//         currentCSS = currentCSS.replace(
//           new RegExp(
//             `(${blockSelector}\\s*{[^}]*?)border-top-width:\\s*[^;]+;`,
//             "g"
//           ),
//           `$1border-top-width: ${topBorderWidth}px !important;`
//         );
//       } else {
//         currentCSS = currentCSS.replace(
//           new RegExp(`${blockSelector}\\s*{`),
//           `${blockSelector} {\n  border-top-width: ${topBorderWidth}px !important;`
//         );
//       }

//       // ❗ DO NOT modify or re-render border-width here
//       styleElement.textContent = currentCSS;
//     }
//   }

//   function updateSliderPosition(width) {
//     const maxWidth = 100;
//     const percent = (width / maxWidth) * 100;
//     const sliderWidth = borderWidthSlider.offsetWidth;
//     const newPosition = (percent / 100) * sliderWidth;

//     borderWidthBullet.style.left = `${newPosition}px`;
//     borderWidthBullet.style.transform = "translateX(-50%)";
//     borderWidthFill.style.width = `${newPosition}px`;
//     borderWidthDisplay.textContent = `${width}px`;
//   }

//   allButton.addEventListener("click", () => {
//     console.log("allButton clicked");
//     window.__scActiveBorderType = "all";

//     const imageContent = document.querySelector(".sc-selected-image");
//     if (!imageContent) return;

//     const blockElement = imageContent.closest('[id^="block-"]');
//     if (!blockElement) return;

//     const blockId = blockElement.id;
//     const initialBorderWidth = 5;

//     allBorderWidth = initialBorderWidth;
//     updateStyleElement(blockId, initialBorderWidth);
//     updateSliderPosition(initialBorderWidth);
//   });

//   topButton.addEventListener("click", () => {
//     console.log("topButton clicked");
//     window.__scActiveBorderType = "top";

//     const imageContent = document.querySelector(".sc-selected-image");
//     if (!imageContent) return;

//     const blockElement = imageContent.closest('[id^="block-"]');
//     if (!blockElement) return;

//     const blockId = blockElement.id;

//     const currentPosition = parseFloat(borderWidthBullet.style.left) || 0;
//     const max = borderWidthSlider.offsetWidth;
//     const currentWidth = Math.round((currentPosition / max) * 100);

//     topBorderWidth = currentWidth;

//     if (allBorderWidth === 0) {
//       allBorderWidth = currentWidth;
//     }

//     updateStyleElement(blockId, topBorderWidth);
//     updateSliderPosition(topBorderWidth);
//   });

//   let isDragging = false;

//   function startDrag(e) {
//     e.preventDefault();
//     isDragging = true;
//     document.addEventListener("mousemove", handleDrag);
//     document.addEventListener("mouseup", stopDrag);
//     document.addEventListener("touchmove", handleDrag);
//     document.addEventListener("touchend", stopDrag);
//   }

//   function handleDrag(e) {
//     if (!isDragging) return;

//     const imageContent = document.querySelector(".sc-selected-image");
//     if (!imageContent) return;

//     const blockElement = imageContent.closest('[id^="block-"]');
//     if (!blockElement) return;

//     const blockId = blockElement.id;
//     const blockSelector = `#${blockId} div.sqs-image-content`;

//     const rect = borderWidthSlider.getBoundingClientRect();
//     const clientX = e.clientX || e.touches?.[0]?.clientX;
//     let offsetX = clientX - rect.left;

//     const max = borderWidthSlider.offsetWidth;
//     const bulletRadius = borderWidthBullet.offsetWidth / 2;
//     offsetX = Math.max(bulletRadius, Math.min(offsetX, max - bulletRadius));

//     const percent = offsetX / max;
//     const borderWidth = Math.round(percent * 100);

//     // Update UI
//     borderWidthBullet.style.left = `${offsetX}px`;
//     borderWidthBullet.style.transform = "translateX(-50%)";
//     borderWidthFill.style.width = `${offsetX}px`;
//     borderWidthDisplay.textContent = `${borderWidth}px`;

//     let styleElement = document.getElementById("sc-image-border-style");
//     if (!styleElement) {
//       styleElement = document.createElement("style");
//       styleElement.id = "sc-image-border-style";
//       document.head.appendChild(styleElement);
//       styleElement.textContent = "";
//     }

//     let currentCSS = styleElement.textContent;

//     console.log(window.__scActiveBorderType);

//     // === ALL BORDER ===
//     if (window.__scActiveBorderType === "all") {
//       allBorderWidth = borderWidth;

//       // Replace or insert full block with border-width
//       if (!currentCSS.includes(blockSelector)) {
//         currentCSS += `
//   ${blockSelector} {
//     border-width: ${allBorderWidth}px;
//     box-sizing: border-box;
//     border-style: solid;
//     border-color: red;
//   }`;
//       } else {
//         currentCSS = currentCSS.replace(
//           new RegExp(
//             `(${blockSelector}\\s*{[^}]*?)border-width:\\s*[^;]+;`,
//             "g"
//           ),
//           `$1border-width: ${allBorderWidth}px;`
//         );
//       }

//       styleElement.textContent = currentCSS;
//       return;
//     }

//     // === TOP BORDER ONLY ===
//     if (window.__scActiveBorderType === "top") {
//       topBorderWidth = borderWidth;

//       // Match the existing block
//       const blockRegex = new RegExp(
//         `(${blockSelector}\\s*{)([\\s\\S]*?)(})`,
//         "g"
//       );
//       const match = blockRegex.exec(currentCSS);

//       if (match) {
//         // Update inside existing block
//         let declarations = match[2];

//         // Remove existing border-top-width
//         declarations = declarations
//           .replace(/border-top-width\s*:\s*[^;]+;?/g, "")
//           .trim();

//         // Keep other properties (including border-width) intact
//         const updatedBlock = `${match[1]}\n  ${declarations}\n  border-top-width: ${topBorderWidth}px !important;\n${match[3]}`;

//         currentCSS = currentCSS.replace(blockRegex, updatedBlock);
//       } else {
//         // If block doesn't exist, create a new one with only border-top-width
//         currentCSS += `
//   ${blockSelector} {
//     border-top-width: ${topBorderWidth}px !important;
//     box-sizing: border-box;
//     border-style: solid;
//     border-color: red;
//   }`;
//       }

//       styleElement.textContent = currentCSS;
//     }
//   }

//   function stopDrag() {
//     isDragging = false;
//     document.removeEventListener("mousemove", handleDrag);
//     document.removeEventListener("mouseup", stopDrag);
//     document.removeEventListener("touchmove", handleDrag);
//     document.removeEventListener("touchend", stopDrag);
//   }

//   borderWidthBullet.addEventListener("mousedown", startDrag);
//   borderWidthBullet.addEventListener("touchstart", startDrag);

//   document.addEventListener("click", (e) => {
//     const imageContent = e.target.closest(".sqs-image-content");
//     if (imageContent) {
//       document.querySelectorAll(".sqs-image-content").forEach((img) => {
//         img.classList.remove("sc-selected-image");
//       });
//       imageContent.classList.add("sc-selected-image");
//     }
//   });
// }

// SquareCraft Image Border Controls
export function initImageBorderControls(selectedElement) {
  const allButton = document.getElementById("allBorder");
  const topButton = document.getElementById("topBorder");
  const bottomButton = document.getElementById("bottomBorder");
  const leftButton = document.getElementById("leftBorder");
  const rightButton = document.getElementById("rightBorder");
  const borderWidthSlider = document.getElementById("radiousField");
  const borderWidthBullet = document.getElementById("radiousBullet");
  const borderWidthFill = document.getElementById("radiousFill");
  const borderWidthDisplay = document.getElementById("radiousCount");

  if (
    !allButton ||
    !topButton ||
    !bottomButton ||
    !leftButton ||
    !rightButton ||
    !borderWidthSlider ||
    !borderWidthBullet ||
    !borderWidthFill ||
    !borderWidthDisplay
  )
    return;

  if (!window.__scActiveBorderType) window.__scActiveBorderType = "all";

  let allBorderWidth = 0;
  let topBorderWidth = 0;
  let bottomBorderWidth = 0;
  let leftBorderWidth = 0;
  let rightBorderWidth = 0;

  //use for highlight active border button
  const borderButtons = [
    allButton,
    topButton,
    bottomButton,
    leftButton,
    rightButton,
  ];

  function setActiveBorderButton(activeBtn) {
    borderButtons.forEach((btn) => {
      btn.classList.remove("sc-bg-color-#454545");
    });
    activeBtn.classList.add("sc-bg-color-#454545");
  }

  //end of use for highlight active border button

  // function setupButton(button, type) {
  //   button.addEventListener("click", () => {
  //     console.log(`${type} button clicked`);
  //     window.__scActiveBorderType = type;

  //     setActiveBorderButton(button); // highlight active

  //     const imageContent = document.querySelector(".sc-selected-image");
  //     if (!imageContent) return;

  //     const blockElement = imageContent.closest('[id^="block-"]');
  //     if (!blockElement) return;

  //     const blockId = blockElement.id;

  //     const currentPosition = parseFloat(borderWidthBullet.style.left) || 0;
  //     const max = borderWidthSlider.offsetWidth;
  //     const currentWidth = Math.round((currentPosition / max) * 100);

  //     updateStyleElement(blockId, currentWidth);
  //     updateSliderPosition(currentWidth);
  //   });
  // }

  function updateStyleElement(blockId, borderWidth) {
    let styleElement = document.getElementById("sc-image-border-style");
    if (!styleElement) {
      styleElement = document.createElement("style");
      styleElement.id = "sc-image-border-style";
      document.head.appendChild(styleElement);
    }

    const blockSelector = `#${blockId} div.sqs-image-content`;
    let currentCSS = styleElement.textContent;

    const sideMap = {
      top: "border-top-width",
      bottom: "border-bottom-width",
      left: "border-left-width",
      right: "border-right-width",
    };

    if (window.__scActiveBorderType === "all") {
      allBorderWidth = borderWidth;

      if (!currentCSS.includes(blockSelector)) {
        currentCSS += `
  ${blockSelector} {
    border-width: ${allBorderWidth}px;
    box-sizing: border-box;
    border-style: solid;
    border-color: red;
  }`;
      } else {
        currentCSS = currentCSS.replace(
          new RegExp(
            `(${blockSelector}\\s*{[^}]*?)border-width:\\s*[^;]+;`,
            "g"
          ),
          `$1border-width: ${allBorderWidth}px;`
        );
      }

      styleElement.textContent = currentCSS;
      return;
    }

    const property = sideMap[window.__scActiveBorderType];
    if (!property) return;

    const widthVar = borderWidth;
    if (window.__scActiveBorderType === "top") topBorderWidth = widthVar;
    if (window.__scActiveBorderType === "bottom") bottomBorderWidth = widthVar;
    if (window.__scActiveBorderType === "left") leftBorderWidth = widthVar;
    if (window.__scActiveBorderType === "right") rightBorderWidth = widthVar;

    const blockRegex = new RegExp(
      `(${blockSelector}\\s*{)([\\s\\S]*?)(})`,
      "g"
    );
    const match = blockRegex.exec(currentCSS);

    if (match) {
      let declarations = match[2];
      declarations = declarations
        .replace(new RegExp(`${property}\\s*:\\s*[^;]+;?`, "g"), "")
        .trim();
      declarations += `\n  ${property}: ${widthVar}px !important;`;
      const updatedBlock = `${match[1]}\n  ${declarations}\n${match[3]}`;
      currentCSS = currentCSS.replace(blockRegex, updatedBlock);
    } else {
      currentCSS += `
  ${blockSelector} {
    ${property}: ${widthVar}px !important;
    box-sizing: border-box;
    border-style: solid;
    border-color: red;
  }`;
    }

    styleElement.textContent = currentCSS;
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

  function setupButton(button, type) {
    button.addEventListener("click", () => {
      console.log(`${type} button clicked`);
      window.__scActiveBorderType = type;

      setActiveBorderButton(button);

      const imageContent = document.querySelector(".sc-selected-image");
      if (!imageContent) return;

      const blockElement = imageContent.closest('[id^="block-"]');
      if (!blockElement) return;

      const blockId = blockElement.id;

      const currentPosition = parseFloat(borderWidthBullet.style.left) || 0;
      const max = borderWidthSlider.offsetWidth;
      const currentWidth = Math.round((currentPosition / max) * 100);

      updateStyleElement(blockId, currentWidth);
      updateSliderPosition(currentWidth);
    });
  }

  setupButton(allButton, "all");
  setupButton(topButton, "top");
  setupButton(bottomButton, "bottom");
  setupButton(leftButton, "left");
  setupButton(rightButton, "right");

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

    updateStyleElement(blockElement.id, borderWidth);
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
