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
  
//     innerTextElements.forEach(el => {
//       const tag = el.tagName.toLowerCase();
//       const result = getTextType(tag, el);
//       if (result) {
//         visibleParts.add(`${result.type}Part`);
//         el.style.border = `1px solid ${result.borderColor}`;
//         el.style.borderRadius = "4px";
//         el.style.padding = "2px 4px";
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


//     // const innerText = block.querySelector("h1,h2,h3,h4,p");
//     // if (innerText) {
//     //     const tagName = innerText.tagName.toLowerCase();
//     //     setSelectedSingleTextType(tagName);
//     //     console.log("✅ Default selected text type from block:", tagName);
//     // } else {
//     //     setSelectedSingleTextType(null);
//     // }

//     const innerText = block.querySelector("h1,h2,h3,h4,p");
//     if (innerText) {
//         visibleParts.forEach(partId => {
//           const typeId = partId.replace("Part", "");
//           const tab = document.getElementById(typeId);
//           if (!tab) return;
        
//           tab.onclick = () => {
//             const clickedTag = typeId.startsWith("heading") ? `h${typeId.replace("heading", "")}` : "p";
//             setSelectedSingleTextType(clickedTag);
//             console.log("✅ Now selected text type:", clickedTag);
//           };
//         });
//       }else{
//         setSelectedSingleTextType(null);
//       }
    



//     //bold section font size code start here
//     const innerTextElementsFont = block.querySelectorAll("h1,h2,h3,h4,p,p1,p2,p3");
//     // if (innerTextElementsFont.length > 0) {
//     //     const firstTag = innerTextElementsFont[0].tagName.toLowerCase();
//     //     setSelectedTextType(firstTag);  // save selected tag type
//     // } else {
//     //     setSelectedTextType(null);
//     // }

//     // const detectedTags = new Set(); // to collect all tag names

//     // innerTextElementsFont.forEach(el => {
//     //     const tag = el.tagName.toLowerCase();
//     //     detectedTags.add(tag);
//     // });

//     // if (detectedTags.size > 0) {
//     //     setSelectedTextType(Array.from(detectedTags)); // save all tags
//     // } else {
//     //     setSelectedTextType([]);
//     // }

//   //   visibleParts.forEach(partId => {
//   //     const typeId = partId.replace("Part", "");
//   //     const tab = document.getElementById(typeId);
//   //     if (!tab) return;
  
//   //     tab.onclick = () => {
//   //         setSelectedSingleTextType(typeId.startsWith("heading") ? `h${typeId.replace("heading", "")}` : "p");
//   //         console.log("✅ Now selected text type:", selectedSingleTextType);
//   //     };
//   // });

//   visibleParts.forEach(partId => {
//     const typeId = partId.replace("Part", "");
//     const tab = document.getElementById(typeId);
//     if (!tab) return;

//     tab.onclick = () => {
//       const clickedTag = typeId.startsWith("heading") ? `h${typeId.replace("heading", "")}` : "p";
//       setSelectedSingleTextType(clickedTag);
//       console.log("✅ Now selected text type:", clickedTag);
   
//       const fontSizeInput = document.getElementById(`scFontSizeInput-${typeId}`);
//       if (fontSizeInput) {
//         fontSizeInput.focus(); // focus automatically
//       }
//    };
// });

  
    
//     //bold section font size code end here



//     //font weight code start here
//     // In handleBlockClick.js
//     const strongElementsByTag = {};
//     innerTextElements.forEach(el => {
//       const tag = el.tagName.toLowerCase();
//       const strongTags = el.querySelectorAll('strong');
//       if (strongTags.length > 0) {
//         // Instead of storing the DOM elements, store just the count and text content
//         strongElementsByTag[tag] = {
//           count: strongTags.length,
//           texts: Array.from(strongTags).map(strong => strong.textContent)
//         };
//       }
//     });

//     // Store the strong elements data in the block's dataset
//     block.dataset.strongElementsByTag = JSON.stringify(strongElementsByTag);
//     //font weight code end here
    
//   }


export function handleBlockClick(event, context) {
  const {
    getTextType,
    setSelectedElement,
    selectedElement,
    setLastClickedBlockId,
    setLastClickedElement,
    setLastAppliedAlignment,
    setLastActiveAlignmentElement,
    setSelectedSingleTextType,
    selectedTextElement,
    setSelectedTextElement
  } = context;

  let block = event.target.closest('[id^="block-"]');
  if (!block) return;

  if (selectedElement) selectedElement.style.outline = "";
  setSelectedElement(block);
  block.style.outline = "1px dashed #EF7C2F";

  setLastClickedBlockId(block.id);
  setLastClickedElement(block);

  // Alignment code
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
      justify: "scTextAlignJustify"
    };
    const activeIcon = document.getElementById(map[appliedTextAlign]);
    if (activeIcon) {
      activeIcon.classList.add("sc-activeTab-border");
      activeIcon.classList.remove("sc-inActiveTab-border");
      setLastActiveAlignmentElement(activeIcon);
    }
  }

  // --- Text type detection
  const innerTextElements = block.querySelectorAll("h1,h2,h3,h4,p");
  const allParts = [
    "heading1Part", "heading2Part", "heading3Part", "heading4Part",
    "paragraph1Part", "paragraph2Part", "paragraph3Part"
  ];
  const visibleParts = new Set();

  innerTextElements.forEach(el => {
    const tag = el.tagName.toLowerCase();
    const result = getTextType(tag, el);
    if (result) {
      visibleParts.add(`${result.type}Part`);
      el.style.border = `1px solid ${result.borderColor}`;
      el.style.borderRadius = "4px";
      el.style.padding = "2px 4px";
    }
  });

  allParts.forEach(id => {
    const part = document.getElementById(id);
    if (part) {
      part.classList.toggle("sc-hidden", !visibleParts.has(id));
    }
  });

  // --- Tab click event attach
  visibleParts.forEach(partId => {
    const typeId = partId.replace("Part", "");
    const tab = document.getElementById(typeId);
    if (!tab) return;

    // tab.onclick = () => {
    //   const clickedTag = typeId.startsWith("heading") ? `h${typeId.replace("heading", "")}` : "p";
    //   setSelectedSingleTextType(clickedTag);
    //   selectedTextElement = block.querySelector(clickedTag);

    //   console.log("✅ Now selected text type by click:", clickedTag);

    //   const fontSizeInput = document.getElementById(`scFontSizeInput-${typeId}`);
    //   if (fontSizeInput) fontSizeInput.focus();
    // };
    tab.onclick = () => {
      const clickedTag = typeId.startsWith("heading") ? `h${typeId.replace("heading", "")}` : "p";
      setSelectedSingleTextType(clickedTag); // ✅ must set text type
      const targetElement = block.querySelector(clickedTag);
      if (targetElement) {
        setSelectedTextElement(targetElement); // ✅ use setter function
      }
    
      console.log("✅ Now selected text type by click:", clickedTag);
    
      const fontSizeInput = document.getElementById(`scFontSizeInput-${typeId}`);
      if (fontSizeInput) fontSizeInput.focus();
    };
    
  });

  // --- Auto-select text type
  if (visibleParts.size === 1) {
    const onlyPartId = Array.from(visibleParts)[0];
    const typeId = onlyPartId.replace("Part", "");
    const autoSelectedTag = typeId.startsWith("heading") ? `h${typeId.replace("heading", "")}` : "p";
    setSelectedSingleTextType(autoSelectedTag);
    console.log("🚀 Auto-selected text type:", autoSelectedTag);
  } else if (visibleParts.size > 1) {
    // 🛠 Automatically click first visible tab if multiple types exist
    const firstVisiblePart = Array.from(visibleParts)[0];
    const firstTypeId = firstVisiblePart.replace("Part", "");
    const firstTab = document.getElementById(firstTypeId);

    if (firstTab) {
      firstTab.click();  // 🛠 Simulate click on first tab
    }
  } else {
    // No visible parts
    setSelectedSingleTextType(null);
  }

  // --- Bold text detection (optional)
  const strongElementsByTag = {};
  innerTextElements.forEach(el => {
    const tag = el.tagName.toLowerCase();
    const strongTags = el.querySelectorAll('strong');
    if (strongTags.length > 0) {
      strongElementsByTag[tag] = {
        count: strongTags.length,
        texts: Array.from(strongTags).map(strong => strong.textContent)
      };
    }
  });

  block.dataset.strongElementsByTag = JSON.stringify(strongElementsByTag);
}


  