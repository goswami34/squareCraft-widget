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



export function handleFontWeightClick(event = null, context = null) {
    const {
      lastClickedElement,
      selectedSingleTextType,
      addPendingModification,
    //   showNotification,
    } = context;
  
    const fontWeightSelect = document.getElementById('squareCraftFontWeight');
    if (!fontWeightSelect) {
      console.error("Font weight select dropdown not found!");
      return;
    }
  
    // ✅ Add change event listener to select
    fontWeightSelect.addEventListener('change', () => {
      const fontWeight = fontWeightSelect.value; // Get selected value
      console.log("Selected font-weight:", fontWeight);
  
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
  
      // Build selector
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
  
      console.log("Target paragraph selector:", paragraphSelector);
  
    //   const targetElements = block.querySelectorAll(paragraphSelector);

    const targetElements = block.querySelectorAll('h1, h2, h3, h4, p');

    // const targetElements = block.querySelectorAll(paragraphSelector);
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
            strong.style.fontWeight = fontWeight;
          });
        }
      });
  
      if (!strongFound) {
        showNotification(`No bold (<strong>) text found inside ${selectedSingleTextType}`, "info");
        return;
      }
  
      // Create dynamic style
      const styleId = `style-${block.id}-${selectedSingleTextType}-strong-fontweight`;
      let styleTag = document.getElementById(styleId);
  
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
      }
  
      styleTag.innerHTML = `
        #${block.id} ${paragraphSelector} strong {
          font-weight: ${fontWeight} !important;
        }
      `;
  
      addPendingModification(block.id, {
        "font-weight": fontWeight,
        "target": selectedSingleTextType
      }, 'strong');
  
      showNotification(`Font weight applied to bold text inside: ${selectedSingleTextType}`, "success");
    });
  }
  