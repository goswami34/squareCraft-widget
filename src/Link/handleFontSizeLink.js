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
  

  export function handleFontSizeLink(event = null, context = null) {
    const {
      lastClickedElement,
      selectedSingleTextType,
      addPendingModification,
      saveModifications,
      showNotification
    } = context;
  
    if (!event) {
      const activeButton = document.querySelector('[id^="scFontSizeInputLink"].sc-activeTab-border');
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
      showNotification(`No ${selectedSingleTextType} found inside block`, "error");
      return;
    }
  
    let linkFound = false;
  
    targetElements.forEach(tag => {
      const links = tag.querySelectorAll('a');
      if (links.length > 0) {
        linkFound = true;
        links.forEach(link => {
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
  
    // Save Modification (for API persistence)
    addPendingModification(block.id, {
      "font-size": fontSize,
      "target": selectedSingleTextType
    }, 'link');
  
    // Update Active Tab UI
    document.querySelectorAll('[id^="scFontSizeInputLink"]').forEach(el => {
      el.classList.remove('sc-activeTab-border');
      el.classList.add('sc-inActiveTab-border');
    });
    clickedInput.classList.remove('sc-inActiveTab-border');
    clickedInput.classList.add('sc-activeTab-border');
  
    showNotification(`✅ Font-size applied to Links inside ${selectedSingleTextType}`, "success");
  }
  