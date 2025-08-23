export function WidgetButtonNormalState() {
  const ButtonLetterSpacing = Array.from({ length: 20 }, (_, i) =>
    i.toString()
  );
  const fontSizes = Array.from({ length: 80 }, (_, i) => (i + 8).toString());
  const solidIconList = Array.from({ length: 116 }, (_, i) => i + 1);
  const outlineIcons = Array.from({ length: 112 }, (_, i) => i + 1);

  return `
  <div id="ButtonNormalState" class="sc-mt-4 sc-px-2">
            <div class="sc-flex ">

               <div id="fontButton"
                  class="sc-bg-3f3f3f sc-relative sc-z-99999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-w-full sc-rounded-4px">
                
                  <p class="sc-roboto sc-font-size-14 sc-universal ">Font</p>
                  <img id="button-font-arrow" src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                     class="" alt="">
               </div>
            </div>
         <div id="fontSection">
            <div class=" sc-relative sc-grid sc-mt-2 sc-grid-cols-12 sc-gap-2 ">

               <div id="buttonFontFamilyButton" class="sc-flex sc-relative sc-bg-494949 sc-h-9 sc-cursor-pointer sc-col-span-8 sc-rounded-4px sc-justify-between sc-border sc-border-solid sc-border-585858 sc-items-center">
                  <p id="font-name" class="sc-font-size-12 sc-roboto sc-font-light" style="background: transparent; color: white; border: none; outline: none; appearance: none; padding: 0 8px;">
                  Select Font
                  </p>
                  <div class="sc-bg-3f3f3f sc-flex sc-items-center sc-justify-center sc-px-2 sc-h-9">
                  <img class="sc-rotate-180" width="12px" src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg" alt="">
                  </div>
               
               </div>
               <div id="buttonFontFamilyOptions" class="sc-absolute sc-border sc-border-solid sc-border-EF7C2F sc-w-190px sc-hidden sc-top-10 sc-z-999999 sc-scrollBar sc-h-dropdown sc-rounded-4px  sc-bg-494949 sc-flex sc-flex-col sc-overflow-hidden">

               </div>
               
            <div 
               class="sc-flex sc-bg-transparent  sc-h-9 sc-text-color-white sc-justify-between sc-col-span-4   sc-rounded-4px sc-border sc-border-solid sc-border-585858 sc-items-center ">
               <div class="sc-flex sc-text-color-white sc-items-center ">
                  <div
                     class="sc-flex sc-text-color-white sc-justify-between sc-col-span-4 sc-rounded-4px sc-items-center  ">
                     <div
                        class="sc-font-size-container sc-roboto sc-universal sc-flex sc-justify-between sc-items-center  sc-items-center sc-rounded-4px">
                        <input type="text" id="scButtonFontSizeInput" value="16"
                           class="sc-font-size-input sc-font-light sc-z-99999 sc-font-size-12 sc-text-color-white sc-bg-transparent  sc-universal sc-font-light">
                        <div class="sc-v-line"></div>
                        <div class="sc-flex sc-items-center  sc-justify-center  sc-items-center">
                           <p class=" sc-font-light sc-text-center sc-font-size-12 sc-ml-2  ">
                              px
                        </div>
                        <div id="scButtonFontSizeSelect" class="sc-bg-3f3f3f sc-cursor-pointer sc-px-1_5"
                           style="height: 28px;  margin-left: 12px;   border-radius: 0px 5px 5px 0px;">
                           <img class=" sc-rotate-180 sc-mt-2" width="12px"
                              src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg" alt="">
                        </div>
                     </div>
                     <div id="scButtonFontSizeOptions" class="sc-z-99999 sc-border sc-border-solid sc-border-EF7C2F sc-hidden sc-scrollBar sc-h-44 sc-font-sm sc-bg-3f3f3f sc-w-12
                  sc-rounded-4px sc-border sc-border-585858 sc-absolute 
                  sc-mt-1">
                        ${fontSizes
                          ?.map(
                            (size) => `
                        <div class="sc-dropdown-item sc-py-1px sc-text-center  sc-font-size-12" data-value="${size}">
                           ${size}</div>`
                          )
                          .join("")}
                     </div>
                  </div>
               </div>
               <div class="sc-border-r sc-border-585858 "></div>
            </div>
         </div>

         <div class="sc-mt-2 sc-relative sc-grid sc-grid-cols-12 sc-gap-2 ">
            <div id="scButtonFontWeightSelect" class="sc-flex sc-bg-494949 sc-pl-2 sc-col-span-7 sc-cursor-pointer sc-justify-between sc-border sc-border-solid sc-border-585858 sc-rounded-4px sc-items-center">
               <div>
               <p id="scButtonFontWeightSelected" class="sc-font-size-12 sc-universal sc-roboto sc-font-light">
                  400
               </p>
               </div>
               <div class="sc-bg-3f3f3f sc-flex sc-items-center sc-justify-center sc-px-2 sc-h-9" >
               <img class="sc-mx-auto sc-rotate-180 " width="10px" src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg" alt="">
               </div>
            </div>
            
            <div id="scButtonFontWeightOptions" class="sc-absolute sc-w-100px sc-border sc-border-solid sc-border-EF7C2F sc-hidden sc-top-10 sc-z-99999 sc-scrollBar sc-max-h-140px sc-rounded-4px sc-bg-494949 sc-flex sc-flex-col sc-overflow-hidden">
               <div class="sc-dropdown-item sc-py-1px sc-text-center sc-font-size-12 sc-cursor-pointer">300</div>
               <div class="sc-dropdown-item sc-py-1px sc-text-center sc-font-size-12 sc-cursor-pointer">400</div>
               <div class="sc-dropdown-item sc-py-1px sc-text-center sc-font-size-12 sc-cursor-pointer">500</div>
               <div class="sc-dropdown-item sc-py-1px sc-text-center sc-font-size-12 sc-cursor-pointer">600</div>
               <div class="sc-dropdown-item sc-py-1px sc-text-center sc-font-size-12 sc-cursor-pointer">700</div>
               <div class="sc-dropdown-item sc-py-1px sc-text-center sc-font-size-12 sc-cursor-pointer">800</div>
               <div class="sc-dropdown-item sc-py-1px sc-text-center sc-font-size-12 sc-cursor-pointer">900</div>
            </div>
            

            <div class="sc-flex sc-text-color-white sc-rounded-4px sc-relative sc-border sc-border-solid sc-border-585858 sc-items-center">
               <div class="sc-flex sc-text-color-white sc-justify-between sc-col-span-4 sc-rounded-4px sc-items-center">
                 <div class="sc-font-size-container sc-roboto sc-universal sc-flex sc-justify-between sc-items-center sc-rounded-4px">
                   
                   <input type="text" id="scButtonLetterSpacingInput" value="0"
                     class="sc-font-size-input sc-font-light sc-z-99999 sc-font-size-12 sc-text-color-white sc-bg-transparent  sc-universal sc-font-light">
             
                   <div class="sc-v-line"></div>
             
                   <div class="sc-flex sc-items-center sc-justify-center sc-ml-2">
                     <p class="sc-font-light sc-text-center sc-font-size-12 sc-universal">px</p>
                   </div>
             
                   <div id="scButtonLetterSpacingSelect"
                     class="sc-bg-3f3f3f sc-flex sc-items-center sc-justify-center sc-cursor-pointer sc-px-1_5 sc-tooltip-target"
                     style="height: 28px; margin-left: 12px; border-radius: 0px 5px 5px 0px;">
                     <div class="sc-tooltip sc-hidden">
                       <div class="tooltip-arrow"></div>
                       Letter spacing
                     </div>
                     <img id="scButtonLetterSpacingDropdown" loading="lazy"
                       src="https://fatin-webefo.github.io/squareCraft-plugin/public/line-spacing.svg"
                       style="width: 12px;" class=" sc-mx-auto sc-cursor-pointer">
                   </div>
                 </div>
             
                 <div id="scButtonLetterSpacingOptions"
                   class="sc-absolute sc-hidden sc-scrollBar sc-z-99999 sc-border sc-border-solid sc-border-EF7C2F sc-h-44 sc-font-sm sc-bg-3f3f3f sc-w-12 sc-rounded-4px sc-border-585858 sc-mt-1">
                   ${ButtonLetterSpacing?.map(
                     (gap) => `
                     <div class="sc-dropdown-item sc-py-1px sc-text-center sc-font-size-12" data-value="${gap}">
                       ${gap}
                     </div>`
                   ).join("")}
                 </div>
               </div>
             </div>
             

         </div>
         <div class=" sc-flex sc-mt-2 sc-gap-2 ">



         
      <div class="sc-flex sc-col-span-6 sc-justify-between  sc-items-center ">
            <div class="sc-flex sc-items-center  ">

               <div id="scButtonAllCapital" 
                  class=" sc-h-9 sc-flex sc-items-center sc-justify-center sc-px-9px sc-inActiveTab-border sc-cursor-pointer sc-rounded-l">

                  <p class="sc-universal sc-roboto sc-font-size-12">AG</p>
               </div>
               <div id="scButtonAllSmall" 
                  class="sc-h-9 sc-flex sc-items-center sc-justify-center sc-px-9px sc-inActiveTab-border sc-cursor-pointer ">

                  <p class="sc-universal sc-roboto sc-font-size-12">ag</p>
               </div>
               <div id="scButtonFirstCapital" 
                  class="sc-h-9 sc-flex sc-items-center sc-justify-center sc-px-9px sc-inActiveTab-border sc-rounded-r sc-cursor-pointer">

                  <p class="sc-universal sc-roboto sc-font-size-12">Ag</p>
               </div>
            </div>
         </div>
         </div>

      
         </div>


            <div id="colorButton"
               class="sc-bg-3f3f3f sc-mt-3 sc-relative sc-z-9999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-rounded-4px">
               <p class="sc-roboto  sc-universal sc-font-size-14">Color</p>
               <img id="button-color-arrow" src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                  class="sc-rotate-180" alt="">
            </div>
            <div id="colorSection" class="sc-mt-2 sc-hidden">
            <div class="sc-items-center sc-gap-2  sc-flex">
               <div id="bgColorSection" class=" ">
                  <p class="sc-font-size-11 sc-font-thin sc-mt-4 sc-universal sc-text-gray-300 sc-roboto">Background Color
                  </p>
                  <div class="sc-col-span-5 sc-mt-2 sc-z-99999 sc-relative ">
                     <div class="sc-flex sc-w-30 sc-justify-between sc-items-center sc-px-1 sc-bg-3f3f3f sc-inActiveTab-border sc-rounded-4px sc-py-4px">
                     <p id="buttonFontColorCode" class="sc-font-size-12 sc-roboto sc-universal">Select</p>
                     <div id="buttonFontColorPalate" class="sc-square-6  sc-cursor-pointer"></div>
                     </div>
                  
                     <div id="button-font-color-palette"
                     class="sc-absolute sc-z-99999 sc-border sc-hidden sc-border-solid sc-border-EF7C2F sc-top-12 sc-bg-3f3f3f sc-left-0 sc-p-1_5 sc-rounded-4px">
                     <div class="sc-button-fontcolor-arrow"></div>
                  
                     <div class="sc-flex sc-items-center sc-justify-between">
                        <div id="button-border-colors" class="sc-flex sc-relative sc-items-center sc-gap-1"></div>
                  
                     <div class="sc-relative sc-inline-block sc-w-auto">
                     <div id="color-code-toggle" class="sc-rounded-15px sc-px-2 sc-cursor-pointer sc-py-4px sc-bg-454545 sc-flex sc-items-center sc-gap-2">
                        <p id="color-code-label" class="sc-universal sc-font-size-11 sc-roboto">RGB</p>
                        <span id="color-code-arrow" class="sc-arrow-placeholder sc-rotate-180"></span>
                     </div>

                  <div id="color-code-dropdown-list"
                        class="sc-absolute sc-border sc-border-solid sc-border-EF7C2F sc-left-0 sc-w-full sc-text-sm sc-z-999999 sc-rounded-15px sc-bg-494949 sc-flex sc-hidden sc-top-6 sc-flex-col sc-overflow-hidden">
                     <div class="sc-cursor-pointer sc-dropdown-item sc-py-2px sc-px-2 sc-rounded-t-14px" data-format="RGB">RGB</div>
                     <div class="sc-cursor-pointer sc-dropdown-item sc-py-2px sc-px-2" data-format="HSL">HSL</div>
                     <div class="sc-cursor-pointer sc-dropdown-item sc-py-2px sc-px-2 sc-rounded-b-14px" data-format="HEX">HEX</div>
                  </div>
                  </div>


                     </div>
                  
                     <div class="sc-h-1px sc-mt-2 sc-bg-color-gray"></div>
                  
                     <div class="sc-flex color-h-selection sc-mt-2 sc-items-center sc-gap-2">
                        <div id="button-color-selection-field" class="sc-relative">
                           <div id="button-color-selection-bar"
                           class="sc-w-2 sc-h-2 sc-absolute sc-cursor-pointer sc-rounded-full sc-border sc-border-solid sc-border-white">
                           </div>
                        </div>
                  
                        <div id="button-color-transparency-field" class="sc-h-full sc-w-3 sc-relative sc-rounded-15px">
                           <div id="button-color-transparency-bar"
                           class="sc-absolute sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2">
                           </div>
                        </div>
                  
                        <div id="button-all-color-selection-field" class="sc-h-full sc-w-3 sc-relative sc-rounded-15px">
                           <div id="button-all-color-selection-bar"
                           class="sc-absolute sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2">
                           </div>
                        </div>
                     </div>
                  
                     <div class="sc-flex sc-justify-between sc-mt-2 sc-px-2 sc-py-0_5 sc-rounded-4px sc-bg-454545">
                        <p id="button-color-code" class="sc-font-size-12 sc-roboto sc-font-light sc-universal">Select</p>
                        <p id="button-color-transparency-count" class="sc-font-size-12 sc-roboto sc-font-light sc-universal">100%</p>
                     </div>
                     </div>
                  </div>
               </div>

               
               <div id="textColorSection" class=" ">
                  <p class="sc-font-size-11 sc-font-thin sc-mt-4 sc-universal sc-text-gray-300 sc-roboto">Text Color
                  </p>
                     <div
                        class="sc-py-4px sc-relative sc-mt-2 sc-bg-3f3f3f sc-inActiveTab-border  sc-flex sc-justify-between sc-items-center sc-px-1 sc-rounded-4px sc-button-text-color-palette">
                        <p class="sc-font-size-12 sc-roboto sc-font-light sc-universal">Select</p>
                        <div id="button-text-color-select" class="sc-square-6  sc-cursor-pointer">
                        </div>

                        <div id="button-text-color-palette"
                           class="sc-absolute sc-hidden sc-border sc-border-solid sc-border-EF7C2F sc-top-12 sc-bg-3f3f3f sc-left-0 sc-p-1 sc-rounded-4px ">
                           <div class="sc-color-arrow"></div>
                           <div class="sc-flex sc-items-center sc-justify-between">
                              <div id="button-text-colors-palette" class="sc-flex sc-relative sc-items-center sc-gap-1">


                              </div>


                              <div class="sc-rounded-15px sc-px-2 sc-cursor-pointer sc-py-4px sc-bg-454545 sc-flex sc-gap-1">
                                 <p class="sc-universal sc-font-size-11 sc-roboto">RGB</p>
                                 <span="sc-arrow-placeholder sc-rotate-180"></span>

                              </div>
                           </div>

                           <div class="sc-h-1px sc-mt-2 sc-bg-color-gray"></div>
                           <div class="sc-flex color-h-selection sc-mt-2 sc-items-center sc-gap-2">
                              <div id="button-text-border-color-selection-field" class="sc-relative">
                                 <div id="button-text-border-color-selection-bar"
                                    class="sc-w-2 sc-h-2 sc-absolute sc-cursor-pointer sc-rounded-full sc-border sc-border-solid sc-border-white">
                                 </div>
                              </div>
                              <div id="button-text-border-color-transparency-field"
                                 class="sc-h-full sc-w-3 sc-relative  sc-rounded-15px ">
                                 <div id="button-text-border-color-transparency-bar"
                                    class="sc-absolute  sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px  sc-cursor-grabbing  sc-h-2 sc-bg-color-f2f2f2">
                                 </div>
                              </div>
                              <div id="button-text-border-color-all-color-selction-field"
                                 class="sc-h-full sc-w-3 sc-relative sc-rounded-15px">
                                 <div id="button-text-border-color-all-color-selction-bar"
                                    class="sc-absolute  sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2">
                                 </div>
                              </div>
                           </div>
                           <div
                              class="sc-flex sc-justify-between sc-mt-2 sc-px-2 sc-py-0_5 sc-rounded-4px sc-bg-454545">
                              <p id="button-text-border-color-code" class="sc-font-size-12 sc-roboto sc-font-light sc-universal">Select
                              </p>
                              <p id="button-text-border-color-transparency-count"
                                 class="sc-font-size-12 sc-roboto sc-font-light sc-universal">100%</p>
                           </div>
                        </div>

                     </div>
               </div>



            </div>
            </div>


               <div id="iconButton"
                  class="sc-bg-3f3f3f sc-mt-3 sc-relative sc-z-9999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-rounded-4px">
                  <p class="sc-roboto  sc-universal sc-font-size-14">Icon</p>
                  <img id="button-icon-arrow" src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                     class="sc-rotate-180" alt="">
               </div>
      
            <div id="iconSection" class="sc-mt-2  sc-hidden">
            <div class="">
               <div class="sc-flex sc-items-center sc-gap-2">
                  <div>
                     <p class="sc-roboto sc-universal sc-font-size-12 sc-font-light sc-text-gray-300">Icon</p>
                     <div class="sc-flex sc-items-center  sc-mt-2">

                        <div 
                           class="sc-h-9 sc-flex sc-tooltip-target sc-items-center sc-justify-center sc-px-1_5 sc-inActiveTab-border sc-cursor-pointer sc-rounded-l">
                           <div class="sc-tooltip sc-hidden">
                       <div class="tooltip-arrow"></div>
                       Remove icon
                     </div>
                           <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/redo.svg"
                              class=" alignment-icon   sc-mx-auto" alt="left">
                        </div>

                <div id="imageupload"
                     class="sc-tooltip-target sc-relative sc-h-9 sc-flex sc-items-center sc-justify-center sc-px-1_5 sc-inActiveTab-border sc-cursor-pointer">
                     <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/imageupload.svg"
                       class="alignment-icon sc-mx-auto" alt="center">
                       
                     <div class="sc-tooltip sc-hidden">
                       <div class="tooltip-arrow"></div>
                       Upload icon
                     </div>
                   </div>
                   



                        <div class="sc-relative">
                       <div id="iconLibraryButton"
                           class="sc-h-9 sc-flex sc-tooltip-target sc-items-center sc-justify-center  sc-roudned-r-md sc-px-1_5 sc-inActiveTab-border sc-cursor-pointer">
                               <div class="sc-tooltip sc-hidden">
                       <div class="tooltip-arrow"></div>
                        Icon library
                     </div>
                           <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/iconLibrary.svg"
                              class=" alignment-icon   sc-mx-auto" alt="right">

                           </div>
                           <div id="buttonIconLibraryOptions" class="sc-absolute sc-hidden sc-p-1_5 sc-z-99999  sc-w-250 sc-border sc-border-solid sc-border-EF7C2F sc-rounded-md sc-top-12 sc-bg-color-3d3d3d  sc-left-0">
                            <div class="sc-icon-arrow"
                          >
                          </div>
                         <div class="sc-absolute sc-flex sc-mt-1 sc-items-center sc-gap-3">
                         <div id="buttonIconSolidClick" class="sc-px-6 sc-py-4px sc-rounded-lg sc-cursor-pointer sc-bg-3f3f3f">
                           <div  class="sc-roboto   sc-font-size-11 sc-font-light sc-text-EF7C2F" >Solid</div>
                         </div>
                         <div id="buttonIconOutlineClick" class="sc-px-6 sc-py-4px sc-rounded-lg sc-cursor-pointer sc-bg-3f3f3f">
                           <div class="sc-roboto   sc-font-size-11 sc-font-light " >Outline</div>
                         </div>
                         </div>

                       <div class="sc-mt-8 sc-relative">
                          <div id="buttonIconSolidoptions" class=" sc-scrollBar sc-justify-between sc-rounded-md sc-gap-5px sc-h-44 sc-scrollBar sc-p-5px sc-grid-cols-6 sc-bg-color-2c2c2c">
                            ${solidIconList
                              .map(
                                (i) => `
                              <img 
                                src="https://fatin-webefo.github.io/squareCraft-plugin/public/solidIcons/solidicon%20(${i}).svg" 
                                class="sc-rounded-md sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-mx-auto sc-bg-3f3f3f sc-px-1 sc-py-4px" 
                                width="22" height="22" alt="">`
                              )
                              .join("")}
                          </div>
                        
                          <div id="buttonIconOutlineoptions" class=" sc-hidden sc-scrollBar sc-justify-between sc-rounded-md sc-gap-5px sc-h-44 sc-scrollBar sc-p-5px sc-grid-cols-6 sc-bg-color-2c2c2c">
                            ${outlineIcons
                              .map(
                                (i) => `
                              <img 
                                src="https://fatin-webefo.github.io/squareCraft-plugin/public/outlineIcons/outlineicon%20(${i}).svg" 
                                class="sc-rounded-md sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-mx-auto sc-bg-3f3f3f sc-px-1 sc-py-4px" 
                                width="22" height="22" alt="">`
                              )
                              .join("")}
                          </div>
                        </div>
                        

                           </div>
                     </div>

                     </div>
                  </div>
                  <div>
                     <p class="sc-roboto sc-universal sc-font-size-12 sc-font-light sc-text-gray-300">Icon Position</p>
                     <div class="sc-flex sc-mt-2 sc-relative sc-items-center">
                        <div  class="sc-bg-3f3f3f sc-relative sc-py-0_5 sc-rounded-l sc-px-2 sc-w-16">
                        <p id="iconPositionLabel" class="sc-universal sc-roboto sc-font-size-12">Before</p>
                        </div>
                     
                        <div id="iconPositionDropdown" class="sc-absolute sc-rounded-4px  sc-border sc-border-solid sc-border-EF7C2F sc-hidden  sc-left-0 sc-top-[35px] sc-z-50">
                        <div class="sc-bg-3f3f3f sc-py-1 sc-font-size-12 sc-px-2 sc-w-16 sc-border-b sc-bg-colo-EF7C2F-hover  sc-cursor-pointer" data-value="before">Before</div>
                        <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="after">After</div>
                        </div>
                     
                        <div id="buttoniconPositionSection" class="sc-bg-454545 sc-cursor-pointer sc-px-2_5 sc-py-0_5px">
                        <div class="sc-flex sc-flex-col sc-items-center sc-gap-2">
                           <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg" width="10" alt="">
                           <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg" width="10" class="sc-rotate-180" alt="">
                        </div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>


         
            <div class="sc-mt-4 sc-flex sc-items-center sc-gap-2">
             
                 <div class="sc-w-full">
                  <div class=" sc-mt-2 sc-flex sc-w-full sc-items-center sc-justify-between">
                     <div class="sc-flex sc-gap-2 sc-items-center">
                        <p class="sc-roboto sc-font-thin sc-universal  sc-font-size-12 sc-font-thin sc-text-gray-300"> Rotation
                        </p>
                        <div  id="icon-rotation-reset"
                           class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5  sc-bg sc-bg-454545">
      
                           <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10"
                              alt="reset">
                        </div>
                     </div>
                     <div
                        class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
                        <p id="buttoniconRotationradiusCount" class="sc-font-thin sc-roboto sc-universal sc-font-size-11">0px</p>
                        <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                            <span id="buttoniconRotationIncrease" class="sc-arrow-placeholder"></span>
                           <span id="buttoniconRotationDecrease" class="sc-arrow-placeholder sc-rotate-180"></span>
                        </div>
                     </div>
                  </div>
                  <div id="buttonIconRotationradiusField" class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6">
                     <div id="buttonIconRotationradiusFill" class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"></div>
                     <div id="buttonIconRotationradiusBullet"
                        class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half">
                     </div>
                  </div>
                  <div class="sc-mt-2 sc-flex sc-items-center sc-justify-between">
                     <p class="sc-universal sc-font-size-12 sc-roboto sc-font-light sc-text-color-EF7C2F">-180 deg</p>
                     <p class="sc-universal sc-font-size-12 sc-roboto sc-text-gray-300 sc-font-light">180 deg</p>
                  </div>
                 </div>                 
            </div>

            <div class="sc-w-full sc-mt-4">
               <div class=" sc-mt-2 sc-flex sc-w-full sc-items-center sc-justify-between">
                  <div class="sc-flex sc-gap-2 sc-items-center">
                     <p class="sc-roboto sc-font-thin sc-universal  sc-font-size-12 sc-font-thin sc-text-gray-300"> icon Size
                     </p>
                     <div id="icon-size-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5  sc-bg sc-bg-454545">
   
                        <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10"
                           alt="reset">
                     </div>
                  </div>
                  <div
                     class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
                     <p id="buttoniconSizeradiusCount" class="sc-font-thin sc-roboto sc-universal sc-font-size-11">0px</p>
                     <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                         <span id="buttoniconSizeIncrease" class="sc-arrow-placeholder"></span>
                         <span id="buttoniconSizeDecrease" class="sc-arrow-placeholder sc-rotate-180"></span>
                     </div>
                  </div>
               </div>
               <div id="buttonIconSizeradiusField" class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6">
                  <div id="buttonIconSizeradiusFill" class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"></div>
                  <div id="buttonIconSizeradiusBullet"
                     class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half">
                  </div>
               </div>
              </div>

            <div class="sc-mt-4 ">
               <p class="sc-font-size-11 sc-font-thin sc-mt-4 sc-universal sc-text-gray-300 sc-roboto">Icon Color
               </p>
               <div
                        class="sc-py-4px sc-relative sc-mt-2 sc-bg-3f3f3f sc-inActiveTab-border  sc-flex sc-justify-between sc-items-center sc-px-1 sc-rounded-4px sc-button-icon-color-palette">
                        <p class="sc-font-size-12 sc-roboto sc-font-light sc-universal">Select</p>
                        <div id="button-icon-color-select" class="sc-square-6  sc-cursor-pointer">
                        </div>

                        <div id="button-icon-color-palette"
                           class="sc-absolute sc-hidden sc-border sc-border-solid sc-border-EF7C2F sc-top-12 sc-bg-3f3f3f sc-left-0 sc-p-1 sc-rounded-4px ">
                           <div class="sc-color-arrow"></div>
                           <div class="sc-flex sc-items-center sc-justify-between">
                              <div id="button-icon-colors-palette" class="sc-flex sc-relative sc-items-center sc-gap-1">


                              </div>


                              <div class="sc-rounded-15px sc-px-2 sc-cursor-pointer sc-py-4px sc-bg-454545 sc-flex sc-gap-1">
                                 <p class="sc-universal sc-font-size-11 sc-roboto">RGB</p>
                                 <span="sc-arrow-placeholder sc-rotate-180"></span>

                              </div>
                           </div>

                           <div class="sc-h-1px sc-mt-2 sc-bg-color-gray"></div>
                           <div class="sc-flex color-h-selection sc-mt-2 sc-items-center sc-gap-2">
                              <div id="button-icon-color-selection-field" class="sc-relative">
                                 <div id="button-icon-color-selection-bar"
                                    class="sc-w-2 sc-h-2 sc-absolute sc-cursor-pointer sc-rounded-full sc-border sc-border-solid sc-border-white">
                                 </div>
                              </div>
                              <div id="button-icon-color-transparency-field"
                                 class="sc-h-full sc-w-3 sc-relative  sc-rounded-15px ">
                                 <div id="button-icon-color-transparency-bar"
                                    class="sc-absolute  sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px  sc-cursor-grabbing  sc-h-2 sc-bg-color-f2f2f2">
                                 </div>
                              </div>
                              <div id="button-icon-color-all-color-selection-field"
                                 class="sc-h-full sc-w-3 sc-relative sc-rounded-15px">
                                 <div id="button-icon-color-all-color-selection-bar"
                                    class="sc-absolute  sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2">
                                 </div>
                              </div>
                           </div>
                           <div
                              class="sc-flex sc-justify-between sc-mt-2 sc-px-2 sc-py-0_5 sc-rounded-4px sc-bg-454545">
                              <p id="button-icon-color-code" class="sc-font-size-12 sc-roboto sc-font-light sc-universal">Select
                              </p>
                              <p id="button-icon-color-transparency-count"
                                 class="sc-font-size-12 sc-roboto sc-font-light sc-universal">100%</p>
                           </div>
                        </div>

                     </div>
                  
            </div>

            <div class=" sc-mt-2 sc-flex sc-items-center sc-justify-between">
               <div class="sc-flex sc-gap-2 sc-items-center">
                  <p class="sc-roboto sc-font-thin sc-universal  sc-font-size-12 sc-font-thin sc-text-gray-300"> Icon Spacing
                  </p>
                  <div id="icon-spacing-reset"
                     class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5  sc-bg sc-bg-454545">

                     <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10"
                        alt="reset">
                  </div>
               </div>
               <div
                  class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
                  <p id="buttoniconSpacingCount" class="sc-font-thin sc-roboto sc-universal sc-font-size-11">0px</p>
                  <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                      <span id="buttoniconSpacingIncrease" class="sc-arrow-placeholder"></span>
                      <span id="buttoniconSpacingDecrease" class="sc-arrow-placeholder sc-rotate-180"></span>
                  </div>
               </div>
            </div>
            <div id="buttonIconSpacingradiusField" class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6">
               <div id="buttonIconSpacingradiusFill" class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"></div>
               <div id="buttonIconSpacingradiusBullet"
                  class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half">
               </div>
            </div>
         </div>

            <div>
               <div id="bordersButton"
                  class="sc-bg-3f3f3f sc-mt-3 sc-relative sc-z-9999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-rounded-4px">
                  <p class="sc-roboto  sc-universal sc-font-size-14">Border</p>
                  <img id="button-border-arrow" src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                     class="sc-rotate-180" alt="">
               </div>

               <div id="bordersSection" class=" sc-mt-2 sc-hidden">
                  <div class=" sc-flex sc-items-center sc-justify-between">
                     <div class="sc-flex sc-gap-2 sc-items-center">
                        <p class="sc-roboto sc-font-thin sc-universal  sc-font-size-12 sc-font-thin sc-text-gray-300">
                           Border
                        </p>
                        <div id="border-reset"
                           class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5  sc-bg sc-bg-454545">

                           <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10"
                              alt="reset">
                        </div>
                     </div>
                     <div
                        class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
                        <p id="buttonBorderCount" class="sc-font-thin sc-roboto sc-universal sc-font-size-11">0px</p>
                        <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                            <span id="buttonBorderIncrease" class="sc-arrow-placeholder"></span>
                            <span id="buttonBorderDecrease" class="sc-arrow-placeholder sc-rotate-180"></span>
                        </div>
                     </div>
                  </div>

                  <div id="buttonBorderField" class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6">
                     <div id="buttonBorderFill" class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"></div>
                     <div id="buttonBorderBullet"
                        class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half">
                     </div>
                  </div>
                  <div class="sc-grid sc-grid-cols-12 sc-mt-2">
                     <div></div>
                     <div style="padding: 2px 0px;"
                        class="sc-bg-3f3f3f sc-flex sc-col-span-11 sc-font-size-12 sc-font-thin   sc-border sc-border-solid sc-border-3f3f3f   sc-justify-center  sc-px-1 sc-rounded-4px">
                        <div id="buttonBorderAll"
                           class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-4px sc-rounded-4px sc-items-center sc-gap-1">
                           <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/all.svg" loading="lazy"
                              alt="all-border">
                           <p class="sc-font-thin sc-roboto sc-universal ">All</p>
                        </div>
                        <div id="buttonBorderTop"
                           class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-4px sc-rounded-4px sc-items-center sc-gap-1">
                           <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/top.svg" loading="lazy"
                              alt="top-border">
                           <p class="sc-font-thin sc-roboto sc-universal ">Top</p>
                        </div>
                        <div id="buttonBorderBottom"
                           class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-4px sc-rounded-4px sc-items-center sc-gap-1">
                           <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/bottom.svg"
                              loading="lazy" alt="bottom-border">
                           <p class="sc-font-thin sc-roboto sc-universal ">Bottom</p>
                        </div>
                        <div id="buttonBorderLeft"
                           class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-4px sc-rounded-4px sc-items-center sc-gap-1">
                           <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/left.svg"
                              loading="lazy" alt="left-border">
                           <p class="sc-font-thin sc-roboto sc-universal ">Left</p>
                        </div>
                        <div id="buttonBorderRight"
                           class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-4px sc-rounded-4px sc-items-center sc-gap-1">
                           <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/right.svg"
                              loading="lazy" alt="right-border">
                           <p class="sc-font-thin sc-roboto sc-universal ">Right</p>
                        </div>
                     </div>
                  </div>

                  <div class="sc-mt-4 sc-gap-2 sc-grid sc-grid-cols-12">


                     <div class="sc-col-span-5">
                        <p class="sc-roboto sc-font-thin sc-universal  sc-font-size-12 sc-font-thin sc-text-gray-300">
                           Border
                           Color
                        </p>

                        <div
                           class="sc-py-4px sc-relative sc-mt-2 sc-bg-3f3f3f sc-inActiveTab-border  sc-flex sc-justify-between sc-items-center sc-px-1 sc-rounded-4px">
                           <p class="sc-font-size-12 sc-roboto sc-font-light sc-universal">Select</p>
                           <div id="button-border-color-select" class="sc-square-6  sc-cursor-pointer">
                           </div>

                           <div id="button-border-color-palette"
                              class="sc-absolute sc-hidden sc-border sc-border-solid sc-border-EF7C2F sc-top-12 sc-bg-3f3f3f sc-left-0 sc-p-1 sc-rounded-4px ">
                              <div class="sc-color-arrow"></div>
                              <div class="sc-flex sc-items-center sc-justify-between">
                                 <div id="button-border-colors-palette" class="sc-flex sc-relative sc-items-center sc-gap-1">


                                 </div>


                                 <div class="sc-rounded-15px sc-px-2 sc-cursor-pointer sc-py-4px sc-bg-454545 sc-flex sc-gap-1">
                                    <p class="sc-universal sc-font-size-11 sc-roboto">RGB</p>
                                   <span="sc-arrow-placeholder sc-rotate-180"></span>

                                 </div>
                              </div>

                              <div class="sc-h-1px sc-mt-2 sc-bg-color-gray"></div>
                              <div class="sc-flex color-h-selection sc-mt-2 sc-items-center sc-gap-2">
                                 <div id="button-border-color-selection-field" class="sc-relative">
                                    <div id="button-border-color-selection-bar"
                                       class="sc-w-2 sc-h-2 sc-absolute sc-cursor-pointer sc-rounded-full sc-border sc-border-solid sc-border-white">
                                    </div>
                                 </div>
                                 <div id="button-border-color-transparency-field"
                                    class="sc-h-full sc-w-3 sc-relative  sc-rounded-15px ">
                                    <div id="button-border-color-transparency-bar"
                                       class="sc-absolute  sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px  sc-cursor-grabbing  sc-h-2 sc-bg-color-f2f2f2">
                                    </div>
                                 </div>
                                 <div id="button-border-color-all-color-selction-field"
                                    class="sc-h-full sc-w-3 sc-relative sc-rounded-15px">
                                    <div id="button-border-color-all-color-selction-bar"
                                       class="sc-absolute  sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2">
                                    </div>
                                 </div>
                              </div>
                              <div
                                 class="sc-flex sc-justify-between sc-mt-2 sc-px-2 sc-py-0_5 sc-rounded-4px sc-bg-454545">
                                 <p id="button-border-color-code" class="sc-font-size-12 sc-roboto sc-font-light sc-universal">Select
                                 </p>
                                 <p id="button-border-color-transparency-count"
                                    class="sc-font-size-12 sc-roboto sc-font-light sc-universal">100%</p>
                              </div>
                           </div>

                        </div>
                     </div>

                     
                     <div class="sc-col-span-7">
                        <p class="sc-roboto sc-font-thin sc-universal  sc-font-size-12 sc-font-thin sc-text-gray-300">
                           Border
                           Style
                        </p>
                        <div style="padding: 2px 0px;"
                           class="sc-bg-3f3f3f sc-flex sc-font-size-11 sc-gap-1 sc-mt-2 sc-rounded-4px   sc-border sc-border-solid sc-border-3f3f3f   sc-justify-between  sc-px-1 ">


                           <div id="buttonBorderTypeSolid" class="sc-py-4px  sc-w-full sc-rounded-4px ">
                              <p class="sc-font-thin sc-roboto  sc-text-center sc-universal  sc-cursor-pointer   ">
                                 Solid
                              </p>
                           </div>


                           <div id="buttonBorderTypeDashed" class="sc-py-4px  sc-w-full sc-rounded-4px ">
                              <p class="sc-font-thin sc-roboto  sc-text-center sc-universal  sc-cursor-pointer  ">
                                 Dashed
                              </p>
                           </div>
                           <div id="buttonBorderTypeDotted" class="sc-py-4px  sc-w-full sc-rounded-4px">

                              <p 
                                 class="sc-font-thin sc-roboto  sc-text-center sc-universal  sc-cursor-pointer  sc-rounded-4px">
                                 Dotted</p>
                           </div>

                        </div>
                     </div>
                  </div>




                  <div class="sc-mt-4">
                     <div class="  sc-flex sc-items-center sc-justify-between">
                        <div class="sc-flex sc-gap-2 sc-items-center">
                           <p class="sc-roboto sc-font-thin sc-universal  sc-font-size-12 sc-font-thin sc-text-gray-300">


                              Border radius
                           </p>
                           <div id="border-radius-reset"
                              class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5  sc-bg sc-bg-454545">

                              <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                                 width="10" alt="reset">
                           </div>
                        </div>
                        <div
                           class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
                           <p id="buttonBorderradiusCount" class="sc-font-thin sc-roboto sc-universal sc-font-size-11">0px</p>
                           <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                               <span  id="buttonBorderradiusIncrease" class="sc-arrow-placeholder"></span>
                               <span id="buttonBorderradiusDecrease" class="sc-arrow-placeholder sc-rotate-180"></span>
                           </div>
                        </div>
                     </div>
                    <div id="buttonBorderradiusField" class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6">
                        <div id="buttonBorderradiusFill" class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"></div>
                        <div id="buttonBorderradiusBullet"
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
                           class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-0_5 sc-rounded-6px  sc-items-center sc-gap-1" id="buttontopLeftradiusBorder">
                           <img src="https://goswami34.github.io/squareCraft-widget/public/Vector.svg" loading="lazy"
                              alt="top-left-radius">
                        </div>

                        <div
                           class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-0_5 sc-rounded-6px  sc-items-center sc-gap-1" id="buttontopRightradiusBorder">
                           <img src="https://goswami34.github.io/squareCraft-widget/public/TopRight.svg" loading="lazy"
                              alt="top-right-radius">
                        </div>

                        <div
                           class="sc-flex sc-px-1_5 sc-cursor-pointer sc-py-0_5 sc-rounded-6px  sc-items-center sc-gap-1" id="buttonbottomRightradiusBorder">
                           <img src="https://goswami34.github.io/squareCraft-widget/public/Bottom Right.svg" loading="lazy"
                              alt="bottom-right-radius">
                        </div>

                        <div
                           class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-0_5 sc-rounded-6px  sc-items-center sc-gap-1" id="buttonbottomLeftradiusBorder">
                           <img src="https://goswami34.github.io/squareCraft-widget/public/left-bottom.svg" loading="lazy"
                              alt="left-bottom-radius">
                        </div>

                     </div>



                  </div>

               
               </div>
            </div>


            <div id="shadowsButton"
                  class="sc-bg-3f3f3f sc-mt-3 sc-relative sc-z-9999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-rounded-4px">
                  <p class="sc-roboto  sc-universal sc-font-size-14">Shadow</p>
                  <img id="button-shadow-arrow" src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                     class="sc-rotate-180" alt="">
               </div>
               <div id="shadowsSection" class="sc-hidden">
                  <div class="sc-flex sc-gap-2 sc-items-center sc-mt-2">
                     <p class="sc-roboto sc-font-thin sc-universal  sc-font-size-12 sc-font-thin sc-text-gray-300"> Shadow
                     </p>
                     <div id="shadow-axis-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5  sc-bg sc-bg-454545">

                        <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10"
                           alt="reset">
                     </div>
                  </div>
                  <div class="mt-2 sc-flex sc-mt-4 sc-items-center sc-gap-3">
                     <div class="sc-w-full">
                        <div class="sc-flex sc-gap-2 sc-items-center sc-justify-between">
                           <p class="sc-roboto sc-font-thin sc-universal  sc-font-size-12 sc-font-thin sc-text-gray-300">
                              (X Axis)
                           </p>
                           <div
                              class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
                              <p id="buttonShadowXaxisCount" class="sc-font-thin sc-roboto sc-universal sc-font-size-11">0px</p>
                              <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                                 <span id="buttonshadowXIncrease" class="sc-arrow-placeholder"></span>
                                 <span id="buttonshadowXDecrease" class="sc-arrow-placeholder sc-rotate-180"></span>
                              </div>

                           </div>

                        </div>
                        <div id="buttonShadowXaxisField" class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6">
                           <div id="buttonShadowXaxisBullet"
                              class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half">
                           </div>
                        </div>
                     </div>
                     <div class="sc-w-full">
                        <div class="sc-flex sc-gap-2 sc-items-center sc-justify-between">
                           <p class="sc-roboto sc-font-thin sc-universal  sc-font-size-12 sc-font-thin sc-text-gray-300">
                              (Y Axis)
                           </p>
                           <div
                              class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
                              <p id="buttonShadowYaxisCount" class="sc-font-thin sc-roboto sc-universal sc-font-size-11">0px</p>
                              <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                                  <span id="buttonshadowYIncrease" class="sc-arrow-placeholder"></span>
                                 <span id="buttonshadowYDecrease" class="sc-arrow-placeholder sc-rotate-180"></span>
                              </div>

                           </div>

                        </div>
                        <div id="buttonShadowYaxisField" class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6">
                           <div id="buttonShadowYaxisBullet"
                              class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half">
                           </div>
                        </div>
                     </div>
                  </div>

                  <div class="sc-col-span-5">
                        <p class="sc-roboto sc-font-thin sc-universal  sc-font-size-12 sc-font-thin sc-text-gray-300">
                           Color
                        </p>

                        <div
                           class="sc-py-4px sc-relative sc-mt-2 sc-bg-3f3f3f sc-inActiveTab-border  sc-flex sc-justify-between sc-items-center sc-px-1 sc-rounded-4px sc-button-shadow-color-palette">
                           <p class="sc-font-size-12 sc-roboto sc-font-light sc-universal">Select</p>
                           <div id="button-shadow-color-select" class="sc-square-6  sc-cursor-pointer">
                           </div>

                           <div id="button-shadow-color-palette"
                              class="sc-absolute sc-hidden sc-border sc-border-solid sc-border-EF7C2F sc-top-12 sc-bg-3f3f3f sc-left-0 sc-p-1 sc-rounded-4px ">
                              <div class="sc-color-arrow"></div>
                              <div class="sc-flex sc-items-center sc-justify-between">
                                 <div id="button-shadow-colors-palette" class="sc-flex sc-relative sc-items-center sc-gap-1">


                                 </div>


                                 <div class="sc-rounded-15px sc-px-2 sc-cursor-pointer sc-py-4px sc-bg-454545 sc-flex sc-gap-1">
                                    <p class="sc-universal sc-font-size-11 sc-roboto">RGB</p>
                                   <span="sc-arrow-placeholder sc-rotate-180"></span>

                                 </div>
                              </div>

                              <div class="sc-h-1px sc-mt-2 sc-bg-color-gray"></div>
                              <div class="sc-flex color-h-selection sc-mt-2 sc-items-center sc-gap-2">
                                 <div id="button-shadow-border-color-selection-field" class="sc-relative">
                                    <div id="button-shadow-border-color-selection-bar"
                                       class="sc-w-2 sc-h-2 sc-absolute sc-cursor-pointer sc-rounded-full sc-border sc-border-solid sc-border-white">
                                    </div>
                                 </div>
                                 <div id="button-shadow-border-color-transparency-field"
                                    class="sc-h-full sc-w-3 sc-relative  sc-rounded-15px ">
                                    <div id="button-shadow-border-color-transparency-bar"
                                       class="sc-absolute  sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px  sc-cursor-grabbing  sc-h-2 sc-bg-color-f2f2f2">
                                    </div>
                                 </div>
                                 <div id="button-shadow-border-color-all-color-selction-field"
                                    class="sc-h-full sc-w-3 sc-relative sc-rounded-15px">
                                    <div id="button-shadow-border-color-all-color-selction-bar"
                                       class="sc-absolute  sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2">
                                    </div>
                                 </div>
                              </div>
                              <div
                                 class="sc-flex sc-justify-between sc-mt-2 sc-px-2 sc-py-0_5 sc-rounded-4px sc-bg-454545">
                                 <p id="button-shadow-border-color-code" class="sc-font-size-12 sc-roboto sc-font-light sc-universal">Select
                                 </p>
                                 <p id="button-shadow-border-color-transparency-count"
                                    class="sc-font-size-12 sc-roboto sc-font-light sc-universal">100%</p>
                              </div>
                           </div>

                        </div>
                     </div>



                  <div class="sc-mt-4">
                     <div class="  sc-flex sc-items-center sc-justify-between">
                        <div class="sc-flex sc-gap-2 sc-items-center">
                           <p class="sc-roboto sc-font-thin sc-universal  sc-font-size-12 sc-font-thin sc-text-gray-300">
                              Blur
                           </p>
                           <div id="shadow-blur-reset"
                              class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5  sc-bg sc-bg-454545">

                              <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10"
                                 alt="reset">
                           </div>
                        </div>
                        <div
                           class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
                           <p id="buttonShadowBlurCount" class="sc-font-thin sc-roboto sc-universal sc-font-size-11">0px</p>
                          <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                           <span id="buttonshadowBlurIncrease" class="sc-arrow-placeholder"></span>
                           <span id="buttonshadowBlurDecrease" class="sc-arrow-placeholder sc-rotate-180"></span>
                         </div>
                         
                        </div>
                     </div>
                     <div id="buttonShadowBlurField" class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6">
                        <div id="buttonShadowBlurBullet"
                           class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half">
                        </div>
                     </div>

                  </div>



                  <div class="sc-mt-4">
                     <div class="  sc-flex sc-items-center sc-justify-between">
                        <div class="sc-flex sc-gap-2 sc-items-center">
                           <p class="sc-roboto sc-font-thin sc-universal  sc-font-size-12 sc-font-thin sc-text-gray-300">
                              Spread
                           </p>
                           <div id="shadow-spread-reset"
                              class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5  sc-bg sc-bg-454545">
                              <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10"
                                 alt="reset">
                           </div>
                        </div>
                        <div
                           class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
                           <p id="buttonShadowSpreadCount" class="sc-font-thin sc-roboto sc-universal sc-font-size-11">0px</p>
                          <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                           <span id="buttonshadowSpreadIncrease" class="sc-arrow-placeholder"></span>
                           <span id="buttonshadowSpreadDecrease" class="sc-arrow-placeholder sc-rotate-180"></span>
                         </div>                         

                        </div>
                     </div>
                     <div id="buttonShadowSpreadField" class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6">
                        <div id="buttonShadowSpreadBullet"
                           class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half">
                        </div>
                     </div>

                  </div>
               </div>
         </div>
    `;
}
