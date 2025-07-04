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

export function initImageUploadPreview(getSelectedElement) {
  const uploadButton = document.getElementById("imageupload");
  if (!uploadButton || uploadButton.dataset.listener === "true") return;
  uploadButton.dataset.listener = "true"; // :white_check_mark: prevent double binding
  function applyIconToButtons(iconNode) {
    const selected = getSelectedElement?.();
    if (!selected || !iconNode) return;
    const btn = selected.querySelector("a");
    if (!btn) return;
    const typeClass = [...btn.classList].find((c) =>
      c.startsWith("sqs-button-element--")
    );
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
    input.addEventListener("change", (event) => {
      const file = event.target.files[0];
      const selected = getSelectedElement?.();
      if (!file || !selected) {
        input.remove();
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const image = document.createElement("img");
        image.src = e.target.result;
        image.width = 20;
        image.height = 20;
        image.classList.add("sqscraft-button-icon");
        applyIconToButtons(image);
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
    icon.addEventListener("click", () => {
      const imgURL = icon.getAttribute("src");
      const image = document.createElement("img");
      image.src = imgURL;
      image.width = 20;
      image.height = 20;
      image.classList.add("sqscraft-button-icon");
      applyIconToButtons(image);
    });
  });
}
