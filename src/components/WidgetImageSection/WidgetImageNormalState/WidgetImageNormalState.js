export function WidgetImageNormalState() {
  return `
    <div id="image-normal-state">
   <div class="sc-flex sc-mt-3 sc-px-2">
      <div id="borderButton"
         class="sc-bg-3f3f3f sc-relative sc-z-99999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-2 sc-w-full sc-rounded-4pxx">
         <h5 class="sc-roboto sc-font-size-14 sc-universal  sc-font-thin">Border</h5>
           <img id="image-shadow-arrow" src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
        class="sc-rotate-180" alt="">
      </div>
   </div>
   <div id="borderSection" class="sc-px-2 sc-mt-2">
      <div class=" sc-flex sc-items-center sc-justify-between">


         <div class="sc-flex sc-gap-2 sc-items-center">
            <p class="sc-roboto sc-font-thin sc-universal  sc-text-sm sc-font-thin sc-text-gray-300"> Border
            </p>
            <div
               class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5  sc-bg sc-bg-454545 sc-gradiant-border">

               <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10"
                  alt="reset">
            </div>
         </div>

         <div
            class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
            <p id="radiousCount" class="sc-font-thin sc-roboto sc-universal sc-text-xs">0px</p>
                 <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                   <span  class="sc-arrow-placeholder"></span>
                   <span class="sc-arrow-placeholder sc-rotate-180"></span>
                 </div>
         </div>
      </div>


      <div id="radiousField" class="sc-rounded-15px sc-relative sc-mt-3 sc-w-full sc-h-2 sc-bg-F6F6F6">
         <div id="radiousFill" class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"></div>
         <div id="radiousBullet"
            class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half">
         </div>
      </div>


      <div class="sc-grid sc-grid-cols-12 sc-mt-2">
         <div></div>


         <div style="padding: 2px 0px; margin-left:30px;"
            class="sc-bg-3f3f3f sc-flex sc-col-span-11 sc-text-sm sc-font-thin  sc-mt-2 sc-border sc-border-solid sc-border-3f3f3f   sc-justify-center  sc-px-1 sc-rounded-4px">



            <div
               class="sc-flex sc-px-1_5 sc-bg-454545 sc-bg-454545 sc-justify-center sc-w-full sc-cursor-pointer sc-py-4px sc-rounded-4px sc-items-center sc-gap-1"  id="allBorder">
               <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/all.svg" loading="lazy"
                  alt="all-radious">
               <p class="sc-font-thin sc-roboto sc-universal">All</p>
            </div>


            <div
               class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-4px sc-rounded-4px  sc-items-center sc-gap-1" id="topBorder">
               <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/top.svg" loading="lazy"
                  alt="top-radious">
               <p class="sc-font-thin sc-roboto sc-universal" >Top</p>
            </div>



            <div
               class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-4px sc-rounded-4px  sc-items-center sc-gap-1" id="bottomBorder">
               <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/bottom.svg" loading="lazy"
                  alt="bottom-radious">
               <p class="sc-font-thin sc-roboto sc-universal " >Bottom</p>
            </div>


            <div
               class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-4px sc-rounded-4px  sc-items-center sc-gap-1" id="leftBorder">
               <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/left.svg" loading="lazy"
                  alt="left-radious">
               <p class="sc-font-thin sc-roboto sc-universal " >Left</p>
            </div>


            <div
               class="sc-flex sc-px-1_5 sc-cursor-pointer sc-py-4px sc-rounded-4px  sc-items-center sc-gap-1" id="rightBorder">
               <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/right.svg" loading="lazy"
                  alt="right-radious">
               <p class="sc-font-thin sc-roboto sc-universal ">Right</p>
            </div>


         </div>
      </div>
   
      <div class="sc-mt-3 sc-gap-2 sc-grid sc-grid-cols-12">
         <div class="sc-col-span-5">
            <p class="sc-roboto sc-font-thin sc-universal  sc-text-sm sc-font-thin sc-text-gray-300"> Border
               Color
            </p>

            <div
               class="sc-py-4px sc-relative sc-mt-2 sc-bg-3f3f3f sc-inActiveTab-border  sc-flex sc-justify-between sc-items-center sc-px-1 sc-rounded-4px">
               <p class="sc-text-sm sc-roboto sc-font-light sc-universal">Select</p>
               <div id="border-color-select" class="sc-square-6 sc-border-colors sc-cursor-pointer"></div>

               <div id="color-palette"
                  class="sc-absolute sc-hidden sc-border sc-border-solid sc-border-EF7C2F sc-top-12 sc-bg-3f3f3f sc-left-0 sc-p-1 sc-rounded-4px ">
                  <div class="sc-color-arrow" ></div>
                  <div class="sc-flex sc-items-center sc-justify-between">
                     <div id="border-colors" class="sc-flex sc-relative sc-items-center sc-gap-1">
                     
                     
                     </div>
                     

                     <div class="sc-rounded-15px sc-px-1_5 sc-py-0_5 sc-bg-454545 sc-flex sc-gap-1">
                        <p class="sc-universal sc-text-xs sc-roboto">RGB</p>
                        <span  class="sc-arrow-placeholder sc-rotate-180"></span>

                     </div>
                  </div>


                  

                  <div class="sc-h-1px sc-mt-2 sc-bg-color-gray"></div>
                  <div class="sc-flex color-h-selection sc-mt-2 sc-items-center sc-gap-2">
                     <div id="color-selection-field" class="sc-relative">
                        <div id="color-selection-bar"
                           class="sc-w-2 sc-h-2 sc-absolute sc-cursor-pointer sc-rounded-full sc-border sc-border-solid sc-border-white">
                        </div>
                     </div>
                     <div id="color-transparency-field" class="sc-h-full sc-w-3 sc-relative  sc-rounded-15px ">
                        <div id="color-transparency-bar" class="sc-absolute  sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px  sc-cursor-grabbing  sc-h-2 sc-bg-color-f2f2f2"></div>
                     </div>
                     <div id="all-color-selction-field" class="sc-h-full sc-w-3 sc-relative sc-rounded-15px">
                        <div id="all-color-selction-bar" class="sc-absolute  sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2"></div>
                     </div>
                  </div>
                  <div
                     class="sc-flex sc-justify-between sc-mt-3 sc-px-2 sc-py-0_5 sc-rounded-4px sc-bg-454545">
                     <p id="color-code" class="sc-text-sm sc-roboto sc-font-light sc-universal">Select</p>
                     <p id="color-transparency-count" class="sc-text-sm sc-roboto sc-font-light sc-universal">100%</p>
                  </div>
               </div>

            </div>
         </div>



         <div class="sc-col-span-7">
            <p class="sc-roboto sc-font-thin sc-universal  sc-text-sm sc-font-thin sc-text-gray-300"> Border
               Style
            </p>
            <div style="padding: 3px 0px;"
               class="sc-bg-3f3f3f sc-flex sc-text-xs sc-gap-2 sc-mt-2 sc-rounded-4px   sc-border sc-border-solid sc-border-3f3f3f   sc-justify-between  sc-px-1 ">


               <div class="sc-py-4px sc-flex sc-items-center sc-justify-center sc-rounded-4px  sc-bg-454545 sc-w-full" id="borderStyleSolid">
                  <p class="sc-font-thin sc-roboto  sc-text-center sc-universal  sc-cursor-pointer   ">Solid
                  </p>
               </div>


               <div class="sc-py-4px sc-flex sc-items-center sc-justify-center  sc-w-full sc-rounded-4px " id="borderStyleDashed">
                  <p class="sc-font-thin sc-roboto  sc-text-center sc-universal  sc-cursor-pointer  ">Dashed
                  </p>
               </div>
               <div class="sc-py-4px sc-flex sc-items-center sc-justify-center  sc-w-full sc-rounded-4px" id="borderStyleDotted">

                  <p
                     class="sc-font-thin sc-roboto  sc-text-center sc-universal  sc-cursor-pointer  sc-rounded-4px">
                     Dotted</p>
               </div>

            </div>
         </div>
      </div>

     <div class="sc-mt-4">
         <div class="sc-flex sc-items-center sc-justify-between">
            <div class="sc-flex sc-gap-2 sc-items-center">
               <p class="sc-roboto sc-font-thin sc-universal sc-text-sm sc-text-gray-300">
               Border Radius
               </p>
               <div
                  class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg sc-bg-454545" id="border-radius-reset">
                  <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10" alt="reset" />
               </div>
            </div>
            <div
               class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
               <p class="sc-font-thin sc-roboto sc-universal sc-text-xs" id="radiusCountAnother">0px</p>
               <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
               <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg" alt="" width="9" />
               <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg" width="9" class="sc-rotate-180" alt="" />
               </div>
            </div>
         </div>

         <div id="radiusField" class="sc-rounded-15px sc-mt-3 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6">
            <div id="radiusFill" class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"></div>
            <div id="radiusBullet"
               class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half">
            </div>
         </div>

         <div style="padding: 2px 0px; margin-top: 15px; margin-left: 30px;"
            class="sc-bg-3f3f3f sc-flex sc-col-span-11 sc-text-sm sc-font-thin   sc-border sc-border-solid sc-border-3f3f3f   sc-justify-center  sc-px-1 sc-rounded-6px">

            <div
               class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-0_5 sc-rounded-6px sc-items-center sc-gap-1 sc-bg-454545"  id="allradiusBorder">
               <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/all.svg" loading="lazy"
                  alt="all-radious">
               <p class="sc-font-thin sc-roboto sc-universal">All</p>
            </div>

            <div
               class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-0_5 sc-rounded-6px  sc-items-center sc-gap-1" id="topLeftradiusBorder">
               <img src="https://goswami34.github.io/squareCraft-widget/public/Vector.svg" loading="lazy"
                  alt="top-left-radius">
            </div>

            <div
               class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-0_5 sc-rounded-6px  sc-items-center sc-gap-1" id="topRightradiusBorder">
               <img src="https://goswami34.github.io/squareCraft-widget/public/TopRight.svg" loading="lazy"
                  alt="top-right-radius">
            </div>

            <div
               class="sc-flex sc-px-1_5 sc-cursor-pointer sc-py-0_5 sc-rounded-6px  sc-items-center sc-gap-1" id="bottomRightradiusBorder">
               <img src="https://goswami34.github.io/squareCraft-widget/public/Bottom Right.svg" loading="lazy"
                  alt="bottom-right-radius">
            </div>

            <div
               class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-0_5 sc-rounded-6px  sc-items-center sc-gap-1" id="bottomLeftradiusBorder">
               <img src="https://goswami34.github.io/squareCraft-widget/public/left-bottom.svg" loading="lazy"
                  alt="left-bottom-radius">
            </div>

            </div>
         </div>

      </div>

      <div class="sc-mt-3 sc-px-2">
         <div id="overLayButton"
            class="sc-bg-3f3f3f  sc-relative sc-z-99999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-2  sc-rounded-4px">
            <h5 class="sc-roboto sc-font-size-14 sc-universal  sc-font-thin">Overlay</h5>
            <img id="image-shadow-arrow" src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
         class="sc-rotate-180" alt="">
         </div>
      </div>


      <div id="overLaySection" class="sc-px-2 sc-hidden sc-mt-3">
         <div class="sc-flex sc-gap-2 sc-items-center ">
            <p class="sc-roboto sc-font-thin sc-universal  sc-text-sm sc-font-thin sc-text-gray-300"> Overlay
            </p>
            <div
               class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-full sc-rounded-10px sc-gap-1 sc-p-1_5  sc-bg sc-bg-454545 sc-gradiant-border">

               <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10"
                  alt="reset">
            </div>
         </div>
         <div class="sc-mt-4">
            <p class="sc-roboto sc-font-thin sc-universal  sc-text-sm sc-font-thin sc-text-gray-300"> Visible
            </p>
         </div>
         <div class="sc-flex sc-mt-2 sc-items-center">
            <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-rounded-l">
               <select id="overlayVisibleDropdown" class="sc-universal sc-roboto sc-text-sm sc-bg-3f3f3f sc-text-white sc-border-none focus:outline-none">
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
               </select>
            </div>
            <div class="sc-bg-454545 sc-flex sc-items-center sc-justify-center sc-px-2_5 sc-py-13px">
               <span id="overlayVisibleDropdownArrow" class="sc-arrow-placeholder sc-rotate-180"></span>
            </div>
         </div>
         <div class="sc-mt-4 sc-gap-2 sc-flex">

         
         <div id="backgorundColor" class=" ">
            <p class="sc-font-size-11 sc-font-thin sc-mt-4 sc-universal sc-text-gray-300 sc-roboto"> Color
            </p>
            <div class="sc-col-span-5 sc-mt-2 sc-z-99999 sc-relative ">
               <div class="sc-flex sc-w-30 sc-justify-between sc-items-center sc-px-1 sc-bg-3f3f3f sc-inActiveTab-border sc-rounded-4px sc-py-4px">
               <p  class="sc-font-size-12 sc-roboto sc-universal">Select</p>
               <div id="overLayFontColorPalate" class="sc-square-6 sc-border-colors sc-cursor-pointer"></div>
               </div>
               <div id="overlay-color-palette"
               class="sc-absolute sc-z-99999 sc-border sc-hidden sc-border-solid sc-border-EF7C2F sc-top-12 sc-bg-3f3f3f sc-left-0 sc-p-1_5 sc-rounded-4px">
               <div class="sc-image-fontcolor-arrow"></div>
               <div class="sc-flex sc-items-center sc-justify-between">
                  <div id="overlay-border-colors" class="sc-flex sc-relative sc-items-center sc-gap-1"></div>
                  <div class="sc-rounded-15px sc-px-1_5 sc-py-0_5 sc-bg-454545 sc-flex sc-gap-1">
                     <p class="sc-universal sc-font-size-11 sc-roboto">RGB</p>
                     <span  class="sc-arrow-placeholder sc-rotate-180"></span>
                  </div>
               </div>

               <div class="sc-h-1px sc-mt-2 sc-bg-color-gray"></div>

               <div class="sc-flex color-h-selection sc-mt-2 sc-items-center sc-gap-2">
                  <div id="overlay-color-selection-field" class="sc-relative">
                     <div id="overlay-color-selection-bar"
                     class="sc-w-2 sc-h-2 sc-absolute sc-cursor-pointer sc-rounded-full sc-border sc-border-solid sc-border-white">
                     </div>
                  </div>
                  <div id="overlay-image-color-transparency-field" class="sc-h-full sc-w-3 sc-relative sc-rounded-15px">
                     <div id="overlay-image-color-transparency-bar"
                     class="sc-absolute sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2">
                     </div>
                  </div>
                  <div id="overlay-image-all-color-selection-field" class="sc-h-full sc-w-3 sc-relative sc-rounded-15px">
                     <div id="overlay-image-all-color-selection-bar"
                     class="sc-absolute sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2">
                     </div>
                  </div>
               </div>
               <div class="sc-flex sc-justify-between sc-mt-2 sc-px-2 sc-py-0_5 sc-rounded-4px sc-bg-454545">
                  <p id="overlay-image-color-code" class="sc-font-size-12 sc-roboto sc-font-light sc-universal">Select</p>
                  <p id="overlay-image-color-transparency-count" class="sc-font-size-12 sc-roboto sc-font-light sc-universal">100%</p>
               </div>
               </div>
            </div>
         </div>




         <div class="">
            <p class="sc-roboto sc-font-thin sc-universal  sc-text-sm sc-font-thin sc-text-gray-300">
               Width
            </p>
            <div class="sc-flex sc-mt-2 sc-items-center">
               <div class="sc-bg-3f3f3f sc-py-1 sc-rounded-l sc-px-2">
                  <p id="overlayWidthValue" class="sc-universal sc-roboto sc-text-sm ">100%</p>
               </div>
               <div id="overlayWidthControl" style="padding-top: 8.5px; padding-bottom: 8.5px;" class="sc-bg-454545 sc-px-2_5 ">
                  <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                     <span  class="sc-arrow-placeholder overlay-arrow-up"></span>
                     <span  class="sc-arrow-placeholder overlay-arrow-down sc-rotate-180"></span>
                  </div>
               </div>
            </div>

         </div>
         <div class="">
            <p class="sc-roboto sc-font-thin sc-universal  sc-text-sm sc-font-thin sc-text-gray-300">
               Height
            </p>
            <div class="sc-flex sc-mt-2 sc-items-center">
               <div class="sc-bg-3f3f3f sc-py-1 sc-rounded-l sc-px-2">
                  <p id="overlayHeightValue" class="sc-universal sc-roboto sc-text-sm ">100%</p>
               </div>
               <div id="overlayHeightControl" style="padding-top: 8.5px; padding-bottom: 8.5px;" class="sc-bg-454545 sc-px-2_5 ">
                  <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                     <span  class="sc-arrow-placeholder overlay-arrow-up"></span>
                     <span  class="sc-arrow-placeholder overlay-arrow-down sc-rotate-180"></span>
                  </div>
               </div>
            </div>
            <div>

            </div>
         </div>


      </div>
      <div class="sc-mt-4 overlay-position-section">
         <div>
            <p class="sc-roboto sc-font-thin sc-universal  sc-text-sm sc-font-thin sc-text-gray-300"> Position
            </p>
         </div>
      </div>

      <div class=" sc-flex sc-mt-3 sc-items-center sc-gap-3 overlay-position-section-one">
         <div class="sc-w-full">
            <div class="sc-flex sc-gap-2 sc-items-center sc-justify-between">
               <p class="sc-roboto sc-font-thin sc-universal  sc-text-sm sc-font-thin sc-text-gray-300">
                  (X Axis)
               </p>
               <div
                  class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
                  <p class="sc-font-thin sc-roboto sc-universal sc-text-xs" id="xAxisValue">0px</p>
                  <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                     <span  class="sc-arrow-placeholder"></span>
                     <span class="sc-arrow-placeholder sc-rotate-180"></span>
                  </div>
               </div>
            </div>
            <div id="xAxisSlider" class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6">
                 <div id="xAxisBullet" class="sc-custom-overlay-bullet sc-absolute sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half sc-bg-color-EF7C2F"></div>
            </div>

         </div>
         <div class="sc-w-full">
            <div class="sc-flex sc-gap-2 sc-items-center sc-justify-between">
               <p class="sc-roboto sc-font-thin sc-universal  sc-text-sm sc-font-thin sc-text-gray-300">
                  (Y Axis)
               </p>
               <div
                  class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
                  <p class="sc-font-thin sc-roboto sc-universal sc-text-xs" id="yAxisValue">0px</p>
                  <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                     <span  class="sc-arrow-placeholder"></span>
                     <span class="sc-arrow-placeholder sc-rotate-180"></span>
                  </div>

               </div>
            </div>
    
            <div id="yAxisSlider" class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6">
               <div id="yAxisBullet" class="sc-custom-overlay-bullet sc-absolute sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half sc-bg-color-EF7C2F"></div>
            </div>
         </div>
      </div>
   </div>



   <div class="sc-px-2 sc-mt-3">
      <div id="shadowButton"
         class="sc-bg-3f3f3f sc-relative sc-z-99999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-2  sc-rounded-4px">
         <h5 class="sc-roboto sc-font-size-14 sc-universal  sc-font-thin">Shadow</h5>
         <img id="image-shadow-arrow" src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
        class="sc-rotate-180" alt="">
      </div>


      <div id="shadowSection" class="sc-hidden">
         <div class="sc-flex sc-gap-2 sc-items-center sc-mt-3">
            <p class="sc-roboto sc-font-thin sc-universal  sc-text-sm sc-font-thin sc-text-gray-300"> Shadow
            </p>
            <div
               class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5  sc-bg sc-bg-454545 sc-gradiant-border">

               <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10"
                  alt="reset">
            </div>
         </div>


         <div class="sc-flex sc-mt-3 sc-items-center sc-gap-3">

            <div class="sc-w-full">
               <div class="sc-flex sc-gap-2 sc-items-center sc-justify-between" >
                  <p class="sc-roboto sc-font-thin sc-universal  sc-text-sm sc-font-thin sc-text-gray-300">
                     (X Axis)
                  </p>
                  <div 
                     class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
                     <p class="sc-font-thin sc-roboto sc-universal sc-text-xs">50px</p>
                     <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span  class="sc-arrow-placeholder"></span>
                        <span class="sc-arrow-placeholder sc-rotate-180"></span>
                     </div>
                  </div>
               </div>

               <div id="shadowXSlider" class="sc-rounded-15px sc-mt-3 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6">
                  <div
                     class="shadow-bullet sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half">
                  </div>
               </div>
            </div>

            <div class="sc-w-full">
               <div class="sc-flex sc-gap-2 sc-items-center sc-justify-between">
                  <p class="sc-roboto sc-font-thin sc-universal  sc-text-sm sc-font-thin sc-text-gray-300">
                     (Y Axis)
                  </p>
                  <div 
                     class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
                     <p class="sc-font-thin sc-roboto sc-universal sc-text-xs">50px</p>
                     <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span  class="sc-arrow-placeholder"></span>
                        <span class="sc-arrow-placeholder sc-rotate-180"></span>
                     </div>
                  </div>

               </div>
               <div id="shadowYSlider" class="sc-rounded-15px sc-mt-3 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6">
                  <div
                     class="shadow-bullet sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half">
                  </div>
               </div>
            </div>
         </div>

      



      <div id="bgColorSection" class="sc-mt-3 ">
         <p class="sc-font-size-11 sc-font-thin sc-mt-4 sc-universal sc-text-gray-300 sc-roboto"> Color </p>
         <div class="sc-col-span-5 sc-mt-2 sc-z-99999 sc-relative ">
            <div class="sc-flex sc-w-30 sc-justify-between sc-items-center sc-px-1 sc-bg-3f3f3f sc-inActiveTab-border sc-rounded-4px sc-py-4px">
               <p class="sc-font-size-12 sc-roboto sc-universal">Select</p>
               <div id="ShadowFontColorPalate" class="sc-square-6 sc-border-colors sc-cursor-pointer"></div>
            </div>
            <div id="shadow-color-palette"
               class="sc-absolute sc-z-99999 sc-border sc-hidden sc-border-solid sc-border-EF7C2F sc-top-12 sc-bg-3f3f3f sc-left-0 sc-p-1_5 sc-rounded-4px">
               <div class="sc-image-fontcolor-arrow"></div>
               <div class="sc-flex sc-items-center sc-justify-between">
               <div id="shadow-border-colors" class="sc-flex sc-relative sc-items-center sc-gap-1"></div>
               <div class="sc-rounded-15px sc-px-1_5 sc-py-0_5 sc-bg-454545 sc-flex sc-gap-1">
                  <p class="sc-universal sc-font-size-11 sc-roboto">RGB</p>
                  <span class="sc-arrow-placeholder sc-rotate-180"></span>
               </div>
               </div>
               <div class="sc-h-1px sc-mt-2 sc-bg-color-gray"></div>
               <div class="sc-flex color-h-selection sc-mt-2 sc-items-center sc-gap-2">
               <div id="shadow-color-selection-field" class="sc-relative">
                  <div id="shadow-color-selection-bar"
                     class="sc-w-2 sc-h-2 sc-absolute sc-cursor-pointer sc-rounded-full sc-border sc-border-solid sc-border-white">
                  </div>
               </div>
               <div id="shadow-image-color-transparency-field" class="sc-h-full sc-w-3 sc-relative sc-rounded-15px">
                  <div id="shadow-image-color-transparency-bar"
                     class="sc-absolute sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2">
                  </div>
               </div>
               <div id="shadow-image-all-color-selection-field" class="sc-h-full sc-w-3 sc-relative sc-rounded-15px">
                  <div id="shadow-image-all-color-selection-bar"
                     class="sc-absolute sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2">
                  </div>
               </div>
               </div>
               <div class="sc-flex sc-justify-between sc-mt-2 sc-px-2 sc-py-0_5 sc-rounded-4px sc-bg-454545">
               <p id="shadow-image-color-code" class="sc-font-size-12 sc-roboto sc-font-light sc-universal">Select</p>
               <p id="shadow-image-color-transparency-count" class="sc-font-size-12 sc-roboto sc-font-light sc-universal">100%</p>
               </div>
            </div>
         </div>
      </div>




      <div class="sc-mt-4">
         <div class="sc-flex sc-items-center sc-justify-between">
            <div class="sc-flex sc-gap-2 sc-items-center">
               <p class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-text-gray-300">Blur</p>
               <div class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg sc-bg-454545">
               <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10" alt="reset">
               </div>
            </div>
            <div class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
               <p id="shadowBlurValue" class="sc-font-thin sc-roboto sc-universal sc-font-size-11">0px</p>
               <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                  <span  class="sc-arrow-placeholder"></span>
                  <span class="sc-arrow-placeholder sc-rotate-180"></span>
               </div>
            </div>
         </div>
         <div id="shadowBlurSlider" class="sc-rounded-15px sc-mt-3 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6">
         <div id="shadowBlurFill" class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"></div>

            <div class="shadow-bullet sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"></div>
         </div>

      </div>





         <div class="sc-mt-4">
            <div class="  sc-flex sc-items-center sc-justify-between">
               <div class="sc-flex sc-gap-2 sc-items-center">
                  <p class="sc-roboto sc-font-thin sc-universal  sc-text-sm sc-font-thin sc-text-gray-300">
                     Spread
                  </p>
                  <div 
                     class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5  sc-bg sc-bg-454545 sc-gradiant-border">

                     <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10"
                        alt="reset">
                  </div>
               </div>
               <div
                  class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
                  <p class="sc-font-thin sc-roboto sc-universal sc-text-xs">0px</p>
                  <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                     <span  class="sc-arrow-placeholder"></span>
                     <span class="sc-arrow-placeholder sc-rotate-180"></span>
                  </div>
               </div>
            </div>
            <div class="sc-rounded-15px sc-mt-3 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6" id="shadowSpreadSlider">
               <div
                  class="shadow-bullet sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half">
               </div>
            </div>

         </div>
      </div>
   </div>


   <div class="sc-mt-6 sc-px-2">
      <div class="sc-flex sc-justify-between sc-gap-2 sc-items-center">
         <p style="font-size: 16px;" class="sc-roboto sc-font-size-14 sc-universal  sc-font-thin">image
            Masking</p>
         <div
            class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5  sc-bg sc-bg-454545 sc-gradiant-border">

            <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10"
               alt="reset">
         </div>
      </div>
      <div class="sc-mt-3 sc-grid sc-grid-cols-12 sc-gap-2">
         ${[...Array(16)]
           .map((_, i) => {
             const num = i + 1;
             return `
         <div
            class="sc-col-span-3 sc-bg-3f3f3f sc-rounded-4px sc-cursor-pointer sc-border-EF7C2F-hover sc-p-4 sc-flex sc-items-center sc-justify-center">
            <img data-mask="https://fatin-webefo.github.io/squareCraft-plugin/public/imageMask%20(${num}).svg"
               class="sc-image-mask-thumb sc-w-full sc-h-full sc-object-contain"
               src="https://fatin-webefo.github.io/squareCraft-plugin/public/imageMask%20(${num}).svg"
               alt="Mask ${num}">
         </div>
         `;
           })
           .join("")}
      </div>
   </div>
</div>
    `;
}
