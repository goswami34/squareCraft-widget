// let colorPalette = null;
// let colorPickerContext = null;

// export function handleTextColorClick(
//   event,
//   lastClickedElement,
//   applyStylesToElement,
//   context
// ) {
//   const textColorPalate = event.target.closest("#textColorPalate");
//   if (!textColorPalate) return;

//   // Create hidden color input if not already created
//   if (!colorPalette) {
//     colorPalette = document.createElement("input");
//     colorPalette.type = "color";
//     colorPalette.id = "scColorPalette";
//     colorPalette.style.opacity = "0";
//     colorPalette.style.width = "0px";
//     colorPalette.style.height = "0px";
//     colorPalette.style.marginTop = "14px";

//     // ✅ Important: append input inside widget to prevent widget disappearing
//     const widgetContainer = document.getElementById("sc-widget-container");
//     if (widgetContainer) {
//       widgetContainer.appendChild(colorPalette);
//     } else {
//       document.body.appendChild(colorPalette); // fallback safety
//     }

//     colorPalette.addEventListener("input", function (event) {
//       const selectedColor = event.target.value;

//       if (!colorPickerContext?.lastClickedElement) return;

//       const textColorPalate = document.getElementById("textColorPalate");
//       if (textColorPalate) {
//         textColorPalate.style.backgroundColor = selectedColor;
//       }

//       const textColorHtml = document.getElementById("textcolorHtml");
//       if (textColorHtml) {
//         textColorHtml.textContent = selectedColor;
//       }

//       const selectedTab = document.querySelector(".sc-selected-tab");
//       console.log("selectedTab", selectedTab);
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

//       // If no tab detected, fallback to saved context
//       if (!selectedTextType && colorPickerContext?.selectedSingleTextType) {
//         selectedTextType = colorPickerContext.selectedSingleTextType;
//       }

//       if (!selectedTextType) {
//         console.error("❌ No selected text type found");
//         return;
//       }

//       const block =
//         colorPickerContext.lastClickedElement.closest('[id^="block-"]');
//       if (!block) {
//         console.error("❌ Block not found");
//         return;
//       }

//       let paragraphSelector = "";
//       if (selectedTextType === "paragraph1") {
//         paragraphSelector = "p.sqsrte-large";
//       } else if (selectedTextType === "paragraph2") {
//         paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
//       } else if (selectedTextType === "paragraph3") {
//         paragraphSelector = "p.sqsrte-small";
//       } else if (selectedTextType === "heading1") {
//         paragraphSelector = "h1";
//       } else if (selectedTextType === "heading2") {
//         paragraphSelector = "h2";
//       } else if (selectedTextType === "heading3") {
//         paragraphSelector = "h3";
//       } else if (selectedTextType === "heading4") {
//         paragraphSelector = "h4";
//       }

//       const targetElements = block.querySelectorAll(paragraphSelector);

//       targetElements.forEach((el) => {
//         el.style.color = selectedColor;
//       });

//       // Save to backend also
//       colorPickerContext.handleAllTextColorClick(
//         { selectedColor },
//         {
//           ...colorPickerContext,
//           selectedSingleTextType: selectedTextType,
//           lastClickedElement: colorPickerContext.lastClickedElement,
//         }
//       );
//     });
//   }

//   // 🔥 Every click: Update fresh context
//   colorPickerContext = {
//     ...context,
//     lastClickedElement,
//     selectedSingleTextType: context.selectedSingleTextType,
//   };

//   colorPalette.click();
// }

let colorPalette = null;
let colorPickerContext = null;

export function handleItalicTextColorClick(
  event,
  lastClickedElement,
  applyStylesToElement,
  context,
  selectedSingleTextType
) {
  const textColorPalate = event.target.closest("#textColorPalate");
  if (!textColorPalate) return;

  // ✅ Fresh context every time
  colorPickerContext = {
    ...context,
    lastClickedElement,
    selectedSingleTextType: context.selectedSingleTextType,
  };

  // Create hidden color input if not already created
  if (!colorPalette) {
    colorPalette = document.createElement("input");
    colorPalette.type = "color";
    colorPalette.id = "scColorPalette";
    colorPalette.style.opacity = "0";
    colorPalette.style.width = "0px";
    colorPalette.style.height = "0px";
    colorPalette.style.marginTop = "14px";

    const widgetContainer = document.getElementById("sc-widget-container");
    if (widgetContainer) {
      widgetContainer.appendChild(colorPalette);
    } else {
      document.body.appendChild(colorPalette);
    }

    colorPalette.addEventListener("input", function (event) {
      const selectedColor = event.target.value;

      if (!colorPickerContext?.lastClickedElement) return;

      const textColorPalate = document.getElementById("textColorPalate");
      if (textColorPalate) {
        textColorPalate.style.backgroundColor = selectedColor;
      }

      const textColorHtml = document.getElementById("textcolorHtml");
      if (textColorHtml) {
        textColorHtml.textContent = selectedColor;
      }

      const selectedTab = document.querySelector(".sc-selected-tab");
      let selectedTextType = null;

      if (selectedTab) {
        if (selectedTab.id.startsWith("heading")) {
          selectedTextType = `heading${selectedTab.id.replace("heading", "")}`;
        } else if (selectedTab.id.startsWith("paragraph")) {
          selectedTextType = `paragraph${selectedTab.id.replace(
            "paragraph",
            ""
          )}`;
        }
      }

      if (!selectedTextType && colorPickerContext?.selectedSingleTextType) {
        selectedTextType = colorPickerContext.selectedSingleTextType;
      }

      if (!selectedTextType) {
        console.error("❌ No selected text type found");
        return;
      }

      const block =
        colorPickerContext.lastClickedElement.closest('[id^="block-"]');
      if (!block) {
        console.error("❌ Block not found");
        return;
      }

      const selectorMap = {
        paragraph1: "p.sqsrte-large",
        paragraph2: "p:not(.sqsrte-large):not(.sqsrte-small)",
        paragraph3: "p.sqsrte-small",
        heading1: "h1",
        heading2: "h2",
        heading3: "h3",
        heading4: "h4",
      };

      const paragraphSelector = selectorMap[selectedTextType] || "";
      const targetElements = block.querySelectorAll(paragraphSelector);

      let italicFound = false;

      targetElements.forEach((tag) => {
        const italicElements = tag.querySelectorAll("em");
        if (italicElements.length > 0) {
          italicFound = true;
          italicElements.forEach((em) => {
            em.style.color = selectedColor;
          });
        }
      });

      if (!italicFound) {
        showNotification(
          `No italic (<em>) text found in ${selectedTextType}`,
          "info"
        );
        return;
      }

      let styleTag = document.getElementById(`style-${block.id}-em`);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.id = `style-${block.id}-em`;
        document.head.appendChild(styleTag);
      }

      const cssRule = `#${block.id} ${paragraphSelector} em { 
        color: ${selectedColor} !important; 
    }`;

      styleTag.innerHTML = cssRule;

      colorPickerContext.handleAllTextColorClick(
        { selectedColor },
        {
          ...colorPickerContext,
          selectedSingleTextType: selectedTextType,
          lastClickedElement: colorPickerContext.lastClickedElement,
        }
      );
    });
  }

  // ✅ Only open colorPalette manually after setting context
  setTimeout(() => {
    colorPalette.click();
  }, 50);
}
