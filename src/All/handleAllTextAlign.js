// ✅ Notification function
function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `sc-notification sc-notification-${type}`;
  notification.textContent = message;

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

  setTimeout(() => {
    notification.style.animation = "fadeOut 0.3s ease-in-out";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, 3000);
}

// ✅ Apply data attributes to elements for better targeting
function applyDataTextTypeAttributes(block) {
  // Clear existing data attributes
  block.querySelectorAll("[data-text-type]").forEach((el) => {
    el.removeAttribute("data-text-type");
  });

  // Apply data attributes based on element types
  block.querySelectorAll("h1").forEach((el, index) => {
    el.setAttribute("data-text-type", `heading1-${index}`);
  });

  block.querySelectorAll("h2").forEach((el, index) => {
    el.setAttribute("data-text-type", `heading2-${index}`);
  });

  block.querySelectorAll("h3").forEach((el, index) => {
    el.setAttribute("data-text-type", `heading3-${index}`);
  });

  block.querySelectorAll("h4").forEach((el, index) => {
    el.setAttribute("data-text-type", `heading4-${index}`);
  });

  block.querySelectorAll("p.sqsrte-large").forEach((el, index) => {
    el.setAttribute("data-text-type", `paragraph1-${index}`);
  });

  block
    .querySelectorAll("p:not(.sqsrte-large):not(.sqsrte-small)")
    .forEach((el, index) => {
      el.setAttribute("data-text-type", `paragraph2-${index}`);
    });

  block.querySelectorAll("p.sqsrte-small").forEach((el, index) => {
    el.setAttribute("data-text-type", `paragraph3-${index}`);
  });
}

// ✅ Main align handler
export function handleAllTextAlignClick(event = null, context = null) {
  const { lastClickedElement, selectedSingleTextType, addPendingModification } =
    context;

  if (!lastClickedElement) {
    showNotification("Please select a block first", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification("Please select a text type first", "error");
    return;
  }

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scTextAlign"].sc-activeTab-border'
    );
    if (!activeButton) {
      showNotification("Please select a text alignment option", "error");
      return;
    }
  }

  const textAlign = event?.target?.getAttribute("data-align") || "left";
  const block = lastClickedElement;

  applyDataTextTypeAttributes(block);

  // 🔍 Define tag + attribute mapping
  const typeToTag = {
    paragraph1: "p.sqsrte-large",
    paragraph2: "p:not(.sqsrte-large):not(.sqsrte-small)",
    paragraph3: "p.sqsrte-small",
    heading1: "h1",
    heading2: "h2",
    heading3: "h3",
    heading4: "h4",
  };

  const selector = typeToTag[selectedSingleTextType];
  if (!selector) {
    showNotification(
      "Unsupported text type: " + selectedSingleTextType,
      "error"
    );
    return;
  }

  // ✅ Find elements with the specific data attribute pattern
  const elements = block.querySelectorAll(
    `[data-text-type^="${selectedSingleTextType}-"]`
  );
  if (!elements.length) {
    showNotification(`No text found for ${selectedSingleTextType}`, "error");
    return;
  }

  // Clear inline style
  elements.forEach((el) => {
    el.style.textAlign = "";
  });

  // 💡 Inject highly specific CSS using data attributes
  const styleId = `style-${block.id}-${selectedSingleTextType}-textalign`;
  let styleTag = document.getElementById(styleId);
  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  // Create specific CSS selector using data attributes
  const specificSelector = `#${block.id} [data-text-type^="${selectedSingleTextType}-"]`;

  styleTag.innerHTML = `
    ${specificSelector} {
      text-align: ${textAlign} !important;
    }
  `;

  // ✅ Add to pending modifications
  addPendingModification(
    block.id,
    {
      target: specificSelector,
      "text-align": textAlign,
    },
    selectedSingleTextType
  );

  // UI state
  document.querySelectorAll('[id^="scTextAlign"]').forEach((el) => {
    el.classList.remove("sc-activeTab-border");
  });

  if (event?.target) {
    event.target.classList.add("sc-activeTab-border");
  }

  showNotification(
    `Text-align "${textAlign}" applied to ${selectedSingleTextType}`,
    "success"
  );
}
