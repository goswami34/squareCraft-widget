export function html() {
  const fontFamilies = [
    "Arial",
    "Verdana",
    "Times New Roman",
    "Courier New",
    "Georgia",
    "Palatino",
    "Garamond",
    "Comic Sans MS",
    "Trebuchet MS",
    "Arial Black",
    "Impact",
    "Tahoma",
    "Helvetica",
  ];

  const fontOptions = fontFamilies
    .map(
      (font) =>
        `<option value="${font}" style="font-family: '${font}', sans-serif;">${font}</option>`
    )
    .join("");

  const htmlString = `
        <div class="sc-p-4 sc-text-color-white sc-border sc-border-solid sc-border-3d3d3d sc-bg-color-2c2c2c sc-rounded-15px sc-w-300px">
            <img id="sc-grabbing" class="sc-cursor-grabbing sc-universal" src="https://i.ibb.co/pry1mVGD/Group-28-1.png" width="140px" />
            <p class="sc-text-sm sc-mt-6 sc-poppins sc-font-light">Lorem Ipsum is simply dummy text.</p>
            <div class="sc-mt-2 sc-relative">
                <label class="sc-text-sm">Select Font</label>
                <select id="scFontSelect" class="sc-w-full sc-rounded-md sc-text-sm sc-poppins sc-font-light"
                    style="background: black; color: white; border: 1px solid white; padding: 5px;">
                    <option class="sc-cursor-pointer" value="" selected disabled>Select Font</option>
                    ${fontOptions}
                </select>
            </div>
        </div>
    `;

  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");
  const isValidHTML = doc.body.children.length > 0;

  if (!isValidHTML) {
    console.error("❌ Error: Invalid HTML structure!");
    return "❌ Error: Invalid HTML structure!";
  }

  setTimeout(() => {
    const fontSelect = document.getElementById("scFontSelect");
    if (!fontSelect) {
      console.error("❌ Font select element not found!");
      return;
    }


    fontSelect.addEventListener("change", function () {
      const selectedFont = fontSelect.value;
      const selectedBlock = document.querySelector(".sc-selected");

      if (!selectedBlock) {
        console.warn("⚠️ No block selected to apply font change.");
        return;
      }

      const textElements = selectedBlock.querySelectorAll(
        "h1, h2, h3, h4, p, strong, em, a"
      );

      if (textElements.length === 0) {
        console.warn("⚠️ No text elements found inside the selected block.");
        return;
      }

      textElements.forEach((element) => {
        element.style.setProperty("font-family", selectedFont, "important");
      });

      window.parent.postMessage(
        { type: "FONT_CHANGE", font: selectedFont },
        "*"
      );
    });
  }, 500);

  return htmlString;
}
