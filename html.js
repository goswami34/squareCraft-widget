import {
  getToggleState,
  setToggleState,
} from "https://goswami34.github.io/squareCraft-widget/toggleState.js";
import { WidgetTypoSection } from "https://goswami34.github.io/squareCraft-widget/src/components/WidgetTypoSection/WidgetTypoSection.js";
import { WidgetImageSection } from "https://goswami34.github.io/squareCraft-widget/src/components/WidgetImageSection/WidgetImageSection.js";
import { WidgetTypoAdvanceSection } from "https://goswami34.github.io/squareCraft-widget/src/components/WidgetTypoSection/WidgetTypoAdvanceSection/WidgetTypoAdvanceSection.js";
import { WidgetImageAdvanceSection } from "https://goswami34.github.io/squareCraft-widget/src/components/WidgetImageSection/WidgetImageAdvanceSection/WidgetImageAdvanceSection.js";
import { WidgetButtonSection } from "https://goswami34.github.io/squareCraft-widget/src/button/WidgetButtonSection/WidgetButtonSection.js";
import { WidgetButtonPresetSection } from "https://goswami34.github.io/squareCraft-widget/src/button/WidgetButtonSection/WidgetButtonPresetSection/WidgetButtonPresetSection.js";
import { WidgetImagePresetSection } from "https://goswami34.github.io/squareCraft-widget/src/components/WidgetImageSection/WidgetImagePresetSection/WidgetImagePresetSection.js";
import { WidgetTypoPresetSection } from "https://goswami34.github.io/squareCraft-widget/src/components/WidgetTypoSection/WidgetTypoPresetSection/WidgetTypoPresetSection.js";
import { WidgetButtonAdvanceSection } from "https://goswami34.github.io/squareCraft-widget/src/button/WidgetButtonSection/WidgetButtonAdvanceSection/WidgetButtonAdvanceSection.js";

export function html() {
  const htmlString = `
    <div class="sc-p-2  z-index-high sc-text-color-white sc-border sc-border-solid sc-border-3d3d3d sc-bg-color-2c2c2c sc-rounded-15px sc-w-300px">
      <div id="sc-grabbing" class="sc-cursor-grabbing sc-w-full">
      <div class="sc-flex sc-roboto sc-universal sc-items-center sc-justify-between">
      <img class="sc-cursor-grabbing sc-universal" src="https://i.ibb.co.com/pry1mVGD/Group-28-1.png" width="140px" />
      </div>
      <div class="sc-mt-4">
      <p class="sc-font-size-12  sc-universal sc-roboto sc-font-light">Powerful Visual Editor for Customizing Squarespace Text Styles in Real-Time. </p>
      </div>
      </div>
      <div class="sc-mt-6 sc-roboto sc-border-t sc-border-t-dashed sc-border-color-494949  sc-w-full"></div>
      <div class="sc-mt-6 sc-h-12 sc-roboto sc-flex  sc-items-center sc-universal">
      <p id="design-tab" class="sc-font-size-12 sc-px-4 sc-cursor-pointer tabHeader ">Design</p>
      <p id="advanced-tab" class="sc-font-size-12 sc-px-4 sc-cursor-pointer tabHeader">Advanced</p>
      <p id="preset-tab" class="sc-font-size-12 sc-px-4 sc-cursor-pointer tabHeader">Presets</p>
      </div>
      <div class="sc-border-t sc-border-solid sc-relative  sc-border-color-494949 sc-w-full">
      <div class="sc-absolute sc-top-0 sc-left-0 sc-bg-color-EF7C2F sc-w-16 sc-h-1px sc-tab-active-indicator"></div>
      </div>
      <div id="tabContentWrapper" class="sc-rounded-4px sc-h-350 sc-scrollBar sc-mt-6 sc-border sc-border-solid sc-border-EF7C2F sc-bg-color-3d3d3d">
      <div id="designTab"> 
        ${WidgetTypoSection("typoSection")} 
        ${WidgetImageSection("imageSection")} 
        ${WidgetButtonSection("buttonSection")} 
      </div>

      <div id="advancedTab" class="sc-hidden">
      <div id="advancedButtonSection">${WidgetButtonAdvanceSection()}</div>
      <div id="advancedTypoSection">${WidgetTypoAdvanceSection()}</div>
      <div id="advancedImageSection">${WidgetImageAdvanceSection()}</div>
      </div>

      <div id="presetsTab" class="sc-hidden">
      <div id="presetButtonSection">${WidgetButtonPresetSection()}</div>
      <div id="presetTypoSection">${WidgetTypoPresetSection()}</div>
      <div id="presetImageSection">${WidgetImagePresetSection()}</div>
      </div>

      </div>
      <div class="sc-mt-3">
      <div class="sc-flex  sc-items-center sc-justify-between sc-gap-2">
      <div id="publish" class="sc-cursor-pointer sc-roboto sc-bg-color-EF7C2F sc-w-full sc-font-light sc-flex sc-items-center sc-font-size-12 sc-py-1 sc-rounded-4px sc-text-color-white sc-justify-center"> Publish </div>
      <div class="sc-cursor-pointer sc-roboto sc-bg-3f3f3f sc-w-full sc-text-color-white sc-font-light sc-flex sc-font-size-12 sc-py-1 sc-rounded-4px sc-items-center sc-justify-center"> Reset </div>
      </div>
      </div>
    </div>
`;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const isValidHTML = doc.body.children.length > 0;

  if (!isValidHTML) {
    console.error("❌ Error: Invalid HTML structure!");
    return "❌ Error: Invalid HTML structure!";
  }

  document.addEventListener("DOMContentLoaded", async function () {
    function addHeadingEventListeners() {
      const heading1 = document.getElementById("heading1");
      if (heading1) {
        heading1.addEventListener("mouseover", () => {});

        heading1.addEventListener("click", () => {});
      } else {
        console.error("❌ heading1 not found in DOM!");
      }
    }

    setTimeout(addHeadingEventListeners, 1000);
  });

  return htmlString;
}

let pageId = document
  .querySelector("article[data-page-sections]")
  ?.getAttribute("data-page-sections");

export async function saveModifications(blockId, css, tagType) {
  if (!pageId || !blockId || !css) {
    console.warn("⚠️ Missing required data to save modifications.");
    return {
      success: false,
      error: "Missing required data",
    };
  }

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  if (!userId || !token || !widgetId) {
    console.warn("⚠️ Missing authentication data");
    return {
      success: false,
      error: "Missing authentication data",
    };
  }

  const modificationData = {
    userId,
    token,
    widgetId,
    modifications: [
      {
        pageId,
        elements: [
          {
            elementId: blockId,
            css: {
              strong: {
                id: blockId,
                ...css,
              },
            },
            elementStructure: {
              type: "strong",
              content: document.getElementById(blockId)?.textContent || "",
              parentId:
                document.getElementById(blockId)?.parentElement?.id || null,
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
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(modificationData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    const result = await response.json();
    console.log("✅ Changes Saved Successfully!", result);

    showNotification("Changes saved successfully!", "success");

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error("❌ Error saving modifications:", error);
    showNotification(`Failed to save changes: ${error.message}`, "error");

    return {
      success: false,
      error: error.message,
    };
  }
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `sc-notification sc-notification-${type}`;
  notification.textContent = message;

  // Add styles
  Object.assign(notification.style, {
    position: "fixed",
    top: "20px",
    right: "20px",
    padding: "10px 20px",
    borderRadius: "4px",
    color: "white",
    zIndex: "9999",
    animation: "fadeIn 0.3s ease-in-out",
    backgroundColor:
      type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3",
  });

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.animation = "fadeOut 0.3s ease-in-out";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

export function initToggleSwitch() {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const toggleText = document.getElementById("toggleText");
  const toggleBullet = toggleSwitch?.querySelector(".toggle-bullet");
  if (!toggleSwitch || !toggleText || !toggleBullet) {
    console.log(":hourglass_flowing_sand: Waiting for toggle elements...");
    return;
  }
  let isEnabled = getToggleState();
  const updateToggleUI = () => {
    if (!toggleSwitch || !toggleBullet || !toggleText) return;
    if (isEnabled) {
      toggleSwitch.style.backgroundColor = "#EF7C2F";
      toggleBullet.style.left = "auto";
      toggleBullet.style.right = "1.5px";
      toggleText.textContent = "Enable";
    } else {
      toggleSwitch.style.backgroundColor = "#747372";
      toggleBullet.style.left = "2px";
      toggleBullet.style.right = "auto";
      toggleText.textContent = "Disable";
    }
  };
  updateToggleUI();
  toggleSwitch.addEventListener("click", () => {
    isEnabled = !isEnabled;
    setToggleState(isEnabled);
    updateToggleUI();
  });
}

// Add this new function to handle publish button click
async function handlePublish() {
  // Check if there are any pending modifications
  if (
    typeof window.pendingModifications === "undefined" ||
    window.pendingModifications.size === 0
  ) {
    showNotification("No changes to publish", "info");
    return;
  }

  try {
    console.log(
      "🔄 Publishing pending modifications:",
      window.pendingModifications
    );

    // Debug: Log all entries in pendingModifications
    if (window.pendingModifications.size > 0) {
      console.log("🔍 All pending modifications:");
      for (const [
        blockId,
        modifications,
      ] of window.pendingModifications.entries()) {
        console.log(`Block ${blockId}:`, modifications);
      }
    }

    // Save each pending modification
    for (const [
      blockId,
      modifications,
    ] of window.pendingModifications.entries()) {
      for (const mod of modifications) {
        let result;

        switch (mod.tagType) {
          case "image":
            result = await saveModificationsforImage(
              blockId,
              mod.css,
              mod.tagType
            );
            break;
          case "imageShadow":
            result = await saveImageShadowModifications(blockId, mod.css);
            break;
          case "imageOverlay":
            result = await saveImageOverlayModifications(blockId, mod.css);
            break;
          // ✅ ADD TYPOGRAPHY CASES HERE
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
            result = await saveTypographyAllModifications(
              blockId,
              mod.css,
              mod.target || mod.textType
            );
            console.log("✅ Typography modification result:", result);
            break;
          case "strong":
          case "linkText":
          case "typography":
          case "fontFamily":
          case "fontSize":
          case "fontWeight":
          case "textColor":
          case "textAlign":
          case "lineHeight":
          case "letterSpacing":
          case "textTransform":
          case "textHighlight":
          case "font":
            // Check if this is button font data by looking at the CSS structure
            if (
              mod.css &&
              (mod.css.buttonPrimary ||
                mod.css.buttonSecondary ||
                mod.css.buttonTertiary)
            ) {
              // This is button font data - use button-specific save function
              result = await saveButtonModifications(blockId, mod.css);
            } else {
              // This is general font data - use general save function
              result = await saveModifications(blockId, mod.css, mod.tagType);
            }
            break;
          case "button":
            result = await saveButtonModifications(blockId, mod.css);
            break;
          case "buttonShadow":
            result = await saveButtonShadowModifications(blockId, mod.css);
            break;
          case "buttonBorder":
            result = await saveButtonBorderModifications(blockId, mod.css);
            break;
          case "buttonHoverBorder":
            result = await saveButtonHoverBorderModifications(blockId, mod.css);
            break;
          case "buttonColor":
            result = await saveButtonColorModifications(blockId, mod.css);
            break;
          case "buttonIcon":
            console.log(
              "🚀 Publishing button icon modifications for block:",
              blockId
            );
            console.log("📤 Icon data being sent:", mod.css);
            result = await saveButtonIconModifications(blockId, mod.css);
            break;
          case "buttonHoverColor":
            console.log(
              "🎨 Publishing button hover color modifications for block:",
              blockId
            );
            console.log("📤 Hover color data being sent:", mod.css);
            result = await saveButtonHoverColorModifications(blockId, mod.css);
            break;
          case "buttonHoverIcon":
            console.log(
              "🎨 Publishing button hover icon modifications for block:",
              blockId
            );
            console.log("📤 Hover icon data being sent:", mod.css);
            result = await saveButtonHoverIconModifications(blockId, mod.css);
            break;
          case "buttonHoverEffect":
            console.log(
              "🎨 Publishing button hover effect modifications for block:",
              blockId
            );
            console.log("📤 Hover effect data being sent:", mod.css);
            result = await saveButtonHoverEffectModifications(blockId, mod.css);
            break;
          case "linkText":
            result = await saveLinkTextModifications(blockId, mod.css);
            break;
          default:
            console.warn(
              "❌ Unknown tagType in pendingModifications:",
              mod.tagType
            );
            continue;
        }

        if (!result?.success) {
          throw new Error(`Failed to save changes for block ${blockId}`);
        }
      }
    }

    // Clear pending modifications after successful save
    window.pendingModifications.clear();
    showNotification("All changes published successfully!", "success");
  } catch (error) {
    console.error("❌ Error in handlePublish:", error);
    showNotification(error.message, "error");
  }
}

export async function saveTypographyAllModifications(blockId, css, textType) {
  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  if (!pageId || !blockId || !css || !textType) {
    console.warn("⚠️ Missing required data for typography all modifications", {
      pageId,
      blockId,
      css,
      textType,
    });
    return { success: false, error: "Missing required data" };
  }

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  if (!userId || !token || !widgetId) {
    console.warn("⚠️ Missing authentication data");
    return { success: false, error: "Missing authentication data" };
  }

  // Clean invalid styles and format them
  const cleanedCss = cleanCssObject(css);
  const kebabCss = toKebabCaseStyleObject(cleanedCss);

  if (Object.keys(kebabCss).length === 0) {
    console.warn("⚠️ No valid typography styles to save");
    return { success: false, error: "No valid styles to save" };
  }

  const selector =
    textType === "heading1"
      ? `#${blockId} h1`
      : textType === "heading2"
      ? `#${blockId} h2`
      : textType === "heading3"
      ? `#${blockId} h3`
      : textType === "heading4"
      ? `#${blockId} h4`
      : textType === "paragraph1"
      ? `#${blockId} p.sqsrte-large`
      : textType === "paragraph2"
      ? `#${blockId} p:not(.sqsrte-large):not(.sqsrte-small)`
      : textType === "paragraph3"
      ? `#${blockId} p.sqsrte-small`
      : `#${blockId} *`;

  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    textType,
    css: {
      selector,
      styles: kebabCss,
    },
  };

  try {
    console.log(
      "📤 Sending typography payload:",
      JSON.stringify(payload, null, 2)
    );
    console.log("🌐 Making API request to save typography modifications...");

    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-typography-all-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("📡 Response status:", response.status);
    console.log(
      "📡 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    console.log("✅ Typography all modifications saved:", result);
    showNotification("Typography styles saved successfully!", "success");

    return { success: true, data: result };
  } catch (err) {
    console.error("❌ Error saving typography modifications:", err);
    showNotification(`Failed to save changes: ${err.message}`, "error");
    return { success: false, error: err.message };
  }
}

// Only set handlePublish globally if it doesn't already exist
// This prevents overwriting the handlePublish from squareCraft.js
if (!window.handlePublish) {
  window.handlePublish = handlePublish;
  console.log("✅ html.js handlePublish set globally");
} else {
  console.log("ℹ️ handlePublish already exists, using existing one");
}

export function initPublishButton() {
  const publishButton = document.getElementById("publish");
  if (!publishButton) {
    console.warn("Publish button not found");
    return;
  }

  publishButton.addEventListener("click", async () => {
    try {
      // Show loading state
      publishButton.disabled = true;
      publishButton.textContent = "Publishing...";

      await handlePublish();
    } catch (error) {
      showNotification(error.message, "error");
    } finally {
      // Reset button state
      publishButton.disabled = false;
      publishButton.textContent = "Publish";
    }
  });
}

// function toKebabCaseStyleObject(obj) {
//   return Object.fromEntries(
//     Object.entries(obj).map(([key, value]) => {
//       const kebabKey = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
//       return [kebabKey, value];
//     })
//   );
// }
function toKebabCaseStyleObject(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => {
      const kebabKey = key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
      return [kebabKey, value];
    })
  );
}

function cleanCssObject(css = {}) {
  return Object.fromEntries(
    Object.entries(css).filter(
      ([_, value]) =>
        value !== null &&
        value !== undefined &&
        value !== "" &&
        value !== "null"
    )
  );
}

export async function saveModificationsforImage(blockId, css, tagType) {
  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  if (!pageId || !blockId || !css || typeof css !== "object") {
    console.warn("⚠️ Missing required data for image modifications", {
      pageId,
      blockId,
      css,
    });
    return { success: false, error: "Missing required data" };
  }

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  if (!userId || !token || !widgetId) {
    console.warn("⚠️ Missing authentication data");
    return { success: false, error: "Missing authentication data" };
  }

  // ✅ Check if css has nested `image.styles` or is raw styles directly
  const rawCss = css?.image?.styles || css;
  const selector = css?.image?.selector || `#${blockId} div.sqs-image-content`;

  // ✅ Clean invalid values
  const cleanedCss = cleanCssObject(rawCss);

  if (Object.keys(cleanedCss).length === 0) {
    console.warn("⚠️ No valid styles to save");
    return { success: false, error: "No valid styles to save" };
  }

  // ✅ Convert camelCase → kebab-case
  const kebabCss = toKebabCaseStyleObject(cleanedCss);

  const imageSelector = `#siteWrapper #${blockId} .sqs-image-content img`;
  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    css: {
      image: {
        selector,
        styles: kebabCss,
      },
      imageTag: {
        selector: imageSelector,
        styles: {
          "box-sizing": "border-box",
          "object-fit": "cover",
        },
      },
    },
  };

  console.log("📤 Final image payload being sent:", payload);

  try {
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/Image-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    console.log("✅ Image modifications saved:", result);
    showNotification("Image styles saved successfully!", "success");

    return { success: true, data: result };
  } catch (err) {
    console.error("❌ Error saving image modifications:", err);
    showNotification(`Failed to save changes: ${err.message}`, "error");
    return { success: false, error: err.message };
  }
}

export async function saveImageOverlayModifications(blockId, css) {
  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");
  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  // Ensure content is included in the styles
  const stylesWithContent = {
    ...css,
    content: " ", // Always include content property
  };

  // Detailed debug log
  console.log("[DEBUG] Overlay Save Fields:", {
    userId,
    token,
    widgetId,
    pageId,
    blockId,
    css: stylesWithContent, // Log the modified css
  });

  const selector = `#${blockId} .sqs-image-content > :nth-child(-n+2)::before`;
  const kebabCss = toKebabCaseStyleObject(stylesWithContent);

  // FLAT PAYLOAD for backend
  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    selector,
    styles: kebabCss,
  };

  // Log the final payload
  console.log(
    "[DEBUG] Final overlay payload:",
    JSON.stringify(payload, null, 2)
  );

  if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
    console.warn("❌ Missing required fields", {
      userId,
      token,
      widgetId,
      pageId,
      blockId,
      css,
    });
    return { success: false, error: "Missing required data" };
  }

  try {
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-image-overlay-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    console.log("✅ Overlay styles saved:", result);
    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error saving overlay styles:", error);
    return { success: false, error: error.message };
  }
}

// ✅ Image Overlay Controls end here

export async function saveImageShadowModifications(blockId, css) {
  console.log("[API] saveImageShadowModifications called with:", {
    blockId,
    css,
  });
  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
    console.warn("❌ Missing required data to save shadow styles", {
      userId,
      token,
      widgetId,
      pageId,
      blockId,
      css,
    });
    return { success: false, error: "Missing required data" };
  }

  // ✅ Extract & clean image styles
  const rawStyles = css?.image?.styles || css;
  const selector = css?.image?.selector || `#${blockId} div.sqs-image-content`;

  const cleanedStyles = cleanCssObject(rawStyles);
  if (Object.keys(cleanedStyles).length === 0) {
    return { success: false, error: "No valid shadow styles to save" };
  }

  const kebabCss = toKebabCaseStyleObject(cleanedStyles);

  // ✅ Exact selector you want:
  const imageTagSelector = `#siteWrapper #${blockId} .intrinsic, #siteWrapper #${blockId} .sqs-image`;

  const imageTagStyles = toKebabCaseStyleObject({
    overflow: "visible",
  });

  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    css: {
      image: {
        selector,
        styles: kebabCss,
      },
      imageTag: {
        selector: imageTagSelector,
        styles: imageTagStyles,
      },
    },
  };

  console.log("📤 Sending shadow payload:", payload);

  try {
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-image-shadow-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    console.log("✅ Shadow styles saved:", result);
    showNotification("Image shadow styles saved successfully!", "success");

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error saving image shadow styles:", error);
    showNotification(`Failed to save shadow: ${error.message}`, "error");

    return { success: false, error: error.message };
  }
}

// image shadow code end here

//button save modification start here
export async function saveButtonModifications(blockId, css) {
  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
    console.warn("❌ Missing required data to save button styles", {
      userId,
      token,
      widgetId,
      pageId,
      blockId,
      css,
    });
    return { success: false, error: "Missing required data" };
  }

  // ✅ Clean and normalize each button type
  const cleanCssObject = (rawCss = {}) =>
    Object.fromEntries(
      Object.entries(rawCss).filter(
        ([_, value]) =>
          value !== null &&
          value !== undefined &&
          value !== "" &&
          value !== "null"
      )
    );

  const toKebabCase = (obj) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        value,
      ])
    );

  const cleanedPrimary = css.buttonPrimary
    ? {
        selector: css.buttonPrimary.selector || ".sqs-button-element--primary",
        styles: toKebabCase(cleanCssObject(css.buttonPrimary.styles || {})),
      }
    : { selector: null, styles: {} };

  const cleanedSecondary = css.buttonSecondary
    ? {
        selector:
          css.buttonSecondary.selector || ".sqs-button-element--secondary",
        styles: toKebabCase(cleanCssObject(css.buttonSecondary.styles || {})),
      }
    : { selector: null, styles: {} };

  const cleanedTertiary = css.buttonTertiary
    ? {
        selector:
          css.buttonTertiary.selector || ".sqs-button-element--tertiary",
        styles: toKebabCase(cleanCssObject(css.buttonTertiary.styles || {})),
      }
    : { selector: null, styles: {} };

  // ✅ At least one valid style
  const isEmpty =
    Object.keys(cleanedPrimary.styles).length === 0 &&
    Object.keys(cleanedSecondary.styles).length === 0 &&
    Object.keys(cleanedTertiary.styles).length === 0;

  if (isEmpty) {
    console.warn("⚠️ No valid button styles to save");
    return { success: false, error: "No valid button styles to save" };
  }

  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    css: {
      buttonPrimary: cleanedPrimary,
      buttonSecondary: cleanedSecondary,
      buttonTertiary: cleanedTertiary,
    },
  };

  console.log("📤 Sending button style payload:", payload);

  try {
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-button-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    console.log("✅ Button styles saved:", result);
    showNotification("Button styles saved successfully!", "success");

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error saving button styles:", error);
    showNotification(`Failed to save button styles: ${error.message}`, "error");

    return { success: false, error: error.message };
  }
}

//button save modification end here

// button color save modification start here
export async function saveButtonColorModifications(blockId, css) {
  console.log("🚀 saveButtonColorModifications called with:", { blockId, css });

  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  console.log("📋 Required data check:", {
    userId: !!userId,
    token: !!token,
    widgetId: !!widgetId,
    pageId: !!pageId,
    blockId: !!blockId,
    css: !!css,
  });

  if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
    console.warn(
      "❌ Missing required data to save button color modifications",
      {
        userId,
        token,
        widgetId,
        pageId,
        blockId,
        css,
      }
    );
    return { success: false, error: "Missing required data" };
  }

  // Clean & normalize button styles and convert to kebab-case
  const cleanCssObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== null && v !== undefined && v !== "" && v !== "null"
      )
    );

  const toKebabCaseStyleObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        value,
      ])
    );

  const cleanCss = (block) => ({
    selector: block?.selector || null,
    styles: toKebabCaseStyleObject(cleanCssObject(block?.styles || {})),
  });

  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    css: {
      buttonPrimary: cleanCss(css.buttonPrimary),
      buttonSecondary: cleanCss(css.buttonSecondary),
      buttonTertiary: cleanCss(css.buttonTertiary),
    },
  };

  console.log("📤 Sending button color payload:", payload);
  console.log("🔍 Original CSS received:", css);
  console.log("🧹 Cleaned CSS structure:", {
    buttonPrimary: cleanCss(css.buttonPrimary),
    buttonSecondary: cleanCss(css.buttonSecondary),
    buttonTertiary: cleanCss(css.buttonTertiary),
  });

  try {
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-button-color-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    console.log("✅ Button color modifications saved:", result);
    showNotification("Button colors saved successfully!", "success");

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error saving button color modifications:", error);
    showNotification(`Failed to save button colors: ${error.message}`, "error");

    return { success: false, error: error.message };
  }
}

// button color save modification end here

//button border save modification start here
export async function saveButtonBorderModifications(blockId, css) {
  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
    console.warn("❌ Missing required data to save button border styles", {
      userId,
      token,
      widgetId,
      pageId,
      blockId,
      css,
    });
    return { success: false, error: "Missing required data" };
  }

  // Clean & normalize button styles for all button types
  const cleanCssObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== null && v !== undefined && v !== "" && v !== "null"
      )
    );

  const toKebabCaseStyleObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        value,
      ])
    );

  // ✅ FIXED: Handle all button types dynamically
  const cleanedCss = {};
  let hasValidStyles = false;

  // Process buttonPrimary
  if (
    css.buttonPrimary &&
    Object.keys(css.buttonPrimary.styles || {}).length > 0
  ) {
    cleanedCss.buttonPrimary = {
      selector: css.buttonPrimary.selector || ".sqs-button-element--primary",
      styles: toKebabCaseStyleObject(
        cleanCssObject(css.buttonPrimary.styles || {})
      ),
    };
    hasValidStyles = true;
  }

  // Process buttonSecondary
  if (
    css.buttonSecondary &&
    Object.keys(css.buttonSecondary.styles || {}).length > 0
  ) {
    cleanedCss.buttonSecondary = {
      selector:
        css.buttonSecondary.selector || ".sqs-button-element--secondary",
      styles: toKebabCaseStyleObject(
        cleanCssObject(css.buttonSecondary.styles || {})
      ),
    };
    hasValidStyles = true;
  }

  // Process buttonTertiary
  if (
    css.buttonTertiary &&
    Object.keys(css.buttonTertiary.styles || {}).length > 0
  ) {
    cleanedCss.buttonTertiary = {
      selector: css.buttonTertiary.selector || ".sqs-button-element--tertiary",
      styles: toKebabCaseStyleObject(
        cleanCssObject(css.buttonTertiary.styles || {})
      ),
    };
    hasValidStyles = true;
  }

  if (!hasValidStyles) {
    console.warn("⚠️ No valid border styles found in any button type.");
    return { success: false, error: "No valid border styles to save" };
  }

  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    css: cleanedCss,
  };

  console.log("📤 Sending button border payload:", {
    ...payload,
    buttonTypes: Object.keys(cleanedCss),
    totalStyles: Object.values(cleanedCss).reduce(
      (sum, btn) => sum + Object.keys(btn.styles).length,
      0
    ),
  });

  try {
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-button-border-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    console.log("✅ Button border styles saved:", result);
    showNotification("Button border styles saved successfully!", "success");

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error saving button border styles:", error);
    showNotification(
      `Failed to save button border styles: ${error.message}`,
      "error"
    );
    return { success: false, error: error.message };
  }
}
//button border save modification end here

// button icon save modification code start here
// export async function saveButtonIconModifications(blockId, css) {
//   console.log("🚀 saveButtonIconModifications called with:", { blockId, css });

//   const pageId = document
//     .querySelector("article[data-page-sections]")
//     ?.getAttribute("data-page-sections");

//   const userId = localStorage.getItem("sc_u_id");
//   const token = localStorage.getItem("sc_auth_token");
//   const widgetId = localStorage.getItem("sc_w_id");

//   if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
//     console.warn("❌ Missing required data to save button icon modifications", {
//       userId,
//       token,
//       widgetId,
//       pageId,
//       blockId,
//       css,
//     });
//     return { success: false, error: "Missing required data" };
//   }

//   // Clean & normalize CSS
//   const cleanCssObject = (obj = {}) =>
//     Object.fromEntries(
//       Object.entries(obj).filter(
//         ([_, v]) => v !== null && v !== undefined && v !== "" && v !== "null"
//       )
//     );

//   const toKebabCaseStyleObject = (obj = {}) =>
//     Object.fromEntries(
//       Object.entries(obj).map(([key, value]) => [
//         key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
//         value,
//       ])
//     );

//   // Determine button type from the CSS structure
//   let buttonType = "tertiary"; // default
//   if (css?.buttonType) {
//     buttonType = css.buttonType;
//   } else if (
//     css?.iconProperties?.selector?.includes("primary") ||
//     css?.icon?.selector?.includes("primary")
//   ) {
//     buttonType = "primary";
//   } else if (
//     css?.iconProperties?.selector?.includes("secondary") ||
//     css?.icon?.selector?.includes("secondary")
//   ) {
//     buttonType = "secondary";
//   } else if (
//     css?.iconProperties?.selector?.includes("tertiary") ||
//     css?.icon?.selector?.includes("tertiary")
//   ) {
//     buttonType = "tertiary";
//   }

//   // Extract icon properties from CSS
//   const iconProperties = {
//     selector:
//       css?.iconProperties?.selector ||
//       css?.icon?.selector ||
//       `.sqs-button-element--${buttonType} .sqscraft-button-icon`,
//     styles: toKebabCaseStyleObject(
//       cleanCssObject(css?.iconProperties?.styles || css?.icon?.styles || {})
//     ),
//   };

//   // Add iconData if it exists (for uploaded icons)
//   if (css?.iconProperties?.iconData) {
//     iconProperties.iconData = css.iconProperties.iconData;
//   } else if (css?.icon?.iconData) {
//     iconProperties.iconData = css.icon.iconData;
//   }

//   // Log the extracted properties for debugging
//   console.log("🔍 Extracted icon properties:", iconProperties);

//   // Check if we should apply to all types
//   // Apply only if explicitly true, otherwise false
//   const applyToAllTypes = css?.applyToAllTypes ?? false;

//   // Structure the payload to match server expectations
//   const payload = {
//     userId,
//     token,
//     widgetId,
//     pageId,
//     elementId: blockId,
//     iconProperties,
//     buttonType,
//     applyToAllTypes: applyToAllTypes,
//   };

//   // Validate that we have valid icon properties to save
//   console.log("🔍 Icon properties to validate:", iconProperties);
//   console.log("🔍 CSS received:", css);

//   // Check if we have either styles or iconData to save
//   const hasStyles = Object.keys(iconProperties.styles).length > 0;
//   const hasIconData =
//     iconProperties.iconData && Object.keys(iconProperties.iconData).length > 0;

//   // More lenient validation - allow saving even with minimal data
//   if (!iconProperties.selector) {
//     console.warn("⚠️ No selector found in icon properties:", iconProperties);
//     return { success: false, error: "No selector found in icon properties" };
//   }

//   // If we have no styles and no iconData, still allow the save but log a warning
//   if (!hasStyles && !hasIconData) {
//     console.warn(
//       "⚠️ No styles or iconData found, but proceeding with save:",
//       iconProperties
//     );
//   }

//   console.log(
//     "📤 Sending button icon payload:",
//     JSON.stringify(payload, null, 2)
//   );

//   try {
//     console.log("🌐 Making API request to save button icon modifications...");
//     const response = await fetch(
//       "https://admin.squareplugin.com/api/v1/save-button-icon-modifications",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     console.log("📡 Response status:", response.status);
//     console.log(
//       "📡 Response headers:",
//       Object.fromEntries(response.headers.entries())
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       console.error("❌ Server error response:", result);
//       console.error("❌ Full error details:", {
//         status: response.status,
//         statusText: response.statusText,
//         url: response.url,
//         result: result,
//       });
//       throw new Error(
//         result.message || result.error || `HTTP ${response.status}`
//       );
//     }

//     console.log("✅ Button icon modifications saved:", result);
//     showNotification("Button icon styles saved successfully!", "success");

//     return { success: true, data: result };
//   } catch (error) {
//     console.error("❌ Error saving button icon modifications:", error);
//     showNotification(
//       `Failed to save button icon styles: ${error.message}`,
//       "error"
//     );

//     return { success: false, error: error.message };
//   }
// }

export async function saveButtonIconModifications(blockId, css) {
  console.log("🚀 saveButtonIconModifications called with:", { blockId, css });

  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
    console.log("❌ Missing required data to save button icon modifications", {
      userId,
      token,
      widgetId,
      pageId,
      blockId,
      css,
    });
    return { success: false, error: "Missing required data" };
  }

  // Clean & normalize CSS
  const cleanCssObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== null && v !== undefined && v !== "" && v !== "null"
      )
    );

  const toKebabCaseStyleObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        value,
      ])
    );

  // Determine button type from the CSS structure
  let buttonType = "tertiary"; // default
  if (css?.buttonType) {
    buttonType = css.buttonType;
  } else if (
    css?.iconProperties?.selector?.includes("primary") ||
    css?.icon?.selector?.includes("primary")
  ) {
    buttonType = "primary";
  } else if (
    css?.iconProperties?.selector?.includes("secondary") ||
    css?.icon?.selector?.includes("secondary")
  ) {
    buttonType = "secondary";
  } else if (
    css?.iconProperties?.selector?.includes("tertiary") ||
    css?.icon?.selector?.includes("tertiary")
  ) {
    buttonType = "tertiary";
  }

  // Extract icon properties from CSS
  const iconProperties = {
    selector:
      css?.iconProperties?.selector ||
      css?.icon?.selector ||
      `.sqs-button-element--${buttonType} .sqscraft-button-icon`,
    styles: toKebabCaseStyleObject(
      cleanCssObject(css?.iconProperties?.styles || css?.icon?.styles || {})
    ),
  };

  // Optimize iconData to reduce payload size
  if (css?.iconProperties?.iconData || css?.icon?.iconData) {
    const iconData = css?.iconProperties?.iconData || css?.icon?.iconData;

    // If iconData is base64, compress it or store reference only
    if (iconData.data && iconData.data.startsWith("data:image/")) {
      // Option 1: Store only essential metadata and compress
      iconProperties.iconData = {
        type: iconData.type || "image/svg+xml",
        width: iconData.width,
        height: iconData.height,
        // Store compressed data or just the reference
        data:
          iconData.data.length > 100000
            ? iconData.data.substring(0, 100000) + "..." // Truncate if too large
            : iconData.data,
      };
    } else {
      // Store as is if not base64
      iconProperties.iconData = iconData;
    }
  }

  // Log the extracted properties for debugging
  console.log("🔍 Extracted icon properties:", iconProperties);

  // Check if we should apply to all types
  const applyToAllTypes = css?.applyToAllTypes ?? false;

  // Structure the payload to match server expectations
  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    iconProperties,
    buttonType,
    applyToAllTypes: applyToAllTypes,
  };

  // Validate payload size before sending
  const payloadSize = JSON.stringify(payload).length;
  const maxSize = 10 * 1024 * 1024; // 10MB limit

  if (payloadSize > maxSize) {
    console.warn("⚠️ Payload too large:", payloadSize, "bytes");

    // Remove iconData if payload is too large
    if (iconProperties.iconData) {
      delete iconProperties.iconData;
      console.log("🗑️ Removed iconData to reduce payload size");
    }

    // Recalculate payload size
    const newPayloadSize = JSON.stringify(payload).length;
    if (newPayloadSize > maxSize) {
      return {
        success: false,
        error: `Payload too large: ${newPayloadSize} bytes. Please reduce icon size.`,
      };
    }
  }

  console.log("📤 Sending button icon payload:", {
    size: JSON.stringify(payload).length,
    buttonType,
    applyToAllTypes,
  });

  try {
    console.log("�� Making API request to save button icon modifications...");
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-button-icon-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("�� Response status:", response.status);

    if (!response.ok) {
      const result = await response.json();
      console.error("❌ Server error response:", result);
      throw new Error(
        result.message || result.error || `HTTP ${response.status}`
      );
    }

    const result = await response.json();
    console.log("✅ Button icon modifications saved:", result);
    showNotification("Button icon styles saved successfully!", "success");

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error saving button icon modifications:", error);
    showNotification(
      `Failed to save button icon styles: ${error.message}`,
      "error"
    );

    return { success: false, error: error.message };
  }
}
// button icon save modification code end here

// button shadow save modification start here
export async function saveButtonShadowModifications(blockId, css) {
  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
    console.warn("❌ Missing required data to save button shadow styles", {
      userId,
      token,
      widgetId,
      pageId,
      blockId,
      css,
    });
    return { success: false, error: "Missing required data" };
  }

  // Clean & normalize CSS for all button types
  const cleanCssObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== null && v !== undefined && v !== "" && v !== "null"
      )
    );

  const toKebabCaseStyleObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        value,
      ])
    );

  // ✅ FIXED: Handle all button types dynamically
  const cleanedCss = {};
  let hasValidStyles = false;

  // Process buttonPrimary
  if (
    css.buttonPrimary &&
    Object.keys(css.buttonPrimary.styles || {}).length > 0
  ) {
    cleanedCss.buttonPrimary = {
      selector: css.buttonPrimary.selector || ".sqs-button-element--primary",
      styles: toKebabCaseStyleObject(
        cleanCssObject(css.buttonPrimary.styles || {})
      ),
    };
    hasValidStyles = true;
  }

  // Process buttonSecondary
  if (
    css.buttonSecondary &&
    Object.keys(css.buttonSecondary.styles || {}).length > 0
  ) {
    cleanedCss.buttonSecondary = {
      selector:
        css.buttonSecondary.selector || ".sqs-button-element--secondary",
      styles: toKebabCaseStyleObject(
        cleanCssObject(css.buttonSecondary.styles || {})
      ),
    };
    hasValidStyles = true;
  }

  // Process buttonTertiary
  if (
    css.buttonTertiary &&
    Object.keys(css.buttonTertiary.styles || {}).length > 0
  ) {
    cleanedCss.buttonTertiary = {
      selector: css.buttonTertiary.selector || ".sqs-button-element--tertiary",
      styles: toKebabCaseStyleObject(
        cleanCssObject(css.buttonTertiary.styles || {})
      ),
    };
    hasValidStyles = true;
  }

  if (!hasValidStyles) {
    console.warn("⚠️ No valid shadow styles found in any button type.");
    return { success: false, error: "No valid shadow styles to save" };
  }

  // Payload for API
  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    css: cleanedCss,
  };

  console.log("📤 Sending button shadow payload:", {
    ...payload,
    buttonTypes: Object.keys(cleanedCss),
    totalStyles: Object.values(cleanedCss).reduce(
      (sum, btn) => sum + Object.keys(btn.styles).length,
      0
    ),
  });

  try {
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-button-shadow-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    console.log("✅ Button shadow styles saved:", result);
    showNotification("Button shadow styles saved successfully!", "success");

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error saving button shadow styles:", error);
    showNotification(
      `Failed to save button shadow styles: ${error.message}`,
      "error"
    );
    return { success: false, error: error.message };
  }
}
// button shadow save modification end here

// button hover code start here
//button hover border save modification code start here
export async function saveButtonHoverBorderModifications(blockId, css) {
  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  console.log("🔍 Debug - saveButtonHoverBorderModifications called with:", {
    blockId,
    css,
    pageId,
    userId,
    token: token ? "present" : "missing",
    widgetId,
  });

  if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
    console.warn(
      "❌ Missing required data to save button hover border styles",
      {
        userId,
        token,
        widgetId,
        pageId,
        blockId,
        css,
      }
    );
    return { success: false, error: "Missing required data" };
  }

  // Clean & normalize button styles
  const cleanCssObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== null && v !== undefined && v !== "" && v !== "null"
      )
    );

  const toKebabCaseStyleObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        value,
      ])
    );

  // Determine button type and create appropriate payload
  let buttonType = "buttonPrimary"; // Default
  let cleanedStyles = { selector: null, styles: {} };

  // Check which button type is present in the CSS object
  if (css.buttonPrimary) {
    buttonType = "buttonPrimary";
    cleanedStyles = {
      selector: css.buttonPrimary.selector || ".sqs-button-element--primary",
      styles: toKebabCaseStyleObject(
        cleanCssObject(css.buttonPrimary.styles || {})
      ),
    };
  } else if (css.buttonSecondary) {
    buttonType = "buttonSecondary";
    cleanedStyles = {
      selector:
        css.buttonSecondary.selector || ".sqs-button-element--secondary",
      styles: toKebabCaseStyleObject(
        cleanCssObject(css.buttonSecondary.styles || {})
      ),
    };
  } else if (css.buttonTertiary) {
    buttonType = "buttonTertiary";
    cleanedStyles = {
      selector: css.buttonTertiary.selector || ".sqs-button-element--tertiary",
      styles: toKebabCaseStyleObject(
        cleanCssObject(css.buttonTertiary.styles || {})
      ),
    };
  } else if (css.styles) {
    // Handle direct styles object - determine type from selector
    const selector = css.selector || ".sqs-button-element--primary";
    if (selector.includes("--secondary")) {
      buttonType = "buttonSecondary";
    } else if (selector.includes("--tertiary")) {
      buttonType = "buttonTertiary";
    } else {
      buttonType = "buttonPrimary";
    }
    cleanedStyles = {
      selector: selector,
      styles: toKebabCaseStyleObject(cleanCssObject(css.styles || {})),
    };
  }

  console.log("🔍 Debug - determined button type:", buttonType);
  console.log("🔍 Debug - cleaned styles:", cleanedStyles);

  if (Object.keys(cleanedStyles.styles).length === 0) {
    console.warn("⚠️ No valid hover border styles found.");
    return { success: false, error: "No valid hover border styles to save" };
  }

  // Create payload with the correct button type
  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    css: {
      [buttonType]: cleanedStyles,
    },
  };

  console.log("📤 Sending button hover border payload:", payload);

  try {
    console.log("🌐 Making API request to save button hover border styles...");
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-button-hover-border-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("📥 API Response status:", response.status);
    console.log(
      "📥 API Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const result = await response.json();
    console.log("📥 API Response body:", result);

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    console.log("✅ Button hover border styles saved:", result);
    showNotification(
      "Button hover border styles saved successfully!",
      "success"
    );

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error saving button hover border styles:", error);
    console.error("❌ Error details:", {
      message: error.message,
      stack: error.stack,
    });
    showNotification(
      `Failed to save button hover border styles: ${error.message}`,
      "error"
    );
    return { success: false, error: error.message };
  }
}

// button hover border save modification code end here

// button hover shadow save modification code start here
export async function saveButtonHoverShadowModifications(blockId, css) {
  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
    console.warn(
      "❌ Missing required data to save button hover shadow styles",
      {
        userId,
        token,
        widgetId,
        pageId,
        blockId,
        css,
      }
    );
    return { success: false, error: "Missing required data" };
  }

  // ✅ Clean null/empty values from style object
  const cleanCssObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== null && v !== undefined && v !== "" && v !== "null"
      )
    );

  // ✅ Convert camelCase → kebab-case (e.g., boxShadow → box-shadow)
  const toKebabCaseStyleObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        value,
      ])
    );

  // ✅ Format buttonPrimary styles (only one supported for now)
  const cleanedPrimary = css.buttonPrimary
    ? {
        selector: css.buttonPrimary.selector || ".sqs-button-element--primary",
        styles: toKebabCaseStyleObject(
          cleanCssObject(css.buttonPrimary.styles || {})
        ),
      }
    : { selector: null, styles: {} };

  if (Object.keys(cleanedPrimary.styles).length === 0) {
    console.warn("⚠️ No valid hover shadow styles found in buttonPrimary.");
    return { success: false, error: "No valid hover shadow styles to save" };
  }

  // ✅ Final payload to send
  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    css: {
      buttonPrimary: cleanedPrimary,
    },
  };

  console.log("📤 Sending button shadow payload:", payload);

  try {
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-button-hover-shadow-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    console.log("✅ Button shadow styles saved:", result);
    showNotification("Button shadow styles saved successfully!", "success");

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error saving button shadow styles:", error);
    showNotification(
      `Failed to save button shadow styles: ${error.message}`,
      "error"
    );
    return { success: false, error: error.message };
  }
}

// button hover shadow save modification code end here

// button hover color save modification code start here
export async function saveButtonHoverColorModifications(blockId, css) {
  console.log("🚀 saveButtonHoverColorModifications called with:", {
    blockId,
    css,
  });

  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  console.log("📋 Required data check:", {
    userId: !!userId,
    token: !!token,
    widgetId: !!widgetId,
    pageId: !!pageId,
    blockId: !!blockId,
    css: !!css,
  });

  if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
    console.warn(
      "❌ Missing required data to save button hover color modifications",
      {
        userId,
        token,
        widgetId,
        pageId,
        blockId,
        css,
      }
    );
    return { success: false, error: "Missing required data" };
  }

  // Clean & normalize button styles and convert to kebab-case
  const cleanCssObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== null && v !== undefined && v !== "" && v !== "null"
      )
    );

  const toKebabCaseStyleObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        value,
      ])
    );

  // Clean each button type's CSS block
  const cleanCssBlock = (block) => ({
    selector: block?.selector || null,
    styles: toKebabCaseStyleObject(cleanCssObject(block?.styles || {})),
  });

  // Process each button type
  const cleanedPrimary = cleanCssBlock(css.buttonPrimary);
  const cleanedSecondary = cleanCssBlock(css.buttonSecondary);
  const cleanedTertiary = cleanCssBlock(css.buttonTertiary);

  // Check if we have at least one valid style to save
  const hasValidStyles =
    Object.keys(cleanedPrimary.styles).length > 0 ||
    Object.keys(cleanedSecondary.styles).length > 0 ||
    Object.keys(cleanedTertiary.styles).length > 0;

  if (!hasValidStyles) {
    console.warn("⚠️ No valid hover color styles to save");
    return { success: false, error: "No valid hover color styles to save" };
  }

  // Additional debugging for the cleaning process
  console.log("🔍 Cleaning Process Debug:", {
    originalCSS: css,
    cleanedPrimary: cleanedPrimary,
    cleanedSecondary: cleanedSecondary,
    cleanedTertiary: cleanedTertiary,
    hasValidStyles,
    primaryStyleKeys: Object.keys(cleanedPrimary.styles),
    secondaryStyleKeys: Object.keys(cleanedSecondary.styles),
    tertiaryStyleKeys: Object.keys(cleanedTertiary.styles),
  });

  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    css: {
      buttonPrimary: cleanedPrimary,
      buttonSecondary: cleanedSecondary,
      buttonTertiary: cleanedTertiary,
    },
  };

  console.log("📤 Sending button hover color payload:", payload);
  console.log("🔍 Original CSS received:", css);
  console.log("🧹 Cleaned CSS structure:", {
    buttonPrimary: cleanedPrimary,
    buttonSecondary: cleanedSecondary,
    buttonTertiary: cleanedTertiary,
  });
  console.log("🔍 Has valid styles check:", {
    primaryStyles: Object.keys(cleanedPrimary.styles),
    secondaryStyles: Object.keys(cleanedSecondary.styles),
    tertiaryStyles: Object.keys(cleanedTertiary.styles),
    hasValidStyles,
  });

  try {
    console.log(
      "🌐 Making API request to save button hover color modifications..."
    );
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-button-hover-color-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("📡 Response status:", response.status);
    console.log(
      "📡 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Server error response:", result);
      console.error("❌ Full error details:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        result: result,
      });
      throw new Error(
        result.message || result.error || `HTTP ${response.status}`
      );
    }

    console.log("✅ Button hover color modifications saved:", result);
    showNotification("Button hover colors saved successfully!", "success");

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error saving button hover color modifications:", error);
    showNotification(
      `Failed to save button hover colors: ${error.message}`,
      "error"
    );

    return { success: false, error: error.message };
  }
}

// button hover color save modification code end here

// button hover icon save modification code start here
export async function saveButtonHoverIconModifications(blockId, css) {
  console.log("🚀 saveButtonHoverIconModifications called with:", {
    blockId,
    css,
  });

  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  console.log("📋 Required data check:", {
    userId: !!userId,
    token: !!token,
    widgetId: !!widgetId,
    pageId: !!pageId,
    blockId: !!blockId,
    css: !!css,
  });

  if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
    console.warn(
      "❌ Missing required data to save button hover icon modifications",
      {
        userId,
        token,
        widgetId,
        pageId,
        blockId,
        css,
      }
    );
    return { success: false, error: "Missing required data" };
  }

  // Clean & normalize CSS and convert to kebab-case
  const cleanCssObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== null && v !== undefined && v !== "" && v !== "null"
      )
    );

  const toKebabCaseStyleObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        value,
      ])
    );

  // Process each button type's CSS block
  const processButtonType = (buttonData) => {
    if (!buttonData) return [];

    // If it's already an array, process each item
    if (Array.isArray(buttonData)) {
      return buttonData
        .map((item) => ({
          selector: item?.selector || null,
          styles: toKebabCaseStyleObject(cleanCssObject(item?.styles || {})),
        }))
        .filter((item) => item.selector && Object.keys(item.styles).length > 0);
    }

    // If it's a single object, convert to array format
    if (buttonData.selector && buttonData.styles) {
      const cleanedStyles = toKebabCaseStyleObject(
        cleanCssObject(buttonData.styles)
      );
      if (Object.keys(cleanedStyles).length > 0) {
        return [
          {
            selector: buttonData.selector,
            styles: cleanedStyles,
          },
        ];
      }
    }

    return [];
  };

  // Process each button type
  const cleanedPrimary = processButtonType(css.buttonPrimary);
  const cleanedSecondary = processButtonType(css.buttonSecondary);
  const cleanedTertiary = processButtonType(css.buttonTertiary);

  // Check if we have at least one valid style to save
  const hasValidStyles =
    cleanedPrimary.length > 0 ||
    cleanedSecondary.length > 0 ||
    cleanedTertiary.length > 0;

  if (!hasValidStyles) {
    console.warn("⚠️ No valid hover icon styles to save");
    return { success: false, error: "No valid hover icon styles to save" };
  }

  // Additional debugging for the cleaning process
  console.log("🔍 Cleaning Process Debug:", {
    originalCSS: css,
    cleanedPrimary: cleanedPrimary,
    cleanedSecondary: cleanedSecondary,
    cleanedTertiary: cleanedTertiary,
    hasValidStyles,
    primaryStyleCount: cleanedPrimary.length,
    secondaryStyleCount: cleanedSecondary.length,
    tertiaryStyleCount: cleanedTertiary.length,
  });

  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    css: {
      buttonPrimary: cleanedPrimary,
      buttonSecondary: cleanedSecondary,
      buttonTertiary: cleanedTertiary,
    },
  };

  console.log("📤 Sending button hover icon payload:", payload);
  console.log("🔍 Original CSS received:", css);
  console.log("🧹 Cleaned CSS structure:", {
    buttonPrimary: cleanedPrimary,
    buttonSecondary: cleanedSecondary,
    buttonTertiary: cleanedTertiary,
  });

  try {
    console.log(
      "🌐 Making API request to save button hover icon modifications..."
    );
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-button-hover-icon-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("📡 Response status:", response.status);
    console.log(
      "📡 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Server error response:", result);
      console.error("❌ Full error details:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        result: result,
      });
      throw new Error(
        result.message || result.error || `HTTP ${response.status}`
      );
    }

    console.log("✅ Button hover icon modifications saved:", result);
    showNotification("Button hover icon styles saved successfully!", "success");

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error saving button hover icon modifications:", error);
    showNotification(
      `Failed to save button hover icon styles: ${error.message}`,
      "error"
    );

    return { success: false, error: error.message };
  }
}

// button hover icon save modification code end here

// button hover text save modification code start here
export async function saveButtonHoverTextModifications(blockId, css) {
  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
    console.warn("❌ Missing required data to save button hover text styles", {
      userId,
      token,
      widgetId,
      pageId,
      blockId,
      css,
    });
    return { success: false, error: "Missing required data" };
  }

  // ✅ Clean null/empty values from style object
  const cleanCssObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== null && v !== undefined && v !== "" && v !== "null"
      )
    );

  // ✅ Convert camelCase → kebab-case (e.g., color → color)
  const toKebabCaseStyleObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        value,
      ])
    );

  // ✅ Format buttonPrimary styles (only one supported for now)
  const cleanedPrimary = css.buttonPrimary
    ? {
        selector: css.buttonPrimary.selector || ".sqs-button-element--primary",
        styles: toKebabCaseStyleObject(
          cleanCssObject(css.buttonPrimary.styles || {})
        ),
      }
    : { selector: null, styles: {} };

  if (Object.keys(cleanedPrimary.styles).length === 0) {
    console.warn("⚠️ No valid hover text styles found in buttonPrimary.");
    return { success: false, error: "No valid hover text styles to save" };
  }

  // ✅ Final payload to send
  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    css: {
      buttonPrimary: cleanedPrimary,
    },
  };

  console.log("📤 Sending button hover text payload:", payload);

  try {
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-button-hover-text-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    console.log("✅ Button hover text styles saved:", result);
    showNotification("Button hover text styles saved successfully!", "success");

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error saving button hover text styles:", error);
    showNotification(
      `Failed to save button hover text styles: ${error.message}`,
      "error"
    );
    return { success: false, error: error.message };
  }
}

// button hover text save modification code end here

// button hover code end here

// link text save modificaiton code here

export async function saveLinkTextModifications(blockId, cssMap) {
  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  if (!userId || !token || !widgetId || !pageId || !blockId || !cssMap) {
    console.warn("❌ Missing required data to save link text styles", {
      userId,
      token,
      widgetId,
      pageId,
      blockId,
      cssMap,
    });
    return { success: false, error: "Missing required data" };
  }

  // ✅ Build final structure for css.linkText
  const linkText = {};

  for (const [tag, data] of Object.entries(cssMap)) {
    const rawStyles = data?.styles || {};
    const selector = data?.selector || `#${blockId} ${tag} a`;

    const cleaned = Object.fromEntries(
      Object.entries(rawStyles).filter(
        ([_, v]) =>
          v !== null &&
          v !== undefined &&
          v !== "" &&
          v !== "null" &&
          !(typeof v === "string" && v.trim() === "")
      )
    );

    const kebab = Object.fromEntries(
      Object.entries(cleaned).map(([key, val]) => [
        key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        val,
      ])
    );

    // ✅ Always include selector and styles (even if styles is empty)
    linkText[tag] = {
      selector,
      styles: kebab,
    };
  }

  // Double-check structure
  if (Object.keys(linkText).length === 0) {
    return { success: false, error: "No valid linkText styles to save" };
  }

  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    css: {
      linkText,
    },
  };

  console.log("📤 Sending final link text payload:", payload);

  try {
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-link-text-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ API Error Details:", {
        status: response.status,
        statusText: response.statusText,
        result,
      });
      throw new Error(result.message || `HTTP ${response.status}`);
    }

    console.log("✅ Link text styles saved:", result);
    showNotification("Link text styles saved successfully!", "success");

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error saving link text styles:", error);
    showNotification(
      `Failed to save link text styles: ${error.message}`,
      "error"
    );

    return { success: false, error: error.message };
  }
}
// link text save modificaiton code end here

// reset all image modification code start here
export function initImageResetHandler() {
  const resetBtn = document.querySelector("#buttonResetAll-icon");
  if (!resetBtn) {
    console.warn("❌ Reset button not found!");
    return;
  }

  resetBtn.addEventListener("click", async () => {
    const confirmReset = confirm(
      "⚠️ Are you sure you want to reset? This will permanently delete all image styling data from the database for this page."
    );

    if (!confirmReset) return;

    const userId = localStorage.getItem("sc_u_id");
    const token = localStorage.getItem("sc_auth_token");
    const widgetId = localStorage.getItem("sc_w_id");
    const pageId = document
      .querySelector("article[data-page-sections]")
      ?.getAttribute("data-page-sections");

    if (!userId || !token || !widgetId || !pageId) {
      showNotification("❌ Missing required data to reset", "error");
      return;
    }

    try {
      const response = await fetch(
        "https://admin.squareplugin.com/api/v1/delete-image-modifications",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId,
            widgetId,
            pageId,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      console.log("✅ Reset successful:", result);
      showNotification("✅ Image styles reset successfully!", "success");

      // ✅ Immediately remove all applied image styles from DOM
      removeAllImageStyles();
    } catch (err) {
      console.error("❌ Reset failed:", err);
      showNotification(`❌ Reset failed: ${err.message}`, "error");
    }
  });
}

// ✅ Function to remove all applied image styles from DOM
function removeAllImageStyles() {
  try {
    // Remove all style tags that were added by the plugin
    const styleTagsToRemove = [
      ...document.querySelectorAll('style[id^="sc-style-"]'),
      ...document.querySelectorAll('style[id^="sc-img-style-"]'),
      ...document.querySelectorAll('style[id^="sc-overlay-style-"]'),
      ...document.querySelectorAll('style[id^="sc-shadow-style-"]'),
      ...document.querySelectorAll('style[id^="sc-image-tag-style-"]'),
      ...document.querySelectorAll('style[id^="sc-overflow-style-"]'),
    ];

    styleTagsToRemove.forEach((styleTag) => {
      console.log(`🗑️ Removing style tag: ${styleTag.id}`);
      styleTag.remove();
    });

    // Remove applied classes from image elements
    const imageElements = document.querySelectorAll(
      ".sc-image-styled, .sc-font-modified"
    );
    imageElements.forEach((element) => {
      element.classList.remove("sc-image-styled", "sc-font-modified");
    });

    // Reset any inline styles on image content elements
    const imageContentElements =
      document.querySelectorAll(".sqs-image-content");
    imageContentElements.forEach((element) => {
      // Remove specific styles that might have been applied
      element.style.removeProperty("border");
      element.style.removeProperty("border-radius");
      element.style.removeProperty("box-shadow");
      element.style.removeProperty("overflow");
    });

    // Reset img tag styles
    const imgElements = document.querySelectorAll(".sqs-image-content img");
    imgElements.forEach((img) => {
      img.style.removeProperty("object-fit");
      img.style.removeProperty("box-sizing");
    });

    console.log("✅ All image styles removed from DOM");
    showNotification("✅ All image styles have been reset!", "success");
  } catch (error) {
    console.error("❌ Error removing image styles:", error);
    showNotification(
      "⚠️ Styles removed from database but some DOM cleanup failed",
      "warning"
    );
  }
}

// end reset all image modification code

// Test function to verify saveButtonIconModifications is working
export function testSaveButtonIconModifications() {
  const testData = {
    icon: {
      selector:
        ".sqs-button-element--primary svg, .sqs-button-element--primary img",
      styles: { color: "rgba(255, 0, 0, 1)", fill: "rgba(255, 0, 0, 1)" },
    },
    buttonType: "primary",
    applyToAllTypes: false,
  };

  console.log("🧪 Testing saveButtonIconModifications with:", testData);
  saveButtonIconModifications("test-block-id", testData);
}

// Make test function available globally
window.testSaveButtonIconModifications = testSaveButtonIconModifications;

// Make typography function available globally
window.saveTypographyAllModifications = saveTypographyAllModifications;

// Test function to debug hover border save functionality
export async function testHoverBorderSave() {
  console.log("🧪 Testing hover border save functionality...");

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

  console.log("📤 Test payload:", testPayload);

  try {
    const result = await saveButtonHoverBorderModifications(
      "test-block-id",
      testPayload
    );
    console.log("✅ Test result:", result);
    return result;
  } catch (error) {
    console.error("❌ Test failed:", error);
    return { success: false, error: error.message };
  }
}

// Make test function globally available
if (typeof window !== "undefined") {
  window.testHoverBorderSave = testHoverBorderSave;
  window.saveButtonHoverIconModifications = saveButtonHoverIconModifications;
  window.saveButtonHoverEffectModifications =
    saveButtonHoverEffectModifications;
}

// button hover effect save modification code start here
export async function saveButtonHoverEffectModifications(blockId, css) {
  console.log("🚀 saveButtonHoverEffectModifications called with:", {
    blockId,
    css,
  });

  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  console.log("📋 Required data check:", {
    userId: !!userId,
    token: !!token,
    widgetId: !!widgetId,
    pageId: !!pageId,
    blockId: !!blockId,
    css: !!css,
  });

  if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
    console.warn(
      "❌ Missing required data to save button hover effect modifications",
      {
        userId,
        token,
        widgetId,
        pageId,
        blockId,
        css,
      }
    );
    return { success: false, error: "Missing required data" };
  }

  // Clean & normalize CSS and convert to kebab-case
  const cleanCssObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).filter(
        ([_, v]) => v !== null && v !== undefined && v !== "" && v !== "null"
      )
    );

  const toKebabCaseStyleObject = (obj = {}) =>
    Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        key.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(),
        value,
      ])
    );

  // Process each button type's CSS block
  const processButtonType = (buttonData) => {
    if (!buttonData) return { selector: null, styles: {} };

    // If it's already an object with selector and styles
    if (buttonData.selector && buttonData.styles) {
      return {
        selector: buttonData.selector,
        styles: toKebabCaseStyleObject(cleanCssObject(buttonData.styles)),
      };
    }

    // If it's a raw styles object, use default selector
    if (typeof buttonData === "object" && !buttonData.selector) {
      return {
        selector: ".sqs-button-element--primary", // Default selector
        styles: toKebabCaseStyleObject(cleanCssObject(buttonData)),
      };
    }

    return { selector: null, styles: {} };
  };

  // Process each button type
  const cleanedPrimary = processButtonType(css.buttonPrimary);
  const cleanedSecondary = processButtonType(css.buttonSecondary);
  const cleanedTertiary = processButtonType(css.buttonTertiary);

  // Check if we have at least one valid style to save
  const hasValidStyles =
    (cleanedPrimary.selector &&
      Object.keys(cleanedPrimary.styles).length > 0) ||
    (cleanedSecondary.selector &&
      Object.keys(cleanedSecondary.styles).length > 0) ||
    (cleanedTertiary.selector &&
      Object.keys(cleanedTertiary.styles).length > 0);

  if (!hasValidStyles) {
    console.warn("⚠️ No valid hover effect styles to save");
    return { success: false, error: "No valid hover effect styles to save" };
  }

  // Additional debugging for the cleaning process
  console.log("🔍 Cleaning Process Debug:", {
    originalCSS: css,
    cleanedPrimary: cleanedPrimary,
    cleanedSecondary: cleanedSecondary,
    cleanedTertiary: cleanedTertiary,
    hasValidStyles,
    primaryStyleKeys: Object.keys(cleanedPrimary.styles),
    secondaryStyleKeys: Object.keys(cleanedSecondary.styles),
    tertiaryStyleKeys: Object.keys(cleanedTertiary.styles),
  });

  const payload = {
    userId,
    token,
    widgetId,
    pageId,
    elementId: blockId,
    css: {
      buttonPrimary: cleanedPrimary.selector ? cleanedPrimary : undefined,
      buttonSecondary: cleanedSecondary.selector ? cleanedSecondary : undefined,
      buttonTertiary: cleanedTertiary.selector ? cleanedTertiary : undefined,
    },
  };

  // Remove undefined values from payload
  Object.keys(payload.css).forEach((key) => {
    if (payload.css[key] === undefined) {
      delete payload.css[key];
    }
  });

  console.log("📤 Sending button hover effect payload:", payload);
  console.log("🔍 Original CSS received:", css);
  console.log("🧹 Cleaned CSS structure:", {
    buttonPrimary: cleanedPrimary,
    buttonSecondary: cleanedSecondary,
    buttonTertiary: cleanedTertiary,
  });

  try {
    console.log(
      "🌐 Making API request to save button hover effect modifications..."
    );
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/save-button-effect-modifications",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("📡 Response status:", response.status);
    console.log(
      "📡 Response headers:",
      Object.fromEntries(response.headers.entries())
    );

    const result = await response.json();

    if (!response.ok) {
      console.error("❌ Server error response:", result);
      console.error("❌ Full error details:", {
        status: response.status,
        statusText: response.statusText,
        url: response.url,
        result: result,
      });
      throw new Error(
        result.message || result.error || `HTTP ${response.status}`
      );
    }

    console.log("✅ Button hover effect modifications saved:", result);
    showNotification(
      "Button hover effect styles saved successfully!",
      "success"
    );

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error saving button hover effect modifications:", error);
    showNotification(
      `Failed to save button hover effect styles: ${error.message}`,
      "error"
    );

    return { success: false, error: error.message };
  }
}

// button hover effect save modification code end here

export async function removeButtonIcon(blockId) {
  console.log("🚀 removeButtonIcon called with:", { blockId });

  const pageId = document
    .querySelector("article[data-page-sections]")
    ?.getAttribute("data-page-sections");

  const userId = localStorage.getItem("sc_u_id");
  const token = localStorage.getItem("sc_auth_token");
  const widgetId = localStorage.getItem("sc_w_id");

  if (!userId || !token || !widgetId || !pageId || !blockId) {
    console.log("❌ Missing required data to remove button icon", {
      userId,
      token,
      widgetId,
      pageId,
      blockId,
    });
    return { success: false, error: "Missing required data" };
  }

  // Determine button type from the selected element
  const selectedElement = document.querySelector(`[id="${blockId}"]`);
  if (!selectedElement) {
    console.log("❌ Selected element not found");
    return { success: false, error: "Selected element not found" };
  }

  const buttonElement =
    selectedElement.querySelector(
      "a.sqs-button-element--primary, a.sqs-button-element--secondary, a.sqs-button-element--tertiary"
    ) ||
    selectedElement.querySelector(
      "button.sqs-button-element--primary, button.sqs-button-element--secondary, button.sqs-button-element--tertiary"
    );

  if (!buttonElement) {
    console.log("❌ Button element not found");
    return { success: false, error: "Button element not found" };
  }

  const typeClass = [...buttonElement.classList].find((cls) =>
    cls.startsWith("sqs-button-element--")
  );

  let buttonType = "tertiary"; // default
  if (typeClass) {
    if (typeClass.includes("primary")) {
      buttonType = "primary";
    } else if (typeClass.includes("secondary")) {
      buttonType = "secondary";
    } else if (typeClass.includes("tertiary")) {
      buttonType = "tertiary";
    }
  }

  // Structure the payload to match server expectations
  const payload = {
    userId,
    widgetId,
    pageId,
    elementId: blockId,
    buttonType,
    applyToAllTypes: false,
  };

  console.log("📤 Sending remove button icon payload:", {
    size: JSON.stringify(payload).length,
    buttonType,
  });

  try {
    console.log("🌐 Making API request to remove button icon...");
    const response = await fetch(
      "https://admin.squareplugin.com/api/v1/remove-icon",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );

    console.log("📡 Response status:", response.status);

    if (!response.ok) {
      const result = await response.json();
      console.error("❌ Server error response:", result);
      throw new Error(
        result.message || result.error || `HTTP ${response.status}`
      );
    }

    const result = await response.json();
    console.log("✅ Button icon removed:", result);
    showNotification("Button icon removed successfully!", "success");

    // Remove the icon from the DOM
    const iconElement = buttonElement.querySelector(
      ".sqscraft-button-icon, .sqscraft-image-icon"
    );
    if (iconElement) {
      iconElement.remove();
      console.log("🗑️ Icon removed from DOM");
    }

    return { success: true, data: result };
  } catch (error) {
    console.error("❌ Error removing button icon:", error);
    showNotification(`Failed to remove button icon: ${error.message}`, "error");

    return { success: false, error: error.message };
  }
}

export function initRemoveButtonIconHandler(
  getSelectedElement,
  showNotification
) {
  console.log("🔧 Initializing remove button icon handler...");

  // Wait for the remove button to be available in the DOM
  const waitForRemoveButton = () => {
    return new Promise((resolve) => {
      const checkButton = () => {
        const removeButton = document.getElementById("removeButtonIcon");
        if (removeButton) {
          resolve(removeButton);
        } else {
          setTimeout(checkButton, 100);
        }
      };
      checkButton();
    });
  };

  waitForRemoveButton()
    .then((removeButton) => {
      console.log("✅ Remove button icon found, adding click handler");

      removeButton.addEventListener("click", async (event) => {
        event.preventDefault();
        event.stopPropagation();

        console.log("🖱️ Remove button icon clicked");

        const selected = getSelectedElement?.();
        if (!selected) {
          console.log("❌ No selected element found");
          showNotification("❌ No button selected", "error");
          return;
        }

        const blockId = selected.id;
        if (!blockId) {
          console.log("❌ No block ID found");
          showNotification("❌ No block ID found", "error");
          return;
        }

        console.log("🗑️ Removing icon for block:", blockId);

        try {
          const result = await removeButtonIcon(blockId);
          if (result.success) {
            console.log("✅ Icon removal successful");
          } else {
            console.log("❌ Icon removal failed:", result.error);
          }
        } catch (error) {
          console.error("❌ Error in remove icon handler:", error);
          showNotification("❌ Failed to remove icon", "error");
        }
      });

      console.log("✅ Remove button icon click handler added successfully");
    })
    .catch((error) => {
      console.error(
        "❌ Failed to initialize remove button icon handler:",
        error
      );
    });
}
