import { Icon, SVG } from "@/Icons/SVG";

type ButtonProps = {
    text?: string;
    color?: 'default' | 'red';
    icon?: Icon;
    isLeft?: boolean;
    onClick?: () => void;
};

export function Button({text = '', color = 'default', icon, isLeft = false, onClick}: ButtonProps) {
    let colors = `bg-light-default-bottom hover:bg-bright-default-bottom
        shadow-button-default hover:shadow-button-default-hover
        border-t-custom-gray-700 border-b-custom-gray-800 hover:border-t-white hover:border-b-custom-purple-600`;
    if(color === 'red') {
        colors = `bg-light-red-bottom hover:bg-bright-red-bottom
            shadow-button-red hover:shadow-button-red-hover
            border-t-custom-gray-700 border-b-custom-gray-800 hover:border-t-white hover:border-b-custom-brown-600`;
    }

    return (
        <button
            className={`
                group
                flex gap-1.5 items-center
                w-fit ${ text.length === 0 ? 'px-4' : 'px-6'} ${ text.length === 0 ? 'py-4' : 'py-2.5' }

                text-custom-gray-400 font-bold
                rounded-full border-t border-b-2

                hover:text-custom-pink-50

                transition-colors duration-200

                ${colors}
            `}
            onClick={onClick}>
            { isLeft && icon && <SVG icon={icon} fill="fill-custom-gray-400 group-hover:fill-custom-pink-50" /> }
            { text }
            { !isLeft && icon && <SVG icon={icon} fill="fill-custom-gray-400 group-hover:fill-custom-pink-50" /> }
        </button>
    );
}
