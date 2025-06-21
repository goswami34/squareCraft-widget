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

export function handleItalicFontSizeClick(event = null, context = null) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    saveModifications,
  } = context;

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scFontSizeItalicInput"].sc-activeTab-border'
    );
    if (!activeButton) return;
    event = { target: activeButton };
  }

  const clickedInput = event.target.closest('[id^="scFontSizeItalicInput"]');
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

  console.log(
    "🔎 Applying font-size to italic text inside:",
    paragraphSelector
  );

  const targetElements = block.querySelectorAll(paragraphSelector);
  if (!targetElements.length) {
    showNotification(
      `No ${selectedSingleTextType} found inside block`,
      "error"
    );
    return;
  }

  let italicFound = false;

  // targetElements.forEach((tag) => {
  //   const italicElements = tag.querySelectorAll("em");
  //   if (italicElements.length > 0) {
  //     italicFound = true;
  //   }
  // });

  // ✅ Clean up invalid inline font-weight from <em> elements
  targetElements.forEach((tag) => {
    const italicElements = tag.querySelectorAll("em");
    if (italicElements.length > 0) {
      italicFound = true;
    }
    italicElements.forEach((em) => {
      const fw = em.style.fontWeight;
      const fwNum = parseInt(fw);
      if (!isNaN(fwNum) && (fwNum < 100 || fwNum > 900 || fwNum % 100 !== 0)) {
        em.style.removeProperty("font-weight");
      }
    });
  });

  if (!italicFound) {
    showNotification(
      `No italic text (<em>) inside ${selectedSingleTextType}`,
      "info"
    );
    return;
  }

  // Create or update external CSS
  // const styleId = `style-${block.id}-${selectedSingleTextType}-italic-fontsize`;
  // console.log("🔎 styleId:", styleId);
  // let styleTag = document.getElementById(styleId);

  // if (!styleTag) {
  //   styleTag = document.createElement("style");
  //   styleTag.id = styleId;
  //   document.head.appendChild(styleTag);
  // }

  // // Apply CSS using external stylesheet
  // styleTag.innerHTML = `
  //   #${block.id} ${paragraphSelector} em {
  //     font-size: ${fontSize} !important;
  //   }
  // `;

  // Apply CSS using external stylesheet
  const cssClassId = `${block.id}-${selectedSingleTextType}-italic-fontsize-style`;
  let styleTag = document.getElementById(cssClassId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = cssClassId;
    document.head.appendChild(styleTag);
  }

  // Build the CSS rule: #block-id h2 em { font-size: 18px !important; }
  const rule = `
  #${block.id} ${paragraphSelector} em {
    font-size: ${fontSize} !important;
  }
`;

  styleTag.innerHTML = rule;

  // Save Modification (for API persistence)
  addPendingModification(
    block.id,
    {
      "font-size": fontSize,
      target: selectedSingleTextType,
    },
    "em"
  );

  // Update Active Tab UI
  document.querySelectorAll('[id^="scFontSizeItalicInput"]').forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedInput.classList.remove("sc-inActiveTab-border");
  clickedInput.classList.add("sc-activeTab-border");

  showNotification(
    `✅ Font-size applied to italic text inside ${selectedSingleTextType}`,
    "success"
  );
}
