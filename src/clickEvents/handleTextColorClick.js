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
  context
) {
  const { handleAllTextColorClick } = context; // ✅ pulling from context

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

    // ✅ Corrected event listener
    colorPalette.addEventListener("input", function (event) {
      const selectedColor = event.target.value;
      if (lastClickedElement) {
        textColorPalate.style.backgroundColor = selectedColor;

        const textColorHtml = document.getElementById("textcolorHtml");
        if (textColorHtml) {
          textColorHtml.textContent = selectedColor;
        }

        // ✅ Correctly accessing from context
        handleAllTextColorClick({ selectedColor }, context);
      }
    });
  }

  colorPalette.click();
}
