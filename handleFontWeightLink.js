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
