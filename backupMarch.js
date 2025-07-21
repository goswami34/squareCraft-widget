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

  document.addEventListener("DOMContentLoaded", function () {
    const selectedElement = document.querySelector(
      ".sc-selected .sqs-html-content"
    );

    if (!selectedElement) {
      console.error("No selected element found.");
      return;
    }

    const fontSelector = document.getElementById("scFontSelector");

    if (!fontSelector) {
      console.error("Font selector not found.");
      return;
    }

    fontSelector.addEventListener("change", function () {
      const selectedFont = fontSelector.value;
      selectedElement.style.fontFamily = selectedFont;
    });
  });

  function getTextType(tagName, element) {
    let classList = element?.classList || [];

    if (tagName === "h1") return { type: "heading1", borderColor: "#FF0000" };
    if (tagName === "h2") return { type: "heading2", borderColor: "#FFA500" };
    if (tagName === "h3") return { type: "heading3", borderColor: "#FFFF00" };
    if (tagName === "h4") return { type: "heading4", borderColor: "#008000" };

    if (tagName === "p") {
      if (classList.contains("sqsrte-large")) {
        return { type: "paragraph1", borderColor: "#4B0082" };
      } else if (classList.contains("sqsrte-small")) {
        return { type: "paragraph3", borderColor: "#0000FF" };
      } else {
        return { type: "paragraph2", borderColor: "#9400D3" };
      }
    }
    return null;
  }

  let lastClickedBlockId = null;
  let lastClickedElement = null;
  let lastAppliedAlignment = null;
  let lastActiveAlignmentElement = null;

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
    console.log(`✅ Styles applied to ${elementId} and its nested elements`);
  }

  document.body.addEventListener("click", (event) => {
    let block = event.target.closest('[id^="block-"]');
    if (!block) return;

    if (selectedElement) selectedElement.style.outline = "";
    selectedElement = block;
    selectedElement.style.outline = "2px dashed #EF7C2F";

    lastClickedBlockId = block.id;
    lastClickedElement = block;

    console.log(`✅ Selected Block: ${selectedElement.id}`);

    let appliedTextAlign = window.getComputedStyle(block).textAlign;

    if (!appliedTextAlign || appliedTextAlign === "start") {
      const nested = block.querySelector("h1,h2,h3,h4,p");
      if (nested) {
        appliedTextAlign = window.getComputedStyle(nested).textAlign;
      }
    }

    if (appliedTextAlign) {
      lastAppliedAlignment = appliedTextAlign;
      console.log(`✅ Detected existing text alignment: ${appliedTextAlign}`);

      const alignmentIconMap = {
        left: document.getElementById("scTextAlignLeft"),
        center: document.getElementById("scTextAlignCenter"),
        right: document.getElementById("scTextAlignRight"),
        justify: document.getElementById("scTextAlignJustify"),
      };

      if (lastActiveAlignmentElement) {
        lastActiveAlignmentElement.classList.remove("sc-activeTab-border");
        lastActiveAlignmentElement.classList.add("sc-inActiveTab-border");
      }

      const activeIcon = alignmentIconMap[appliedTextAlign];
      if (activeIcon) {
        activeIcon.classList.add("sc-activeTab-border");
        activeIcon.classList.remove("sc-inActiveTab-border");
        lastActiveAlignmentElement = activeIcon;
      }
    }

    const innerTextElements = block.querySelectorAll("h1, h2, h3, h4, p");

    const allParts = [
      "heading1Part",
      "heading2Part",
      "heading3Part",
      "heading4Part",
      "paragraph1Part",
      "paragraph2Part",
      "paragraph3Part",
    ];

    const visibleParts = new Set();

    innerTextElements.forEach((el) => {
      const tagName = el.tagName.toLowerCase();
      const result = getTextType(tagName, el);
      if (result) {
        console.log(
          `📘 getTextType → Tag: ${tagName.toUpperCase()}, Type: ${
            result.type
          }, BorderColor: ${result.borderColor}`
        );
        visibleParts.add(`${result.type}Part`);
        el.style.border = `1px solid ${result.borderColor}`;
        el.style.borderRadius = "4px";
        el.style.padding = "2px 4px";
      }
    });

    allParts.forEach((id) => {
      const part = document.getElementById(id);
      if (part) {
        if (visibleParts.has(id)) {
          part.classList.remove("sc-hidden");
        } else {
          part.classList.add("sc-hidden");
        }
      }
    });

    visibleParts.forEach((partId) => {
      const typeId = partId.replace("Part", "");
      const widgetTab = document.getElementById(typeId);
      if (!widgetTab) return;

      widgetTab.onmouseenter = () => {
        const block = document.getElementById(lastClickedBlockId);
        if (!block) return;

        const tag = typeId.startsWith("heading")
          ? `h${typeId.replace("heading", "")}`
          : "p";

        block.querySelectorAll(tag).forEach((el) => {
          const result = getTextType(tag, el);
          if (result && result.type === typeId) {
            el.style.outline = `2px solid ${result.borderColor}`;
          }
        });
      };

      widgetTab.onmouseleave = () => {
        const block = document.getElementById(lastClickedBlockId);
        if (!block) return;

        block.querySelectorAll("h1, h2, h3, h4, p").forEach((el) => {
          el.style.outline = "";
        });
      };
    });
  });

  document.body.addEventListener("click", async (event) => {
    const alignmentIcon = event.target.closest(
      "#scTextAlignLeft, #scTextAlignCenter, #scTextAlignRight, #scTextAlignJustify"
    );

    if (alignmentIcon && lastClickedElement) {
      const textTags = lastClickedElement.querySelectorAll("h1, h2, h3, h4, p");
      textTags.forEach((el) => {
        const tagName = el.tagName.toLowerCase();
        const result = getTextType(tagName, el);
        if (result) {
          console.log(
            `📘 getTextType → Tag: ${tagName.toUpperCase()}, Type: ${
              result.type
            }, BorderColor: ${result.borderColor}`
          );
        }
      });

      const textAlign = alignmentIcon.dataset.align;

      if (lastAppliedAlignment === textAlign) {
        applyStylesToElement(lastClickedElement, { "text-align": "" });
        lastAppliedAlignment = null;
        console.log(`❌ Alignment undone for Block: ${lastClickedBlockId}`);

        if (lastActiveAlignmentElement) {
          lastActiveAlignmentElement.classList.remove("sc-activeTab-border");
          lastActiveAlignmentElement.classList.add("sc-inActiveTab-border");
        }
      } else {
        applyStylesToElement(lastClickedElement, { "text-align": textAlign });
        lastAppliedAlignment = textAlign;
        console.log(
          `✅ Applying text alignment: ${textAlign} to Block: ${lastClickedBlockId}`
        );

        if (
          lastActiveAlignmentElement &&
          lastActiveAlignmentElement !== alignmentIcon
        ) {
          lastActiveAlignmentElement.classList.remove("sc-activeTab-border");
          lastActiveAlignmentElement.classList.add("sc-inActiveTab-border");
        }

        alignmentIcon.classList.add("sc-activeTab-border");
        alignmentIcon.classList.remove("sc-inActiveTab-border");

        lastActiveAlignmentElement = alignmentIcon;
      }

      document.getElementById("publish").addEventListener("click", async () => {
        const publishButton = document.getElementById("publish");
        publishButton.textContent = "Publishing...";

        const pageId = document
          .querySelector("article[data-page-sections]")
          ?.getAttribute("data-page-sections");
        if (!lastClickedElement || !lastAppliedAlignment || !pageId) return;

        const modificationData = {
          userId,
          token: token,
          widgetId,
          modifications: [
            {
              pageId,
              elements: [
                {
                  elementId: lastClickedElement.id,
                  css: {
                    "text-align": lastAppliedAlignment,
                  },
                },
              ],
            },
          ],
        };

        try {
          const response = await fetch(
            "https://admin.squareplugin.com/api/v1/modifications",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${
                  token || localStorage.getItem("sc_auth_token")
                }`,
                userId: userId,
                pageId: pageId,
                "widget-id": widgetId,
              },
              body: JSON.stringify(modificationData),
            }
          );

          if (!response.ok)
            throw new Error(`HTTP error! status: ${response.status}`);

          const result = await response.json();
          console.log("✅ Modifications saved successfully:", result);
          publishButton.textContent = "Published";
        } catch (error) {
          console.error("❌ Error saving modifications:", error.message);
          publishButton.textContent = "Failed";
        }
      });
    }
  });

  document.body.addEventListener("click", (event) => {
    const textColorPalate = event.target.closest("#textColorPalate");
    if (textColorPalate) {
      let colorPalette = document.getElementById("scColorPalette");

      if (!colorPalette) {
        colorPalette = document.createElement("input");
        colorPalette.type = "color";
        colorPalette.id = "scColorPalette";
        colorPalette.style.opacity = "0";
        colorPalette.style.width = "0px";
        colorPalette.style.height = "0px";
        colorPalette.style.marginTop = "14px";

        textColorPalate.appendChild(colorPalette);

        colorPalette.addEventListener("input", function (event) {
          if (lastClickedElement) {
            const selectedColor = event.target.value;

            applyStylesToElement(lastClickedElement, {
              color: `${selectedColor} !important`,
            });

            textColorPalate.style.backgroundColor = selectedColor;

            const textColorHtml = document.getElementById("textcolorHtml");
            if (textColorHtml) {
              textColorHtml.textContent = selectedColor;
            }

            console.log(`🎨 Applied Color: ${selectedColor}`);
          }
        });
      }

      colorPalette.click();
    }
  });

  document.body.addEventListener("click", (event) => {
    const clicked = event.target.closest("div[id$='Select']");
    if (!clicked) return;

    const dropdown = clicked.closest("[id$='Dropdown']");
    if (!dropdown) {
      console.warn("⚠️ Dropdown container not found for:", clicked.id);
      return;
    }

    console.log("📌 Clicked tab:", clicked.id);

    const baseId = clicked.id.split("-")[0]; // heading1, paragraph2, etc.
    const styleIds = ["allSelect", "boldSelect", "italicSelect", "linkSelect"];

    styleIds.forEach((suffix) => {
      const fullId = `${baseId}-${suffix}`;
      const tab = dropdown.querySelector(`#${fullId}`);
      const desc = dropdown.querySelector(`#scDesc-${fullId}`);

      if (tab) {
        if (tab === clicked) {
          tab.classList.add("sc-select-activeTab-border");
          tab.classList.remove("sc-select-inActiveTab-border");
          console.log(`✅ Activated tab: ${fullId}`);
        } else {
          tab.classList.remove("sc-select-activeTab-border");
          tab.classList.add("sc-select-inActiveTab-border");
          console.log(`🧹 Deactivated tab: ${fullId}`);
        }
      } else {
        console.error(`❌ Tab not found: #${fullId}`);
      }

      if (desc) {
        if (clicked.id === fullId) {
          desc.classList.remove("sc-hidden");
          console.log(`📖 Showing description: scDesc-${fullId}`);
        } else {
          desc.classList.add("sc-hidden");
          console.log(`🙈 Hiding description: scDesc-${fullId}`);
        }
      } else {
        console.error(`❌ Description not found: #scDesc-${fullId}`);
      }
    });
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
      console.log("🚫 Widget toggle is OFF");
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
      console.log("📥 Retrieved modifications:", data);

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
            console.log(`✅ Applying styles to element ${elementId}`);
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
        console.log(`🔄 Retrying fetch... (${retries} attempts left)`);
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
      console.log("🚀 Toggle function called for:", targetElement);
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
        console.log("📌 Tab Element Clicked:", tabElement);
        toggleTabClass(tabElement);
      }
    });
  }

  const observer = new MutationObserver(() => {
    addHeadingEventListeners();
    fetchModifications();
  });

  observer.observe(parent.document.body, { childList: true, subtree: true });

  addHeadingEventListeners();

  try {
    const { injectNavbarIcon } = await import(
      "https://goswami34.github.io/squareCraft-widget/injectNavbarIcon.js"
    );
    injectNavbarIcon();
  } catch (error) {
    console.error("🚨 Failed to load navbar icon script", error);
  }

  const { loadCSS } = await import(
    "https://goswami34.github.io/squareCraft-widget/src/utils/loadCSS.js"
  );

  loadCSS(
    "https://goswami34.github.io/squareCraft-widget/src/styles/parent.css",
    "sc_parentCSS"
  );

  async function createWidget() {
    try {
      let cachedWidget = localStorage.getItem("sc_widget");
      let lastFetched = localStorage.getItem("sc_widget_timestamp");
      let oneDay = 24 * 60 * 60 * 1000;
      let now = Date.now();

      if (cachedWidget && lastFetched && now - lastFetched < oneDay) {
        loadWidgetFromString(cachedWidget);
        return;
      }
      const module = await import(
        "https://goswami34.github.io/squareCraft-widget/html.js"
      );

      if (module && module.html) {
        const htmlString = module.html();

        if (typeof htmlString === "string" && htmlString.trim().length > 0) {
          localStorage.setItem("sc_widget", htmlString);
          localStorage.setItem("sc_widget_timestamp", now.toString());
          loadWidgetFromString(htmlString);

          setTimeout(() => {
            if (typeof module.initToggleSwitch === "function") {
              module.initToggleSwitch();
            }
          }, 200);
        } else {
          console.error("❌ Retrieved HTML string is invalid or empty!");
        }
      }
    } catch (error) {
      console.error("🚨 Error loading HTML module:", error);
    }
  }

  function loadWidgetFromString(htmlString) {
    if (!widgetContainer) {
      widgetContainer = document.createElement("div");
      widgetContainer.id = "sc-widget-container";
      widgetContainer.classList.add(
        "sc-fixed",
        "sc-text-color-white",
        "sc-universal",
        "sc-z-9999"
      );
      widgetContainer.innerHTML = htmlString;
      widgetContainer.style.display = "none";
      document.body.appendChild(widgetContainer);
      makeWidgetDraggable();
      widgetLoaded = true;

      setTimeout(() => {
        widgetContainer = document.getElementById("sc-widget-container");
        if (!widgetContainer) {
          console.error("❌ Widget container failed to load.");
        }
      }, 500);
    }
  }

  async function toggleWidgetVisibility(event) {
    event.stopPropagation();

    if (!widgetLoaded) {
      await createWidget();
    }

    if (widgetContainer) {
      widgetContainer.style.display =
        widgetContainer.style.display === "none" ? "block" : "none";
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

      if (!draggableElement || event.target.closest(".sc-dropdown")) {
        return;
      }

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

      let newX = clientX - offsetX;
      let newY = clientY - offsetY;

      let maxX = window.innerWidth - widgetContainer.offsetWidth;
      let maxY = window.innerHeight - widgetContainer.offsetHeight;

      newX = Math.max(0, Math.min(maxX, newX));
      newY = Math.max(0, Math.min(maxY, newY));

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
    function injectIconIntoTargetElements() {
      const targets = parent.document.querySelectorAll(
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
        clonedIcon.style.width = "35px";
        clonedIcon.style.height = "35px";
        clonedIcon.style.borderRadius = "20%";
        clonedIcon.style.cursor = "pointer";
        clonedIcon.style.backgroundColor = "white";
        clonedIcon.style.marginLeft = "6px";
        deleteButton.parentNode.insertBefore(
          clonedIcon,
          deleteButton.nextSibling
        );

        clonedIcon.addEventListener("click", function (event) {
          event.stopPropagation();
          event.preventDefault();

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

    setTimeout(() => {
      injectIconIntoTargetElements();
    }, 1000);
    injectIconIntoTargetElements();

    const observer = new MutationObserver(() => {
      injectIconIntoTargetElements();
    });
    observer.observe(parent.document.body, { childList: true, subtree: true });
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

  fetchModifications();

  function moveWidgetToDesktop() {
    if (!widgetContainer) return;

    document.body.appendChild(widgetContainer);
  }

  checkView();
  window.addEventListener("resize", checkView);
})();
