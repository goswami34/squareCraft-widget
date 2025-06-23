let pendingModifications = new Map();

(async function squareCraft() {
  let isSameOrigin = true;
  if (!window.__squareCraftResetFlags) {
    window.__squareCraftResetFlags = new Map();
  }

  const Url = isSameOrigin
    ? parent.document.location.href
    : document.location.href;
  console.log("parent", Url);

  try {
    void parent.document;
  } catch (e) {
    isSameOrigin = false;
  }

  function safeQuerySelector(selector) {
    return isSameOrigin
      ? parent.document.querySelector(selector)
      : document.querySelector(selector);
  }

  function safeQuerySelectorAll(selector) {
    try {
      if (parent && parent !== window && parent.document !== document) {
        return parent.document.querySelectorAll(selector);
      }
    } catch (err) {
      if (err.name === "SecurityError") {
        console.warn(
          `⚠️ Cross-origin restriction: falling back to current document for selectorAll: ${selector}`
        );
      } else {
        console.error(`❌ Error in safeQuerySelectorAll("${selector}"):`, err);
      }
    }
    return document.querySelectorAll(selector);
  }

  let selectedElement = null;
  let widgetContainer = null;

  let widgetLoaded = false;
  const widgetScript = document.getElementById("sc-script");

  let token = null;
  let userId = null;
  let widgetId = null;

  if (widgetScript) {
    token = widgetScript.dataset?.token;
    userId = widgetScript.dataset?.uId;
    widgetId = widgetScript.dataset?.wId;

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
  }

  let lastClickedBlockId = null;
  let lastClickedElement = null;
  let lastAppliedAlignment = null;
  let lastActiveAlignmentElement = null;

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

  function injectLaunchAnimationCSS(targetDoc = document) {
    if (targetDoc.getElementById("sc-launch-animation-style")) return;

    const style = targetDoc.createElement("style");
    style.id = "sc-launch-animation-style";
    style.innerHTML = `
          @keyframes scFadeInUp {
            0% {
              filter: grayscale(100%);
              transform: translateY(60px) scale(0.95);
              opacity: 0.5;
            }
            100% {
              filter: grayscale(0%);
              transform: translateY(0) scale(1);
              opacity: 1;
            }
          }
      
          body[id^="collection-"].sc-launching {
            animation: scFadeInUp 0.8s ease-out forwards;
            transform-origin: center center;
          }
        `;
    targetDoc.head.appendChild(style);
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

  const themeColors = await getSquarespaceThemeStyles();

  document.body.addEventListener("click", (event) => {
    if (selectedElement) {
      initButtonStyles(selectedElement);
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
    initImageUploadPreview(() => selectedElement);
    const trigger = event.target.closest("#border-color-select");

    if (trigger) {
      setTimeout(() => {
        initBorderColorPaletteToggle(themeColors);
      }, 100);
      return;
    }

    setTimeout(initImageSectionControls, 100);
    const clickedBlock = event.target.closest('[id^="block-"]');
    if (clickedBlock) {
      waitForElement("#typoSection, #imageSection, #buttonSection")
        .then(() => {
          detectBlockElementTypes(clickedBlock);
        })
        .catch((error) => {
          console.error(error.message);
        });
    }
    setTimeout(() => {
      handleBlockClick(event, {
        getTextType,
        getHoverTextType,
        selectedElement,
        setSelectedElement: (val) => (selectedElement = val),
        setLastClickedBlockId: (val) => (lastClickedBlockId = val),
        setLastClickedElement: (val) => (lastClickedElement = val),
        setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
        setLastActiveAlignmentElement: (val) =>
          (lastActiveAlignmentElement = val),
      });

      initButtonFontColorPaletteToggle(themeColors, () => selectedElement);
      initButtonIconPositionToggle(() => selectedElement);
      initHoverButtonShadowControls(() => selectedElement);
      initButtonIconRotationControl(() => selectedElement);
      initButtonIconSizeControl(() => selectedElement);
      initButtonIconSpacingControl(() => selectedElement);
      initButtonBorderControl(() => selectedElement);
      initButtonShadowControls(() => selectedElement);
      resetAllButtonStyles(() => selectedElement);
      initButtonBorderResetHandlers(() => selectedElement);
      initButtonFontFamilyControls(() => selectedElement);
      initButtonBorderTypeToggle(
        () => selectedElement,
        (selected) => {
          if (selected) {
            const event = new Event("reapplyBorder");
            selected.dispatchEvent(event);
          }
        }
      );
      initButtonBorderRadiusControl(() => selectedElement);
    }, 50);

    handleAlignmentClick(event, {
      lastClickedElement,
      getTextType,
      getHoverTextType,
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

    handleTextColorClick(event, lastClickedElement, applyStylesToElement);
    handleFontWeightDropdownClick(event);
    typoTabSelect(event);
    hoverTypoTabSelect(event);
  });

  document.body.addEventListener("click", (event) => {
    const dropdownTrigger = event.target.closest("#font-weight-dropdown");
    const dropdownList = document.getElementById("font-weight-dropdown-list");

    if (dropdownTrigger) {
      if (dropdownList.classList.contains("sc-hidden")) {
        dropdownList.classList.remove("sc-hidden");
      } else {
        dropdownList.classList.add("sc-hidden");
      }
    }
  });

  // async function fetchModifications(retries = 3) {
  //   const module = await import(
  //     "https://goswami34.github.io/squareCraft-widget/html.js"
  //   );
  //   const htmlString = module.html();

  //   if (
  //     typeof htmlString === "string" &&
  //     widgetContainer &&
  //     widgetContainer.innerHTML.trim() === ""
  //   ) {
  //     widgetContainer.innerHTML = htmlString;
  //   }

  //   setTimeout(() => {
  //     if (typeof module.initToggleSwitch === "function") {
  //       module.initToggleSwitch();
  //     }
  //   }, 200);

  //   const isEnabled = localStorage.getItem("sc_enabled") !== "false";

  //   if (!isEnabled) {
  //     return;
  //   }

  //   const pageId = document
  //     .querySelector("article[data-page-sections]")
  //     ?.getAttribute("data-page-sections");
  //   if (!pageId) return;

  //   if (!token || !userId) {
  //     console.warn("Missing authentication data");
  //     return;
  //   }

  //   try {
  //     const response = await fetch(
  //       `https://admin.squareplugin.com/api/v1/get-modifications?userId=${userId}`,
  //       {
  //         method: "GET",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     if (!response.ok)
  //       throw new Error(`HTTP error! status: ${response.status}`);

  //     const data = await response.json();

  //     if (!data.modifications || !Array.isArray(data.modifications)) {
  //       console.warn("⚠️ No modifications found or invalid format");
  //       return;
  //     }

  //     const modificationMap = new Map();

  //     data.modifications.forEach((mod) => {
  //       if (mod.pageId === pageId) {
  //         mod.elements.forEach((elem) => {
  //           if (elem.css) {
  //             modificationMap.set(elem.elementId, elem.css);
  //           }
  //         });
  //       }
  //     });

  //     const observer = new MutationObserver(() => {
  //       modificationMap.forEach((css, elementId) => {
  //         const element = document.getElementById(elementId);
  //         if (element) {
  //           Object.entries(css).forEach(([prop, value]) => {
  //             element.style.setProperty(prop, value, "important");
  //           });

  //           const nestedElements =
  //             element.querySelectorAll("h1, h2, h3, h4, p");
  //           nestedElements.forEach((nestedElem) => {
  //             Object.entries(css).forEach(([prop, value]) => {
  //               nestedElem.style.setProperty(prop, value, "important");
  //             });
  //           });

  //           if (!element.classList.contains("sc-font-modified")) {
  //             element.classList.add("sc-font-modified");
  //           }

  //           modificationMap.delete(elementId);
  //         }
  //       });
  //     });

  //     observer.observe(document.body, { childList: true, subtree: true });
  //   } catch (error) {
  //     console.error("❌ Error Fetching Modifications:", error);
  //     if (retries > 0) {
  //       setTimeout(() => fetchModifications(retries - 1), 2000);
  //     }
  //   }
  // }

  // async function fetchImageModifications() {
  //   const userId = localStorage.getItem("sc_u_id");
  //   const token = localStorage.getItem("sc_auth_token");
  //   const widgetId = localStorage.getItem("sc_w_id");
  //   const pageId = document
  //     .querySelector("article[data-page-sections]")
  //     ?.getAttribute("data-page-sections");

  //   if (!userId || !token || !widgetId || !pageId) {
  //     console.warn("⚠️ Missing credentials or page ID");
  //     return;
  //   }

  //   try {
  //     const res = await fetch(
  //       `https://admin.squareplugin.com/api/v1/get-image-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}`,
  //       {
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       }
  //     );

  //     const result = await res.json();
  //     if (!res.ok) throw new Error(result.message);

  //     const elements = result.elements || [];

  //     elements.forEach(({ elementId, css }) => {
  //       // --- Apply main block styles ---
  //       const imageStyles = css?.image?.styles || css?.image || {};
  //       const selector =
  //         css?.image?.selector || `#${elementId} div.sqs-image-content`;

  //       if (Object.keys(imageStyles).length > 0) {
  //         const styleTagId = `sc-style-${elementId}`;
  //         let styleTag = document.getElementById(styleTagId);
  //         if (!styleTag) {
  //           styleTag = document.createElement("style");
  //           styleTag.id = styleTagId;
  //           document.head.appendChild(styleTag);
  //         }

  //         let cssText = `${selector} {`;
  //         Object.entries(imageStyles).forEach(([prop, value]) => {
  //           if (value !== null && value !== undefined && value !== "null") {
  //             cssText += `${prop}: ${value} !important; `;
  //           }
  //         });
  //         cssText += "}";
  //         styleTag.textContent = cssText;
  //       }

  //       // --- Apply img tag styles ---
  //       const imageTagBlock = css?.imageTag;
  //       if (imageTagBlock?.selector && imageTagBlock?.styles) {
  //         const imgTagId = `sc-img-style-${elementId}`;
  //         let imgTag = document.getElementById(imgTagId);
  //         if (!imgTag) {
  //           imgTag = document.createElement("style");
  //           imgTag.id = imgTagId;
  //           document.head.appendChild(imgTag);
  //         }

  //         let imgCSS = `${imageTagBlock.selector} {`;
  //         Object.entries(imageTagBlock.styles).forEach(([prop, val]) => {
  //           if (val !== null && val !== undefined && val !== "null") {
  //             imgCSS += `${prop}: ${val} !important; `;
  //           }
  //         });
  //         imgCSS += "}";
  //         imgTag.textContent = imgCSS;
  //       }

  //       const block = document.getElementById(elementId);
  //       if (block) block.classList.add("sc-image-styled");

  //       ///////// this is new code

  //       // ✅ Sync UI controls with restored styles
  //       // const styleValues = css?.image?.styles || {};
  //       // const blockElement = document.getElementById(elementId);
  //       // if (!blockElement) return;

  //       // const imageContent = blockElement.querySelector(
  //       //   "div.sqs-image-content"
  //       // );
  //       // if (!imageContent) return;

  //       // // Select this image for syncing controls
  //       // document.querySelectorAll(".sqs-image-content").forEach((img) => {
  //       //   img.classList.remove("sc-selected-image");
  //       // });
  //       // imageContent.classList.add("sc-selected-image");

  //       // // ✅ Border Width Sync
  //       // const bw = styleValues["border-width"];
  //       // if (bw && document.getElementById("radiousField")) {
  //       //   const width = parseInt(bw);
  //       //   const slider = document.getElementById("radiousField");
  //       //   const bullet = document.getElementById("radiousBullet");
  //       //   const fill = document.getElementById("radiousFill");
  //       //   const display = document.getElementById("radiousCount");

  //       //   const sliderWidth = slider.offsetWidth;
  //       //   const percent = width / 100;
  //       //   const px = percent * sliderWidth;

  //       //   bullet.style.left = `${px}px`;
  //       //   bullet.style.transform = "translateX(-50%)";
  //       //   fill.style.width = `${px}px`;
  //       //   display.textContent = `${width}px`;
  //       // }

  //       // // ✅ Border Color Sync
  //       // const color = styleValues["border-color"];
  //       // if (color) {
  //       //   const code = document.getElementById("color-code");
  //       //   if (code) code.textContent = color;
  //       // }

  //       // // ✅ Border Style Sync
  //       // const style = styleValues["border-style"];
  //       // const styleBtnMap = {
  //       //   solid: "borderStyleSolid",
  //       //   dashed: "borderStyleDashed",
  //       //   dotted: "borderStyleDotted",
  //       // };
  //       // if (style && styleBtnMap[style]) {
  //       //   const btn = document.getElementById(styleBtnMap[style]);
  //       //   if (btn) {
  //       //     document
  //       //       .querySelectorAll(
  //       //         "#borderStyleSolid, #borderStyleDashed, #borderStyleDotted"
  //       //       )
  //       //       .forEach((b) => b.classList.remove("sc-bg-454545"));
  //       //     btn.classList.add("sc-bg-454545");
  //       //   }
  //       // }

  //       // // ✅ Border Radius Sync (main/all)
  //       // const radius = styleValues["border-radius"];
  //       // if (radius && document.getElementById("radiusField")) {
  //       //   const r = parseInt(radius);
  //       //   const slider = document.getElementById("radiusField");
  //       //   const bullet = document.getElementById("radiusBullet");
  //       //   const fill = document.getElementById("radiusFill");
  //       //   const display = document.getElementById("radiusCountAnother");

  //       //   const sliderWidth = slider.offsetWidth;
  //       //   const percent = r / 100;
  //       //   const px = percent * sliderWidth;

  //       //   bullet.style.left = `${px}px`;
  //       //   bullet.style.transform = "translateX(-50%)";
  //       //   fill.style.width = `${px}px`;
  //       //   display.textContent = `${r}px`;
  //       // }
  //     });

  //     console.log("✅ Applied styles to all image elements");
  //   } catch (error) {
  //     console.error(
  //       "❌ Failed to fetch all image modifications:",
  //       error.message
  //     );
  //   }
  // }

  // async function fetchImageOverlayModifications() {
  //   try {
  //     const userId = localStorage.getItem("sc_u_id");
  //     const token = localStorage.getItem("sc_auth_token");
  //     const widgetId = localStorage.getItem("sc_w_id");
  //     const pageId = document
  //       .querySelector("article[data-page-sections]")
  //       ?.getAttribute("data-page-sections");

  //     if (!userId || !token || !widgetId || !pageId) {
  //       console.warn(
  //         "Missing required data for fetching overlay modifications"
  //       );
  //       return;
  //     }

  //     // Get all image blocks on the page
  //     const imageBlocks = document.querySelectorAll(
  //       '[id^="block-yui_3_17_2_1_"]'
  //     );
  //     console.log("Found image blocks:", imageBlocks);

  //     // Fetch modifications for each image block
  //     for (const block of imageBlocks) {
  //       const elementId = block.id;
  //       const url = `https://admin.squareplugin.com/api/v1/get-image-overlay-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}&elementId=${elementId}`;
  //       console.log("Fetching from URL:", url);

  //       try {
  //         const response = await fetch(url, {
  //           method: "GET",
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: `Bearer ${token}`,
  //           },
  //         });

  //         if (!response.ok) {
  //           if (response.status === 404) {
  //             console.log(
  //               `No overlay modifications found for block: ${elementId}`
  //             );
  //             continue;
  //           }
  //           throw new Error(`HTTP error! status: ${response.status}`);
  //         }

  //         const data = await response.json();
  //         console.log(
  //           `✅ Fetched overlay modifications for block ${elementId}:",`,
  //           data
  //         );

  //         // FIX: Use data.elements, not data.modifications
  //         if (data && data.elements) {
  //           data.elements.forEach((element) => {
  //             if (element.elementId === elementId && element.overlayCSS) {
  //               const selector = element.overlayCSS.selector;
  //               const styles = element.overlayCSS.styles;

  //               // Debug: Log selector and check if element exists
  //               console.log("[Overlay Injection] Selector:", selector);
  //               const targetElem = document.querySelector(
  //                 selector.split("::")[0]
  //               );
  //               console.log(
  //                 "[Overlay Injection] Element exists:",
  //                 !!targetElem
  //               );

  //               let cssText = `${selector} {`;
  //               cssText += "position: absolute !important; "; // Always add position: absolute
  //               Object.entries(styles).forEach(([prop, value]) => {
  //                 if (
  //                   value !== null &&
  //                   value !== undefined &&
  //                   value !== "null"
  //                 ) {
  //                   if (prop === "content") {
  //                     cssText += `content: "${value}" !important; `;
  //                   } else {
  //                     cssText += `${prop}: ${value} !important; `;
  //                   }
  //                 }
  //               });
  //               cssText += "}";

  //               // Inject style tag
  //               const styleTagId = `sc-overlay-style-${element.elementId}`;
  //               let styleTag = document.getElementById(styleTagId);
  //               if (!styleTag) {
  //                 styleTag = document.createElement("style");
  //                 styleTag.id = styleTagId;
  //                 document.head.appendChild(styleTag);
  //               }
  //               styleTag.textContent = cssText;
  //               console.log("[Overlay Injection] Injected CSS:", cssText);
  //             }
  //           });
  //         }
  //       } catch (error) {
  //         console.error(
  //           `❌ Failed to fetch modifications for block ${elementId}:",`,
  //           error
  //         );
  //         continue;
  //       }
  //     }
  //   } catch (error) {
  //     console.error("❌ Failed to fetch image overlay modifications:", error);
  //     return null;
  //   }
  // }

  // async function fetchImageShadowModifications() {
  //   try {
  //     const token = localStorage.getItem("sc_auth_token");
  //     const userId = localStorage.getItem("sc_u_id");
  //     const widgetId = localStorage.getItem("sc_w_id");

  //     const pageId = document
  //       .querySelector("article[data-page-sections]")
  //       ?.getAttribute("data-page-sections");

  //     // Only select blocks that actually contain an image
  //     const allBlocks = document.querySelectorAll('[id^="block-"]');
  //     const imageBlocks = Array.from(allBlocks).filter((block) =>
  //       block.querySelector("img")
  //     );

  //     for (const block of imageBlocks) {
  //       const elementId = block.id;

  //       // Debug log all IDs used for the API call
  //       console.log("[fetchImageShadowModifications] IDs:", {
  //         userId,
  //         widgetId,
  //         pageId,
  //         elementId,
  //       });

  //       if (!token || !userId || !widgetId || !pageId || !elementId) {
  //         console.warn("❌ Missing required auth or page info");
  //         continue;
  //       }

  //       const apiUrl = `https://admin.squareplugin.com/api/v1/get-image-shadow-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}&elementId=${elementId}`;
  //       console.log("[fetchImageShadowModifications] Fetching:", apiUrl);

  //       const response = await fetch(apiUrl, {
  //         method: "GET",
  //         headers: {
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       if (response.status === 404) {
  //         // No shadow data for this block, not an error
  //         // console.info(`ℹ️ No shadow data for block: ${elementId}`);
  //         continue;
  //       }
  //       if (!response.ok) {
  //         console.error(
  //           `❌ Failed to fetch shadow for block: ${elementId} (status: ${response.status})`
  //         );
  //         continue;
  //       }

  //       // Log the API response for debugging
  //       const data = await response.json();
  //       console.log(
  //         "[fetchImageShadowModifications] API response for",
  //         elementId,
  //         data
  //       );
  //       const css = data?.element?.css;

  //       if (!css || !css.image?.selector || !css.image?.styles) {
  //         console.warn(`⚠️ Incomplete CSS data for block ${elementId}`);
  //         continue;
  //       }

  //       // Inject image styles
  //       const selector = css.image.selector;
  //       const styles = css.image.styles;

  //       // Debug: Log selector and check if element exists
  //       console.log("[Shadow Injection] Selector:", selector);
  //       const targetElem = document.querySelector(selector);
  //       console.log("[Shadow Injection] Element exists:", !!targetElem);

  //       if (Object.keys(styles).length > 0) {
  //         const styleTagId = `sc-shadow-style-${elementId}`;
  //         let styleTag = document.getElementById(styleTagId);
  //         if (!styleTag) {
  //           styleTag = document.createElement("style");
  //           styleTag.id = styleTagId;
  //           document.head.appendChild(styleTag);
  //         }

  //         let cssText = `${selector} {`;
  //         Object.entries(styles).forEach(([prop, value]) => {
  //           if (value !== null && value !== undefined && value !== "null") {
  //             cssText += `${prop}: ${value} !important; `;
  //           }
  //         });
  //         cssText += "}";

  //         styleTag.textContent = cssText;
  //         console.log("[Shadow Injection] Injected CSS:", cssText);
  //       }

  //       // Optional: imageTag styles
  //       if (css.imageTag?.selector && css.imageTag?.styles) {
  //         const tagStyleId = `sc-image-tag-style-${elementId}`;
  //         let tagStyle = document.getElementById(tagStyleId);
  //         if (!tagStyle) {
  //           tagStyle = document.createElement("style");
  //           tagStyle.id = tagStyleId;
  //           document.head.appendChild(tagStyle);
  //         }

  //         tagStyle.textContent = `
  //           ${css.imageTag.selector} {
  //             ${Object.entries(css.imageTag.styles)
  //               .map(([key, value]) => `${key}: ${value} !important;`)
  //               .join("\n")}
  //           }
  //         `;
  //       }

  //       // Set overflow: visible if shadow is present
  //       const blurVal = styles["box-shadow"]?.split(" ")[2];
  //       if (blurVal && parseInt(blurVal) > 0) {
  //         const overflowStyleId = `sc-overflow-style-${elementId}`;
  //         let overflowStyle = document.getElementById(overflowStyleId);
  //         if (!overflowStyle) {
  //           overflowStyle = document.createElement("style");
  //           overflowStyle.id = overflowStyleId;
  //           document.head.appendChild(overflowStyle);
  //         }

  //         overflowStyle.textContent = `
  //           #${elementId} .intrinsic, #${elementId} .sqs-image {
  //             overflow: visible !important;
  //           }
  //         `;
  //       }
  //     }
  //   } catch (err) {
  //     console.error("❌ Error fetching image shadow modifications:", err);
  //   }
  // }

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

  // // Fetch and apply button modifications from the backend
  // async function fetchButtonModifications(blockId = null) {
  //   const userId = localStorage.getItem("sc_u_id");
  //   const token = localStorage.getItem("sc_auth_token");
  //   const widgetId = localStorage.getItem("sc_w_id");
  //   const pageId = document
  //     .querySelector("article[data-page-sections]")
  //     ?.getAttribute("data-page-sections");

  //   if (!userId || !token || !widgetId || !pageId) {
  //     console.warn("⚠️ Missing credentials or page ID");
  //     return;
  //   }

  //   let url = `https://admin.squareplugin.com/api/v1/get-button-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}`;
  //   if (blockId) url += `&elementId=${blockId}`;

  //   try {
  //     const res = await fetch(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const result = await res.json();
  //     if (!res.ok) throw new Error(result.message);

  //     // Handle the nested structure: modifications[].elements[]
  //     const modifications = result.modifications || [];
  //     modifications.forEach((mod) => {
  //       const elements = mod.elements || [];
  //       elements.forEach(({ elementId, css }) => {
  //         // Apply button styles as external CSS
  //         const buttonPrimary = css?.buttonPrimary;
  //         if (buttonPrimary?.selector && buttonPrimary?.styles) {
  //           applyStylesAsExternalCSS(
  //             buttonPrimary.selector,
  //             buttonPrimary.styles
  //           );
  //           console.log(
  //             `✅ Applied button styles to ${elementId}:`,
  //             buttonPrimary.styles
  //           );
  //         }
  //         // Optionally handle secondary/tertiary
  //         const buttonSecondary = css?.buttonSecondary;
  //         if (buttonSecondary?.selector && buttonSecondary?.styles) {
  //           applyStylesAsExternalCSS(
  //             buttonSecondary.selector,
  //             buttonSecondary.styles
  //           );
  //         }
  //         const buttonTertiary = css?.buttonTertiary;
  //         if (buttonTertiary?.selector && buttonTertiary?.styles) {
  //           applyStylesAsExternalCSS(
  //             buttonTertiary.selector,
  //             buttonTertiary.styles
  //           );
  //         }
  //       });
  //     });
  //     console.log("✅ Applied button styles to all elements (external CSS)");
  //   } catch (error) {
  //     console.error("❌ Failed to fetch button modifications:", error.message);
  //   }
  // }

  // // Fetch and apply button border modifications from the backend
  // async function fetchButtonBorderModifications(blockId = null) {
  //   const userId = localStorage.getItem("sc_u_id");
  //   const token = localStorage.getItem("sc_auth_token");
  //   const widgetId = localStorage.getItem("sc_w_id");
  //   const pageId = document
  //     .querySelector("article[data-page-sections]")
  //     ?.getAttribute("data-page-sections");

  //   if (!userId || !token || !widgetId || !pageId) {
  //     console.warn("⚠️ Missing credentials or page ID");
  //     return;
  //   }

  //   let url = `https://admin.squareplugin.com/api/v1/get-button-border-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}`;
  //   if (blockId) url += `&elementId=${blockId}`;

  //   try {
  //     const res = await fetch(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const result = await res.json();
  //     if (!res.ok) throw new Error(result.message);

  //     // Handle the direct structure: elements[]
  //     const elements = result.elements || [];
  //     elements.forEach(({ elementId, selector, styles }) => {
  //       // Apply button border styles as external CSS
  //       if (selector && styles) {
  //         applyStylesAsExternalCSS(selector, styles, "sc-btn-border-style");
  //         console.log(
  //           `✅ Applied button border styles to ${elementId}:`,
  //           styles
  //         );
  //       }
  //     });
  //     console.log(
  //       "✅ Applied button border styles to all elements (external CSS)"
  //     );
  //   } catch (error) {
  //     console.error(
  //       "❌ Failed to fetch button border modifications:",
  //       error.message
  //     );
  //   }
  // }

  // // Fetch button shadow modifications from the backend
  // async function fetchButtonShadowModifications(blockId = null) {
  //   const userId = localStorage.getItem("sc_u_id");
  //   const token = localStorage.getItem("sc_auth_token");
  //   const widgetId = localStorage.getItem("sc_w_id");
  //   const pageId = document
  //     .querySelector("article[data-page-sections]")
  //     ?.getAttribute("data-page-sections");

  //   if (!userId || !token || !widgetId || !pageId) {
  //     console.warn("⚠️ Missing credentials or page ID");
  //     return;
  //   }

  //   let url = `https://admin.squareplugin.com/api/v1/get-button-shadow-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}`;
  //   if (blockId) url += `&elementId=${blockId}`;

  //   try {
  //     const res = await fetch(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     const result = await res.json();
  //     if (!res.ok) throw new Error(result.message);

  //     const elements = result.elements || [];
  //     elements.forEach(({ elementId, selector, styles }) => {
  //       if (!selector || !styles) return;

  //       const styleId = `sc-btn-shadow-style-${elementId}`;
  //       let styleTag = document.getElementById(styleId);
  //       if (!styleTag) {
  //         styleTag = document.createElement("style");
  //         styleTag.id = styleId;
  //         document.head.appendChild(styleTag);
  //       }

  //       let cssText = `${selector} {`;
  //       Object.entries(styles).forEach(([prop, val]) => {
  //         if (val !== null && val !== undefined && val !== "null") {
  //           cssText += `${prop}: ${val} !important; `;
  //         }
  //       });
  //       cssText += "}";

  //       styleTag.textContent = cssText;

  //       console.log(
  //         `✅ Applied button shadow styles for ${elementId}:`,
  //         styles
  //       );
  //     });

  //     console.log("✅ All button shadow modifications applied (external CSS)");
  //   } catch (error) {
  //     console.error(
  //       "❌ Failed to fetch button shadow modifications:",
  //       error.message
  //     );
  //   }
  // }

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

  // window.addEventListener("load", async () => {
  //   await fetchModifications();
  // });

  async function addHeadingEventListeners() {
    const widgetContainer = document.getElementById("sc-widget-container");
    if (!widgetContainer) return;

    if (widgetContainer.dataset.listenerAttached === "true") return;

    widgetContainer.dataset.listenerAttached = "true";

    function toggleTabClass(targetElement) {
      if (targetElement.classList.contains("sc-activeTab-border")) {
        targetElement.classList.remove("sc-activeTab-border");
        targetElement.classList.add("sc-inActiveTab-border");
      } else {
        targetElement.classList.remove("sc-inActiveTab-border");
        targetElement.classList.add("sc-activeTab-border");
      }
    }

    widgetContainer.addEventListener("click", (event) => {
      const tabElement = event.target;
      if (
        tabElement.classList.contains("sc-inActiveTab-border") ||
        tabElement.classList.contains("sc-activeTab-border")
      ) {
        toggleTabClass(tabElement);
      }
    });
  }

  const observer = new MutationObserver(() => {
    addHeadingEventListeners();
    fetchModifications();
  });

  const obsTarget = isSameOrigin ? parent.document.body : document.body;
  observer.observe(obsTarget, { childList: true, subtree: true });

  addHeadingEventListeners();

  try {
    const { injectNavbarIcon } = await import(
      "https://fatin-webefo.github.io/squareCraft-plugin/injectNavbarIcon.js"
    );
    injectNavbarIcon();
  } catch (error) {
    console.error("🚨 Failed to load navbar icon script", error);
  }

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
        getHoverTextType,
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
  }
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
        "https://fatin-webefo.github.io/squareCraft-plugin/src/styles/parent.css";
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
      hoverTypoTabSelect();
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
                getHoverTextType,
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
  async function createWidget(clickedBlock) {
    try {
      const module = await import(
        "https://fatin-webefo.github.io/squareCraft-plugin/html.js"
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
        const elements = safeQuerySelectorAll(selector);
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
        clonedIcon.src =
          "https://fatin-webefo.github.io/squareCraft-plugin/public/squarecraft-only-logo.svg";
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

    injectIconIntoTargetElements();

    const observer = new MutationObserver(() => {
      injectIconIntoTargetElements();
    });
    const obsTarget = isSameOrigin ? parent.document.body : document.body;
    observer.observe(obsTarget, { childList: true, subtree: true });

    try {
      iframe?.contentWindow?.document?.addEventListener("click", (event) => {
        if (event.target.classList.contains("sc-admin-icon")) {
          event.stopPropagation();
          event.preventDefault();
          toggleWidgetVisibility(event);
        }
      });
    } catch (e) {
      console.warn("⚠️ Could not access iframe document (likely cross-origin)");
    }
  }

  function waitForNavBar(attempts = 0) {
    if (attempts > 10) {
      console.error("❌ Failed to find Squarespace nav bar.");
      return;
    }
    const nav = safeQuerySelector("ul.css-1tn5iw9");
    if (!nav) {
      setTimeout(() => waitForNavBar(attempts + 1), 500);
    } else {
      injectIcon();
    }
  }

  waitForNavBar();
  handleSectionFind();
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

    const mobileContainer = safeQuerySelector(
      'div[data-test="mouse-catcher-right-of-frame"].right-scroll-and-hover-catcher.js-space-around-frame'
    );

    if (mobileContainer) {
      const existingLink = safeQuerySelector(
        'link[href="https://fatin-webefo.github.io/squareCraft-plugin/src/styles/parent.css"]'
      );

      if (!existingLink) {
        function createAndAppendToHead(tag) {
          const el = isSameOrigin
            ? parent.document.createElement(tag)
            : document.createElement(tag);
          const head = isSameOrigin ? parent.document.head : document.head;
          head.appendChild(el);
          return el;
        }

        const link = createAndAppendToHead("link");
        link.rel = "stylesheet";
        link.type = "text/css";
        link.href =
          "https://fatin-webefo.github.io/squareCraft-plugin/src/styles/parent.css";
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

  fetchModifications();

  function moveWidgetToDesktop() {
    if (!widgetContainer) return;

    document.body.appendChild(widgetContainer);
  }

  checkView();
  window.addEventListener("resize", checkView);
})();
