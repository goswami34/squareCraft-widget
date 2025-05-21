// ✅ Declare global style cache map
const imageStyleMap = new Map();

// ✅ Utility function to merge and save styles
// function mergeAndSaveImageStyles(blockId, newStyles, saveFn) {
//   const prevStyles = imageStyleMap.get(blockId) || {};
//   const mergedStyles = { ...prevStyles, ...newStyles };

//   imageStyleMap.set(blockId, mergedStyles);
//   saveFn(blockId, mergedStyles, "image");
// }

function mergeAndSaveImageStyles(blockId, newStyles, saveFn) {
  const prevStyles = imageStyleMap.get(blockId) || {};

  // Fix: fallback to previous saved values if current state is missing/invalid
  const safeStyles = {
    ...prevStyles,
    ...Object.fromEntries(
      Object.entries(newStyles).filter(
        ([_, value]) => value !== null && value !== undefined && value !== "0px"
      )
    ),
  };

  imageStyleMap.set(blockId, safeStyles);
  saveFn(blockId, safeStyles, "image");
}

export function initImageBorderControls(selectedElement, context = {}) {
  const {
    addPendingModification,
    saveModificationsforImage,
    token,
    userId,
    widgetId,
  } = context;

  if (typeof addPendingModification !== "function") {
    console.warn(
      "❌ addPendingModification is not provided or not a function."
    );
    return;
  }
  console.log(addPendingModification);
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
  let currentActiveBorderStyle = "solid"; // To track the active border style
  let currentRadiusAll = 0; // Track general border-radius

  //for saving  the whole modification into database

  //for saving  the whole modification into database end here

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

    const cssProps = {
      "border-style": currentActiveBorderStyle,
      "box-sizing": "border-box",
      "object-fit": "cover",
      ...(selectedBorderColor && { "border-color": selectedBorderColor }),
      ...(currentRadiusAll > 0 && {
        "border-radius": `${currentRadiusAll}px !important`,
      }),
    };

    // ✅ Apply correct key based on side
    const side = window.__scActiveBorderType;
    if (side === "all") {
      cssProps["border-width"] = `${borderWidth}px`;
      allBorderWidth = borderWidth;
    } else {
      const sideMap = {
        top: "border-top-width",
        bottom: "border-bottom-width",
        left: "border-left-width",
        right: "border-right-width",
      };
      cssProps[sideMap[side]] = `${borderWidth}px`;

      // You could also store each side's state if needed
      if (side === "top") topBorderWidth = borderWidth;
      if (side === "bottom") bottomBorderWidth = borderWidth;
      if (side === "left") leftBorderWidth = borderWidth;
      if (side === "right") rightBorderWidth = borderWidth;
    }

    mergeAndSaveImageStyles(blockId, cssProps, saveModificationsforImage);

    // ✅ Also inject image-level styles like object-fit into database
    const imageTagSelector = `#${blockId} .sqs-image-content img`;
    const imageStyleTagId = `sc-img-style-${blockId}`;
    let imgTag = document.getElementById(imageStyleTagId);
    if (!imgTag) {
      imgTag = document.createElement("style");
      imgTag.id = imageStyleTagId;
      document.head.appendChild(imgTag);
    }
    imgTag.textContent = `
    ${imageTagSelector} {
      box-sizing: border-box;
      object-fit: cover !important;
    }`;

    // ✅ Save imageTag styles to DB along with main styles
    mergeAndSaveImageStyles(
      blockId,
      {
        ...cssProps,
        imageTag: {
          selector: imageTagSelector,
          styles: {
            "box-sizing": "border-box",
            "object-fit": "cover",
          },
        },
      },
      saveModificationsforImage
    );

    // image modify code end here
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

      mergeAndSaveImageStyles(
        block.id,
        {
          "border-width": `${allBorderWidth}px`,
          "border-style": currentActiveBorderStyle,
          ...(selectedBorderColor && { "border-color": selectedBorderColor }),
          ...(currentRadiusAll > 0 && {
            "border-radius": `${currentRadiusAll}px !important`,
          }),
        },
        saveModificationsforImage
      );

      //save to database
      // saveModificationsforImage(block, addPendingModification, "image");
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
    currentActiveBorderStyle = style; // Update the active border style

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

    // Add pending modification for the style change itself
    if (block) {
      mergeAndSaveImageStyles(
        block.id,
        {
          "border-width": `${allBorderWidth}px`,
          "box-sizing": "border-box",
          ...(selectedBorderColor && { "border-color": selectedBorderColor }),
          "border-style": currentActiveBorderStyle,
          ...(currentRadiusAll > 0 && {
            "border-radius": `${currentRadiusAll}px !important`,
          }),
        },
        saveModificationsforImage
      );

      //save to database
      // saveModificationsforImage(block, addPendingModification, "image");
    }
  }

  //border style end here

  // border radius start here

  let activeRadiusTarget = null;

  function initRadiusProgressbarControls() {
    const radiusSlider = document.getElementById("radiusField");
    const radiusBullet = document.getElementById("radiusBullet");
    const radiusFill = document.getElementById("radiusFill");
    const radiusDisplay = document.getElementById("radiusCountAnother");

    if (!radiusSlider || !radiusBullet || !radiusFill || !radiusDisplay) return;

    let isDragging = false;

    function updateUI(offsetX) {
      const max = radiusSlider.offsetWidth;
      const bulletRadius = radiusBullet.offsetWidth / 2;
      offsetX = Math.max(bulletRadius, Math.min(offsetX, max - bulletRadius));

      const percent = offsetX / max;
      const pxValue = Math.round(percent * 100);

      radiusBullet.style.left = `${offsetX}px`;
      radiusBullet.style.transform = "translateX(-50%)";
      radiusFill.style.width = `${offsetX}px`;
      radiusDisplay.textContent = `${pxValue}px`;

      // ✅ Prevent fallback to 'all' if null
      // if (activeRadiusTarget && activeRadiusTarget !== "all") {
      //   applyBorderRadius(activeRadiusTarget, pxValue);
      // } else if (activeRadiusTarget === "all") {
      //   applyBorderRadius("all", pxValue);
      //   currentRadiusAll = pxValue; // Update global state for 'all'
      // } else if (!activeRadiusTarget && isDragging) {
      //   // Default to 'all' on drag if no specific target
      //   applyBorderRadius("all", pxValue);
      //   currentRadiusAll = pxValue; // Update global state for 'all'
      // }

      if (activeRadiusTarget && activeRadiusTarget !== "all") {
        applyBorderRadius(activeRadiusTarget, pxValue);
      } else if (activeRadiusTarget === "all") {
        applyBorderRadius("all", pxValue);
      }
    }

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

    const currentProp = props[type];
    if (!currentProp) return;

    let currentCSS = styleTag.textContent;
    const blockRegex = new RegExp(
      `(${blockSelector}\\s*{)([\\s\\S]*?)(})`,
      "g"
    );
    const match = blockRegex.exec(currentCSS);

    if (match) {
      let declarations = match[2];

      // Remove ONLY the active prop
      declarations = declarations.replace(
        new RegExp(`${currentProp}\\s*:\\s*[^;]+;?`, "g"),
        ""
      );

      // ✅ If updating corner only, do NOT touch `border-radius`
      if (type !== "all") {
        declarations = declarations.replace(/border-radius\s*:\s*[^;]+;?/g, "");
      }

      declarations += `\n  ${currentProp}: ${radius}px !important;`;

      const updated = `${match[1]}${declarations}\n${match[3]}`;
      currentCSS = currentCSS.replace(blockRegex, updated);
    } else {
      currentCSS += `\n${blockSelector} {\n  ${currentProp}: ${radius}px !important;\n}`;
    }

    styleTag.textContent = currentCSS.trim();

    const radiusProps = {
      all: { "border-radius": `${radius}px !important` },
      topLeft: { "border-top-left-radius": `${radius}px !important` },
      topRight: { "border-top-right-radius": `${radius}px !important` },
      bottomLeft: { "border-bottom-left-radius": `${radius}px !important` },
      bottomRight: { "border-bottom-right-radius": `${radius}px !important` },
    };

    // mergeAndSaveImageStyles(
    //   block.id,
    //   {
    //     "border-width": `${allBorderWidth}px`,
    //     ...(selectedBorderColor && { "border-color": selectedBorderColor }),
    //     "border-style": currentActiveBorderStyle,
    //     ...(currentRadiusAll > 0 && {
    //       "border-radius": `${currentRadiusAll}px !important`,
    //     }),
    //   },
    //   saveModificationsforImage
    // );

    mergeAndSaveImageStyles(
      block.id,
      {
        "border-width": `${allBorderWidth}px`,
        ...(selectedBorderColor && { "border-color": selectedBorderColor }),
        "border-style": currentActiveBorderStyle,
        ...(type === "all"
          ? { "border-radius": `${radius}px` }
          : { [currentProp]: `${radius}px` }),
      },
      saveModificationsforImage
    );

    //save to database
    // saveModificationsforImage(block, addPendingModification, "image");
  }

  const radiusValue = () => {
    const countEl = document.getElementById("radiusCountAnother");
    const count = parseInt(countEl?.textContent) || 0;
    return count;
  };

  document.getElementById("allradiusBorder")?.addEventListener("click", () => {
    activeRadiusTarget = "all";
    applyBorderRadius("all", radiusValue());
  });

  document
    .getElementById("topLeftradiusBorder")
    ?.addEventListener("click", () => {
      activeRadiusTarget = "topLeft";
      applyBorderRadius("topLeft", radiusValue());
    });

  document
    .getElementById("topRightradiusBorder")
    ?.addEventListener("click", () => {
      activeRadiusTarget = "topRight";
      applyBorderRadius("topRight", radiusValue());
    });

  document
    .getElementById("bottomLeftradiusBorder")
    ?.addEventListener("click", () => {
      activeRadiusTarget = "bottomLeft";
      applyBorderRadius("bottomLeft", radiusValue());
    });

  document
    .getElementById("bottomRightradiusBorder")
    ?.addEventListener("click", () => {
      activeRadiusTarget = "bottomRight";
      applyBorderRadius("bottomRight", radiusValue());
    });

  // border radius end here
}
