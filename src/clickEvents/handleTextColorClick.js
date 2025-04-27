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
      if (!lastClickedElement) return;

      textColorPalate.style.backgroundColor = selectedColor;

      const textColorHtml = document.getElementById("textcolorHtml");
      if (textColorHtml) {
        textColorHtml.textContent = selectedColor;
      }

      // ✅ Real-time detect selected tab (h1, h2, etc.)
      const selectedTab = document.querySelector(".sc-selected-tab");
      let selectedTextType = null;

      // if (selectedTab?.id?.startsWith("heading")) {
      //   selectedTextType = `heading${selectedTab.id.replace("heading", "")}`;
      // } else if (selectedTab?.id?.startsWith("paragraph")) {
      //   selectedTextType = `paragraph${selectedTab.id.replace(
      //     "paragraph",
      //     ""
      //   )}`;
      // }

      if (selectedTab === "paragraph1") {
        paragraphSelector = "p.sqsrte-large";
      } else if (selectedTab === "paragraph2") {
        paragraphSelector = "p:not(.sqsrte-large):not(.sqsrte-small)";
      } else if (selectedTab === "paragraph3") {
        paragraphSelector = "p.sqsrte-small";
      } else if (selectedTab === "heading1") {
        paragraphSelector = "h1";
      } else if (selectedTab === "heading2") {
        paragraphSelector = "h2";
      } else if (selectedTab === "heading3") {
        paragraphSelector = "h3";
      } else if (selectedTab === "heading4") {
        paragraphSelector = "h4";
      } else {
        return;
      }

      if (!selectedTextType) {
        console.error("❌ No selected tab found for text type");
        return;
      }

      // ✅ Now call handleAllTextColorClick immediately with correct context
      context.handleAllTextColorClick(
        { selectedColor },
        {
          ...context,
          selectedSingleTextType: selectedTextType,
          lastClickedElement: lastClickedElement, // Pass updated block
        }
      );
    });
  }

  colorPalette.click();
}
