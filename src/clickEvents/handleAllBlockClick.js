export function handleAllBlockClick(event, context) {
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
    lastClickedBlockId,
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
    console.log("🔍 part:", part);
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

  const firstInnerTextElement = block.querySelector("h1,h2,h3,h4,p");

  if (firstInnerTextElement) {
    const tag = firstInnerTextElement.tagName.toLowerCase();
    if (tag === "p") {
      if (firstInnerTextElement.classList.contains("sqsrte-large")) {
        setSelectedSingleTextType("paragraph1");
      } else if (firstInnerTextElement.classList.contains("sqsrte-small")) {
        setSelectedSingleTextType("paragraph3");
      } else {
        setSelectedSingleTextType("paragraph2");
      }
    } else {
      setSelectedSingleTextType(`heading${tag.replace("h", "")}`);
    }
  } else {
    setSelectedSingleTextType(null);
  }

  // if (firstInnerTextElement) {
  //   const firstTag = firstInnerTextElement.tagName.toLowerCase();
  //   setSelectedSingleTextType(firstTag);
  //   console.log("✅ Default selected text type after block click:", firstTag);
  // } else {
  //   setSelectedSingleTextType(null);
  // }

  const innerText = block.querySelector("h1,h2,h3,h4,p1,p2,p3");
  if (innerText) {
    visibleParts.forEach((partId) => {
      const typeId = partId.replace("Part", "");
      const tab = document.getElementById(typeId);
      if (!tab) return;

      tab.onclick = () => {
        const clickedTag = typeId.startsWith("heading")
          ? `h${typeId.replace("heading", "")}`
          : typeId;
        console.log("🔍 clickedTag:", clickedTag);
        setSelectedSingleTextType(clickedTag);
        console.log("✅ Now selected text type:", clickedTag);
      };
    });
  } else {
    setSelectedSingleTextType(null);
  }

  //all section font size code start here
  const innerTextElementsFont = block.querySelectorAll(
    "h1,h2,h3,h4,p,p1,p2,p3"
  );

  visibleParts.forEach((partId) => {
    const typeId = partId.replace("Part", "");
    const tab = document.getElementById(typeId);
    if (!tab) return;

    // tab.onclick = () => {
    //   const clickedTag = typeId.startsWith("heading")
    //     ? `h${typeId.replace("heading", "")}`
    //     : typeId;
    //   setSelectedSingleTextType(clickedTag);
    //   console.log("✅ Now selected text type:", clickedTag);

    //   const linkFontSizeInput = document.getElementById(
    //     `scFontSizeInputLink-${typeId}`
    //   );
    //   if (linkFontSizeInput) {
    //     linkFontSizeInput.focus();
    //   }
    // };
    // tab.onclick = () => {
    //   const clickedTag = typeId.startsWith("heading")
    //     ? `h${typeId.replace("heading", "")}`
    //     : typeId;
    //   setSelectedSingleTextType(clickedTag);

    //   // Get the actual font size of the clicked text type
    //   const selectedElements = block.querySelectorAll(
    //     clickedTag === "p1"
    //       ? "p.sqsrte-large"
    //       : clickedTag === "p2"
    //       ? "p:not(.sqsrte-large):not(.sqsrte-small)"
    //       : clickedTag === "p3"
    //       ? "p.sqsrte-small"
    //       : clickedTag
    //   );

    //   if (selectedElements.length > 0) {
    //     const computedFontSize = window.getComputedStyle(
    //       selectedElements[0]
    //     ).fontSize;
    //     const fontSizeValue = parseInt(computedFontSize);

    //     // Update the font size input value
    //     const fontSizeInput = document.getElementById("scAllFontSizeInput");
    //     if (fontSizeInput) {
    //       fontSizeInput.value = fontSizeValue;
    //     }
    //   }

    //   console.log("✅ Now selected text type:", clickedTag);
    // };

    visibleParts.forEach((partId) => {
      const typeId = partId.replace("Part", "");
      const tab = document.getElementById(typeId);
      if (!tab) return;

      tab.onclick = () => {
        const clickedTag = typeId.startsWith("heading")
          ? `h${typeId.replace("heading", "")}`
          : typeId;
        setSelectedSingleTextType(clickedTag);
        console.log("✅ Now selected text type:", clickedTag);

        const fontSizeInput = document.getElementById(
          `scFontSizeInput-${typeId}`
        );
        if (fontSizeInput) {
          fontSizeInput.focus();
        }
      };
    });
  });

  visibleParts.forEach((partId) => {
    const typeId = partId.replace("Part", "");
    const tab = document.getElementById(typeId);
    if (!tab) return;

    tab.onclick = () => {
      const clickedTag = typeId.startsWith("heading")
        ? `h${typeId.replace("heading", "")}`
        : typeId;
      setSelectedSingleTextType(clickedTag);
      console.log("✅ Now selected text type:", clickedTag);

      const textAlignInput = document.getElementById(
        `scTextAlignInput-${typeId}`
      );
      if (textAlignInput) {
        textAlignInput.focus();
      }
    };
  });

  visibleParts.forEach((partId) => {
    const typeId = partId.replace("Part", "");
    const tab = document.getElementById(typeId);
    if (!tab) return;

    tab.onclick = () => {
      const clickedTag = typeId.startsWith("heading")
        ? `h${typeId.replace("heading", "")}`
        : typeId;
      setSelectedSingleTextType(clickedTag);
      console.log("✅ Now selected text type:", clickedTag);

      const letterSpacingInput = document.getElementById(
        `scLetterSpacingInput-${typeId}`
      );
      if (letterSpacingInput) {
        letterSpacingInput.focus();
      }
    };
  });

  visibleParts.forEach((partId) => {
    const typeId = partId.replace("Part", "");
    const tab = document.getElementById(typeId);
    if (!tab) return;

    tab.onclick = () => {
      const clickedTag = typeId.startsWith("heading")
        ? `h${typeId.replace("heading", "")}`
        : typeId;
      setSelectedSingleTextType(clickedTag);
      console.log("✅ Now selected text type:", clickedTag);

      const lineHeightInput = document.getElementById(
        `scLineHeightInput-${typeId}`
      );
      if (letterSpacingInput) {
        lineHeightInput.focus();
      }
    };
  });

  visibleParts.forEach((partId) => {
    const typeId = partId.replace("Part", "");
    const tab = document.getElementById(typeId);
    if (!tab) return;

    tab.onclick = () => {
      const clickedTag = typeId.startsWith("heading")
        ? `h${typeId.replace("heading", "")}`
        : typeId;
      setSelectedSingleTextType(clickedTag);
      console.log("✅ Now selected text type:", clickedTag);

      const fontWeightInput = document.getElementById(
        `scFontWeightInput-${typeId}`
      );
      if (fontWeightInput) {
        fontWeightInput.focus();
      }
    };
  });

  // visibleParts.forEach((partId) => {
  //   const typeId = partId.replace("Part", "");
  //   const tab = document.getElementById(typeId);
  //   if (!tab) return;

  //   tab.onclick = () => {
  //     const clickedType = typeId; // 🔥 Don't modify heading1/2/3, paragraph1/2/3
  //     setSelectedSingleTextType(clickedType);
  //     console.log("✅ Now selected text type for font-family:", clickedType);

  //     // ✅ Update font dropdown to match selected text type
  //     const block = document.getElementById(lastClickedBlockId);
  //     if (!block) return;

  //     let selector = "";

  //     if (clickedType === "paragraph1") {
  //       selector = "p.sqsrte-large";
  //     } else if (clickedType === "paragraph2") {
  //       selector = "p:not(.sqsrte-large):not(.sqsrte-small)";
  //     } else if (clickedType === "paragraph3") {
  //       selector = "p.sqsrte-small";
  //     } else if (clickedType === "heading1") {
  //       selector = "h1";
  //     } else if (clickedType === "heading2") {
  //       selector = "h2";
  //     } else if (clickedType === "heading3") {
  //       selector = "h3";
  //     } else if (clickedType === "heading4") {
  //       selector = "h4";
  //     }

  //     if (selector) {
  //       const element = block.querySelector(selector);
  //       const fontFamilyDropdown = document.getElementById(
  //         "squareCraftAllFontFamily"
  //       );
  //       if (element && fontFamilyDropdown) {
  //         const currentFontFamily = window.getComputedStyle(element).fontFamily;
  //         console.log(
  //           "🔍 Detected font-family for",
  //           clickedType,
  //           ":",
  //           currentFontFamily
  //         );

  //         // Set dropdown value if font found
  //         for (let i = 0; i < fontFamilyDropdown.options.length; i++) {
  //           if (fontFamilyDropdown.options[i].value === currentFontFamily) {
  //             fontFamilyDropdown.selectedIndex = i;
  //             break;
  //           }
  //         }
  //       }
  //     }
  //   };
  // });

  visibleParts.forEach((partId) => {
    const typeId = partId.replace("Part", "");
    const tab = document.getElementById(typeId);
    if (!tab) return;

    tab.onclick = () => {
      const clickedTag = typeId.startsWith("heading")
        ? `h${typeId.replace("heading", "")}`
        : typeId;
      setSelectedSingleTextType(clickedTag);
      console.log("✅ Now selected text type:", clickedTag);

      const fontFamilyInput = document.getElementById(
        `squareCraftAllFontFamily-${typeId}`
      );
      if (fontFamilyInput) {
        fontFamilyInput.focus();
      }
    };
  });

  //all section code end here
}
