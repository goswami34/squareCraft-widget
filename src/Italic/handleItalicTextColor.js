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

// let colorPalette = null;
// let colorPickerContext = null;

// export function handleItalicTextColorClick(
//   event,
//   lastClickedElement,
//   applyStylesToElement,
//   context,
//   selectedSingleTextType
// ) {
//   const textColorPalate = event.target.closest("#textColorPalate");
//   if (!textColorPalate) return;

//   // ✅ Fresh context every time
//   colorPickerContext = {
//     ...context,
//     lastClickedElement,
//     selectedSingleTextType: context.selectedSingleTextType,
//   };

//   // Create hidden color input if not already created
//   if (!colorPalette) {
//     colorPalette = document.createElement("input");
//     colorPalette.type = "color";
//     colorPalette.id = "scColorPalette";
//     colorPalette.style.opacity = "0";
//     colorPalette.style.width = "0px";
//     colorPalette.style.height = "0px";
//     colorPalette.style.marginTop = "14px";

//     const widgetContainer = document.getElementById("sc-widget-container");
//     if (widgetContainer) {
//       widgetContainer.appendChild(colorPalette);
//     } else {
//       document.body.appendChild(colorPalette);
//     }

//     colorPalette.addEventListener("input", function (event) {
//       const selectedColor = event.target.value;

//       if (!colorPickerContext?.lastClickedElement) {
//         showNotification("Please select a block first", "error");
//         return;
//       }

//       const textColorPalate = document.getElementById("textColorPalate");
//       if (textColorPalate) {
//         textColorPalate.style.backgroundColor = selectedColor;
//       }

//       const textColorHtml = document.getElementById("textcolorHtml");
//       if (textColorHtml) {
//         textColorHtml.textContent = selectedColor;
//       }

//       const selectedTab = document.querySelector(".sc-selected-tab");
//       let selectedTextType = null;

//       if (selectedTab) {
//         if (selectedTab.id.startsWith("heading")) {
//           selectedTextType = `heading${selectedTab.id.replace("heading", "")}`;
//         } else if (selectedTab.id.startsWith("paragraph")) {
//           selectedTextType = `paragraph${selectedTab.id.replace(
//             "paragraph",
//             ""
//           )}`;
//         }
//       }

//       if (!selectedTextType && colorPickerContext?.selectedSingleTextType) {
//         selectedTextType = colorPickerContext.selectedSingleTextType;
//       }

//       if (!selectedTextType) {
//         showNotification("Please select a text type first", "error");
//         return;
//       }

//       const block =
//         colorPickerContext.lastClickedElement.closest('[id^="block-"]');
//       if (!block) {
//         showNotification("Block not found", "error");
//         return;
//       }

//       const selectorMap = {
//         paragraph1: "p.sqsrte-large",
//         paragraph2: "p:not(.sqsrte-large):not(.sqsrte-small)",
//         paragraph3: "p.sqsrte-small",
//         heading1: "h1",
//         heading2: "h2",
//         heading3: "h3",
//         heading4: "h4",
//       };

//       const paragraphSelector = selectorMap[selectedTextType] || "";
//       const targetElements = block.querySelectorAll(paragraphSelector);

//       if (!targetElements.length) {
//         showNotification(`No ${selectedTextType} found in the block`, "error");
//         return;
//       }

//       let italicFound = false;
//       let italicCount = 0;

//       targetElements.forEach((tag) => {
//         const italicElements = tag.querySelectorAll("em");
//         if (italicElements.length > 0) {
//           italicFound = true;
//           italicCount += italicElements.length;
//           italicElements.forEach((em) => {
//             em.style.color = selectedColor;
//           });
//         }
//       });

//       if (!italicFound) {
//         showNotification(
//           `No italic (<em>) text found in ${selectedTextType}. Please add some italic text first.`,
//           "info"
//         );
//         return;
//       }

//       // Create or update style tag for this block's em tags
//       let styleTag = document.getElementById(`style-${block.id}-em`);
//       if (!styleTag) {
//         styleTag = document.createElement("style");
//         styleTag.id = `style-${block.id}-em`;
//         document.head.appendChild(styleTag);
//       }

//       // Remove any inline styles from parent elements
//       targetElements.forEach((tag) => {
//         tag.style.color = "";
//       });

//       const cssRule = `#${block.id} ${paragraphSelector} em {
//         color: ${selectedColor} !important;
//       }`;

//       styleTag.innerHTML = cssRule;

//       // Save to backend
//       colorPickerContext.handleAllTextColorClick(
//         { selectedColor },
//         {
//           ...colorPickerContext,
//           selectedSingleTextType: selectedTextType,
//           lastClickedElement: colorPickerContext.lastClickedElement,
//         }
//       );

//       showNotification(
//         `✅ Text color applied to ${italicCount} italic word(s) in ${selectedTextType}`,
//         "success"
//       );
//     });
//   }

//   // ✅ Only open colorPalette manually after setting context
//   setTimeout(() => {
//     colorPalette.click();
//   }, 50);
// }

export function handleItalicTextColorClick(color) {
  if (!lastClickedElement) {
    showNotification("Please select a block first", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification("Please select a text type", "error");
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
  targetElements.forEach((el) => {
    const italics = el.querySelectorAll("em");
    if (italics.length > 0) {
      strongFound = true;
      italics.forEach((italic) => {
        italic.style.color = color;
      });
    }
  });

  if (!strongFound) {
    showNotification(
      `No bold (<strong>) text found inside ${selectedSingleTextType}`,
      "info"
    );
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
    #${block.id} ${paragraphSelector} em {
      color: ${color} !important;
    }
  `;

  addPendingModification(
    block.id,
    {
      color: color,
      target: selectedSingleTextType,
    },
    "em"
  );

  showNotification(
    `✅ Text color applied to bold text inside: ${selectedSingleTextType}`,
    "success"
  );
}
