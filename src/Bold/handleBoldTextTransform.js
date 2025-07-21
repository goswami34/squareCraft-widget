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

export function handleBoldElementTextTransformClick(
  event = null,
  context = null
) {
  console.log("🚀 handleBoldElementTextTransformClick called with:", {
    event,
    context,
  });

  const {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    saveModifications,
  } = context || {};

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
  const clickedTransform = event.target.closest("[data-bold-text-transform]");
  console.log("🔎 Clicked transform button:", clickedTransform);
  if (!clickedTransform) {
    console.log("❌ No transform button found");
    return;
  }

  // Get the text transform value from the data attribute
  const textTransform = clickedTransform.getAttribute(
    "data-bold-text-transform"
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

  // Check if there are any em tags in the selected elements
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

  // Check for <em> tags in the selected tag
  let hasEmTags = false;
  targetElements.forEach((element) => {
    const strongTags = element.querySelectorAll("strong");
    console.log("🔍 Found strong tags in element:", strongTags.length);
    if (strongTags.length > 0) {
      hasEmTags = true;
    }
  });

  if (!hasEmTags) {
    console.log("❌ No strong tags found in selected tag");
    showNotification(
      `No italic text (<strong>) found in ${selectedSingleTextType}`,
      "info"
    );
    return;
  }

  // Dynamic CSS Inject
  const italicStyleId = `style-${block.id}-${selectedSingleTextType}-italic-texttransform`;
  console.log("🔍 Using style ID:", italicStyleId);

  // Remove any old style tag for this block/tag
  let oldStyleTag = document.getElementById(italicStyleId);
  if (oldStyleTag) oldStyleTag.remove();

  // Create new style tag that only targets em tags
  let styleTag = document.createElement("style");
  styleTag.id = italicStyleId;

  // Only apply text-transform to em tags and their colored spans
  const cssRule = `
    #${block.id} ${paragraphSelector} strong,
    #${block.id} ${paragraphSelector} strong span[class^='sqsrte-text-color'] {
      text-transform: ${textTransform} !important;
    }
  `;

  styleTag.innerHTML = cssRule;
  document.head.appendChild(styleTag);
  console.log("🔍 Applying CSS rule:", cssRule);

  // Save Modification (for API persistence)
  addPendingModification(
    block.id,
    {
      "text-transform": textTransform,
      target: selectedSingleTextType,
    },
    "strong"
  );
  console.log("✅ Saved modification");

  // Update Active Tab UI
  document.querySelectorAll("[data-bold-text-transform]").forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedTransform.classList.remove("sc-inActiveTab-border");
  clickedTransform.classList.add("sc-activeTab-border");
  console.log("✅ Updated UI");

  showNotification(
    `✅ Text transform applied to Bold text in ${selectedSingleTextType}`,
    "success"
  );
}
