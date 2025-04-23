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

  let foundLinks = false;
  let tagSelector = selectedSingleTextType;

  // Determine if we're dealing with paragraph types
  let paragraphClass = null;
  if (selectedSingleTextType === "p1") {
    tagSelector = "p";
    paragraphClass = "sqsrte-large";
  } else if (selectedSingleTextType === "p2") {
    tagSelector = "p";
    paragraphClass = null; // default
  } else if (selectedSingleTextType === "p3") {
    tagSelector = "p";
    paragraphClass = "sqsrte-small";
  }

  const elements = lastClickedElement.querySelectorAll(tagSelector);

  elements.forEach((element) => {
    let isValid = false;

    if (selectedSingleTextType.startsWith("h")) {
      isValid = element.tagName.toLowerCase() === selectedSingleTextType;
    } else if (selectedSingleTextType.startsWith("p")) {
      if (paragraphClass === null) {
        isValid =
          !element.classList.contains("sqsrte-large") &&
          !element.classList.contains("sqsrte-small");
      } else {
        isValid = element.classList.contains(paragraphClass);
      }
    }

    if (isValid) {
      const links = element.querySelectorAll("a");
      if (links.length > 0) {
        foundLinks = true;

        // Inject CSS for links inside the matching element
        const styleId = `style-${blockId}-${selectedSingleTextType}-highlight`;
        let styleTag = document.getElementById(styleId);
        if (!styleTag) {
          styleTag = document.createElement("style");
          styleTag.id = styleId;
          document.head.appendChild(styleTag);
        }

        styleTag.innerHTML = `
          #${blockId} ${
          selectedSingleTextType.startsWith("p")
            ? `p${
                paragraphClass
                  ? `.${paragraphClass}`
                  : ":not(.sqsrte-large):not(.sqsrte-small)"
              }`
            : selectedSingleTextType
        } a {
            background-image: linear-gradient(to top, ${selectedColor} 50%, transparent 0%);
            display: inline;
          }
        `;
      }
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
      `✅ Highlight applied to links in ${selectedSingleTextType}.`,
      "success"
    );
  } else {
    showNotification(
      `❌ No <a> links found in ${selectedSingleTextType}.`,
      "error"
    );
  }
}
