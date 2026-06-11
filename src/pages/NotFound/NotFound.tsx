import "./index.css"

export default function Notfound() {
  return (
    <section className="w-full h-screen flex items-center justify-center">
      <div className="flex items-center justify-center w-[30em] h-[30em] text-[1.4rem]">
        <div className="flex flex-col items-center justify-center mt-[5em]">

          {/* Antenna */}
          <div className="antenna w-[5em] h-[5em] rounded-full border-2 border-black bg-[#f27405] mb-[-6em] ml-0 z-[-1]">
            <div className="antenna_shadow absolute bg-transparent w-[50px] h-[56px] ml-[1.68em] rounded-[45%] rotate-140 border-4 border-transparent"></div>
            <div className="a1"></div>
            <div className="a1d relative top-[-211%] left-[-35%] rotate-45 w-[0.5em] h-[0.5em] rounded-full border-2 border-black bg-[#979797] z-99"></div>
            <div className="a2"></div>
            <div className="a2d relative top-[-294%] left-[94%] w-[0.5em] h-[0.5em] rounded-full border-2 border-black bg-[#979797] z-99"></div>
          </div>

          {/* TV body */}
          <div className="tv w-[17em] h-[9em] mt-[3em] rounded-[15px] bg-[#d36604] flex justify-center border-2 border-[#1d0e01]">

            {/* Corner curve SVG */}
            <div className="cruve">
              <svg
                className="curve_svg absolute mt-[0.25em] ml-[-0.25em] h-[12px] w-[12px]"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 189.929 189.929"
                xmlSpace="preserve"
              >
                <path d="M70.343,70.343c-30.554,30.553-44.806,72.7-39.102,115.635l-29.738,3.951C-5.442,137.659,11.917,86.34,49.129,49.13 C86.34,11.918,137.664-5.445,189.928,1.502l-3.95,29.738C143.041,25.54,100.895,39.789,70.343,70.343z"></path>
              </svg>
            </div>

            {/* Screen */}
            <div className="display_div flex items-center self-center justify-center rounded-[15px]">
              <div className="screen_out w-auto h-auto rounded-[10px]">
                <div className="screen_out1 w-[11em] h-[7.75em] flex items-center justify-center rounded-[10px]">
                  <div className="screen">
                    <span className="bg-black px-[0.3em] text-[0.75em] text-white tracking-normal rounded-[5px] z-10">NOT FOUND</span>
                  </div>
                  <div className="screenM">
                    <span className="bg-black px-[0.3em] text-[0.75em] text-white tracking-normal rounded-[5px] z-10">NOT FOUND</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom lines */}
            <div className="lines flex gap-[0.1em] self-end">
              <div className="w-[2px] h-[0.5em] bg-black rounded-t-[25px] mt-[0.5em]"></div>
              <div className="grow w-[2px] h-[1em] bg-black rounded-t-[25px]"></div>
              <div className="w-[2px] h-[0.5em] bg-black rounded-t-[25px] mt-[0.5em]"></div>
            </div>

            {/* Side buttons */}
            <div className="buttons_div w-[4.25em] self-center h-[8em] bg-[#e69635] border-2 border-[#1d0e01] p-[0.6em] rounded-[10px] flex items-center justify-center flex-col gap-y-[0.75em]">
              <div className="b1 w-[1.65em] h-[1.65em] rounded-full bg-[#7f5934] border-2 border-black"><div></div></div>
              <div className="b2 w-[1.65em] h-[1.65em] rounded-full bg-[#7f5934] border-2 border-black"></div>
              <div className="speakers flex flex-col gap-y-[0.5em]">
                <div className="g1 flex gap-x-[0.25em]">
                  <div className="g11 w-[0.65em] h-[0.65em] rounded-full bg-[#7f5934] border-2 border-black"></div>
                  <div className="g12 w-[0.65em] h-[0.65em] rounded-full bg-[#7f5934] border-2 border-black"></div>
                  <div className="g13 w-[0.65em] h-[0.65em] rounded-full bg-[#7f5934] border-2 border-black"></div>
                </div>
                <div className="g h-[2px] bg-[#171717]"></div>
                <div className="g h-[2px] bg-[#171717]"></div>
              </div>
            </div>
          </div>

          {/* Stand */}
          <div className="bottom w-full flex items-center justify-center gap-x-[8.7em]">
            <div className="h-[1em] w-[2em] border-2 border-[#171717] bg-[#4d4d4d] mt-[-0.15em] z-[-1]"></div>
            <div className="h-[1em] w-[2em] border-2 border-[#171717] bg-[#4d4d4d] mt-[-0.15em] z-[-1]"></div>
            <div className="absolute h-[0.15em] w-[17.5em] bg-[#171717] mt-[0.8em]"></div>
          </div>
        </div>

        {/* 404 text behind */}
        <div className="text_404 text-title absolute flex flex-row gap-x-[6em] z-[-5] mb-[3em] items-center justify-center opacity-50">
          <div className="text_4041">4</div>
          <div className="text_4042">0</div>
          <div className="text_4043">4</div>
        </div>
      </div>
    </section>
  );
}
