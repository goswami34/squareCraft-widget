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
      backgroundColor: type === "success" ? "#4CAF50" : type === "error" ? "#f44336" : "#2196F3"
  });

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
      notification.style.animation = "fadeOut 0.3s ease-in-out";
      setTimeout(() => notification.remove(), 300);
  }, 3000);
}

export function handleTextTransformClick(event = null, context = null) {
    const {
      lastClickedElement,
      selectedSingleTextType,
      saveModifications,
      selectedElement,
      setSelectedElement,
      setLastClickedBlockId,
      setLastClickedElement,
      addPendingModification,
      showNotification
    } = context;
  
    if (!event) {
      const activeButton = document.querySelector('[id^="scTextTransform"].sc-activeTab-border');
      if (!activeButton) return;
      event = { target: activeButton };
    }
  
    const clickedElement = event.target.closest('[id^="scTextTransform"]');
    if (!clickedElement) return;
  
    const textTransform = clickedElement.dataset.textTransform;
  
    if (!lastClickedElement) {
      showNotification("Please select a block first", "error");
      return;
    }
  
    if (!selectedSingleTextType) {
      showNotification("Please select a text type first (like p1, p2, p3)", "error");
      return;
    }
  
    const block = lastClickedElement.closest('[id^="block-"]');
    if (!block) {
      showNotification("Block not found", "error");
      return;
    }
  
    // STEP 1️⃣: Find the correct paragraph selector
    let paragraphSelector = "";
  
    if (selectedSingleTextType === "paragraph1") {
      paragraphSelector = "p.sqsrte-large";
    } else if (selectedSingleTextType === "paragraph2") {
      paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
    } else if (selectedSingleTextType === "pparagraph3") {
      paragraphSelector = "p.sqsrte-small";
    } else {
      paragraphSelector = selectedSingleTextType;
    }
  
    console.log("🔍 paragraphSelector for text-transform:", paragraphSelector);
  
    // STEP 2️⃣: Find paragraphs inside the block
    const targetParagraphs = block.querySelectorAll(paragraphSelector);
    if (!targetParagraphs.length) {
      showNotification(`No paragraph found for ${selectedSingleTextType}`, "error");
      return;
    }
  
    // STEP 3️⃣: Apply inline text-transform to <strong> inside the paragraphs
    let strongFound = false;
  
    targetParagraphs.forEach(paragraph => {
      const strongs = paragraph.querySelectorAll('strong');
      if (strongs.length > 0) {
        strongFound = true;
        strongs.forEach(strong => {
          strong.style.textTransform = textTransform;
        });
      }
    });
  
    if (!strongFound) {
      showNotification(`No bold text (<strong>) found inside ${selectedSingleTextType}`, "info");
      return;
    }
  
    // STEP 4️⃣: Create dynamic CSS
    const styleId = `style-${block.id}-${selectedSingleTextType}-strong-texttransform`;
    let styleTag = document.getElementById(styleId);
  
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
  
    styleTag.innerHTML = `
      #${block.id} ${paragraphSelector} strong {
        text-transform: ${textTransform} !important;
      }
    `;
  
    addPendingModification(block.id, {
      "text-transform": textTransform,
      "target": selectedSingleTextType
    }, 'strong');
  
    // STEP 5️⃣: Update UI
    document.querySelectorAll('[id^="scTextTransform"]').forEach(el => {
      el.classList.remove('sc-activeTab-border');
      el.classList.add('sc-inActiveTab-border');
    });
    clickedElement.classList.remove('sc-inActiveTab-border');
    clickedElement.classList.add('sc-activeTab-border');
  
    showNotification(`Text-transform applied to bold text inside: ${selectedSingleTextType}`, "success");
  }
  



  
