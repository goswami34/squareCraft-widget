// export function initImageUploadPreview(getSelectedElement) {
//   const uploadButton = document.getElementById("imageupload");
//   if (!uploadButton) return;

//   const input = Object.assign(document.createElement("input"), {
//     type: "file",
//     accept: "image/*",
//     style: "display: none"
//   });
//   document.body.appendChild(input);

//   function applyIconToButtons(svgNode) {
//     const selected = getSelectedElement?.();
//     if (!selected || !svgNode) return;

//     const btn = selected.querySelector("a");
//     if (!btn) return;

//     const typeClass = [...btn.classList].find(c => c.startsWith("sqs-button-element--"));
//     if (!typeClass) return;

//     svgNode.classList.add("sqscraft-button-icon");

//     document.querySelectorAll(`a.${typeClass}`).forEach(b => {
//       b.querySelector(".sqscraft-button-icon")?.remove();
//       b.insertBefore(svgNode.cloneNode(true), b.querySelector(".sqs-html") || b.firstChild);
//       b.classList.add("sc-flex", "sc-items-center");
//     });
//   }

//   uploadButton.addEventListener("click", e => {
//     e.stopPropagation();
//     input.click();
//   });

//   input.addEventListener("click", e => e.stopPropagation());

//   input.addEventListener("change", event => {
//     const file = event.target.files[0];
//     const selected = getSelectedElement?.();
//     if (!file || !selected) return;

//     const reader = new FileReader();
//     reader.onload = e => {
//       let svg = file.type === "image/svg+xml"
//         ? new DOMParser().parseFromString(e.target.result, "image/svg+xml").querySelector("svg")
//         : (() => {
//             const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//             const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
//             svg.setAttribute("viewBox", "0 0 20 20");
//             img.setAttributeNS("http://www.w3.org/1999/xlink", "href", e.target.result);
//             img.setAttribute("width", "20");
//             img.setAttribute("height", "20");
//             svg.appendChild(img);
//             return svg;
//           })();

//       if (svg) applyIconToButtons(svg);
//       input.value = "";
//     };

//     file.type === "image/svg+xml"
//       ? reader.readAsText(file)
//       : reader.readAsDataURL(file);
//   });

//   const allIcons = [
//     ...document.querySelectorAll("#buttonIconSolidoptions img, #buttonIconOutlineoptions img")
//   ];

//   allIcons.forEach(icon => {
//     icon.addEventListener("click", () => {
//       const imgURL = icon.getAttribute("src");
//       const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//       const image = document.createElementNS("http://www.w3.org/2000/svg", "image");

//       svg.setAttribute("viewBox", "0 0 20 20");
//       image.setAttributeNS("http://www.w3.org/1999/xlink", "href", imgURL);
//       image.setAttribute("width", "20");
//       image.setAttribute("height", "20");

//       svg.appendChild(image);
//       applyIconToButtons(svg);
//     });
//   });
// }

// export function initImageUploadPreview(getSelectedElement) {
//   const uploadButton = document.getElementById("imageupload");
//   if (!uploadButton || uploadButton.dataset.listener === "true") return;
//   uploadButton.dataset.listener = "true"; // :white_check_mark: prevent double binding

//   console.log("🔧 initImageUploadPreview initialized");

//   // Function to save icon to database
//   function saveIconToDatabase(selected, typeClass, iconData, isUploaded = false) {
//     console.log("💾 saveIconToDatabase called with:", { selected, typeClass, iconData, isUploaded });

//     const blockId = selected.id;
//     if (!blockId) {
//       console.warn("⚠️ No blockId found for selected element");
//       return;
//     }

//     const iconPayload = {
//       iconProperties: {
//         selector: `.${typeClass} .sqscraft-button-icon`,
//         styles: {
//           width: "20px",
//           height: "auto",
//         },
//         iconData: iconData,
//       },
//       buttonType: typeClass.replace("sqs-button-element--", ""),
//       applyToAllTypes: false,
//     };

//     // Use window.addPendingModification if available
//     if (typeof window.addPendingModification === "function") {
//       console.log("✅ Calling window.addPendingModification with:", { blockId, iconPayload, tagType: "buttonIcon" });
//       window.addPendingModification(blockId, iconPayload, "buttonIcon");
//       console.log("✅ Icon saved to pending modifications:", iconPayload);
//     } else {
//       console.error("❌ window.addPendingModification not available");
//       console.log("🔍 Available window functions:", Object.keys(window).filter(key => key.includes('addPendingModification')));
//     }
//   }
//   function applyIconToButtons(iconNode) {
//     const selected = getSelectedElement?.();
//     if (!selected || !iconNode) return;
//     const btn = selected.querySelector("a");
//     if (!btn) return;
//     const typeClass = [...btn.classList].find((c) =>
//       c.startsWith("sqs-button-element--")
//     );
//     if (!typeClass) return;
//     document.querySelectorAll(`a.${typeClass}`).forEach((b) => {
//       b.querySelector(".sqscraft-button-icon")?.remove();
//       b.insertBefore(
//         iconNode.cloneNode(true),
//         b.querySelector(".sqs-html") || b.firstChild
//       );
//       b.classList.add("sc-flex", "sc-items-center");
//     });
//   }
//   uploadButton.addEventListener("click", (e) => {
//     e.stopPropagation();
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*";
//     input.style.display = "none";
//     document.body.appendChild(input);
//     input.addEventListener("change", (event) => {
//       const file = event.target.files[0];
//       const selected = getSelectedElement?.();
//       if (!file || !selected) {
//         input.remove();
//         return;
//       }
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const image = document.createElement("img");
//         image.src = e.target.result;
//         image.width = 20;
//         image.height = 20;
//         image.classList.add("sqscraft-button-icon");
//         applyIconToButtons(image);

//         // Save uploaded icon to database
//         console.log("📁 File uploaded, attempting to save to database...");
//         const selected = getSelectedElement?.();
//         console.log("🔍 Selected element:", selected);

//         const btn = selected?.querySelector("a");
//         console.log("🔍 Button element:", btn);

//         const typeClass = btn ? [...btn.classList].find((c) =>
//           c.startsWith("sqs-button-element--")
//         ) : null;
//         console.log("🔍 Button type class:", typeClass);

//         if (selected && typeClass) {
//           const iconData = {
//             type: "uploaded",
//             base64: e.target.result,
//             fileName: file.name,
//             fileSize: file.size,
//             mimeType: file.type,
//           };
//           console.log("💾 Saving uploaded icon to database...");
//           saveIconToDatabase(selected, typeClass, iconData, true);
//         } else {
//           console.error("❌ Cannot save to database - missing selected element or type class");
//         }

//         input.remove();
//       };
//       reader.onerror = () => input.remove();
//       reader.readAsDataURL(file);
//     });
//     input.click();
//   });
//   const allIcons = [
//     ...document.querySelectorAll(
//       "#buttonIconSolidoptions img, #buttonIconOutlineoptions img"
//     ),
//   ];
//   allIcons.forEach((icon) => {
//     icon.addEventListener("click", () => {
//       const imgURL = icon.getAttribute("src");
//       const image = document.createElement("img");
//       image.src = imgURL;
//       image.width = 20;
//       image.height = 20;
//       image.classList.add("sqscraft-button-icon");
//       applyIconToButtons(image);

//       // Save library icon to database
//       console.log("📚 Library icon selected, attempting to save to database...");
//       const selected = getSelectedElement?.();
//       console.log("🔍 Selected element:", selected);

//       const btn = selected?.querySelector("a");
//       console.log("🔍 Button element:", btn);

//       const typeClass = btn ? [...btn.classList].find((c) =>
//         c.startsWith("sqs-button-element--")
//       ) : null;
//       console.log("🔍 Button type class:", typeClass);

//       if (selected && typeClass) {
//         const iconData = {
//           type: "library",
//           src: imgURL,
//           fileName: imgURL.split("/").pop(),
//         };
//         console.log("💾 Saving library icon to database...");
//         saveIconToDatabase(selected, typeClass, iconData, false);
//       } else {
//         console.error("❌ Cannot save to database - missing selected element or type class");
//       }
//     });
//   });
// }

// export function initImageUploadPreview(getSelectedElement) {
//   const uploadButton = document.getElementById("imageupload");
//   if (!uploadButton || uploadButton.dataset.listener === "true") return;
//   uploadButton.dataset.listener = "true";
//   function applyIconToButtons(iconNode) {
//     const selected = getSelectedElement?.();
//     if (!selected || !iconNode) return;
//     const btn = selected.querySelector("a");
//     if (!btn) return;
//     const typeClass = [...btn.classList].find((c) =>
//       c.startsWith("sqs-button-element--")
//     );
//     if (!typeClass) return;
//     document.querySelectorAll(`a.${typeClass}`).forEach((b) => {
//       b.querySelector(".sqscraft-button-icon")?.remove();
//       b.insertBefore(
//         iconNode.cloneNode(true),
//         b.querySelector(".sqs-html") || b.firstChild
//       );
//       b.classList.add("sc-flex", "sc-items-center");
//     });
//   }
//   uploadButton.addEventListener("click", (e) => {
//     e.stopPropagation();
//     const input = document.createElement("input");
//     input.type = "file";
//     input.accept = "image/*";
//     input.style.display = "none";
//     document.body.appendChild(input);
//     input.addEventListener("change", (event) => {
//       const file = event.target.files[0];
//       const selected = getSelectedElement?.();
//       if (!file || !selected) {
//         input.remove();
//         return;
//       }
//       const reader = new FileReader();
//       reader.onload = (e) => {
//         const image = document.createElement("img");
//         image.src = e.target.result;
//         image.width = 20;
//         image.height = 20;
//         image.classList.add("sqscraft-button-icon");
//         applyIconToButtons(image);
//         input.remove();
//       };
//       reader.onerror = () => input.remove();
//       reader.readAsDataURL(file);
//     });
//     input.click();
//   });
//   const allIcons = [
//     ...document.querySelectorAll(
//       "#buttonIconSolidoptions img, #buttonIconOutlineoptions img"
//     ),
//   ];
//   allIcons.forEach((icon) => {
//     icon.addEventListener("click", () => {
//       const imgURL = icon.getAttribute("src");
//       const image = document.createElement("img");
//       image.src = imgURL;
//       image.width = 20;
//       image.height = 20;
//       image.classList.add("sqscraft-button-icon");
//       applyIconToButtons(image);
//     });
//   });
// }

const { saveButtonIconModifications } = await import(
  "https://goswami34.github.io/squareCraft-widget/html.js"
);

export function initImageUploadPreview(getSelectedElement) {
  const uploadButton = document.getElementById("imageupload");
  if (!uploadButton || uploadButton.dataset.listener === "true") return;
  uploadButton.dataset.listener = "true";

  function applyIconToButtons(iconNode, buttonType, typeClass) {
    if (!typeClass) return;
    document.querySelectorAll(`a.${typeClass}`).forEach((b) => {
      b.querySelector(".sqscraft-button-icon")?.remove();
      b.insertBefore(
        iconNode.cloneNode(true),
        b.querySelector(".sqs-html") || b.firstChild
      );
      b.classList.add("sc-flex", "sc-items-center");
    });
  }

  uploadButton.addEventListener("click", (e) => {
    e.stopPropagation();
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.style.display = "none";
    document.body.appendChild(input);

    input.addEventListener("change", async (event) => {
      const file = event.target.files[0];
      const selected = getSelectedElement?.();
      if (!file || !selected) {
        input.remove();
        return;
      }

      const btn = selected.querySelector("a");
      if (!btn) return;

      const typeClass = [...btn.classList].find((c) =>
        c.startsWith("sqs-button-element--")
      );
      if (!typeClass) return;

      const buttonType = typeClass.includes("primary")
        ? "primary"
        : typeClass.includes("secondary")
        ? "secondary"
        : "tertiary";

      const reader = new FileReader();
      reader.onload = async (e) => {
        const image = document.createElement("img");
        image.src = e.target.result;
        image.width = 20;
        image.height = 20;
        image.classList.add("sqscraft-button-icon");

        applyIconToButtons(image, buttonType, typeClass);

        const blockId = selected.getAttribute("id");
        await saveButtonIconModifications(blockId, {
          iconProperties: {
            selector: `.sqs-button-element--${buttonType} .sqscraft-button-icon`,
            styles: {
              src: image.src,
              width: "20px",
              height: "20px",
              transform: "rotate(0deg)",
            },
          },
          buttonType,
          applyToAllTypes: false, // 👈 very important
        });

        input.remove();
      };
      reader.onerror = () => input.remove();
      reader.readAsDataURL(file);
    });

    input.click();
  });

  const allIcons = [
    ...document.querySelectorAll(
      "#buttonIconSolidoptions img, #buttonIconOutlineoptions img"
    ),
  ];

  allIcons.forEach((icon) => {
    icon.addEventListener("click", async () => {
      const selected = getSelectedElement?.();
      if (!selected) return;

      const btn = selected.querySelector("a");
      if (!btn) return;

      const typeClass = [...btn.classList].find((c) =>
        c.startsWith("sqs-button-element--")
      );
      if (!typeClass) return;

      const buttonType = typeClass.includes("primary")
        ? "primary"
        : typeClass.includes("secondary")
        ? "secondary"
        : "tertiary";

      const imgURL = icon.getAttribute("src");
      const image = document.createElement("img");
      image.src = imgURL;
      image.width = 20;
      image.height = 20;
      image.classList.add("sqscraft-button-icon");

      applyIconToButtons(image, buttonType, typeClass);

      const blockId = selected.getAttribute("id");
      await saveButtonIconModifications(blockId, {
        iconProperties: {
          selector: `.sqs-button-element--${buttonType} .sqscraft-button-icon`,
          styles: {
            src: imgURL,
            width: "20px",
            height: "20px",
            transform: "rotate(0deg)",
          },
        },
        buttonType,
        applyToAllTypes: false,
      });
    });
  });
}
