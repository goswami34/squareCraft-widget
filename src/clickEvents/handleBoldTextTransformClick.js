export function handleBoldTextTransformClick(event, context) {
  const {
    getTextType,
    setSelectedElement,
    selectedElement,
    setLastClickedBlockId,
    setLastClickedElement,
    setLastAppliedAlignment,
    setLastActiveAlignmentElement,
    setSelectedTextType,
    setSelectedSingleTextType,
    selectedSingleTextType,
    lastClickedElement,
    handleFontWeightClick,
    addPendingModification,
    showNotification,
    handleTextColorclicked,
  } = context;

  let block = event.target.closest('[id^="block-"]');
  if (!block) return;

  if (selectedElement) selectedElement.style.outline = "";
  setSelectedElement(block);
  block.style.outline = "1px dashed #EF7C2F";

  setLastClickedBlockId(block.id);
  setLastClickedElement(block);

  //align code start here

  let appliedTextAlign = window.getComputedStyle(block).textAlign;
  if (!appliedTextAlign || appliedTextAlign === "start") {
    const nested = block.querySelector("h1,h2,h3,h4,p");
    if (nested) {
      appliedTextAlign = window.getComputedStyle(nested).textAlign;
    }
  }

  if (appliedTextAlign) {
    setLastAppliedAlignment(appliedTextAlign);

    const map = {
      left: "scTextAlignLeft",
      center: "scTextAlignCenter",
      right: "scTextAlignRight",
      justify: "scTextAlignJustify",
    };

    const activeIcon = document.getElementById(map[appliedTextAlign]);
    if (activeIcon) {
      activeIcon.classList.add("sc-activeTab-border");
      activeIcon.classList.remove("sc-inActiveTab-border");
      setLastActiveAlignmentElement(activeIcon);
    }
  }

  const innerTextElements = block.querySelectorAll("h1,h2,h3,h4,p");
  const allParts = [
    "heading1Part",
    "heading2Part",
    "heading3Part",
    "heading4Part",
    "paragraph1Part",
    "paragraph2Part",
    "paragraph3Part",
  ];
  const visibleParts = new Set();
  console.log("🔍 visibleParts:", visibleParts);

  innerTextElements.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const result = getTextType(tag, el);
    if (result) {
      visibleParts.add(`${result.type}Part`);
      el.style.border = `1px solid ${result.borderColor}`;
      el.style.borderRadius = "4px";
      el.style.padding = "2px 4px";
    }

    //new added code start here
    if (tag === "p") {
      if (el.classList.contains("sqsrte-large")) {
        el.setAttribute("data-sc-type", "p1");
      } else if (el.classList.contains("sqsrte-small")) {
        el.setAttribute("data-sc-type", "p3");
      } else {
        el.setAttribute("data-sc-type", "p2");
      }
    }
  });

  allParts.forEach((id) => {
    const part = document.getElementById(id);
    if (part) {
      part.classList.toggle("sc-hidden", !visibleParts.has(id));
    }
  });

  visibleParts.forEach((partId) => {
    const typeId = partId.replace("Part", "");
    const tab = document.getElementById(typeId);
    if (!tab) return;

    tab.onmouseenter = () => {
      const b = document.getElementById(block.id);
      const t = typeId.startsWith("heading")
        ? `h${typeId.replace("heading", "")}`
        : "p";
      b.querySelectorAll(t).forEach((el) => {
        const r = getTextType(t, el);
        if (r?.type === typeId) {
          el.style.outline = `2px solid ${r.borderColor}`;
        }
      });
    };

    tab.onmouseleave = () => {
      const b = document.getElementById(block.id);
      b.querySelectorAll("h1,h2,h3,h4,p").forEach(
        (el) => (el.style.outline = "")
      );
    };
  });

  //align code end here

  // text transform code start here

  visibleParts.forEach((partId) => {
    const typeId = partId.replace("Part", "");
    const tab = document.getElementById(typeId);
    if (!tab) return;

    tab.onclick = () => {
      let clickedTag = "";

      if (typeId.startsWith("heading")) {
        clickedTag = `heading${typeId.replace("heading", "")}`;
      } else if (typeId.startsWith("paragraph")) {
        clickedTag = `paragraph${typeId.replace("paragraph", "")}`;
      }

      console.log("✅ Clicked tab detected:", clickedTag);
      setSelectedSingleTextType(clickedTag);

      const fontSizeInput = document.getElementById(
        `squareCraftBoldElementTextTransform-${typeId}`
      );
      if (fontSizeInput) {
        fontSizeInput.focus(); // auto focus
      }
    };
  });

  // text transform code end here

  // font weight code start here
  visibleParts.forEach((partId) => {
    const typeId = partId.replace("Part", "");
    const tab = document.getElementById(typeId);
    if (!tab) return;

    tab.onclick = () => {
      let clickedTag = "";

      if (typeId.startsWith("heading")) {
        clickedTag = `heading${typeId.replace("heading", "")}`;
      } else if (typeId.startsWith("paragraph")) {
        clickedTag = `paragraph${typeId.replace("paragraph", "")}`;
      } else if (typeId.startsWith("p")) {
        clickedTag = `paragraph${typeId.replace("p", "")}`;
      } else {
        clickedTag = typeId;
      }

      console.log("✅ Clicked tab detected:", clickedTag);
      setSelectedSingleTextType(clickedTag);

      // ✅ Now trigger Font Weight select change manually
      const fontWeightSelect = document.getElementById(
        `squareCraftFontWeight-${typeId}`
      );
      if (fontWeightSelect) {
        fontWeightSelect.focus();
      }
    };
  });

  // font weight code end here

  // text color code start here
  // visibleParts.forEach(partId => {
  //   const typeId = partId.replace("Part", "");
  //   const tab = document.getElementById(typeId);
  //   if (!tab) return;

  //   // tab.onclick = () => {
  //   //   let clickedTag = "";

  //   //   if (typeId.startsWith("heading")) {
  //   //     clickedTag = `heading${typeId.replace("heading", "")}`;
  //   //   } else if (typeId.startsWith("paragraph")) {
  //   //     clickedTag = `paragraph${typeId.replace("paragraph", "")}`;
  //   //   }

  //   //   console.log("✅ Clicked tab detected:", clickedTag);
  //   //   setSelectedSingleTextType(clickedTag);

  //   //   // Now initialize the color input for the selected text
  //   //   handleTextColorclicked({
  //   //     lastClickedElement,
  //   //     selectedSingleTextType: clickedTag,
  //   //     addPendingModification,
  //   //     showNotification
  //   //   });
  //   // };

  //   tab.onclick = () => {
  //     let clickedTag = "";

  //     if (typeId.startsWith("heading")) {
  //       clickedTag = `heading${typeId.replace("heading", "")}`;
  //     } else if (typeId.startsWith("paragraph")) {
  //       clickedTag = `paragraph${typeId.replace("paragraph", "")}`;
  //     }

  //     setSelectedSingleTextType(clickedTag);

  //     // ✅ Only after setting selected text type, now call:
  //     handleTextColorclicked({
  //       lastClickedElement,
  //       selectedSingleTextType: clickedTag,
  //       addPendingModification,
  //       showNotification,
  //     });
  //   };

  // });

  // In handleBoldTextTransformClick.js, modify the text color section:
  visibleParts.forEach((partId) => {
    const typeId = partId.replace("Part", "");
    const tab = document.getElementById(typeId);
    if (!tab) return;

    tab.onclick = () => {
      let clickedTag = "";

      if (typeId.startsWith("heading")) {
        clickedTag = `heading${typeId.replace("heading", "")}`;
      } else if (typeId.startsWith("paragraph")) {
        clickedTag = `paragraph${typeId.replace("paragraph", "")}`;
      }

      setSelectedSingleTextType(clickedTag);

      // Initialize text color functionality
      const colorInput = document.getElementById("scTextColor");
      const colorHexInput = document.getElementById("scColorHex");

      if (colorInput && colorHexInput) {
        // Remove old listeners
        colorInput.oninput = null;
        colorHexInput.oninput = null;

        // Add new listeners
        colorInput.addEventListener("input", function () {
          const color = colorInput.value;
          applyColorToStrong(color);
          colorHexInput.value = color.toUpperCase();
        });

        colorHexInput.addEventListener("input", function () {
          let color = colorHexInput.value;
          if (!color.startsWith("#")) {
            color = "#" + color;
          }
          if (/^#[0-9A-F]{6}$/i.test(color)) {
            applyColorToStrong(color);
            colorInput.value = color;
          }
        });
      }
    };
  });

  // In handleTextColor.js, modify the applyColorToStrong function:

  // text color code end here
}
