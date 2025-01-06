type ButtonProps = {
    text: string;
    color?: 'default' | 'red';
    icon?: string;
    isLeft?: boolean;
    onClick?: () => void;
};

export function Button({text, color = 'default', onClick}: ButtonProps) {
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
                w-fit
                px-6 py-2.5
                text-custom-gray-400 font-bold
                rounded-full border-t border-b-2

                hover:text-custom-pink-50

                transition-colors duration-200

                ${colors}
            `}
            onClick={onClick}>
            {text}
        </button>
    );
}
