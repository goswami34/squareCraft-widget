import { WidgetButtonNormalState } from "https://goswami34.github.io/squareCraft-widget/src/button/WidgetButtonNormalState/WidgetButtonNormalState.js";
import { WidgetButtonHoverState } from "https://goswami34.github.io/squareCraft-widget/src/button/WidgetButtonHoverState/WidgetButtonHoverState.js";

export function WidgetButtonSection() {
  return `
    <div id="buttonSection">
         <div class="sc-flex sc-p-2 sc-items-center sc-justify-between">
            <div class="sc-flex sc-gap-2 sc-items-center">
               <img loading="lazy" src="https://fatin-webefo.github.io/squareCraft-plugin/public/buttonicon.png"
                  alt="">
               <p id="buttonTypeDisplay" class="sc-universal sc-font-size-16 sc-roboto">Button</p>
            </div>
            <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg" alt="">
         </div>
         <div class="sc-h-1px sc-bg-3f3f3f"></div>
         <div class="sc-flex sc-px-2 sc-items-center sc-justify-between sc-h-12">
            <div class="sc-flex sc-gap-2 sc-items-center">
               <div class="toggle-container" id="toggleSwitch">
                  <div class="toggle-bullet"></div> 
               </div>
               <p id="toggleText" class="sc-font-size-12 sc-roboto">Enable</p>
            </div>
            <div id="buttonResetAll" data-sc-reset-button
               class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-1 sc-gradiant-border sc-px-2 sc-py-4px sc-bg sc-bg-454545">
               <p class="sc-font-light sc-universal sc-font-size-11">Reset</p>
               <img id="buttonResetAll-icon" src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" alt="reset">
            </div>
         </div>
         <div class="sc-h-1px sc-bg-3f3f3f"></div>
         <div class="sc-mt-2">
            <div class="sc-flex sc-roboto sc-px-2 sc-items-center sc-justify-between sc-gap-2">
               <div id="buttonNormalStateClick"
                  class="sc-cursor-pointer sc-bg-color-EF7C2F sc-w-full sc-font-light sc-flex sc-items-center sc-font-size-12 sc-py-1 sc-rounded-4px sc-text-color-white sc-justify-center">
                  Normal
               </div>
               <div id="buttonHoverStateClick"
                  class="sc-cursor-pointer sc-bg-3f3f3f sc-w-full sc-text-color-white sc-font-light sc-flex sc-font-size-12 sc-py-1 sc-rounded-4px sc-items-center sc-justify-center">
                  Hover
               </div>
            </div>
            <div class="sc-px-4">
               <div class="sc-h-1px sc-mt-2 sc-bg-3f3f3f"></div>
            </div>
         </div>
         <div class="sc-mt-2 sc-px-2 sc-flex sc-justify-between">
            <p class="sc-font-size-12 sc-universal sc-roboto sc-text-gray-300">Button</p>
            <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/eye.svg" width="12px" />
         </div>
         ${WidgetButtonNormalState()}
         ${WidgetButtonHoverState()}

         <div class="sc-mt-3">
         </div>
      </div>
   `;
}
