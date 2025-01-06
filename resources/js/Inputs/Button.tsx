type ButtonProps = {
    text: string;
    color?: 'default' | 'red';
    icon?: string;
    isLeft?: boolean;
    onClick?: () => void;
};

export function Button({text, color = 'default', onClick}: ButtonProps) {
    return (
        <button
            className="
                bg-light-default-bottom px-6 py-2.5
                text-custom-gray-400 font-bold

                rounded-full border-t border-b-2 border-t-custom-gray-700 border-b-custom-gray-800
                shadow-button-default

                hover:text-custom-pink-50 hover:bg-bright-default-bottom
                hover:shadow-button-default-hover hover:border-t-white hover:border-b-custom-purple-600

                transition-colors duration-500
            "
            onClick={onClick}>
            {text}
        </button>
    );
}
