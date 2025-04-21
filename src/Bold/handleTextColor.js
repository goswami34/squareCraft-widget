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
  

  export function handleTextColorclicked(event = null, context = null) {
    const {
      lastClickedElement,
      selectedSingleTextType,
      addPendingModification,
      showNotification,
    } = context;
  
    const textColorInput = document.getElementById('textColorPalate');
    if (!textColorInput) {
      console.error("Text color input not found!");
      return;
    }
  
    // ✅ Add change event
    textColorInput.addEventListener('change', () => {
      const color = textColorInput.value; 
      console.log("Selected text color:", color);
  
      if (!lastClickedElement) {
        showNotification("Please select a block first", "error");
        return;
      }
  
      if (!selectedSingleTextType) {
        showNotification("Please select a text type (like p1, p2, heading1)", "error");
        return;
      }
  
      const block = lastClickedElement.closest('[id^="block-"]');
      if (!block) {
        showNotification("Block not found", "error");
        return;
      }
  
      // Correct paragraphSelector
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
        showNotification("Unknown text type: " + selectedSingleTextType, "error");
        return;
      }
  
      console.log("Target paragraph selector for color:", paragraphSelector);
  
      const targetElements = block.querySelectorAll(paragraphSelector);
      if (!targetElements.length) {
        showNotification(`No element found for ${selectedSingleTextType}`, "error");
        return;
      }
  
      let strongFound = false;
  
      targetElements.forEach(el => {
        const strongs = el.querySelectorAll('strong');
        if (strongs.length > 0) {
          strongFound = true;
          strongs.forEach(strong => {
            strong.style.color = color;
          });
        }
      });
  
      if (!strongFound) {
        showNotification(`No bold (<strong>) text found inside ${selectedSingleTextType}`, "info");
        return;
      }
  
      const styleId = `style-${block.id}-${selectedSingleTextType}-strong-textcolor`;
      let styleTag = document.getElementById(styleId);
  
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }
  
      styleTag.innerHTML = `
        #${block.id} ${paragraphSelector} strong {
          color: ${color} !important;
        }
      `;
  
      addPendingModification(block.id, {
        "color": color,
        "target": selectedSingleTextType
      }, 'strong');
  
      showNotification(`✅ Text color applied to bold text inside: ${selectedSingleTextType}`, "success");
    });
  }
  
