export function initTypographyFontFamilyControls(
  getSelectedElement,
  addPendingModification,
  showNotification,
  saveTypographyModifications
) {
  const GOOGLE_FONTS_API =
    "https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyBPpLHcfY1Z1SfUIe78z6UvPe-wF31iwRk";

  const fontFamilyOptions = document.getElementById("scTypographyFontFamilyOptions");
  if (!fontFamilyOptions) {
    console.warn("❌ Typography font family options container not found");
    return;
  }

  // Check if fonts are already loaded
  if (fontFamilyOptions.children.length > 0) {
    console.log("✅ Fonts already loaded, skipping initialization");
    return;
  }

  const loader = document.createElement("div");
  loader.id = "sc-typography-font-loader";
  loader.innerHTML = `<div style="width: 24px; height: 24px; margin: 12px auto; border: 3px solid rgba(0, 0, 0, 0.1); border-top: 3px solid #EF7C2F; border-radius: 50%; animation: scSpin 0.8s linear infinite;"></div>`;
  document.head.insertAdjacentHTML(
    "beforeend",
    `
    <style>
      @keyframes scSpin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    </style>
  `
  );
  fontFamilyOptions.appendChild(loader);

  let fontsList = [];
  let fontIndex = 0;
  const fontsPerPage = 20;

  fetchFonts();

  async function fetchFonts() {
    try {
      const res = await fetch(GOOGLE_FONTS_API);
      const data = await res.json();
      fontsList = data.items;
      loader.remove();
      renderFontBatch();
    } catch (err) {
      loader.remove();
      console.error("❌ Failed to fetch Google Fonts:", err);
    }
  }

  fontFamilyOptions.addEventListener("scroll", () => {
    if (
      fontFamilyOptions.scrollTop + fontFamilyOptions.clientHeight >=
      fontFamilyOptions.scrollHeight - 5
    ) {
      renderFontBatch();
    }
  });

  function renderFontBatch() {
    const slice = fontsList.slice(fontIndex, fontIndex + fontsPerPage);

    slice.forEach((fontItem) => {
      const family = fontItem.family;
      const fontId = `typography-font-${family.replace(/\s+/g, "-")}`;
      const fontUrl = fontItem.files?.regular;

      if (fontUrl && !document.getElementById(fontId)) {
        const link = document.createElement("link");
        link.id = fontId;
        link.rel = "stylesheet";
        link.href = `https://fonts.googleapis.com/css2?family=${family.replace(
          /\s+/g,
          "+"
        )}&display=swap`;
        document.head.appendChild(link);
      }

      const div = document.createElement("div");
      div.className =
        "sc-dropdown-item sc-py-1px sc-text-center sc-cursor-pointer";
      div.textContent = family;
      div.style.fontFamily = `"${family}", sans-serif`;

      div.addEventListener("click", async () => {
        const selectedElement = getSelectedElement?.();
        if (!selectedElement) {
          showNotification("Please select a block first", "error");
          return;
        }

        const label = document.getElementById("scTypographyFontName");
        const fontFace = `"${family}", sans-serif`;

        try {
          await document.fonts.load(`1em ${fontFace}`);
          await new Promise((r) => setTimeout(r, 50));
        } catch (_) {}

        if (label) {
          label.innerText = family;
          label.classList.remove("sc-roboto");
          label.style.setProperty("font-family", fontFace, "important");
        }

        // Get the selected text type from global variables or active state
        const selectedTextType = getSelectedTextType();
        if (!selectedTextType) {
          showNotification("Please select a text type first", "error");
          return;
        }

        const blockId = selectedElement.id;
        if (!blockId) {
          console.warn("❌ No block ID found for selected element");
          return;
        }

        // Get the appropriate selector based on text type
        const paragraphSelector = getTextTypeSelector(selectedTextType);
        if (!paragraphSelector) {
          showNotification("Invalid text type selected", "error");
          return;
        }

        // Apply style to DOM
        const styleId = `sc-typography-font-style-${blockId}-${selectedTextType}`;
        let style = document.getElementById(styleId);
        if (!style) {
          style = document.createElement("style");
          style.id = styleId;
          document.head.appendChild(style);
        }

        style.innerHTML = `
          #${blockId} ${paragraphSelector} {
            font-family: ${fontFace} !important;
          }
        `;

        // Save to pending modifications
        mergeAndSaveTypographyStyles(
          blockId,
          selectedTextType,
          { fontFamily: fontFace },
          saveTypographyModifications,
          addPendingModification,
          showNotification,
          "font"
        );

        // Handle font weight options
        const fontWeightOptions = document.getElementById(
          "scTypographyFontWeightOptions"
        );
        const fontWeightSelectedLabel = document.getElementById(
          "scTypographyFontWeightSelected"
        );

        if (fontWeightOptions && fontItem.variants) {
          fontWeightOptions.innerHTML = "";

          const variants = fontItem.variants
            .filter((v) => v !== "italic")
            .map((v) => (v === "regular" ? "400" : v));

          variants.forEach((weight) => {
            const item = document.createElement("div");
            item.className =
              "sc-dropdown-item sc-py-1px sc-text-center sc-font-size-12 sc-cursor-pointer";
            item.innerText = weight;

            item.onclick = () => {
              if (fontWeightSelectedLabel) {
                fontWeightSelectedLabel.innerText = weight;
              }
              fontWeightOptions.classList.add("sc-hidden");

              // Apply weight style to DOM
              const weightStyleId = `sc-typography-font-weight-${blockId}-${selectedTextType}`;
              let weightStyle = document.getElementById(weightStyleId);
              if (!weightStyle) {
                weightStyle = document.createElement("style");
                weightStyle.id = weightStyleId;
                document.head.appendChild(weightStyle);
              }

              weightStyle.innerHTML = `
                #${blockId} ${paragraphSelector} {
                  font-weight: ${weight} !important;
                }
              `;

              // Save weight to pending modifications
              mergeAndSaveTypographyStyles(
                blockId,
                selectedTextType,
                { fontWeight: weight },
                saveTypographyModifications,
                addPendingModification,
                showNotification,
                "font"
              );
            };

            fontWeightOptions.appendChild(item);
          });

          if (fontWeightSelectedLabel) {
            fontWeightSelectedLabel.innerText = variants.includes("400")
              ? "400"
              : variants[0] || "";
          }
        }

        // Close the dropdown
        fontFamilyOptions.classList.add("sc-hidden");
      });

      fontFamilyOptions.appendChild(div);
    });

    fontIndex += fontsPerPage;
  }
}

// Helper function to get selected text type
function getSelectedTextType() {
  // Check for active text type buttons
  const activeTextTypeButton = document.querySelector('[data-text-type].sc-active, [data-text-type].active');
  if (activeTextTypeButton) {
    return activeTextTypeButton.getAttribute('data-text-type');
  }

  // Check global variable
  if (window.selectedSingleTextType) {
    return window.selectedSingleTextType;
  }

  // Check for active heading buttons
  const activeHeading = document.querySelector('#heading1.sc-active, #heading2.sc-active, #heading3.sc-active, #heading4.sc-active');
  if (activeHeading) {
    const headingId = activeHeading.id;
    if (headingId === 'heading1') return 'heading1';
    if (headingId === 'heading2') return 'heading2';
    if (headingId === 'heading3') return 'heading3';
    if (headingId === 'heading4') return 'heading4';
  }

  // Default to paragraph1 if nothing is selected
  return 'paragraph1';
}

// Helper function to get CSS selector based on text type
function getTextTypeSelector(selectedTextType) {
  switch (selectedTextType) {
    case "paragraph1":
      return "p.sqsrte-large";
    case "paragraph2":
      return "p:not(.sqsrte-large):not(.sqsrte-small)";
    case "paragraph3":
      return "p.sqsrte-small";
    case "heading1":
      return "h1";
    case "heading2":
      return "h2";
    case "heading3":
      return "h3";
    case "heading4":
      return "h4";
    default:
      return "p"; // fallback
  }
}

// Helper function to merge and save typography styles
function mergeAndSaveTypographyStyles(
  blockId,
  textType,
  newStyles,
  saveTypographyModifications,
  addPendingModification,
  showNotification,
  styleType
) {
  // Get existing styles for this block and text type
  const existingStyles = getExistingTypographyStyles(blockId, textType);
  
  // Merge with new styles
  const mergedStyles = { ...existingStyles, ...newStyles };
  
  // Save to pending modifications
  addPendingModification(blockId, {
    ...mergedStyles,
    target: textType,
    styleType: styleType
  });

  // Call save function if provided
  if (saveTypographyModifications) {
    saveTypographyModifications(blockId, textType, mergedStyles);
  }

  showNotification(`✅ Font ${styleType} applied to ${textType}`, "success");
}

// Helper function to get existing typography styles
function getExistingTypographyStyles(blockId, textType) {
  // This should retrieve existing styles for the block and text type
  // Implementation depends on how you store/retrieve existing styles
  return {};
} 