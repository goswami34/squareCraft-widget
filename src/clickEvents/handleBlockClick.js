// export function handleBlockClick(event, context) {
//     const {
//       getTextType,
//       setSelectedElement,
//       selectedElement,
//       setLastClickedBlockId,
//       setLastClickedElement,
//       setLastAppliedAlignment,
//       setLastActiveAlignmentElement,
//       setSelectedTextType,
//       setSelectedSingleTextType,
//       selectedSingleTextType,
//       lastClickedElement
//     } = context;

//     let block = event.target.closest('[id^="block-"]');
//     if (!block) return;

//     if (selectedElement) selectedElement.style.outline = "";
//     setSelectedElement(block);
//     block.style.outline = "1px dashed #EF7C2F";

//     setLastClickedBlockId(block.id);
//     setLastClickedElement(block);

//     //align code start here

//     let appliedTextAlign = window.getComputedStyle(block).textAlign;
//     if (!appliedTextAlign || appliedTextAlign === "start") {
//       const nested = block.querySelector("h1,h2,h3,h4,p");
//       if (nested) {
//         appliedTextAlign = window.getComputedStyle(nested).textAlign;
//       }
//     }

//     if (appliedTextAlign) {
//       setLastAppliedAlignment(appliedTextAlign);

//       const map = {
//         left: "scTextAlignLeft",
//         center: "scTextAlignCenter",
//         right: "scTextAlignRight",
//         justify: "scTextAlignJustify"
//       };

//       const activeIcon = document.getElementById(map[appliedTextAlign]);
//       if (activeIcon) {
//         activeIcon.classList.add("sc-activeTab-border");
//         activeIcon.classList.remove("sc-inActiveTab-border");
//         setLastActiveAlignmentElement(activeIcon);
//       }
//     }

//     const innerTextElements = block.querySelectorAll("h1,h2,h3,h4,p");
//     const allParts = [
//       "heading1Part", "heading2Part", "heading3Part", "heading4Part",
//       "paragraph1Part", "paragraph2Part", "paragraph3Part"
//     ];
//     const visibleParts = new Set();
//     console.log("🔍 visibleParts:", visibleParts);

//     innerTextElements.forEach(el => {
//       const tag = el.tagName.toLowerCase();
//       const result = getTextType(tag, el);
//       if (result) {
//         visibleParts.add(`${result.type}Part`);
//         el.style.border = `1px solid ${result.borderColor}`;
//         el.style.borderRadius = "4px";
//         el.style.padding = "2px 4px";
//       }

//       //new added code start here
//       if (tag === "p") {
//         if (el.classList.contains("sqsrte-large")) {
//           el.setAttribute("data-sc-type", "p1");
//         } else if (el.classList.contains("sqsrte-small")) {
//           el.setAttribute("data-sc-type", "p3");
//         } else {
//           el.setAttribute("data-sc-type", "p2");
//         }
//       }
//     });

//     allParts.forEach(id => {
//       const part = document.getElementById(id);
//       if (part) {
//         part.classList.toggle("sc-hidden", !visibleParts.has(id));
//       }
//     });

//     visibleParts.forEach(partId => {
//       const typeId = partId.replace("Part", "");
//       const tab = document.getElementById(typeId);
//       if (!tab) return;

//       tab.onmouseenter = () => {
//         const b = document.getElementById(block.id);
//         const t = typeId.startsWith("heading") ? `h${typeId.replace("heading", "")}` : "p";
//         b.querySelectorAll(t).forEach(el => {
//           const r = getTextType(t, el);
//           if (r?.type === typeId) {
//             el.style.outline = `2px solid ${r.borderColor}`;
//           }
//         });
//       };

//       tab.onmouseleave = () => {
//         const b = document.getElementById(block.id);
//         b.querySelectorAll("h1,h2,h3,h4,p").forEach(el => el.style.outline = "");
//       };
//     });

//     //align code end here

//     const firstInnerTextElement = block.querySelector("h1,h2,h3,h4,p1,p2,p3");
//     if (firstInnerTextElement) {
//       const firstTag = firstInnerTextElement.tagName.toLowerCase();
//       setSelectedSingleTextType(firstTag);
//       console.log("✅ Default selected text type after block click:", firstTag);
//     } else {
//       setSelectedSingleTextType(null);
//     }

//     const innerText = block.querySelector("h1,h2,h3,h4,p1,p2,p3");
//     if (innerText) {
//         visibleParts.forEach(partId => {
//           const typeId = partId.replace("Part", "");
//           const tab = document.getElementById(typeId);
//           if (!tab) return;

//           tab.onclick = () => {
//             const clickedTag = typeId.startsWith("heading") ? `h${typeId.replace("heading", "")}` : typeId;
//             console.log("🔍 clickedTag:", clickedTag);
//             setSelectedSingleTextType(clickedTag);
//             console.log("✅ Now selected text type:", clickedTag);
//           };
//         });
//       }else{
//         setSelectedSingleTextType(null);
//       }

//     //bold section font size code start here
//     const innerTextElementsFont = block.querySelectorAll("h1,h2,h3,h4,p,p1,p2,p3");

//     visibleParts.forEach(partId => {
//         const typeId = partId.replace("Part", "");
//         const tab = document.getElementById(typeId);
//         if (!tab) return;

//         tab.onclick = () => {
//           const clickedTag = typeId.startsWith("heading") ? `h${typeId.replace("heading", "")}` : typeId;
//           setSelectedSingleTextType(clickedTag);
//           console.log("✅ Now selected text type:", clickedTag);

//           const fontSizeInput = document.getElementById(`scFontSizeInput-${typeId}`);
//           if (fontSizeInput) {
//             fontSizeInput.focus(); // focus automatically
//           }
//       };
//     });

//     //bold section font size code end here

//     //font weight code start here
//     // const strongElementsByTag = {};
//     // innerTextElements.forEach(el => {
//     //   const tag = el.tagName.toLowerCase();
//     //   const strongTags = el.querySelectorAll('strong');
//     //   if (strongTags.length > 0) {
//     //     // Instead of storing the DOM elements, store just the count and text content
//     //     strongElementsByTag[tag] = {
//     //       count: strongTags.length,
//     //       texts: Array.from(strongTags).map(strong => strong.textContent)
//     //     };
//     //   }
//     // });

//     // // Store the strong elements data in the block's dataset
//     // block.dataset.strongElementsByTag = JSON.stringify(strongElementsByTag);

//     //font weight code end here

//   }

export async function handleBlockClick(event, context) {
  const {
    getTextType,
    getHoverTextType,
    setSelectedElement,
    selectedElement,
    setLastClickedBlockId,
    setLastClickedElement,
    setLastAppliedAlignment,
    setLastActiveAlignmentElement,
  } = context;
  const block = event.target.closest('[id^="block-"]');
  if (!block) return;
  if (selectedElement && selectedElement !== block) {
    selectedElement.style.outline = "";
    selectedElement.classList.remove("sc-selected");
    selectedElement.querySelectorAll("h1,h2,h3,h4,p").forEach((el) => {
      el.style.border = "";
      el.style.borderRadius = "";
      el.style.padding = "";
    });
  }
  setSelectedElement(block);
  block.classList.add("sc-selected");
  if (typeof window.syncButtonStylesFromElement === "function") {
    window.syncButtonStylesFromElement(block);
  }
  if (typeof window.syncHoverButtonStylesFromElement === "function") {
    window.syncHoverButtonStylesFromElement(block);
  }
  if (typeof window.updateActiveButtonBars === "function") {
    window.updateActiveButtonBars();
  }
  setLastClickedBlockId(block.id);
  setLastClickedElement(block);
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
  const allParts = [
    "heading1Part",
    "heading2Part",
    "heading3Part",
    "heading4Part",
    "paragraph1Part",
    "paragraph2Part",
    "paragraph3Part",
  ];
  const allTabs = [
    "heading1",
    "heading2",
    "heading3",
    "heading4",
    "paragraph1",
    "paragraph2",
    "paragraph3",
  ];
  const visibleParts = new Set();
  const innerTextElements = block.querySelectorAll("h1,h2,h3,h4,p");
  innerTextElements.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const result = getTextType(tag, el);
    if (result) {
      visibleParts.add(`${result.type}Part`);
      el.style.border = `1px solid ${result.borderColor}`;
      el.style.borderRadius = "4px";
      el.style.padding = "2px 4px";
    }
  });
  await waitForPartsAndTabsReady(allParts, allTabs);
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
      b.querySelectorAll("h1,h2,h3,h4,p").forEach((el) => {
        el.style.outline = "";
      });
    };
  });
  const hoverParts = allParts.map((id) => `hover-${id}`);
  const hoverTabs = allTabs.map((id) => `hover-${id}`);
  const visibleHoverParts = new Set();
  innerTextElements.forEach((el) => {
    const tag = el.tagName.toLowerCase();
    const result = getHoverTextType(tag, el);
    if (result) {
      visibleHoverParts.add(`hover-${result.type}Part`);
      el.style.border = `1px dashed ${result.borderColor}`;
      el.style.borderRadius = "4px";
      el.style.padding = "2px 4px";
    }
  });
  await waitForPartsAndTabsReady(hoverParts, hoverTabs);
  hoverParts.forEach((id) => {
    const part = document.getElementById(id);
    if (part) {
      part.classList.toggle("sc-hidden", !visibleHoverParts.has(id));
    }
  });
  visibleHoverParts.forEach((partId) => {
    const typeId = partId.replace("hover-", "").replace("Part", "");
    const tab = document.getElementById(`hover-${typeId}`);
    if (!tab) return;
    tab.onmouseenter = () => {
      const b = document.getElementById(block.id);
      const t = typeId.startsWith("heading")
        ? `h${typeId.replace("heading", "")}`
        : "p";
      b.querySelectorAll(t).forEach((el) => {
        const r = getHoverTextType(t, el);
        if (r?.type === typeId) {
          el.style.outline = `2px dashed ${r.borderColor}`;
        }
      });
    };
    tab.onmouseleave = () => {
      const b = document.getElementById(block.id);
      b.querySelectorAll("h1,h2,h3,h4,p").forEach((el) => {
        el.style.outline = "";
      });
    };
  });
}
async function waitForPartsAndTabsReady(allParts, allTabs) {
  for (let attempt = 0; attempt < 10; attempt++) {
    const partsReady = allParts.every((id) => document.getElementById(id));
    const tabsReady = allTabs.every((id) => document.getElementById(id));
    if (partsReady && tabsReady) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
}
