// Global pending modifications map
let pendingModifications = new Map();

// Make pendingModifications available globally
window.pendingModifications = pendingModifications;

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
  let selectedTextElement = null;

  // Wrapper function to update selectedElement and global variable
  function setSelectedElement(val) {
    selectedElement = val;
    window.lastClickedElement = val;

    // ✅ NEW: Sync border UI when element is selected
    if (val && typeof window.syncBorderUIForSelectedElement === "function") {
      // Use setTimeout to ensure the element is fully processed
      setTimeout(() => {
        window.syncBorderUIForSelectedElement();
      }, 100);
    }
  }

  // Wrapper function to update selectedSingleTextType and global variable
  function setSelectedSingleTextType(tag) {
    selectedSingleTextType = tag;
    window.selectedSingleTextType = tag;
  }

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

  // Normalize Squarespace block IDs to the stable form stored in DB
  // - Editor often uses transient ids like: block-yui_3_17_2_1_1751455829773_3877
  // - Database/API uses stable ids like: block-af8743b31fea872b2d48
  // This helper tries to resolve the stable id from data attributes.
  function getStableBlockId(input) {
    try {
      const normalize = (val) =>
        val ? (val.startsWith("block-") ? val : `block-${val}`) : null;

      const extractFromElement = (el) => {
        if (!el) return null;
        // Direct attribute
        const direct =
          el.getAttribute?.("data-block-id") || el.dataset?.blockId;
        if (direct) return normalize(direct);
        // Nearest ancestor
        const holder = el.closest?.("[data-block-id]");
        const fromClosest =
          holder?.getAttribute?.("data-block-id") || holder?.dataset?.blockId;
        if (fromClosest) return normalize(fromClosest);
        // Any descendant (Squarespace sometimes nests it)
        const child = el.querySelector?.("[data-block-id]");
        const fromChild =
          child?.getAttribute?.("data-block-id") || child?.dataset?.blockId;
        if (fromChild) return normalize(fromChild);
        return null;
      };

      if (!input) return null;

      let rawId = null;
      let element = null;
      if (typeof input === "string") {
        rawId = input;
        element = document.getElementById(input) || null;
      } else if (input instanceof Element) {
        element = input;
        rawId = input.id || null;
      }

      // 1) Try current document
      let stable = extractFromElement(element);
      if (stable) return stable;

      // 2) If id already stable (not yui), return it
      if (rawId && rawId.startsWith("block-") && !rawId.includes("yui_")) {
        return rawId;
      }

      // 3) Try inside the Squarespace site iframe (actual page DOM)
      try {
        const siteFrame = document.getElementById("sqs-site-frame");
        const frameDoc =
          siteFrame?.contentDocument || siteFrame?.contentWindow?.document;
        if (frameDoc) {
          const elInFrame =
            typeof input === "string" ? frameDoc.getElementById(input) : null;
          stable = extractFromElement(elInFrame);
          if (stable) return stable;
        }
      } catch (_) {}

      return null;
    } catch (_) {
      return null;
    }
  }

  const { initButtonAdvanceStyles } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/WidgetButtonSection/WidgetButtonAdvanceStyles/WidgetButtonAdvanceStyles.js"
  );
  // const { handleSectionFind } = await import(
  //   "https://fatin-webefo.github.io/squareCraft-plugin/src/section/handleSectionFind.js"
  // );
  const { ButtonAdvanceToggleControls } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/ButtonAdvanceToggleControls/ButtonAdvanceToggleControls.js"
  );
  const { getTextType } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/getTextType.js"
  );
  // const { getHoverTextType } = await import(
  //   "https://fatin-webefo.github.io/squareCraft-plugin/src/utils/getHoverTextType.js"
  // );

  const { handleFontWeightDropdownClick } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/clickEvents/handleFontWeightDropdownClick.js"
  );
  const { initHoverTypoTabControls } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/clickEvents/initHoverTypoTabControls.js"
  );
  const { handleBlockClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleBlockClick.js"
  );
  const { initImageStateTabToggle } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/components/WidgetImageSection/initImageStateTabToggle/initImageStateTabToggle.js"
  );
  const { WidgetImageHoverToggleControls } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/components/WidgetImageSection/WidgetImageHoverToggleControls/WidgetImageHoverToggleControls.js"
  );

  const { handleAlignmentClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleAlignmentClick.js"
  );
  const { handleTextColorClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleTextColorClick.js"
  );
  // const { typoTabSelect } = await import(
  //   "https://fatin-webefo.github.io/squareCraft-plugin/src/clickEvents/typoTabSelect.js"
  // );
  const { hoverTypoTabSelect } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/clickEvents/hoverTypoTabSelect.js"
  );

  // in the place of image show button this is responsibe import files
  const { detectBlockElementTypes } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/components/BlockType/detectBlockElementTypes.js"
  );
  const { initImageSectionControls } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/initImageSectionControls.js" // image ar jaygay button ashe atai karon
  );

  // in the place of image show button this is responsibe import files end

  const { initImageSectionToggleControls } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/initImageSectionToggleControls.js"
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
  const { initImageMaskControls } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/initImageMaskControls.js"
  );
  // const { getSquarespaceThemeStyles } = await import(
  //   "https://fatin-webefo.github.io/squareCraft-plugin/src/utils/getSquarespaceThemeStyles.js"
  // );
  const { buttonTooltipControls } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/buttonTooltipControls/buttonTooltipControls.js"
  );
  const { initBorderColorPaletteToggle } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/initBorderColorPaletteToggle.js"
  );
  const { createHoverableArrowSVG } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/utils/createHoverableArrowSVG/createHoverableArrowSVG.js"
  );
  const { initButtonFontColorPaletteToggle } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/initButtonFontColorPaletteToggle/initButtonFontColorPaletteToggle.js"
  );

  // in the place of image show button this is responsibe import files end

  const { getTextTypeBold } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/getTexttypeBold.js"
  );
  // const { handleFontWeightDropdownClick } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleFontWeightDropdownClick.js"
  // );

  const { typoTabSelect } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/typoTabSelect.js"
  );

  // const { initButtonSectionToggleControls } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/utils/initButtonSectionToggleControls/initButtonSectionToggleControls.js"
  // );
  // const { initImageUploadPreview } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/utils/initButtonSectionToggleControls/initImageUploadPreview.js"
  // );

  const { getSquarespaceThemeStyles } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/getSquarespaceThemeStyles.js"
  );
  // const { initBorderColorPaletteToggle } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/utils/initBorderColorPaletteToggle.js"
  // );
  const { saveModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

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
    "https://goswami34.github.io/squareCraft-widget/src/Link/handleFontSizeLink.js"
  );
  const { handleFontWeightLink } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Link/handleFontSizeLink.js"
  );
  // const { handleTextHighLinghtClick } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/Link/handleTextHighLinght.js"
  // );
  const { handleAllFontSizeClick, initFontSizePublishButton } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/All/handleAllFontSize.js"
  );

  const { handleAllTextTransformClick, initTextTransformPublishButton } =
    await import(
      "https://goswami34.github.io/squareCraft-widget/src/All/handleAllTextTransform.js"
    );
  const { handleAllTextAlignClick, initTextAlignPublishButton } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/All/handleAllTextAlign.js"
  );
  const { handleAllLetterSpacingClick, initLetterSpacingPublishButton } =
    await import(
      "https://goswami34.github.io/squareCraft-widget/src/All/handleLetterSpeacing.js"
    );

  const { handleAllLineHeightClick, initLineHeightPublishButton } =
    await import(
      "https://goswami34.github.io/squareCraft-widget/src/All/handleAllLineHeight.js"
    );

  const { handleAllFontWeightClick, initFontWeightPublishButton } =
    await import(
      "https://goswami34.github.io/squareCraft-widget/src/All/handleAllFontWeight.js"
    );

  const { handleAllTextColorClick, initTextColorPublishButton } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/All/handleAllTextColor.js"
  );

  const { handleFontSize } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/Bold/handleFontSize.js"
  );

  const { handleAllBlockClick } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/clickEvents/handleAllBlockClick.js"
  );

  const { handleAllTextHighlightClick, initTextHighlightPublishButton } =
    await import(
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
    "https://goswami34.github.io/squareCraft-widget/src/Link/handleFontSizeLink.js"
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

  // const { initButtonAdvanceStyles } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/button/WidgetButtonSection/WidgetButtonAdvanceStyles/WidgetButtonAdvanceStyles.js"
  // );
  // const { ButtonAdvanceToggleControls } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/button/ButtonAdvanceToggleControls/ButtonAdvanceToggleControls.js"
  // );

  // const {
  //   initHoverButtonSectionToggleControls,
  //   initHoverButtonEffectDropdowns,
  // } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/button/initHoverButtonSectionToggleControls/initHoverButtonSectionToggleControls.js"
  // );
  // const { initButtonSectionToggleControls } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/button/initButtonSectionToggleControls/initButtonSectionToggleControls.js"
  // );
  // const { initImageUploadPreview } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/button/initButtonSectionToggleControls/initImageUploadPreview.js"
  // );

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

  const { saveLinkTextModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const { initImageResetHandler } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const { ButtonBorderColorPalateToggle } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/ButtonBorderColorPalate/ButtonBorderColorPalateToggle.js"
  );

  const { ButtonHoverBorderColorPalateToggle } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/ButtonHoverBorderColor/ButtonHoverBorderColor.js"
  );
  // const { ButtonTextColorPalate } = await import(
  //   "https://goswami34.github.io/squareCraft-widget/src/button/ButtonTextColor/ButtonTextColorPalate.js"
  // );

  const { ButtonTextColorPalate } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/initButtonFontColorPaletteToggle/initButtonFontColorPaletteToggle.js"
  );

  const { buttonShadowColorPalate } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/ButtonShadowColorPalate/buttonShadowColorPalate.js"
  );

  const { saveButtonColorModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const { saveTypographyAllModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const { saveButtonHoverBorderModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const { saveButtonHoverShadowModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const { ButtonHoverShadowColorPalateToggle } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/ButtonHoverShadowColor/ButtonHoverShadowColor.js"
  );

  const { ButtonHoverBackgroundColorModification } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/ButtonHoverColorModification/ButtonHoverBackgroundColorModification.js"
  );

  const { ButtonHoverColorModification } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/ButtonHoverColorModification/ButtonHoverColorModification.js"
  );

  const { saveButtonHoverColorModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const { initRemoveButtonIconHandler, removeButtonIcon } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const { saveButtonHoverIconModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const { ButtonHoverIconColorPalateToggle } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/ButtonHoverIconColor/ButtonHoverIconColor.js"
  );

  const { saveButtonHoverEffectModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  window.saveButtonHoverColorModifications = saveButtonHoverColorModifications;

  // Make saveButtonColorModifications available globally
  window.saveButtonColorModifications = saveButtonColorModifications;

  // Make mergeButtonHoverColorModifications available globally
  window.mergeButtonHoverColorModifications =
    mergeButtonHoverColorModifications;

  // Make fetchButtonIconModifications available globally for testing
  window.fetchButtonIconModifications = fetchButtonIconModifications;

  // Fetch hover-border styles for the whole widget (no pageId/elementId anymore)
  async function fetchButtonHoverBorderModifications(opts = {}) {
    // Back-compat: if someone still passes a blockId as the first arg, ignore it
    if (typeof opts === "string") {
      console.warn(
        "fetchButtonHoverBorderModifications: blockId is ignored now."
      );
      opts = {};
    }

    const { include = "all", prefer } = opts;

    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");

    console.log("🔑 creds", {
      userId: !!userId,
      token: !!token,
      widgetId: !!widgetId,
      include,
      prefer,
    });

    if (!userId || !token || !widgetId) {
      console.warn("❌ Missing required data to fetch hover border styles", {
        userId,
        token: token ? "present" : "MISSING",
        widgetId,
      });
      return { success: false, error: "Missing required data" };
    }

    // Build URL to new endpoint (no pageId/elementId)
    const params = new URLSearchParams({
      userId,
      widgetId,
    });
    if (include && include !== "all") params.set("include", include);
    if (prefer === "query") params.set("prefer", "query"); // helpful for Postman tests

    const url = `https://admin.squareplugin.com/api/v1/fetch-button-hover-border-modifications?${params.toString()}`;
    console.log("🌐 GET", url);

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      console.log("📥 Response", res.status, result);

      if (!res.ok) throw new Error(result.message || `HTTP ${res.status}`);

      const hover = result.hoverBorder || {};
      const entries = Object.entries(hover).filter(
        ([, v]) =>
          v &&
          v.selector &&
          v.styles &&
          typeof v.styles === "object" &&
          Object.keys(v.styles).length > 0
      );

      if (entries.length === 0) {
        console.log("ℹ️ No hover border modifications found.");
        return {
          success: true,
          message: "No hover border modifications found.",
        };
      }

      // Apply each bucket's CSS
      entries.forEach(([bucket, { selector, styles }]) => {
        // Unique style tag id per bucket (widget-wide)
        const styleId = `sc-hover-border-${bucket}`;
        applyHoverStylesAsExternalCSS(selector, styles, styleId);
        console.log(`✅ Applied ${bucket} hover border styles`, {
          selector,
          styles,
        });
      });

      console.log("🎉 Hover border styles applied.");
      return { success: true, count: entries.length };
    } catch (err) {
      console.error("❌ Failed to fetch hover border modifications:", err);
      return { success: false, error: err.message };
    }
  }

  // Make fetchButtonHoverBorderModifications available globally
  window.fetchButtonHoverBorderModifications =
    fetchButtonHoverBorderModifications;

  // Fetch and apply hover-shadow (no pageId / elementId needed)
  async function fetchButtonHoverShadowModifications() {
    console.log("🚀 fetchButtonHoverShadowModifications");

    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");

    if (!userId || !token || !widgetId) {
      console.warn("⚠️ Missing credentials", {
        userId: !!userId,
        token: !!token,
        widgetId: !!widgetId,
      });
      return { success: false, error: "Missing credentials" };
    }

    // Build URL — backend supports prefer=query for Postman/manual tests too
    const base =
      "https://admin.squareplugin.com/api/v1/fetch-button-hover-shadow-modifications";
    const params = new URLSearchParams({
      userId, // we explicitly pass userId
      widgetId, // required
      include: "all", // get all buckets
      prefer: "query", // match your API convention
    });
    const url = `${base}?${params}`;

    // Helper: normalize style keys to CSS kebab-case
    const toKebab = (obj = {}) =>
      Object.fromEntries(
        Object.entries(obj).flatMap(([k, v]) => {
          if (v === null || v === undefined || v === "null" || v === "")
            return [];
          return [[k.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(), v]];
        })
      );

    try {
      console.log("🌐 GET", url);
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (!res.ok) {
        console.error("❌ API error", res.status, result);
        throw new Error(result.message || `HTTP ${res.status}`);
      }

      // Backend returns { hoverShadow: { buttonPrimary?, buttonSecondary?, buttonTertiary? }, ... }
      const hoverShadow = result.hoverShadow || result.shadow || {};
      console.log("📦 hoverShadow payload:", hoverShadow);

      const applyBucket = (bucketKey, styleIdSuffix) => {
        const bucket = hoverShadow?.[bucketKey];
        if (!bucket || !bucket.selector || !bucket.styles) return;

        const styles = toKebab(bucket.styles);
        if (Object.keys(styles).length === 0) return;

        // Stable style tag id per bucket so we don’t duplicate
        const styleId = `sc-hover-shadow-${styleIdSuffix}`;
        applyHoverStylesAsExternalCSS(bucket.selector, styles, styleId);
        console.log(`✅ Applied ${bucketKey} hover-shadow`, {
          selector: bucket.selector,
          styles,
        });
      };

      // Apply all available buckets
      applyBucket("buttonPrimary", "primary");
      applyBucket("buttonSecondary", "secondary");
      applyBucket("buttonTertiary", "tertiary");

      console.log("🎉 Hover-shadow fetch/apply complete");
      return { success: true, count: Object.keys(hoverShadow || {}).length };
    } catch (error) {
      console.error("❌ Failed to fetch/apply hover shadow:", error);
      return { success: false, error: error.message };
    }
  }

  // Expose globally for debugging/testing
  window.fetchButtonHoverShadowModifications =
    fetchButtonHoverShadowModifications;

  // Make saveButtonHoverBorderModifications available globally for testing
  window.saveButtonHoverBorderModifications =
    saveButtonHoverBorderModifications;

  // Test function to manually trigger button icon fetch
  window.testButtonIconFetch = async () => {
    console.log("🧪 Testing button icon fetch...");
    await fetchButtonIconModifications();
  };

  // Test function to check if button elements exist
  window.checkButtonElements = () => {
    console.log("🔍 Checking button elements on page...");

    const primaryButtons = document.querySelectorAll(
      ".sqs-button-element--primary"
    );
    console.log("Primary buttons found:", primaryButtons.length);

    const allButtons = document.querySelectorAll('[class*="button"]');
    console.log("All buttons found:", allButtons.length);

    const icons = document.querySelectorAll(
      ".sqscraft-button-icon, .sqscraft-image-icon"
    );
    console.log("Icons found:", icons.length);

    if (primaryButtons.length > 0) {
      console.log("First primary button:", primaryButtons[0]);
      console.log("Button HTML:", primaryButtons[0].outerHTML);
    }

    if (allButtons.length > 0) {
      console.log(
        "All button classes:",
        Array.from(allButtons).map((btn) => btn.className)
      );
    }
  };

  // Test function to apply styles to all primary buttons
  window.testApplyToAllButtons = () => {
    console.log("🧪 Testing apply to all buttons...");
    const primaryButtons = document.querySelectorAll(
      ".sqs-button-element--primary"
    );
    console.log("Found", primaryButtons.length, "primary buttons");

    primaryButtons.forEach((button, index) => {
      console.log(`Button ${index + 1}:`, button);
      console.log("Classes:", button.className);
    });
  };

  // Test function to debug hover border functionality
  window.testHoverBorderFunctionality = async () => {
    console.log("🧪 Testing hover border functionality...");

    // Check if functions are available
    console.log(
      "saveButtonHoverBorderModifications available:",
      typeof saveButtonHoverBorderModifications === "function"
    );
    console.log(
      "fetchButtonHoverBorderModifications available:",
      typeof fetchButtonHoverBorderModifications === "function"
    );

    // Test save function
    const testPayload = {
      buttonPrimary: {
        selector: ".sqs-button-element--primary",
        styles: {
          borderTopWidth: "2px",
          borderRightWidth: "2px",
          borderBottomWidth: "2px",
          borderLeftWidth: "2px",
          borderStyle: "solid",
          borderColor: "red",
          borderRadius: "5px",
        },
      },
    };

    console.log("📤 Testing save with payload:", testPayload);

    try {
      const result = await saveButtonHoverBorderModifications(
        "test-block-id",
        testPayload
      );
      console.log("✅ Save test result:", result);
    } catch (error) {
      console.error("❌ Save test failed:", error);
    }

    // Test fetch function
    console.log("📥 Testing fetch...");
    try {
      const fetchResult = await fetchButtonHoverBorderModifications();
      console.log("✅ Fetch test result:", fetchResult);
    } catch (error) {
      console.error("❌ Fetch test failed:", error);
    }
  };

  // Simple test function for fetchButtonHoverBorderModifications
  window.testFetchButtonHoverBorder = async () => {
    console.log("🧪 Testing fetchButtonHoverBorderModifications...");
    console.log("📞 Calling function directly...");

    try {
      const result = await fetchButtonHoverBorderModifications();
      console.log("✅ Function executed successfully:", result);
    } catch (error) {
      console.error("❌ Function failed:", error);
    }
  };

  // Test function to manually trigger hover border save
  window.testHoverBorderSave = async () => {
    console.log("🧪 Testing hover border save manually...");

    // Get current selected element
    const selectedElement =
      window.selectedElement || document.querySelector('[id^="block-"]');
    if (!selectedElement) {
      console.error("❌ No selected element found");
      return;
    }

    const blockId = selectedElement.id;
    console.log("📋 Using block ID:", blockId);

    const testPayload = {
      buttonPrimary: {
        selector: ".sqs-button-element--primary",
        styles: {
          borderTopWidth: "3px",
          borderRightWidth: "3px",
          borderBottomWidth: "3px",
          borderLeftWidth: "3px",
          borderStyle: "solid",
          borderColor: "blue",
          borderRadius: "8px",
        },
      },
    };

    console.log("📤 Testing save with payload:", testPayload);

    try {
      const result = await saveButtonHoverBorderModifications(
        blockId,
        testPayload
      );
      console.log("✅ Manual save test result:", result);

      if (result.success) {
        console.log("🎉 Hover border save successful!");
      } else {
        console.error("❌ Hover border save failed:", result.error);
      }
    } catch (error) {
      console.error("❌ Manual save test failed:", error);
    }
  };

  // Test function to manually trigger button hover effect fetch
  window.testButtonHoverEffectFetch = async () => {
    console.log("🧪 Testing button hover effect fetch manually...");

    try {
      const result = await fetchButtonHoverEffectModifications();
      console.log("✅ Button hover effect fetch test result:", result);

      if (result.success) {
        console.log("🎉 Button hover effect fetch successful!");
        console.log(`📊 Found ${result.modifications} modifications`);
      } else {
        console.error("❌ Button hover effect fetch failed:", result.error);
      }
    } catch (error) {
      console.error("❌ Button hover effect fetch test failed:", error);
    }
  };

  // Make applyStylesAsExternalCSS available globally
  window.applyStylesAsExternalCSS = applyStylesAsExternalCSS;

  const { initButtonIconColorPalate } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/button/initButtonStyles/initButtonStyles.js"
  );

  const { saveButtonIconModifications } = await import(
    "https://goswami34.github.io/squareCraft-widget/html.js"
  );

  const themeColors = await getSquarespaceThemeStyles();

  // document.body.addEventListener("click", (event) => {
  //   if (selectedElement) {
  //     initButtonStyles(selectedElement);
  //   }
  //   if (selectedElement) {
  //     initButtonAdvanceStyles(() => selectedElement);
  //   }

  //   if (selectedElement) {
  //     initHoverButtonIconRotationControl(() => selectedElement);
  //   }
  //   if (selectedElement) {
  //     initHoverButtonIconSizeControl(() => selectedElement);
  //   }
  //   if (selectedElement) {
  //     initHoverButtonIconSpacingControl(() => selectedElement);
  //   }
  //   if (selectedElement) {
  //     initHoverButtonBorderRadiusControl(() => selectedElement);
  //   }
  //   if (selectedElement) {
  //     initHoverButtonBorderTypeToggle(() => selectedElement);
  //   }
  //   if (selectedElement) {
  //     initHoverButtonBorderControl(() => selectedElement);
  //   }
  //   if (selectedElement) {
  //     applyHoverButtonEffects(() => selectedElement);
  //   }
  //   initImageUploadPreview(() => selectedElement);
  //   const trigger = event.target.closest("#border-color-select");

  //   if (trigger) {
  //     setTimeout(() => {
  //       initBorderColorPaletteToggle(themeColors);
  //     }, 100);
  //     return;
  //   }

  //   setTimeout(initImageSectionControls, 100);
  //   const clickedBlock = event.target.closest('[id^="block-"]');
  //   if (clickedBlock) {
  //     waitForElement("#typoSection, #imageSection, #buttonSection")
  //       .then(() => {
  //         detectBlockElementTypes(clickedBlock);
  //       })
  //       .catch((error) => {
  //         console.error(error.message);
  //       });
  //   }
  //   setTimeout(() => {
  //     handleBlockClick(event, {
  //       getTextType,
  //       getHoverTextType,
  //       selectedElement,
  //       setSelectedElement: (val) => (selectedElement = val),
  //       setLastClickedBlockId: (val) => (lastClickedBlockId = val),
  //       setLastClickedElement: (val) => (lastClickedElement = val),
  //       setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
  //       setLastActiveAlignmentElement: (val) =>
  //         (lastActiveAlignmentElement = val),
  //     });

  document.body.addEventListener("click", (event) => {
    // Border color palette trigger
    const trigger = event.target.closest("#border-color-select");
    if (trigger) {
      console.log("Border color select clicked!"); // Debug log
      setTimeout(() => {
        initBorderColorPaletteToggle(themeColors);
      }, 100);
      return;
    }
    // ... existing code ...
  });

  document.body.addEventListener("click", (event) => {
    // if (selectedElement) {
    //   initButtonStyles(selectedElement);
    // }
    // const trigger = event.target.closest("#border-color-select");

    // if (trigger) {
    //   console.log("✅ border-color-select clicked");
    //   setTimeout(() => {
    //     initBorderColorPaletteToggle(themeColors);
    //   }, 100);
    //   return;
    // }

    const triggerOne = document.getElementById("buttonFontColorPalate");
    const paletteOne = document.getElementById("button-font-color-palette");

    if (!triggerOne || !paletteOne) return;

    triggerOne.addEventListener("click", () => {
      paletteOne.classList.toggle("sc-hidden");

      // Load palette after toggle
      setTimeout(() => {
        saveButtonShadowModifications(
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

    // Button border color palette trigger
    const triggerButtonBorderColor = event.target.closest(
      "#button-border-color-select"
    );
    const paletteButtonBorderColor = document.getElementById(
      "button-border-color-palette"
    );

    if (triggerButtonBorderColor && paletteButtonBorderColor) {
      paletteButtonBorderColor.classList.toggle("sc-hidden");

      // Load palette after toggle
      if (!paletteButtonBorderColor.classList.contains("sc-hidden")) {
        setTimeout(() => {
          ButtonBorderColorPalateToggle(
            themeColors,
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
        }, 50);
      }
      return;
    }

    // Button border color palette trigger end here

    // Button hover border color palette trigger start here
    const triggerButtonHoverBorderColor = event.target.closest(
      ".sc-square-6.sc-cursor-pointer"
    );

    // Check if this is the hover border color trigger by looking for the specific palette
    const isHoverBorderColorTrigger =
      triggerButtonHoverBorderColor &&
      triggerButtonHoverBorderColor.closest(
        ".sc-py-4px.sc-relative.sc-mt-3.sc-bg-3f3f3f.sc-inActiveTab-border"
      ) &&
      triggerButtonHoverBorderColor
        .closest(
          ".sc-py-4px.sc-relative.sc-mt-3.sc-bg-3f3f3f.sc-inActiveTab-border"
        )
        .querySelector("#button-hover-border-color-palette");
    const paletteButtonHoverBorderColor = document.getElementById(
      "button-hover-border-color-palette"
    );

    if (isHoverBorderColorTrigger && paletteButtonHoverBorderColor) {
      paletteButtonHoverBorderColor.classList.toggle("sc-hidden");

      // Load palette after toggle
      if (!paletteButtonHoverBorderColor.classList.contains("sc-hidden")) {
        setTimeout(() => {
          ButtonHoverBorderColorPalateToggle(
            themeColors,
            () => selectedElement,
            saveButtonHoverBorderModifications,
            (blockId, css, tagType) => {
              if (!pendingModifications.has(blockId)) {
                pendingModifications.set(blockId, []);
              }
              pendingModifications.get(blockId).push({ css, tagType });
            },
            showNotification
          );
        }, 50);
      }
      return;
    }

    // Button hover border color palette trigger end here

    // button hover shadow color palette trigger start here
    const triggerButtonHoverShadowColor = event.target.closest(
      "#hover-shadow-color-trigger"
    );

    // Check if this is the hover shadow color trigger
    const isHoverShadowColorTrigger = triggerButtonHoverShadowColor !== null;
    const paletteButtonHoverShadowColor = document.getElementById(
      "button-hover-shadow-color-palette"
    );

    if (isHoverShadowColorTrigger && paletteButtonHoverShadowColor) {
      paletteButtonHoverShadowColor.classList.toggle("sc-hidden");

      // Load palette after toggle
      if (!paletteButtonHoverShadowColor.classList.contains("sc-hidden")) {
        setTimeout(() => {
          ButtonHoverShadowColorPalateToggle(
            themeColors,
            () => selectedElement,
            saveButtonHoverShadowModifications,
            (blockId, css, tagType) => {
              if (!pendingModifications.has(blockId)) {
                pendingModifications.set(blockId, []);
              }
              pendingModifications.get(blockId).push({ css, tagType });
            },
            showNotification
          );
        }, 50);
      }
      return;
    }

    // button hover color color palette trigger end here

    const triggerButtonHoverColorModification = event.target.closest(
      "#hover-button-text-color-trigger"
    );

    // Check if this is the hover shadow color trigger
    const isHoverColorTrigger = triggerButtonHoverColorModification !== null;
    const paletteButtonHoverColor = document.getElementById(
      "hover-button-text-color-palette"
    );

    if (isHoverColorTrigger && paletteButtonHoverColor) {
      paletteButtonHoverColor.classList.toggle("sc-hidden");

      // Load palette after toggle
      if (!paletteButtonHoverColor.classList.contains("sc-hidden")) {
        setTimeout(() => {
          ButtonHoverColorModification(
            themeColors,
            () => selectedElement,
            saveButtonHoverColorModifications,
            addPendingModification,
            showNotification
          );
        }, 50);
      }
      return;
    }

    // button color palette trigger end here

    // button hover background color palette trigger start here

    const triggerButtonHoverBackgroundColor = event.target.closest(
      "#hover-button-background-color-trigger"
    );

    const isHoverBackgroundColorTrigger =
      triggerButtonHoverBackgroundColor !== null;
    const paletteButtonHoverBackgroundColor = document.getElementById(
      "hover-button-background-color-palette"
    );

    if (isHoverBackgroundColorTrigger && paletteButtonHoverBackgroundColor) {
      paletteButtonHoverBackgroundColor.classList.toggle("sc-hidden");

      // Load palette after toggle
      if (!paletteButtonHoverBackgroundColor.classList.contains("sc-hidden")) {
        setTimeout(() => {
          ButtonHoverBackgroundColorModification(
            themeColors,
            () => selectedElement,
            saveButtonHoverColorModifications,
            addPendingModification,
            showNotification
          );
        }, 50);
      }
      return;
    }

    // button hover background color palette trigger end here

    // button hover icon color palette trigger start here

    const triggerButtonHoverIconColor = event.target.closest(
      "#hover-button-icon-color-trigger"
    );

    const isHoverIconColorTrigger = triggerButtonHoverIconColor !== null;
    const paletteButtonHoverIconColor = document.getElementById(
      "button-hover-icon-color-palette"
    );

    console.log("🔍 Icon Color Trigger Debug:", {
      triggerButtonHoverIconColor,
      isHoverIconColorTrigger,
      paletteButtonHoverIconColor,
      eventTarget: event.target,
      eventType: event.type,
      eventTargetId: event.target.id,
      eventTargetClass: event.target.className,
    });

    if (isHoverIconColorTrigger && paletteButtonHoverIconColor) {
      console.log("✅ Toggling icon color palette visibility");
      paletteButtonHoverIconColor.classList.toggle("sc-hidden");

      const isHidden =
        paletteButtonHoverIconColor.classList.contains("sc-hidden");
      console.log("🎨 Palette hidden state:", isHidden);

      // Load palette after toggle
      if (!isHidden) {
        console.log("🚀 Loading icon color palette");
        setTimeout(() => {
          ButtonHoverIconColorPalateToggle(
            themeColors,
            () => selectedElement,
            saveButtonHoverIconModifications,
            addPendingModification,
            showNotification
          );
        }, 50);
      }
      return;
    } else {
      console.log("❌ Icon color trigger not found or palette not found:", {
        triggerFound: !!triggerButtonHoverIconColor,
        paletteFound: !!paletteButtonHoverIconColor,
        allIconColorElements: document.querySelectorAll(
          "#hover-button-icon-color-trigger"
        ),
        allPaletteElements: document.querySelectorAll(
          "#button-hover-icon-color-palette"
        ),
      });
    }

    // button hover icon color palette trigger end here

    // button icon color palette trigger start here
    const triggerButtonIconColor = event.target.closest(
      "#button-icon-color-select"
    );
    const paletteButtonIconColor = document.getElementById(
      "button-icon-color-palette"
    );

    if (triggerButtonIconColor && paletteButtonIconColor) {
      paletteButtonIconColor.classList.toggle("sc-hidden");

      // Load palette after toggle
      if (!paletteButtonIconColor.classList.contains("sc-hidden")) {
        setTimeout(() => {
          initButtonIconColorPalate(
            themeColors,
            () => selectedElement,
            saveButtonIconModifications,
            (blockId, css, tagType) => {
              if (!pendingModifications.has(blockId)) {
                pendingModifications.set(blockId, []);
              }
              pendingModifications.get(blockId).push({ css, tagType });
            },
            showNotification
          );
        }, 50);
      }
      return;
    }

    // button shadow color palette trigger start here
    const triggerButtonShadowColor = event.target.closest(
      "#button-shadow-color-select"
    );
    const paletteButtonShadowColor = document.getElementById(
      "button-shadow-color-palette"
    );

    if (triggerButtonShadowColor && paletteButtonShadowColor) {
      paletteButtonShadowColor.classList.toggle("sc-hidden");

      // Load palette after toggle
      if (!paletteButtonShadowColor.classList.contains("sc-hidden")) {
        setTimeout(() => {
          buttonShadowColorPalate(
            themeColors,
            () => selectedElement,
            (blockId, css, tagType) => {
              if (!pendingModifications.has(blockId)) {
                pendingModifications.set(blockId, []);
              }
              pendingModifications.get(blockId).push({ css, tagType });
            },
            showNotification
          );
        }, 50);
      }
      return;
    }

    // button shadow color palette trigger end here

    // button text color palette trigger start here
    const triggerButtonTextColor = event.target.closest(
      "#button-text-color-select"
    );
    const paletteButtonTextColor = document.getElementById(
      "button-text-color-palette"
    );

    if (triggerButtonTextColor && paletteButtonTextColor) {
      paletteButtonTextColor.classList.toggle("sc-hidden");

      // Load palette after toggle
      if (!paletteButtonTextColor.classList.contains("sc-hidden")) {
        setTimeout(() => {
          ButtonTextColorPalate(
            themeColors,
            () => selectedElement,
            addPendingModification,
            showNotification
          );
        }, 50);
      }
      return;
    }

    // button text color palette trigger end here

    // button background color palette trigger start here
    const triggerButtonBackgroundColor = event.target.closest(
      "#buttonFontColorPalate"
    );
    const paletteButtonBackgroundColor = document.getElementById(
      "button-font-color-palette"
    );

    if (triggerButtonBackgroundColor && paletteButtonBackgroundColor) {
      paletteButtonBackgroundColor.classList.toggle("sc-hidden");

      // Load palette after toggle
      if (!paletteButtonBackgroundColor.classList.contains("sc-hidden")) {
        setTimeout(() => {
          initButtonFontColorPaletteToggle(
            themeColors,
            () => selectedElement,
            saveButtonColorModifications,
            addPendingModification,
            showNotification
          );
        }, 50);
      }
      return;
    }

    // button background color palette trigger end here
    // Add trigger for image shadow color palette
    const triggerShadowOne = document.getElementById("ShadowFontColorPalate");
    const paletteShadowOne = document.getElementById("shadow-color-palette");

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
      initHoverButtonIconRotationControl(
        () => selectedElement,
        saveButtonHoverIconModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
    }
    if (selectedElement) {
      initHoverButtonIconSizeControl(
        () => selectedElement,
        saveButtonHoverIconModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
    }
    if (selectedElement) {
      initHoverButtonIconSpacingControl(
        () => selectedElement,
        saveButtonHoverIconModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
    }
    if (selectedElement) {
      initHoverButtonBorderRadiusControl(
        () => selectedElement,
        saveButtonHoverBorderModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
    }
    if (selectedElement) {
      initHoverButtonBorderTypeToggle(
        () => selectedElement,
        saveButtonHoverBorderModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
    }
    if (selectedElement) {
      initHoverButtonBorderControl(
        () => selectedElement,
        saveButtonHoverBorderModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
    }
    if (selectedElement) {
      applyHoverButtonEffects(
        () => selectedElement,
        saveButtonHoverEffectModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );
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

      // Sync hover button styles from the selected element to update UI controls
      if (window.syncHoverButtonStylesFromElement && selectedElement) {
        window.syncHoverButtonStylesFromElement(selectedElement);
      }

      initButtonFontColorPaletteToggle(
        themeColors,
        () => selectedElement,
        saveButtonColorModifications,
        addPendingModification,
        showNotification
      );
      initButtonIconPositionToggle(
        () => selectedElement,
        saveButtonIconModifications,
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
        saveButtonHoverShadowModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );

      // Restore hover shadow state from existing applied styles
      if (
        typeof window.restoreHoverShadowStateFromAppliedStyles === "function"
      ) {
        window.restoreHoverShadowStateFromAppliedStyles();
      }

      // Sync hover shadow state with actual DOM values
      if (typeof window.syncHoverButtonShadowStylesFromElement === "function") {
        window.syncHoverButtonShadowStylesFromElement(selectedElement);
      }

      initButtonIconRotationControl(
        () => selectedElement,
        saveButtonIconModifications,
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
        saveButtonIconModifications,
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
        saveButtonIconModifications,
        (blockId, css, tagType) => {
          if (!pendingModifications.has(blockId)) {
            pendingModifications.set(blockId, []);
          }
          pendingModifications.get(blockId).push({ css, tagType });
        },
        showNotification
      );

      // Initialize remove button icon handler
      initRemoveButtonIconHandler(() => selectedElement, showNotification);

      // Icon upload functionality is handled by initImageUploadPreview.js
      // No need to initialize it here as it's already handled elsewhere
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
      setSelectedSingleTextType: setSelectedSingleTextType,
      setSelectedElement: setSelectedElement,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      setLastClickedElement: (val) => (lastClickedElement = val),
      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
    });

    handleAlignmentClick(event, {
      lastClickedElement,
      getTextType,
      // getHoverTextType,
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
      setSelectedElement: setSelectedElement,
      setLastClickedBlockId: (val) => (lastClickedBlockId = val),
      setLastClickedElement: (val) => (lastClickedElement = val),
      setLastAppliedAlignment: (val) => (lastAppliedAlignment = val),
      setLastActiveAlignmentElement: (val) =>
        (lastActiveAlignmentElement = val),
      // setSelectedTextType: (tagsArray) => selectedTextType = tagsArray,
      setSelectedSingleTextType: setSelectedSingleTextType,
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
      saveLinkTextModifications,
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
      saveLinkTextModifications,
      setSelectedElement: (val) => (selectedElement = val), // Add this line
      addPendingModification: (blockId, css, tagType) => {
        if (!pendingModifications.has(blockId)) {
          pendingModifications.set(blockId, []);
        }
        pendingModifications.get(blockId).push({ css, tagType });
      },
      showNotification: showNotification,
    });

    handleFontWeightLink(event, {
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
      saveLinkTextModifications,
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
      saveLinkTextModifications,
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
      saveTypographyAllModifications,
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
        console.warn(
          "⚠️ Old font family dropdown not found - this is expected for new typography system."
        );
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
    const italicFontWeightSelect = document.getElementById(
      "squareCraftItalicFontWeight"
    );
    if (italicFontWeightSelect && !italicFontWeightSelect.dataset.initialized) {
      italicFontWeightSelect.dataset.initialized = "true";

      italicFontWeightSelect.addEventListener("change", (event) => {
        handleItalicFontWeightClick(event, {
          lastClickedElement,
          selectedSingleTextType,
          addPendingModification,
          showNotification,
        });
      });
    }
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
      saveLinkTextModifications,
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
      handleTextHighLinghtLink(event, {
        lastClickedElement,
        applyStylesToElement,
        saveLinkTextModifications,
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

    initImageShadowControls(
      () => selectedElement,
      saveImageShadowModifications
    );

    //Image section code end here

    // initImageShadowControls(() => selectedElement, saveModificationsforImage);

    // initImageShadowControls(() => {
    //   if (!selectedElement) {
    //     console.warn("⚠️ selectedElement not defined yet.");
    //     return null;
    //   }
    //   return selectedElement;
    // }, saveImageShadowModifications);

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
      } else {
        dropdownList.classList.add("sc-hidden");
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

  // ✅ fetch typography all functionality code start here
  async function fetchAllTypographyModifications(blockId = null) {
    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");
    const pageId = document
      .querySelector("article[data-page-sections]")
      ?.getAttribute("data-page-sections");

    if (!userId || !token || !widgetId || !pageId) {
      console.warn("⚠️ Missing credentials or page ID");
      return null;
    }

    // Use provided blockId, or fallback to global lastClickedBlockId
    const elementId = blockId || lastClickedBlockId;

    // The API requires elementId parameter, so we need to provide it
    if (!elementId) {
      console.log("⚠️ No elementId available, skipping typography fetch");
      return null;
    }

    const apiUrl = `https://admin.squareplugin.com/api/v1/get-typography-all-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}&elementId=${elementId}`;
    console.log("🔍 Fetching typography modifications for element:", elementId);

    console.log("🔍 API URL:", apiUrl);

    try {
      const response = await fetch(apiUrl, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorText = await response.text();
        if (response.status === 404) {
          // Silently handle 404s - this is expected when no modifications exist
          return null;
        }

        console.error(`❌ API returned ${response.status}`);
        console.error(`❌ Response body:`, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log("✅ Successfully fetched typography modifications");
      return result;
    } catch (error) {
      console.error("❌ Error fetching typography modifications:", error);
      return null;
    }
  }

  // Call backend to reset button modifications
  // async function resetButtonModifications() {
  //   try {
  //     const userId = localStorage.getItem("sc_u_id");
  //     const widgetId = localStorage.getItem("sc_w_id");
  //     const token = localStorage.getItem("sc_auth_token");

  //     if (!userId || !widgetId) {
  //       console.warn(
  //         "⚠️ Missing userId or widgetId in localStorage; aborting reset"
  //       );
  //       if (typeof showNotification === "function") {
  //         showNotification("Missing user/widget ID. Cannot reset.", "error");
  //       }
  //       return;
  //     }

  //     const url = `https://admin.squareplugin.com/api/v1/reset-button-modifications`;

  //     const response = await fetch(url, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         ...(token ? { Authorization: `Bearer ${token}` } : {}),
  //       },
  //       body: JSON.stringify({ userId, widgetId, prefer: "query" }),
  //     });

  //     if (!response.ok) {
  //       const text = await response.text();
  //       throw new Error(`HTTP ${response.status}: ${text}`);
  //     }

  //     // Clear any injected button-related styles on the client
  //     try {
  //       const selectors = [
  //         'style[id^="sc-button-"]',
  //         'style[id^="sc-btn-"]',
  //         // Backward/explicit ids used in various helpers
  //         "#sc-btn-border-style",
  //       ];
  //       const styleTags = document.querySelectorAll(selectors.join(","));
  //       styleTags.forEach((tag) => tag.remove());
  //     } catch (_) {}

  //     if (typeof showNotification === "function") {
  //       showNotification("Button modifications reset successfully.", "success");
  //     } else {
  //       console.log("✅ Button modifications reset successfully");
  //     }
  //   } catch (error) {
  //     console.error("❌ Failed to reset button modifications:", error);
  //     if (typeof showNotification === "function") {
  //       showNotification("Failed to reset button modifications.", "error");
  //     }
  //   }
  // }

  //Reset Button (WidgetButtonSection) – delegated click handler
  // Note: Removed unscoped reset call to avoid resetting all button types unintentionally.

  const VALID_TYPES = ["primary", "secondary", "tertiary"];

  function getSelectedButtonType() {
    const explicit =
      document
        .querySelector("[data-sc-button-tab].active")
        ?.getAttribute("data-type") ||
      document
        .querySelector("[data-sc-selected-button]")
        ?.getAttribute("data-type");
    const v = (explicit || "").toLowerCase();
    if (VALID_TYPES.includes(v)) return v;
    const el =
      typeof getSelectedElement === "function" ? getSelectedElement() : null;
    if (el && el.classList) {
      if (el.classList.contains("sqs-button-element--primary"))
        return "primary";
      if (el.classList.contains("sqs-button-element--secondary"))
        return "secondary";
      if (el.classList.contains("sqs-button-element--tertiary"))
        return "tertiary";
    }
    return null;
  }

  document.addEventListener("click", (event) => {
    const resetTrigger = event.target.closest(
      "#buttonResetAll, #buttonResetAll-icon, [data-sc-reset-button]"
    );
    if (!resetTrigger) return;
    event.preventDefault();
    const datasetType = (
      resetTrigger.getAttribute("data-button") ||
      resetTrigger.getAttribute("data-type") ||
      resetTrigger.dataset.buttonType ||
      ""
    ).toLowerCase();
    const type = VALID_TYPES.includes(datasetType)
      ? datasetType
      : getSelectedButtonType();
    resetButtonModifications(type);
  });

  async function resetButtonModifications(button) {
    try {
      const userId = localStorage.getItem("sc_u_id");
      const widgetId = localStorage.getItem("sc_w_id");
      const token = localStorage.getItem("sc_auth_token");
      if (!userId || !widgetId) {
        if (typeof showNotification === "function")
          showNotification("Missing user/widget ID. Cannot reset.", "error");
        return;
      }

      const b = (button || "").toLowerCase();
      const isScoped = VALID_TYPES.includes(b);

      const SC_API_BASE = "https://admin.squareplugin.com";
      const base = `${SC_API_BASE}/api/v1/reset-button-modifications`;
      const qs = new URLSearchParams({ userId, widgetId });
      if (isScoped) qs.append("button", b);
      if (!token) qs.append("prefer", "query");
      const url = `${base}?${qs.toString()}`;

      const res = await fetch(url, {
        method: "POST",
        headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const suffix = {
        primary: "--primary",
        secondary: "--secondary",
        tertiary: "--tertiary",
      };
      const removeAll = () => {
        const selectors = [
          'style[id^="sc-button-"]',
          'style[id^="sc-btn-"]',
          "#sc-btn-border-style",
        ];
        document
          .querySelectorAll(selectors.join(","))
          .forEach((n) => n.remove());
      };
      const removeScoped = (type) => {
        const suf = suffix[type];
        const selectors = [
          `style[id^="sc-button-"][id*="${suf}"]`,
          `style[id^="sc-btn-"][id*="${suf}"]`,
          `style[data-sc-button-type="${type}"]`,
          `style[data-button-type="${type}"]`,
          `style[data-type="${type}"]`,
        ];
        document
          .querySelectorAll(selectors.join(","))
          .forEach((n) => n.remove());
      };
      isScoped ? removeScoped(b) : removeAll();

      if (typeof window.syncButtonStylesFromElement === "function")
        window.syncButtonStylesFromElement();

      if (typeof showNotification === "function") {
        showNotification(
          isScoped
            ? `Reset ${b} button modifications.`
            : "Reset all button modifications.",
          "success"
        );
      }
    } catch (e) {
      if (typeof showNotification === "function")
        showNotification("Failed to reset button modifications.", "error");
    }
  }
  //Reset Button (WidgetButtonSection) – delegated click handler

  async function fetchTypographyModifications() {
    console.log("🚀 Starting fetchTypographyModifications...");

    // Check if we have a selected element or last clicked block
    const selectedBlockId = lastClickedBlockId;

    if (!selectedBlockId) {
      console.log("ℹ️ No specific block selected, skipping typography fetch");
      return;
    }

    console.log(
      "🔍 Fetching typography modifications for block:",
      selectedBlockId
    );
    const result = await fetchAllTypographyModifications(selectedBlockId);
    if (!result) {
      console.log("ℹ️ No typography modifications found for this block");
      return;
    }

    console.log("📄 Raw typography response:", result);

    // Handle different response structures
    let elements = [];

    if (result.elements && Array.isArray(result.elements)) {
      elements = result.elements;
      console.log("📋 Using direct elements structure");
    } else if (result.modifications && Array.isArray(result.modifications)) {
      console.log("📋 Using nested modifications structure");
      result.modifications.forEach((mod) => {
        if (mod.elements && Array.isArray(mod.elements)) {
          elements = elements.concat(mod.elements);
        }
      });
    } else if (result.elementId && result.css) {
      elements = [{ elementId: result.elementId, css: result.css }];
      console.log("📋 Using single element structure");
    } else {
      console.log("⚠️ No recognized structure found in response");
      console.log("📋 Available keys:", Object.keys(result));
      return;
    }

    console.log(`🔍 Total typography elements found: ${elements.length}`);

    let appliedCount = 0;

    elements.forEach(({ elementId, css }) => {
      if (!elementId || !css) {
        console.log("⏭️ Skipping element without ID or CSS:", elementId);
        return;
      }

      if (elementId.includes("yui_") || elementId.length > 50) {
        console.log("⏭️ Skipping element with suspicious ID:", elementId);
        return;
      }

      console.log(`🔍 Processing typography element: ${elementId}`);

      const styleTagId = `sc-typography-style-${elementId}`;
      let styleTag = document.getElementById(styleTagId);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleTagId;
        document.head.appendChild(styleTag);
      }

      let cssText = `#${elementId} h1, #${elementId} h2, #${elementId} h3, #${elementId} h4, #${elementId} h5, #${elementId} h6, #${elementId} p, #${elementId} span {`;
      Object.entries(css).forEach(([prop, value]) => {
        if (value !== null && value !== undefined && value !== "null") {
          cssText += `${prop}: ${value} !important; `;
        }
      });
      cssText += "}";

      styleTag.textContent = cssText;

      const element = document.getElementById(elementId);
      if (element && !element.classList.contains("sc-typography-modified")) {
        element.classList.add("sc-typography-modified");
      }

      appliedCount++;
      console.log(
        `✅ Applied typography modifications to element: ${elementId}`
      );
    });

    console.log(
      `✅ Typography modifications completed - Applied: ${appliedCount}`
    );
  }

  // Fetch typography modifications for all elements on the page
  async function fetchAllTypographyModificationsForPage() {
    console.log("🚀 Starting fetchAllTypographyModificationsForPage...");

    // Since the API requires elementId, we need to find all blocks on the page and fetch for each
    const blocks = document.querySelectorAll('[id^="block-"]');
    console.log(`🔍 Found ${blocks.length} blocks on the page`);

    if (blocks.length === 0) {
      console.log("ℹ️ No blocks found on the page");
      return;
    }

    let totalApplied = 0;

    // Fetch typography modifications for each block
    for (const block of blocks) {
      const blockId = block.id;

      // Skip blocks with very long IDs (but allow yui_ IDs since they exist in database)
      if (blockId.length > 100) {
        console.log("⏭️ Skipping block with very long ID:", blockId);
        continue;
      }

      console.log(`🔍 Fetching typography modifications for block: ${blockId}`);
      const result = await fetchAllTypographyModifications(blockId);

      if (!result) {
        console.log(
          `ℹ️ No typography modifications found for block: ${blockId}`
        );
        continue;
      }

      // Process the result for this block
      let elements = [];

      if (result.elements && Array.isArray(result.elements)) {
        elements = result.elements;
      } else if (result.modifications && Array.isArray(result.modifications)) {
        result.modifications.forEach((mod) => {
          if (mod.elements && Array.isArray(mod.elements)) {
            elements = elements.concat(mod.elements);
          }
        });
      } else if (result.elementId && result.css) {
        elements = [{ elementId: result.elementId, css: result.css }];
      }

      console.log("📋 Processing elements for block:", blockId);
      console.log("📋 Elements found:", elements.length);

      // Apply modifications for this block
      elements.forEach(({ elementId, css }) => {
        if (!elementId || !css) {
          console.log("⏭️ Skipping element without ID or CSS:", elementId);
          return;
        }

        console.log(`🔍 Processing typography element: ${elementId}`);
        console.log("📋 CSS structure:", css);

        // Handle nested CSS structure (h1, h2, h3, etc.)
        const styleTagId = `sc-typography-style-${elementId}`;
        let styleTag = document.getElementById(styleTagId);
        if (!styleTag) {
          styleTag = document.createElement("style");
          styleTag.id = styleTagId;
          document.head.appendChild(styleTag);
        }

        let cssText = "";

        // Process each heading type (h1, h2, h3, etc.)
        Object.entries(css).forEach(([headingType, headingData]) => {
          if (
            headingData &&
            typeof headingData === "object" &&
            headingData.styles
          ) {
            const styles = headingData.styles;
            const selector =
              headingData.selector || `#${elementId} ${headingType}`;

            if (Object.keys(styles).length > 0) {
              cssText += `${selector} {`;
              Object.entries(styles).forEach(([prop, value]) => {
                if (value !== null && value !== undefined && value !== "null") {
                  cssText += `${prop}: ${value} !important; `;
                }
              });
              cssText += "}\n";
            }
          }
        });

        // If no specific heading styles, apply to all typography elements
        if (!cssText) {
          cssText = `#${elementId} h1, #${elementId} h2, #${elementId} h3, #${elementId} h4, #${elementId} h5, #${elementId} h6, #${elementId} p, #${elementId} span {`;
          Object.entries(css).forEach(([prop, value]) => {
            if (value !== null && value !== undefined && value !== "null") {
              cssText += `${prop}: ${value} !important; `;
            }
          });
          cssText += "}";
        }

        styleTag.textContent = cssText;

        const element = document.getElementById(elementId);
        if (element && !element.classList.contains("sc-typography-modified")) {
          element.classList.add("sc-typography-modified");
        }

        totalApplied++;
        console.log(
          `✅ Applied typography modifications to element: ${elementId}`
        );
      });
    }

    console.log(
      `✅ All typography modifications completed - Applied: ${totalApplied} out of ${blocks.length} blocks processed`
    );
  }
  // ✅ fetch typography all functionality code end here

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

                // ✅ CRITICAL FIX: Only apply overlay if there's a valid background-color
                const backgroundColor = styles["background-color"];
                if (
                  !backgroundColor ||
                  backgroundColor === "transparent" ||
                  backgroundColor === "rgba(0, 0, 0, 0)" ||
                  backgroundColor === "null"
                ) {
                  console.log(
                    "[Overlay Injection] Skipping overlay - no valid background color:",
                    backgroundColor
                  );
                  return;
                }

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

  function applyHoverStylesAsExternalCSS(selector, styles, uniqueStyleId) {
    // Check if style tag already exists
    let styleTag = document.getElementById(uniqueStyleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = uniqueStyleId;
      document.head.appendChild(styleTag);
    }

    const cssRules = Object.entries(styles)
      .map(([prop, value]) => `${prop}: ${value} !important;`)
      .join(" ");

    // Append :hover to the selector if not already present
    const hoverSelector = selector.includes(":hover")
      ? selector
      : `${selector}:hover`;

    styleTag.textContent = `${hoverSelector} { ${cssRules} }`;
  }

  // Helper function to apply hover effect styles as external CSS
  function applyHoverEffectStylesAsExternalCSS(
    selector,
    styles,
    uniqueStyleId
  ) {
    // Check if style tag already exists
    let styleTag = document.getElementById(uniqueStyleId);
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = uniqueStyleId;
      document.head.appendChild(styleTag);
    }

    const cssRules = Object.entries(styles)
      .map(([prop, value]) => `${prop}: ${value} !important;`)
      .join(" ");

    // Append :hover to the selector if not already present
    const hoverSelector = selector.includes(":hover")
      ? selector
      : `${selector}:hover`;

    styleTag.textContent = `${hoverSelector} { ${cssRules} }`;
  }

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

  // fetch button color modifications from the backend

  // Fetch the single root-level css bundle (no pageId, no elementId)
  async function fetchButtonModifications() {
    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");

    if (!userId || !token || !widgetId) {
      console.warn("⚠️ Missing credentials (userId/token/widgetId).");
      return;
    }

    // NOTE: route name must match your router
    // router.get("/get-button-modifications", authMiddleware, fetchButtonModification)
    const url = `https://admin.squareplugin.com/api/v1/get-button-modifications?userId=${encodeURIComponent(
      userId
    )}&widgetId=${encodeURIComponent(widgetId)}`;

    // convert any camelCase coming from DB to kebab-case before applying
    const toKebabCaseObject = (obj = {}) =>
      Object.fromEntries(
        Object.entries(obj).map(([k, v]) => [
          k.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
          v,
        ])
      );

    try {
      const res = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.message || `HTTP ${res.status}`);

      // New response shape: { success, message, css, updatedAt }
      const css = result?.css || {};
      const blocks = [
        css.buttonPrimary,
        css.buttonSecondary,
        css.buttonTertiary,
      ].filter(Boolean);

      if (blocks.length === 0) {
        console.info("ℹ️ No button css saved yet.");
        return;
      }

      // Apply each block as external CSS
      for (const block of blocks) {
        const selector = block?.selector;
        const styles = block?.styles || {};
        if (!selector || !Object.keys(styles).length) continue;

        // protect against camelCase keys stored earlier (e.g., marginRight)
        const kebabStyles = toKebabCaseObject(styles);

        applyStylesAsExternalCSS(selector, kebabStyles);
        console.log("✅ Applied button styles:", selector, kebabStyles);

        // ✅ Persist and sync font-related controls if present
        try {
          const type = selector.includes("--secondary")
            ? "buttonSecondary"
            : selector.includes("--tertiary")
            ? "buttonTertiary"
            : "buttonPrimary";
          const fontData = {
            family: styles.fontFamily || styles["font-family"],
            weight: styles.fontWeight || styles["font-weight"],
            size: styles.fontSize || styles["font-size"],
            letterSpacing: styles.letterSpacing || styles["letter-spacing"],
            transform: styles.textTransform || styles["text-transform"],
          };
          // If at least one font prop exists, cache and sync UI
          if (
            fontData.family ||
            fontData.weight ||
            fontData.size ||
            fontData.letterSpacing ||
            fontData.transform
          ) {
            try {
              localStorage.setItem(
                `sc_font_vals_${type}`,
                JSON.stringify(fontData)
              );
            } catch (_) {}
            if (window.syncFontUIFromFetched)
              window.syncFontUIFromFetched(fontData);
          }
        } catch (_) {}
      }

      console.log("✅ Button styles applied (from root-level css).");
    } catch (err) {
      console.error("❌ Failed to fetch button modifications:", err.message);
    }
  }

  // ✅ Restore font values from cache on load (mirrors border restore)
  function restoreFontValuesFromCache() {
    try {
      const buckets = ["buttonPrimary", "buttonSecondary", "buttonTertiary"];
      buckets.forEach((b) => {
        const raw = localStorage.getItem(`sc_font_vals_${b}`);
        if (!raw) return;
        const data = JSON.parse(raw);
        if (window.syncFontUIFromFetched) window.syncFontUIFromFetched(data);
      });
    } catch (_) {}
  }

  // ✅ Frontend fetch aligned to backend (no pageId/elementId)
  async function fetchButtonColorModifications(blockId = null) {
    console.log("🚀 Starting fetchButtonColorModifications...");
    console.log("📋 Parameters (ignored now):", { blockId });

    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");

    console.log("🔑 Credentials check:", {
      userId: userId ? "✅ Present" : "❌ Missing",
      token: token ? "✅ Present" : "❌ Missing",
      widgetId: widgetId ? "✅ Present" : "❌ Missing",
    });

    if (!userId || !token || !widgetId) {
      console.warn("⚠️ Missing credentials");
      console.log("❌ Missing data:", {
        userId: !userId,
        token: !token,
        widgetId: !widgetId,
      });
      return;
    }

    const url = `https://admin.squareplugin.com/api/v1/fetch-button-color-modifications?userId=${encodeURIComponent(
      userId
    )}&widgetId=${encodeURIComponent(widgetId)}`;

    console.log("🌐 API URL:", url);
    console.log("📤 Request headers:", {
      Authorization: `Bearer ${String(token).slice(0, 20)}...`,
    });

    try {
      console.log("📡 Making API request...");
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("📥 Response received:", {
        status: res.status,
        statusText: res.statusText,
        ok: res.ok,
        headers: Object.fromEntries(res.headers.entries()),
      });

      const result = await res.json();
      console.log("📄 Raw API response:", result);

      if (!res.ok) {
        console.error("❌ API request failed:", result);
        throw new Error(result.message || `HTTP ${res.status}`);
      }

      // ✅ Expecting { success, message, css }
      const css = result?.css;
      if (!css || typeof css !== "object") {
        console.warn(
          "⚠️ No css object in response. Keys:",
          Object.keys(result || {})
        );
        return;
      }

      const buttonTypes = [
        "buttonPrimary",
        "buttonSecondary",
        "buttonTertiary",
      ];
      let appliedCount = 0;

      buttonTypes.forEach((type) => {
        const block = css[type];
        const hasValid =
          block?.selector &&
          block?.styles &&
          Object.keys(block.styles).length > 0;
        console.log(`🔍 ${type} check:`, {
          hasValid,
          selector: block?.selector,
          styles: block?.styles,
        });

        if (hasValid) {
          applyStylesAsExternalCSS(
            block.selector,
            block.styles,
            `sc-btn-color-style-${type}`
          );
          console.log(`✅ Applied ${type} styles`, block.styles);
          appliedCount++;
        } else {
          console.log(`ℹ️ Skipped ${type}: missing selector or styles`);
        }
      });

      if (appliedCount === 0) {
        console.log(
          "ℹ️ Nothing to apply (all button style objects were empty)."
        );
      } else {
        console.log(`🎉 Applied ${appliedCount} button style group(s).`);
      }

      console.log("🏁 fetchButtonColorModifications completed successfully");
    } catch (error) {
      console.error(
        "❌ Failed to fetch button color modifications:",
        error.message
      );
      console.error("❌ Full error details:", error);
    }
  }

  // Fetch & apply hover-color buckets (no pageId/elementId)
  async function fetchButtonHoverColorModifications(blockId = null) {
    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");

    if (!userId || !token || !widgetId) {
      console.warn("⚠️ Missing credentials", {
        userId: !!userId,
        token: !!token,
        widgetId: !!widgetId,
      });
      return { success: false, error: "Missing credentials" };
    }

    // Build URL – API supports prefer=token|query and include=all|primary|secondary|tertiary
    const url = new URL(
      "https://admin.squareplugin.com/api/v1/fetch-button-hover-color-modifications"
    );
    url.searchParams.set("userId", userId);
    url.searchParams.set("widgetId", widgetId);
    url.searchParams.set("prefer", "token"); // use "query" for Postman/manual tests if needed
    url.searchParams.set("include", "all");

    try {
      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || `HTTP ${res.status}`);

      const buckets = result.hoverColor || {}; // { buttonPrimary?, buttonSecondary?, buttonTertiary? }

      // helpers
      const ensureHover = (sel) => {
        if (!sel) return null;
        const s = String(sel).trim();
        return s.endsWith(":hover") ? s : `${s}:hover`;
      };
      const toKebab = (obj = {}) =>
        Object.fromEntries(
          Object.entries(obj).flatMap(([k, v]) => {
            if (v === null || v === undefined || v === "" || v === "null")
              return [];
            const kk = k.includes("-")
              ? k
              : k.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
            return [[kk, v]];
          })
        );

      const applyBucket = (key) => {
        const data = buckets[key];
        if (!data || !data.selector || !data.styles) return;
        const selector = ensureHover(data.selector);
        const styles = toKebab(data.styles);
        if (!selector || Object.keys(styles).length === 0) return;

        // your existing helper that injects a <style> tag
        applyStylesAsExternalCSS(selector, styles, `sc-hover-color-${key}`);
        console.log(`✅ Applied hover color for ${key}`, { selector, styles });
      };

      ["buttonPrimary", "buttonSecondary", "buttonTertiary"].forEach(
        applyBucket
      );

      return { success: true, count: Object.keys(buckets).length };
    } catch (err) {
      console.error("❌ fetchButtonHoverColorModifications failed:", err);
      return { success: false, error: err.message };
    }
  }

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

  // Fetch and apply button border modifications from the backend
  // async function fetchButtonBorderModifications(blockId = null) {
  //   // ✅ FIXED: Check if we already have cached data
  //   if (window.__squareCraftButtonBorderData && !blockId) {
  //     console.log("📦 Using cached button border data");
  //     applyCachedButtonBorderStyles();
  //     return;
  //   }

  //   const userId = localStorage.getItem("sc_u_id");
  //   const token = localStorage.getItem("sc_auth_token");
  //   const widgetId = localStorage.getItem("sc_w_id");

  //   // ✅ DEBUG: Try multiple ways to get pageId
  //   let pageId = document
  //     .querySelector("article[data-page-sections]")
  //     ?.getAttribute("data-page-sections");

  //   // Fallback: try to get pageId from other sources
  //   if (!pageId) {
  //     pageId = document
  //       .querySelector("[data-page-id]")
  //       ?.getAttribute("data-page-id");
  //   }
  //   if (!pageId) {
  //     pageId = document
  //       .querySelector("[data-page-sections]")
  //       ?.getAttribute("data-page-sections");
  //   }
  //   if (!pageId) {
  //     // Try to get from URL path
  //     const pathMatch = window.location.pathname.match(/\/([a-f0-9]{24})/);
  //     if (pathMatch) pageId = pathMatch[1];
  //   }

  //   console.log("🔍 Page ID sources:", {
  //     fromArticle: document
  //       .querySelector("article[data-page-sections]")
  //       ?.getAttribute("data-page-sections"),
  //     fromDataPageId: document
  //       .querySelector("[data-page-id]")
  //       ?.getAttribute("data-page-id"),
  //     fromDataPageSections: document
  //       .querySelector("[data-page-sections]")
  //       ?.getAttribute("data-page-sections"),
  //     fromURL: window.location.pathname,
  //     finalPageId: pageId,
  //   });

  //   if (!userId || !token || !widgetId || !pageId) {
  //     console.warn("⚠️ Missing credentials or page ID");
  //     return;
  //   }

  //   // ✅ FIXED: Don't filter by elementId initially - get all data for the page
  //   let url = `https://admin.squareplugin.com/api/v1/get-button-border-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}`;

  //   // Only add elementId if we're looking for a specific element
  //   if (blockId && blockId !== "block-id") {
  //     url += `&elementId=${blockId}`;
  //   }

  //   try {
  //     const res = await fetch(url, {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });
  //     const result = await res.json();
  //     if (!res.ok) throw new Error(result.message);

  //     // ✅ DEBUG: Log the full API response to understand the structure
  //     console.log("🔍 Full API Response:", result);
  //     console.log("🔍 Request URL:", url);
  //     console.log("🔍 Credentials:", { userId, widgetId, pageId, blockId });

  //     // ✅ FIXED: Handle the new API structure with css buckets
  //     const elements = result.elements || [];
  //     console.log("🔄 Processing button border modifications:", elements);

  //     // ✅ FIXED: Track applied styles to avoid duplicates
  //     const appliedStyles = new Set();

  //     elements.forEach(({ elementId, css }) => {
  //       if (!css || typeof css !== "object") return;

  //       // Process each button type bucket (buttonPrimary, buttonSecondary, buttonTertiary)
  //       Object.entries(css).forEach(([buttonType, buttonData]) => {
  //         if (!buttonData || !buttonData.selector || !buttonData.styles) return;

  //         const { selector, styles } = buttonData;
  //         const styleKey = `${elementId}-${buttonType}`;

  //         // Avoid applying the same styles multiple times
  //         if (appliedStyles.has(styleKey)) {
  //           console.log(
  //             `⏭️ Skipping duplicate style application for ${styleKey}`
  //           );
  //           return;
  //         }

  //         // Apply button border styles as external CSS
  //         if (selector && Object.keys(styles).length > 0) {
  //           applyStylesAsExternalCSS(
  //             selector,
  //             styles,
  //             `sc-btn-border-${buttonType}-${elementId}`
  //           );
  //           appliedStyles.add(styleKey);
  //           console.log(
  //             `✅ Applied ${buttonType} border styles to ${elementId}:`,
  //             { selector, styles }
  //           );
  //         }
  //       });
  //     });

  //     console.log(
  //       `✅ Applied button border styles to ${elements.length} elements (external CSS)`
  //     );

  //     // ✅ DEBUG: If no elements found, test the API with different parameters
  //     if (elements.length === 0) {
  //       console.log(
  //         "⚠️ No elements found. Testing API with different parameters..."
  //       );
  //       await testAPIWithDifferentParams(userId, token, widgetId);
  //     }
  //   } catch (error) {
  //     console.error(
  //       "❌ Failed to fetch button border modifications:",
  //       error.message
  //     );
  //   }
  // }

  // Fetch and apply button BORDER styles (matches new backend contract)
  async function fetchButtonBorderModifications() {
    // ✅ Use cached data if we already fetched it
    if (window.__squareCraftButtonBorderData) {
      console.log("📦 Using cached button border data");
      applyBorderBuckets(window.__squareCraftButtonBorderData);
      return;
    }

    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");

    if (!userId || !token || !widgetId) {
      console.warn("⚠️ Missing credentials (userId/token/widgetId).");
      return;
    }

    // Base URL (no pageId / elementId)
    let url =
      `https://admin.squareplugin.com/api/v1/get-button-border-modifications` +
      `?userId=${encodeURIComponent(userId)}` +
      `&widgetId=${encodeURIComponent(widgetId)}`;

    // 🔧 Optional (handy for dev if token user differs): force query user
    if (window.SC_PREFER_QUERY === true) url += `&prefer=query`;

    console.log("🔗 Border fetch URL:", url);

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const result = await res.json();
      console.log("📡 Border API response:", res.status, result);

      if (!res.ok) throw new Error(result.message || `HTTP ${res.status}`);

      // Expecting: { success, message, border: { buttonPrimary?, buttonSecondary?, buttonTertiary? }, count }
      const border = result.border || {};
      window.__squareCraftButtonBorderData = border; // cache
      applyBorderBuckets(border);
    } catch (err) {
      console.error("❌ Failed to fetch button border modifications:", err);
    }
  }

  /**
   * Apply every available border bucket to the page.
   * border = { buttonPrimary?, buttonSecondary?, buttonTertiary? }
   */
  function applyBorderBuckets(border) {
    if (!border || typeof border !== "object") return;

    const entries = Object.entries(border);
    if (!entries.length) {
      console.log("ℹ️ No border buckets to apply.");
      return;
    }

    entries.forEach(([key, bucket]) => {
      if (!bucket || !bucket.selector) return;
      const styles = bucket.styles || {};
      if (!Object.keys(styles).length) return;

      // Reuse your existing helper to inject CSS
      // ID keeps the style tag stable across re-applies
      const styleId = `sc-btn-border-${key}`;
      applyStylesAsExternalCSS(bucket.selector, styles, styleId);

      console.log(`✅ Applied ${key} border styles`, {
        selector: bucket.selector,
        rules: Object.keys(styles).length,
      });
    });

    // After applying styles from API, sync the UI slider to reflect computed value
    if (typeof window.syncBorderSliderFromComputed === "function") {
      window.syncBorderSliderFromComputed();
    }
    // Also sync border style and color from fetched payload
    const anyBucket = entries.find(([, b]) => b && b.styles)?.[1];
    if (
      anyBucket &&
      typeof window.syncBorderControlsFromFetched === "function"
    ) {
      const st = anyBucket.styles || {};
      window.syncBorderControlsFromFetched(
        st["border-style"],
        st["border-color"]
      );
    }
  }

  // ✅ NEW: Fetch all button border modifications for the page at once

  async function fetchAllButtonBorderModifications() {
    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");

    let pageId = document
      .querySelector("article[data-page-sections]")
      ?.getAttribute("data-page-sections");

    if (!pageId) {
      pageId = document
        .querySelector("[data-page-id]")
        ?.getAttribute("data-page-id");
    }
    if (!pageId) {
      pageId = document
        .querySelector("[data-page-sections]")
        ?.getAttribute("data-page-sections");
    }

    if (!userId || !token || !widgetId || !pageId) {
      console.warn("⚠️ Missing credentials or page ID for bulk fetch");
      return;
    }

    console.log(
      "🚀 Fetching all button border modifications for page:",
      pageId
    );

    try {
      const url = `https://admin.squareplugin.com/api/v1/get-button-border-modifications?userId=${userId}&widgetId=${widgetId}&pageId=${pageId}`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message);

      const elements = result.elements || [];
      console.log("🎯 Found button border modifications:", elements);

      // Track applied styles to avoid duplicates
      const appliedStyles = new Set();

      elements.forEach(({ elementId, css }) => {
        if (!css || typeof css !== "object") return;

        Object.entries(css).forEach(([buttonType, buttonData]) => {
          if (!buttonData || !buttonData.selector || !buttonData.styles) return;

          const { selector, styles } = buttonData;
          const styleKey = `${elementId}-${buttonType}`;

          if (appliedStyles.has(styleKey)) {
            console.log(
              `⏭️ Skipping duplicate style application for ${styleKey}`
            );
            return;
          }

          if (selector && Object.keys(styles).length > 0) {
            applyStylesAsExternalCSS(
              selector,
              styles,
              `sc-btn-border-${buttonType}-${elementId}`
            );
            appliedStyles.add(styleKey);
            console.log(
              `✅ Applied ${buttonType} border styles to ${elementId}:`,
              { selector, styles }
            );

            // If this element is currently selected in the widget, seed the border slider state
            try {
              const selected =
                typeof getSelectedElement === "function"
                  ? getSelectedElement()
                  : null;
              const selectedId = selected?.id;
              if (selectedId && selectedId === elementId) {
                const typeClass =
                  buttonType === "buttonPrimary"
                    ? "sqs-button-element--primary"
                    : buttonType === "buttonSecondary"
                    ? "sqs-button-element--secondary"
                    : "sqs-button-element--tertiary";

                const widthStr =
                  styles["border-top-width"] || styles["border-width"] || "0px";
                const width = parseInt(String(widthStr), 10) || 0;

                if (!window.__squareCraftBorderStateMap)
                  window.__squareCraftBorderStateMap = new Map();
                const key = `${elementId}--${typeClass}`;
                const state = window.__squareCraftBorderStateMap.get(key) || {
                  values: {},
                  side: "All",
                };
                state.values.Top = width;
                state.values.Right = width;
                state.values.Bottom = width;
                state.values.Left = width;
                window.__squareCraftBorderStateMap.set(key, state);
              }
            } catch (_) {}
          }
        });
      });

      console.log(
        `🎉 Applied button border styles to ${elements.length} elements`
      );

      // Store the fetched data globally to avoid multiple API calls
      window.__squareCraftButtonBorderData = elements;

      // ✅ NEW: Also restore border values from cache after fetching
      restoreBorderValuesFromCache();

      // Sync the UI control after bulk apply as well
      if (typeof window.syncBorderSliderFromComputed === "function") {
        window.syncBorderSliderFromComputed();
      }

      // ✅ IMPROVED: Sync border controls for all elements, not just the first one
      elements.forEach(({ elementId, css }) => {
        if (!css || typeof css !== "object") return;

        Object.entries(css).forEach(([buttonType, buttonData]) => {
          if (!buttonData || !buttonData.styles) return;

          const styles = buttonData.styles;
          const borderStyle = styles["border-style"] || styles["borderStyle"];
          const borderColor = styles["border-color"] || styles["borderColor"];
          const borderWidth =
            styles["border-top-width"] || styles["borderTopWidth"] || "0px";

          // Store border values in localStorage (similar to shadow implementation)
          const borderData = {
            style: borderStyle || "solid",
            color: borderColor || "black",
            width: parseInt(borderWidth) || 0,
            values: {
              Top: parseInt(borderWidth) || 0,
              Right:
                parseInt(
                  styles["border-right-width"] ||
                    styles["borderRightWidth"] ||
                    borderWidth
                ) || 0,
              Bottom:
                parseInt(
                  styles["border-bottom-width"] ||
                    styles["borderBottomWidth"] ||
                    borderWidth
                ) || 0,
              Left:
                parseInt(
                  styles["border-left-width"] ||
                    styles["borderLeftWidth"] ||
                    borderWidth
                ) || 0,
            },
          };

          // Store in localStorage for UI persistence
          if (typeof window.storeBorderValues === "function") {
            window.storeBorderValues(buttonType, borderData);
          }

          if (borderStyle || borderColor) {
            // Store the values globally for UI sync
            if (borderStyle) {
              window.__squareCraftBorderStyle = borderStyle;
            }
            if (borderColor) {
              window.__squareCraftBorderColor = borderColor;
            }

            // Sync the UI controls
            if (typeof window.syncBorderControlsFromFetched === "function") {
              window.syncBorderControlsFromFetched(borderStyle, borderColor);
            }
          }
        });
      });
    } catch (error) {
      console.error(
        "❌ Failed to fetch all button border modifications:",
        error.message
      );
    }
  }

  // ✅ NEW: Function to restore border values from localStorage on page load
  function restoreBorderValuesFromCache() {
    try {
      console.log("🔄 restoreBorderValuesFromCache called");
      const buttonTypes = ["primary", "secondary", "tertiary"];

      buttonTypes.forEach((buttonType) => {
        const key = `sc_border_vals_button${
          buttonType.charAt(0).toUpperCase() + buttonType.slice(1)
        }`;
        const stored = localStorage.getItem(key);
        console.log(`🔍 Checking localStorage for key ${key}:`, stored);

        if (stored) {
          const borderData = JSON.parse(stored);
          console.log(
            `🔄 Restoring border values for ${buttonType}:`,
            borderData
          );

          // Set global values
          if (borderData.style) {
            window.__squareCraftBorderStyle = borderData.style;
            console.log(`✅ Set global border style: ${borderData.style}`);
          }
          if (borderData.color) {
            window.__squareCraftBorderColor = borderData.color;
            console.log(`✅ Set global border color: ${borderData.color}`);
          }

          // Sync UI controls
          if (typeof window.syncBorderControlsFromFetched === "function") {
            console.log("🔄 Calling syncBorderControlsFromFetched...");
            window.syncBorderControlsFromFetched(
              borderData.style,
              borderData.color
            );
          } else {
            console.warn(
              "⚠️ syncBorderControlsFromFetched function not available"
            );
          }
        }
      });
    } catch (e) {
      console.warn("Failed to restore border values from cache:", e);
    }
  }

  // Fetch and apply button shadow styles for the whole widget (no pageId/elementId)
  // async function fetchButtonShadowModifications() {
  //   const userId = localStorage.getItem("sc_u_id");
  //   const token = localStorage.getItem("sc_auth_token");
  //   const widgetId = localStorage.getItem("sc_w_id");

  //   if (!userId || !token || !widgetId) {
  //     console.warn("⚠️ Missing credentials", {
  //       userId: !!userId,
  //       token: !!token,
  //       widgetId: !!widgetId,
  //     });
  //     return;
  //   }

  //   // Small helper to inject CSS once per bucket
  //   const applyCss = (selector, styles, styleId) => {
  //     if (!selector || !styles || typeof styles !== "object") return;

  //     let tag = document.getElementById(styleId);
  //     if (!tag) {
  //       tag = document.createElement("style");
  //       tag.id = styleId;
  //       document.head.appendChild(tag);
  //     }

  //     // Build CSS text
  //     let cssText = `${selector} {`;
  //     for (const [prop, val] of Object.entries(styles)) {
  //       if (val !== null && val !== undefined && val !== "" && val !== "null") {
  //         cssText += `${prop}: ${val} !important; `;
  //       }
  //     }
  //     cssText += "}";

  //     tag.textContent = cssText;
  //   };

  //   // Build URL — include prefer=query so it also works in Postman/manual tests
  //   const base =
  //     "https://admin.squareplugin.com/api/v1/get-button-shadow-modifications";
  //   const url = `${base}?userId=${encodeURIComponent(
  //     userId
  //   )}&widgetId=${encodeURIComponent(widgetId)}&prefer=query`;

  //   try {
  //     const res = await fetch(url, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     const result = await res.json();

  //     if (!res.ok) throw new Error(result.message || `HTTP ${res.status}`);

  //     const shadow = result.shadow || {};
  //     const buckets = [
  //       ["buttonPrimary", "primary"],
  //       ["buttonSecondary", "secondary"],
  //       ["buttonTertiary", "tertiary"],
  //     ];

  //     let applied = 0;
  //     for (const [key, label] of buckets) {
  //       const bucket = shadow[key];
  //       if (
  //         bucket?.selector &&
  //         bucket?.styles &&
  //         Object.keys(bucket.styles).length
  //       ) {
  //         applyCss(bucket.selector, bucket.styles, `sc-btn-shadow-${label}`);
  //         applied++;
  //         console.log(`✅ Applied ${label} shadow styles`, bucket);
  //       }
  //     }

  //     if (applied === 0) {
  //       console.log("ℹ️ No button shadow styles to apply.");
  //     } else {
  //       console.log(`🎉 Applied ${applied} shadow bucket(s).`);
  //     }
  //   } catch (err) {
  //     console.error(
  //       "❌ Failed to fetch/apply button shadow modifications:",
  //       err
  //     );
  //   }
  // }

  // fetch button shadow modifications start

  function getActiveButtonType() {
    const el =
      document.querySelector('[name="sc-button-type"]:checked') ||
      document.getElementById("sc-button-type");
    const v = el?.value || el?.dataset?.value || "primary";
    return v === "secondary"
      ? "secondary"
      : v === "tertiary"
      ? "tertiary"
      : "primary";
  }

  function npx(v, d = 0) {
    if (v === null || v === undefined) return d;
    if (typeof v === "number") return v;
    const m = String(v).match(/-?\d+(\.\d+)?/);
    return m ? parseFloat(m[0]) : d;
  }

  function parseBoxShadow(str) {
    if (!str || typeof str !== "string") return null;
    const rx =
      /(-?\d+\.?\d*)px\s+(-?\d+\.?\d*)px\s+(\d+\.?\d*)px(?:\s+(-?\d+\.?\d*)px)?\s+(rgba?\([^)]+\)|#[a-fA-F0-9]{3,8})/i;
    const m = str.match(rx);
    if (!m) return null;
    return {
      x: parseFloat(m[1]),
      y: parseFloat(m[2]),
      blur: parseFloat(m[3]),
      spread: m[4] ? parseFloat(m[4]) : 0,
      color: m[5],
    };
  }

  function parseDropShadow(str) {
    if (!str || typeof str !== "string") return null;
    const rx =
      /drop-shadow\(\s*(-?\d+\.?\d*)px\s+(-?\d+\.?\d*)px\s+(\d+\.?\d*)px(?:\s+(-?\d+\.?\d*)px)?\s+(rgba?\([^)]+\)|#[a-fA-F0-9]{3,8})\s*\)/i;
    const m = str.match(rx);
    if (!m) return null;
    return {
      x: parseFloat(m[1]),
      y: parseFloat(m[2]),
      blur: parseFloat(m[3]),
      spread: m[4] ? parseFloat(m[4]) : 0,
      color: m[5],
    };
  }

  function pickColor(obj) {
    return (
      obj?.color ||
      obj?.shadowColor ||
      obj?.["--sc-shadow-color"] ||
      obj?.["--shadow-color"] ||
      obj?.["box-shadow-color"] ||
      "rgba(0,0,0,0.25)"
    );
  }

  function extractShadowValues(bucket) {
    if (!bucket) return null;
    const v = bucket.values || bucket.meta;
    if (
      v &&
      (v.x !== undefined ||
        v.y !== undefined ||
        v.blur !== undefined ||
        v.spread !== undefined ||
        v.color)
    ) {
      return {
        x: npx(v.x),
        y: npx(v.y),
        blur: npx(v.blur),
        spread: npx(v.spread),
        color: pickColor(v),
      };
    }
    const s = bucket.styles || {};
    const bs = s["box-shadow"] || s["boxShadow"];
    const parsedBox = parseBoxShadow(bs);
    if (parsedBox) return parsedBox;
    const filt = s.filter || s["-webkit-filter"];
    const parsedDrop = parseDropShadow(filt);
    if (parsedDrop) return parsedDrop;
    const x =
      s["--sc-shadow-x"] ||
      s["--shadow-x"] ||
      s["shadowX"] ||
      s["x"] ||
      s["xAxis"] ||
      s["box-shadow-x"];
    const y =
      s["--sc-shadow-y"] ||
      s["--shadow-y"] ||
      s["shadowY"] ||
      s["y"] ||
      s["yAxis"] ||
      s["box-shadow-y"];
    const blur =
      s["--sc-shadow-blur"] ||
      s["shadowBlur"] ||
      s["blur"] ||
      s["box-shadow-blur"];
    const spread =
      s["--sc-shadow-spread"] ||
      s["shadowSpread"] ||
      s["spread"] ||
      s["box-shadow-spread"];
    const color = pickColor(s);
    if (
      x !== undefined ||
      y !== undefined ||
      blur !== undefined ||
      spread !== undefined ||
      color
    ) {
      return {
        x: npx(x),
        y: npx(y),
        blur: npx(blur),
        spread: npx(spread),
        color,
      };
    }
    return null;
  }

  function setFieldValue(idBase, value, min = null, max = null) {
    // Primary IDs used by this file
    let field = document.getElementById(idBase + "Field");
    let fill = document.getElementById(idBase + "Fill");
    let bullet = document.getElementById(idBase + "Bullet");
    let count = document.getElementById(idBase + "Count");

    // Fallback IDs used by initButtonStyles (Xaxis/Yaxis naming and fill as .sc-shadow-fill)
    const fallbackIdBaseMap = {
      buttonShadowX: "buttonShadowXaxis",
      buttonShadowY: "buttonShadowYaxis",
      buttonShadowBlur: "buttonShadowBlur",
      buttonShadowSpread: "buttonShadowSpread",
    };
    const alt = fallbackIdBaseMap[idBase];
    if (!field && alt) field = document.getElementById(alt + "Field");
    if (!bullet && alt) bullet = document.getElementById(alt + "Bullet");
    if (!count && alt) count = document.getElementById(alt + "Count");
    if (!fill) {
      // If no dedicated Fill element, try to find the dynamic fill inside the field
      const fillContainer =
        field || (alt ? document.getElementById(alt + "Field") : null);
      const foundFill = fillContainer?.querySelector?.(".sc-shadow-fill");
      if (foundFill) fill = foundFill;
    }

    if (field && "value" in field) field.value = String(value);
    if (count) count.textContent = String(value) + "px";

    const minV = min ?? Number(field?.min ?? 0);
    const maxV = max ?? Number(field?.max ?? 100);
    const clamped = Math.max(minV, Math.min(maxV, Number(value)));
    const pct = maxV === minV ? 0 : ((clamped - minV) / (maxV - minV)) * 100;

    if (fill) fill.style.width = pct + "%";
    if (bullet) bullet.style.left = pct + "%";
  }

  function setColorValue(color) {
    // Primary IDs
    const input = document.getElementById("buttonShadowColorField");
    const swatch = document.getElementById("buttonShadowColorSwatch");
    if (input) input.value = color;
    if (swatch) swatch.style.background = color;

    // Fallback IDs used by the shadow color palette in initButtonStyles
    const codeEl = document.getElementById("button-shadow-border-color-code");
    if (codeEl) codeEl.textContent = color;
  }

  function syncShadowUIFor(bucketLabel, shadow) {
    if (!shadow) return;
    const p = "buttonShadow";
    setFieldValue(p + "X", shadow.x, -100, 100);
    setFieldValue(p + "Y", shadow.y, -100, 100);
    setFieldValue(p + "Blur", shadow.blur, 0, 200);
    setFieldValue(p + "Spread", shadow.spread, -100, 100);
    setColorValue(shadow.color || "rgba(0,0,0,0.25)");
    localStorage.setItem("sc_shadow_active_type", bucketLabel);
    localStorage.setItem(
      "sc_shadow_vals_" + bucketLabel,
      JSON.stringify(shadow)
    );
  }

  // Ensure UI sync runs after the panel renders or re-renders
  function whenShadowControlsReady(callback, timeoutMs = 5000) {
    const start = Date.now();
    const present = () =>
      document.getElementById("buttonShadowXField") ||
      document.getElementById("buttonShadowXaxisField");
    if (present()) return void callback();

    const obs = new MutationObserver(() => {
      if (present()) {
        obs.disconnect();
        callback();
      } else if (Date.now() - start > timeoutMs) {
        obs.disconnect();
      }
    });
    obs.observe(document.body, { childList: true, subtree: true });
  }

  function syncActiveTypeFromCacheIfAvailable() {
    const type = getActiveButtonType();
    const vals = localStorage.getItem("sc_shadow_vals_" + type);
    if (!vals) return;
    const parsed = JSON.parse(vals);
    syncShadowUIFor(type, parsed);
  }

  function startShadowUiAutoSync() {
    let lastAppliedKey = null;
    const present = () =>
      document.getElementById("buttonShadowXField") ||
      document.getElementById("buttonShadowXaxisField");
    const applyIfNeeded = () => {
      const type = getActiveButtonType();
      const key = "sc_shadow_vals_" + type;
      if (!localStorage.getItem(key)) return;
      // Avoid thrashing if the same state was just applied
      if (lastAppliedKey === key && present()) return;
      lastAppliedKey = key;
      syncActiveTypeFromCacheIfAvailable();
    };
    const obs = new MutationObserver(() => {
      if (present()) applyIfNeeded();
    });
    obs.observe(document.body, { childList: true, subtree: true });
    // Initial attempt
    whenShadowControlsReady(applyIfNeeded, 3000);
  }

  async function fetchButtonShadowModifications() {
    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");
    if (!userId || !token || !widgetId) return;

    const applyCss = (selector, styles, styleId) => {
      if (!selector || !styles || typeof styles !== "object") return;
      let tag = document.getElementById(styleId);
      if (!tag) {
        tag = document.createElement("style");
        tag.id = styleId;
        document.head.appendChild(tag);
      }
      let cssText = `${selector} {`;
      for (const [prop, val] of Object.entries(styles)) {
        if (val !== null && val !== undefined && val !== "" && val !== "null")
          cssText += `${prop}: ${val} !important; `;
      }
      cssText += "}";
      tag.textContent = cssText;
    };

    const base =
      "https://admin.squareplugin.com/api/v1/get-button-shadow-modifications";
    const url = `${base}?userId=${encodeURIComponent(
      userId
    )}&widgetId=${encodeURIComponent(widgetId)}&prefer=query`;

    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    if (!res.ok) throw new Error(result.message || `HTTP ${res.status}`);

    const shadow = result.shadow || {};
    const buckets = [
      ["buttonPrimary", "primary"],
      ["buttonSecondary", "secondary"],
      ["buttonTertiary", "tertiary"],
    ];

    const active = getActiveButtonType();
    let activeValues = null;

    for (const [key, label] of buckets) {
      const bucket = shadow[key];
      if (
        bucket?.selector &&
        bucket?.styles &&
        Object.keys(bucket.styles).length
      ) {
        applyCss(bucket.selector, bucket.styles, `sc-btn-shadow-${label}`);
      }
      const vals = extractShadowValues(bucket);
      if (vals) {
        localStorage.setItem("sc_shadow_vals_" + label, JSON.stringify(vals));
        if (label === active) activeValues = vals;
      }
    }

    if (!activeValues) {
      const fallback = localStorage.getItem("sc_shadow_vals_" + active);
      if (fallback) activeValues = JSON.parse(fallback);
    }
    if (activeValues) syncShadowUIFor(active, activeValues);
  }

  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t && (t.name === "sc-button-type" || t.id === "sc-button-type")) {
      const type = getActiveButtonType();
      const vals = localStorage.getItem("sc_shadow_vals_" + type);
      if (vals) syncShadowUIFor(type, JSON.parse(vals));
    }
  });

  document.addEventListener("DOMContentLoaded", () => {
    fetchButtonShadowModifications()
      .then(() => whenShadowControlsReady(syncActiveTypeFromCacheIfAvailable))
      .catch(() => {});
    // Kick off continuous auto-sync so rerenders don't reset to 0px
    startShadowUiAutoSync();

    // ✅ NEW: Restore border values from cache on page load
    restoreBorderValuesFromCache();

    // ✅ NEW: Also restore font values from cache on page load
    restoreFontValuesFromCache();
  });

  //fetch button shadow modifications end

  // Utility: Wait until selector appears in DOM
  function waitForElement(selector, timeout = 3000) {
    return new Promise((resolve, reject) => {
      const interval = 100;
      let elapsed = 0;
      const check = () => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 0) return resolve(elements);
        elapsed += interval;
        if (elapsed >= timeout)
          return reject(`⏰ Timeout: ${selector} not found`);
        setTimeout(check, interval);
      };
      check();
    });
  }

  // Helper: Apply styles to button and icon
  function applyButtonIconStyles(button, styles, buttonType) {
    if (!button || !styles) {
      console.log("⚠️ Missing button or styles:", {
        button: !!button,
        styles: !!styles,
      });
      return;
    }

    console.log(`🎨 Applying ${buttonType} styles to button:`, button);
    console.log("🎨 Styles to apply:", styles);

    // Apply gap
    if (styles.gap) {
      button.style.gap = styles.gap;
      button.classList.add("sc-flex", "sc-items-center");
      console.log(`📏 Applied gap: ${styles.gap}`);
    }

    // Check if icon already exists
    const existingIcons = button.querySelectorAll(
      ".sqscraft-button-icon, .sqscraft-image-icon"
    );
    console.log(`🔍 Found ${existingIcons.length} existing icons`);

    if (existingIcons.length > 0) {
      // Update existing icons
      existingIcons.forEach((icon) => {
        console.log("🔄 Updating existing icon:", icon);
        if (styles.width) icon.style.width = styles.width;
        if (styles.height) icon.style.height = styles.height;
        if (styles.transform) icon.style.transform = styles.transform;
        if (styles.color) icon.style.color = styles.color;
        if (styles.fill) icon.style.fill = styles.fill;
        if (styles.stroke) icon.style.stroke = styles.stroke;
        if (styles.src) {
          icon.src = styles.src;
        }
        console.log("✅ Updated existing icon");
      });
    } else {
      // Remove any existing icons first (prevent duplicates)
      button
        .querySelectorAll(".sqscraft-button-icon, .sqscraft-image-icon")
        .forEach((el) => el.remove());

      // Add new uploaded icon (supports data URIs and regular URLs)
      if (styles.src) {
        const icon = document.createElement("img");
        icon.src = styles.src;
        icon.alt = "Button Icon";
        icon.className = "sqscraft-button-icon";
        icon.style.width = styles.width || "20px";
        icon.style.height = styles.height || "auto";
        if (styles.transform) icon.style.transform = styles.transform;
        if (styles.color) icon.style.color = styles.color;
        if (styles.fill) icon.style.fill = styles.fill;
        if (styles.stroke) icon.style.stroke = styles.stroke;
        button.appendChild(icon);
        console.log("✅ Added new icon to button");
      }
    }

    console.log(`✅ Finished applying ${buttonType} styles`);
  }

  // Utility: query selectorAll in both host document and Squarespace iframe
  function queryAllInHostAndFrame(selector) {
    const results = [];
    try {
      const hostMatches = document.querySelectorAll(selector);
      results.push(...Array.from(hostMatches));
    } catch (_) {}
    try {
      const siteFrame = document.getElementById("sqs-site-frame");
      const frameDoc =
        siteFrame?.contentDocument || siteFrame?.contentWindow?.document;
      if (frameDoc) {
        const frameMatches = frameDoc.querySelectorAll(selector);
        results.push(...Array.from(frameMatches));
      }
    } catch (_) {}
    return results;
  }

  // Main button icon fetch function (no pageId/elementId)
  async function fetchButtonIconModifications() {
    console.log("🚀 fetchButtonIconModifications");

    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");

    console.log("🔑 Credentials:", {
      userId: !!userId,
      token: !!token,
      widgetId: !!widgetId,
    });

    if (!userId || !token || !widgetId) {
      console.warn("❌ Missing userId/token/widgetId");
      return;
    }

    const url =
      `https://admin.squareplugin.com/api/v1/fetch-button-icon-modifications` +
      `?userId=${encodeURIComponent(userId)}&widgetId=${encodeURIComponent(
        widgetId
      )}`;

    console.log("🔗 API URL:", url);

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const result = await res.json();

      console.log("📡 Response:", res.status, result);
      if (!res.ok) throw new Error(result.message || `HTTP ${res.status}`);

      // Expecting: { success, message, icon: { buttonPrimary, buttonSecondary, buttonTertiary } }
      // (If server was called with ?buttonType, it would return a single object instead; we always fetch all.)
      const icon = result.icon || {};
      const types = [
        ["buttonPrimary", "primary"],
        ["buttonSecondary", "secondary"],
        ["buttonTertiary", "tertiary"],
      ];

      for (const [key, friendly] of types) {
        const styleObj = icon[key];
        if (!styleObj || !styleObj.selector || !styleObj.styles) {
          console.log(`ℹ️ No data for ${key}`);
          continue;
        }

        // If backend sent iconData, surface base64 as styles.src so our applier can insert/replace <img>
        const computedStyles = { ...styleObj.styles };
        if (styleObj.iconData?.data?.startsWith?.("data:image")) {
          computedStyles.src = styleObj.iconData.data;
        }

        // The selector typically includes the icon class; we want the button container
        const buttonSelector = styleObj.selector
          .replace(/\s*\.sqscraft-button-icon.*$/i, "")
          .trim();
        console.log(
          `🔍 ${key} → selector: "${styleObj.selector}" → buttonSelector: "${buttonSelector}"`
        );

        // Search in host + Squarespace iframe
        let buttons = queryAllInHostAndFrame(buttonSelector);
        console.log(
          `🔎 Found ${buttons.length} ${friendly} button(s) initially`
        );

        if (buttons.length === 0) {
          try {
            // Wait only in host doc as a light fallback
            await waitForElement(buttonSelector, 2000);
            buttons = queryAllInHostAndFrame(buttonSelector);
            console.log(
              `⏳ After wait: ${buttons.length} ${friendly} button(s)`
            );
          } catch (e) {
            console.warn(
              `⛔ ${friendly} buttons not found for selector: ${buttonSelector}`,
              e
            );
            continue;
          }
        }

        // Apply styles
        buttons.forEach((btn) =>
          applyButtonIconStyles(btn, computedStyles, friendly)
        );
        console.log(
          `✅ Applied ${friendly} icon styles to ${buttons.length} button(s)`
        );
      }

      console.log("🎉 Finished applying fetched button icon styles");
    } catch (error) {
      console.error(
        "❌ Failed to fetch/apply button icon modifications:",
        error
      );
    }
  }

  // Fetch + apply hover icon rules (no pageId/elementId)
  async function fetchButtonHoverIconModifications(include = "all") {
    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");

    if (!userId || !token || !widgetId) {
      console.warn("⚠️ Missing credentials to fetch hover icon styles", {
        userId: !!userId,
        token: !!token,
        widgetId: !!widgetId,
      });
      return { success: false, error: "Missing credentials" };
    }

    // Build URL for new API. Add include=primary|secondary|tertiary|all if desired.
    const params = new URLSearchParams({
      userId,
      widgetId,
      prefer: "query", // make it easy to test from Postman too
    });
    if (include && include !== "all")
      params.set("include", include.toLowerCase());

    const url = `https://admin.squareplugin.com/api/v1/fetch-button-hover-icon-modifications?${params.toString()}`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const out = await res.json();
      if (!res.ok) throw new Error(out.message || `HTTP ${res.status}`);

      // Expected shape:
      // {
      //   success: true,
      //   hoverIcon: {
      //     buttonPrimary:   [{ selector, styles }, ...],
      //     buttonSecondary: [{ selector, styles }, ...],
      //     buttonTertiary:  [{ selector, styles }, ...]
      //   }
      // }
      const hoverIcon = out.hoverIcon || {};
      const buckets = [
        ["buttonPrimary", "primary"],
        ["buttonSecondary", "secondary"],
        ["buttonTertiary", "tertiary"],
      ];

      // Helper: create/update a <style> tag for a rule
      const applyRule = (selector, styles, key) => {
        if (!selector || !styles || Object.keys(styles).length === 0) return;

        // normalize style keys to kebab-case
        const normalized = {};
        for (const [k, v] of Object.entries(styles)) {
          if (v === null || v === undefined || v === "null" || v === "")
            continue;
          const cssKey = k.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
          normalized[cssKey] = v;
        }
        if (Object.keys(normalized).length === 0) return;

        const id = `sc-hover-icon-${key}`;
        let tag = document.getElementById(id);
        if (!tag) {
          tag = document.createElement("style");
          tag.id = id;
          document.head.appendChild(tag);
        }
        const body = Object.entries(normalized)
          .map(([prop, val]) => `${prop}: ${val} !important;`)
          .join(" ");
        tag.textContent = `${selector} { ${body} }`;
      };

      let applied = 0;
      for (const [bucketKey, suffix] of buckets) {
        const rules = Array.isArray(hoverIcon[bucketKey])
          ? hoverIcon[bucketKey]
          : [];
        rules.forEach((rule, idx) => {
          applyRule(rule.selector, rule.styles, `${suffix}-${idx}`);
          applied++;
        });
      }

      console.log(`✅ Applied ${applied} hover icon rule(s).`);
      return { success: true, applied };
    } catch (err) {
      console.error("❌ Failed to fetch/apply hover icon styles:", err);
      return { success: false, error: err.message };
    }
  }

  // Make fetchButtonHoverIconModifications available globally
  window.fetchButtonHoverIconModifications = fetchButtonHoverIconModifications;

  async function fetchButtonHoverEffectModifications() {
    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");

    if (!userId || !token || !widgetId) {
      console.warn("⚠️ Missing creds for hover effect fetch:", {
        userId: !!userId,
        token: !!token,
        widgetId: !!widgetId,
      });
      return { success: false, error: "Missing credentials" };
    }

    // optional: pass include=primary|secondary|tertiary|all (default all)
    const include = "all"; // change if you want a single bucket
    const url = `https://admin.squareplugin.com/api/v1/fetch-button-effect-modifications?userId=${encodeURIComponent(
      userId
    )}&widgetId=${encodeURIComponent(widgetId)}&include=${encodeURIComponent(
      include
    )}&prefer=query`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message || `HTTP ${res.status}`);

      // Expected shape:
      // { success:true, message:"...", hoverEffect: { buttonPrimary?:{selector,styles}, buttonSecondary?, buttonTertiary? }, count:n }
      const buckets = json.hoverEffect || {};
      const entries = Object.entries(buckets);

      if (!entries.length) {
        console.log("ℹ️ No hover effect buckets to apply.");
        return { success: true, count: 0 };
      }

      // helper: normalize style keys -> kebab-case
      const toKebab = (o = {}) =>
        Object.fromEntries(
          Object.entries(o).map(([k, v]) => [
            k.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
            v,
          ])
        );

      // apply each bucket (strip :hover because our helper adds it)
      const labelMap = {
        buttonPrimary: "primary",
        buttonSecondary: "secondary",
        buttonTertiary: "tertiary",
      };

      let applied = 0;
      for (const [key, cfg] of entries) {
        if (
          !cfg ||
          !cfg.selector ||
          !cfg.styles ||
          !Object.keys(cfg.styles).length
        )
          continue;

        // If selector already contains :hover, strip it—our helper will create :hover CSS.
        const baseSelector = cfg.selector.replace(/\s*:hover\b/gi, "").trim();
        const styles = toKebab(cfg.styles);

        // You already use this helper elsewhere; it should inject `${baseSelector}:hover { ... }`
        // and target a unique style tag id.
        applyHoverEffectStylesAsExternalCSS(
          baseSelector,
          styles,
          `sc-hover-effect-fetched-${labelMap[key] || key}`
        );

        applied++;
        console.log(
          `✅ Applied hover effect for ${key} on`,
          baseSelector,
          styles
        );
      }

      return { success: true, count: applied };
    } catch (err) {
      console.error("❌ fetchButtonHoverEffectModifications failed:", err);
      return { success: false, error: err.message };
    }
  }

  // Make fetchButtonHoverEffectModifications available globally
  window.fetchButtonHoverEffectModifications =
    fetchButtonHoverEffectModifications;

  // Test function to verify the function works with your exact API response
  window.testWithYourAPIData = () => {
    console.log("🧪 Testing with your exact API response data...");

    // Simulate the exact data structure from your Postman response
    const mockResponse = {
      success: true,
      message: "Button hover effect modifications fetched successfully.",
      elements: [
        {
          elementId: "block-af8743b31fea872b2d48",
          buttonPrimary: {
            selector: ".sqs-button-element--primary:hover",
            styles: {
              transition: "all 300ms linear 300ms",
              transform: "translateY(43px)",
            },
          },
          buttonSecondary: {
            selector: null,
          },
          buttonTertiary: {
            selector: null,
          },
        },
      ],
    };

    console.log("📄 Mock response data:", mockResponse);

    // Test the processing logic
    const elements = mockResponse.elements || [];
    console.log("📋 Elements to process:", elements.length);

    if (elements.length === 0) {
      console.log("ℹ️ No hover effect modifications found in response");
      return;
    }

    elements.forEach((element, index) => {
      const { elementId } = element;
      console.log(
        `🔍 Processing element ${index + 1} (${elementId}):`,
        element
      );

      // Handle buttonPrimary
      if (
        element.buttonPrimary &&
        element.buttonPrimary.selector &&
        element.buttonPrimary.styles &&
        Object.keys(element.buttonPrimary.styles).length > 0
      ) {
        console.log(
          `✅ Applying buttonPrimary hover effect styles for ${elementId}:`,
          element.buttonPrimary.styles
        );

        // Clean the selector - remove :hover if present for the base selector
        const baseSelector = element.buttonPrimary.selector.replace(
          ":hover",
          ""
        );
        console.log("🎯 Base selector:", baseSelector);

        // Test the applyHoverEffectStylesAsExternalCSS function
        try {
          applyHoverEffectStylesAsExternalCSS(
            baseSelector,
            element.buttonPrimary.styles,
            `sc-hover-effect-fetched-primary-${elementId}`
          );
          console.log(
            `✅ Successfully applied buttonPrimary hover effect styles to ${elementId}`
          );
        } catch (error) {
          console.error("❌ Error applying styles:", error);
        }
      } else {
        console.log(`⚠️ Skipping buttonPrimary for ${elementId}:`, {
          hasButtonPrimary: !!element.buttonPrimary,
          selector: element.buttonPrimary?.selector,
          hasStyles: !!element.buttonPrimary?.styles,
          stylesKeys: element.buttonPrimary?.styles
            ? Object.keys(element.buttonPrimary.styles)
            : [],
        });
      }
    });
  };

  // Test the function immediately after definition
  console.log(
    "🧪 Testing fetchButtonHoverIconModifications function definition..."
  );
  console.log("🧪 Function type:", typeof fetchButtonHoverIconModifications);
  console.log("🧪 Function name:", fetchButtonHoverIconModifications.name);

  // Helper function to apply hover icon styles to buttons using CSS
  function applyHoverIconStylesToButtons(
    buttons,
    styles,
    buttonType,
    elementId,
    originalSelector
  ) {
    const buttonArray =
      buttons instanceof Element ? [buttons] : Array.from(buttons || []);
    console.log(
      `🎨 Applying ${buttonType} hover icon styles to ${buttonArray.length} button(s)`
    );

    buttonArray.forEach((button, index) => {
      console.log(`🎯 Applying styles to button ${index + 1}:`, button);

      // Create or update the hover icon styles using CSS hover selectors
      const iconSelector = `.sqscraft-button-icon, .sqscraft-image-icon`;
      let existingIcon = button.querySelector(iconSelector);
      if (!existingIcon) {
        // Also search inside Squarespace iframe button clone if any
        try {
          const siteFrame = document.getElementById("sqs-site-frame");
          const frameDoc =
            siteFrame?.contentDocument || siteFrame?.contentWindow?.document;
          if (frameDoc && button.id) {
            const frameButton = frameDoc.getElementById(button.id);
            existingIcon =
              frameButton?.querySelector(iconSelector) || existingIcon;
          }
        } catch (_) {}
      }

      if (!existingIcon) {
        // Create new icon element if none exists
        console.log(`🆕 Creating new icon element for ${buttonType}`);
        existingIcon = document.createElement("span");
        existingIcon.className = "sqscraft-button-icon";
        existingIcon.style.display = "inline-block";
        existingIcon.style.width = "20px"; // Default size
        existingIcon.style.height = "20px"; // Default size
        button.appendChild(existingIcon);
        console.log(`✅ Created and added new icon to button`);
      }

      // Ensure the icon has a unique identifier for the CSS selector
      if (!existingIcon.dataset.hoverIconId) {
        existingIcon.dataset.hoverIconId = `icon-${buttonType}-${elementId}-${index}`;
      }

      // Separate button-level props (e.g., gap) from icon props and normalize keys
      const { gap: gapValue, ...rawIconStyles } = styles || {};
      const normalizedIconStyles = {};
      Object.entries(rawIconStyles || {}).forEach(([k, v]) => {
        if (v === null || v === undefined || v === "") return;
        const hyphenKey = k.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`);
        normalizedIconStyles[hyphenKey] = v;
      });

      // Ensure icon can exceed any default caps and can transform properly
      normalizedIconStyles["max-width"] =
        normalizedIconStyles["max-width"] || "none";
      normalizedIconStyles["max-height"] =
        normalizedIconStyles["max-height"] || "none";
      normalizedIconStyles["display"] =
        normalizedIconStyles["display"] || "inline-block";

      // Store for JS fallback
      existingIcon.dataset.hoverStyles = JSON.stringify(normalizedIconStyles);

      // Generate unique style ID for this button's hover styles
      const uniqueStyleId = `sc-hover-icon-${buttonType}-${elementId}-${index}`;

      // Remove any existing hover styles for this button
      const existingStyle = document.getElementById(uniqueStyleId);
      if (existingStyle) {
        existingStyle.remove();
      }

      // Create CSS rules for hover effects (icon styles only)
      const hoverStyles = Object.entries(normalizedIconStyles)
        .filter(
          ([_, value]) => value !== null && value !== undefined && value !== ""
        )
        .map(([property, value]) => `${property}: ${value} !important;`)
        .join(" ");

      console.log("🎨 Generated hover styles:", hoverStyles);
      console.log("🎯 Original selector from API:", originalSelector);

      if (hoverStyles) {
        // Create CSS style element for hover effects
        const styleElement = document.createElement("style");
        styleElement.id = uniqueStyleId;

        // Create a more reliable CSS selector that targets the specific button
        const buttonId =
          button.id || `button-${buttonType}-${elementId}-${index}`;
        if (!button.id) {
          button.id = buttonId;
        }

        // Create a specific CSS selector for this button's icon
        const specificSelector = `#${buttonId}:hover .sqscraft-button-icon`;

        // Create the CSS rule with the specific selector
        const cssRule = `${specificSelector} {
          ${hoverStyles}
        }`;

        // Also create a simpler fallback selector for better compatibility
        const fallbackSelector = `.sqscraft-button-icon:hover`;
        const fallbackCssRule = `${fallbackSelector} {
          ${hoverStyles}
        }`;

        // Button-level hover rule for gap (requires flex)
        const buttonHoverRule = gapValue
          ? `#${buttonId}:hover { gap: ${gapValue} !important; display: inline-flex !important; align-items: center !important; }`
          : "";

        // Add selectors to ensure compatibility
        styleElement.textContent = [cssRule, buttonHoverRule, fallbackCssRule]
          .filter(Boolean)
          .join("\n");

        console.log("🎨 Generated specific CSS rule:", cssRule);
        console.log("🎨 Generated fallback CSS rule:", fallbackCssRule);
        console.log(
          "🎨 Final CSS with both selectors:",
          styleElement.textContent
        );

        // Append style to both current document and Squarespace site iframe (if available)
        const targetDocs = [document];
        try {
          const siteFrame = document.getElementById("sqs-site-frame");
          const frameDoc =
            siteFrame?.contentDocument || siteFrame?.contentWindow?.document;
          if (frameDoc) targetDocs.push(frameDoc);
        } catch (e) {
          console.warn(
            "⚠️ Unable to access iframe document for hover icon CSS"
          );
        }
        targetDocs.forEach((docRef) =>
          docRef.head.appendChild(styleElement.cloneNode(true))
        );
        console.log(`✅ Applied hover styles via CSS for ${buttonType}:`, {
          styles: hoverStyles,
          styleId: uniqueStyleId,
          cssContent: styleElement.textContent,
        });

        // Verify the CSS was added to the DOM
        const addedStyle = document.getElementById(uniqueStyleId);
        if (addedStyle) {
          console.log(
            `✅ CSS style element successfully added to DOM with ID: ${uniqueStyleId}`
          );
          console.log(`✅ CSS content in DOM:`, addedStyle.textContent);

          // Test if the CSS selector actually works
          console.log("🧪 Testing specific CSS selector:", specificSelector);
          try {
            const testElements = document.querySelectorAll(
              specificSelector.replace(":hover", "")
            );
            console.log(
              "🧪 Found elements matching specific selector:",
              testElements.length
            );
            if (testElements.length > 0) {
              console.log("🧪 First matching element:", testElements[0]);
              console.log("🧪 Element ID:", testElements[0].id);
              console.log("🧪 Element classes:", testElements[0].className);
            }
          } catch (e) {
            console.warn("🧪 Error testing CSS selector:", e);
          }
        } else {
          console.warn(`⚠️ CSS style element not found in DOM after adding`);
        }

        // Add JavaScript event handlers as fallback for hover effects
        const icon = button.querySelector(".sqscraft-button-icon");
        if (icon) {
          // Remove existing event listeners to prevent duplicates
          icon.removeEventListener("mouseenter", icon._hoverEnterHandler);
          icon.removeEventListener("mouseleave", icon._hoverLeaveHandler);

          // Store original styles for restoration
          const originalStyles = {};
          Object.keys(normalizedIconStyles).forEach((prop) => {
            const camel = prop.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
            originalStyles[camel] = icon.style[camel] || "";
          });
          const originalButtonGap = button.style.gap || "";
          const originalButtonDisplay = button.style.display || "";
          const originalButtonAlign = button.style.alignItems || "";

          // Create hover enter handler
          icon._hoverEnterHandler = () => {
            console.log(`🔄 JavaScript hover enter for ${buttonType}`);
            console.log(`🔄 Applying styles:`, normalizedIconStyles);
            Object.entries(normalizedIconStyles).forEach(
              ([property, value]) => {
                if (value !== null && value !== undefined && value !== "") {
                  const camel = property.replace(/-([a-z])/g, (_, c) =>
                    c.toUpperCase()
                  );
                  icon.style[camel] = value;
                  console.log(`🔄 Applied ${property}: ${value}`);
                }
              }
            );
            if (gapValue) {
              button.style.gap = gapValue;
              button.style.display = "inline-flex";
              button.style.alignItems = "center";
            }
          };

          // Create hover leave handler
          icon._hoverLeaveHandler = () => {
            console.log(`🔄 JavaScript hover leave for ${buttonType}`);
            console.log(`🔄 Restoring original styles:`, originalStyles);
            Object.entries(originalStyles).forEach(([property, value]) => {
              icon.style[property] = value;
              console.log(`🔄 Restored ${property}: ${value}`);
            });
            if (gapValue) {
              button.style.gap = originalButtonGap;
              button.style.display = originalButtonDisplay;
              button.style.alignItems = originalButtonAlign;
            }
          };

          // Add event listeners to BOTH the button and the icon for better coverage
          button.addEventListener("mouseenter", icon._hoverEnterHandler);
          button.addEventListener("mouseleave", icon._hoverLeaveHandler);
          icon.addEventListener("mouseenter", icon._hoverEnterHandler);
          icon.addEventListener("mouseleave", icon._hoverLeaveHandler);

          console.log(
            `✅ Added JavaScript hover event handlers to both button and icon for ${buttonType}`
          );

          // Test the JavaScript hover handler immediately
          console.log("🧪 Testing JavaScript hover handler...");
          setTimeout(() => {
            console.log("🧪 Triggering hover enter...");
            icon._hoverEnterHandler();

            setTimeout(() => {
              console.log("🧪 Triggering hover leave...");
              icon._hoverLeaveHandler();
            }, 1000);
          }, 500);
        }
      }
    });

    console.log(
      `✅ Successfully applied ${buttonType} hover icon styles to ${buttonArray.length} button(s) for element ${elementId}`
    );

    // Test the hover effect by adding a simple hover state
    console.log("🧪 Testing hover effect application...");
    const testButton = buttonArray[0];
    if (testButton) {
      const testIcon = testButton.querySelector(".sqscraft-button-icon");
      if (testIcon) {
        console.log("🧪 Test icon found, checking if hover styles are applied");
        console.log("🧪 Icon element:", testIcon);
        console.log(
          "🧪 Icon computed styles:",
          window.getComputedStyle(testIcon)
        );

        // Add a visual indicator to show the button has hover styles
        testButton.style.border = "2px solid #00ff00";
        testButton.title = `Hover icon styles applied: ${Object.keys(
          styles
        ).join(", ")}`;

        // Test if the CSS hover selector actually works
        console.log("🧪 Testing CSS hover selector functionality...");
        const baseSelector = originalSelector.replace(":hover", "");
        const iconSelector = originalSelector.split(" ").pop(); // Get the icon part

        console.log("🧪 Base selector (without :hover):", baseSelector);
        console.log("🧪 Icon selector part:", iconSelector);

        // Check if we can find the elements
        const baseElements = document.querySelectorAll(baseSelector);
        console.log("🧪 Found base elements:", baseElements.length);

        if (baseElements.length > 0) {
          const firstElement = baseElements[0];
          console.log("🧪 First base element:", firstElement);
          console.log("🧪 Element tag:", firstElement.tagName);
          console.log("🧪 Element classes:", firstElement.className);

          // Check if the icon exists within this element
          const iconInElement = firstElement.querySelector(iconSelector);
          console.log("🧪 Icon found in base element:", !!iconInElement);
          if (iconInElement) {
            console.log("🧪 Icon element details:", iconInElement);
          }
        }

        // Test hover effect by dispatching a hover event
        setTimeout(() => {
          console.log("🧪 Simulating hover event...");
          testButton.dispatchEvent(
            new MouseEvent("mouseenter", { bubbles: true })
          );

          setTimeout(() => {
            const hoveredStyles = window.getComputedStyle(testIcon);
            console.log("🧪 Icon styles after hover simulation:", {
              transform: hoveredStyles.transform,
              width: hoveredStyles.width,
              height: hoveredStyles.height,
              color: hoveredStyles.color,
            });

            // Reset hover state
            testButton.dispatchEvent(
              new MouseEvent("mouseleave", { bubbles: true })
            );
          }, 100);
        }, 500);
      }
    }

    // Create a global hover effect that works for all buttons
    console.log("🌐 Creating global hover effect for better compatibility...");
    const globalStyleId = `sc-global-hover-${buttonType}-${elementId}`;

    // Remove any existing global style
    const existingGlobalStyle = document.getElementById(globalStyleId);
    if (existingGlobalStyle) {
      existingGlobalStyle.remove();
    }

    // Create global CSS that targets all buttons with icons
    const globalStyle = document.createElement("style");
    globalStyle.id = globalStyleId;
    globalStyle.textContent = `
          /* Global hover effect for ${buttonType} buttons */
          .sqscraft-button-icon:hover {
            ${hoverStyles}
          }

          /* Alternative targeting for better compatibility */
          [class*="button"]:hover .sqscraft-button-icon {
            ${hoverStyles}
          }

          /* Target by button type classes */
          .sqs-button-element--${buttonType
            .replace("button", "")
            .toLowerCase()}:hover .sqscraft-button-icon {
            ${hoverStyles}
          }
        `;

    // Append global styles to both documents
    const hostDocs = [document];
    try {
      const siteFrame = document.getElementById("sqs-site-frame");
      const frameDoc =
        siteFrame?.contentDocument || siteFrame?.contentWindow?.document;
      if (frameDoc) hostDocs.push(frameDoc);
    } catch (e) {
      console.warn("⚠️ Unable to access iframe document for global hover CSS");
    }
    hostDocs.forEach((docRef) =>
      docRef.head.appendChild(globalStyle.cloneNode(true))
    );
    console.log("✅ Global hover styles added for better compatibility");
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
        lastClickedBlockId =
          getStableBlockId(fallbackBlock) || fallbackBlock.id;
      }
    }

    if (lastClickedBlockId) {
      const stableId =
        getStableBlockId(lastClickedBlockId) || lastClickedBlockId;
      await fetchImageModifications(stableId);
      await fetchImageOverlayModifications(stableId);
      await fetchImageShadowModifications(stableId);
    }

    // Fetch typography modifications on page load
    console.log("🌅 Window load: About to fetch typography modifications");
    await fetchAllTypographyModificationsForPage();
    console.log("🌅 Window load: Typography modifications fetch completed");

    // Fetch button color modifications on page load
    console.log("🌅 Window load: About to fetch button color modifications");
    await fetchButtonColorModifications();
    console.log("🌅 Window load: Button color modifications fetch completed");

    // ✅ NEW: Fetch all button border modifications on page load (bulk fetch)
    console.log(
      "🌅 Window load: About to fetch all button border modifications"
    );
    try {
      await fetchAllButtonBorderModifications();
      console.log(
        "🌅 Window load: All button border modifications fetch completed"
      );
    } catch (error) {
      console.error(
        "🌅 Window load: All button border modifications fetch failed:",
        error
      );
    }

    // Fetch button icon modifications on page load
    console.log("🌅 Window load: About to fetch button icon modifications");
    await fetchButtonIconModifications();
    console.log("🌅 Window load: Button icon modifications fetch completed");

    // Fetch button hover icon modifications on page load
    console.log(
      "🌅 Window load: About to fetch button hover icon modifications"
    );
    console.log(
      "🌅 Checking if function exists:",
      typeof fetchButtonHoverIconModifications
    );
    console.log("🌅 Function name:", fetchButtonHoverIconModifications.name);
    try {
      const result = await fetchButtonHoverIconModifications();
      console.log(
        "🌅 Window load: Button hover icon modifications fetch completed with result:",
        result
      );
    } catch (error) {
      console.error(
        "🌅 Window load: Button hover icon modifications fetch failed:",
        error
      );
    }

    // Fetch button hover border modifications on page load
    console.log(
      "🌅 Window load: About to fetch button hover border modifications"
    );
    try {
      const result = await fetchButtonHoverBorderModifications();
      console.log(
        "🌅 Window load: Button hover border modifications fetch completed with result:",
        result
      );
    } catch (error) {
      console.error(
        "🌅 Window load: Button hover border modifications fetch failed:",
        error
      );
    }

    // Fetch button hover shadow modifications on page load
    console.log(
      "🌅 Window load: About to fetch button hover shadow modifications"
    );
    try {
      const result = await fetchButtonHoverShadowModifications();
      console.log(
        "🌅 Window load: Button hover shadow modifications fetch completed with result:",
        result
      );
    } catch (error) {
      console.error(
        "🌅 Window load: Button hover shadow modifications fetch failed:",
        error
      );
    }

    // Fetch button hover color modifications on page load
    console.log(
      "🌅 Window load: About to fetch button hover color modifications"
    );
    await fetchButtonHoverColorModifications();
    console.log(
      "🌅 Window load: Button hover color modifications fetch completed"
    );

    // Fetch button hover effect modifications on page load
    console.log(
      "🌅 Window load: About to fetch button hover effect modifications"
    );
    try {
      const result = await fetchButtonHoverEffectModifications();
      console.log(
        "🌅 Window load: Button hover effect modifications fetch completed with result:",
        result
      );
    } catch (error) {
      console.error(
        "🌅 Window load: Button hover effect modifications fetch failed:",
        error
      );
    }
  });

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

  // const observer = new MutationObserver(() => {
  //   addHeadingEventListeners();
  //   fetchModifications();
  // });

  // const obsTarget = isSameOrigin ? parent.document.body : document.body;
  // observer.observe(obsTarget, { childList: true, subtree: true });

  const observer = new MutationObserver(() => {
    observer.disconnect();
    // addHeadingEventListeners();
    fetchModifications();
    fetchAllTypographyModificationsForPage(); // Fetch all typography modifications for page
    fetchButtonIconModifications(); // Fetch all button icon modifications
    // ✅ NEW: Fetch all button border modifications when page changes
    fetchAllButtonBorderModifications();
    // fetchImageModifications(lastClickedBlockId);
    // fetchButtonHoverIconModifications();

    const selectedBlock = document.querySelector('[id^="block-"]:has(img)');
    const elementIdRaw = selectedBlock?.id || null;
    const elementId = getStableBlockId(elementIdRaw) || elementIdRaw || null;

    if (elementId) {
      fetchImageModifications(elementId);
      fetchImageOverlayModifications(elementId);
      fetchImageShadowModifications(elementId);
    }

    if (elementId) {
      console.log(
        "🔄 Observer: Calling fetchButtonHoverBorderModifications with elementId:",
        elementId
      );
      fetchButtonModifications(elementId);
      fetchButtonBorderModifications(elementId);
      fetchButtonShadowModifications(elementId);
      fetchButtonIconModifications(elementId);
      fetchButtonHoverBorderModifications(elementId);
      fetchButtonHoverShadowModifications(elementId);
      fetchButtonHoverColorModifications(elementId);
      fetchButtonHoverIconModifications(elementId);
      fetchButtonHoverEffectModifications(elementId);
    } else {
      console.log(
        "🔄 Observer: No elementId found, not calling fetchButtonHoverBorderModifications"
      );
      // Fetch general button hover icon modifications when no specific element
      // fetchButtonHoverIconModifications();
    }

    // Fetch button color modifications
    console.log("🔄 Observer: About to fetch button color modifications");
    console.log("🔄 Observer: elementId =", elementId);
    if (elementId) {
      console.log(
        "🔄 Observer: Calling fetchButtonColorModifications with elementId"
      );
      fetchButtonColorModifications(elementId);
    } else {
      console.log(
        "🔄 Observer: Calling fetchButtonColorModifications without elementId"
      );
      fetchButtonColorModifications();
    }

    // Initialize image reset handler
    initImageResetHandler();

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
          saveLinkTextModifications,
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
                saveLinkTextModifications,
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
    console.log("🔍 Font weight link select found:", !!fontWeightLinkSelect);
    console.log(
      "🔍 handleFontWeightLink function available:",
      typeof handleFontWeightLink
    );

    if (fontWeightLinkSelect && !fontWeightLinkSelect.dataset.initialized) {
      console.log("✅ Initializing font weight select for links");
      fontWeightLinkSelect.dataset.initialized = "true";

      fontWeightLinkSelect.addEventListener("change", function (event) {
        event.preventDefault();
        console.log("🎯 Font weight select changed - event triggered!");

        const currentlySelectedBlock = document.querySelector(".sc-selected");
        const selectedFontWeight = this.value;
        console.log("🎯 Selected font weight:", selectedFontWeight);
        console.log("🎯 Currently selected block:", !!currentlySelectedBlock);

        if (!currentlySelectedBlock) {
          showNotification("❌ Please select a block first.", "error");
          this.value = "400";
          return;
        }

        const selectedTab = document.querySelector(".sc-selected-tab");
        console.log("🎯 Selected tab:", !!selectedTab);

        if (!selectedTab) {
          showNotification(
            "❌ Please select a text type (h1, h2, p1 etc) first.",
            "error"
          );
          this.value = "400";
          return;
        }

        // Get the correct selectedSingleTextType from the selected tab
        let currentSelectedSingleTextType = null;
        if (selectedTab.id.startsWith("heading")) {
          currentSelectedSingleTextType = `heading${selectedTab.id.replace(
            "heading",
            ""
          )}`;
        } else if (selectedTab.id.startsWith("paragraph")) {
          currentSelectedSingleTextType = `paragraph${selectedTab.id.replace(
            "paragraph",
            ""
          )}`;
        }

        console.log(
          "🎯 Current selected text type from tab:",
          currentSelectedSingleTextType
        );

        console.log("🎯 About to call handleFontWeightLink...");
        console.log("🎯 Function type:", typeof handleFontWeightLink);

        if (typeof handleFontWeightLink === "function") {
          handleFontWeightLink(event, {
            lastClickedElement: currentlySelectedBlock,
            selectedSingleTextType: currentSelectedSingleTextType,
            addPendingModification,
            saveLinkTextModifications,
            showNotification,
          });
        } else {
          console.error("❌ handleFontWeightLink is not a function!");
        }
      });
    } else {
      console.log(
        "⚠️ Font weight link select not found or already initialized"
      );
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
          saveTypographyAllModifications,
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

      AllFontWeightSelect.addEventListener("change", async (event) => {
        await handleAllFontWeightClick(event, {
          lastClickedElement,
          selectedSingleTextType,
          addPendingModification,
          showNotification,
        });
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

    // const ItalicFontWeightSelect = document.getElementById(
    //   "squareCraftItalicFontWeight"
    // );
    // if (ItalicFontWeightSelect && !ItalicFontWeightSelect.dataset.initialized) {
    //   ItalicFontWeightSelect.dataset.initialized = "true";

    //   ItalicFontWeightSelect.addEventListener("change", (event) => {
    //     handleItalicFontWeightClick(event, {
    //       lastClickedElement,
    //       selectedSingleTextType,
    //       addPendingModification,
    //       showNotification,
    //     });

    //     if (selectedSingleTextType) {
    //       showNotification(
    //         `Font weight applied to: ${selectedSingleTextType}`,
    //         "success"
    //       );
    //     }
    //   });
    // }

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
            saveLinkTextModifications,
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
        initImageShadowControls(
          () => selectedImage,
          saveImageShadowModifications
        );

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

  addHeadingEventListeners();

  // Load CSS first
  // try {
  //   const cssLink = document.createElement("link");
  //   cssLink.rel = "stylesheet";
  //   cssLink.href =
  //     "https://fatin-webefo.github.io/squareCraft-plugin/src/styles/parent.css";
  //   document.head.appendChild(cssLink);
  // } catch (error) {
  //   console.error("🚨 Failed to load CSS", error);
  // }

  // Wait for CSS to load before injecting icons
  setTimeout(async () => {
    try {
      const { injectNavbarIcon } = await import(
        // "https://fatin-webefo.github.io/squareCraft-plugin/injectNavbarIcon.js"
        "https://goswami34.github.io/squareCraft-widget/injectNavbarIcon.js"
      );
      injectNavbarIcon();
    } catch (error) {
      console.error("🚨 Failed to load navbar icon script", error);
    }
  }, 1000);

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

  async function handleAndDetect(clickedBlock) {
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
  }

  // function loadWidgetFromString(htmlString, clickedBlock) {
  //   if (!widgetContainer) {
  //     widgetContainer = document.createElement("div");
  //     widgetContainer.id = "sc-widget-container";
  //     widgetContainer.classList.add(
  //       "sc-fixed",
  //       "sc-text-color-white",
  //       "sc-universal",
  //       "sc-z-999999"
  //     );

  //     const styleLink = document.createElement("link");
  //     styleLink.rel = "stylesheet";
  //     styleLink.type = "text/css";
  //     styleLink.href =
  //       "https://fatin-webefo.github.io/squareCraft-plugin/src/styles/parent.css";
  //     widgetContainer.appendChild(styleLink);

  //     const contentWrapper = document.createElement("div");
  //     contentWrapper.innerHTML = htmlString;
  //     widgetContainer.appendChild(contentWrapper);

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
  //     ButtonAdvanceToggleControls();
  //     buttonTooltipControls();
  //     initButtonSectionToggleControls();
  //     WidgetTypoSectionStateControls();
  //     initImageStateTabToggle();
  //     WidgetImageHoverToggleControls();
  //     initHoverTypoTabControls([
  //       {
  //         buttonId: "typo-all-hover-font-button",
  //         sectionId: "typo-all-hover-font-section",
  //       },
  //       {
  //         buttonId: "typo-all-hover-border-button",
  //         sectionId: "typo-all-hover-border-section",
  //       },
  //       {
  //         buttonId: "typo-all-hover-shadow-button",
  //         sectionId: "typo-all-hover-shadow-section",
  //       },
  //       {
  //         buttonId: "typo-all-hover-effects-button",
  //         sectionId: "typo-all-hover-effects-section",
  //       },
  //       {
  //         buttonId: "typo-bold-hover-font-button",
  //         sectionId: "typo-bold-hover-font-section",
  //       },
  //       {
  //         buttonId: "typo-italic-hover-font-button",
  //         sectionId: "typo-italic-hover-font-section",
  //       },
  //       {
  //         buttonId: "typo-link-hover-font-button",
  //         sectionId: "typo-link-hover-font-section",
  //       },
  //     ]);
  //     initHoverButtonSectionToggleControls();
  //     hoverTypoTabSelect();
  //     initHoverButtonEffectDropdowns();
  //     initImageUploadPreview(() => selectedElement);
  //     triggerLaunchAnimation();
  //     if (clickedBlock) {
  //       waitForElement("#typoSection, #imageSection, #buttonSection")
  //         .then(() => {
  //           handleBlockClick(
  //             { target: clickedBlock },
  //             {
  //               getTextType,
  //               getHoverTextType,
  //               selectedElement,
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

      // Add typography font dropdown CSS
      const typographyStyleLink = document.createElement("link");
      typographyStyleLink.rel = "stylesheet";
      typographyStyleLink.type = "text/css";
      typographyStyleLink.href =
        "https://goswami34.github.io/squareCraft-widget/src/styles/typography-font-dropdown.css";
      widgetContainer.appendChild(typographyStyleLink);

      const contentWrapper = document.createElement("div");
      contentWrapper.innerHTML = htmlString;
      widgetContainer.appendChild(contentWrapper);

      widgetContainer.style.display = "block";
      document.body.appendChild(widgetContainer);

      initImageMaskControls(() => selectedElement, {
        saveModificationsforImage,
      });
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
      initImageResetHandler();
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
                setSelectedElement: setSelectedElement,
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

  // Typography Font Family System Initialization
  async function initTypographyFontFamilySystem() {
    try {
      // Import the typography font family system
      const { initTypographyFontFamilyControls } = await import(
        "./src/All/initTypographyFontFamilyControls.js"
      );
      const { initTypographyFontFamilyEvents } = await import(
        "./src/All/handleAllFontFamily.js"
      );

      // Expose global variables for typography system
      window.lastClickedElement = selectedElement;
      window.selectedSingleTextType = selectedSingleTextType;
      window.addPendingModification = addPendingModification;

      // Create context for typography system
      const typographyContext = {
        lastClickedElement: selectedElement,
        selectedSingleTextType: selectedSingleTextType,
        addPendingModification: (blockId, modifications) => {
          addPendingModification(blockId, modifications);
        },
      };

      // Initialize events with waiting mechanism
      initTypographyFontFamilyEvents(typographyContext);

      console.log("✅ Typography font family system initialization started");
    } catch (error) {
      console.error(
        "❌ Failed to initialize typography font family system:",
        error
      );
    }
  }

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

          // Initialize typography system after widget is loaded
          setTimeout(() => {
            console.log("🔄 Initializing typography system...");
            initTypographyFontFamilySystem();

            // Initialize font size publish button
            console.log("🔄 Initializing font size publish button...");
            initFontSizePublishButton(saveTypographyAllModifications);

            // Initialize text align publish button
            console.log("🔄 Initializing text align publish button...");
            initTextAlignPublishButton(saveTypographyAllModifications);

            // Initialize text color publish button
            console.log("🔄 Initializing text color publish button...");
            initTextColorPublishButton(saveTypographyAllModifications);

            // Initialize line height publish button
            console.log("🔄 Initializing line height publish button...");
            initLineHeightPublishButton(saveTypographyAllModifications);

            // Initialize font weight publish button
            console.log("🔄 Initializing font weight publish button...");
            initFontWeightPublishButton(saveTypographyAllModifications);

            // Initialize text transform publish button
            console.log("🔄 Initializing text transform publish button...");
            initTextTransformPublishButton(saveTypographyAllModifications);

            // Initialize text highlight publish button
            console.log("🔄 Initializing text highlight publish button...");
            initTextHighlightPublishButton(saveTypographyAllModifications);

            // Initialize letter spacing publish button
            console.log("🔄 Initializing letter spacing publish button...");
            initLetterSpacingPublishButton(saveTypographyAllModifications);
          }, 1000); // Give more time for widget to be fully rendered
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
  // handleSectionFind();
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

  // function moveWidgetToDesktop() {
  //   if (!widgetContainer) return;

  //   document.body.appendChild(widgetContainer);
  // }

  // checkView();
  // window.addEventListener("resize", checkView);

  function addPendingModification(blockId, css, tagType) {
    console.log("📝 addPendingModification called:", { blockId, tagType, css });

    // Use global pendingModifications
    const globalPendingModifications =
      window.pendingModifications || pendingModifications;

    if (!globalPendingModifications.has(blockId)) {
      globalPendingModifications.set(blockId, []);
    }
    globalPendingModifications.get(blockId).push({ css, tagType });

    console.log("✅ Modification added to pendingModifications");
    console.log(
      "📊 Current pendingModifications size:",
      globalPendingModifications.size
    );
    console.log(
      "🔍 Pending modifications for this block:",
      globalPendingModifications.get(blockId)
    );

    // Debug: Log the specific styles being added
    if (css && typeof css === "object") {
      console.log("🎨 Styles being added:", {
        buttonPrimary: css.buttonPrimary?.styles,
        buttonSecondary: css.buttonSecondary?.styles,
        buttonTertiary: css.buttonTertiary?.styles,
      });

      // Additional debugging for button hover colors
      if (
        tagType === "buttonHoverTextColor" ||
        tagType === "buttonHoverBackgroundColor"
      ) {
        console.log(
          "🔍 Button Hover Debug - Full CSS object:",
          JSON.stringify(css, null, 2)
        );
        console.log("🔍 Button Hover Debug - Button types with styles:", {
          primary: Object.keys(css.buttonPrimary?.styles || {}),
          secondary: Object.keys(css.buttonSecondary?.styles || {}),
          tertiary: Object.keys(css.buttonTertiary?.styles || {}),
        });
      }
    }
  }

  // Make addPendingModification available globally for icon functions
  window.addPendingModification = addPendingModification;

  // Make pendingModifications available globally for debugging
  window.pendingModifications = pendingModifications;

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

    // ✅ FIXED: Dynamically determine the button type based on the actual selected button
    const typeClass = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );

    if (!typeClass) return null;

    const buttonType = typeClass.includes("--primary")
      ? "buttonPrimary"
      : typeClass.includes("--secondary")
      ? "buttonSecondary"
      : typeClass.includes("--tertiary")
      ? "buttonTertiary"
      : "buttonPrimary";

    const computed = window.getComputedStyle(btn);
    return {
      [buttonType]: {
        selector: `.${typeClass}`,
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
    console.log("🚀 squareCraft.js handlePublish called");

    // Sync any local modifications first
    if (
      window.localButtonColorModifications &&
      window.localButtonColorModifications.size > 0
    ) {
      console.log(
        "🔄 Syncing local button color modifications before publish..."
      );
      for (const [
        blockId,
        modifications,
      ] of window.localButtonColorModifications.entries()) {
        for (const mod of modifications) {
          if (typeof window.addPendingModification === "function") {
            window.addPendingModification(blockId, mod.css, mod.tagType);
            console.log(
              `✅ Synced ${mod.tagType} for block ${blockId} before publish`
            );
          }
        }
      }
      window.localButtonColorModifications.clear();
    }

    // Use global pendingModifications
    const globalPendingModifications =
      window.pendingModifications || pendingModifications;

    console.log("📊 Current pendingModifications:", globalPendingModifications);
    console.log(
      "📊 pendingModifications size:",
      globalPendingModifications.size
    );

    // Debug: Log all entries in pendingModifications
    if (globalPendingModifications.size > 0) {
      console.log("🔍 All pending modifications:");
      for (const [
        blockId,
        modifications,
      ] of globalPendingModifications.entries()) {
        console.log(`Block ${blockId}:`, modifications);
      }
    }

    if (globalPendingModifications.size === 0) {
      showNotification("No changes to publish", "info");
      return;
    }

    try {
      console.log("🔄 Starting to process pending modifications...");

      // Save each pending modification
      for (const [
        blockId,
        modifications,
      ] of globalPendingModifications.entries()) {
        console.log(
          `📝 Processing block ${blockId} with ${modifications.length} modifications`
        );

        // Group modifications by type for proper merging
        const buttonColorMods = modifications.filter(
          (mod) =>
            mod.tagType === "buttonBackgroundColor" ||
            mod.tagType === "buttonTextColor"
        );
        const buttonHoverColorMods = modifications.filter(
          (mod) =>
            mod.tagType === "buttonHoverColor" ||
            mod.tagType === "buttonHoverTextColor" ||
            mod.tagType === "buttonHoverBackgroundColor"
        );
        const otherMods = modifications.filter(
          (mod) =>
            mod.tagType !== "buttonBackgroundColor" &&
            mod.tagType !== "buttonTextColor" &&
            mod.tagType !== "buttonHoverColor" &&
            mod.tagType !== "buttonHoverTextColor" &&
            mod.tagType !== "buttonHoverBackgroundColor"
        );

        // Handle button color modifications (merge background and text colors)
        if (buttonColorMods.length > 0) {
          console.log(
            "🎨 Processing button color modifications:",
            buttonColorMods
          );

          // Merge background and text color modifications
          const mergedButtonColors =
            mergeButtonColorModifications(buttonColorMods);

          if (mergedButtonColors) {
            const result = await saveButtonColorModifications(
              blockId,
              mergedButtonColors
            );
            console.log(`✅ Button color modification result:`, result);

            if (!result?.success) {
              throw new Error(
                `Failed to save button color changes for block ${blockId}`
              );
            }

            // Clear local pending modifications after successful save
            if (
              typeof window.pendingButtonBackgroundColorModifications !==
              "undefined"
            ) {
              window.pendingButtonBackgroundColorModifications.clear();
              console.log("✅ Local background color modifications cleared");
            }
            if (
              typeof window.pendingButtonTextColorModifications !== "undefined"
            ) {
              window.pendingButtonTextColorModifications.clear();
              console.log("✅ Local text color modifications cleared");
            }

            // Clear unified pending modifications after successful save
            if (typeof window.pendingButtonColorModifications !== "undefined") {
              window.pendingButtonColorModifications.clear();
              console.log("✅ Unified button color modifications cleared");
            }
          }
        }

        // Handle button hover color modifications (merge background and text hover colors)
        if (buttonHoverColorMods.length > 0) {
          console.log(
            "🎨 Processing button hover color modifications:",
            buttonHoverColorMods
          );

          // Merge background and text hover color modifications
          const mergedButtonHoverColors =
            mergeButtonHoverColorModifications(buttonHoverColorMods);

          if (mergedButtonHoverColors) {
            const result = await saveButtonHoverColorModifications(
              blockId,
              mergedButtonHoverColors
            );
            console.log(`✅ Button hover color modification result:`, result);

            if (!result?.success) {
              throw new Error(
                `Failed to save button hover color changes for block ${blockId}`
              );
            }
          }
        }

        // Handle other modifications
        for (const mod of otherMods) {
          console.log(`🔍 Processing modification:`, {
            tagType: mod.tagType,
            css: mod.css,
          });

          let result;

          switch (mod.tagType) {
            case "link":
              console.log("🔗 Processing link modification");
              result = await saveLinkTextModifications(
                blockId,
                mod.css.target,
                mod.css
              );
              break;
            case "buttonIcon":
              console.log("🖼️ Processing buttonIcon modification");
              result = await saveButtonIconModifications(blockId, mod.css);
              break;
            case "buttonHoverBorder":
              console.log("🖼️ Processing buttonHoverBorder modification");
              result = await saveButtonHoverBorderModifications(
                blockId,
                mod.css
              );
              break;
            case "typographyAll":
            case "typographyFontFamily":
            case "typographyFontSize":
            case "typographyFontWeight":
            case "typographyLineHeight":
            case "typographyTextAlign":
            case "typographyTextColor":
            case "typographyTextHighlight":
            case "typographyTextTransform":
            case "typographyLetterSpacing":
              console.log("🎨 Processing typography modification:", {
                tagType: mod.tagType,
                blockId,
                css: mod.css,
                target: mod.target,
                textType: mod.textType,
              });

              // Use the typography-specific save function
              if (window.saveTypographyAllModifications) {
                console.log(
                  "✅ saveTypographyAllModifications function found, calling it..."
                );
                result = await window.saveTypographyAllModifications(
                  blockId,
                  mod.css,
                  mod.target || mod.textType
                );
                console.log("✅ Typography modification result:", result);
              } else {
                console.error(
                  "❌ saveTypographyAllModifications function not available"
                );
                throw new Error("Typography save function not available");
              }
              break;
            default:
              console.log(
                `📄 Processing default modification for tagType: ${mod.tagType}`
              );
              result = await saveModifications(blockId, mod.css, mod.tagType);
              break;
          }

          console.log(`✅ Modification result:`, result);

          if (!result?.success) {
            throw new Error(`Failed to save changes for block ${blockId}`);
          }
        }
      }

      // Clear pending modifications after successful save
      globalPendingModifications.clear();
      console.log("✅ All modifications processed successfully");
      showNotification("All changes published successfully!", "success");
    } catch (error) {
      console.error("❌ Error in handlePublish:", error);
      showNotification(error.message, "error");
    }
  }

  // Function to merge background and text color modifications
  function mergeButtonColorModifications(buttonColorMods) {
    console.log("🔄 Merging button color modifications:", buttonColorMods);

    const mergedColors = {
      buttonPrimary: {
        selector: ".sqs-button-element--primary",
        styles: {},
      },
      buttonSecondary: {
        selector: ".sqs-button-element--secondary",
        styles: {},
      },
      buttonTertiary: {
        selector: ".sqs-button-element--tertiary",
        styles: {},
      },
    };

    // Merge all button color modifications
    buttonColorMods.forEach((mod) => {
      console.log(`📝 Merging ${mod.tagType} modification:`, mod.css);

      if (mod.css.buttonPrimary?.styles) {
        Object.assign(
          mergedColors.buttonPrimary.styles,
          mod.css.buttonPrimary.styles
        );
      }
      if (mod.css.buttonSecondary?.styles) {
        Object.assign(
          mergedColors.buttonSecondary.styles,
          mod.css.buttonSecondary.styles
        );
      }
      if (mod.css.buttonTertiary?.styles) {
        Object.assign(
          mergedColors.buttonTertiary.styles,
          mod.css.buttonTertiary.styles
        );
      }
    });

    console.log("✅ Merged button colors:", mergedColors);
    return mergedColors;
  }

  // Function to merge background and text hover color modifications
  function mergeButtonHoverColorModifications(buttonHoverColorMods) {
    console.log(
      "🔄 Merging button hover color modifications:",
      buttonHoverColorMods
    );

    const mergedHoverColors = {
      buttonPrimary: {
        selector: ".sqs-button-element--primary:hover",
        styles: {},
      },
      buttonSecondary: {
        selector: ".sqs-button-element--secondary:hover",
        styles: {},
      },
      buttonTertiary: {
        selector: ".sqs-button-element--tertiary:hover",
        styles: {},
      },
    };

    // Merge all button hover color modifications
    buttonHoverColorMods.forEach((mod) => {
      console.log(`📝 Merging ${mod.tagType} modification:`, mod.css);
      console.log(`🔍 Modification details:`, {
        tagType: mod.tagType,
        blockId: mod.blockId,
        css: mod.css,
      });

      if (mod.css.buttonPrimary?.styles) {
        console.log(
          `🎨 Merging buttonPrimary styles:`,
          mod.css.buttonPrimary.styles
        );
        Object.assign(
          mergedHoverColors.buttonPrimary.styles,
          mod.css.buttonPrimary.styles
        );
      }
      if (mod.css.buttonSecondary?.styles) {
        console.log(
          `🎨 Merging buttonSecondary styles:`,
          mod.css.buttonSecondary.styles
        );
        Object.assign(
          mergedHoverColors.buttonSecondary.styles,
          mod.css.buttonSecondary.styles
        );
      }
      if (mod.css.buttonTertiary?.styles) {
        console.log(
          `🎨 Merging buttonTertiary styles:`,
          mod.css.buttonTertiary.styles
        );
        Object.assign(
          mergedHoverColors.buttonTertiary.styles,
          mod.css.buttonTertiary.styles
        );
      }
    });

    console.log("✅ Merged button hover colors:", mergedHoverColors);

    // Debug: Check if we have both color and background-color
    const hasTextColor = Object.values(mergedHoverColors).some((btn) =>
      Object.keys(btn.styles).includes("color")
    );
    const hasBackgroundColor = Object.values(mergedHoverColors).some((btn) =>
      Object.keys(btn.styles).includes("background-color")
    );

    console.log("🔍 Style check:", {
      hasTextColor,
      hasBackgroundColor,
      allStyles: Object.values(mergedHoverColors).map((btn) =>
        Object.keys(btn.styles)
      ),
    });

    // Additional debugging for the merge process
    console.log("🔍 Merge Process Debug:", {
      inputModifications: buttonHoverColorMods.length,
      inputModTypes: buttonHoverColorMods.map((m) => m.tagType),
      finalMergedStyles: {
        primary: Object.keys(mergedHoverColors.buttonPrimary.styles),
        secondary: Object.keys(mergedHoverColors.buttonSecondary.styles),
        tertiary: Object.keys(mergedHoverColors.buttonTertiary.styles),
      },
      finalMergedValues: {
        primary: mergedHoverColors.buttonPrimary.styles,
        secondary: mergedHoverColors.buttonSecondary.styles,
        tertiary: mergedHoverColors.buttonTertiary.styles,
      },
    });

    return mergedHoverColors;
  }

  // Add publish button event listener
  function initPublishButton() {
    console.log("🔍 Looking for publish button...");
    const publishButton = document.getElementById("publish");
    if (publishButton) {
      console.log("✅ Publish button found:", publishButton);

      // Remove any existing event listeners to prevent duplicates
      const newPublishButton = publishButton.cloneNode(true);
      publishButton.parentNode.replaceChild(newPublishButton, publishButton);

      // Add the event listener
      newPublishButton.addEventListener("click", async () => {
        try {
          // Show loading state
          newPublishButton.disabled = true;
          newPublishButton.textContent = "Publishing...";

          await handlePublish();
        } catch (error) {
          showNotification(error.message, "error");
        } finally {
          // Reset button state
          newPublishButton.disabled = false;
          newPublishButton.textContent = "Publish";
        }
      });

      console.log("✅ Publish button event listener added");

      // Test if the button is clickable
      console.log("🔍 Publish button properties:", {
        disabled: newPublishButton.disabled,
        textContent: newPublishButton.textContent,
        className: newPublishButton.className,
        style: newPublishButton.style.display,
      });
    } else {
      console.warn("⚠️ Publish button not found");
      console.log(
        "🔍 Available elements with 'publish' in ID:",
        Array.from(document.querySelectorAll('[id*="publish"]')).map(
          (el) => el.id
        )
      );
    }
  }

  // Initialize publish button when widget is ready
  setTimeout(initPublishButton, 1000);

  // Make handlePublish available globally
  window.handlePublish = handlePublish;

  // Make saveButtonColorModifications available globally
  window.saveButtonColorModifications = saveButtonColorModifications;

  // Make toggleWidgetVisibility available globally
  window.toggleWidgetVisibility = toggleWidgetVisibility;

  // Listen for toolbar click events from injectNavbarIcon.js
  const targetDocument = isSameOrigin ? parent.document : document;
  targetDocument.addEventListener("sc-toolbar-click", async (event) => {
    const clickedBlock = event.detail.target;
    if (clickedBlock) {
      await toggleWidgetVisibility({ target: clickedBlock });
    }
  });
})();
