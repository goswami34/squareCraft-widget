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
  

  export function handleTextColorclicked(context = null) {
    const {
      lastClickedElement,
      selectedSingleTextType,
      addPendingModification,
    //   showNotification,
    } = context;
  
    if (!lastClickedElement) {
      showNotification("Please select a block first", "error");
      return;
    }

    const colorInput = document.getElementById('scTextColor');
    const colorHexInput = document.getElementById('scColorHex');
  
    if (!colorInput || !colorHexInput) {
      console.warn("⚠️ Color input elements not found!");
      return;
    }
  
    let selectedColor = colorInput.value;
  
    // Update strong color from color picker
    colorInput.addEventListener('input', function () {
      if (!lastClickedElement) {
        showNotification("Please select a block first", "error");
        return;
      }
      if (!selectedSingleTextType) {
        showNotification("Please select a text type", "error");
        return;
      }
  
      selectedColor = colorInput.value;
      applyColorToStrong(selectedColor);
      colorHexInput.value = selectedColor.toUpperCase();
    });
  
    // Update strong color from hex input
    colorHexInput.addEventListener('input', function () {
      if (!lastClickedElement) {
        showNotification("Please select a block first", "error");
        return;
      }
      if (!selectedSingleTextType) {
        showNotification("Please select a text type", "error");
        return;
      }
  
      let colorValue = colorHexInput.value;
      if (!colorValue.startsWith('#')) {
        colorValue = '#' + colorValue;
      }
  
      if (!/^#[0-9A-F]{6}$/i.test(colorValue)) {
        console.warn("⚠️ Invalid hex color format");
        return;
      }
  
      selectedColor = colorValue;
      applyColorToStrong(selectedColor);
      colorInput.value = selectedColor;
    });
  
    function applyColorToStrong(color) {
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
      } else if (selectedSingleTextType.startsWith("heading")) {
        paragraphSelector = "h" + selectedSingleTextType.replace("heading", "");
      } else {
        showNotification("Unknown text type: " + selectedSingleTextType, "error");
        return;
      }
  
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
    }
  }
  
  
  
