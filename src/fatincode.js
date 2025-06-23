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
  const { initButtonAdvanceStyles } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/button/WidgetButtonSection/WidgetButtonAdvanceStyles/WidgetButtonAdvanceStyles.js"
  );
  const { handleSectionFind } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/section/handleSectionFind.js"
  );
  const { ButtonAdvanceToggleControls } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/button/ButtonAdvanceToggleControls/ButtonAdvanceToggleControls.js"
  );
  const { getTextType } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/utils/getTextType.js"
  );
  const { getHoverTextType } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/utils/getHoverTextType.js"
  );

  const { handleFontWeightDropdownClick } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/clickEvents/handleFontWeightDropdownClick.js"
  );
  const { initHoverTypoTabControls } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/clickEvents/initHoverTypoTabControls.js"
  );
  const { handleBlockClick } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/clickEvents/handleBlockClick.js"
  );
  const { initImageStateTabToggle } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/components/WidgetImageSection/initImageStateTabToggle/initImageStateTabToggle.js"
  );
  const { WidgetImageHoverToggleControls } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/components/WidgetImageSection/WidgetImageHoverToggleControls/WidgetImageHoverToggleControls.js"
  );

  const { handleAlignmentClick } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/clickEvents/handleAlignmentClick.js"
  );
  const { handleTextColorClick } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/clickEvents/handleTextColorClick.js"
  );
  const { typoTabSelect } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/clickEvents/typoTabSelect.js"
  );
  const { hoverTypoTabSelect } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/clickEvents/hoverTypoTabSelect.js"
  );
  const { detectBlockElementTypes } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/components/BlockType/detectBlockElementTypes.js"
  );
  const { initImageSectionControls } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/utils/initImageSectionControls.js"
  );
  const { WidgetTypoSectionStateControls } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/components/WidgetTypoSection/WidgetTypoSectionStateControls/WidgetTypoSectionStateControls.js"
  );

  const { initImageSectionToggleControls } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/utils/initImageSectionToggleControls.js"
  );
  const {
    initHoverButtonSectionToggleControls,
    initHoverButtonEffectDropdowns,
  } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/button/initHoverButtonSectionToggleControls/initHoverButtonSectionToggleControls.js"
  );
  const { initButtonSectionToggleControls } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/button/initButtonSectionToggleControls/initButtonSectionToggleControls.js"
  );
  const { initImageUploadPreview } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/button/initButtonSectionToggleControls/initImageUploadPreview.js"
  );
  const { initImageMaskControls } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/clickEvents/initImageMaskControls.js"
  );
  const { getSquarespaceThemeStyles } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/utils/getSquarespaceThemeStyles.js"
  );
  const { buttonTooltipControls } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/button/buttonTooltipControls/buttonTooltipControls.js"
  );
  const { initBorderColorPaletteToggle } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/utils/initBorderColorPaletteToggle.js"
  );
  const { createHoverableArrowSVG } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/utils/createHoverableArrowSVG/createHoverableArrowSVG.js"
  );
  const { initButtonFontColorPaletteToggle } = await import(
    "https://fatin-webefo.github.io/squareCraft-plugin/src/button/initButtonFontColorPaletteToggle/initButtonFontColorPaletteToggle.js"
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
    "https://fatin-webefo.github.io/squareCraft-plugin/src/button/initButtonStyles/initButtonStyles.js"
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
    "https://fatin-webefo.github.io/squareCraft-plugin/src/button/initButtonStyles/initButtonHoverStyles.js"
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

  async function fetchModifications(retries = 3) {
    const module = await import(
      "https://fatin-webefo.github.io/squareCraft-plugin/html.js"
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

      const targetBody = isSameOrigin ? parent.document.body : document.body;
      observer.observe(targetBody, { childList: true, subtree: true });
    } catch (error) {
      console.error("❌ Error Fetching Modifications:", error);
      if (retries > 0) {
        setTimeout(() => fetchModifications(retries - 1), 2000);
      }
    }
  }

  window.addEventListener("load", async () => {
    await fetchModifications();
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
