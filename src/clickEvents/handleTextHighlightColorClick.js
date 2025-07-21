let colorPalette = null;
let colorPickerContext = null;

export function handleTextHighlightColorClick(
  event,
  lastClickedElement,
  applyStylesToElement,
  context
) {
  const textHighlightPalate = event.target.closest("#texHeightlistPalate");
  if (!textHighlightPalate) return;

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

      const textHighlightPalate = document.getElementById(
        "textHighlightPalate"
      );
      if (textHighlightPalate) {
        textHighlightPalate.style.backgroundColor = selectedColor;
      }

      const textHighlightHtml = document.getElementById("texHeightlistHtml");
      if (textHighlightHtml) {
        textHighlightHtml.textContent = selectedColor;
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

      targetElements.forEach((el) => {
        el.style.color = selectedColor;
      });

      colorPickerContext.handleAllTextHighlightClick(
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
