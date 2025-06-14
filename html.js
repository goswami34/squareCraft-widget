import {
  getToggleState,
  setToggleState,
} from "https://goswami34.github.io/squareCraft-widget/toggleState.js";
import { WidgetTypoSection } from "https://goswami34.github.io/squareCraft-widget/src/components/WidgetTypoSection/WidgetTypoSection.js";
import { WidgetImageSection } from "https://goswami34.github.io/squareCraft-widget/src/components/WidgetImageSection/WidgetImageSection.js";

export function html() {
  const htmlString = `
     <div
   class="sc-p-2 z-index-high sc-text-color-white sc-border sc-border-solid sc-border-3d3d3d sc-bg-color-2c2c2c sc-rounded-15px sc-w-300px">
   <div id="sc-grabbing" class="sc-cursor-grabbing sc-w-full">
    <div class="sc-flex sc-roboto sc-universal sc-items-center sc-justify-between">
         <img class="sc-cursor-grabbing sc-universal" src="https://i.ibb.co.com/pry1mVGD/Group-28-1.png"
            width="140px" />
      </div>
      <p class="sc-text-sm sc-mt-6 sc-roboto sc-font-light">Powerful Visual Editor for Customizing Squarespace Text Styles in Real-Time.
      </p>
   </div>
   <div class="sc-mt-6 sc-roboto sc-border-t sc-border-dashed sc-border-color-494949  sc-w-full">
   </div>
   <div class="sc-mt-6 sc-roboto sc-flex  sc-items-center sc-universal">
      <p class="sc-text-sm sc-px-4 sc-cursor-pointer tabHeader ">Design</p>
      <p class="sc-text-sm sc-px-4 sc-cursor-pointer tabHeader">Advanced</p>
      <p class="sc-text-sm sc-px-4 sc-cursor-pointer tabHeader">Presets</p>
   </div>
   <div class="sc-border-t sc-border-solid sc-relative  sc-border-color-494949 sc-w-full">
      <div class="sc-absolute sc-top-0 sc-left-0 sc-bg-colo-EF7C2F sc-w-16 sc-h-1px">
      </div>
   </div>
   <div
      class="sc-rounded-6px sc-h-350 sc-scrollBar sc-mt-6  sc-border sc-border-solid sc-border-EF7C2F sc-bg-color-3d3d3d">
  
      ${WidgetTypoSection("typoSection")}
      ${WidgetImageSection("imageSection")}

  
   </div>
   <div class="sc-mt-4">
      <div class="sc-flex  sc-items-center sc-justify-between sc-gap-2">
         <div id="publish"
            class="sc-cursor-pointer sc-roboto sc-bg-color-EF7C2F sc-w-full sc-font-light sc-flex sc-items-center sc-text-sm sc-py-1 sc-rounded-6px sc-text-color-white sc-justify-center">
            Publish
         </div>
         <div
            class="sc-cursor-pointer sc-roboto sc-bg-3f3f3f sc-w-full sc-text-color-white sc-font-light sc-flex sc-text-sm sc-py-1 sc-rounded-6px sc-items-center sc-justify-center">
            Reset
         </div>
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

// In html.js
async function handlePublish() {
  if (pendingModifications.size === 0) {
    showNotification("No changes to publish", "info");
    return;
  }

  try {
    // Save each pending modification
    for (const [blockId, modifications] of pendingModifications.entries()) {
      for (const mod of modifications) {
        const result = await saveModifications(blockId, mod.css, mod.tagType);
        if (!result.success) {
          throw new Error(`Failed to save changes for block ${blockId}`);
        }
      }
    }

    // Clear pending modifications after successful save
    pendingModifications.clear();
    showNotification("All changes published successfully!", "success");
  } catch (error) {
    showNotification(error.message, "error");
  }
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

  // const payload = {
  //   userId,
  //   token,
  //   widgetId,
  //   pageId,
  //   elementId: blockId,
  //   css: {
  //     image: {
  //       selector,
  //       styles: kebabCss,
  //     },
  //   },
  // };

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
      "http://localhost:8001/api/v1/Image-modifications",
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

// export async function saveImageOverlayModifications(blockId, css) {
//   const pageId = document
//     .querySelector("article[data-page-sections]")
//     ?.getAttribute("data-page-sections");
//   const userId = localStorage.getItem("sc_u_id");
//   const token = localStorage.getItem("sc_auth_token");
//   const widgetId = localStorage.getItem("sc_w_id");

//   const stylesWithContent = {
//     ...css,
//     content: "", // Always include content property
//   };

//   // Detailed debug log
//   console.log("[DEBUG] Overlay Save Fields:", {
//     userId,
//     token,
//     widgetId,
//     pageId,
//     blockId,
//     css,
//   });

//   const selector = `#${blockId} .sqs-image-content > :nth-child(-n+2)::before`;
//   const kebabCss = toKebabCaseStyleObject(css);

//   // FLAT PAYLOAD for backend
//   const payload = {
//     userId,
//     token,
//     widgetId,
//     pageId,
//     elementId: blockId,
//     selector,
//     styles: kebabCss,
//   };

//   // Log the final payload
//   console.log(
//     "[DEBUG] Final overlay payload:",
//     JSON.stringify(payload, null, 2)
//   );

//   if (!userId || !token || !widgetId || !pageId || !blockId || !css) {
//     console.warn("❌ Missing required fields", {
//       userId,
//       token,
//       widgetId,
//       pageId,
//       blockId,
//       css,
//     });
//     return { success: false, error: "Missing required data" };
//   }

//   try {
//     const response = await fetch(
//       "https://admin.squareplugin.com/api/v1/save-image-overlay-modifications",
//       {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       }
//     );

//     const result = await response.json();

//     if (!response.ok) {
//       throw new Error(result.message || `HTTP ${response.status}`);
//     }

//     console.log("✅ Overlay styles saved:", result);
//     return { success: true, data: result };
//   } catch (error) {
//     console.error("❌ Error saving overlay styles:", error);
//     return { success: false, error: error.message };
//   }
// }

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
