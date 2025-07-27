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

export async function handleAllFontSizeClick(event = null, context = null) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    saveTypographyAllModifications,
    addPendingModification,
    showNotification,
  } = context;

  if (!event) {
    const activeButton = document.querySelector(
      '[id^="scAllFontSizeInput"].sc-activeTab-border'
    );
    if (!activeButton) return;
    event = { target: activeButton };
  }

  const clickedElement = event.target.closest('[id^="scAllFontSizeInput"]');
  if (!clickedElement) return;

  const fontSize = event.target.value + "px";

  if (!lastClickedElement) {
    showNotification("Please select a block first", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification(
      "Please select a text type (Heading or Paragraph)",
      "error"
    );
    return;
  }

  const block = lastClickedElement.closest('[id^="block-"]');
  if (!block) {
    showNotification("Block not found", "error");
    return;
  }

  // STEP 1️⃣: Correct selector for paragraph based on p1 / p2 / p3
  let paragraphSelector = "";

  if (selectedSingleTextType === "paragraph1") {
    paragraphSelector = "p.sqsrte-large";
  } else if (selectedSingleTextType === "paragraph2") {
    paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
  } else if (selectedSingleTextType === "paragraph3") {
    paragraphSelector = "p.sqsrte-small";
  } else if (selectedSingleTextType === "heading1") {
    paragraphSelector = "h1";
  } else if (selectedSingleTextType === "heading2") {
    paragraphSelector = "h2";
  } else if (selectedSingleTextType === "heading3") {
    paragraphSelector = "h3";
  } else if (selectedSingleTextType === "heading4") {
    paragraphSelector = "h4";
  } else {
    paragraphSelector = selectedSingleTextType; // headings like h1, h2, h3, h4
  }

  console.log("🔍 paragraphSelector:", paragraphSelector);

  // STEP 2️⃣: Find correct paragraph inside the block
  const targetParagraphs = block.querySelectorAll(paragraphSelector);
  if (!targetParagraphs.length) {
    showNotification(
      `No paragraph found for ${selectedSingleTextType}`,
      "error"
    );
    return;
  }

  // STEP 4️⃣: Also apply CSS dynamically to ensure persistence after reload
  const styleId = `style-${block.id}-${selectedSingleTextType}-strong-font-size`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = `
      #${block.id} ${paragraphSelector} {
        font-size: ${fontSize} !important;
      }
    `;

  // ✅ ADD TO PENDING MODIFICATIONS FOR PUBLISH BUTTON
  console.log("📝 Adding font size modification to pending modifications...");

  addPendingModification(
    block.id,
    {
      "font-size": fontSize,
      target: selectedSingleTextType,
    },
    "typographyFontSize"
  );

  // ✅ CALL saveTypographyAllModifications DIRECTLY
  console.log(
    "🚀 Calling saveTypographyAllModifications directly for font size..."
  );

  // Show loading state on publish button
  const publishButton = document.getElementById("publish");
  if (publishButton) {
    publishButton.disabled = true;
    publishButton.textContent = "Publishing...";
  }

  try {
    if (saveTypographyAllModifications) {
      const cssData = {
        "font-size": fontSize,
        target: selectedSingleTextType,
      };

      console.log("📤 Calling saveTypographyAllModifications with:", {
        blockId: block.id,
        cssData,
        textType: selectedSingleTextType,
      });

      const result = await saveTypographyAllModifications(
        block.id,
        cssData,
        selectedSingleTextType
      );

      if (result?.success) {
        console.log("✅ Font size saved to typography table:", result);
        showNotification(
          "✅ Font size saved to typography database!",
          "success"
        );
      } else {
        console.error(
          "❌ Failed to save font size to typography table:",
          result?.error
        );
        showNotification(
          `❌ Typography save failed: ${result?.error || "Unknown error"}`,
          "error"
        );
      }
    } else {
      console.error("❌ saveTypographyAllModifications function not available");
      showNotification("❌ Typography save function not available", "error");
    }
  } catch (error) {
    console.error("❌ Error calling saveTypographyAllModifications:", error);
    showNotification(`❌ Typography save error: ${error.message}`, "error");
  } finally {
    // Reset button state
    if (publishButton) {
      publishButton.disabled = false;
      publishButton.textContent = "Publish";
    }
  }

  // STEP 5️⃣: Update UI highlighting
  document.querySelectorAll('[id^="scAllFontSizeInput"]').forEach((el) => {
    el.classList.remove("sc-activeTab-border");
    el.classList.add("sc-inActiveTab-border");
  });
  clickedElement.classList.remove("sc-inActiveTab-border");
  clickedElement.classList.add("sc-activeTab-border");

  showNotification(
    `✅ Font size applied to bold text inside: ${selectedSingleTextType}`,
    "success"
  );
}
