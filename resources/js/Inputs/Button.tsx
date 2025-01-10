import { AudioManager } from "@/AudioManager";
import { Icon, SVG } from "@/Icons/SVG";

type ButtonProps = {
    text?: string;
    color?: 'default' | 'red';
    icon?: Icon;
    isLeft?: boolean;

    blocked?: boolean;
    className?: string;

    onClick?: () => void;
};

export function Button({text = '', color = 'default', icon, isLeft = false, blocked = false, className, onClick}: ButtonProps) {
    const AudioInterface = AudioManager.getInstance();

    function onMouseEnter() {
        AudioInterface.play('hover', false);
    }

    function onMouseClick() {
        AudioInterface.play('click', false);
        if(onClick) onClick();
    }

    let colors = `bg-light-default-bottom shadow-button-default
        ${blocked ? '' : 'hover:bg-bright-default-bottom hover:shadow-button-default-hover'}
        border-t-custom-gray-700 border-b-custom-purple-500
        ${blocked ? '' : 'hover:border-t-purple-300 hover:border-b-custom-purple-600'}`;
    if(color === 'red') {
        colors = `bg-light-red-bottom shadow-button-red
            ${blocked ? '' : 'hover:bg-bright-red-bottom hover:shadow-button-red-hover' }
            border-t-custom-gray-700 border-b-custom-gray-800
            ${blocked ? '' : 'hover:border-purple-300 hover:border-b-custom-brown-600' }`;
    }

    const Icon = () => icon != null ? <SVG icon={icon} fill={`fill-custom-gray-400 ${blocked ? '' : 'group-hover:fill-custom-pink-50'}`} /> : <></>;
    return (
        <button
            className={`
                group
                relative
                flex gap-1.5 items-center
                w-fit ${ text.length === 0 ? 'px-[1.125rem]' : 'px-6'} ${ text.length === 0 ? 'py-4' : 'py-2.5' }

                text-custom-gray-400 font-bold
                rounded-full border-t border-b-2

                ${blocked ? '' : 'hover:text-custom-pink-50'}

                transition-colors duration-200

                ${blocked ? 'cursor-not-allowed' : 'cursor-pointer'}

                ${colors}

                after:contents-['']
                after:absolute after:inset-0 after:pointer-events-auto

                ${className}
            `}
            onMouseEnter={onMouseEnter}
            onClick={onMouseClick}>
            { isLeft && <Icon /> }
            { text }
            { !isLeft && <Icon /> }
        </button>
    );
}
