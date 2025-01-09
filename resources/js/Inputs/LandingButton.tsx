import { Icon, SVG } from "@/Icons/SVG";
import { useRef } from "react";

type ButtonProps = {
    text: string;
    onClick?: () => void;
};

export function LandingButton({text = '', onClick}: ButtonProps) {
    let refButtonContainer = useRef<HTMLDivElement>(null);

    function onClickCallback() {
        if(refButtonContainer.current != null) {
            refButtonContainer.current.setAttribute('data-stick', 'stick');
        }

        if(onClick) onClick();
    }

    return (
        <div ref={refButtonContainer} className="
            group rounded-full

            relative overflow-clip
            pt-[1px] hover:pt-[2pt] data-[stick='stick']:pt-[2pt] pb-[2px]

            bg-gradient-to-b
            from-custom-gray-700 hover:from-custom-purple-300 data-[stick='stick']:from-custom-purple-300
            to-custom-gray-800 hover:to-custom-purple-500 data-[stick='stick']:to-custom-purple-500

            shadow-button-landing hover:shadow-button-landing-hover data-[stick='stick']:shadow-button-landing-hover

            after:content-[''] after:pointer-events-none
            after:absolute after:z-10
            after:w-[10px] after:h-[10px]

            hover:after:bg-white data-[stick='stick']:after:bg-white
            hover:after:shadow-button-landing-edge-glow data-[stick='stick']:after:shadow-button-landing-edge-glow
            hover:after:animate-landing-glow data-[stick='stick']:after:animate-landing-glow

            transition-all
            ">
            <button
                className={`
                    relative
                    z-20

                    flex gap-2 hover:gap-2.5 group-data-[stick='stick']:gap-2.5 items-center
                    w-fit px-10 py-5

                    text-2xl hover:text-[1.75rem] group-data-[stick='stick']:text-[1.75rem] text-custom-gray-400 font-bold
                    rounded-full

                    hover:text-custom-pink-50 group-data-[stick='stick']:text-custom-pink-50

                    bg-light-default-bottom
                    hover:bg-bright-default-bottom

                    group-data-[stick='stick']:bg-bright-default-bottom
                    group-data-[stick='stick']:border-t-custom-purple-300 group-data-[stick='stick']:border-b-custom-purple-600

                    transition-all duration-200
                    cursor-pointer
                `}
                onClick={onClickCallback}>
                <div className="relative w-8 h-8 group-hover:w-10 group-hover:h-10 group-data-[stick='stick']:w-10 group-data-[stick='stick']:h-10">
                    <SVG icon={Icon.star} className="
                        absolute top-[10%] left-[15%] w-[6px] h-[6px]
                        group-hover:w-[7px] group-hover:h-[7px]
                        group-data-[stick='stick']:w-[7px] group-data-[stick='stick']:h-[7px]

                        fill-custom-gray-400 group-hover:fill-custom-magenta-450
                        group-hover:animate-landing-star-small group-data-[stick='stick']:animate-landing-star-small" />
                    <SVG icon={Icon.star} className="
                        absolute top-1/2 left-[60%] -translate-x-1/2 -translate-y-1/2 w-[20px] h-[20px]
                        group-hover:w-[24px] group-hover:h-[24px]
                        group-data-[stick='stick']:w-[24px] group-data-[stick='stick']:h-[24px]

                        fill-custom-gray-400 group-hover:fill-custom-pink-50
                        group-hover:animate-landing-star-big group-data-[stick='stick']:animate-landing-star-big" />
                    <SVG icon={Icon.star} className="
                        absolute top-2/3 left-[15%] -translate-x-1/2 w-[11px] h-[11px]
                        group-hover:w-[13px] group-hover:h-[13px]
                        group-data-[stick='stick']:w-[13px] group-data-[stick='stick']:h-[13px]

                        fill-custom-gray-400 group-hover:fill-custom-magenta-450
                        group-hover:animate-landing-star-medium group-data-[stick='stick']:animate-landing-star-medium" />
                </div>
                { text }
            </button>
        </div>
    );
}
