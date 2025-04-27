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

let colorPalette = null; // Move this outside export function globally

export function handleTextColorClick(
  event,
  lastClickedElement,
  applyStylesToElement,
  context
) {
  const textColorPalate = event.target.closest("#textColorPalate");
  if (!textColorPalate) return;

  if (!colorPalette) {
    // Only create once
    colorPalette = document.createElement("input");
    colorPalette.type = "color";
    colorPalette.id = "scColorPalette";
    colorPalette.style.opacity = "0";
    colorPalette.style.width = "0px";
    colorPalette.style.height = "0px";
    colorPalette.style.marginTop = "14px";

    document.body.appendChild(colorPalette);

    // Add input listener only ONCE
    colorPalette.addEventListener("input", function (event) {
      const selectedColor = event.target.value;
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

      if (!selectedTextType && context.selectedSingleTextType) {
        selectedTextType = context.selectedSingleTextType;
      }

      if (!selectedTextType) {
        console.error("❌ No selected text type found.");
        return;
      }

      const block = context.lastClickedElement?.closest('[id^="block-"]');
      if (!block) {
        console.error("❌ No block found.");
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

      textColorPalate.style.backgroundColor = selectedColor;
      const textColorHtml = document.getElementById("textcolorHtml");
      if (textColorHtml) {
        textColorHtml.textContent = selectedColor;
      }

      context.handleAllTextColorClick(
        { selectedColor },
        {
          ...context,
          selectedSingleTextType: selectedTextType,
          lastClickedElement: context.lastClickedElement,
        }
      );
    });
  }

  // ✅ Only open color picker without recalling handleTextColorClick
  colorPalette.click();
}
