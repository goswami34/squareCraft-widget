import { WidgetImageNormalState } from "https://goswami34.github.io/squareCraft-widget/src/components/WidgetImageSection/WidgetImageNormalState/WidgetImageNormalState.js";
import { WidgetImageHoverState } from "https://goswami34.github.io/squareCraft-widget/src/components/WidgetImageSection/WidgetImageHoverState/WidgetImageHoverState.js";

export function WidgetImageSection(id) {
  return `
          <div id="imageSection">
          <div class="sc-flex sc-p-2 sc-items-center sc-justify-between">
             <div class="sc-flex sc-gap-2 sc-items-center">
                <img loading="lazy" src="https://fatin-webefo.github.io/squareCraft-plugin/public/iamgeicon.png"
                   alt="">
                <p class="sc-universal sc-roboto">Image</p>
             </div>
             <span  class="sc-arrow-placeholder"></span>
          </div>
          <div class="sc-h-1px sc-bg-3f3f3f"></div>
          <div class="sc-flex sc-px-2 sc-mt-1_5  sc-items-center sc-justify-between">
             <div class="sc-flex sc-gap-2 sc-items-center">
                <div class="toggle-container" id="toggleSwitch">
                   <div class="toggle-bullet"></div>
                </div>
                <p id="toggleText" class="sc-text-sm sc-roboto sc-universal">Enable</p>
             </div>
            <div
         class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-1 sc-gradiant-border sc-px-2 sc-py-4px sc-bg sc-bg-454545" id="buttonResetAll-icon" >
         <p class="sc-font-light sc-universal sc-font-size-11">Reset</p>
         <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" alt="reset">
             </div>
          </div>
          <div class="sc-h-1px sc-mt-1_5 sc-bg-3f3f3f"></div>
          <div class="sc-mt-3">
             <div class="sc-flex sc-roboto sc-px-2  sc-items-center sc-justify-between sc-gap-2">
                <div id="image-normal-state-button"
                   class="sc-cursor-pointer sc-bg-color-EF7C2F sc-w-full sc-font-thin sc-flex sc-items-center sc-text-sm sc-py-1 sc-rounded-4px sc-text-color-white sc-justify-center">
                   Normal
                </div>
                <div id="image-hover-state-button"
                   class="sc-cursor-pointer sc-bg-3f3f3f sc-w-full sc-text-color-white sc-font-thin sc-flex sc-text-sm sc-py-1 sc-rounded-4px sc-items-center sc-justify-center">
                   Hover
                </div>
             </div>
             <div class="sc-px-4">
                <div class="sc-h-1px  sc-mt-2 sc-bg-3f3f3f"></div>
             </div>
           </div>
              ${WidgetImageNormalState()}
              ${WidgetImageHoverState()}
          <div class="sc-mt-3"> </div>
       </div>
           `;
}
