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

export function handleTextColorClick(
  event,
  lastClickedElement,
  applyStylesToElement,
  context
) {
  const textColorPalate = event.target.closest("#textColorPalate");
  if (!textColorPalate) return;

  // Get the currently selected tab first
  const selectedTab = document.querySelector(".sc-selected-tab");
  if (!selectedTab) {
    showNotification(
      "Please select a text type (h1, h2, p1 etc) first",
      "error"
    );
    return;
  }

  let colorPalette = document.getElementById("scColorPalette");

  if (!colorPalette) {
    colorPalette = document.createElement("input");
    colorPalette.type = "color";
    colorPalette.id = "scColorPalette";
    colorPalette.style.opacity = "0";
    colorPalette.style.width = "0px";
    colorPalette.style.height = "0px";
    colorPalette.style.marginTop = "14px";

    textColorPalate.appendChild(colorPalette);

    colorPalette.addEventListener("input", function (event) {
      const selectedColor = event.target.value;
      if (!lastClickedElement) {
        showNotification("Please select a block first", "error");
        return;
      }

      // Determine the text type based on the selected tab
      let selectedTextType = null;
      if (selectedTab.id.startsWith("heading")) {
        selectedTextType = `heading${selectedTab.id.replace("heading", "")}`;
      } else if (selectedTab.id.startsWith("paragraph")) {
        selectedTextType = `paragraph${selectedTab.id.replace(
          "paragraph",
          ""
        )}`;
      }

      if (!selectedTextType) {
        showNotification("Invalid text type selected", "error");
        return;
      }

      // Update the color palette background
      textColorPalate.style.backgroundColor = selectedColor;

      // Update the color text display
      const textColorHtml = document.getElementById("textcolorHtml");
      if (textColorHtml) {
        textColorHtml.textContent = selectedColor;
      }

      // Find the block element
      const block = lastClickedElement.closest('[id^="block-"]');
      if (!block) {
        showNotification("Block not found", "error");
        return;
      }

      // Determine the selector based on text type
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
      } else {
        showNotification("Invalid text type", "error");
        return;
      }

      // Apply color to the selected elements
      const targetElements = block.querySelectorAll(paragraphSelector);
      if (targetElements.length === 0) {
        showNotification(
          `No ${selectedTextType} elements found in the block`,
          "error"
        );
        return;
      }

      targetElements.forEach((el) => {
        el.style.color = selectedColor;
      });

      // Call handleAllTextColorClick for permanent CSS save
      context.handleAllTextColorClick(
        { selectedColor },
        {
          ...context,
          selectedSingleTextType: selectedTextType,
          lastClickedElement: lastClickedElement,
        }
      );

      showNotification(`Color applied to ${selectedTextType}`, "success");
    });
  }

  // Reset color palette value when clicked
  colorPalette.value = "#000000";
  colorPalette.click();
}
