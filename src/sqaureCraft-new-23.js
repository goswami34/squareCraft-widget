let pendingModifications = new Map();
// let selectedElement = null;

(async function squareCraft() {
  const Url = parent.document.location.href;
  console.log("parent", Url);
  const widgetScript = document.getElementById("sc-script");

  if (!widgetScript) {
    console.error(
      "❌ Widget script not found! Ensure the script tag exists with id 'sc-script'."
    );
    return;
  }
  let selectedElement = null;
  let widgetContainer = null;

  let widgetLoaded = false;
  let token = widgetScript.dataset?.token;
  let userId = widgetScript.dataset?.uId;
  let widgetId = widgetScript.dataset?.wId;

  if (token) {
    localStorage.setItem("sc_auth_token", token);
    document.cookie = `sc_auth_token=${token}; path=/; domain=${location.hostname}; Secure; SameSite=Lax`;
  }

  if (userId) {
    localStorage.setItem("sc_u_id", userId);
    document.cookie = `sc_u_id=${userId}; path=.squarespace.com;`;
  }

  if (widgetId) {
    localStorage.setItem("sc_w_id", widgetId);
    document.cookie = `sc_w_id=${widgetId}; path=.squarespace.com;`;
  }

  let lastClickedBlockId = null;
  let lastClickedElement = null;
  let lastAppliedAlignment = null;
  let lastActiveAlignmentElement = null;
  let selectedTextElement = null;
  let selectedSingleTextType = null;

  // Add showNotification function
  function showNotification(message, type = "info") {
    const notification = document.createElement("div");
    notification.className = `sc-notification sc-${type}`;
    notification.textContent = message;

    // Style the notification
    Object.assign(notification.style, {
      position: "fixed",
      top: "20px",
      right: "20px",
      padding: "10px 20px",
      borderRadius: "4px",
      zIndex: "10000",
      color: "white",
      backgroundColor: type === "error" ? "#ff4444" : "#4CAF50",
      boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
      transition: "opacity 0.3s ease-in-out",
    });

    document.body.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
      notification.style.opacity = "0";
      setTimeout(() => {
        document.body.removeChild(notification);
      }, 300);
    }, 3000);
  }

  function triggerLaunchAnimation() {
    let iframeDoc = null;

    try {
      const iframe = document.getElementById("sqs-site-frame");
      if (!iframe) return;

      iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      const liveBody = iframeDoc.querySelector('body[id^="collection-"]');
      if (!liveBody) return;

      injectLaunchAnimationCSS(iframeDoc);
      liveBody.classList.add("sc-launching");

      setTimeout(() => {
        liveBody.classList.remove("sc-launching");
      }, 1000);
    } catch (e) {
      console.warn("⚠️ Could not access iframe content for animation.");
    }
  }

  function applyStylesToElement(element, css) {
    if (!element || !css) return;

    const elementId = element.id;
    let styleTag = document.getElementById(`style-${elementId}`);

    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = `style-${elementId}`;
      document.head.appendChild(styleTag);
    }

    let cssText = `#${elementId}, #${elementId} h1, #${elementId} h2, #${elementId} h3, #${elementId} h4, #${elementId} p { `;
    Object.keys(css).forEach((prop) => {
      cssText += `${prop}: ${css[prop]} !important; `;
    });
    cssText += "}";

    styleTag.innerHTML = cssText;
  }
  const { getTextType } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/getTextType.js"
  );
  const { getTextTypeBold } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/getTexttypeBold.js"
  );
  // const { handleFontWeightDropdownClick } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleFontWeightDropdownClick.js"
  // );
  const { handleBlockClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleBlockClick.js"
  );
  const { handleAlignmentClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleAlignmentClick.js"
  );
  const { handleTextColorClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleTextColorClick.js"
  );
  const { typoTabSelect } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/typoTabSelect.js"
  );
  const { detectBlockElementTypes } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/components/BlockType/detectBlockElementTypes.js"
  );
  const { initImageSectionControls } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/initImageSectionControls.js"
  );
  const { initImageSectionToggleControls } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/initImageSectionToggleControls.js"
  );
  // const { initButtonSectionToggleControls } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/utils/initButtonSectionToggleControls/initButtonSectionToggleControls.js"
  // );
  // const { initImageUploadPreview } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/utils/initButtonSectionToggleControls/initImageUploadPreview.js"
  // );
  const { initImageMaskControls } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/initImageMaskControls.js"
  );
  const { getSquarespaceThemeStyles } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/getSquarespaceThemeStyles.js"
  );
  const { initBorderColorPaletteToggle } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/initBorderColorPaletteToggle.js"
  );
  const { saveModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );
  // const { initButtonFontColorPaletteToggle } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/utils/initButtonFontColorPaletteToggle/initButtonFontColorPaletteToggle.js"
  // );
  // const { initButtonStyles } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/utils/initButtonStyles/initButtonStyles.js"
  // );

  // Typography all functionality code
  const { handleBoldElementTextTransformClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Bold/handleBoldTextTransform.js"
  );
  const { handleFontSizeLink } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Link/handleFontSizeLink.js"
  );
  const { handleLinkBlockClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleLinkBlockClick.js"
  );
  const { handleTextTransformLinkClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Link/handleTextTransformLinkClick.js"
  );
  const { handleFontWeightLink } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Link/handleFontWeightLink.js"
  );
  // const { handleTextHighLinghtClick } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/Link/handleTextHighLinght.js"
  // );
  const { handleAllFontSizeClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/All/handleAllFontSize.js"
  );

  const { handleAllTextTransformClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/All/handleAllTextTransform.js"
  );
  const { handleAllTextAlignClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/All/handleAllTextAlign.js"
  );
  const { handleAllLetterSpacingClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/All/handleLetterSpeacing.js"
  );

  const { handleAllLineHeightClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/All/handleAllLineHeight.js"
  );

  const { handleAllFontWeightClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/All/handleAllFontWeight.js"
  );

  const { handleAllTextColorClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/All/handleAllTextColor.js"
  );

  const { handleFontSize } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Bold/handleFontSize.js"
  );

  const { handleAllBlockClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleAllBlockClick.js"
  );

  const { handleAllTextHighlightClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/All/handleAllTextHighlight.js"
  );

  const { handleTextHighlightColorClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleTextHighlightColorClick.js"
  );

  const { handleAllFontFamilyClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/All/handleAllFontFamily.js"
  );

  const { handleItalicBlockClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleItalicBlockClick.js"
  );

  const { handleItalicFontSizeClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Italic/handleItalicFontSize.js"
  );

  const { handleItalicFontWeightClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Italic/handleItalicFontWeight.js"
  );

  const { handleItalicTextTransformClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Italic/handleItalicTextTransform.js"
  );

  const { handleItalicTextColorClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Italic/handleItalicTextColor.js"
  );

  const { handleItalicTextHeighlightClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Italic/handleItalicTextHeighlisht.js"
  );

  const { handleItalicTextColorClickEvent } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleItalicTextColorClickEvent.js"
  );

  const { handleBoldTextColor } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Bold/handleBoldTextColor.js"
  );

  const { handleFontWeightClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Bold/handleFontWeight.js"
  );

  const { handleBoldTextTransformClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleBoldTextTransformClick.js"
  );

  const { handleBoldTextColorClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleBoldTextColorClick.js"
  );

  const { handleBoldTextHighlightClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleBoldTextHighlightClick.js"
  );

  const { handleBoldTextHighlight } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Bold/handleBoldTextHighlight.js"
  );

  const { handleItalicTextHeighlight } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Italic/handleItalicTextHeighlisht.js"
  );

  const { handleItalicTextHeighlightClickEvent } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleItalicTextHeighlightClickEvent.js"
  );

  const { handleLinkTextHighlightClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleLinkTextHighlightClick.js"
  );

  const { handleTextHighLinghtLink } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Link/handleTextHighLinghtLink.js"
  );

  // Typography all functionality code end here

  //Image all functionality code start here
  //Image border controls
  const { initImageBorderControls } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/Image/initImageBorderControls.js"
  );

  const { handleImageBorderControlsClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleImageBorderControlsClick.js"
  );

  const { saveModificationsforImage } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const { initImageShadowControls } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/Image/initImageShadowControls.js"
  );

  const { initShadowColorPalate } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/InitShadowColorPalateToggle/initShadowColorPalate.js"
  );

  const { InitImageOverLayControls } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/Image/InitImageOverLayControls.js"
  );

  const { initOverLayColorPalate } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/initOverLayColorPalate/initOverLayColorPalate.js"
  );

  const { saveImageOverlayModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const { saveImageShadowModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const { WidgetTypoSectionStateControls } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/components/WidgetTypoSection/WidgetTypoSectionStateControls/WidgetTypoSectionStateControls.js"
  );

  //Image all functionality code end here
  //Image border controls end here

  // const { parentHtmlTabClick } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/clickEvents/parentHtmlTabClick.js"
  // );

  //button all functionality code start here

  const { initButtonAdvanceStyles } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/WidgetButtonSection/WidgetButtonAdvanceStyles/WidgetButtonAdvanceStyles.js"
  );
  const { ButtonAdvanceToggleControls } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/ButtonAdvanceToggleControls/ButtonAdvanceToggleControls.js"
  );

  const {
    initHoverButtonSectionToggleControls,
    initHoverButtonEffectDropdowns,
  } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/initHoverButtonSectionToggleControls/initHoverButtonSectionToggleControls.js"
  );
  const { initButtonSectionToggleControls } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/initButtonSectionToggleControls/initButtonSectionToggleControls.js"
  );
  const { initImageUploadPreview } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/initButtonSectionToggleControls/initImageUploadPreview.js"
  );
  const { buttonTooltipControls } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/buttonTooltipControls/buttonTooltipControls.js"
  );
  const { initButtonFontColorPaletteToggle } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/initButtonFontColorPaletteToggle/initButtonFontColorPaletteToggle.js"
  );

  const {
    initButtonStyles,
    initButtonIconPositionToggle,
    initButtonIconRotationControl,
    initButtonIconSizeControl,
    initButtonIconSpacingControl,
    initButtonBorderControl,
    initButtonBorderTypeToggle,
    initButtonBorderRadiusControl,
    initButtonShadowControls,
    initButtonFontFamilyControls,
    resetAllButtonStyles,
    initButtonBorderResetHandlers,
  } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/initButtonStyles/initButtonStyles.js"
  );

  const {
    initHoverButtonShadowControls,
    initHoverButtonIconRotationControl,
    initHoverButtonIconSizeControl,
    initHoverButtonIconSpacingControl,
    initHoverButtonBorderRadiusControl,
    initHoverButtonBorderTypeToggle,
    initHoverButtonBorderControl,
    applyHoverButtonEffects,
  } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/initButtonStyles/initButtonHoverStyles.js"
  );

  const { saveButtonModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const { saveButtonBorderModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const { saveButtonShadowModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  //button all functionality code end here

  const themeColors = await getSquarespaceThemeStyles();

  document.body.addEventListener("click", (event) => {
    // if (selectedElement) {
    //   initButtonStyles(selectedElement);
    // }
    const trigger = event.target.closest("#border-color-select");

    if (trigger) {
      console.log("✅ border-color-select clicked");
      setTimeout(() => {
        initBorderColorPaletteToggle(themeColors);
      }, 100);
      return;
    }

    const triggerOne = document.getElementById("buttonFontColorPalate");
    const paletteOne = document.getElementById("button-font-color-palette");

    if (!triggerOne || !paletteOne) return;

    triggerOne.addEventListener("click", () => {
      paletteOne.classList.toggle("sc-hidden");

      // Load palette after toggle
      setTimeout(() => {
        initButtonFontColorPaletteToggle(
          themeColors,
          () => selectedElement,
          saveButtonModifications,
          (blockId, css, tagType) => {
            if (!pendingModifications.has(blockId)) {
              pendingModifications.set(blockId, []);
            }
            pendingModifications.get(blockId).push({ css, tagType });
          },
          showNotification
        );
      }, 50);
    });

    // Add trigger for image shadow color palette
    const triggerShadowOne = document.getElementById("imageFontColorPalate");
    const paletteShadowOne = document.getElementById(
      "image-font-color-palette"
    );

    if (triggerShadowOne && paletteShadowOne) {
      triggerShadowOne.addEventListener("click", () => {
        paletteShadowOne.classList.toggle("sc-hidden");

        // Load palette after toggle
        setTimeout(() => {
          initShadowColorPalate(
            themeColors,
            () => selectedElement,
            "",
            saveImageShadowModifications
          );
        }, 50);
      });

      // Close palette when clicking outside
      document.addEventListener("click", (e) => {
        if (
          !triggerShadowOne.contains(e.target) &&
          !paletteShadowOne.contains(e.target)
        ) {
          paletteShadowOne.classList.add("sc-hidden");
        }
      });
    }

    const triggerOverLayOne = document.getElementById("overLayFontColorPalate");
    const paletteOverLayOne = document.getElementById("overlay-color-palette");

    if (!triggerOverLayOne || !paletteOverLayOne) return;

    triggerOverLayOne.addEventListener("click", () => {
      paletteOverLayOne.classList.toggle("sc-hidden");

      // Load palette after toggle
      setTimeout(() => {
        initOverLayColorPalate(themeColors, () => selectedElement);
      }, 50);
    });

    // const hoverFontTrigger = event.target.closest(
    //   "#hover-buttonFontColorPalate"
    // );
    // if (hoverFontTrigger) {
    //   const panel = document.getElementById("hover-button-font-color-palette");
    //   if (panel) {
    //     panel.classList.toggle("sc-hidden");
    //   }

    //   setTimeout(() => {
    //     initShadowColorPalate(themeColors, () => selectedElement, "hover-");
    //   }, 100);
    // }

    // const themeColors = getSquarespaceThemeStyles();

    // setTimeout(() => {
    //   initButtonFontColorPaletteToggle(themeColors, selectedElement);
    // }, 100);

    setTimeout(initImageSectionControls, 100);
    const clickedBlock = event.target.closest('[id^="block-"]');
    console.log("clickedBlock", clickedBlock);

    // if (clickedBlock) {
    //   waitForElement("#typoSection, #imageSection,  #buttonSection")
    //     .then(() => {
    //       detectBlockElementTypes(clickedBlock);
    //     })
    //     .catch((error) => {
    //       console.error(error.message);
    //     });
    // }
    // const clickedBlock = event.target.closest('[id^="block-"]');
    if (clickedBlock) {
      waitForElement("#typoSection, #imageSection, #buttonSection")
        .then(() => {
          detectBlockElementTypes(clickedBlock);
        })
        .catch((error) => {
          console.error(error.message);
        });
    }

    // const clickedBlockOne = event?.target?.closest('[id^="block-"]');
    // console.log("clickedBlockOne", clickedBlockOne);

    // const clickedBlockOne = parent.document
    //   ?.querySelector(event.target)
    //   ?.closest('[id^="block-"]');
    // console.log("clickedBlockOne", clickedBlockOne);

    //button all functionality code start here
    if (selectedElement) {
      initButtonStyles(() => selectedElement);
    }
    if (selectedElement) {
      initButtonAdvanceStyles(() => selectedElement);
    }

    if (selectedElement) {
      initHoverButtonIconRotationControl(() => selectedElement);
    }
    if (selectedElement) {
      initHoverButtonIconSizeControl(() => selectedElement);
    }
    if (selectedElement) {
      initHoverButtonIconSpacingControl(() => selectedElement);
    }
    if (selectedElement) {
      initHoverButtonBorderRadiusControl(() => selectedElement);
    }
    if (selectedElement) {
      initHoverButtonBorderTypeToggle(() => selectedElement);
    }
    if (selectedElement) {
      initHoverButtonBorderControl(() => selectedElement);
    }
    if (selectedElement) {
      applyHoverButtonEffects(() => selectedElement);
    }

    setTimeout(() => {
      handleBlockClick(event, {
        getTextType,
        selectedElement,
        setSelectedElement: (val) => (selectedElement = val),
        setLastClickedBlockId: (val) => (lastClickedBlockId = val),
        setLastClickedElement: (val) => (lastClickedElement = val),
        setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
        setLastActiveAlignmentElement: (val) =>
          (lastActiveAlignmentElement = val),
      });

      initButtonFontColorPaletteToggle(
        themeColors,
        () => selectedElement,
        saveButtonModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
      initButtonIconPositionToggle(
        () => selectedElement,
        saveButtonModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
      initHoverButtonShadowControls(
        () => selectedElement,
        saveButtonModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
      initButtonIconRotationControl(
        () => selectedElement,
        saveButtonModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
      initButtonIconSizeControl(
        () => selectedElement,
        saveButtonModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
      initButtonIconSpacingControl(
        () => selectedElement,
        saveButtonModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
      initButtonBorderControl(
        () => selectedElement,
        saveButtonBorderModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
      initButtonShadowControls(
        () => selectedElement,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification,
        saveButtonShadowModifications
      );
      resetAllButtonStyles(
        () => selectedElement,
        saveButtonModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
      initButtonBorderResetHandlers(
        () => selectedElement,
        saveButtonModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
      initButtonFontFamilyControls(
        () => selectedElement,
        saveButtonModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );

      initButtonStyles(
        () => selectedElement,
        saveButtonModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );

      initButtonBorderTypeToggle(
        () => selectedElement,
        (selected) => {
          if (selected) {
            const event = new Event("reapplyBorder");
            selected.dispatchEvent(event);
          }
        },
        saveButtonBorderModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
      initButtonBorderRadiusControl(
        () => selectedElement,
        saveButtonBorderModifications
      );
      // WidgetTypoSectionStateControls();
    }, 50);

    //button all functionality code end here

    handleBlockClick(event, {
      getTextType,
      selectedElement,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      setSelectedElement: (val) => (selectedElement = val),
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      setLastClickedElement: (val) => (lastClickedElement = val),
      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
    });

    handleAlignmentClick(event, {
      lastClickedElement,
      getTextType,
      applyStylesToElement,
      lastAppliedAlignment,
      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      userId,
      token,
      widgetId,
    });

    // Typography all functionality code start here
    handleAllBlockClick(event, {
      getTextType,
      selectedElement,
      setSelectedElement: (val) => (selectedElement = val),
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      setLastClickedElement: (val) => (lastClickedElement = val),
      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),
      lastClickedBlockId,
    });

    handleItalicBlockClick(event, {
      getTextType,
      selectedElement,
      setSelectedElement: (val) => (selectedElement = val),
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      setLastClickedElement: (val) => (lastClickedElement = val),
      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),
      lastClickedBlockId,
    });

    handleLinkBlockClick(event, {
      getTextType,
      selectedElement,
      setSelectedElement: (val) => (selectedElement = val),
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      setLastClickedElement: (val) => (lastClickedElement = val),
      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),
    });

    handleBoldTextTransformClick(event, {
      getTextType,
      selectedElement,
      handleFontWeightClick,
      addPendingModification,
      showNotification,
      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      setSelectedElement: (val) => (selectedElement = val),
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      setLastClickedElement: (val) => (lastClickedElement = val),
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),
    });

    handleFontSize(event, {
      lastClickedElement,
      getTextType,
      getTextTypeBold,
      applyStylesToElement,
      lastAppliedAlignment,
      // selectedTextType,
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),

      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      setLastClickedElement: (val) => (lastClickedElement = val),
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });

    handleBoldElementTextTransformClick(event, {
      lastClickedElement,
      getTextType,
      applyStylesToElement,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),
      lastAppliedAlignment,
      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },

      showNotification: showNotification,
    });

    handleFontWeightClick(event, {
      lastClickedElement,
      getTextType,
      applyStylesToElement,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),
      lastAppliedAlignment,
      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      selectedElement,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },

      showNotification: showNotification,
    });

    //Link code start here

    handleFontSizeLink(event, {
      lastClickedElement,
      getTextType,
      getTextTypeBold,
      applyStylesToElement,
      lastAppliedAlignment,
      // selectedTextType,
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),

      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      setLastClickedElement: (val) => (lastClickedElement = val),
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });

    handleTextTransformLinkClick(event, {
      lastClickedElement,
      getTextType,
      applyStylesToElement,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),
      lastAppliedAlignment,
      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },

      showNotification: showNotification,
    });

    //Link code end here

    //All font size code start here

    handleAllFontSizeClick(event, {
      lastClickedElement,
      getTextType,
      getTextTypeBold,
      applyStylesToElement,
      lastAppliedAlignment,
      // selectedTextType,
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),

      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      setLastClickedElement: (val) => (lastClickedElement = val),
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });

    handleAllTextTransformClick(event, {
      lastClickedElement,
      getTextType,
      getTextTypeBold,
      applyStylesToElement,
      lastAppliedAlignment,
      // selectedTextType,
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),

      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      setLastClickedElement: (val) => (lastClickedElement = val),
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });

    handleAllTextAlignClick(event, {
      lastClickedElement,
      getTextType,
      getTextTypeBold,
      applyStylesToElement,
      lastAppliedAlignment,
      // selectedTextType,
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),

      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      setLastClickedElement: (val) => (lastClickedElement = val),
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });

    handleAllLetterSpacingClick(event, {
      lastClickedElement,
      getTextType,
      getTextTypeBold,
      applyStylesToElement,
      lastAppliedAlignment,
      // selectedTextType,
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),

      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      setLastClickedElement: (val) => (lastClickedElement = val),
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });

    handleAllLineHeightClick(event, {
      lastClickedElement,
      getTextType,
      getTextTypeBold,
      applyStylesToElement,
      lastAppliedAlignment,
      // selectedTextType,
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),

      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      setLastClickedElement: (val) => (lastClickedElement = val),
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });

    handleAllFontWeightClick(event, {
      lastClickedElement,
      getTextType,
      getTextTypeBold,
      applyStylesToElement,
      lastAppliedAlignment,
      // selectedTextType,
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),

      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      setLastClickedElement: (val) => (lastClickedElement = val),
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });

    handleAllTextColorClick(event, {
      handleAllTextColorClick,
      lastClickedElement,
      getTextType,
      getTextTypeBold,
      applyStylesToElement,
      lastAppliedAlignment,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),

      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      setLastClickedElement: (val) => (lastClickedElement = val),
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });

    //All font size code end here

    handleTextColorClick(event, lastClickedElement, applyStylesToElement, {
      handleAllTextColorClick,
      lastClickedElement,
      selectedSingleTextType,
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification,
    });

    handleTextHighlightColorClick(
      event,
      lastClickedElement,
      applyStylesToElement,
      {
        handleAllTextHighlightClick,
        lastClickedElement,
        selectedSingleTextType,
        addPendingModification: (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification,
      }
    );

    handleAllFontFamilyClick(event, {
      lastClickedElement,
      selectedSingleTextType,
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification,
    });

    //Italic text highlight code start here
    // handleItalicTextHeighlightClick(event, {
    //   lastClickedElement,
    //   applyStylesToElement,
    //   selectedSingleTextType,
    //   addPendingModification: (blockId, css, tagType) => {
    //     if (!pendingModifications.has(blockId)) {
    //       pendingModifications.set(blockId, []);
    //     }
    //     pendingModifications.get(blockId).push({ css, tagType });
    //   },
    //   showNotification,
    // });
    //Italic text highlight code end here

    // Predefined font list for faster dropdown
    const predefinedFonts = [
      "Roboto",
      "Open Sans",
      "Lato",
      "Montserrat",
      "Oswald",
      "Poppins",
      "Raleway",
      "Playfair Display",
      "Merriweather",
      "Ubuntu",
      "Rubik",
      "Inter",
      "Nunito",
      "Muli",
      "PT Sans",
      "Work Sans",
      "Fira Sans",
      "Manrope",
      "Mulish",
      "Josefin Sans",
    ];

    // Function to inject Google Fonts link dynamically
    function loadSelectedFont(fontFamily) {
      const fontName = fontFamily.replace(/\s+/g, "+"); // Replace spaces with '+'
      const linkId = `font-${fontName}`;

      if (!document.getElementById(linkId)) {
        const link = document.createElement("link");
        link.id = linkId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${fontName}&display=swap`;
        document.head.appendChild(link);
        console.log(`✅ Font loaded: ${fontFamily}`);
      }
    }

    // Main function to load fonts into the dropdown
    function loadFontFamiliesIntoDropdown() {
      const fontFamilyDropdown = document.getElementById(
        "squareCraftAllFontFamily"
      );

      if (!fontFamilyDropdown) {
        console.error("❌ Font family dropdown not found.");
        return;
      }

      // First add default option
      fontFamilyDropdown.innerHTML = `
    <option value="" selected disabled hidden>Select Font</option>
  `;

      // Add predefined fonts
      predefinedFonts.forEach((font) => {
        const option = document.createElement("option");
        option.value = font;
        option.textContent = font;
        fontFamilyDropdown.appendChild(option);
      });

      console.log("✅ Predefined fonts loaded into dropdown.");

      // Add change event
      fontFamilyDropdown.addEventListener("change", (event) => {
        const selectedFont = event.target.value;
        fontFamilyDropdown.style.color = "black"; // Make selected font name black
        loadSelectedFont(selectedFont); // Inject font link
      });
    }

    loadFontFamiliesIntoDropdown();

    // Load font families into dropdown for all font family end here

    // Make the selected font-family name color black after choosing
    const fontFamilyDropdown = document.getElementById(
      "squareCraftAllFontFamily"
    );
    if (fontFamilyDropdown) {
      fontFamilyDropdown.addEventListener("change", (event) => {
        fontFamilyDropdown.style.color = "black";
      });
    }

    //italic code start here

    //italic font size code start here

    handleItalicFontSizeClick(event, {
      lastClickedElement,
      getTextType,
      getTextTypeBold,
      applyStylesToElement,
      lastAppliedAlignment,
      // selectedTextType,
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),

      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      setLastClickedElement: (val) => (lastClickedElement = val),
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });

    //italic font size code end here

    //italic font weight code start here
    handleItalicFontWeightClick(event, {
      lastClickedElement,
      getTextType,
      getTextTypeBold,
      applyStylesToElement,
      lastAppliedAlignment,
      // selectedTextType,
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),

      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      setLastClickedElement: (val) => (lastClickedElement = val),
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });
    //italic font weight code end here

    //italic text transform code start here
    handleItalicTextTransformClick(event, {
      lastClickedElement,
      getTextType,
      getTextTypeBold,
      applyStylesToElement,
      lastAppliedAlignment,
      // selectedTextType,
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),

      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      setLastClickedElement: (val) => (lastClickedElement = val),
      userId,
      saveModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });

    //italic text transform code end here

    //italic text color code start here
    // handleItalicTextColorClick(event, {
    //   handleAllTextColorClick,
    //   lastClickedElement,
    //   getTextType,
    //   getTextTypeBold,
    //   applyStylesToElement,
    //   lastAppliedAlignment,
    //   selectedSingleTextType,
    //   setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
    //   selectedTextElement,
    //   setSelectedTextElement: (clickedTag) =>
    //     (selectedTextElement = clickedTag),

    //   setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
    //   lastActiveAlignmentElement,
    //   setLastActiveAlignmentElement: (val) =>
    //     (lastActiveAlignmentElement = val),
    //   lastClickedBlockId,
    //   setLastClickedElement: (val) => (lastClickedElement = val),
    //   userId,
    //   saveModifications,
    //   handleBlockClick,
    //   setLastClickedBlockId: (val) => (lastClickedBlockId = val),
    //   token,
    //   widgetId,
    //   setSelectedElement: (val) => (selectedElement = val), // Add this line
    //   addPendingModification: (blockId, css, tagType) => {
    //     if (!pendingModifications.has(blockId)) {
    //       pendingModifications.set(blockId, []);
    //     }
    //     pendingModifications.get(blockId).push({ css, tagType });
    //   },
    //   showNotification: showNotification,
    // });

    handleItalicTextColorClickEvent(
      event,
      lastClickedElement,
      applyStylesToElement,
      {
        handleAllTextColorClick,
        lastClickedElement,
        selectedSingleTextType,
        addPendingModification: (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification: showNotification,
      }
    );

    const activeTab = document.querySelector(".sc-selected-tab");
    if (!activeTab || !activeTab.id.includes("italic")) {
      handleItalicTextColorClick(
        event,
        lastClickedElement,
        applyStylesToElement,
        {
          handleAllTextColorClick,
          lastClickedElement,
          selectedSingleTextType,
          addPendingModification: (blockId, css, tagType) => {
            if (!pendingModifications.has(blockId)) {
              pendingModifications.set(blockId, []);
            }
            pendingModifications.get(blockId).push({ css, tagType });
          },
          showNotification,
        }
      );
    }

    //italic text color code end here

    //italic text highlight code start here

    handleItalicTextHeighlightClickEvent(
      event,
      lastClickedElement,
      applyStylesToElement,
      {
        handleAllTextColorClick,
        lastClickedElement,
        selectedSingleTextType,
        addPendingModification: (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification,
      }
    );

    const activeItalicHighlightTab = document.querySelector(".sc-selected-tab");
    if (
      !activeItalicHighlightTab ||
      !activeItalicHighlightTab.id.includes("italic")
    ) {
      handleItalicTextHeighlight(
        event,
        lastClickedElement,
        applyStylesToElement,
        {
          handleAllTextColorClick,
          lastClickedElement,
          selectedSingleTextType,
          addPendingModification: (blockId, css, tagType) => {
            if (!pendingModifications.has(blockId)) {
              pendingModifications.set(blockId, []);
            }
            pendingModifications.get(blockId).push({ css, tagType });
          },
          showNotification,
        }
      );
    }

    //italic text highlight code end here

    // bold text color code start here

    // bold text color code end here
    handleBoldTextColorClick(event, lastClickedElement, applyStylesToElement, {
      handleAllTextColorClick,
      lastClickedElement,
      selectedSingleTextType,
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification,
    });

    const activeBoldTab = document.querySelector(".sc-selected-tab");
    if (!activeBoldTab || !activeBoldTab.id.includes("italic")) {
      handleBoldTextColor(event, lastClickedElement, applyStylesToElement, {
        handleAllTextColorClick,
        lastClickedElement,
        selectedSingleTextType,
        addPendingModification: (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification,
      });
    }

    //bold text color code start here

    //bold text highlight code start here
    handleBoldTextHighlightClick(
      event,
      lastClickedElement,
      applyStylesToElement,
      {
        handleAllTextColorClick,
        lastClickedElement,
        selectedSingleTextType,
        addPendingModification: (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification,
      }
    );

    const activeBoldHighlightTab = document.querySelector(".sc-selected-tab");
    if (
      !activeBoldHighlightTab ||
      !activeBoldHighlightTab.id.includes("italic")
    ) {
      handleBoldTextHighlight(event, lastClickedElement, applyStylesToElement, {
        handleAllTextColorClick,
        lastClickedElement,
        selectedSingleTextType,
        addPendingModification: (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification,
      });
    }
    //bold text highlight code end here

    // Typography all functionality code end

    //link text highlight code start here
    handleLinkTextHighlightClick(
      event,
      lastClickedElement,
      applyStylesToElement,
      {
        handleAllTextColorClick,
        lastClickedElement,
        selectedSingleTextType,
        addPendingModification: (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification,
      }
    );

    const activeLinkHighlightTab = document.querySelector(".sc-selected-tab");
    if (
      !activeLinkHighlightTab ||
      !activeLinkHighlightTab.id.includes("link")
    ) {
      handleTextHighLinghtLink(
        event,
        lastClickedElement,
        applyStylesToElement,
        {
          handleAllTextColorClick,
          lastClickedElement,
          selectedSingleTextType,
          addPendingModification: (blockId, css, tagType) => {
            if (!pendingModifications.has(blockId)) {
              pendingModifications.set(blockId, []);
            }
            pendingModifications.get(blockId).push({ css, tagType });
          },
          showNotification,
        }
      );
    }
    //link text highlight code end here

    //Image section code start here

    initImageBorderControls(event, {
      lastClickedElement,
      getTextType,
      getTextTypeBold,
      applyStylesToElement,
      lastAppliedAlignment,
      // selectedTextType,
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),

      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      setLastClickedElement: (val) => (lastClickedElement = val),
      userId,
      saveModificationsforImage,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });

    InitImageOverLayControls(event, {
      lastClickedElement,
      getTextType,
      getTextTypeBold,
      applyStylesToElement,
      lastAppliedAlignment,
      // selectedTextType,
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      selectedSingleTextType,
      setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
      selectedTextElement,
      setSelectedTextElement: (clickedTag) =>
        (selectedTextElement = clickedTag),

      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      lastActiveAlignmentElement,
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      lastClickedBlockId,
      setLastClickedElement: (val) => (lastClickedElement = val),
      userId,
      saveImageOverlayModifications,
      handleBlockClick,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      token,
      widgetId,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });

    // initImageShadowControls(event, {
    //   lastClickedElement,
    //   getTextType,
    //   getTextTypeBold,
    //   applyStylesToElement,
    //   lastAppliedAlignment,
    //   // selectedTextType,
    //   // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
    //   selectedSingleTextType,
    //   setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
    //   selectedTextElement,
    //   setSelectedTextElement: (clickedTag) =>
    //     (selectedTextElement = clickedTag),

    //   setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
    //   lastActiveAlignmentElement,
    //   setLastActiveAlignmentElement: (val) =>
    //     (lastActiveAlignmentElement = val),
    //   lastClickedBlockId,
    //   setLastClickedElement: (val) => (lastClickedElement = val),
    //   userId,
    //   saveModificationsforImage,
    //   handleBlockClick,
    //   setLastClickedBlockId: (val) => (lastClickedBlockId = val),
    //   token,
    //   widgetId,
    //   setSelectedElement: (val) => (selectedElement = val), // Add this line
    //   addPendingModification: (blockId, css, tagType) => {
    //     if (!pendingModifications.has(blockId)) {
    //       pendingModifications.set(blockId, []);
    //     }
    //     pendingModifications.get(blockId).push({ css, tagType });
    //   },
    //   showNotification: showNotification,
    // });

    //Image section code end here

    // initImageShadowControls(() => selectedElement, saveModificationsforImage);

    initImageShadowControls(() => {
      if (!selectedElement) {
        console.warn("⚠️ selectedElement not defined yet.");
        return null;
      }
      return selectedElement;
    }, saveImageShadowModifications);

    handleTextColorClick(event, lastClickedElement, applyStylesToElement);
    // handleFontWeightDropdownClick(event);
    typoTabSelect(event);
  });

  document.body.addEventListener("click", (event) => {
    const dropdownTrigger = event.target.closest("#font-weight-dropdown");
    const dropdownList = document.getElementById("font-weight-dropdown-list");

    if (dropdownTrigger) {
      if (dropdownList.classList.contains("sc-hidden")) {
        dropdownList.classList.remove("sc-hidden");
        console.log("✅ sc-hidden removed: dropdown shown");
      } else {
        dropdownList.classList.add("sc-hidden");
        console.log("✅ sc-hidden added: dropdown hidden");
      }
    }
  });

  async function fetchModifications(retries = 3) {
    const module = await import(
      "https://goswami34.github.io/squareCraft-widget/html.js"
    );
    const htmlString = module.html();

    if (
      typeof htmlString === "string" &&
      widgetContainer &&
      widgetContainer.innerHTML.trim() === ""
    ) {
      widgetContainer.innerHTML = htmlString;
    }

    setTimeout(() => {
      if (typeof module.initToggleSwitch === "function") {
        module.initToggleSwitch();
      }
    }, 200);

    const isEnabled = localStorage.getItem("sc_enabled") !== "false";

    if (!isEnabled) {
      return;
    }

    const pageId = document
      .querySelector("article[data-page-sections]")
      ?.getAttribute("data-page-sections");
    if (!pageId) return;

    if (!token || !userId) {
      console.warn("Missing authentication data");
      return;
    }

    try {
      const response = await fetch(
        `https://admin.squareplugin.com/api/v1/get-modifications?userId=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (!data.modifications || !Array.isArray(data.modifications)) {
        console.warn("⚠️ No modifications found or invalid format");
        return;
      }

      const modificationMap = new Map();

      data.modifications.forEach((mod) => {
        if (mod.pageId === pageId) {
          mod.elements.forEach((elem) => {
            if (elem.css) {
              modificationMap.set(elem.elementId, elem.css);
            }
          });
        }
      });

      const observer = new MutationObserver(() => {
        modificationMap.forEach((css, elementId) => {
          const element = document.getElementById(elementId);
          if (element) {
            Object.entries(css).forEach(([prop, value]) => {
              element.style.setProperty(prop, value, "important");
            });

            const nestedElements =
              element.querySelectorAll("h1, h2, h3, h4, p");
            nestedElements.forEach((nestedElem) => {
              Object.entries(css).forEach(([prop, value]) => {
                nestedElem.style.setProperty(prop, value, "important");
              });
            });

            if (!element.classList.contains("sc-font-modified")) {
              element.classList.add("sc-font-modified");
            }

            modificationMap.delete(elementId);
          }
        });
      });

      observer.observe(document.body, { childList: true, subtree: true });
    } catch (error) {
      console.error("❌ Error Fetching Modifications:", error);
      if (retries > 0) {
        setTimeout(() => fetchModifications(retries - 1), 2000);
      }
    }
  }

  async function fetchImageModifications() {
    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");
    const pageId = document
      .querySelector("article[data-page-sections]")
      ?.getAttribute("data-page-sections");

    if (!userId || !token || !widgetId || !pageId) {
      console.warn("⚠️ Missing credentials or page ID");
      return;
    }

    try {
      const res = await fetch(
        `https://admin.squareplugin.com/api/v1/get-image-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      const elements = result.elements || [];

      elements.forEach(({ elementId, css }) => {
        // --- Apply main block styles ---
        const imageStyles = css?.image?.styles || css?.image || {};
        const selector =
          css?.image?.selector || `#${elementId} div.sqs-image-content`;

        if (Object.keys(imageStyles).length > 0) {
          const styleTagId = `sc-style-${elementId}`;
          let styleTag = document.getElementById(styleTagId);
          if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = styleTagId;
            document.head.appendChild(styleTag);
          }

          let cssText = `${selector} {`;
          Object.entries(imageStyles).forEach(([prop, value]) => {
            if (value !== null && value !== undefined && value !== "null") {
              cssText += `${prop}: ${value} !important; `;
            }
          });
          cssText += "}";
          styleTag.textContent = cssText;
        }

        // --- Apply img tag styles ---
        const imageTagBlock = css?.imageTag;
        if (imageTagBlock?.selector && imageTagBlock?.styles) {
          const imgTagId = `sc-img-style-${elementId}`;
          let imgTag = document.getElementById(imgTagId);
          if (!imgTag) {
            imgTag = document.createElement("style");
            imgTag.id = imgTagId;
            document.head.appendChild(imgTag);
          }

          let imgCSS = `${imageTagBlock.selector} {`;
          Object.entries(imageTagBlock.styles).forEach(([prop, val]) => {
            if (val !== null && val !== undefined && val !== "null") {
              imgCSS += `${prop}: ${val} !important; `;
            }
          });
          imgCSS += "}";
          imgTag.textContent = imgCSS;
        }

        const block = document.getElementById(elementId);
        if (block) block.classList.add("sc-image-styled");

        ///////// this is new code

        // ✅ Sync UI controls with restored styles
        // const styleValues = css?.image?.styles || {};
        // const blockElement = document.getElementById(elementId);
        // if (!blockElement) return;

        // const imageContent = blockElement.querySelector(
        //   "div.sqs-image-content"
        // );
        // if (!imageContent) return;

        // // Select this image for syncing controls
        // document.querySelectorAll(".sqs-image-content").forEach((img) => {
        //   img.classList.remove("sc-selected-image");
        // });
        // imageContent.classList.add("sc-selected-image");

        // // ✅ Border Width Sync
        // const bw = styleValues["border-width"];
        // if (bw && document.getElementById("radiousField")) {
        //   const width = parseInt(bw);
        //   const slider = document.getElementById("radiousField");
        //   const bullet = document.getElementById("radiousBullet");
        //   const fill = document.getElementById("radiousFill");
        //   const display = document.getElementById("radiousCount");

        //   const sliderWidth = slider.offsetWidth;
        //   const percent = width / 100;
        //   const px = percent * sliderWidth;

        //   bullet.style.left = `${px}px`;
        //   bullet.style.transform = "translateX(-50%)";
        //   fill.style.width = `${px}px`;
        //   display.textContent = `${width}px`;
        // }

        // // ✅ Border Color Sync
        // const color = styleValues["border-color"];
        // if (color) {
        //   const code = document.getElementById("color-code");
        //   if (code) code.textContent = color;
        // }

        // // ✅ Border Style Sync
        // const style = styleValues["border-style"];
        // const styleBtnMap = {
        //   solid: "borderStyleSolid",
        //   dashed: "borderStyleDashed",
        //   dotted: "borderStyleDotted",
        // };
        // if (style && styleBtnMap[style]) {
        //   const btn = document.getElementById(styleBtnMap[style]);
        //   if (btn) {
        //     document
        //       .querySelectorAll(
        //         "#borderStyleSolid, #borderStyleDashed, #borderStyleDotted"
        //       )
        //       .forEach((b) => b.classList.remove("sc-bg-454545"));
        //     btn.classList.add("sc-bg-454545");
        //   }
        // }

        // // ✅ Border Radius Sync (main/all)
        // const radius = styleValues["border-radius"];
        // if (radius && document.getElementById("radiusField")) {
        //   const r = parseInt(radius);
        //   const slider = document.getElementById("radiusField");
        //   const bullet = document.getElementById("radiusBullet");
        //   const fill = document.getElementById("radiusFill");
        //   const display = document.getElementById("radiusCountAnother");

        //   const sliderWidth = slider.offsetWidth;
        //   const percent = r / 100;
        //   const px = percent * sliderWidth;

        //   bullet.style.left = `${px}px`;
        //   bullet.style.transform = "translateX(-50%)";
        //   fill.style.width = `${px}px`;
        //   display.textContent = `${r}px`;
        // }
      });

      console.log("✅ Applied styles to all image elements");
    } catch (error) {
      console.error(
        "❌ Failed to fetch all image modifications:",
        error.message
      );
    }
  }

  async function fetchImageOverlayModifications() {
    try {
      const userId = localStorage.getItem("sc_u_id");
      const token = localStorage.getItem("sc_auth_token");
      const widgetId = localStorage.getItem("sc_w_id");
      const pageId = document
        .querySelector("article[data-page-sections]")
        ?.getAttribute("data-page-sections");

      if (!userId || !token || !widgetId || !pageId) {
        console.warn(
          "Missing required data for fetching overlay modifications"
        );
        return;
      }

      // Get all image blocks on the page
      const imageBlocks = document.querySelectorAll(
        '[id^="block-yui_3_17_2_1_"]'
      );
      console.log("Found image blocks:", imageBlocks);

      // Fetch modifications for each image block
      for (const block of imageBlocks) {
        const elementId = block.id;
        const url = `https://admin.squareplugin.com/api/v1/get-image-overlay-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}&elementId=${elementId}`;
        console.log("Fetching from URL:", url);

        try {
          const response = await fetch(url, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          if (!response.ok) {
            if (response.status === 404) {
              console.log(
                `No overlay modifications found for block: ${elementId}`
              );
              continue;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          console.log(
            `✅ Fetched overlay modifications for block ${elementId}:",`,
            data
          );

          // FIX: Use data.elements, not data.modifications
          if (data && data.elements) {
            data.elements.forEach((element) => {
              if (element.elementId === elementId && element.overlayCSS) {
                const selector = element.overlayCSS.selector;
                const styles = element.overlayCSS.styles;

                // Debug: Log selector and check if element exists
                console.log("[Overlay Injection] Selector:", selector);
                const targetElem = document.querySelector(
                  selector.split("::")[0]
                );
                console.log(
                  "[Overlay Injection] Element exists:",
                  !!targetElem
                );

                let cssText = `${selector} {`;
                cssText += "position: absolute !important; "; // Always add position: absolute
                Object.entries(styles).forEach(([prop, value]) => {
                  if (
                    value !== null &&
                    value !== undefined &&
                    value !== "null"
                  ) {
                    if (prop === "content") {
                      cssText += `content: "${value}" !important; `;
                    } else {
                      cssText += `${prop}: ${value} !important; `;
                    }
                  }
                });
                cssText += "}";

                // Inject style tag
                const styleTagId = `sc-overlay-style-${element.elementId}`;
                let styleTag = document.getElementById(styleTagId);
                if (!styleTag) {
                  styleTag = document.createElement("style");
                  styleTag.id = styleTagId;
                  document.head.appendChild(styleTag);
                }
                styleTag.textContent = cssText;
                console.log("[Overlay Injection] Injected CSS:", cssText);
              }
            });
          }
        } catch (error) {
          console.error(
            `❌ Failed to fetch modifications for block ${elementId}:",`,
            error
          );
          continue;
        }
      }
    } catch (error) {
      console.error("❌ Failed to fetch image overlay modifications:", error);
      return null;
    }
  }

  async function fetchImageShadowModifications() {
    try {
      const token = localStorage.getItem("sc_auth_token");
      const userId = localStorage.getItem("sc_u_id");
      const widgetId = localStorage.getItem("sc_w_id");

      const pageId = document
        .querySelector("article[data-page-sections]")
        ?.getAttribute("data-page-sections");

      // Only select blocks that actually contain an image
      const allBlocks = document.querySelectorAll('[id^="block-"]');
      const imageBlocks = Array.from(allBlocks).filter((block) =>
        block.querySelector("img")
      );

      for (const block of imageBlocks) {
        const elementId = block.id;

        // Debug log all IDs used for the API call
        console.log("[fetchImageShadowModifications] IDs:", {
          userId,
          widgetId,
          pageId,
          elementId,
        });

        if (!token || !userId || !widgetId || !pageId || !elementId) {
          console.warn("❌ Missing required auth or page info");
          continue;
        }

        const apiUrl = `https://admin.squareplugin.com/api/v1/get-image-shadow-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}&elementId=${elementId}`;
        console.log("[fetchImageShadowModifications] Fetching:", apiUrl);

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status === 404) {
          // No shadow data for this block, not an error
          // console.info(`ℹ️ No shadow data for block: ${elementId}`);
          continue;
        }
        if (!response.ok) {
          console.error(
            `❌ Failed to fetch shadow for block: ${elementId} (status: ${response.status})`
          );
          continue;
        }

        // Log the API response for debugging
        const data = await response.json();
        console.log(
          "[fetchImageShadowModifications] API response for",
          elementId,
          data
        );
        const css = data?.element?.css;

        if (!css || !css.image?.selector || !css.image?.styles) {
          console.warn(`⚠️ Incomplete CSS data for block ${elementId}`);
          continue;
        }

        // Inject image styles
        const selector = css.image.selector;
        const styles = css.image.styles;

        // Debug: Log selector and check if element exists
        console.log("[Shadow Injection] Selector:", selector);
        const targetElem = document.querySelector(selector);
        console.log("[Shadow Injection] Element exists:", !!targetElem);

        if (Object.keys(styles).length > 0) {
          const styleTagId = `sc-shadow-style-${elementId}`;
          let styleTag = document.getElementById(styleTagId);
          if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = styleTagId;
            document.head.appendChild(styleTag);
          }

          let cssText = `${selector} {`;
          Object.entries(styles).forEach(([prop, value]) => {
            if (value !== null && value !== undefined && value !== "null") {
              cssText += `${prop}: ${value} !important; `;
            }
          });
          cssText += "}";

          styleTag.textContent = cssText;
          console.log("[Shadow Injection] Injected CSS:", cssText);
        }

        // Optional: imageTag styles
        if (css.imageTag?.selector && css.imageTag?.styles) {
          const tagStyleId = `sc-image-tag-style-${elementId}`;
          let tagStyle = document.getElementById(tagStyleId);
          if (!tagStyle) {
            tagStyle = document.createElement("style");
            tagStyle.id = tagStyleId;
            document.head.appendChild(tagStyle);
          }

          tagStyle.textContent = `
            ${css.imageTag.selector} {
              ${Object.entries(css.imageTag.styles)
                .map(([key, value]) => `${key}: ${value} !important;`)
                .join("\n")}
            }
          `;
        }

        // Set overflow: visible if shadow is present
        const blurVal = styles["box-shadow"]?.split(" ")[2];
        if (blurVal && parseInt(blurVal) > 0) {
          const overflowStyleId = `sc-overflow-style-${elementId}`;
          let overflowStyle = document.getElementById(overflowStyleId);
          if (!overflowStyle) {
            overflowStyle = document.createElement("style");
            overflowStyle.id = overflowStyleId;
            document.head.appendChild(overflowStyle);
          }

          overflowStyle.textContent = `
            #${elementId} .intrinsic, #${elementId} .sqs-image {
              overflow: visible !important;
            }
          `;
        }
      }
    } catch (err) {
      console.error("❌ Error fetching image shadow modifications:", err);
    }
  }

  // Utility: Apply styles as external CSS (not inline)
  function applyStylesAsExternalCSS(
    selector,
    styles,
    styleIdPrefix = "sc-btn-style"
  ) {
    const styleId = `${styleIdPrefix}-${selector.replace(
      /[^a-zA-Z0-9-_]/g,
      ""
    )}`;
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
    let cssText = `${selector} {`;
    Object.entries(styles).forEach(([prop, value]) => {
      cssText += `${prop}: ${value} !important; `;
    });
    cssText += "}";
    styleTag.textContent = cssText;
  }

  // Fetch and apply button modifications from the backend
  async function fetchButtonModifications(blockId = null) {
    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");
    const pageId = document
      .querySelector("article[data-page-sections]")
      ?.getAttribute("data-page-sections");

    if (!userId || !token || !widgetId || !pageId) {
      console.warn("⚠️ Missing credentials or page ID");
      return;
    }

    let url = `https://admin.squareplugin.com/api/v1/get-button-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}`;
    if (blockId) url += `&elementId=${blockId}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      // Handle the nested structure: modifications[].elements[]
      const modifications = result.modifications || [];
      modifications.forEach((mod) => {
        const elements = mod.elements || [];
        elements.forEach(({ elementId, css }) => {
          // Apply button styles as external CSS
          const buttonPrimary = css?.buttonPrimary;
          if (buttonPrimary?.selector && buttonPrimary?.styles) {
            applyStylesAsExternalCSS(
              buttonPrimary.selector,
              buttonPrimary.styles
            );
            console.log(
              `✅ Applied button styles to ${elementId}:`,
              buttonPrimary.styles
            );
          }
          // Optionally handle secondary/tertiary
          const buttonSecondary = css?.buttonSecondary;
          if (buttonSecondary?.selector && buttonSecondary?.styles) {
            applyStylesAsExternalCSS(
              buttonSecondary.selector,
              buttonSecondary.styles
            );
          }
          const buttonTertiary = css?.buttonTertiary;
          if (buttonTertiary?.selector && buttonTertiary?.styles) {
            applyStylesAsExternalCSS(
              buttonTertiary.selector,
              buttonTertiary.styles
            );
          }
        });
      });
      console.log("✅ Applied button styles to all elements (external CSS)");
    } catch (error) {
      console.error("❌ Failed to fetch button modifications:", error.message);
    }
  }

  // Fetch and apply button border modifications from the backend
  async function fetchButtonBorderModifications(blockId = null) {
    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");
    const pageId = document
      .querySelector("article[data-page-sections]")
      ?.getAttribute("data-page-sections");

    if (!userId || !token || !widgetId || !pageId) {
      console.warn("⚠️ Missing credentials or page ID");
      return;
    }

    let url = `https://admin.squareplugin.com/api/v1/get-button-border-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}`;
    if (blockId) url += `&elementId=${blockId}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      // Handle the direct structure: elements[]
      const elements = result.elements || [];
      elements.forEach(({ elementId, selector, styles }) => {
        // Apply button border styles as external CSS
        if (selector && styles) {
          applyStylesAsExternalCSS(selector, styles, "sc-btn-border-style");
          console.log(
            `✅ Applied button border styles to ${elementId}:`,
            styles
          );
        }
      });
      console.log(
        "✅ Applied button border styles to all elements (external CSS)"
      );
    } catch (error) {
      console.error(
        "❌ Failed to fetch button border modifications:",
        error.message
      );
    }
  }

  // Fetch button shadow modifications from the backend
  async function fetchButtonShadowModifications(blockId = null) {
    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");
    const pageId = document
      .querySelector("article[data-page-sections]")
      ?.getAttribute("data-page-sections");

    if (!userId || !token || !widgetId || !pageId) {
      console.warn("⚠️ Missing credentials or page ID");
      return;
    }

    let url = `https://admin.squareplugin.com/api/v1/get-button-shadow-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}`;
    if (blockId) url += `&elementId=${blockId}`;

    try {
      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      const elements = result.elements || [];
      elements.forEach(({ elementId, selector, styles }) => {
        if (!selector || !styles) return;

        const styleId = `sc-btn-shadow-style-${elementId}`;
        let styleTag = document.getElementById(styleId);
        if (!styleTag) {
          styleTag = document.createElement("style");
          styleTag.id = styleId;
          document.head.appendChild(styleTag);
        }

        let cssText = `${selector} {`;
        Object.entries(styles).forEach(([prop, val]) => {
          if (val !== null && val !== undefined && val !== "null") {
            cssText += `${prop}: ${val} !important; `;
          }
        });
        cssText += "}";

        styleTag.textContent = cssText;

        console.log(
          `✅ Applied button shadow styles for ${elementId}:`,
          styles
        );
      });

      console.log("✅ All button shadow modifications applied (external CSS)");
    } catch (error) {
      console.error(
        "❌ Failed to fetch button shadow modifications:",
        error.message
      );
    }
  }

  // Fetch button border modifications from the backend end here

  window.addEventListener("load", async () => {
    await fetchModifications();
    // await fetchImageModifications(lastClickedBlockId);

    // if (lastClickedBlockId) {
    //   await fetchImageModifications(lastClickedBlockId);
    // }

    // Fallback: Auto-detect first image block on page load
    if (!lastClickedBlockId) {
      const fallbackBlock = document
        .querySelector('[id^="block-"] img')
        ?.closest('[id^="block-"]');
      if (fallbackBlock) {
        lastClickedBlockId = fallbackBlock.id;
      }
    }

    if (lastClickedBlockId) {
      await fetchImageModifications(lastClickedBlockId);
      await fetchImageOverlayModifications(lastClickedBlockId);
      await fetchImageShadowModifications(lastClickedBlockId);
    }
  });

  const observer = new MutationObserver(() => {
    observer.disconnect();
    // addHeadingEventListeners();
    fetchModifications();
    // fetchImageModifications(lastClickedBlockId);
    const selectedBlock = document.querySelector('[id^="block-"]:has(img)');
    const elementId = selectedBlock?.id || null;

    if (elementId) {
      fetchImageModifications(elementId);
      fetchImageOverlayModifications(elementId);
      fetchImageShadowModifications(elementId);
    }

    if (elementId) {
      fetchButtonModifications(elementId);
      fetchButtonBorderModifications(elementId);
      fetchButtonShadowModifications(elementId);
    }

    const fontWeightSelect = document.getElementById("squareCraftFontWeight");
    if (fontWeightSelect && !fontWeightSelect.dataset.initialized) {
      console.log("Initializing font weight select");
      fontWeightSelect.dataset.initialized = "true";

      // Add a small delay to ensure the DOM is fully loaded
      setTimeout(() => {
        handleFontWeightClick(null, {
          lastClickedElement,
          saveModifications,
          selectedElement,
          setSelectedElement: (val) => (selectedElement = val),
          setLastClickedBlockId: (val) => (lastClickedBlockId = val),
          setLastClickedElement: (val) => (lastClickedElement = val),
          addPendingModification,
          getTextType,
        });
      }, 100);
    }

    const textTransformContainer = document.getElementById(
      "squareCraftBoldElementTextTransform"
    );
    if (textTransformContainer && !textTransformContainer.dataset.initialized) {
      textTransformContainer.dataset.initialized = "true";

      // Add click event listeners to all text transform buttons
      textTransformContainer
        .querySelectorAll('[id^="scTextTransform"]')
        .forEach((button) => {
          button.addEventListener("click", (event) => {
            const lastClickedElement = document.querySelector(".sc-selected");
            if (lastClickedElement) {
              handleBoldElementTextTransformClick(event, {
                lastClickedElement,
                lastClickedBlockId: lastClickedElement.id,
                selectedSingleTextType,
                addPendingModification,
                showNotification,
                getTextType,
                applyStylesToElement,
              });
            }
          });
        });
    }

    // const textColorContainer = document.getElementById("scTextColor");
    // if (textColorContainer && !textColorContainer.dataset.initialized) {
    //   textColorContainer.dataset.initialized = "true";

    //   // Add click event listeners to all text colro buttons
    //   textColorContainer
    //     .querySelectorAll('[id^="scTextColor"]')
    //     .forEach((button) => {
    //       button.addEventListener("click", (event) => {
    //         const lastClickedElement = document.querySelector(".sc-selected");
    //         if (lastClickedElement) {
    //           handleTextColorclicked(event, {
    //             lastClickedElement,
    //             lastClickedBlockId: lastClickedElement.id,
    //           });
    //         }
    //       });
    //     });
    // }

    //Link code start here

    const LinkfontsizeSelect = document.getElementById("scFontSizeInputLink");
    if (LinkfontsizeSelect && !LinkfontsizeSelect.dataset.initialized) {
      LinkfontsizeSelect.dataset.initialized = "true";

      // Add a small delay to ensure the DOM is fully loaded
      setTimeout(() => {
        handleFontSizeLink(null, {
          lastClickedElement,
          getTextType,
          saveModifications,
          selectedElement,
          setSelectedElement: (val) => (selectedElement = val),
          setLastClickedBlockId: (val) => (lastClickedBlockId = val),
          setLastClickedElement: (val) => (lastClickedElement = val),
          addPendingModification: (blockId, css, tagType) => {
            if (!pendingModifications.has(blockId)) {
              pendingModifications.set(blockId, []);
            }
            pendingModifications.get(blockId).push({ css, tagType });
          },
          showNotification,
        });
      }, 100);
    }

    const textTransformLinkContainer = document.getElementById(
      "squareCraftLink-text-transform"
    );
    if (
      textTransformLinkContainer &&
      !textTransformLinkContainer.dataset.initialized
    ) {
      textTransformLinkContainer.dataset.initialized = "true";

      textTransformLinkContainer
        .querySelectorAll('[id^="scTextTransform"]')
        .forEach((button) => {
          button.addEventListener("click", (event) => {
            const lastClickedElement = document.querySelector(".sc-selected");
            if (lastClickedElement) {
              handleTextTransformLinkClick(event, {
                lastClickedElement,
                selectedSingleTextType,
                addPendingModification,
                showNotification,
              });
            }
          });
        });
    }

    // In squareCraft.js
    const fontWeightLinkSelect = document.getElementById(
      "squareCraftLinkFontWeight"
    );
    if (fontWeightLinkSelect && !fontWeightLinkSelect.dataset.initialized) {
      console.log("Initializing font weight select for links");
      fontWeightLinkSelect.dataset.initialized = "true";

      fontWeightLinkSelect.addEventListener("change", function (event) {
        event.preventDefault();
        console.log("Font weight select changed");

        const currentlySelectedBlock = document.querySelector(".sc-selected");
        const selectedFontWeight = this.value;
        console.log("Selected font weight:", selectedFontWeight);

        if (!currentlySelectedBlock) {
          showNotification(
            // "❌ Please select a block first fsfgsfgsfgsgfsgsg.",
            "error"
          );
          this.value = "400";
          return;
        }

        const selectedTab = document.querySelector(".sc-selected-tab");
        if (!selectedTab) {
          showNotification(
            // "❌ Please select a text type (h1, h2, p1 etc) first.",
            "error"
          );
          this.value = "400";
          return;
        }

        handleFontWeightLink(event, {
          lastClickedElement: currentlySelectedBlock,
          selectedSingleTextType: selectedSingleTextType,
          addPendingModification,
          showNotification,
        });
      });
    }

    // handleLinkTextHighlightClick(
    //   event,
    //   lastClickedElement,
    //   applyStylesToElement,
    //   {
    //     handleAllTextColorClick,
    //     lastClickedElement,
    //     selectedSingleTextType,
    //     addPendingModification: (blockId, css, tagType) => {
    //       if (!pendingModifications.has(blockId)) {
    //         pendingModifications.set(blockId, []);
    //       }
    //       pendingModifications.get(blockId).push({ css, tagType });
    //     },
    //     showNotification,
    //   }
    // );

    // In squareCraft.js
    const colorInput = document.getElementById("scTextHighLight");
    const hexInput = document.getElementById("scTextHeighlightHex");

    if (colorInput && hexInput) {
      // Sync color input with hex input
      colorInput.addEventListener("input", function () {
        hexInput.value = this.value;
      });

      // Sync hex input with color input
      hexInput.addEventListener("input", function () {
        if (/^#[0-9A-F]{6}$/i.test(this.value)) {
          colorInput.value = this.value;
        }
      });
    }

    //Link code end here

    //All font size code start here
    const AllfontsizeSelect = document.getElementById("scAllFontSizeInput");
    if (AllfontsizeSelect && !AllfontsizeSelect.dataset.initialized) {
      AllfontsizeSelect.dataset.initialized = "true";

      // Add a small delay to ensure the DOM is fully loaded
      setTimeout(() => {
        handleAllFontSizeClick(null, {
          lastClickedElement,
          selectedSingleTextType,
          getTextType,
          saveModifications,
          selectedElement,
          setSelectedElement: (val) => (selectedElement = val),
          setLastClickedBlockId: (val) => (lastClickedBlockId = val),
          setLastClickedElement: (val) => (lastClickedElement = val),
          addPendingModification: (blockId, css, tagType) => {
            if (!pendingModifications.has(blockId)) {
              pendingModifications.set(blockId, []);
            }
            pendingModifications.get(blockId).push({ css, tagType });
          },
          showNotification,
        });
      }, 100);
    }
    //All font size code end here

    //All text transform code start here
    const AllTextTransformSelect = document.getElementById(
      "squareCraftAllTextTransform"
    );
    if (AllTextTransformSelect && !AllTextTransformSelect.dataset.initialized) {
      AllTextTransformSelect.dataset.initialized = "true";

      // Add a small delay to ensure the DOM is fully loaded
      setTimeout(() => {
        handleAllTextTransformClick(null, {
          lastClickedElement,
          selectedSingleTextType,
          getTextType,
          saveModifications,
          selectedElement,
          setSelectedElement: (val) => (selectedElement = val),
          setLastClickedBlockId: (val) => (lastClickedBlockId = val),
          setLastClickedElement: (val) => (lastClickedElement = val),
          addPendingModification: (blockId, css, tagType) => {
            if (!pendingModifications.has(blockId)) {
              pendingModifications.set(blockId, []);
            }
            pendingModifications.get(blockId).push({ css, tagType });
          },
          showNotification,
        });
      }, 100);
    }
    //All text transform code end here

    //All text align code start here

    const AlltextAlignContainer = document.getElementById(
      "squareCraftAllTextAlign"
    );
    if (AlltextAlignContainer && !AlltextAlignContainer.dataset.initialized) {
      AlltextAlignContainer.dataset.initialized = "true";

      AlltextAlignContainer.querySelectorAll('[id^="scTextAlign"]').forEach(
        (button) => {
          button.addEventListener("click", (event) => {
            handleAllTextAlignClick(event, {
              lastClickedElement,
              selectedSingleTextType,
              addPendingModification,
              showNotification,
            });
          });
        }
      );
    }

    //All text align code end here

    //All letter spacing code start here
    const AllLetterSpacingSelect = document.getElementById(
      "scLetterSpacingInput"
    );
    if (AllLetterSpacingSelect && !AllLetterSpacingSelect.dataset.initialized) {
      AllLetterSpacingSelect.dataset.initialized = "true";

      // Add a small delay to ensure the DOM is fully loaded
      setTimeout(() => {
        handleAllLetterSpacingClick(null, {
          lastClickedElement,
          selectedSingleTextType,
          getTextType,
          saveModifications,
          selectedElement,
          setSelectedElement: (val) => (selectedElement = val),
          setLastClickedBlockId: (val) => (lastClickedBlockId = val),
          setLastClickedElement: (val) => (lastClickedElement = val),
          addPendingModification: (blockId, css, tagType) => {
            if (!pendingModifications.has(blockId)) {
              pendingModifications.set(blockId, []);
            }
            pendingModifications.get(blockId).push({ css, tagType });
          },
          showNotification,
        });
      }, 100);
    }
    //All letter spacing code end here

    //All line height code start here
    const AllLineHeightSelect = document.getElementById("scLineHeightInput");
    if (AllLineHeightSelect && !AllLineHeightSelect.dataset.initialized) {
      AllLineHeightSelect.dataset.initialized = "true";

      // Add a small delay to ensure the DOM is fully loaded
      setTimeout(() => {
        handleAllLineHeightClick(null, {
          lastClickedElement,
          selectedSingleTextType,
          getTextType,
          saveModifications,
          selectedElement,
          setSelectedElement: (val) => (selectedElement = val),
          setLastClickedBlockId: (val) => (lastClickedBlockId = val),
          setLastClickedElement: (val) => (lastClickedElement = val),
          addPendingModification: (blockId, css, tagType) => {
            if (!pendingModifications.has(blockId)) {
              pendingModifications.set(blockId, []);
            }
            pendingModifications.get(blockId).push({ css, tagType });
          },
          showNotification,
        });
      }, 100);
    }
    //All line height code end here

    //All font weight code start here

    const AllFontWeightSelect = document.getElementById(
      "squareCraftAllFontWeight"
    );
    if (AllFontWeightSelect && !AllFontWeightSelect.dataset.initialized) {
      AllFontWeightSelect.dataset.initialized = "true";

      AllFontWeightSelect.addEventListener("change", (event) => {
        handleAllFontWeightClick(event, {
          lastClickedElement,
          selectedSingleTextType,
          addPendingModification,
          showNotification,
        });

        if (selectedSingleTextType) {
          showNotification(
            `Font weight applied to: ${selectedSingleTextType}`,
            "success"
          );
        }
      });
    }

    //All font weight code end here

    //All text color code start here
    const textColorDiv = document.getElementById("textColorPalate");
    if (textColorDiv && !textColorDiv.dataset.initialized) {
      textColorDiv.dataset.initialized = "true";

      textColorDiv.addEventListener("click", (event) => {
        handleTextColorClick(event, lastClickedElement, applyStylesToElement, {
          handleAllTextColorClick,
          lastClickedElement,
          selectedSingleTextType,
          addPendingModification,
          showNotification,
        });

        if (selectedSingleTextType) {
          showNotification(
            `Text color applied to: ${selectedSingleTextType}`,
            "success"
          );
        }
      });
    }

    //All text color code end here

    //All text highlight color code start here
    const textHighlightColorDiv = document.getElementById(
      "texHeightlistPalate"
    );
    if (textHighlightColorDiv && !textHighlightColorDiv.dataset.initialized) {
      textHighlightColorDiv.dataset.initialized = "true";

      textHighlightColorDiv.addEventListener("click", (event) => {
        handleTextHighlightColorClick(
          event,
          lastClickedElement,
          applyStylesToElement,
          {
            handleAllTextHighlightClick,
            lastClickedElement,
            selectedSingleTextType,
            addPendingModification,
            showNotification,
          }
        );

        if (selectedSingleTextType) {
          showNotification(
            `Text color applied to: ${selectedSingleTextType}`,
            "success"
          );
        }
      });
    }

    //All text highlight color code end here

    //All font family code start here
    const allFontFamilySelect = document.getElementById(
      "squareCraftAllFontFamily"
    );
    if (allFontFamilySelect && !allFontFamilySelect.dataset.initialized) {
      allFontFamilySelect.dataset.initialized = "true";

      allFontFamilySelect.addEventListener("change", (event) => {
        handleAllFontFamilyClick(event, {
          lastClickedElement,
          selectedSingleTextType,
          addPendingModification: (blockId, css, tagType) => {
            if (!pendingModifications.has(blockId)) {
              pendingModifications.set(blockId, []);
            }
            pendingModifications.get(blockId).push({ css, tagType });
          },
          showNotification,
        });
      });
    }

    //All font family code end here

    //italic text color code start here
    const ItalictextColorDiv = document.getElementById("textColorPalate");
    if (ItalictextColorDiv && !ItalictextColorDiv.dataset.initialized) {
      ItalictextColorDiv.dataset.initialized = "true";

      ItalictextColorDiv.addEventListener("click", (event) => {
        handleItalicTextColorClickEvent(
          event,
          lastClickedElement,
          applyStylesToElement,
          {
            handleAllTextColorClick,
            lastClickedElement,
            selectedSingleTextType,
            addPendingModification,
            showNotification,
          }
        );

        if (selectedSingleTextType) {
          showNotification(
            `Text color applied to: ${selectedSingleTextType}`,
            "success"
          );
        }
      });
    }

    //italic text color code end here

    //italic font size code start here

    const ItalicFontSizeSelect = document.getElementById(
      "scFontSizeItalicInput"
    );
    if (ItalicFontSizeSelect && !ItalicFontSizeSelect.dataset.initialized) {
      ItalicFontSizeSelect.dataset.initialized = "true";

      ItalicFontSizeSelect.addEventListener("change", (event) => {
        handleItalicFontSizeClick(event, {
          lastClickedElement,
          selectedSingleTextType,
          addPendingModification,
          showNotification,
        });

        if (selectedSingleTextType) {
          showNotification(
            `Font Size applied to: ${selectedSingleTextType}`,
            "success"
          );
        }
      });
    }

    //italic font weight code start here

    const ItalicFontWeightSelect = document.getElementById(
      "squareCraftItalicFontWeight"
    );
    if (ItalicFontWeightSelect && !ItalicFontWeightSelect.dataset.initialized) {
      ItalicFontWeightSelect.dataset.initialized = "true";

      ItalicFontWeightSelect.addEventListener("change", (event) => {
        handleItalicFontWeightClick(event, {
          lastClickedElement,
          selectedSingleTextType,
          addPendingModification,
          showNotification,
        });

        if (selectedSingleTextType) {
          showNotification(
            `Font weight applied to: ${selectedSingleTextType}`,
            "success"
          );
        }
      });
    }

    //italic font weight code end here

    //Italic text transform code start here
    const ItalicTextTransformSelect = document.getElementById(
      "squareCraftItalicTextTransform"
    );
    if (
      ItalicTextTransformSelect &&
      !ItalicTextTransformSelect.dataset.initialized
    ) {
      ItalicTextTransformSelect.dataset.initialized = "true";

      // Add a small delay to ensure the DOM is fully loaded
      setTimeout(() => {
        handleItalicTextTransformClick(null, {
          lastClickedElement,
          selectedSingleTextType,
          getTextType,
          saveModifications,
          selectedElement,
          setSelectedElement: (val) => (selectedElement = val),
          setLastClickedBlockId: (val) => (lastClickedBlockId = val),
          setLastClickedElement: (val) => (lastClickedElement = val),
          addPendingModification: (blockId, css, tagType) => {
            if (!pendingModifications.has(blockId)) {
              pendingModifications.set(blockId, []);
            }
            pendingModifications.get(blockId).push({ css, tagType });
          },
          showNotification,
        });
      }, 100);
    }
    //Italic text transform code end here

    //Italic text highlight code start here
    const ItalictextHighlightColorDiv = document.getElementById(
      "ItalictextHighlightColorPalate"
    );
    if (
      ItalictextHighlightColorDiv &&
      !ItalictextHighlightColorDiv.dataset.initialized
    ) {
      ItalictextHighlightColorDiv.dataset.initialized = "true";

      ItalictextHighlightColorDiv.addEventListener("click", (event) => {
        handleItalicTextHeighlightClickEvent(
          event,
          lastClickedElement,
          applyStylesToElement,
          {
            handleAllTextHighlightClick,
            lastClickedElement,
            selectedSingleTextType,
            addPendingModification,
            showNotification,
          }
        );

        if (selectedSingleTextType) {
          showNotification(
            `Text color applied to: ${selectedSingleTextType}`,
            "success"
          );
        }
      });
    }

    //Italic text highlight code end here

    //bold text color code start here

    const BoldtextColorDiv = document.getElementById("BoldtextColorPalate");
    if (BoldtextColorDiv && !BoldtextColorDiv.dataset.initialized) {
      BoldtextColorDiv.dataset.initialized = "true";

      BoldtextColorDiv.addEventListener("click", (event) => {
        handleBoldTextColorClick(
          event,
          lastClickedElement,
          applyStylesToElement,
          {
            handleAllTextColorClick,
            lastClickedElement,
            selectedSingleTextType,
            addPendingModification,
            showNotification,
          }
        );

        if (selectedSingleTextType) {
          showNotification(
            `Bold Text color applied to: ${selectedSingleTextType}`,
            "success"
          );
        }
      });
    }

    //bold text color code end here

    //bold text highlight code start here
    const BoldtextHighlightDiv = document.getElementById(
      "BoldtextHighlightPalate"
    );
    if (BoldtextHighlightDiv && !BoldtextHighlightDiv.dataset.initialized) {
      BoldtextHighlightDiv.dataset.initialized = "true";

      BoldtextHighlightDiv.addEventListener("click", (event) => {
        handleBoldTextHighlightClick(
          event,
          lastClickedElement,
          applyStylesToElement,
          {
            handleAllTextColorClick,
            lastClickedElement,
            selectedSingleTextType,
            addPendingModification,
            showNotification,
          }
        );

        if (selectedSingleTextType) {
          showNotification(
            `Bold Text color applied to: ${selectedSingleTextType}`,
            "success"
          );
        }
      });
    }
    //bold text highlight code end here

    //link text highlight code start here
    // const LinktextHighlightColorDiv = document.getElementById(
    //   "LinktextHighlightColorPalate"
    // );
    // if (
    //   LinktextHighlightColorDiv &&
    //   !LinktextHighlightColorDiv.dataset.initialized
    // ) {
    //   LinktextHighlightColorDiv.dataset.initialized = "true";

    //   LinktextHighlightColorDiv.addEventListener("click", (event) => {
    //     handleLinkTextHighlightClick(
    //       event,
    //       lastClickedElement,
    //       applyStylesToElement,
    //       {
    //         handleAllTextHighlightClick,
    //         lastClickedElement,
    //         selectedSingleTextType,
    //         addPendingModification,
    //         showNotification,
    //       }
    //     );

    //     if (selectedSingleTextType) {
    //       showNotification(
    //         `Text color applied to: ${selectedSingleTextType}`,
    //         "success"
    //       );
    //     }
    //   });
    // }

    const LinktextHighlightColorDiv = document.getElementById(
      "LinktextHighlightColorPalate"
    );
    if (
      LinktextHighlightColorDiv &&
      !LinktextHighlightColorDiv.dataset.initialized
    ) {
      LinktextHighlightColorDiv.dataset.initialized = "true";

      // Remove any existing listeners
      const newDiv = LinktextHighlightColorDiv.cloneNode(true);
      LinktextHighlightColorDiv.parentNode.replaceChild(
        newDiv,
        LinktextHighlightColorDiv
      );

      newDiv.addEventListener("click", (event) => {
        handleLinkTextHighlightClick(
          event,
          lastClickedElement,
          applyStylesToElement,
          {
            handleAllTextHighlightClick,
            lastClickedElement,
            selectedSingleTextType,
            addPendingModification,
            showNotification,
          }
        );
      });
    }
    //link text highlight code end here

    //Image border controls
    // Initialize border controls
    const ImageBorderAllControls = document.getElementById("imageSection");
    if (ImageBorderAllControls && !ImageBorderAllControls.dataset.initialized) {
      ImageBorderAllControls.dataset.initialized = "true";

      ImageBorderAllControls.addEventListener("click", () => {
        const selectedImage = document.querySelector(".sc-selected-image");

        if (!selectedImage) {
          showNotification("Please select an image first", "error");
          return;
        }

        // ✅ Initialize overlay controls properly
        // const overlayController = InitImageOverLayControls(themeColors);
        // overlayController.init(selectedImage);

        const overlayController = InitImageOverLayControls(themeColors, {
          addPendingModification,
          saveImageOverlayModifications,
          token,
          userId,
          widgetId,
        });
        if (overlayController) {
          overlayController.init(selectedImage);
        }

        setTimeout(() => {
          handleImageBorderControlsClick(null, {
            getTextType,
            selectedElement,
            setSelectedElement: (val) => (selectedElement = val),
            lastClickedElement,
            setLastClickedElement: (val) => (lastClickedElement = val),
            setLastClickedBlockId: (val) => (lastClickedBlockId = val),
            selectedSingleTextType,
            setSelectedSingleTextType: (val) => (selectedSingleTextType = val),
            showNotification,
            saveModifications,
            addPendingModification: (blockId, css, tagType) => {
              if (!pendingModifications.has(blockId)) {
                pendingModifications.set(blockId, []);
              }
              pendingModifications.get(blockId).push({ css, tagType });
            },
          });
        }, 100);

        initImageBorderControls(selectedImage);
        // initImageShadowControls(selectedImage);
        initImageShadowControls(() => selectedImage);

        showNotification("Border applied to image", "success");
      });
    }

    //Image border controls end here

    //Image overlay controls start here
    const overlayControls = InitImageOverLayControls(themeColors, {
      addPendingModification,
      saveImageOverlayModifications,
      token,
      userId,
      widgetId,
    });

    document.addEventListener("click", (e) => {
      const block = e.target.closest('[id^="block-"]');
      if (!block) return;

      console.log("block", block);

      const imageContent = block.querySelector(".sqs-image-content");
      if (imageContent && overlayControls) {
        overlayControls.init(block);
      }
    });

    //Image overlay controls end here
  });

  observer.observe(parent.document.body, { childList: true, subtree: true });

  // addHeadingEventListeners();

  try {
    const { injectNavbarIcon } = await import(
      "https://goswami34.github.io/squareCraft-widget/injectNavbarIcon.js"
    );
    injectNavbarIcon();
  } catch (error) {
    console.error("🚨 Failed to load navbar icon script", error);
  }

  // async function toggleWidgetVisibility(event) {
  //   event.stopPropagation();
  //   const clickedBlock = event?.target?.closest('[id^="block-"]');
  //   if (!clickedBlock) {
  //     return;
  //   }

  //   if (!widgetLoaded) {
  //     await createWidget(clickedBlock);
  //     waitForElement("#typoSection, #imageSection, #buttonSection", 4000)
  //       .then(() => {
  //         handleAndDetect(clickedBlock);
  //       })
  //       .catch((error) => {
  //         console.error(error.message);
  //       });
  //   } else {
  //     widgetContainer.style.display =
  //       widgetContainer.style.display === "none" ? "block" : "none";
  //     waitForElement("#typoSection, #imageSection, #buttonSection", 4000)
  //       .then(() => {
  //         handleAndDetect(clickedBlock);
  //       })
  //       .catch((error) => {
  //         console.error(error.message);
  //       });
  //   }
  // }

  async function toggleWidgetVisibility(event) {
    event.stopPropagation();
    const clickedBlock = event?.target?.closest('[id^="block-"]');
    if (!clickedBlock) {
      return;
    }

    if (!widgetLoaded) {
      await createWidget(clickedBlock);
      waitForElement("#typoSection, #imageSection, #buttonSection", 4000)
        .then(() => {
          handleAndDetect(clickedBlock);
        })
        .catch((error) => {
          console.error(error.message);
        });
    } else {
      widgetContainer.style.display =
        widgetContainer.style.display === "none" ? "block" : "none";
      waitForElement("#typoSection, #imageSection, #buttonSection", 4000)
        .then(() => {
          handleAndDetect(clickedBlock);
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
  }

  function handleAndDetect(clickedBlock) {
    handleBlockClick(
      { target: clickedBlock },
      {
        getTextType,
        selectedElement,
        setSelectedSingleTextType: (tag) => (selectedSingleTextType = tag),
        setSelectedElement: (val) => (selectedElement = val),
        setLastClickedBlockId: (val) => (lastClickedBlockId = val),
        setLastClickedElement: (val) => (lastClickedElement = val),
        setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
        setLastActiveAlignmentElement: (val) =>
          (lastActiveAlignmentElement = val),
      }
    );
    detectBlockElementTypes(clickedBlock);
  }

  // async function createWidget(clickedBlock) {
  //   try {
  //     const module = await import(
  //       "https://goswami34.github.io/squareCraft-widget/html.js"
  //     );
  //     const htmlString = module.html();

  //     if (typeof htmlString === "string" && htmlString.trim().length > 0) {
  //       loadWidgetFromString(htmlString, clickedBlock);
  //       setTimeout(() => {
  //         if (typeof module.initToggleSwitch === "function") {
  //           module.initToggleSwitch();
  //         }
  //       }, 200);
  //     }
  //   } catch (err) {
  //     console.error("🚨 Error loading HTML module:", err);
  //   }
  // }

  async function createWidget(clickedBlock) {
    try {
      const module = await import(
        "https://goswami34.github.io/squareCraft-widget/html.js"
      );
      const htmlString = module.html();

      if (typeof htmlString === "string" && htmlString.trim().length > 0) {
        loadWidgetFromString(htmlString, clickedBlock);
        setTimeout(() => {
          if (typeof module.initToggleSwitch === "function") {
            module.initToggleSwitch();
          }
        }, 200);
      }
    } catch (err) {
      console.error("🚨 Error loading HTML module:", err);
    }
    triggerLaunchAnimation();
  }

  function waitForElement(selector, timeout = 3000) {
    return new Promise((resolve, reject) => {
      const el = document.querySelector(selector);
      if (el) {
        resolve(el);
        return;
      }

      const observer = new MutationObserver(() => {
        const el = document.querySelector(selector);
        if (el) {
          resolve(el);
          observer.disconnect();
        }
      });

      observer.observe(document.body, { childList: true, subtree: true });

      setTimeout(() => {
        observer.disconnect();
        reject(new Error(`Timeout: Element ${selector} not found`));
      }, timeout);
    });
  }

  function createHoverableArrowSVG(id, isRotate = false) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "12");
    svg.setAttribute("height", "12");
    svg.setAttribute("viewBox", "0 0 12 12");
    svg.setAttribute("fill", "none");
    svg.id = id;
    svg.classList.add("sc-hover-arrow", "sc-arrow-trigger");

    if (isRotate) {
      svg.classList.add("sc-rotate-180");
    }

    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M2.5 4L6 7.5L9.5 4");
    path.setAttribute("stroke", "currentColor");
    path.setAttribute("stroke-width", "1.5");
    path.setAttribute("stroke-linecap", "round");
    path.setAttribute("stroke-linejoin", "round");
    path.id = "Vector 175";

    svg.appendChild(path);
    return svg;
  }

  // function loadWidgetFromString(htmlString, clickedBlock) {
  //   if (!widgetContainer) {
  //     widgetContainer = document.createElement("div");
  //     widgetContainer.id = "sc-widget-container";
  //     widgetContainer.classList.add(
  //       "sc-fixed",
  //       "sc-text-color-white",
  //       "sc-universal",
  //       "sc-z-9999"
  //     );

  //     // ✅ Inject your CSS file before setting innerHTML
  //     const styleLink = document.createElement("link");
  //     styleLink.rel = "stylesheet";
  //     styleLink.type = "text/css";
  //     styleLink.href =
  //       "https://goswami34.github.io/squareCraft-widget/src/styles/parent.css";
  //     widgetContainer.appendChild(styleLink);

  //     // ✅ Then set HTML content
  //     const contentWrapper = document.createElement("div");
  //     contentWrapper.innerHTML = htmlString;
  //     widgetContainer.appendChild(contentWrapper);
  //     // parentHtmlTabClick();

  //     widgetContainer.style.display = "block";
  //     document.body.appendChild(widgetContainer);

  //     initImageMaskControls(() => selectedElement);
  //     makeWidgetDraggable();

  //     setTimeout(() => {
  //       const placeholders = widgetContainer.querySelectorAll(
  //         ".sc-arrow-placeholder"
  //       );

  //       placeholders.forEach((span) => {
  //         const isRotate = span.classList.contains("sc-rotate-180");
  //         const cloneClassList = Array.from(span.classList);
  //         const originalId = span.getAttribute("id") || "";
  //         const id =
  //           originalId || `sc-arrow-${Math.floor(Math.random() * 10000)}`;

  //         const svg = createHoverableArrowSVG(id, isRotate);
  //         cloneClassList.forEach((cls) => svg.classList.add(cls));
  //         span.replaceWith(svg);
  //       });
  //     }, 100);

  //     widgetLoaded = true;
  //     initImageSectionToggleControls();
  //     // initButtonSectionToggleControls();
  //     // initImageUploadPreview(() => selectedElement);
  //     ButtonAdvanceToggleControls();
  //     buttonTooltipControls();
  //     initButtonSectionToggleControls();
  //     initImageSectionToggleControls();
  //     initHoverButtonSectionToggleControls();
  //     initHoverButtonEffectDropdowns();
  //     initImageUploadPreview(() => selectedElement);

  //     if (clickedBlock) {
  //       waitForElement("#typoSection, #imageSection, #buttonSection")
  //         .then(() => {
  //           handleBlockClick(
  //             { target: clickedBlock },
  //             {
  //               getTextType,
  //               selectedElement,
  //               setSelectedSingleTextType: (tag) =>
  //                 (selectedSingleTextType = tag),
  //               setSelectedElement: (val) => (selectedElement = val),
  //               setLastClickedBlockId: (val) => (lastClickedBlockId = val),
  //               setLastClickedElement: (val) => (lastClickedElement = val),
  //               setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
  //               setLastActiveAlignmentElement: (val) =>
  //                 (lastActiveAlignmentElement = val),
  //             }
  //           );
  //           detectBlockElementTypes(clickedBlock);
  //         })
  //         .catch((error) => {
  //           console.error(error.message);
  //         });
  //     }
  //   }
  // }

  function loadWidgetFromString(htmlString, clickedBlock) {
    if (!widgetContainer) {
      widgetContainer = document.createElement("div");
      widgetContainer.id = "sc-widget-container";
      widgetContainer.classList.add(
        "sc-fixed",
        "sc-text-color-white",
        "sc-universal",
        "sc-z-999999"
      );

      const styleLink = document.createElement("link");
      styleLink.rel = "stylesheet";
      styleLink.type = "text/css";
      styleLink.href =
        "https://goswami34.github.io/squareCraft-widget/src/styles/parent.css";
      widgetContainer.appendChild(styleLink);

      const contentWrapper = document.createElement("div");
      contentWrapper.innerHTML = htmlString;
      widgetContainer.appendChild(contentWrapper);

      widgetContainer.style.display = "block";
      document.body.appendChild(widgetContainer);

      initImageMaskControls(() => selectedElement);
      makeWidgetDraggable();
      setTimeout(() => {
        const placeholders = widgetContainer.querySelectorAll(
          ".sc-arrow-placeholder"
        );

        placeholders.forEach((span) => {
          const isRotate = span.classList.contains("sc-rotate-180");
          const cloneClassList = Array.from(span.classList);
          const originalId = span.getAttribute("id") || "";
          const id =
            originalId || `sc-arrow-${Math.floor(Math.random() * 10000)}`;

          const svg = createHoverableArrowSVG(id, isRotate);
          cloneClassList.forEach((cls) => svg.classList.add(cls));
          span.replaceWith(svg);
        });
      }, 100);
      widgetLoaded = true;
      initImageSectionToggleControls();
      ButtonAdvanceToggleControls();
      buttonTooltipControls();
      initButtonSectionToggleControls();
      WidgetTypoSectionStateControls();
      initImageStateTabToggle();
      WidgetImageHoverToggleControls();
      initHoverTypoTabControls([
        {
          buttonId: "typo-all-hover-font-button",
          sectionId: "typo-all-hover-font-section",
        },
        {
          buttonId: "typo-all-hover-border-button",
          sectionId: "typo-all-hover-border-section",
        },
        {
          buttonId: "typo-all-hover-shadow-button",
          sectionId: "typo-all-hover-shadow-section",
        },
        {
          buttonId: "typo-all-hover-effects-button",
          sectionId: "typo-all-hover-effects-section",
        },
        {
          buttonId: "typo-bold-hover-font-button",
          sectionId: "typo-bold-hover-font-section",
        },
        {
          buttonId: "typo-italic-hover-font-button",
          sectionId: "typo-italic-hover-font-section",
        },
        {
          buttonId: "typo-link-hover-font-button",
          sectionId: "typo-link-hover-font-section",
        },
      ]);
      initHoverButtonSectionToggleControls();
      // hoverTypoTabSelect();
      initHoverButtonEffectDropdowns();
      initImageUploadPreview(() => selectedElement);
      triggerLaunchAnimation();
      if (clickedBlock) {
        waitForElement("#typoSection, #imageSection, #buttonSection")
          .then(() => {
            handleBlockClick(
              { target: clickedBlock },
              {
                getTextType,
                // getHoverTextType,
                selectedElement,
                setSelectedElement: (val) => (selectedElement = val),
                setLastClickedBlockId: (val) => (lastClickedBlockId = val),
                setLastClickedElement: (val) => (lastClickedElement = val),
                setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
                setLastActiveAlignmentElement: (val) =>
                  (lastActiveAlignmentElement = val),
              }
            );
            detectBlockElementTypes(clickedBlock);
          })
          .catch((error) => {
            console.error(error.message);
          });
      }
    }
  }

  function makeWidgetDraggable() {
    if (!widgetContainer) return;
    widgetContainer.style.position = "absolute";
    widgetContainer.style.zIndex = "999";
    widgetContainer.style.left = "10px";
    widgetContainer.style.top = "10px";
    let offsetX = 0,
      offsetY = 0,
      isDragging = false;
    function startDrag(event) {
      const draggableElement = event.target.closest("#sc-grabbing");
      if (!draggableElement || event.target.closest(".sc-dropdown")) return;
      event.preventDefault();
      isDragging = true;
      let clientX = event.clientX || event.touches?.[0]?.clientX;
      let clientY = event.clientY || event.touches?.[0]?.clientY;
      offsetX = clientX - widgetContainer.getBoundingClientRect().left;
      offsetY = clientY - widgetContainer.getBoundingClientRect().top;
      document.addEventListener("mousemove", moveAt);
      document.addEventListener("mouseup", stopDragging);
      document.addEventListener("touchmove", moveAt);
      document.addEventListener("touchend", stopDragging);
    }
    function moveAt(event) {
      if (!isDragging) return;
      let clientX = event.clientX || event.touches?.[0]?.clientX;
      let clientY = event.clientY || event.touches?.[0]?.clientY;
      const newX = clientX - offsetX;
      const newY = clientY - offsetY;
      widgetContainer.style.left = `${newX}px`;
      widgetContainer.style.top = `${newY}px`;
    }
    function stopDragging() {
      isDragging = false;
      document.removeEventListener("mousemove", moveAt);
      document.removeEventListener("mouseup", stopDragging);
      document.removeEventListener("touchmove", moveAt);
      document.removeEventListener("touchend", stopDragging);
    }
    widgetContainer.removeEventListener("mousedown", startDrag);
    widgetContainer.removeEventListener("touchstart", startDrag);
    widgetContainer.addEventListener("mousedown", startDrag);
    widgetContainer.addEventListener("touchstart", startDrag);
  }

  document.body.addEventListener("click", (e) => {
    const isInsideWidget = widgetContainer?.contains(e.target);
    const isToolbarIcon = e.target.closest(".sc-toolbar-icon");
    const isHiddenInput =
      e.target.tagName === "INPUT" && e.target.type === "file";

    if (
      !isInsideWidget &&
      !isToolbarIcon &&
      !isHiddenInput &&
      widgetContainer?.style.display === "block"
    ) {
      widgetContainer.style.display = "none";
    }
  });

  function adjustWidgetPosition() {
    if (!widgetContainer) return;

    if (window.innerWidth <= 768) {
      widgetContainer.style.left = "auto";
      widgetContainer.style.right = "0px";
      widgetContainer.style.top = "100px";
    }
  }

  window.addEventListener("resize", adjustWidgetPosition);
  adjustWidgetPosition();

  function injectIcon() {
    async function waitForTargets(selector, maxRetries = 10, delay = 500) {
      for (let attempt = 0; attempt < maxRetries; attempt++) {
        const elements = parent.document.querySelectorAll(selector);
        if (elements.length > 0) return elements;
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
      console.warn("⏱️ Timeout: Target elements not found:", selector);
      return [];
    }

    async function injectIconIntoTargetElements() {
      const targets = await waitForTargets(
        ".tidILMJ7AVANuKwS:not(.sc-processed)"
      );

      targets.forEach((element) => {
        element.classList.add("sc-processed");

        const deleteButton = element.querySelector('[aria-label="Remove"]');
        if (!deleteButton) {
          console.warn("❌ Delete button not found, skipping:", element);
          return;
        }

        if (element.querySelector(".sc-toolbar-icon")) return;

        const clonedIcon = document.createElement("img");
        clonedIcon.src = "https://i.ibb.co.com/kg9fn02s/Frame-33.png";
        clonedIcon.alt = "sc";
        clonedIcon.classList.add("sc-toolbar-icon", "sc-z-99999");
        Object.assign(clonedIcon.style, {
          width: "35px",
          height: "35px",
          borderRadius: "20%",
          cursor: "pointer",
          backgroundColor: "white",
          marginLeft: "6px",
        });

        deleteButton.parentNode.insertBefore(
          clonedIcon,
          deleteButton.nextSibling
        );

        clonedIcon.addEventListener("click", function (event) {
          event.stopPropagation();
          event.preventDefault();
          toggleWidgetVisibility(event);
          if (!widgetLoaded) {
            createWidget().then(() => {
              widgetContainer = document.getElementById("sc-widget-container");
              if (widgetContainer) {
                widgetContainer.style.display = "block";
              } else {
                console.error("❌ Widget container not found after creation.");
              }
            });
          } else {
            widgetContainer.style.display =
              widgetContainer.style.display === "none" ? "block" : "none";
          }
        });
      });
    }

    injectIconIntoTargetElements(); // run once at startup

    const observer = new MutationObserver(() => {
      injectIconIntoTargetElements();
    });
    observer.observe(parent.document.body, { childList: true, subtree: true });

    const iframe = document.querySelector("iframe");
    if (iframe) {
      iframe.contentWindow.document.addEventListener("click", function (event) {
        if (event.target.classList.contains("sc-admin-icon")) {
          event.stopPropagation();
          event.preventDefault();
          toggleWidgetVisibility(event);
        }
      });
    }
  }

  function waitForNavBar(attempts = 0) {
    if (attempts > 10) {
      console.error("❌ Failed to find Squarespace nav bar.");
      return;
    }
    const nav = parent.document.querySelector("ul.css-1tn5iw9");
    if (!nav) {
      setTimeout(() => waitForNavBar(attempts + 1), 500);
    } else {
      injectIcon();
    }
  }

  waitForNavBar();
  function checkView() {
    const isMobile = window.innerWidth <= 768;

    if (isMobile) {
      moveWidgetToMobileContainer();
    } else {
      moveWidgetToDesktop();
    }
  }

  function moveWidgetToMobileContainer() {
    if (!widgetContainer) return;

    const mobileContainer = parent.document.querySelector(
      'div[data-test="mouse-catcher-right-of-frame"].right-scroll-and-hover-catcher.js-space-around-frame'
    );

    if (mobileContainer) {
      const existingLink = parent.document.querySelector(
        'link[href="https://goswami34.github.io/squareCraft-widget/src/styles/parent.css"]'
      );

      if (!existingLink) {
        const link = parent.document.createElement("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href =
          "https://goswami34.github.io/squareCraft-widget/src/styles/parent.css";
        parent.document.head.appendChild(link);
      }

      mobileContainer.classList.add("sc-relative");

      widgetContainer.style.position = "absolute";
      widgetContainer.style.right = "11%";
      widgetContainer.style.top = "50%";
      widgetContainer.style.transform = "translateY(-50%)";

      mobileContainer.appendChild(widgetContainer);
    } else {
      console.warn(
        "❌ Mobile container not found. Widget remains in default location."
      );
    }
  }

  // fetchModifications();
  // // fetchImageModifications(lastClickedBlockId);
  // if (lastClickedBlockId) {
  //   fetchImageModifications(lastClickedBlockId);
  // } else {
  //   // Retry after a short delay until it gets set
  //   let retries = 5;
  //   const retryInterval = setInterval(() => {
  //     if (lastClickedBlockId) {
  //       fetchImageModifications(lastClickedBlockId);
  //       clearInterval(retryInterval);
  //     }

  //     // if (lastClickedBlockId) {
  //     //   fetchImageOverlayModifications(lastClickedBlockId);
  //     // }
  //     if (--retries <= 0) clearInterval(retryInterval);
  //   }, 300);
  // }

  // console.log("lastClickedBlockId", lastClickedBlockId);

  // if (lastClickedBlockId) {
  //   fetchImageOverlayModifications(lastClickedBlockId);
  // } else {
  //   // Retry after a short delay until it gets set
  //   let retries = 5;
  //   const retryInterval = setInterval(() => {
  //     if (lastClickedBlockId) {
  //       fetchImageOverlayModifications(lastClickedBlockId);
  //       clearInterval(retryInterval);
  //     }
  //     if (--retries <= 0) clearInterval(retryInterval);
  //   }, 300);
  // }

  // if (lastClickedBlockId) {
  //   fetchImageShadowModifications(lastClickedBlockId);
  // } else {
  //   // Retry after a short delay until it gets set
  //   let retries = 5;
  //   const retryInterval = setInterval(() => {
  //     if (lastClickedBlockId) {
  //       fetchImageShadowModifications(lastClickedBlockId);
  //       clearInterval(retryInterval);
  //     }
  //     if (--retries <= 0) clearInterval(retryInterval);
  //   }, 300);
  // }

  function addPendingModification(blockId, css, tagType) {
    if (!pendingModifications.has(blockId)) {
      pendingModifications.set(blockId, []);
    }
  }

  function moveWidgetToDesktop() {
    if (!widgetContainer) return;

    document.body.appendChild(widgetContainer);
  }

  checkView();
  window.addEventListener("resize", checkView);

  // Utility to get the latest border and border-radius styles from the selected button
  function getLatestButtonBorderStyles(selectedElement) {
    const btn = selectedElement?.querySelector(
      ".sqs-button-element--primary, .sqs-button-element--secondary, .sqs-button-element--tertiary"
    );
    if (!btn) return null;

    const computed = window.getComputedStyle(btn);
    return {
      buttonPrimary: {
        selector: ".sqs-button-element--primary",
        styles: {
          boxSizing: computed.boxSizing,
          borderStyle: computed.borderStyle,
          borderColor: computed.borderColor,
          borderTopWidth: computed.borderTopWidth,
          borderRightWidth: computed.borderRightWidth,
          borderBottomWidth: computed.borderBottomWidth,
          borderLeftWidth: computed.borderLeftWidth,
          borderRadius: computed.borderRadius,
          overflow: computed.overflow,
        },
      },
    };
  }

  // Find your publish button logic and update it to use the latest border styles
  // Example: in your publish handler (pseudo-code, adapt as needed)
  async function handlePublish() {
    // ... existing code ...
    // Save all pending modifications as before
    for (const [blockId, modifications] of pendingModifications.entries()) {
      for (const mod of modifications) {
        // ... existing code for other types ...
      }
    }
    // Now, always send the latest border styles for the selected element
    if (selectedElement) {
      const borderStyles = getLatestButtonBorderStyles(selectedElement);
      if (borderStyles) {
        await saveButtonBorderModifications(selectedElement.id, borderStyles);
      }
    }
    // ... existing code ...
  }
})();
