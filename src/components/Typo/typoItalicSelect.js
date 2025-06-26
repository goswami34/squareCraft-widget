export function typoItalicSelect(fontSizes) {
  return `
       <div
   class="sc-mt-2 sc-relative sc-grid  sc-grid-cols-12 sc-gap-2 ">

   <div id="scFontSelect"
      class="sc-flex sc-bg-494949 sc-h-9 sc-col-span-8 sc-rounded-6px sc-justify-between sc-border sc-border-solid sc-border-585858 sc-items-center">
      <select class=" sc-text-sm sc-poppins sc-font-light"
         style="background: transparent; color: white; border: none; outline: none; appearance: none; cursor: pointer; padding: 0 8px;">
         <option value="" selected disabled hidden>Select Font</option>
      </select>
      <div class="sc-bg-3f3f3f sc-px-2"
         style="height: 27px; padding: 0 3px; pointer-events: none;">
         <img class="sc-rotate-180 sc-mt-3" width="12px"
            src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg" alt="">
      </div>
   </div>



   <div
      class="sc-flex sc-bg-transparent sc-h-9 sc-text-color-white sc-justify-between sc-col-span-4   sc-rounded-6px sc-border sc-border-solid sc-border-585858 sc-items-center ">
      <div class="sc-flex sc-text-color-white sc-items-center ">
         <div
            class="sc-flex sc-text-color-white sc-justify-between sc-col-span-4 sc-rounded-6px sc-items-center  ">
            <div class="sc-font-size-container sc-poppins sc-universal sc-flex sc-justify-between sc-items-center sc-flex sc-items-center  
                  sc-rounded-6px 
                  ">

               <input type="number" id="scFontSizeItalicInput" value="16" class="sc-font-size-input sc-font-light sc-z-99999 sc-text-sm sc-text-color-white 
                     sc-bg-transparent  sc-universal sc-font-light">
               <div class="sc-v-line"></div>


               <div
                  class="sc-flex sc-items-center  sc-justify-center  sc-items-center">
                  <p
                     class=" sc-font-light sc-text-sm sc-px-1  ">
                     px
               </div>
            </div>

            <div id="scFontSizeOptions" class="sc-hidden  sc-h-44 sc-font-sm sc-bg-3f3f3f sc-w-20
                  sc-rounded-6px sc-border sc-border-585858 sc-absolute 
                  sc-mt-1">
               ${fontSizes
                 ?.map(
                   (size) => `
               <div
                  class="sc-dropdown-item sc-py-1px sc-text-center  sc-text-sm"
                  data-value="${size}">${size}</div>
               `
                 )
                 .join("")}
            </div>
         </div>
      </div>
      <div class="sc-border-r sc-border-585858 "></div>
   </div>
</div>
 
   <div
      class="sc-mt-2  sc-grid   sc-grid-cols-12 sc-gap-2 ">
      <div
         class="sc-flex sc-bg-494949  sc-col-span-7  sc-justify-between sc-border sc-border-solid sc-border-585858 sc-rounded-6px sc-items-center ">
         <div >
               <div class="sc-px-2">
                  <select 
                        id="squareCraftItalicFontWeight"
                        class="sc-font-weight-select"
                        data-font-weight-select
                        style="
                           background: transparent;
                           border: none;
                           color: white;
                           padding: 5px;
                           width: 100%;
                           cursor: pointer;
                           outline: none;
                           -webkit-appearance: none;
                           -moz-appearance: none;
                           appearance: none;
                           position: relative;
                           z-index: 1;
                        "
                  >
                        <option id="scItalicFontWeight100" value="100">Thin (100)</option>
                        <option id="scItalicFontWeight200" value="200">Extra Light (200)</option>
                        <option id="scItalicFontWeight300" value="300">Light (300)</option>
                        <option id="scItalicFontWeight400" value="400" selected>Regular (400)</option>
                        <option id="scItalicFontWeight500" value="500">Medium (500)</option>
                        <option id="scItalicFontWeight600" value="600">Semi Bold (600)</option>
                        <option id="scItalicFontWeight700" value="700">Bold (700)</option>
                        <option id="scItalicFontWeight800" value="800">Extra Bold (800)</option>
                        <option id="scItalicFontWeight900" value="900">Black (900)</option>
                  </select>
               </div>
            </div>
         <div class="sc-bg-3f3f3f sc-px-2" style="height: 27px; padding: 0 8px;">
            <img class="sc-mx-auto sc-rotate-180 sc-mt-3" width="10px"
               src="https://goswami34.github.io/squareCraft-widget/public/arrow.svg" alt="">
         </div>
      </div>

      <div class="sc-col-span-5 sc-px-2 sc-bg-3f3f3f sc-inActiveTab-border sc-flex sc-justify-between sc-items-center  sc-rounded-6px">

            <p id="ItalictextcolorHtml" class="sc-text-sm sc-poppins sc-universal">Select</p>
            <div id="ItalictextColorPalate" class="sc-square-6 sc-border-colors sc-cursor-pointer"></div>

      </div>

     <div>
      
     </div>
   </div>
   <div
     class="sc-flex sc-col-span-5 sc-justify-between  sc-items-center ">
    <div
        class="sc-flex sc-items-center" id="squareCraftItalicTextTransform">
        
        <div id="scTextTransformUppercase" 
                    class="sc-pt-1 sc-pb-1 sc-px-1_5 sc-inActiveTab-border sc-cursor-pointer sc-rounded-l">

           <p class="sc-universal sc-poppins sc-text-sm squareCraft-text-transform" data-text-transform="uppercase">AG</p>
        </div>
         <div id="scTextTransformLowercase" 
                    data-align="center" class="sc-pt-1 sc-pb-1 sc-px-1_5 sc-inActiveTab-border sc-cursor-pointer ">

          <p class="sc-universal sc-poppins sc-text-sm squareCraft-text-transform" data-text-transform="lowercase">ag</p>
        </div>
         <div id="scTextTransformCapitalize" 
                    data-align="right" class="sc-pt-1 sc-pb-1 sc-px-1_5 sc-inActiveTab-border sc-cursor-pointer">

          <p class="sc-universal sc-poppins sc-text-sm squareCraft-text-transform" data-text-transform="capitalize">Ag</p>
        </div>
        <div id="scTextTransformNone" 
                    class="sc-pt-1 sc-pb-1 sc-px-1_5 sc-inActiveTab-border sc-cursor-pointer sc-rounded-r">
          <p class="sc-universal sc-poppins sc-text-sm squareCraft-text-transform" data-text-transform="small-caps">AG</p>
        </div>
        
      </div>
   </div>

   <div class="sc-mt-4 ">
      <p class="sc-text-xs sc-font-thin sc-mt-4 sc-universal sc-text-gray-300 sc-poppins">Text Highlight</p>

      <div class="sc-py-1 sc-mt-2 sc-bg-3f3f3f sc-inActiveTab-border sc-w-50 sc-flex sc-justify-between sc-items-center sc-px-2 sc-rounded-6px">
         <p id="ItalictextHighlightHtml" class="sc-text-sm sc-poppins sc-universal c-font-light">#363544</p>
         <div id="ItalictextHighlightColorPalate" class="sc-square-6 sc-border-colors sc-cursor-pointer"></div>
      </div>
   </div> 
    `;
}
