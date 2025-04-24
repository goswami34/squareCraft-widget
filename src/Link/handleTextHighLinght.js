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

// handleTextHighlight.js
// export function handleTextHighLinghtClick(
//   event,
//   { lastClickedElement, selectedSingleTextType, addPendingModification }
// ) {
//   event.preventDefault();

//   if (!lastClickedElement) {
//     showNotification("❌ Please select a block first.", "error");
//     return;
//   }

//   if (!selectedSingleTextType) {
//     showNotification(
//       "❌ Please select a text type (h1, h2, p1 etc) first.",
//       "error"
//     );
//     return;
//   }

//   const blockId = lastClickedElement.id;
//   const colorInput = document.getElementById("scTextHighLight");
//   const selectedColor = colorInput?.value || "#ef7c2f";

//   // Convert p1, p2, p3 to p tag selector with class
//   let tagSelector = selectedSingleTextType;
//   if (tagSelector.startsWith("p")) {
//     tagSelector = "p";
//   }

//   const elements = lastClickedElement.querySelectorAll(tagSelector);
//   let foundLinks = false;

//   elements.forEach((element) => {
//     const isValidParagraph =
//       (selectedSingleTextType === "p1" &&
//         element.classList.contains("sqsrte-large")) ||
//       (selectedSingleTextType === "p2" &&
//         !element.classList.contains("sqsrte-large") &&
//         !element.classList.contains("sqsrte-small")) ||
//       (selectedSingleTextType === "p3" &&
//         element.classList.contains("sqsrte-small"));

//     const isParagraph = selectedSingleTextType.startsWith("p");
//     const isHeading = selectedSingleTextType.startsWith("h");

//     if ((isParagraph && isValidParagraph) || isHeading) {
//       const links = element.querySelectorAll("a");
//       if (links.length > 0) {
//         foundLinks = true;

//         const styleId = `highlight-${blockId}-${selectedSingleTextType}-links`;
//         let styleTag = document.getElementById(styleId);
//         if (!styleTag) {
//           styleTag = document.createElement("style");
//           styleTag.id = styleId;
//           document.head.appendChild(styleTag);
//         }

//         styleTag.innerHTML = `
//           #${blockId} ${selectedSingleTextType} a {
//             background-image: linear-gradient(to top, ${selectedColor} 50%, transparent 0%);
//             display: inline;
//           }
//         `;
//       }
//     }
//   });

//   if (foundLinks) {
//     addPendingModification(
//       blockId,
//       {
//         "background-image": `linear-gradient(to top, ${selectedColor} 50%, transparent 0%)`,
//         display: "inline",
//       },
//       selectedSingleTextType
//     );

//     showNotification(
//       `✅ Text highlight applied to <a> tags in ${selectedSingleTextType}.`,
//       "success"
//     );
//   } else {
//     showNotification(
//       `❌ No <a> links found in ${selectedSingleTextType}.`,
//       "error"
//     );
//   }
// }

// export function handleTextHighLinghtClick(
//   event,
//   {
//     lastClickedElement,
//     selectedSingleTextType,
//     addPendingModification,
//     showNotification,
//   }
// ) {
//   event.preventDefault();

//   if (!lastClickedElement) {
//     showNotification("❌ Please select a block first.", "error");
//     return;
//   }

//   if (!selectedSingleTextType) {
//     showNotification(
//       "❌ Please select a text type (h1, h2, p1 etc) first.",
//       "error"
//     );
//     return;
//   }

//   const blockId = lastClickedElement.id;
//   const colorInput = document.getElementById(
//     `scTextHighLight-${selectedSingleTextType}`
//   );
//   console.log(colorInput);
//   console.log(colorInput?.value);

//   const selectedColor = colorInput?.value || "#ef7c2f";

//   let tagSelector = selectedSingleTextType;
//   let classSelector = ""; // For paragraph class handling

//   // Handle p1, p2, p3 to select paragraph tags properly
//   // if (selectedSingleTextType.startsWith("p")) {
//   //   tagSelector = "p";
//   //   if (selectedSingleTextType === "p1") {
//   //     classSelector = ".sqsrte-large";
//   //   } else if (selectedSingleTextType === "p2") {
//   //     classSelector = ":not(.sqsrte-large):not(.sqsrte-small)";
//   //   } else if (selectedSingleTextType === "p3") {
//   //     classSelector = ".sqsrte-small";
//   //   }
//   // }

//   let selector = "";
//   if (selectedSingleTextType === "paragraph1") {
//     selector = "p.sqsrte-large";
//   } else if (selectedSingleTextType === "paragraph2") {
//     selector = "p:not(.sqsrte-large):not(.sqsrte-small)";
//   } else if (selectedSingleTextType === "paragraph3") {
//     selector = "p.sqsrte-small";
//   } else if (selectedSingleTextType.startsWith("heading")) {
//     selector = `h${selectedSingleTextType.replace("heading", "")}`;
//   } else {
//     selector = selectedSingleTextType;
//   }

//   // const selector = `${tagSelector}${classSelector}`;
//   const matchingElements = lastClickedElement.querySelectorAll(selector);

//   let found = false;

//   matchingElements.forEach((el) => {
//     const links = el.querySelectorAll("a");
//     if (links.length > 0) {
//       found = true;

//       // Inject dynamic style tag
//       const styleId = `highlight-${blockId}-${selectedSingleTextType}`;
//       let styleTag = document.getElementById(styleId);
//       if (!styleTag) {
//         styleTag = document.createElement("style");
//         styleTag.id = styleId;
//         document.head.appendChild(styleTag);
//       }

//       styleTag.innerHTML = `
//         #${blockId} ${selector} a {
//           background-image: linear-gradient(to top, ${selectedColor} 50%, transparent 0%);
//           display: inline;
//         }
//       `;
//     }
//   });

//   if (found) {
//     addPendingModification(
//       blockId,
//       {
//         "background-image": `linear-gradient(to top, ${selectedColor} 50%, transparent 0%)`,
//         display: "inline",
//       },
//       selectedSingleTextType
//     );
//     showNotification(
//       `✅ Highlight applied to links in ${selectedSingleTextType}.`,
//       "success"
//     );
//   } else {
//     showNotification(
//       `❌ No <a> tags found in ${selectedSingleTextType}.`,
//       "error"
//     );
//   }
// }

export function handleTextHighLinghtClick(
  event,
  {
    lastClickedElement,
    selectedSingleTextType,
    addPendingModification,
    showNotification,
  }
) {
  event.preventDefault();
  console.log("handleTextHighLinghtClick called with:", {
    lastClickedElement,
    selectedSingleTextType,
  });

  if (!lastClickedElement) {
    showNotification("❌ Please select a block first.", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification(
      "❌ Please select a text type (h1, h2, p1 etc) first.",
      "error"
    );
    return;
  }

  const blockId = lastClickedElement.id;
  const colorInput = document.getElementById("scTextHighLight");
  const selectedColor = colorInput?.value || "#ef7c2f";

  // Convert text type to proper selector
  let selector = "";
  if (selectedSingleTextType.startsWith("h")) {
    selector = selectedSingleTextType;
  } else if (selectedSingleTextType.startsWith("p")) {
    if (selectedSingleTextType === "p1") {
      selector = "p.sqsrte-large";
    } else if (selectedSingleTextType === "p2") {
      selector = "p:not(.sqsrte-large):not(.sqsrte-small)";
    } else if (selectedSingleTextType === "p3") {
      selector = "p.sqsrte-small";
    }
  }

  // Find all elements of the selected type within the block
  const elements = lastClickedElement.querySelectorAll(selector);
  console.log("Found elements:", elements.length);

  if (elements.length === 0) {
    showNotification(
      `❌ No ${selectedSingleTextType} elements found in the selected block.`,
      "error"
    );
    return;
  }

  let foundLinks = false;

  elements.forEach((element) => {
    const links = element.querySelectorAll("a");
    if (links.length > 0) {
      foundLinks = true;

      // Create a unique ID for this highlight style
      const highlightId = `highlight-${blockId}-${selectedSingleTextType}`;

      // Create or update the style tag
      let styleTag = document.getElementById(highlightId);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = highlightId;
        document.head.appendChild(styleTag);
      }

      // Apply the highlight style to all links within the selected elements
      styleTag.innerHTML = `
        #${blockId} ${selector} a {
          background-image: linear-gradient(to top, ${selectedColor} 50%, transparent 0%);
          display: inline;
        }
      `;
    }
  });

  if (foundLinks) {
    addPendingModification(
      blockId,
      {
        "background-image": `linear-gradient(to top, ${selectedColor} 50%, transparent 0%)`,
        display: "inline",
      },
      selectedSingleTextType
    );
    showNotification(
      `✅ Text highlight applied to links in ${selectedSingleTextType}.`,
      "success"
    );
  } else {
    showNotification(
      `❌ No <a> tags found in ${selectedSingleTextType}.`,
      "error"
    );
  }
}
