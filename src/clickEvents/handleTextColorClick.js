// export function handleTextColorClick(event, lastClickedElement, applyStylesToElement) {
//     const textColorPalate = event.target.closest('#textColorPalate');
//     if (!textColorPalate) return;

//     let colorPalette = document.getElementById("scColorPalette");

//     if (!colorPalette) {
//       colorPalette = document.createElement("input");
//       colorPalette.type = "color";
//       colorPalette.id = "scColorPalette";
//       colorPalette.style.opacity = "0";
//       colorPalette.style.width = "0px";
//       colorPalette.style.height = "0px";
//       colorPalette.style.marginTop = "14px";

//       textColorPalate.appendChild(colorPalette);

//       colorPalette.addEventListener("input", function (event) {
//         if (lastClickedElement) {
//           const selectedColor = event.target.value;
//           applyStylesToElement(lastClickedElement, { "color": `${selectedColor} !important` });
//           textColorPalate.style.backgroundColor = selectedColor;

//           const textColorHtml = document.getElementById("textcolorHtml");
//           if (textColorHtml) {
//             textColorHtml.textContent = selectedColor;
//           }

//         }
//       });
//     }

//     colorPalette.click();
//   }

export function handleTextColorClick(
  event,
  lastClickedElement,
  applyStylesToElement,
  context,
  handleAllTextColorClick
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
      if (lastClickedElement) {
        // Update button background color
        textColorPalate.style.backgroundColor = selectedColor;

        // Update label text
        const textColorHtml = document.getElementById("textcolorHtml");
        if (textColorHtml) {
          textColorHtml.textContent = selectedColor;
        }

        // ✅ Apply new selected color immediately
        handleAllTextColorClick({ selectedColor }, context);
      }
    });
  }

  // 📌 Always trigger color picker click
  colorPalette.click();
}
