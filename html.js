import {
  getToggleState,
  setToggleState,
} from "https://goswami34.github.io/squareCraft-widget/toggleState.js";
import { WidgetTypoSection } from "https://goswami34.github.io/squareCraft-widget/src/components/WidgetTypoSection/WidgetTypoSection.js";
import { WidgetImageSection } from "https://goswami34.github.io/squareCraft-widget/src/components/WidgetImageSection/WidgetImageSection.js";

export function html() {
  const htmlString = `
     <div
   class="sc-p-2 z-index-high sc-text-color-white sc-border sc-border-solid sc-border-3d3d3d sc-bg-color-2c2c2c sc-rounded-15px sc-w-300px">
   <div id="sc-grabbing" class="sc-cursor-grabbing sc-w-full">
    <div class="sc-flex sc-roboto sc-universal sc-items-center sc-justify-between">
         <img class="sc-cursor-grabbing sc-universal" src="https://i.ibb.co.com/pry1mVGD/Group-28-1.png"
            width="140px" />
      </div>
      <p class="sc-text-sm sc-mt-6 sc-roboto sc-font-light">Powerful Visual Editor for Customizing Squarespace Text Styles in Real-Time.
      </p>
   </div>
   <div class="sc-mt-6 sc-roboto sc-border-t sc-border-dashed sc-border-color-494949  sc-w-full">
   </div>
   <div class="sc-mt-6 sc-roboto sc-flex  sc-items-center sc-universal">
      <p class="sc-text-sm sc-px-4 sc-cursor-pointer tabHeader ">Design</p>
      <p class="sc-text-sm sc-px-4 sc-cursor-pointer tabHeader">Advanced</p>
      <p class="sc-text-sm sc-px-4 sc-cursor-pointer tabHeader">Presets</p>
   </div>
   <div class="sc-border-t sc-border-solid sc-relative  sc-border-color-494949 sc-w-full">
      <div class="sc-absolute sc-top-0 sc-left-0 sc-bg-colo-EF7C2F sc-w-16 sc-h-1px">
      </div>
   </div>
   <div
      class="sc-rounded-6px sc-h-350 sc-scrollBar sc-mt-6  sc-border sc-border-solid sc-border-EF7C2F sc-bg-color-3d3d3d">
  
      ${WidgetTypoSection("typoSection")}
      ${WidgetImageSection("imageSection")}

  
   </div>
   <div class="sc-mt-4">
      <div class="sc-flex  sc-items-center sc-justify-between sc-gap-2">
         <div id="publish"
            class="sc-cursor-pointer sc-roboto sc-bg-color-EF7C2F sc-w-full sc-font-light sc-flex sc-items-center sc-text-sm sc-py-1 sc-rounded-6px sc-text-color-white sc-justify-center">
            Publish
         </div>
         <div
            class="sc-cursor-pointer sc-roboto sc-bg-3f3f3f sc-w-full sc-text-color-white sc-font-light sc-flex sc-text-sm sc-py-1 sc-rounded-6px sc-items-center sc-justify-center">
            Reset
         </div>
      </div>
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

  document.addEventListener("DOMContentLoaded", async function () {
    function addHeadingEventListeners() {
      const heading1 = document.getElementById("heading1");
      if (heading1) {
        heading1.addEventListener("mouseover", () => {});

        heading1.addEventListener("click", () => {});
      } else {
        console.error("❌ heading1 not found in DOM!");
      }
    }

    setTimeout(addHeadingEventListeners, 1000);
  });

  return htmlString;
}
export function initToggleSwitch() {
  const toggleSwitch = document.getElementById("toggleSwitch");
  const toggleText = document.getElementById("toggleText");
  const toggleBullet = toggleSwitch?.querySelector(".toggle-bullet");

  if (!toggleSwitch || !toggleText || !toggleBullet) {
    return;
  }

  let isEnabled = getToggleState();

  const updateToggleUI = () => {
    if (!toggleSwitch || !toggleBullet || !toggleText) return;

    if (isEnabled) {
      toggleSwitch.style.backgroundColor = "#EF7C2F";
      toggleBullet.style.left = "auto";
      toggleBullet.style.right = "1.5px";
      toggleText.textContent = "Enable";
    } else {
      toggleSwitch.style.backgroundColor = "#747372";
      toggleBullet.style.left = "2px";
      toggleBullet.style.right = "auto";
      toggleText.textContent = "Disable";
    }
  };

  updateToggleUI();

  toggleSwitch.addEventListener("click", () => {
    isEnabled = !isEnabled;
    setToggleState(isEnabled);
    updateToggleUI();
  });
}
