export function WidgetImageHoverState() {
  return `
    <div id="image-hover-state" class="sc-hidden sc-mt-2 sc-px-2">
              <div
                id="image-hover-border"
                class="sc-bg-3f3f3f sc-mt-3 sc-relative sc-z-9999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-rounded-4px"
              >
                <p class="sc-roboto sc-universal sc-font-size-14">Border</p>
                <img
                  id="image-hover-border-arrow"
                  src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                  class="sc-rotate-180"
                  alt=""
                />
              </div>
              <div id="image-hover-border-section" class="sc-mt-2">
                <div class="sc-flex sc-items-center sc-justify-between">
                  <div class="sc-flex sc-gap-2 sc-items-center">
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                    >
                      Border
                    </p>
                    <div
                      id="image-hover-border-reset"
                      class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg sc-bg-454545"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                        width="10"
                        alt="reset"
                      />
                    </div>
                  </div>
                  <div
                    class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545"
                  >
                    <p
                      id="image-hover-BorderCount"
                      class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                    >
                      0px
                    </p>
                    <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                      <span
                        id="image-hover-BorderIncrease"
                        class="sc-arrow-placeholder"
                      ></span>
                      <span
                        id="image-hover-BorderDecrease"
                        class="sc-arrow-placeholder sc-rotate-180"
                      ></span>
                    </div>
                  </div>
                </div>
  
                <div
                  id="image-hover-BorderField"
                  class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                >
                  <div
                    id="image-hover-BorderFill"
                    class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                  ></div>
                  <div
                    id="image-hover-BorderBullet"
                    class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                  ></div>
                </div>
                <div class="sc-grid sc-grid-cols-12 sc-mt-2">
                  <div></div>
                  <div
                    style="padding: 2px 0px"
                    class="sc-bg-3f3f3f sc-flex sc-col-span-11 sc-font-size-12 sc-font-thin sc-border sc-border-solid sc-border-3f3f3f sc-justify-center sc-px-1 sc-rounded-4px"
                  >
                    <div
                      id="image-hover-BorderAll"
                      class="sc-flex sc-px-1_5 sc-bg-454545 sc-justify-center sc-w-full sc-cursor-pointer sc-py-4px sc-rounded-4px sc-items-center sc-gap-1"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/all.svg"
                        loading="lazy"
                        alt="all-border"
                      />
                      <p class="sc-font-thin sc-roboto sc-universal">All</p>
                    </div>
                    <div
                      id="image-hover-BorderTop"
                      class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-4px sc-rounded-4px sc-items-center sc-gap-1"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/top.svg"
                        loading="lazy"
                        alt="top-border"
                      />
                      <p class="sc-font-thin sc-roboto sc-universal">Top</p>
                    </div>
                    <div
                      id="image-hover-BorderBottom"
                      class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-4px sc-rounded-4px sc-items-center sc-gap-1"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/bottom.svg"
                        loading="lazy"
                        alt="bottom-border"
                      />
                      <p class="sc-font-thin sc-roboto sc-universal">Bottom</p>
                    </div>
                    <div
                      id="image-hover-BorderLeft"
                      class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-4px sc-rounded-4px sc-items-center sc-gap-1"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/left.svg"
                        loading="lazy"
                        alt="left-border"
                      />
                      <p class="sc-font-thin sc-roboto sc-universal">Left</p>
                    </div>
                    <div
                      id="image-hover-BorderRight"
                      class="sc-flex sc-px-1_5 sc-justify-center sc-w-full sc-cursor-pointer sc-py-4px sc-rounded-4px sc-items-center sc-gap-1"
                    >
                      <img
                        src="https://fatin-webefo.github.io/squareCraft-plugin/public/right.svg"
                        loading="lazy"
                        alt="right-border"
                      />
                      <p class="sc-font-thin sc-roboto sc-universal">Right</p>
                    </div>
                  </div>
                </div>
  
                <div class="sc-mt-4 sc-gap-2 sc-grid sc-grid-cols-12">
                  <div class="sc-col-span-5">
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                    >
                      Border Color
                    </p>
  
                    <div
                      class="sc-py-4px sc-relative sc-mt-2 sc-bg-3f3f3f sc-inActiveTab-border sc-flex sc-justify-between sc-items-center sc-px-1 sc-rounded-4px"
                    >
                      <p
                        class="sc-font-size-12 sc-roboto sc-font-light sc-universal"
                      >
                        Select
                      </p>
                      <div class="sc-square-6 sc-cursor-pointer"></div>
  
                      <div
                        id="image-chover-color-palette"
                        class="sc-absolute sc-hidden sc-border sc-border-solid sc-border-EF7C2F sc-top-12 sc-bg-3f3f3f sc-left-0 sc-p-1 sc-rounded-4px"
                      >
                        <div class="sc-color-arrow"></div>
                        <div class="sc-flex sc-items-center sc-justify-between">
                          <div
                            id="border-colors"
                            class="sc-flex sc-relative sc-items-center sc-gap-1"
                          ></div>
  
                          <div
                            class="sc-rounded-15px sc-px-2 sc-cursor-pointer sc-py-4px sc-bg-454545 sc-flex sc-gap-1"
                          >
                            <p class="sc-universal sc-font-size-11 sc-roboto">
                              RGB
                            </p>
                            <span ="sc-arrow-placeholder sc-rotate-180"></span>
                          </div>
                        </div>
  
                        <div class="sc-h-1px sc-mt-2 sc-bg-color-gray"></div>
                        <div
                          class="sc-flex color-h-selection sc-mt-2 sc-items-center sc-gap-2"
                        >
                          <div id="color-selection-field" class="sc-relative">
                            <div
                              id="color-selection-bar"
                              class="sc-w-2 sc-h-2 sc-absolute sc-cursor-pointer sc-rounded-full sc-border sc-border-solid sc-border-white"
                            ></div>
                          </div>
                          <div
                            id="color-transparency-field"
                            class="sc-h-full sc-w-3 sc-relative sc-rounded-15px"
                          >
                            <div
                              id="color-transparency-bar"
                              class="sc-absolute sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2"
                            ></div>
                          </div>
                          <div
                            id="all-color-selction-field"
                            class="sc-h-full sc-w-3 sc-relative sc-rounded-15px">
                            <div
                              id="all-color-selction-bar"
                              class="sc-absolute sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2"
                            ></div>
                          </div>
                        </div>
                        <div
                          class="sc-flex sc-justify-between sc-mt-2 sc-px-2 sc-py-0_5 sc-rounded-4px sc-bg-454545"
                        >
                          <p
                            id="image-hover-color-code"
                            class="sc-font-size-12 sc-roboto sc-font-light sc-universal"
                          >
                            Select
                          </p>
                          <p
                            id="color-transparency-count"
                            class="sc-font-size-12 sc-roboto sc-font-light sc-universal"
                          >
                            100%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="sc-col-span-7">
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                    >
                      Border Style
                    </p>
                    <div
                      style="padding: 2px 0px"
                      class="sc-bg-3f3f3f sc-flex sc-font-size-11 sc-gap-1 sc-mt-2 sc-rounded-4px sc-border sc-border-solid sc-border-3f3f3f sc-justify-between sc-px-1"
                    >
                      <div
                        id="image-hover-BorderTypeSolid"
                        class="sc-py-4px sc-bg-454545 sc-w-full sc-rounded-4px"
                      >
                        <p
                          class="sc-font-thin sc-roboto sc-text-center sc-universal sc-cursor-pointer"
                        >
                          Solid
                        </p>
                      </div>
  
                      <div
                        id="image-hover-BorderTypeDashed"
                        class="sc-py-4px sc-w-full sc-rounded-4px"
                      >
                        <p
                          class="sc-font-thin sc-roboto sc-text-center sc-universal sc-cursor-pointer"
                        >
                          Dashed
                        </p>
                      </div>
                      <div
                        id="image-hover-BorderTypeDotted"
                        class="sc-py-4px sc-w-full sc-rounded-4px"
                      >
                        <p
                          class="sc-font-thin sc-roboto sc-text-center sc-universal sc-cursor-pointer sc-rounded-4px"
                        >
                          Dotted
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
  
                <div class="sc-mt-3">
                  <div class="sc-flex sc-items-center sc-justify-between">
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                      >
                        Border radius
                      </p>
                      <div
                        id="border-radius-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg sc-bg-454545"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545"
                    >
                      <p
                        id="image-hover-BorderradiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="image-hover-BorderradiusIncrease"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="image-hover-BorderradiusDecrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="image-hover-BorderradiusField"
                    class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="image-hover-BorderradiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="image-hover-BorderradiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
              </div>
  
              <div
                id="image-hover-filter"
                class="sc-bg-3f3f3f sc-mt-3 sc-relative sc-z-9999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-rounded-4px"
              >
                <p class="sc-roboto sc-universal sc-font-size-14">Filter</p>
                <img
                  id="image-hover-filter-arrow"
                  src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                  class="sc-rotate-180"
                  alt=""
                />
              </div>
              <div id="image-hover-filter-section" class="sc-hidden">
                <div class="sc-mt-3">
                  <div class="sc-flex sc-items-center sc-justify-between">
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                      >
                        Blur
                      </p>
                      <div
                        id="image-hover-filter-blur-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg sc-bg-454545"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545"
                    >
                      <p
                        id="image-hover-filter-blur-Count"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="image-hover-filter-blur-Increase"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="image-hover-filter-blur-Decrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="image-hover-filter-blur-Field"
                    class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="image-hover-filter-blur-Fill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="image-hover-filter-blur-Bullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-mt-3">
                  <div class="sc-flex sc-items-center sc-justify-between">
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                      >
                        Brightness
                      </p>
                      <div
                        id="border-radius-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg sc-bg-454545"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545"
                    >
                      <p
                        id="image-hover-filter-brightness-BorderradiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="image-hover-filter-brightness-BorderradiusIncrease"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="image-hover-filter-brightness-BorderradiusDecrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="image-hover-filter-brightness-BorderradiusField"
                    class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="image-hover-filter-brightness-BorderradiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="image-hover-filter-brightness-BorderradiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-mt-3">
                  <div class="sc-flex sc-items-center sc-justify-between">
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                      >
                        Contrast
                      </p>
                      <div
                        id="border-radius-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg sc-bg-454545"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545"
                    >
                      <p
                        id="image-hover-filter-contrast-BorderradiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="image-hover-filter-contrast-BorderradiusIncrease"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="image-hover-filter-contrast-BorderradiusDecrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="image-hover-filter-contrast-BorderradiusField"
                    class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="image-hover-filter-contrast-BorderradiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="image-hover-filter-contrast-BorderradiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-mt-3">
                  <div class="sc-flex sc-items-center sc-justify-between">
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                      >
                        Saturation
                      </p>
                      <div
                        id="border-radius-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg sc-bg-454545"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545"
                    >
                      <p
                        id="image-hover-filter-saturation-BorderradiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="image-hover-filter-saturation-BorderradiusIncrease"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="image-hover-filter-saturation-BorderradiusDecrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="image-hover-filter-saturation-BorderradiusField"
                    class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="image-hover-filter-saturation-BorderradiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="image-hover-filter-saturation-BorderradiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
                <div class="sc-mt-3">
                  <div class="sc-flex sc-items-center sc-justify-between">
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                      >
                        Saturation
                      </p>
                      <div
                        id="border-radius-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg sc-bg-454545"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545"
                    >
                      <p
                        id="image-hover-filter-saturation-BorderradiusCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="image-hover-filter-saturation-BorderradiusIncrease"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="image-hover-filter-saturation-BorderradiusDecrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="image-hover-filter-saturation-BorderradiusField"
                    class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="image-hover-filter-saturation-BorderradiusFill"
                      class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"
                    ></div>
                    <div
                      id="image-hover-filter-saturation-BorderradiusBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
              </div>
  
              <div
                id="image-hover-overLayButton"
                class="sc-bg-3f3f3f sc-mt-3 sc-px-2 sc-relative sc-z-99999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-2 sc-rounded-4px"
              >
                <h5 class="sc-roboto sc-font-size-14 sc-universal sc-font-thin">
                  Overlay
                </h5>
                <img
                  id="image-hover-overlay-arrow"
                  src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                  class="sc-rotate-180"
                  alt=""
                />
              </div>
  
              <div id="Image-hover-overLaySection" class="sc-mt-5 sc-hidden">
                <div class="sc-flex sc-gap-2 sc-items-center">
                  <p
                    class="sc-roboto sc-font-thin sc-universal sc-text-sm sc-font-thin sc-text-gray-300"
                  >
                    Overlay
                  </p>
                  <div
                    class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-full sc-rounded-10px sc-gap-1 sc-p-1_5 sc-bg sc-bg-454545 sc-gradiant-border"
                  >
                    <img
                      src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                      width="10"
                      alt="reset"
                    />
                  </div>
                </div>
  
                <div class="sc-mt-3 sc-gap-2 sc-flex">
                  <div id="Image-hover-backgorundColor" class=" ">
                    <p
                      class="sc-font-size-11 sc-font-thin sc-mt-4 sc-universal sc-text-gray-300 sc-roboto"
                    >
                      Color
                    </p>
                    <div class="sc-col-span-5 sc-mt-2 sc-z-99999 sc-relative">
                      <div
                        class="sc-flex sc-w-30 sc-justify-between sc-items-center sc-px-1 sc-bg-3f3f3f sc-inActiveTab-border sc-rounded-4px sc-py-4px"
                      >
                        <p
                          id="Image-hover-buttonFontColorCode"
                          class="sc-font-size-12 sc-roboto sc-universal"
                        >
                          Select
                        </p>
                        <div
                          id="Image-hover-overLayFontColorPalate"
                          class="sc-square-6 sc-border-colors sc-cursor-pointer"
                        ></div>
                      </div>
                      <div
                        id="Image-hover-overlay-color-palette"
                        class="sc-absolute sc-z-99999 sc-border sc-hidden sc-border-solid sc-border-EF7C2F sc-top-12 sc-bg-3f3f3f sc-left-0 sc-p-1_5 sc-rounded-4px"
                      >
                        <div class="sc-button-fontcolor-arrow"></div>
                        <div class="sc-flex sc-items-center sc-justify-between">
                          <div
                            id="Image-hover-overlay-border-colors"
                            class="sc-flex sc-relative sc-items-center sc-gap-1"
                          ></div>
                          <div
                            class="sc-rounded-15px sc-px-1_5 sc-py-0_5 sc-bg-454545 sc-flex sc-gap-1"
                          >
                            <p class="sc-universal sc-font-size-11 sc-roboto">
                              RGB
                            </p>
                            <span
                              class="sc-arrow-placeholder sc-rotate-180"
                            ></span>
                          </div>
                        </div>
                        <div class="sc-h-1px sc-mt-2 sc-bg-color-gray"></div>
                        <div
                          class="sc-flex color-h-selection sc-mt-2 sc-items-center sc-gap-2"
                        >
                          <div
                            id="Image-hover-overlay-color-selection-field"
                            class="sc-relative"
                          >
                            <div
                              id="Image-hover-overlay-color-selection-bar"
                              class="sc-w-2 sc-h-2 sc-absolute sc-cursor-pointer sc-rounded-full sc-border sc-border-solid sc-border-white"
                            ></div>
                          </div>
                          <div
                            id="Image-hover-overlay-button-color-transparency-field"
                            class="sc-h-full sc-w-3 sc-relative sc-rounded-15px"
                          >
                            <div
                              id="Image-hover-overlay-button-color-transparency-bar"
                              class="sc-absolute sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2"
                            ></div>
                          </div>
                          <div
                            id="Image-hover-overlay-button-all-color-selection-field"
                            class="sc-h-full sc-w-3 sc-relative sc-rounded-15px"
                          >
                            <div
                              id="Image-hover-overlay-button-all-color-selection-bar"
                              class="sc-absolute sc-w-5 sc-left-half sc-shadow-sm sc-rounded-15px sc-cursor-grabbing sc-h-2 sc-bg-color-f2f2f2"
                            ></div>
                          </div>
                        </div>
                        <div
                          class="sc-flex sc-justify-between sc-mt-2 sc-px-2 sc-py-0_5 sc-rounded-4px sc-bg-454545"
                        >
                          <p
                            id="Image-hover-overlay-button-color-code"
                            class="sc-font-size-12 sc-roboto sc-font-light sc-universal"
                          >
                            Select
                          </p>
                          <p
                            id="Image-hover-overlay-button-color-transparency-count"
                            class="sc-font-size-12 sc-roboto sc-font-light sc-universal"
                          >
                            100%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
  
                  <div class="">
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-text-sm sc-font-thin sc-text-gray-300"
                    >
                      Width
                    </p>
                    <div class="sc-flex sc-mt-2 sc-items-center">
                      <div class="sc-bg-3f3f3f sc-py-1 sc-rounded-l sc-px-2">
                        <p
                          id="Image-hover-overlayWidthValue"
                          class="sc-universal sc-roboto sc-text-sm"
                        >
                          100%
                        </p>
                      </div>
                      <div
                        id="Image-hover-overlayWidthControl"
                        style="padding-top: 8.5px; padding-bottom: 8.5px"
                        class="sc-bg-454545 sc-px-2_5"
                      >
                        <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                          <span
                            class="sc-arrow-placeholder overlay-arrow-up"
                          ></span>
                          <span
                            class="sc-arrow-placeholder overlay-arrow-down sc-rotate-180"
                          ></span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div class="">
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-text-sm sc-font-thin sc-text-gray-300"
                    >
                      Height
                    </p>
                    <div class="sc-flex sc-mt-2 sc-items-center">
                      <div class="sc-bg-3f3f3f sc-py-1 sc-rounded-l sc-px-2">
                        <p
                          id="Image-hover-overlayHeightValue"
                          class="sc-universal sc-roboto sc-text-sm"
                        >
                          100%
                        </p>
                      </div>
                      <div
                        id="Image-hover-overlayHeightControl"
                        style="padding-top: 8.5px; padding-bottom: 8.5px"
                        class="sc-bg-454545 sc-px-2_5"
                      >
                        <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                          <span
                            class="sc-arrow-placeholder overlay-arrow-up"
                          ></span>
                          <span
                            class="sc-arrow-placeholder overlay-arrow-down sc-rotate-180"
                          ></span>
                        </div>
                      </div>
                    </div>
                    <div></div>
                  </div>
                </div>
                <div class="sc-mt-4">
                  <div>
                    <p
                      class="sc-roboto sc-font-thin sc-universal sc-text-sm sc-font-thin sc-text-gray-300"
                    >
                      Position
                    </p>
                  </div>
                </div>
  
                <div class="sc-flex sc-mt-3 sc-items-center sc-gap-3">
                  <div class="sc-w-full">
                    <div
                      class="sc-flex sc-gap-2 sc-items-center sc-justify-between"
                    >
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-text-sm sc-font-thin sc-text-gray-300"
                      >
                        (X Axis)
                      </p>
                      <div
                        class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545"
                      >
                        <p
                          class="sc-font-thin sc-roboto sc-universal sc-text-xs"
                          id="Image-hover-xAxisValue"
                        >
                          0px
                        </p>
                        <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                          <span class="sc-arrow-placeholder"></span>
                          <span class="sc-arrow-placeholder sc-rotate-180"></span>
                        </div>
                      </div>
                    </div>
                    <div
                      id="Image-hover-xAxisSlider"
                      class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6"
                    >
                      <div
                        id="Image-hover-xAxisBullet"
                        class="sc-custom-overlay-bullet sc-absolute sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half sc-bg-color-EF7C2F"
                      ></div>
                    </div>
                  </div>
                  <div class="sc-w-full">
                    <div
                      class="sc-flex sc-gap-2 sc-items-center sc-justify-between"
                    >
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-text-sm sc-font-thin sc-text-gray-300"
                      >
                        (Y Axis)
                      </p>
                      <div
                        class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545"
                      >
                        <p
                          class="sc-font-thin sc-roboto sc-universal sc-text-xs"
                          id="Image-hover-yAxisValue"
                        >
                          0px
                        </p>
                        <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                          <span class="sc-arrow-placeholder"></span>
                          <span class="sc-arrow-placeholder sc-rotate-180"></span>
                        </div>
                      </div>
                    </div>
  
                    <div
                      id="Image-hover-yAxisSlider"
                      class="sc-rounded-15px sc-relative sc-mt-2 sc-w-full sc-h-2 sc-bg-F6F6F6"
                    >
                      <div
                        id="Image-hover-yAxisBullet"
                        class="sc-custom-overlay-bullet sc-absolute sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half sc-bg-color-EF7C2F"
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                id="image-hover-shadowsButton"
                class="sc-bg-3f3f3f sc-mt-3 sc-relative sc-z-9999 sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-rounded-4px"
              >
                <p class="sc-roboto sc-universal sc-font-size-14">Shadow</p>
                <img
                  id="image-hover-button-shadow-arrow"
                  src="https://fatin-webefo.github.io/squareCraft-plugin/public/arrow.svg"
                  class="sc-rotate-180"
                  alt=""
                />
              </div>
              <div id="image-hover-shadowsSection" class="sc-hidden">
                <div class="sc-flex sc-gap-2 sc-items-center sc-mt-2">
                  <p
                    class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                  >
                    Shadow
                  </p>
                  <div
                    id="image-hover-shadow-axis-reset"
                    class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg sc-bg-454545"
                  >
                    <img
                      src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                      width="10"
                      alt="reset"
                    />
                  </div>
                </div>
                <div class="mt-2 sc-flex sc-mt-3 sc-items-center sc-gap-3">
                  <div class="sc-w-full">
                    <div
                      class="sc-flex sc-gap-2 sc-items-center sc-justify-between"
                    >
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                      >
                        (X Axis)
                      </p>
                      <div
                        class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545"
                      >
                        <p
                          id="image-hover-buttonShadowXaxisCount"
                          class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                        >
                          0px
                        </p>
                        <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                          <span
                            id="image-hover-buttonshadowXIncrease"
                            class="sc-arrow-placeholder"
                          ></span>
                          <span
                            id="image-hover-buttonshadowXDecrease"
                            class="sc-arrow-placeholder sc-rotate-180"
                          ></span>
                        </div>
                      </div>
                    </div>
                    <div
                      id="image-hover-buttonShadowXaxisField"
                      class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6"
                    >
                      <div
                        id="image-hover-buttonShadowXaxisBullet"
                        class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                      ></div>
                    </div>
                  </div>
                  <div class="sc-w-full">
                    <div
                      class="sc-flex sc-gap-2 sc-items-center sc-justify-between"
                    >
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                      >
                        (Y Axis)
                      </p>
                      <div
                        class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545"
                      >
                        <p
                          id="image-hover-ShadowYaxisCount"
                          class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                        >
                          0px
                        </p>
                        <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                          <span
                            id="image-hover-shadowYIncrease"
                            class="sc-arrow-placeholder"
                          ></span>
                          <span
                            id="image-hover-shadowYDecrease"
                            class="sc-arrow-placeholder sc-rotate-180"
                          ></span>
                        </div>
                      </div>
                    </div>
                    <div
                      id="image-hover-ShadowYaxisField"
                      class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6"
                    >
                      <div
                        id="image-hover-ShadowYaxisBullet"
                        class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                      ></div>
                    </div>
                  </div>
                </div>
  
                <div class="sc-mt-4">
                  <p
                    class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                  >
                    Color
                  </p>
                  <div class="sc-flex sc-mt-2">
                    <div
                      class="sc-py-0_5 sc-bg-3f3f3f sc-flex sc-gap-5 sc-items-center sc-px-1_5 sc-rounded-4px"
                    >
                      <p
                        class="sc-font-size-12 sc-roboto c-font-light sc-universal"
                      >
                        #363544
                      </p>
                      <div class="sc-square-6 sc-cursor-pointer"></div>
                    </div>
                  </div>
                </div>
                <div class="sc-mt-4">
                  <div class="sc-flex sc-items-center sc-justify-between">
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                      >
                        Blur
                      </p>
                      <div
                        id="shadow-blur-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg sc-bg-454545"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545"
                    >
                      <p
                        id="image-hover-ShadowBlurCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="image-hover-shadowBlurIncrease"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="image-hover-shadowBlurDecrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="image-hover-ShadowBlurField"
                    class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="image-hover-ShadowBlurBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
  
                <div class="sc-mt-4">
                  <div class="sc-flex sc-items-center sc-justify-between">
                    <div class="sc-flex sc-gap-2 sc-items-center">
                      <p
                        class="sc-roboto sc-font-thin sc-universal sc-font-size-12 sc-font-thin sc-text-gray-300"
                      >
                        Spread
                      </p>
                      <div
                        id="shadow-spread-reset"
                        class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5 sc-bg sc-bg-454545"
                      >
                        <img
                          src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg"
                          width="10"
                          alt="reset"
                        />
                      </div>
                    </div>
                    <div
                      class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545"
                    >
                      <p
                        id="image-hover-ShadowSpreadCount"
                        class="sc-font-thin sc-roboto sc-universal sc-font-size-11"
                      >
                        0px
                      </p>
                      <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                        <span
                          id="image-hover-shadowSpreadIncrease"
                          class="sc-arrow-placeholder"
                        ></span>
                        <span
                          id="image-hover-shadowSpreadDecrease"
                          class="sc-arrow-placeholder sc-rotate-180"
                        ></span>
                      </div>
                    </div>
                  </div>
                  <div
                    id="image-hover-ShadowSpreadField"
                    class="sc-rounded-15px sc-mt-2 sc-relative sc-w-full sc-h-2 sc-bg-F6F6F6"
                  >
                    <div
                      id="image-hover-ShadowSpreadBullet"
                      class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half"
                    ></div>
                  </div>
                </div>
  
              </div>
              <div id="hover-image-effects"
              class="sc-bg-3f3f3f sc-mt-3 sc-relative sc-items-center sc-flex sc-border-hover-3d3d3d sc-border sc-border-solid sc-border-3f3f3f sc-cursor-pointer sc-px-2 sc-justify-between sc-py-1 sc-rounded-4px">
              <p class="sc-roboto  sc-universal sc-font-size-14">Image Effect</p>
             <span id="hover-image-effects-effects-arrow" class="sc-arrow-placeholder sc-rotate-180 sc-w-10 sc-flex sc-items-center sc-justify-center"></span>
           </div>
   
          <div id="hover-image-effects-section" class="sc-mt-4 sc-hidden">
           <div class="sc-flex sc-items-center sc-gap-8px"> 
              <div >
              <p class="sc-universal sc-roboto sc-font-size-12">Transition Type</p>
   
              <div class="sc-flex sc-mt-2 sc-relative sc-items-center">
                 <div  class="sc-bg-3f3f3f sc-relative sc-py-1 sc-rounded-l sc-px-2 sc-w-16">
                 <p id="hover-image-effects-TransitionTypeLabel" class="sc-universal sc-roboto sc-font-size-12">None</p>
                 </div>   
              
                 <div id="hover-image-effects-TransitionDropdown" class="sc-absolute sc-rounded-4px sc-hidden sc-border sc-border-solid sc-border-EF7C2F   sc-left-0 sc-top-[35px] sc-z-99999">
                 <div class="sc-bg-3f3f3f sc-py-1 sc-font-size-12 sc-px-2 sc-w-16  sc-bg-colo-EF7C2F-hover  sc-cursor-pointer" data-value="none">None</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="linear">Linear</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="ease-in">ease-in</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="ease-out">ease-out</div>
                 </div>
              
                 <div id="hover-image-effects-TransitionTypeSelect" class="sc-bg-454545 sc-cursor-pointer sc-px-2_5 sc-py-0_5px">
                 <div class="sc-flex sc-flex-col sc-items-center sc-gap-2">
                    <span class="sc-arrow-placeholder"></span>
                    <span class="sc-arrow-placeholder sc-rotate-180"></span>
                 </div>
                 </div>
              </div>
           </div>
              <div id="hover-image-effects-EffectDurationSection">
              <p class="sc-universal sc-roboto sc-font-size-12">Duration(ms)</p>
   
              <div class="sc-flex sc-mt-2 sc-z-[99999] sc-relative sc-items-center">
                 <div  class="sc-bg-3f3f3f sc-relative sc-py-1 sc-rounded-l sc-px-2 sc-w-toogle">
                 <p id="hover-image-effects-DurationLabel" class="sc-universal sc-roboto sc-font-size-12">None</p>
                 </div>   
              
                 <div id="hover-image-effects-DurationDropdown" class="sc-absolute sc-rounded-4px sc-hidden sc-border sc-border-solid sc-border-EF7C2F sc-h-dropdown sc-scrollBar  sc-left-0 sc-top-[35px] sc-z-[99999]">
                 <div class="sc-bg-3f3f3f sc-py-1 sc-font-size-12 sc-px-2 sc-w-toogle  sc-bg-colo-EF7C2F-hover  sc-cursor-pointer" data-value="none">None</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-toogle sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="100">100</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-toogle sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="300">300</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-toogle sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="500">500</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-toogle sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="700">700</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-toogle sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="1000">1000</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-toogle sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="1200">1200</div>
                 </div>
              
                 <div id="hover-image-effects-DurationSelect" class="sc-bg-454545 sc-cursor-pointer sc-px-2_5 sc-py-0_5px">
                 <div class="sc-flex sc-flex-col sc-items-center sc-gap-2">
                    <span class="sc-arrow-placeholder"></span>
                    <span class="sc-arrow-placeholder sc-rotate-180"></span>
                 </div>
                 </div>
              </div>
           </div>
              <div id="hover-image-effects-EffectDelaySection">
              <p class="sc-universal sc-roboto sc-font-size-12">Delay(ms)</p>
   
              <div class="sc-flex sc-mt-2 sc-relative sc-items-center">
                 <div  class="sc-bg-3f3f3f sc-relative sc-py-1 sc-rounded-l sc-px-2 sc-w-toogle">
                 <p id="hover-image-effects-DelayLabel" class="sc-universal sc-roboto sc-font-size-12">None</p>
                 </div>   
              
                 <div id="hover-image-effects-DelayDropdown" class="sc-absolute sc-rounded-4px sc-hidden sc-border sc-border-solid sc-border-EF7C2F sc-h-dropdown sc-scrollBar  sc-left-0 sc-top-[35px] sc-z-50">
                 <div class="sc-bg-3f3f3f sc-py-1 sc-font-size-12 sc-px-2 sc-w-toogle sc-bg-colo-EF7C2F-hover  sc-cursor-pointer" data-value="none">None</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-toogle sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="100">100</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-toogle sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="300">300</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-toogle sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="500">500</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-toogle sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="700">700</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-toogle sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="1000">1000</div>
                 <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-toogle sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="1200">1200</div>
                 </div>
              
                 <div id="hover-image-effects-DelayTypeSelect" class="sc-bg-454545 sc-cursor-pointer sc-px-2_5 sc-py-0_5px">
                 <div class="sc-flex sc-flex-col sc-items-center sc-gap-2">
                  <span class="sc-arrow-placeholder"></span>
                  <span class="sc-arrow-placeholder sc-rotate-180"></span>
                 </div>
                 </div>
              </div>
           </div>
        </div>
        <div id="hover-image-effects-section" class="sc-mt-3 sc-z-[99999]">
           <p class="sc-universal sc-roboto sc-font-size-12">Transform</p>
   
           <div class="sc-flex sc-mt-2 sc-relative sc-items-center sc-z-[99999]">
              <div  class="sc-bg-3f3f3f sc-relative sc-py-1 sc-rounded-l sc-px-2 sc-w-16">
              <p id="hover-image-effects-TransformTypeLabel" class="sc-universal sc-roboto sc-font-size-12">None</p>
              </div>   
           
              <div id="hover-image-effects-TransformDropdown" class="sc-absolute sc-rounded-4px sc-hidden sc-border sc-border-solid sc-h-dropdown sc-scrollBar sc-border-EF7C2F   sc-left-0 sc-top-[35px] sc-z-[99999]">
              <div class="sc-bg-3f3f3f sc-py-1 sc-font-size-12 sc-px-2 sc-w-16 sc-bg-colo-EF7C2F-hover  sc-cursor-pointer" data-value="none">None</div>
              <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="TranslateX">TranslateX</div>
              <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="TranslateY">TranslateY</div>
              <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="RotateX">RotateX</div>
              <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="RotateY">RotateY</div>
              <div class="sc-bg-3f3f3f sc-py-1 sc-px-2 sc-font-size-12 sc-w-16 sc-cursor-pointer sc-bg-colo-EF7C2F-hover" data-value="Scale">Scale</div>
              </div>
           
              <div id="hover-image-effects-TransformTypeSelect" class="sc-bg-454545 sc-cursor-pointer sc-px-2_5 sc-py-0_5px">
              <div class="sc-flex sc-flex-col sc-items-center sc-gap-2">
                 <span class="sc-arrow-placeholder"></span>
                 <span class="sc-arrow-placeholder sc-rotate-180"></span>
              </div>
              </div>
           </div>
        </div>
        <div class=" sc-mt-3 sc-flex sc-items-center sc-justify-between">
           <div class="sc-flex sc-gap-2 sc-items-center">
              <p class="sc-roboto sc-font-thin sc-universal  sc-font-size-12 sc-font-thin sc-text-gray-300"> Transform Position
              </p>
              <div
                 class="sc-flex sc-cursor-pointer sc-gradiant-border sc-items-center sc-rounded-15px sc-gap-1 sc-p-1_5  sc-bg sc-bg-454545">
   
                 <img src="https://fatin-webefo.github.io/squareCraft-plugin/public/reset.svg" width="10"
                    alt="reset">
              </div>
           </div>
           <div
              class="sc-flex sc-cursor-pointer sc-items-center sc-rounded-15px sc-gap-2 sc-px-2 sc-py-0_5 sc-bg sc-bg-454545">
              <p id="hover-image-effects-TransformPositionCount" class="sc-font-thin sc-roboto sc-universal sc-font-size-11">0px</p>
              <div class="sc-flex sc-flex-col sc-items-center sc-gap-1">
                <span id="hover-image-effects-TransformPositionIncrease" class="sc-arrow-placeholder"></span>
                <span id="hover-image-effects-TransformPositionDecrease" class="sc-arrow-placeholder sc-rotate-180"></span>
              </div>
           </div>
        </div>
        <div id="hover-image-effects-TransformPositionField" class="sc-rounded-15px sc-relative sc-mt-3 sc-w-full sc-h-2 sc-bg-F6F6F6">
           <div id="hover-image-effects-TransformPositionFill" class="sc-absolute sc-bg-color-EF7C2F sc-h-2 sc-rounded-l-full"></div>
           <div id="hover-image-effects-TransformPositionBullet"
              class="sc-absolute sc-bg-color-EF7C2F sc-w-3 sc-h-3 sc-rounded-full sc-cursor-pointer sc-top-half">
           </div>
        </div>
          </div>
            </div>
      `;
}
