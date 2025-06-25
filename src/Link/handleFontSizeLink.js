let colorPalette = null;
let colorPickerContext = null;
const linkTextStyleMap = new Map();

// Helper function to log the current state of the style map
function logStyleMapState(blockId, textType) {
  const styleKey = `${blockId}-${textType}`;
  const currentData = linkTextStyleMap.get(styleKey);
  console.log(
    "🔍 Current style map state for key:",
    styleKey,
    ":",
    currentData
  );
  return currentData;
}

// ✅ mergeAndSaveLinkTextStyles function similar to mergeAndSaveImageStyles
async function mergeAndSaveLinkTextStyles(
  blockId,
  textType,
  newStyles,
  saveLinkTextModifications
) {
  if (typeof saveLinkTextModifications !== "function") {
    console.warn(
      "❌ saveLinkTextModifications is not a function in mergeAndSaveLinkTextStyles()"
    );
    return;
  }

  // Create a unique key for block + text type combination
  const styleKey = `${blockId}-${textType}`;

  // Get existing styles from the map for this specific block + text type
  const prevStyles = linkTextStyleMap.get(styleKey) || {
    linkText: {
      selector: `#${blockId} a`,
      styles: {},
    },
  };

  // Use the new selector if provided, otherwise keep the existing one
  const finalSelector =
    newStyles.linkText?.selector || prevStyles.linkText.selector;

  // Merge the new styles with existing styles
  const mergedLinkTextStyles = {
    ...prevStyles.linkText.styles, // Keep existing styles
    ...(newStyles.linkText?.styles || {}), // Add new styles
  };

  const finalData = {
    linkText: {
      selector: finalSelector,
      styles: mergedLinkTextStyles,
    },
  };

  console.log("🔍 Merging styles for", styleKey, ":", {
    prevStyles: prevStyles.linkText.styles,
    newStyles: newStyles.linkText?.styles,
    mergedStyles: mergedLinkTextStyles,
    finalSelector,
  });

  // Save to map and database
  linkTextStyleMap.set(styleKey, finalData);
  console.log(
    "🔍 Updated linkTextStyleMap for key:",
    styleKey,
    "with data:",
    finalData
  );

  await saveLinkTextModifications(blockId, finalData, "link");
  console.log("✅ Database save completed for key:", styleKey);
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

export async function handleFontSizeLink(event = null, context = null) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    saveLinkTextModifications,
    showNotification,
  } = context;

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scFontSizeInputLink"].sc-activeTab-border'
    );
    if (!activeButton) return;
    event = { target: activeButton };
  }

  const clickedInput = event.target.closest('[id^="scFontSizeInputLink"]');
  if (!clickedInput) return;

  const fontSize = clickedInput.value + "px";

  if (!lastClickedElement) {
    showNotification("Please select a block first", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification("Please select a text type first", "error");
    return;
  }

  const block = lastClickedElement.closest('[id^="block-"]');
  if (!block) {
    showNotification("Block not found", "error");
    return;
  }

  // Correct Paragraph Selector Setup
  let paragraphSelector = "";
  if (selectedSingleTextType === "paragraph1") {
    paragraphSelector = "p.sqsrte-large";
  } else if (selectedSingleTextType === "paragraph2") {
    paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
  } else if (selectedSingleTextType === "paragraph3") {
    paragraphSelector = "p.sqsrte-small";
  } else if (selectedSingleTextType.startsWith("heading")) {
    paragraphSelector = `h${selectedSingleTextType.replace("heading", "")}`;
  } else {
    paragraphSelector = selectedSingleTextType;
  }

  console.log("🔎 Applying font-size to links inside:", paragraphSelector);

  const targetElements = block.querySelectorAll(paragraphSelector);
  if (!targetElements.length) {
    showNotification(
      `No ${selectedSingleTextType} found inside block`,
      "error"
    );
    return;
  }

  let linkFound = false;

  targetElements.forEach((tag) => {
    const links = tag.querySelectorAll("a");
    if (links.length > 0) {
      linkFound = true;
      links.forEach((link) => {
        link.style.fontSize = fontSize;
      });
    }
  });

  if (!linkFound) {
    showNotification(`No link (<a>) inside ${selectedSingleTextType}`, "info");
    return;
  }

  // Dynamic CSS Inject
  const styleId = `style-${block.id}-${selectedSingleTextType}-link-fontsize`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
      #${block.id} ${paragraphSelector} a {
        font-size: ${fontSize} !important;
      }
    `;

  // Create selector based on tag type
  let linkSelector = "";
  if (selectedSingleTextType === "paragraph1") {
    linkSelector = `#${block.id} p.sqsrte-large a`;
  } else if (selectedSingleTextType === "paragraph2") {
    linkSelector = `#${block.id} p:not(.sqsrte-large):not(.sqsrte-small) a`;
  } else if (selectedSingleTextType === "paragraph3") {
    linkSelector = `#${block.id} p.sqsrte-small a`;
  } else if (selectedSingleTextType.startsWith("heading")) {
    const headingNumber = selectedSingleTextType.replace("heading", "");
    linkSelector = `#${block.id} h${headingNumber} a`;
  } else {
    linkSelector = `#${block.id} ${selectedSingleTextType} a`;
  }

  // Get existing styles from the map
  const styleKey = `${block.id}-${selectedSingleTextType}`;
  const existingStyles = linkTextStyleMap.get(styleKey)?.linkText?.styles || {};

  console.log("🔍 Font Size - Before saving, existing styles:", existingStyles);
  logStyleMapState(block.id, selectedSingleTextType);

  // Save to database while preserving existing styles
  await mergeAndSaveLinkTextStyles(
    block.id,
    selectedSingleTextType,
    {
      linkText: {
        selector: linkSelector,
        styles: {
          ...existingStyles, // Preserve existing styles
          "font-size": fontSize,
        },
      },
    },
    saveLinkTextModifications
  );

  console.log("🔍 Font Size - After saving:");
  logStyleMapState(block.id, selectedSingleTextType);

  // Update Active Tab UI
  document.querySelectorAll('[id^="scFontSizeInputLink"]').forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedInput.classList.remove("sc-inActiveTab-border");
  clickedInput.classList.add("sc-activeTab-border");

  showNotification(
    `✅ Font-size applied to Links inside ${selectedSingleTextType}`,
    "success"
  );
}

export async function handleTextTransformLinkClick(
  event = null,
  context = null
) {
  console.log("🚀 handleTextTransformLinkClick called with:", {
    event,
    context,
  });

  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    saveLinkTextModifications,
    showNotification,
  } = context || {};

  // Validate that we have the required functions
  if (typeof saveLinkTextModifications !== "function") {
    console.error("❌ saveLinkTextModifications is not a function");
    return;
  }

  if (typeof showNotification !== "function") {
    console.error("❌ showNotification is not a function");
    return;
  }

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scTextTransform"].sc-activeTab-border'
    );
    console.log("🔍 Active button found:", activeButton);
    if (!activeButton) {
      console.log("❌ No active button found");
      return;
    }
    event = { target: activeButton };
  }

  // Get the clicked transform button
  const clickedTransform = event.target.closest("[datalink-text-transform]");
  console.log("🔎 Clicked transform button:", clickedTransform);
  if (!clickedTransform) {
    console.log("❌ No transform button found");
    return;
  }

  // Get the text transform value from the data attribute
  const textTransform = clickedTransform.getAttribute(
    "datalink-text-transform"
  );
  console.log("🔎 Text transform value:", textTransform);

  if (!lastClickedElement) {
    console.log("❌ No last clicked element");
    showNotification("Please select a block first", "error");
    return;
  }

  if (!selectedSingleTextType) {
    console.log("❌ No selected text type");
    showNotification("Please select a text type first", "error");
    return;
  }

  const block = lastClickedElement.closest('[id^="block-"]');
  console.log("🔍 Found block:", block);
  if (!block) {
    console.log("❌ No block found");
    showNotification("Block not found", "error");
    return;
  }

  // Correct Paragraph Selector Setup
  let paragraphSelector = "";
  if (selectedSingleTextType === "paragraph1") {
    paragraphSelector = "p.sqsrte-large";
  } else if (selectedSingleTextType === "paragraph2") {
    paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
  } else if (selectedSingleTextType === "paragraph3") {
    paragraphSelector = "p.sqsrte-small";
  } else if (selectedSingleTextType.startsWith("heading")) {
    paragraphSelector = `h${selectedSingleTextType.replace("heading", "")}`;
  } else {
    paragraphSelector = selectedSingleTextType;
  }
  console.log("🔍 Using paragraph selector:", paragraphSelector);

  // Check if there are any a tags in the selected elements
  const targetElements = block.querySelectorAll(paragraphSelector);
  console.log("🔍 Found target elements:", targetElements.length);
  if (!targetElements.length) {
    console.log("❌ No target elements found");
    showNotification(
      `No ${selectedSingleTextType} found inside block`,
      "error"
    );
    return;
  }

  // Check for <a> tags in the selected tag
  let hasLinkTags = false;
  targetElements.forEach((element) => {
    const linkTags = element.querySelectorAll("a");
    console.log("🔍 Found a tags in element:", linkTags.length);
    if (linkTags.length > 0) {
      hasLinkTags = true;
    }
  });

  if (!hasLinkTags) {
    console.log("❌ No a tags found in selected tag");
    showNotification(
      `No link text (<a>) found in ${selectedSingleTextType}`,
      "info"
    );
    return;
  }

  // Dynamic CSS Inject
  const linkStyleId = `style-${block.id}-${selectedSingleTextType}-link-texttransform`;
  console.log("🔍 Using style ID:", linkStyleId);

  // Remove any old style tag for this block/tag
  let oldStyleTag = document.getElementById(linkStyleId);
  if (oldStyleTag) oldStyleTag.remove();

  // Create new style tag that only targets a tags
  let styleTag = document.createElement("style");
  styleTag.id = linkStyleId;

  // Only apply text-transform to a tags and their colored spans
  const cssRule = `
    #${block.id} ${paragraphSelector} a,
    #${block.id} ${paragraphSelector} a span[class^='sqsrte-text-color'] {
      text-transform: ${textTransform} !important;
    }
  `;

  styleTag.innerHTML = cssRule;
  document.head.appendChild(styleTag);
  console.log("🔍 Applying CSS rule:", cssRule);

  // Create selector based on tag type
  let linkSelector = "";
  if (selectedSingleTextType === "paragraph1") {
    linkSelector = `#${block.id} p.sqsrte-large a`;
  } else if (selectedSingleTextType === "paragraph2") {
    linkSelector = `#${block.id} p:not(.sqsrte-large):not(.sqsrte-small) a`;
  } else if (selectedSingleTextType === "paragraph3") {
    linkSelector = `#${block.id} p.sqsrte-small a`;
  } else if (selectedSingleTextType.startsWith("heading")) {
    const headingNumber = selectedSingleTextType.replace("heading", "");
    linkSelector = `#${block.id} h${headingNumber} a`;
  } else {
    linkSelector = `#${block.id} ${selectedSingleTextType} a`;
  }

  // Get existing styles from the map
  const styleKey = `${block.id}-${selectedSingleTextType}`;
  const existingStyles = linkTextStyleMap.get(styleKey)?.linkText?.styles || {};

  console.log(
    "🔍 Text Transform - Before saving, existing styles:",
    existingStyles
  );
  logStyleMapState(block.id, selectedSingleTextType);

  // Save to database while preserving existing styles
  await mergeAndSaveLinkTextStyles(
    block.id,
    selectedSingleTextType,
    {
      linkText: {
        selector: linkSelector,
        styles: {
          ...existingStyles, // Preserve existing styles
          "text-transform": textTransform,
        },
      },
    },
    saveLinkTextModifications
  );

  console.log("🔍 Text Transform - After saving:");
  logStyleMapState(block.id, selectedSingleTextType);

  console.log("✅ Saved modification");

  // Update Active Tab UI
  document.querySelectorAll("[datalink-text-transform]").forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedTransform.classList.remove("sc-inActiveTab-border");
  clickedTransform.classList.add("sc-activeTab-border");
  console.log("✅ Updated UI");

  showNotification(
    `✅ Text transform applied to link text in ${selectedSingleTextType}`,
    "success"
  );
}

// export async function handleFontWeightLink(event, context) {
//   console.log("🚀 handleFontWeightLink called with:", { event, context });

//   const {
//     lastClickedElement,
//     selectedSingleTextType,
//     addPendingModification,
//     saveLinkTextModifications,
//     showNotification,
//   } = context;

//   console.log("🔍 Context values:", {
//     lastClickedElement: !!lastClickedElement,
//     selectedSingleTextType,
//     hasSaveLinkTextModifications: typeof saveLinkTextModifications === 'function',
//     hasShowNotification: typeof showNotification === 'function'
//   });

//   const fontWeightSelect = document.getElementById("squareCraftLinkFontWeight");
//   console.log("🔍 Font weight select found:", !!fontWeightSelect);

//   if (!fontWeightSelect) {
//     showNotification("Font weight selector not found.", "error");
//     return;
//   }

//   const fontWeight = fontWeightSelect.value;
//   console.log("🔍 Selected font weight value:", fontWeight);

//   if (!fontWeight) {
//     showNotification("Please select a font-weight.", "error");
//     return;
//   }

//   if (!lastClickedElement) {
//     showNotification("❌ Please select a block first.", "error");
//     return;
//   }

//   if (!selectedSingleTextType) {
//     showNotification("❌ Please select a text type (h1, h2, p1 etc).", "error");
//     return;
//   }

//   // 🔁 Normalize text type to always use h1/h2/.../p1/p2/p3
//   const normalizedType = selectedSingleTextType
//     .replace("heading", "h")
//     .replace("paragraph", "p");

//   const typeMap = {
//     h1: "h1",
//     h2: "h2",
//     h3: "h3",
//     h4: "h4",
//     p1: "p.sqsrte-large",
//     p2: "p:not(.sqsrte-large):not(.sqsrte-small)",
//     p3: "p.sqsrte-small",
//   };

//   const selector = typeMap[normalizedType];
//   if (!selector) {
//     showNotification(
//       "❌ Invalid text type selected: " + normalizedType,
//       "error"
//     );
//     return;
//   }

//   console.log("selectedSingleTextType:", selectedSingleTextType);
//   console.log("normalizedType:", normalizedType);

//   const block = lastClickedElement.closest('[id^="block-"]');
//   if (!block) {
//     showNotification("❌ Block not found.", "error");
//     return;
//   }

//   const elements = block.querySelectorAll(selector);
//   console.log("🔍 Found elements with selector:", selector, "Count:", elements.length);

//   if (!elements.length) {
//     showNotification(`No ${normalizedType} elements found.`, "error");
//     return;
//   }

//   let linkFound = false;
//   let totalLinks = 0;

//   elements.forEach((el, index) => {
//     // Only look for <a> tags, not <em> or <strong> tags
//     const links = el.querySelectorAll("a");
//     console.log(`🔍 Element ${index}:`, el.tagName, "Links found:", links.length);

//     // Debug: Show all child elements to verify we're not targeting em/strong
//     const allChildren = el.querySelectorAll("*");
//     console.log(`🔍 All child elements in element ${index}:`, Array.from(allChildren).map(child => child.tagName));

//     if (links.length > 0) {
//       linkFound = true;
//       totalLinks += links.length;
//       links.forEach((link, linkIndex) => {
//         // Apply font-weight directly to the link element (a tag only)
//         link.style.fontWeight = fontWeight;
//         console.log(`🔍 Applied font-weight: ${fontWeight} to link ${linkIndex}:`, link.textContent.substring(0, 20), "Tag:", link.tagName);
//       });
//     }
//   });

//   console.log("🔍 Total links processed:", totalLinks);

//   if (!linkFound) {
//     showNotification(
//       `ℹ️ No links (<a>) found inside ${selectedSingleTextType}`,
//       "info"
//     );
//     return;
//   }

//   // Create CSS style tag for persistent styling
//   const styleId = `style-${block.id}-${selectedSingleTextType}-link-fontweight`;
//   let styleTag = document.getElementById(styleId);

//   // Remove existing style tag if it exists
//   if (styleTag) {
//     styleTag.remove();
//   }

//   // Create new style tag
//   styleTag = document.createElement("style");
//   styleTag.id = styleId;

//   // Create the correct CSS selector that ONLY targets a tags, not em or strong tags
//   // This ensures font-weight is applied only to links, not to italic or bold text
//   const cssSelector = `#${block.id} ${selector} a`;
//   const cssRule = `${cssSelector} { font-weight: ${fontWeight} !important; }`;

//   styleTag.innerHTML = cssRule;
//   document.head.appendChild(styleTag);

//   console.log("🔍 Injected CSS:", cssRule);
//   console.log("🔍 Style tag ID:", styleId);
//   console.log("🔍 Note: CSS only targets <a> tags, not <em> or <strong> tags");

//   // Create selector for database saving
//   let linkSelector = "";
//   if (selectedSingleTextType === "paragraph1") {
//     linkSelector = `#${block.id} p.sqsrte-large a`;
//   } else if (selectedSingleTextType === "paragraph2") {
//     linkSelector = `#${block.id} p:not(.sqsrte-large):not(.sqsrte-small) a`;
//   } else if (selectedSingleTextType === "paragraph3") {
//     linkSelector = `#${block.id} p.sqsrte-small a`;
//   } else if (selectedSingleTextType.startsWith("heading")) {
//     const headingNumber = selectedSingleTextType.replace("heading", "");
//     linkSelector = `#${block.id} h${headingNumber} a`;
//   } else {
//     linkSelector = `#${block.id} ${selectedSingleTextType} a`;
//   }

//   // Get existing styles from the map
//   const styleKey = `${block.id}-${selectedSingleTextType}`;
//   const existingStyles = linkTextStyleMap.get(styleKey)?.linkText?.styles || {};

//   console.log("🔍 Font Weight - Before saving, existing styles:", existingStyles);
//   logStyleMapState(block.id, selectedSingleTextType);

//   // Save to database while preserving existing styles
//   await mergeAndSaveLinkTextStyles(
//     block.id,
//     selectedSingleTextType,
//     {
//       linkText: {
//         selector: linkSelector,
//         styles: {
//           ...existingStyles, // Preserve existing styles
//           "font-weight": fontWeight,
//         },
//       },
//     },
//     saveLinkTextModifications
//   );

//   console.log("🔍 Font Weight - After saving:");
//   logStyleMapState(block.id, selectedSingleTextType);

//   console.log("✅ Saved font-weight to database");

//   showNotification(
//     `✅ Font weight applied to link words in ${selectedSingleTextType}`,
//     "success"
//   );

//   console.log("✅ handleFontWeightLink completed successfully. 🎉");
// }

export async function handleFontWeightLink(event, context) {
  console.log("🚀 handleFontWeightLink called with:", { event, context });

  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    saveLinkTextModifications,
    showNotification,
  } = context;

  console.log("🔍 Context values:", {
    lastClickedElement: !!lastClickedElement,
    selectedSingleTextType,
    hasSaveLinkTextModifications:
      typeof saveLinkTextModifications === "function",
    hasShowNotification: typeof showNotification === "function",
  });

  const fontWeightSelect = document.getElementById("squareCraftLinkFontWeight");
  console.log("🔍 Font weight select found:", !!fontWeightSelect);

  if (!fontWeightSelect) {
    showNotification("Font weight selector not found.", "error");
    return;
  }

  const fontWeight = fontWeightSelect.value;
  console.log("🔍 Selected font weight value:", fontWeight);

  if (!fontWeight) {
    showNotification("Please select a font-weight.", "error");
    return;
  }

  if (!lastClickedElement) {
    showNotification("❌ Please select a block first.", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification("❌ Please select a text type (h1, h2, p1 etc).", "error");
    return;
  }

  // 🔁 Normalize text type to always use h1/h2/.../p1/p2/p3
  const normalizedType = selectedSingleTextType
    .replace("heading", "h")
    .replace("paragraph", "p");

  const typeMap = {
    h1: "h1",
    h2: "h2",
    h3: "h3",
    h4: "h4",
    p1: "p.sqsrte-large",
    p2: "p:not(.sqsrte-large):not(.sqsrte-small)",
    p3: "p.sqsrte-small",
  };

  const selector = typeMap[normalizedType];
  if (!selector) {
    showNotification(
      "❌ Invalid text type selected: " + normalizedType,
      "error"
    );
    return;
  }

  console.log("selectedSingleTextType:", selectedSingleTextType);
  console.log("normalizedType:", normalizedType);

  const block = lastClickedElement.closest('[id^="block-"]');
  if (!block) {
    showNotification("❌ Block not found.", "error");
    return;
  }

  const elements = block.querySelectorAll(selector);
  console.log(
    "🔍 Found elements with selector:",
    selector,
    "Count:",
    elements.length
  );

  if (!elements.length) {
    showNotification(`No ${normalizedType} elements found.`, "error");
    return;
  }

  let linkFound = false;
  let totalLinks = 0;

  elements.forEach((el, index) => {
    // Only look for <a> tags, not <em> or <strong> tags
    const links = el.querySelectorAll("a");
    console.log(
      `🔍 Element ${index}:`,
      el.tagName,
      "Links found:",
      links.length
    );

    // Debug: Show all child elements to verify we're not targeting em/strong
    const allChildren = el.querySelectorAll("*");
    console.log(
      `🔍 All child elements in element ${index}:`,
      Array.from(allChildren).map((child) => child.tagName)
    );

    if (links.length > 0) {
      linkFound = true;
      totalLinks += links.length;
      links.forEach((link, linkIndex) => {
        // Apply font-weight directly to the link element (a tag only)
        link.style.fontWeight = fontWeight;
        console.log(
          `🔍 Applied font-weight: ${fontWeight} to link ${linkIndex}:`,
          link.textContent.substring(0, 20),
          "Tag:",
          link.tagName
        );
      });
    }
  });

  console.log("🔍 Total links processed:", totalLinks);

  if (!linkFound) {
    showNotification(
      `ℹ️ No links (<a>) found inside ${selectedSingleTextType}`,
      "info"
    );
    return;
  }

  // Create CSS style tag for persistent styling
  const styleId = `style-${block.id}-${selectedSingleTextType}-link-fontweight`;
  let styleTag = document.getElementById(styleId);

  // Remove existing style tag if it exists
  if (styleTag) {
    styleTag.remove();
  }

  // Create new style tag
  styleTag = document.createElement("style");
  styleTag.id = styleId;

  // Create the correct CSS selector that ONLY targets a tags, not em or strong tags
  // This ensures font-weight is applied only to links, not to italic or bold text
  const cssSelector = `#${block.id} ${selector} a`;
  const cssRule = `${cssSelector} { font-weight: ${fontWeight} !important; }`;

  styleTag.innerHTML = cssRule;
  document.head.appendChild(styleTag);

  console.log("🔍 Injected CSS:", cssRule);
  console.log("🔍 Style tag ID:", styleId);
  console.log("🔍 Note: CSS only targets <a> tags, not <em> or <strong> tags");

  // Create selector for database saving
  let linkSelector = "";
  if (selectedSingleTextType === "paragraph1") {
    linkSelector = `#${block.id} p.sqsrte-large a`;
  } else if (selectedSingleTextType === "paragraph2") {
    linkSelector = `#${block.id} p:not(.sqsrte-large):not(.sqsrte-small) a`;
  } else if (selectedSingleTextType === "paragraph3") {
    linkSelector = `#${block.id} p.sqsrte-small a`;
  } else if (selectedSingleTextType.startsWith("heading")) {
    const headingNumber = selectedSingleTextType.replace("heading", "");
    linkSelector = `#${block.id} h${headingNumber} a`;
  } else {
    linkSelector = `#${block.id} ${selectedSingleTextType} a`;
  }

  // Get existing styles from the map (if using a style map)
  const styleKey = `${block.id}-${selectedSingleTextType}`;
  const existingStyles = {}; // Initialize empty if no style map is used

  console.log(
    "🔍 Font Weight - Before saving, existing styles:",
    existingStyles
  );

  // Save to database if saveLinkTextModifications function is available
  if (typeof saveLinkTextModifications === "function") {
    await saveLinkTextModifications(
      block.id,
      {
        linkText: {
          selector: linkSelector,
          styles: {
            ...existingStyles, // Preserve existing styles
            "font-weight": fontWeight,
          },
        },
      },
      "link"
    );

    console.log("✅ Saved font-weight to database");
  }

  showNotification(
    `✅ Font weight applied to link words in ${selectedSingleTextType}`,
    "success"
  );

  console.log("✅ handleFontWeightLink completed successfully. 🎉");
}

export function handleLinkTextHighlightClick(
  event,
  lastClickedElement,
  applyStylesToElement,
  context
) {
  // Check if we have a valid lastClickedElement
  if (!lastClickedElement) {
    context.showNotification("Please select a block first", "error");
    return;
  }

  if (!event) {
    event = {
      target: document.getElementById("LinktextHighlightColorPalate"),
    };
  }

  const LinktextHighlightColorPalate = event.target.closest(
    "#LinktextHighlightColorPalate"
  );
  if (!LinktextHighlightColorPalate) return;

  // Create fresh context
  colorPickerContext = {
    ...context,
    lastClickedElement,
    selectedSingleTextType: context.selectedSingleTextType,
  };

  // Create hidden color input if not already created
  if (!colorPalette) {
    colorPalette = document.createElement("input");
    colorPalette.type = "color";
    colorPalette.id = "scHighlightPalette";
    colorPalette.style.opacity = "0";
    colorPalette.style.width = "0px";
    colorPalette.style.height = "0px";
    colorPalette.style.marginTop = "14px";

    const widgetContainer = document.getElementById("sc-widget-container");
    if (widgetContainer) {
      widgetContainer.appendChild(colorPalette);
    } else {
      document.body.appendChild(colorPalette);
    }

    colorPalette.addEventListener("input", async function (event) {
      const selectedColor = event.target.value;

      if (!colorPickerContext?.lastClickedElement) {
        colorPickerContext.showNotification(
          "Please select a block first",
          "error"
        );
        return;
      }

      // Update color palette display
      const textHighlightPalate = document.getElementById(
        "LinktextHighlightColorPalate"
      );
      if (textHighlightPalate) {
        textHighlightPalate.style.backgroundColor = selectedColor;
      }

      const LinktextHighlightHtml = document.getElementById(
        "LinktextHighlightHtml"
      );
      if (LinktextHighlightHtml) {
        LinktextHighlightHtml.textContent = selectedColor;
      }

      // Get selected text type
      const selectedTab = document.querySelector(".sc-selected-tab");
      let selectedTextType = null;

      if (selectedTab) {
        if (selectedTab.id.startsWith("heading")) {
          selectedTextType = `heading${selectedTab.id.replace("heading", "")}`;
        } else if (selectedTab.id.startsWith("paragraph")) {
          selectedTextType = `paragraph${selectedTab.id.replace(
            "paragraph",
            ""
          )}`;
        }
      }

      if (!selectedTextType && colorPickerContext?.selectedSingleTextType) {
        selectedTextType = colorPickerContext.selectedSingleTextType;
      }

      // Validate that we have a selectedTextType before proceeding
      if (!selectedTextType) {
        colorPickerContext.showNotification(
          "Please select a text type first",
          "error"
        );
        return;
      }

      // Find the block element
      const block =
        colorPickerContext.lastClickedElement.closest('[id^="block-"]');
      if (!block) {
        colorPickerContext.showNotification("Block not found", "error");
        return;
      }

      // Define selectors for different text types
      const selectorMap = {
        paragraph1: "p.sqsrte-large",
        paragraph2: "p:not(.sqsrte-large):not(.sqsrte-small)",
        paragraph3: "p.sqsrte-small",
        heading1: "h1",
        heading2: "h2",
        heading3: "h3",
        heading4: "h4",
      };

      // Try to get the selector from the map, with fallback to a general selector
      let paragraphSelector = selectorMap[selectedTextType];

      // If no specific selector found, use a general fallback
      if (!paragraphSelector) {
        if (selectedTextType && selectedTextType.startsWith("heading")) {
          paragraphSelector = selectedTextType; // Use the heading tag directly
        } else if (
          selectedTextType &&
          selectedTextType.startsWith("paragraph")
        ) {
          paragraphSelector = "p"; // Use all paragraphs as fallback
        } else {
          paragraphSelector = "p, h1, h2, h3, h4"; // Ultimate fallback
        }
      }

      // Validate that we have a valid selector before proceeding
      if (!paragraphSelector) {
        colorPickerContext.showNotification(
          `Invalid text type: ${selectedTextType}. Please select a valid text type first.`,
          "error"
        );
        return;
      }

      const targetElements = block.querySelectorAll(paragraphSelector);

      if (!targetElements.length) {
        colorPickerContext.showNotification(
          `No ${selectedTextType} found in the block`,
          "error"
        );
        return;
      }

      let LinkFound = false;
      let LinkCount = 0;

      // Find and highlight all bold text
      targetElements.forEach((tag) => {
        const boldElements = tag.querySelectorAll("a");
        if (boldElements.length > 0) {
          LinkFound = true;
          LinkCount += boldElements.length;

          // Create or update style tag for this block's Link tags
          let styleTag = document.getElementById(
            `style-${block.id}-Link-highlight`
          );
          if (!styleTag) {
            styleTag = document.createElement("style");
            styleTag.id = `style-${block.id}-Link-highlight`;
            document.head.appendChild(styleTag);
          }

          // Remove any inline styles from parent elements
          tag.style.backgroundColor = "";

          // Apply highlight color to Link tags using linear gradient
          const cssRule = `#${block.id} ${paragraphSelector} a {
            background-image: linear-gradient(to top, ${selectedColor} 50%, transparent 50%) !important;
          }`;

          styleTag.innerHTML = cssRule;
        }
      });

      if (!LinkFound) {
        colorPickerContext.showNotification(
          `No Link (<a>) text found in ${selectedTextType}. Please add some Link text first.`,
          "info"
        );
        return;
      }

      // Create selector based on tag type
      let linkSelector = "";
      if (selectedTextType === "paragraph1") {
        linkSelector = `#${block.id} p.sqsrte-large a`;
      } else if (selectedTextType === "paragraph2") {
        linkSelector = `#${block.id} p:not(.sqsrte-large):not(.sqsrte-small) a`;
      } else if (selectedTextType === "paragraph3") {
        linkSelector = `#${block.id} p.sqsrte-small a`;
      } else if (selectedTextType.startsWith("heading")) {
        const headingNumber = selectedTextType.replace("heading", "");
        linkSelector = `#${block.id} h${headingNumber} a`;
      } else {
        linkSelector = `#${block.id} ${selectedTextType} a`;
      }

      // Get existing styles from the map
      const styleKey = `${block.id}-${selectedTextType}`;
      const existingStyles =
        linkTextStyleMap.get(styleKey)?.linkText?.styles || {};

      console.log("🔍 Link Text Highlight - Existing styles:", existingStyles);
      console.log("🔍 Link Text Highlight - Style key:", styleKey);
      logStyleMapState(block.id, selectedTextType);

      // Save to database while preserving existing styles
      await mergeAndSaveLinkTextStyles(
        block.id,
        selectedTextType,
        {
          linkText: {
            selector: linkSelector,
            styles: {
              ...existingStyles, // Preserve existing styles
              "background-color": selectedColor,
            },
          },
        },
        colorPickerContext.saveLinkTextModifications
      );

      console.log("🔍 Link Text Highlight - After saving:");
      logStyleMapState(block.id, selectedTextType);
      console.log(
        "✅ Link Text Highlight - Saved to database with preserved styles"
      );

      colorPickerContext.showNotification(
        `✅ Text highlight applied to ${LinkCount} link word(s) in ${selectedTextType}`,
        "success"
      );
    });
  }

  // Open color picker
  setTimeout(() => {
    colorPalette.click();
  }, 50);
}
