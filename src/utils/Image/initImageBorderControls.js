window.__scImageStyleMap = new Map();

// Store pending modifications locally (like shadow controls)
const pendingBorderModifications = new Map();

// Export the mergeAndSaveImageStyles function
export function mergeAndSaveImageStyles(blockId, newStyles) {
  console.log("🔄 mergeAndSaveImageStyles called with:", {
    blockId,
    newStyles,
  });

  const prevStyles = window.__scImageStyleMap.get(blockId) || {
    image: {
      selector: `#${blockId} div.sqs-image-content`,
      styles: {},
    },
    imageTag: {
      selector: `#${blockId} .sqs-image-content img`,
      styles: {
        "box-sizing": "border-box",
        "object-fit": "cover",
      },
    },
  };

  const mergedImageStyles = {
    ...prevStyles.image.styles,
    ...(newStyles.image?.styles || {}),
  };
  const finalData = {
    image: {
      selector: prevStyles.image.selector,
      styles: mergedImageStyles,
    },
    imageTag: {
      selector: prevStyles.imageTag.selector,
      styles: {
        ...prevStyles.imageTag.styles,
        ...(newStyles.imageTag?.styles || {}),
      },
    },
  };

  // Save to map only (no DB call)
  window.__scImageStyleMap.set(blockId, finalData);

  // Store in local pendingModifications (like shadow controls)
  pendingBorderModifications.set(blockId, finalData);

  console.log("💾 Added to pending modifications:", {
    blockId,
    finalData,
    pendingCount: pendingBorderModifications.size,
  });
}

// Function to publish all pending border modifications (like shadow controls)
const publishPendingBorderModifications = async (saveModificationsforImage) => {
  if (pendingBorderModifications.size === 0) {
    console.log("No border changes to publish");
    return;
  }

  try {
    for (const [blockId, borderData] of pendingBorderModifications) {
      if (typeof saveModificationsforImage === "function") {
        console.log("Publishing border for block:", blockId, borderData);
        await saveModificationsforImage(blockId, borderData, "image");
      }
    }

    // Clear pending modifications after successful publish
    pendingBorderModifications.clear();
    console.log("All border changes published successfully!");
  } catch (error) {
    console.error("Failed to publish border modifications:", error);
    throw error;
  }
};

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
  const palette = document.getElementById("border-color-palette");
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

  // Function to sync UI controls with restored styles
  function syncUIWithRestoredStyles(blockId) {
    const prevStyles =
      window.__scImageStyleMap.get(blockId)?.image?.styles || {};

    // Sync border style buttons
    const borderStyle = prevStyles["border-style"];
    if (borderStyle) {
      currentActiveBorderStyle = borderStyle;

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
      }[borderStyle];

      const activeBtn = document.getElementById(currentBtnId);
      activeBtn?.classList.add("sc-bg-454545");

      console.log("🔄 Synced border style UI:", borderStyle);
    }

    // Sync border color
    const borderColor = prevStyles["border-color"];
    if (borderColor) {
      selectedBorderColor = borderColor;
      const colorCode = document.getElementById("color-code");
      if (colorCode) {
        colorCode.textContent = borderColor;
      }
      console.log("🔄 Synced border color UI:", borderColor);
    }

    // Sync border width slider
    const borderWidth = prevStyles["border-width"];
    if (
      borderWidth &&
      borderWidthSlider &&
      borderWidthBullet &&
      borderWidthFill &&
      borderWidthDisplay
    ) {
      const width = parseInt(borderWidth);
      const max = borderWidthSlider.offsetWidth;
      const percent = width / 100;
      const px = percent * max;

      borderWidthBullet.style.left = `${px}px`;
      borderWidthBullet.style.transform = "translateX(-50%)";
      borderWidthFill.style.width = `${px}px`;
      borderWidthDisplay.textContent = `${width}px`;
      allBorderWidth = width;

      console.log("🔄 Synced border width UI:", width);
    }
  }

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
          ${
            selectedBorderColor
              ? `border-color: ${selectedBorderColor} !important;`
              : ""
          }
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

  function setSideButtonsReadonly(state) {
    const readonlyClass = ["sc-blur-sm", "sc-pointer-events-none"];
    [topButton, rightButton, leftButton, bottomButton].forEach((btn) => {
      readonlyClass.forEach((cls) => btn.classList.toggle(cls, state));
    });
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
        "border-radius": `${currentRadiusAll}px`,
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

    mergeAndSaveImageStyles(blockId, cssProps);

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

    mergeAndSaveImageStyles(blockId, {
      image: {
        selector: `#${blockId} div.sqs-image-content`,
        styles: {
          ...cssProps,
          ...(selectedBorderColor
            ? { "border-color": selectedBorderColor }
            : {}),
          ...(currentRadiusAll > 0
            ? { "border-radius": `${currentRadiusAll}px` }
            : {}),
        },
      },
      imageTag: {
        selector: `#${blockId} .sqs-image-content img`,
        styles: {
          "box-sizing": "border-box",
          "object-fit": "cover",
        },
      },
    });

    // image modify code end here
  }

  function stopDrag() {
    isDragging = false;
    document.removeEventListener("mousemove", handleDrag);
    document.removeEventListener("mouseup", stopDrag);
    document.removeEventListener("touchmove", handleDrag);
    document.removeEventListener("touchend", stopDrag);
  }

  // Function to reattach drag handlers
  function reattachDragHandlers() {
    // Remove existing listeners to avoid duplicates
    borderWidthBullet.removeEventListener("mousedown", startDrag);
    borderWidthBullet.removeEventListener("touchstart", startDrag);

    // Reattach listeners
    borderWidthBullet.addEventListener("mousedown", startDrag);
    borderWidthBullet.addEventListener("touchstart", startDrag);
  }

  // Initial attachment
  reattachDragHandlers();

  document.addEventListener("click", (e) => {
    const imageContent = e.target.closest(".sqs-image-content");
    if (imageContent) {
      document.querySelectorAll(".sqs-image-content").forEach((img) => {
        img.classList.remove("sc-selected-image");
      });
      imageContent.classList.add("sc-selected-image");

      // Sync UI with restored styles when image is selected
      const block = imageContent.closest('[id^="block-"]');
      if (block) {
        setTimeout(() => syncUIWithRestoredStyles(block.id), 100);
      }
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

      const blockId = block.id;

      // ✅ Get previously saved border-width and border-style values
      const prevStyles =
        window.__scImageStyleMap.get(blockId)?.image?.styles || {};
      const savedBorderWidth = prevStyles["border-width"] || "1px"; // fallback
      const savedBorderStyle =
        prevStyles["border-style"] || currentActiveBorderStyle || "solid"; // fallback

      // Update currentActiveBorderStyle to maintain consistency
      if (savedBorderStyle && savedBorderStyle !== currentActiveBorderStyle) {
        currentActiveBorderStyle = savedBorderStyle;
        console.log(
          "🔄 Updated currentActiveBorderStyle to:",
          savedBorderStyle
        );
      }

      console.log("🎨 Color change - Current state:", {
        newColor,
        currentActiveBorderStyle,
        savedBorderStyle,
        savedBorderWidth,
        blockId,
      });

      const blockSelector = `#${blockId} div.sqs-image-content`;
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
          .replace(/border-color\s*:\s*[^;]+;?/g, "")
          .trim();

        // 🔁 Preserve existing border-style and border-width
        const prevStyleMatch = match[2].match(/border-style\s*:\s*([^;]+);?/);
        const prevWidthMatch = match[2].match(/border-width\s*:\s*([^;]+);?/);

        const borderStyleToKeep =
          savedBorderStyle ||
          currentActiveBorderStyle ||
          (prevStyleMatch ? prevStyleMatch[1] : "solid");
        const borderWidthToKeep =
          savedBorderWidth || (prevWidthMatch ? prevWidthMatch[1] : "1px");

        // Add all border properties to maintain consistency
        declarations += `\n  border-width: ${borderWidthToKeep} !important;`;
        declarations += `\n  border-style: ${borderStyleToKeep} !important;`;
        declarations += `\n  border-color: ${newColor} !important;`;

        const updated = `${match[1]}\n  ${declarations}\n${match[3]}`;
        currentCSS = currentCSS.replace(blockRegex, updated);
      } else {
        currentCSS += `
          ${blockSelector} {
            border-width: ${savedBorderWidth} !important;
            border-style: ${savedBorderStyle} !important;
            border-color: ${newColor} !important;
          }`;
      }

      styleTag.textContent = currentCSS;

      // 👉 Update active button UI state to reflect the current border style
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
      }[savedBorderStyle];

      const activeBtn = document.getElementById(currentBtnId);
      activeBtn?.classList.add("sc-bg-454545");

      // ✅ Save with correct border-width, not 0
      mergeAndSaveImageStyles(blockId, {
        image: {
          selector: `#${blockId} div.sqs-image-content`,
          styles: {
            "border-width": savedBorderWidth,
            "border-style": savedBorderStyle,
            "border-color": newColor,
            ...(currentRadiusAll > 0 && {
              "border-radius": `${currentRadiusAll}px`,
            }),
          },
        },
        imageTag: {
          selector: `#${blockId} .sqs-image-content img`,
          styles: {
            "box-sizing": "border-box",
            "object-fit": "cover",
          },
        },
      });
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
      // let declarations = match[2]
      //   .replace(/border-style\s*:\s*[^;]+;?/g, "")
      //   .trim();
      // declarations += `\n  border-style: ${style}`;

      let declarations = match[2]
        .replace(/border-style\s*:\s*[^;]+;?/g, "")
        .trim();

      // 🔁 Preserve existing border-color and border-width if not explicitly set
      const prevColorMatch = match[2].match(/border-color\s*:\s*([^;]+);?/);
      const prevWidthMatch = match[2].match(/border-width\s*:\s*([^;]+);?/);

      const borderColorToKeep =
        selectedBorderColor || (prevColorMatch ? prevColorMatch[1] : "#000");
      const borderWidthToKeep =
        allBorderWidth || (prevWidthMatch ? prevWidthMatch[1] : "1px");

      declarations += `\n  border-width: ${borderWidthToKeep} !important;`;
      declarations += `\n  border-color: ${borderColorToKeep} !important;`;
      declarations += `\n  border-style: ${style} !important;`;

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
      // Get the current border width from the slider or default to 1px
      const currentPosition = parseFloat(borderWidthBullet.style.left) || 0;
      const max = borderWidthSlider.offsetWidth;
      const currentWidth = Math.round((currentPosition / max) * 100) || 1;

      console.log("🔧 Saving border style:", {
        style: currentActiveBorderStyle,
        width: currentWidth,
        color: selectedBorderColor,
        blockId: block.id,
      });

      mergeAndSaveImageStyles(block.id, {
        image: {
          selector: `#${block.id} div.sqs-image-content`,
          styles: {
            "border-width": `${currentWidth}px`,
            "box-sizing": "border-box",
            ...(selectedBorderColor && {
              "border-color": selectedBorderColor,
            }),
            "border-style": currentActiveBorderStyle,
            ...(currentRadiusAll > 0 && {
              "border-radius": `${currentRadiusAll}px`,
            }),
          },
        },
        imageTag: {
          selector: `#${block.id} .sqs-image-content img`,
          styles: {
            "box-sizing": "border-box",
            "object-fit": "cover",
          },
        },
      });
    }
  }

  //border style end here

  //  border radius start here

  let activeRadiusTarget = null;

  // ✅ Match your HTML IDs
  const allRadiusButton = document.getElementById("allradiusBorder");
  const topLeftRadiusButton = document.getElementById("topLeftradiusBorder");
  const topRightRadiusButton = document.getElementById("topRightradiusBorder");
  const bottomRightRadiusButton = document.getElementById(
    "bottomRightradiusBorder"
  );
  const bottomLeftRadiusButton = document.getElementById(
    "bottomLeftradiusBorder"
  );

  const radiusButtons = [
    topLeftRadiusButton,
    topRightRadiusButton,
    bottomRightRadiusButton,
    bottomLeftRadiusButton,
  ];

  function setRadiusButtonReadonly(activeTarget) {
    const readonlyClasses = ["sc-blur-sm", "sc-pointer-events-none"];

    // ✅ Only disable "All" when a side is selected
    const disableAll = activeTarget !== "all";
    if (allRadiusButton) {
      readonlyClasses.forEach((cls) => {
        if (disableAll) {
          allRadiusButton.classList.add(cls);
        } else {
          allRadiusButton.classList.remove(cls);
        }
      });
    }

    // ✅ Sides are NEVER disabled, so always remove readonly
    radiusButtons.forEach((btn) => {
      if (!btn) return;
      readonlyClasses.forEach((cls) => btn.classList.remove(cls));
    });
  }

  function getRadiusValue() {
    const el = document.getElementById("radiusCountAnother");
    return parseInt(el?.textContent) || 0;
  }

  function applyBorderRadius(type, radius) {
    const selected = document.querySelector(".sc-selected-image");
    if (!selected) return;

    const block = selected.closest('[id^="block-"]');
    if (!block) return;

    const blockId = block.id;
    const blockSelector = `#${blockId} div.sqs-image-content`;

    const props = {
      all: "border-radius",
      topLeft: "border-top-left-radius",
      topRight: "border-top-right-radius",
      bottomRight: "border-bottom-right-radius",
      bottomLeft: "border-bottom-left-radius",
    };
    const cssProp = props[type];
    if (!cssProp) return;

    // 🔧 live style update
    let styleTag = document.getElementById("sc-image-border-style");
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = "sc-image-border-style";
      document.head.appendChild(styleTag);
    }

    let css = styleTag.textContent;
    const regex = new RegExp(`(${blockSelector}\\s*{)([\\s\\S]*?)(})`, "g");
    const match = regex.exec(css);

    if (match) {
      let declarations = match[2];
      declarations = declarations.replace(
        new RegExp(`${cssProp}\\s*:\\s*[^;]+;?`, "g"),
        ""
      );
      if (type !== "all") {
        declarations = declarations.replace(/border-radius\s*:\s*[^;]+;?/g, "");
      }
      declarations += `\n  ${cssProp}: ${radius}px !important;`;
      const updated = `${match[1]}${declarations}\n${match[3]}`;
      css = css.replace(regex, updated);
    } else {
      css += `\n${blockSelector} {\n  ${cssProp}: ${radius}px !important;\n}`;
    }

    styleTag.textContent = css;

    // 🔄 persist
    mergeAndSaveImageStyles(blockId, {
      image: {
        styles: {
          ...(type === "all"
            ? { "border-radius": `${radius}px` }
            : { [cssProp]: `${radius}px` }),
        },
      },
      imageTag: {
        styles: {
          "border-radius": `${radius}px`,
          "box-sizing": "border-box",
          "object-fit": "cover",
        },
      },
    });
  }

  // ✅ Radius slider logic
  function initRadiusSlider() {
    const slider = document.getElementById("radiusField");
    const bullet = document.getElementById("radiusBullet");
    const fill = document.getElementById("radiusFill");
    const display = document.getElementById("radiusCountAnother");

    if (!slider || !bullet || !fill || !display) return;

    let dragging = false;

    const updateUI = (offsetX) => {
      const max = slider.offsetWidth;
      const bulletRadius = bullet.offsetWidth / 2;
      offsetX = Math.max(bulletRadius, Math.min(offsetX, max - bulletRadius));

      const percent = offsetX / max;
      const px = Math.round(percent * 100);

      bullet.style.left = `${offsetX}px`;
      bullet.style.transform = "translateX(-50%)";
      fill.style.width = `${offsetX}px`;
      display.textContent = `${px}px`;

      if (activeRadiusTarget) applyBorderRadius(activeRadiusTarget, px);
    };

    const handleDrag = (e) => {
      if (!dragging) return;
      const clientX = e.clientX || e.touches?.[0]?.clientX || 0;
      const rect = slider.getBoundingClientRect();
      const offsetX = clientX - rect.left;
      updateUI(offsetX);
    };

    const start = (e) => {
      e.preventDefault();
      dragging = true;
      document.addEventListener("mousemove", handleDrag);
      document.addEventListener("mouseup", stop);
      document.addEventListener("touchmove", handleDrag);
      document.addEventListener("touchend", stop);
    };

    const stop = () => {
      dragging = false;
      document.removeEventListener("mousemove", handleDrag);
      document.removeEventListener("mouseup", stop);
      document.removeEventListener("touchmove", handleDrag);
      document.removeEventListener("touchend", stop);
    };

    // Function to reattach radius drag handlers
    function reattachRadiusDragHandlers() {
      // Remove existing listeners to avoid duplicates
      bullet.removeEventListener("mousedown", start);
      bullet.removeEventListener("touchstart", start);

      // Reattach listeners
      bullet.addEventListener("mousedown", start);
      bullet.addEventListener("touchstart", start);
    }

    // Initial attachment
    reattachRadiusDragHandlers();

    // Make the reattach function available globally for reset
    window.reattachRadiusDragHandlers = reattachRadiusDragHandlers;
  }

  initRadiusSlider();

  // ✅ Radius button clicks
  allRadiusButton?.addEventListener("click", () => {
    activeRadiusTarget = "all";
    setRadiusButtonReadonly("all");
    applyBorderRadius("all", getRadiusValue());
  });
  topLeftRadiusButton?.addEventListener("click", () => {
    activeRadiusTarget = "topLeft";
    setRadiusButtonReadonly("topLeft");
    applyBorderRadius("topLeft", getRadiusValue());
  });
  topRightRadiusButton?.addEventListener("click", () => {
    activeRadiusTarget = "topRight";
    setRadiusButtonReadonly("topRight");
    applyBorderRadius("topRight", getRadiusValue());
  });
  bottomRightRadiusButton?.addEventListener("click", () => {
    activeRadiusTarget = "bottomRight";
    setRadiusButtonReadonly("topRight");
    applyBorderRadius("bottomRight", getRadiusValue());
  });
  bottomLeftRadiusButton?.addEventListener("click", () => {
    activeRadiusTarget = "bottomLeft";
    setRadiusButtonReadonly("bottomLeft");
    applyBorderRadius("bottomLeft", getRadiusValue());
  });

  // border radius end here

  // ✅ Reset functionality for border and border-radius
  // function resetBorderStyles() {
  //   const selected = document.querySelector(".sc-selected-image");
  //   if (!selected) {
  //     console.warn("❌ No image selected for border reset");
  //     return;
  //   }

  //   const block = selected.closest('[id^="block-"]');
  //   if (!block) return;

  //   const blockId = block.id;
  //   const blockSelector = `#${blockId} div.sqs-image-content`;

  //   // Remove border styles from style tag
  //   let styleTag = document.getElementById("sc-image-border-style");
  //   if (styleTag) {
  //     let currentCSS = styleTag.textContent;
  //     const blockRegex = new RegExp(
  //       `(${blockSelector}\\s*{)([\\s\\S]*?)(})`,
  //       "g"
  //     );
  //     const match = blockRegex.exec(currentCSS);

  //     if (match) {
  //       let declarations = match[2];
  //       // Remove all border-related properties
  //       declarations = declarations
  //         .replace(/border-width\s*:\s*[^;]+;?/g, "")
  //         .replace(/border-style\s*:\s*[^;]+;?/g, "")
  //         .replace(/border-color\s*:\s*[^;]+;?/g, "")
  //         .replace(/border-top-width\s*:\s*[^;]+;?/g, "")
  //         .replace(/border-bottom-width\s*:\s*[^;]+;?/g, "")
  //         .replace(/border-left-width\s*:\s*[^;]+;?/g, "")
  //         .replace(/border-right-width\s*:\s*[^;]+;?/g, "")
  //         .trim();

  //       if (declarations) {
  //         const updated = `${match[1]}\n  ${declarations}\n${match[3]}`;
  //         currentCSS = currentCSS.replace(blockRegex, updated);
  //       } else {
  //         // If no declarations left, remove the entire block
  //         currentCSS = currentCSS.replace(blockRegex, "");
  //       }
  //       styleTag.textContent = currentCSS;
  //     }
  //   }

  //   // Reset UI controls
  //   // Reset border width slider
  //   if (
  //     borderWidthSlider &&
  //     borderWidthBullet &&
  //     borderWidthFill &&
  //     borderWidthDisplay
  //   ) {
  //     borderWidthBullet.style.left = "0px";
  //     borderWidthBullet.style.transform = "translateX(-50%)";
  //     borderWidthFill.style.width = "0px";
  //     borderWidthDisplay.textContent = "0px";
  //     allBorderWidth = 0;
  //     topBorderWidth = 0;
  //     bottomBorderWidth = 0;
  //     leftBorderWidth = 0;
  //     rightBorderWidth = 0;
  //   }

  //   // Reset border color
  //   selectedBorderColor = null;
  //   if (colorCode) {
  //     colorCode.textContent = "Select";
  //   }

  //   // Reset border style buttons
  //   const solidBtn = document.getElementById("borderStyleSolid");
  //   const dashedBtn = document.getElementById("borderStyleDashed");
  //   const dottedBtn = document.getElementById("borderStyleDotted");
  //   [solidBtn, dashedBtn, dottedBtn].forEach((btn) => {
  //     if (btn) btn.classList.remove("sc-bg-454545");
  //   });

  //   // Reset active border type and state
  //   window.__scActiveBorderType = "all";
  //   currentActiveBorderStyle = "solid"; // Reset to default

  //   // Reset border buttons to initial state
  //   setActiveBorderButton(allButton);

  //   // Remove readonly state from all side buttons
  //   setSideButtonsReadonly(false);

  //   // Update map and pending modifications
  //   const currentStyles = window.__scImageStyleMap.get(blockId) || {};
  //   const updatedStyles = {
  //     ...currentStyles,
  //     image: {
  //       ...currentStyles.image,
  //       styles: {
  //         ...currentStyles.image?.styles,
  //         // Remove border properties
  //         "border-width": undefined,
  //         "border-style": undefined,
  //         "border-color": undefined,
  //         "border-top-width": undefined,
  //         "border-bottom-width": undefined,
  //         "border-left-width": undefined,
  //         "border-right-width": undefined,
  //       },
  //     },
  //   };

  //   // Clean up undefined values
  //   Object.keys(updatedStyles.image.styles).forEach((key) => {
  //     if (updatedStyles.image.styles[key] === undefined) {
  //       delete updatedStyles.image.styles[key];
  //     }
  //   });

  //   window.__scImageStyleMap.set(blockId, updatedStyles);
  //   pendingBorderModifications.set(blockId, updatedStyles);

  //   console.log("✅ Border styles reset locally");

  //   // Reinitialize controls to ensure they work properly after reset
  //   setTimeout(() => {
  //     // Force reinitialize the border controls
  //     if (
  //       borderWidthSlider &&
  //       borderWidthBullet &&
  //       borderWidthFill &&
  //       borderWidthDisplay
  //     ) {
  //       // Ensure slider is properly positioned
  //       borderWidthBullet.style.left = "0px";
  //       borderWidthBullet.style.transform = "translateX(-50%)";
  //       borderWidthFill.style.width = "0px";
  //       borderWidthDisplay.textContent = "0px";
  //     }

  //     // Ensure border buttons are in correct state
  //     setActiveBorderButton(allButton);
  //     setSideButtonsReadonly(false);

  //     // Reattach drag handlers
  //     reattachDragHandlers();

  //     console.log("🔄 Border controls reinitialized after reset");
  //   }, 100);
  // }

  function resetBorderStyles() {
    const selected = document.querySelector(".sc-selected-image");
    if (!selected) {
      console.warn("❌ No image selected for border reset");
      return;
    }

    const block = selected.closest('[id^="block-"]');
    if (!block) return;

    const blockId = block.id;
    const blockSelector = `#${blockId} div.sqs-image-content`;

    // Remove border styles from <style> tag
    let styleTag = document.getElementById("sc-image-border-style");
    if (styleTag) {
      let currentCSS = styleTag.textContent;
      const blockRegex = new RegExp(
        `(${blockSelector}\\s*{)([\\s\\S]*?)(})`,
        "g"
      );
      const match = blockRegex.exec(currentCSS);

      if (match) {
        let declarations = match[2];
        declarations = declarations
          .replace(/border-width\s*:\s*[^;]+;?/g, "")
          .replace(/border-style\s*:\s*[^;]+;?/g, "")
          .replace(/border-color\s*:\s*[^;]+;?/g, "")
          .replace(/border-top-width\s*:\s*[^;]+;?/g, "")
          .replace(/border-bottom-width\s*:\s*[^;]+;?/g, "")
          .replace(/border-left-width\s*:\s*[^;]+;?/g, "")
          .replace(/border-right-width\s*:\s*[^;]+;?/g, "")
          .trim();

        if (declarations) {
          const updated = `${match[1]}\n  ${declarations}\n${match[3]}`;
          currentCSS = currentCSS.replace(blockRegex, updated);
        } else {
          currentCSS = currentCSS.replace(blockRegex, "");
        }

        styleTag.textContent = currentCSS;
      }
    }

    // Reset UI controls
    if (
      borderWidthSlider &&
      borderWidthBullet &&
      borderWidthFill &&
      borderWidthDisplay
    ) {
      borderWidthBullet.style.left = "0px";
      borderWidthBullet.style.transform = "translateX(-50%)";
      borderWidthFill.style.width = "0px";
      borderWidthDisplay.textContent = "0px";
      allBorderWidth = 0;
      topBorderWidth = 0;
      bottomBorderWidth = 0;
      leftBorderWidth = 0;
      rightBorderWidth = 0;
    }

    // Reset border color
    selectedBorderColor = null;
    if (colorCode) {
      colorCode.textContent = "Select";
    }

    // Reset border style buttons
    const solidBtn = document.getElementById("borderStyleSolid");
    const dashedBtn = document.getElementById("borderStyleDashed");
    const dottedBtn = document.getElementById("borderStyleDotted");
    [solidBtn, dashedBtn, dottedBtn].forEach((btn) =>
      btn?.classList.remove("sc-bg-454545")
    );

    // Reset state
    window.__scActiveBorderType = "all";
    currentActiveBorderStyle = "solid";

    setActiveBorderButton(allButton);
    setSideButtonsReadonly(false);

    // Update map & modifications
    const currentStyles = window.__scImageStyleMap.get(blockId) || {};
    const updatedStyles = {
      ...currentStyles,
      image: {
        ...currentStyles.image,
        styles: {
          ...currentStyles.image?.styles,
          "border-width": undefined,
          "border-style": undefined,
          "border-color": undefined,
          "border-top-width": undefined,
          "border-bottom-width": undefined,
          "border-left-width": undefined,
          "border-right-width": undefined,
        },
      },
    };

    Object.keys(updatedStyles.image.styles).forEach((key) => {
      if (updatedStyles.image.styles[key] === undefined) {
        delete updatedStyles.image.styles[key];
      }
    });

    window.__scImageStyleMap.set(blockId, updatedStyles);
    pendingBorderModifications.set(blockId, updatedStyles);

    console.log("✅ Border styles reset locally");

    // Reinitialize UI + force re-apply base CSS block to allow slider usage again
    // setTimeout(() => {
    //   if (
    //     borderWidthSlider &&
    //     borderWidthBullet &&
    //     borderWidthFill &&
    //     borderWidthDisplay
    //   ) {
    //     borderWidthBullet.style.left = "0px";
    //     borderWidthBullet.style.transform = "translateX(-50%)";
    //     borderWidthFill.style.width = "0px";
    //     borderWidthDisplay.textContent = "0px";
    //   }

    //   setActiveBorderButton(allButton);
    //   setSideButtonsReadonly(false);
    //   reattachDragHandlers();

    //   // ✅ FIX: Insert minimal fallback CSS block if missing
    //   let styleTag = document.getElementById("sc-image-border-style");
    //   if (styleTag && !styleTag.textContent.includes(blockSelector)) {
    //     styleTag.textContent += `
    //       ${blockSelector} {
    //         border-width: 0px !important;
    //         border-style: solid !important;
    //         box-sizing: border-box;
    //       }
    //     `;
    //     console.log(
    //       "🛠️ Inserted fallback style block after reset for:",
    //       blockSelector
    //     );
    //   }

    //   console.log("🔄 Border controls reinitialized after reset");
    // }, 100);
    setTimeout(() => {
      // Existing reinitialization code...
      if (
        borderWidthSlider &&
        borderWidthBullet &&
        borderWidthFill &&
        borderWidthDisplay
      ) {
        borderWidthBullet.style.left = "0px";
        borderWidthBullet.style.transform = "translateX(-50%)";
        borderWidthFill.style.width = "0px";
        borderWidthDisplay.textContent = "0px";
      }

      setActiveBorderButton(allButton);
      setSideButtonsReadonly(false);
      reattachDragHandlers();

      // ✅ Ensure the blockSelector exists in <style> after reset
      const styleTag = document.getElementById("sc-image-border-style");
      if (styleTag && !styleTag.textContent.includes(blockSelector)) {
        styleTag.textContent += `
          ${blockSelector} {
            border-width: 0px !important;
            border-style: solid !important;
            box-sizing: border-box;
          }
        `;
        console.log(
          "🛠️ Re-inserted fallback border style after reset:",
          blockSelector
        );
      }

      console.log("🔄 Border controls reinitialized after reset");
    }, 100);
  }

  function resetBorderRadiusStyles() {
    const selected = document.querySelector(".sc-selected-image");
    if (!selected) {
      console.warn("❌ No image selected for border-radius reset");
      return;
    }

    const block = selected.closest('[id^="block-"]');
    if (!block) return;

    const blockId = block.id;
    const blockSelector = `#${blockId} div.sqs-image-content`;

    // Remove border-radius styles from style tag
    let styleTag = document.getElementById("sc-image-border-style");
    if (styleTag) {
      let currentCSS = styleTag.textContent;
      const blockRegex = new RegExp(
        `(${blockSelector}\\s*{)([\\s\\S]*?)(})`,
        "g"
      );
      const match = blockRegex.exec(currentCSS);

      if (match) {
        let declarations = match[2];
        // Remove all border-radius properties
        declarations = declarations
          .replace(/border-radius\s*:\s*[^;]+;?/g, "")
          .replace(/border-top-left-radius\s*:\s*[^;]+;?/g, "")
          .replace(/border-top-right-radius\s*:\s*[^;]+;?/g, "")
          .replace(/border-bottom-right-radius\s*:\s*[^;]+;?/g, "")
          .replace(/border-bottom-left-radius\s*:\s*[^;]+;?/g, "")
          .trim();

        if (declarations) {
          const updated = `${match[1]}\n  ${declarations}\n${match[3]}`;
          currentCSS = currentCSS.replace(blockRegex, updated);
        } else {
          // If no declarations left, remove the entire block
          currentCSS = currentCSS.replace(blockRegex, "");
        }
        styleTag.textContent = currentCSS;
      }
    }

    // Reset radius slider
    const radiusSlider = document.getElementById("radiusField");
    const radiusBullet = document.getElementById("radiusBullet");
    const radiusFill = document.getElementById("radiusFill");
    const radiusDisplay = document.getElementById("radiusCountAnother");

    if (radiusSlider && radiusBullet && radiusFill && radiusDisplay) {
      radiusBullet.style.left = "0px";
      radiusBullet.style.transform = "translateX(-50%)";
      radiusFill.style.width = "0px";
      radiusDisplay.textContent = "0px";
    }

    // Reset radius buttons
    const allRadiusBtn = document.getElementById("allradiusBorder");
    const topLeftBtn = document.getElementById("topLeftradiusBorder");
    const topRightBtn = document.getElementById("topRightradiusBorder");
    const bottomRightBtn = document.getElementById("bottomRightradiusBorder");
    const bottomLeftBtn = document.getElementById("bottomLeftradiusBorder");

    [
      allRadiusBtn,
      topLeftBtn,
      topRightBtn,
      bottomRightBtn,
      bottomLeftBtn,
    ].forEach((btn) => {
      if (btn) btn.classList.remove("sc-bg-454545");
    });

    // Reset active radius target and state
    activeRadiusTarget = "all"; // Set to default instead of null
    currentRadiusAll = 0; // Reset the radius value

    // Reset radius button readonly state
    setRadiusButtonReadonly("all");

    // Update map and pending modifications
    const currentStyles = window.__scImageStyleMap.get(blockId) || {};
    const updatedStyles = {
      ...currentStyles,
      image: {
        ...currentStyles.image,
        styles: {
          ...currentStyles.image?.styles,
          // Remove border-radius properties
          "border-radius": undefined,
          "border-top-left-radius": undefined,
          "border-top-right-radius": undefined,
          "border-bottom-right-radius": undefined,
          "border-bottom-left-radius": undefined,
        },
      },
    };

    // Clean up undefined values
    Object.keys(updatedStyles.image.styles).forEach((key) => {
      if (updatedStyles.image.styles[key] === undefined) {
        delete updatedStyles.image.styles[key];
      }
    });

    window.__scImageStyleMap.set(blockId, updatedStyles);
    pendingBorderModifications.set(blockId, updatedStyles);

    console.log("✅ Border-radius styles reset locally");

    // Reinitialize radius controls to ensure they work properly after reset
    setTimeout(() => {
      // Force reinitialize the radius controls
      const radiusSlider = document.getElementById("radiusField");
      const radiusBullet = document.getElementById("radiusBullet");
      const radiusFill = document.getElementById("radiusFill");
      const radiusDisplay = document.getElementById("radiusCountAnother");

      if (radiusSlider && radiusBullet && radiusFill && radiusDisplay) {
        radiusBullet.style.left = "0px";
        radiusBullet.style.transform = "translateX(-50%)";
        radiusFill.style.width = "0px";
        radiusDisplay.textContent = "0px";
      }

      // Ensure radius buttons are in correct state
      setRadiusButtonReadonly("all");

      // Reattach radius drag handlers
      if (window.reattachRadiusDragHandlers) {
        window.reattachRadiusDragHandlers();
      }

      console.log("🔄 Border-radius controls reinitialized after reset");
    }, 100);
  }

  // Add reset button event listeners
  document.addEventListener("click", (e) => {
    // Check if the clicked element is a reset icon
    if (e.target.tagName === "IMG" && e.target.alt === "reset") {
      console.log("🔄 Reset icon clicked:", e.target);

      // Check which section the reset icon is in by looking at its parent containers
      const borderSection = e.target.closest("#borderSection");
      const borderRadiusReset = e.target.closest("#border-radius-reset");

      if (borderSection && !borderRadiusReset) {
        console.log(
          "🎯 Reset icon in border section - resetting border styles"
        );
        resetBorderStyles();
      } else if (borderRadiusReset) {
        console.log(
          "🎯 Reset icon in border-radius section - resetting border-radius styles"
        );
        resetBorderRadiusStyles();
      } else {
        // Fallback: check which sliders are visible
        const borderWidthSlider = document.getElementById("radiousField");
        const radiusSlider = document.getElementById("radiusField");

        if (borderWidthSlider && borderWidthSlider.offsetParent !== null) {
          console.log("🎯 Border section active - resetting border styles");
          resetBorderStyles();
        } else if (radiusSlider && radiusSlider.offsetParent !== null) {
          console.log(
            "🎯 Radius section active - resetting border-radius styles"
          );
          resetBorderRadiusStyles();
        } else {
          console.log("🎯 No specific section detected - resetting both");
          resetBorderStyles();
          resetBorderRadiusStyles();
        }
      }
    }
  });

  // Add publish button handler (like shadow controls)
  const publishButton = document.getElementById("publish");
  if (publishButton) {
    // Remove existing listener to avoid duplicates
    publishButton.removeEventListener(
      "click",
      publishButton.borderPublishHandler
    );

    // Create new handler
    publishButton.borderPublishHandler = async () => {
      try {
        await publishPendingBorderModifications(saveModificationsforImage);
      } catch (error) {
        console.error("Border publish error:", error);
      }
    };

    // Add the handler
    publishButton.addEventListener("click", publishButton.borderPublishHandler);
  }
}

export { publishPendingBorderModifications };
