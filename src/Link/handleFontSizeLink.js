const linkTextStyleMap = new Map();

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
  const finalSelector = newStyles.linkText?.selector || prevStyles.linkText.selector;

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
    finalSelector
  });

  // Save to map and database
  linkTextStyleMap.set(styleKey, finalData);
  await saveLinkTextModifications(blockId, finalData, "link");
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

export async function handleTextTransformLinkClick(event = null, context = null) {
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
    hasSaveLinkTextModifications: typeof saveLinkTextModifications === 'function',
    hasShowNotification: typeof showNotification === 'function'
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
  console.log("🔍 Found elements with selector:", selector, "Count:", elements.length);
  
  if (!elements.length) {
    showNotification(`No ${normalizedType} elements found.`, "error");
    return;
  }

  let linkFound = false;
  let totalLinks = 0;
  
  elements.forEach((el, index) => {
    // Only look for <a> tags, not <em> or <strong> tags
    const links = el.querySelectorAll("a");
    console.log(`🔍 Element ${index}:`, el.tagName, "Links found:", links.length);
    
    // Debug: Show all child elements to verify we're not targeting em/strong
    const allChildren = el.querySelectorAll("*");
    console.log(`🔍 All child elements in element ${index}:`, Array.from(allChildren).map(child => child.tagName));
    
    if (links.length > 0) {
      linkFound = true;
      totalLinks += links.length;
      links.forEach((link, linkIndex) => {
        // Apply font-weight directly to the link element (a tag only)
        link.style.fontWeight = fontWeight;
        console.log(`🔍 Applied font-weight: ${fontWeight} to link ${linkIndex}:`, link.textContent.substring(0, 20), "Tag:", link.tagName);
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

  // Get existing styles from the map
  const styleKey = `${block.id}-${selectedSingleTextType}`;
  const existingStyles = linkTextStyleMap.get(styleKey)?.linkText?.styles || {};

  // Save to database while preserving existing styles
  await mergeAndSaveLinkTextStyles(
    block.id,
    selectedSingleTextType,
    {
      linkText: {
        selector: linkSelector,
        styles: {
          ...existingStyles, // Preserve existing styles
          "font-weight": fontWeight,
        },
      },
    },
    saveLinkTextModifications
  );

  console.log("✅ Saved font-weight to database");

  showNotification(
    `✅ Font weight applied to link words in ${selectedSingleTextType}`,
    "success"
  );
  
  console.log("✅ handleFontWeightLink completed successfully. 🎉");
}

