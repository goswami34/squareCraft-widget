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



  export function handleFontWeightLink(event = null, context = null) {
    const {
      lastClickedElement,
      selectedSingleTextType,
      addPendingModification,
    } = context;
  
    const fontWeightSelect = document.getElementById("squareCraftLinkFontWeight");
    if (!fontWeightSelect) {
      showNotification("Font weight selector not found", "error");
      return;
    }
  
    const fontWeight = fontWeightSelect.value;
    if (!fontWeight) {
      showNotification("Please select a font-weight", "error");
      return;
    }
  
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
      showNotification("Unknown selected type: " + selectedSingleTextType, "error");
      return;
    }
  
    console.log("✅ Applying LINK font-weight for selector:", paragraphSelector);
  
    const targetElements = block.querySelectorAll(paragraphSelector);
    if (!targetElements.length) {
      showNotification(`No matching elements found for ${selectedSingleTextType}`, "error");
      return;
    }
  
    let linkFound = false;
  
    targetElements.forEach(el => {
      const links = el.querySelectorAll('a');
      if (links.length > 0) {
        linkFound = true;
        links.forEach(link => {
          link.style.fontWeight = fontWeight;
        });
      }
    });
  
    if (!linkFound) {
      showNotification(`No links (<a>) found inside ${selectedSingleTextType}`, "info");
      return;
    }
  
    const styleId = `style-${block.id}-${selectedSingleTextType}-link-fontweight`;
    let styleTag = document.getElementById(styleId);
  
    if (!styleTag) {
      styleTag = document.createElement("style");
      styleTag.id = styleId;
      document.head.appendChild(styleTag);
    }
  
    styleTag.innerHTML = `
      #${block.id} ${paragraphSelector} a {
        font-weight: ${fontWeight} !important;
      }
    `;
  
    addPendingModification(block.id, {
      "font-weight": fontWeight,
      "target": selectedSingleTextType
    }, 'link');
  
    showNotification(`Font-weight applied to link words inside: ${selectedSingleTextType}`, "success");
  }
  
  