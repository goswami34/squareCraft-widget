export function handleItalicBlockClick(event, context) {
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

  const firstInnerTextElement = block.querySelector("h1,h2,h3,h4,p1,p2,p3");
  if (firstInnerTextElement) {
    const firstTag = firstInnerTextElement.tagName.toLowerCase();
    setSelectedSingleTextType(firstTag);
    console.log("✅ Default selected text type after block click:", firstTag);
  } else {
    setSelectedSingleTextType(null);
  }

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

  //Link section font size code start here
  const innerTextElementsFont = block.querySelectorAll(
    "h1,h2,h3,h4,p,p1,p2,p3"
  );

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

      const linkFontSizeInput = document.getElementById(
        `scFontSizeItalicInput-${typeId}`
      );
      if (linkFontSizeInput) {
        linkFontSizeInput.focus(); // 👈 Focus Link font size input separately
      }
    };
  });

  //Link section font size code end here

  //italic section font-weight code start here
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
        `squareCraftItalicFontWeight-${typeId}`
      );
      if (fontSizeInput) {
        fontSizeInput.focus();
      }
    };
  });

  // italic section font-weight code end here

  //italic section text transform code start here
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

      const textTransformInput = document.getElementById(
        `squareCraft-text-transform-${typeId}`
      );
      if (textTransformInput) {
        textTransformInput.focus();
      }
    };
  });

  // italic section text transform code end here

  //   visibleParts.forEach((partId) => {
  //     const typeId = partId.replace("Part", "");
  //     const tab = document.getElementById(typeId);
  //     if (!tab) return;

  //     tab.onclick = () => {
  //       let clickedTag = "";
  //       if (typeId.startsWith("heading")) {
  //         clickedTag = `h${typeId.replace("heading", "")}`;
  //       } else if (typeId.startsWith("paragraph")) {
  //         clickedTag = `p${typeId.replace("paragraph", "")}`;
  //       }

  //       setSelectedSingleTextType(clickedTag);
  //       console.log("✅ Now selected text type:", clickedTag);

  //       // highlight
  //       document
  //         .querySelectorAll('[id^="heading"], [id^="paragraph"]')
  //         .forEach((t) => t.classList.remove("sc-selected-tab"));
  //       tab.classList.add("sc-selected-tab");

  //       // Reset and attach font weight listener
  //       const fwSelect = document.getElementById("squareCraftLinkFontWeight");
  //       if (fwSelect) {
  //         const cloned = fwSelect.cloneNode(true);
  //         fwSelect.parentNode.replaceChild(cloned, fwSelect);

  //         cloned.value = "400";
  //         cloned.addEventListener("change", function (e) {
  //           const currentlySelectedBlock = document.querySelector(".sc-selected");
  //           if (!currentlySelectedBlock) {
  //             showNotification("❌ Please select a block first.", "error");
  //             return;
  //           }

  //           import(
  //             "https://goswami34.github.io/squareCraft-widget/src/Link/handleFontWeightLink.js"
  //           ).then((module) => {
  //             module.handleFontWeightLink(e, {
  //               lastClickedElement: currentlySelectedBlock,
  //               selectedSingleTextType: clickedTag,
  //               addPendingModification,
  //               showNotification,
  //             });
  //           });
  //         });
  //       }
  //     };
  //   });

  //text high light code start here
}
