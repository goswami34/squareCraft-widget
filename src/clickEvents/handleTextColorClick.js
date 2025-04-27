// export function handleTextColorClick(
//   event,
//   lastClickedElement,
//   applyStylesToElement,
//   context
// ) {
//   const { handleAllTextColorClick } = context; // ✅ pulling from context

//   const textColorPalate = event.target.closest("#textColorPalate");
//   if (!textColorPalate) return;

//   let colorPalette = document.getElementById("scColorPalette");

//   if (!colorPalette) {
//     colorPalette = document.createElement("input");
//     colorPalette.type = "color";
//     colorPalette.id = "scColorPalette";
//     colorPalette.style.opacity = "0";
//     colorPalette.style.width = "0px";
//     colorPalette.style.height = "0px";
//     colorPalette.style.marginTop = "14px";

//     textColorPalate.appendChild(colorPalette);

//     // ✅ Corrected event listener
//     colorPalette.addEventListener("input", function (event) {
//       const selectedColor = event.target.value;
//       if (lastClickedElement) {
//         textColorPalate.style.backgroundColor = selectedColor;

//         const textColorHtml = document.getElementById("textcolorHtml");
//         if (textColorHtml) {
//           textColorHtml.textContent = selectedColor;
//         }

//         // ✅ Correctly accessing from context
//         handleAllTextColorClick({ selectedColor }, context);
//       }
//     });
//   }

//   colorPalette.click();
// }

// Keep global updated reference

let colorPalette = null;
let colorPickerContext = null;

export function handleTextColorClick(
  event,
  lastClickedElement,
  applyStylesToElement,
  context
) {
  const textColorPalate = event.target.closest("#textColorPalate");
  if (!textColorPalate) return;

  // Create hidden color input if not already created
  if (!colorPalette) {
    colorPalette = document.createElement("input");
    colorPalette.type = "color";
    colorPalette.id = "scColorPalette";
    colorPalette.style.opacity = "0";
    colorPalette.style.width = "0px";
    colorPalette.style.height = "0px";
    colorPalette.style.marginTop = "14px";

    // ✅ Important: append input inside widget to prevent widget disappearing
    const widgetContainer = document.getElementById("sc-widget-container");
    if (widgetContainer) {
      widgetContainer.appendChild(colorPalette);
    } else {
      document.body.appendChild(colorPalette); // fallback safety
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
      console.log("selectedTab", selectedTab);
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

      // If no tab detected, fallback to saved context
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

      let paragraphSelector = "";
      if (selectedTextType === "paragraph1") {
        paragraphSelector = "p.sqsrte-large";
      } else if (selectedTextType === "paragraph2") {
        paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
      } else if (selectedTextType === "paragraph3") {
        paragraphSelector = "p.sqsrte-small";
      } else if (selectedTextType === "heading1") {
        paragraphSelector = "h1";
      } else if (selectedTextType === "heading2") {
        paragraphSelector = "h2";
      } else if (selectedTextType === "heading3") {
        paragraphSelector = "h3";
      } else if (selectedTextType === "heading4") {
        paragraphSelector = "h4";
      }

      const targetElements = block.querySelectorAll(paragraphSelector);

      targetElements.forEach((el) => {
        el.style.color = selectedColor;
      });

      // Save to backend also
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

  // 🔥 Every click: Update fresh context
  colorPickerContext = {
    ...context,
    lastClickedElement,
    selectedSingleTextType: context.selectedSingleTextType,
  };

  colorPalette.click();
}
