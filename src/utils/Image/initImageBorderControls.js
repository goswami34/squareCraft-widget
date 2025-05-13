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

  // color selection start here
  const colorCodeEl = document.getElementById("color-code");
  const palette = document.getElementById("color-palette");
  const borderColorSelect = document.getElementById("border-color-select");

  borderColorSelect?.addEventListener("click", () => {
    palette?.classList.toggle("sc-hidden");
  });

  let selectedBorderColor = null; // default

  //color selection end here

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
      btn.classList.remove(
        "sc-bg-454545",
        "sc-blur-sm",
        "sc-pointer-events-none"
      );
    });
    activeBtn.classList.add("sc-bg-454545");

    //all button bloor

    if (activeBtn !== allButton) {
      allButton.classList.add("sc-blur-sm", "sc-pointer-events-none");
    } else {
      allButton.classList.remove("sc-blur-sm", "sc-pointer-events-none");
    }
  }

  //end of use for highlight active border button

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
    ${selectedBorderColor ? `border-color: ${selectedBorderColor};` : ""}

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
    border-color: ${newColor} !important;
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

  //color selection start here

  const colorCode = document.getElementById("color-code");
  if (colorCode) {
    const observer = new MutationObserver(() => {
      const newColor = colorCode.textContent.trim();
      if (!newColor || newColor.toLowerCase() === "select") return;

      selectedBorderColor = newColor;

      const selected = document.querySelector(".sc-selected-image");
      if (!selected) return;

      const block = selected.closest('[id^="block-"]');
      if (!block) return;

      const blockSelector = `#${block.id} div.sqs-image-content`;
      let styleTag = document.getElementById("sc-image-border-style");
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "sc-image-border-style";
        document.head.appendChild(styleTag);
      }

      let currentCSS = styleTag.textContent;

      // Replace or append `border-color`
      const blockRegex = new RegExp(
        `(${blockSelector}\\s*{)([\\s\\S]*?)(})`,
        "g"
      );
      const match = blockRegex.exec(currentCSS);
      if (match) {
        let declarations = match[2]
          .replace(/border-color\s*:\s*[^;]+;?/g, "")
          .trim();
        declarations += `\n  border-color: ${newColor} !important;`;
        const updated = `${match[1]}\n  ${declarations}\n${match[3]}`;
        currentCSS = currentCSS.replace(blockRegex, updated);
      } else {
        currentCSS += `
${blockSelector} {
  border-color: ${newColor} !important;
}`;
      }

      styleTag.textContent = currentCSS;
    });

    observer.observe(colorCode, { childList: true });
  }

  //color selection end here

  //border style start here
  document
    .getElementById("borderStyleSolid")
    ?.addEventListener("click", () => applyBorderStyle("solid"));
  document
    .getElementById("borderStyleDashed")
    ?.addEventListener("click", () => applyBorderStyle("dashed"));
  document
    .getElementById("borderStyleDotted")
    ?.addEventListener("click", () => applyBorderStyle("dotted"));

  function applyBorderStyle(style) {
    const selected = document.querySelector(".sc-selected-image");
    if (!selected) return;

    const block = selected.closest('[id^="block-"]');
    if (!block) return;

    const blockSelector = `#${block.id} div.sqs-image-content`;
    let styleTag = document.getElementById("sc-image-border-style");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "sc-image-border-style";
      document.head.appendChild(styleTag);
    }

    let currentCSS = styleTag.textContent;

    const blockRegex = new RegExp(
      `(${blockSelector}\\s*{)([\\s\\S]*?)(})`,
      "g"
    );
    const match = blockRegex.exec(currentCSS);

    if (match) {
      let declarations = match[2]
        .replace(/border-style\s*:\s*[^;]+;?/g, "")
        .trim();
      declarations += `\n  border-style: ${style}`;
      const updated = `${match[1]}\n  ${declarations}\n${match[3]}`;
      currentCSS = currentCSS.replace(blockRegex, updated);
    } else {
      currentCSS += `
      ${blockSelector} {
        border-style: ${style};
      }`;
    }

    styleTag.textContent = currentCSS;

    // 👉 Update active button UI state
    const solidBtn = document.getElementById("borderStyleSolid");
    const dashedBtn = document.getElementById("borderStyleDashed");
    const dottedBtn = document.getElementById("borderStyleDotted");

    [solidBtn, dashedBtn, dottedBtn].forEach((btn) =>
      btn.classList.remove("sc-bg-454545")
    );

    const currentBtnId = {
      solid: "borderStyleSolid",
      dashed: "borderStyleDashed",
      dotted: "borderStyleDotted",
    }[style];

    const activeBtn = document.getElementById(currentBtnId);
    activeBtn?.classList.add("sc-bg-454545");
  }

  //border style end here

  // border radius start here

  let activeRadiusTarget = "all";

  function initRadiusProgressbarControls() {
    const radiusSlider = document.getElementById("radiusField");
    const radiusBullet = document.getElementById("radiusBullet");
    const radiusFill = document.getElementById("radiusFill");
    const radiusDisplay = document.getElementById("radiusCountAnother");

    if (!radiusSlider || !radiusBullet || !radiusFill || !radiusDisplay) return;

    let isDragging = false;

    // const updateUI = (offsetX) => {
    //   const max = radiusSlider.offsetWidth;
    //   const bulletRadius = radiusBullet.offsetWidth / 2;
    //   offsetX = Math.max(bulletRadius, Math.min(offsetX, max - bulletRadius));

    //   const percent = offsetX / max;
    //   const pxValue = Math.round(percent * 100);

    //   // Update UI
    //   radiusBullet.style.left = `${offsetX}px`;
    //   radiusBullet.style.transform = "translateX(-50%)";
    //   radiusFill.style.width = `${offsetX}px`;
    //   radiusDisplay.textContent = `${pxValue}px`;

    //   // Update CSS
    //   const selected = document.querySelector(".sc-selected-image");
    //   if (!selected) return;

    //   const block = selected.closest('[id^="block-"]');
    //   if (!block) return;

    //   const blockSelector = `#${block.id} div.sqs-image-content`;
    //   let styleTag = document.getElementById("sc-image-border-style");
    //   if (!styleTag) {
    //     styleTag = document.createElement("style");
    //     styleTag.id = "sc-image-border-style";
    //     document.head.appendChild(styleTag);
    //   }

    //   let currentCSS = styleTag.textContent;
    //   const blockRegex = new RegExp(
    //     `(${blockSelector}\\s*{)([\\s\\S]*?)(})`,
    //     "g"
    //   );
    //   const match = blockRegex.exec(currentCSS);

    //   if (match) {
    //     let declarations = match[2]
    //       .replace(/border-radius\s*:\s*[^;]+;?/g, "")
    //       .trim();
    //     declarations += `\n  border-radius: ${pxValue}px !important;`;
    //     const updated = `${match[1]}\n  ${declarations}\n${match[3]}`;
    //     currentCSS = currentCSS.replace(blockRegex, updated);
    //   } else {
    //     currentCSS += `\n${blockSelector} {\n  border-radius: ${pxValue}px !important;\n}`;
    //   }

    //   styleTag.textContent = currentCSS.trim();
    // };

    const updateUI = (offsetX) => {
      const max = radiusSlider.offsetWidth;
      const bulletRadius = radiusBullet.offsetWidth / 2;
      offsetX = Math.max(bulletRadius, Math.min(offsetX, max - bulletRadius));

      const percent = offsetX / max;
      const pxValue = Math.round(percent * 100);

      // UI update
      radiusBullet.style.left = `${offsetX}px`;
      radiusBullet.style.transform = "translateX(-50%)";
      radiusFill.style.width = `${offsetX}px`;
      radiusDisplay.textContent = `${pxValue}px`;

      // Apply the correct border-* value
      const selected = document.querySelector(".sc-selected-image");
      if (!selected) return;

      const block = selected.closest('[id^="block-"]');
      if (!block) return;

      const blockSelector = `#${block.id} div.sqs-image-content`;
      let styleTag = document.getElementById("sc-image-border-style");
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = "sc-image-border-style";
        document.head.appendChild(styleTag);
      }

      let currentCSS = styleTag.textContent;

      const props = {
        all: "border-radius",
        topLeft: "border-top-left-radius",
        topRight: "border-top-right-radius",
        bottomLeft: "border-bottom-left-radius",
        bottomRight: "border-bottom-right-radius",
      };

      const blockRegex = new RegExp(
        `(${blockSelector}\\s*{)([\\s\\S]*?)(})`,
        "g"
      );
      const match = blockRegex.exec(currentCSS);

      if (match) {
        let declarations = match[2];

        // Remove only the activeRadiusTarget line
        const currentProp = props[activeRadiusTarget];
        if (!currentProp) return;

        declarations = declarations.replace(
          new RegExp(`${currentProp}\\s*:\\s*[^;]+;?`, "g"),
          ""
        );

        // Add the new value
        declarations += `\n  ${currentProp}: ${pxValue}px !important;`;

        const updated = `${match[1]}${declarations}\n${match[3]}`;
        currentCSS = currentCSS.replace(blockRegex, updated);
      } else {
        const currentProp = props[activeRadiusTarget] || "border-radius";
        currentCSS += `\n${blockSelector} {\n  ${currentProp}: ${pxValue}px !important;\n}`;
      }

      styleTag.textContent = currentCSS.trim();
    };

    const handleDrag = (e) => {
      if (!isDragging) return;
      const clientX = e.clientX || (e.touches?.[0]?.clientX ?? 0);
      const rect = radiusSlider.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      updateUI(offsetX);
    };

    const startDrag = (e) => {
      e.preventDefault();
      isDragging = true;
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", stopDrag);
      document.addEventListener("touchmove", handleDrag);
      document.addEventListener("touchend", stopDrag);
    };

    const stopDrag = () => {
      isDragging = false;
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", stopDrag);
      document.removeEventListener("touchmove", handleDrag);
      document.removeEventListener("touchend", stopDrag);
    };

    radiusBullet.addEventListener("mousedown", startDrag);
    radiusBullet.addEventListener("touchstart", startDrag);
  }

  // ✅ Call this at the end
  initRadiusProgressbarControls();

  // function applyBorderRadius(type, radius) {
  //   const selected = document.querySelector(".sc-selected-image");
  //   if (!selected) return;

  //   const block = selected.closest('[id^="block-"]');
  //   if (!block) return;

  //   const blockSelector = `#${block.id} div.sqs-image-content`;
  //   let styleTag = document.getElementById("sc-image-border-style");
  //   if (!styleTag) {
  //     styleTag = document.createElement("style");
  //     styleTag.id = "sc-image-border-style";
  //     document.head.appendChild(styleTag);
  //   }

  //   const props = {
  //     all: "border-radius",
  //     topLeft: "border-top-left-radius",
  //     topRight: "border-top-right-radius",
  //     bottomLeft: "border-bottom-left-radius",
  //     bottomRight: "border-bottom-right-radius",
  //   };

  //   const valueToApply = `${radius}px !important`;
  //   const resetValue = `0px !important`;

  //   let currentCSS = styleTag.textContent;

  //   const blockRegex = new RegExp(
  //     `(${blockSelector}\\s*{)([\\s\\S]*?)(})`,
  //     "g"
  //   );
  //   const match = blockRegex.exec(currentCSS);

  //   if (match) {
  //     let declarations = match[2];

  //     // Ensure global border-radius is present
  //     if (!declarations.includes(props.all)) {
  //       declarations += `\n  ${props.all}: ${valueToApply};`;
  //     }

  //     // If not "all", apply that corner reset without removing other corner styles
  //     if (type !== "all") {
  //       const prop = props[type];
  //       const cornerRegex = new RegExp(`${prop}\\s*:\\s*[^;]+;?`, "g");
  //       declarations = declarations.replace(cornerRegex, ""); // remove existing if exists
  //       declarations += `\n  ${prop}: ${resetValue};`;
  //     }

  //     const updated = `${match[1]}${declarations}\n${match[3]}`;
  //     currentCSS = currentCSS.replace(blockRegex, updated);
  //   } else {
  //     let newRule = `${blockSelector} {\n`;
  //     newRule += `  ${props.all}: ${valueToApply};\n`;
  //     if (type !== "all") {
  //       newRule += `  ${props[type]}: ${resetValue};\n`;
  //     }
  //     newRule += `}`;
  //     currentCSS += `\n${newRule}`;
  //   }

  //   styleTag.textContent = currentCSS.trim();
  // }

  function applyBorderRadius(type, radius) {
    const selected = document.querySelector(".sc-selected-image");
    if (!selected) return;

    const block = selected.closest('[id^="block-"]');
    if (!block) return;

    const blockSelector = `#${block.id} div.sqs-image-content`;
    let styleTag = document.getElementById("sc-image-border-style");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "sc-image-border-style";
      document.head.appendChild(styleTag);
    }

    const props = {
      all: "border-radius",
      topLeft: "border-top-left-radius",
      topRight: "border-top-right-radius",
      bottomLeft: "border-bottom-left-radius",
      bottomRight: "border-bottom-right-radius",
    };

    let currentCSS = styleTag.textContent;
    const blockRegex = new RegExp(
      `(${blockSelector}\\s*{)([\\s\\S]*?)(})`,
      "g"
    );
    const match = blockRegex.exec(currentCSS);

    if (match) {
      let declarations = match[2];

      if (type === "all") {
        // Remove all corner props
        Object.values(props).forEach((prop) => {
          if (prop !== props.all) {
            declarations = declarations.replace(
              new RegExp(`${prop}\\s*:\\s*[^;]+;?`, "g"),
              ""
            );
          }
        });

        // Remove existing border-radius
        declarations = declarations.replace(
          new RegExp(`${props.all}\\s*:\\s*[^;]+;?`, "g"),
          ""
        );

        declarations += `\n  ${props.all}: ${radius}px !important;`;
      } else {
        // Remove only the active corner prop
        const currentProp = props[type];
        declarations = declarations.replace(
          new RegExp(`${currentProp}\\s*:\\s*[^;]+;?`, "g"),
          ""
        );
        declarations += `\n  ${currentProp}: ${radius}px !important;`;
      }

      const updatedBlock = `${match[1]}${declarations}\n${match[3]}`;
      currentCSS = currentCSS.replace(blockRegex, updatedBlock);
    } else {
      const currentProp = props[type] || props.all;
      currentCSS += `\n${blockSelector} {\n  ${currentProp}: ${radius}px !important;\n}`;
    }

    styleTag.textContent = currentCSS.trim();
  }

  const radiusValue = () => {
    const countEl = document.getElementById("radiusCountAnother");
    const count = parseInt(countEl?.textContent) || 0;
    return count;
  };

  document.getElementById("allradiusBorder")?.addEventListener("click", () => {
    const radius = radiusValue();
    applyBorderRadius("all", radius);
  });

  // document
  //   .getElementById("topLeftradiusBorder")
  //   ?.addEventListener("click", () => {
  //     const radius = radiusValue();
  //     applyBorderRadius("topLeft", radius);
  //   });

  document
    .getElementById("topLeftradiusBorder")
    ?.addEventListener("click", () => {
      activeRadiusTarget = "topLeft";
      const radius = radiusValue();
      // applyBorderRadius(activeRadiusTarget, radius);
      applyBorderRadius("topLeft", radius);
    });

  document
    .getElementById("topRightradiusBorder")
    ?.addEventListener("click", () => {
      activeRadiusTarget = "topRight";
      const radius = radiusValue();
      applyBorderRadius("topRight", radius);
    });

  document
    .getElementById("bottomLeftradiusBorder")
    ?.addEventListener("click", () => {
      activeRadiusTarget = "bottomLeft";
      const radius = radiusValue();
      applyBorderRadius("bottomLeft", radius);
    });

  document
    .getElementById("bottomRightradiusBorder")
    ?.addEventListener("click", () => {
      activeRadiusTarget = "bottomRight";
      const radius = radiusValue();
      applyBorderRadius("bottomRight", radius);
    });

  // const radiusValue = () => {
  //   const countEl = document.getElementById("radiusCountAnother");
  //   const count = parseInt(countEl?.textContent) || 0;
  //   return count;
  // };

  // document
  //   .getElementById("allradiusBorder")
  //   ?.addEventListener("click", () => applyBorderRadius("all", radiusValue()));
  // document
  //   .getElementById("topLeftradiusBorder")
  //   ?.addEventListener("click", () =>
  //     applyBorderRadius("topLeft", radiusValue())
  //   );
  // document
  //   .getElementById("topRightradiusBorder")
  //   ?.addEventListener("click", () => {
  //     const radius = radiusValue();
  //     applyBorderRadius("topRight", radius);
  //   });

  // document
  //   .getElementById("bottomLeftradiusBorder")
  //   ?.addEventListener("click", () => {
  //     const radius = radiusValue();
  //     applyBorderRadius("bottomLeft", radius);
  //   });

  // document
  //   .getElementById("bottomRightradiusBorder")
  //   ?.addEventListener("click", () => {
  //     const radius = radiusValue();
  //     applyBorderRadius("bottomRight", radius);
  //   });

  // border radius end here
}
