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
//     const firstInnerTextElement = block.querySelector("h1,h2,h3,h4,p");
// if (firstInnerTextElement) {
//   const firstTag = firstInnerTextElement.tagName.toLowerCase();
//   setSelectedSingleTextType(firstTag);
//   console.log("✅ Default selected text type after block click:", firstTag);
// } else {
//   setSelectedSingleTextType(null);
// }

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

export function handleFontSize(event = null, context = null) {
  const {
    lastClickedElement,
    selectedSingleTextType,
    saveModifications,
    addPendingModification,
    showNotification,
  } = context;

  if (typeof saveModifications !== 'function') {
    console.error("saveModifications function is not available");
    showNotification("Error: Save functionality not available", "error");
    return;
  }

  if (!event) {
    const activeButton = document.querySelector('[id^="scFontSizeInput"].sc-activeTab-border');
    if (!activeButton) return;
    event = { target: activeButton };
  }

  const clickedElement = event.target.closest('[id^="scFontSizeInput"]');
  if (!clickedElement) return;

  const fontSize = event.target.value + "px";

  if (!lastClickedElement) {
    showNotification("Please select a block first", "error");
    return;
  }

  if (!selectedSingleTextType) {
    showNotification("Please select a text type (Heading or Paragraph)", "error");
    return;
  }

  const block = lastClickedElement.closest('[id^="block-"]');
  if (!block) {
    showNotification("Block not found", "error");
    return;
  }

  const targetElements = block.querySelectorAll(selectedSingleTextType);
  if (!targetElements.length) {
    showNotification(`No ${selectedSingleTextType} found in block`, "error");
    return;
  }

  let strongFound = false;
  let styleContent = "";

  targetElements.forEach((targetElement, index) => {
    const strongElements = targetElement.querySelectorAll("strong");
    if (strongElements.length > 0) {
      strongFound = true;
      
      strongElements.forEach(strong => {
        strong.style.fontSize = fontSize;
      });

      // 🛠 Instead of per-element style, collect them into 1 style rule
      const selector = `#${block.id} ${selectedSingleTextType}:nth-of-type(${index + 1}) strong`;
      styleContent += `
        ${selector} {
          font-size: ${fontSize} !important;
        }
      `;
    }
  });

  if (!strongFound) {
    showNotification(`No bold text (<strong>) found inside ${selectedSingleTextType}`, "info");
    return;
  }

  // 🛠 Apply one single <style> for all affected elements
  const styleId = `style-${block.id}-${selectedSingleTextType}-strong-font-size`;
  let styleTag = document.getElementById(styleId);

  if (!styleTag) {
    styleTag = document.createElement("style");
    styleTag.id = styleId;
    document.head.appendChild(styleTag);
  }

  styleTag.innerHTML = styleContent;

  addPendingModification(block.id, {
    "font-size": fontSize,
    "target": selectedSingleTextType
  }, 'strong');

  // UI update
  document.querySelectorAll('[id^="scFontSizeInput"]').forEach(el => {
    el.classList.remove('sc-activeTab-border');
    el.classList.add('sc-inActiveTab-border');
  });
  clickedElement.classList.remove('sc-inActiveTab-border');
  clickedElement.classList.add('sc-activeTab-border');

  showNotification(`Font size applied to bold text inside: ${selectedSingleTextType}`, "success");
}







  