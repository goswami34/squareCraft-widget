export function initImageUploadPreview(getSelectedElement) {
  const uploadButton = document.getElementById("imageupload");
  if (!uploadButton) return;

  const input = Object.assign(document.createElement("input"), {
    type: "file",
    accept: "image/*",
    style: "display: none"
  });
  document.body.appendChild(input);

  function applyIconToButtons(svgNode) {
    const selected = getSelectedElement?.();
    if (!selected || !svgNode) return;

    const btn = selected.querySelector("a");
    if (!btn) return;

    const typeClass = [...btn.classList].find(c => c.startsWith("sqs-button-element--"));
    if (!typeClass) return;

    svgNode.classList.add("sqscraft-button-icon");

    document.querySelectorAll(`a.${typeClass}`).forEach(b => {
      b.querySelector(".sqscraft-button-icon")?.remove();
      b.insertBefore(svgNode.cloneNode(true), b.querySelector(".sqs-html") || b.firstChild);
      b.classList.add("sc-flex", "sc-items-center");
    });
  }

  uploadButton.addEventListener("click", e => {
    e.stopPropagation();
    input.click();
  });

  input.addEventListener("click", e => e.stopPropagation());

  input.addEventListener("change", event => {
    const file = event.target.files[0];
    const selected = getSelectedElement?.();
    if (!file || !selected) return;

    const reader = new FileReader();
    reader.onload = e => {
      let svg = file.type === "image/svg+xml"
        ? new DOMParser().parseFromString(e.target.result, "image/svg+xml").querySelector("svg")
        : (() => {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
            svg.setAttribute("viewBox", "0 0 20 20");
            img.setAttributeNS("http://www.w3.org/1999/xlink", "href", e.target.result);
            img.setAttribute("width", "20");
            img.setAttribute("height", "20");
            svg.appendChild(img);
            return svg;
          })();

      if (svg) applyIconToButtons(svg);
      input.value = "";
    };

    file.type === "image/svg+xml"
      ? reader.readAsText(file)
      : reader.readAsDataURL(file);
  });

  const allIcons = [
    ...document.querySelectorAll("#buttonIconSolidoptions img, #buttonIconOutlineoptions img")
  ];

  allIcons.forEach(icon => {
    icon.addEventListener("click", () => {
      const imgURL = icon.getAttribute("src");
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const image = document.createElementNS("http://www.w3.org/2000/svg", "image");

      svg.setAttribute("viewBox", "0 0 20 20");
      image.setAttributeNS("http://www.w3.org/1999/xlink", "href", imgURL);
      image.setAttribute("width", "20");
      image.setAttribute("height", "20");

      svg.appendChild(image);
      applyIconToButtons(svg);
    });
  });
}
