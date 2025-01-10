type CheckBoxProps = {
    value: string;
    name: string;
    label?: string;
    checked?: boolean;
    onClick?: (event: React.MouseEvent<HTMLInputElement>) => void;
};

export function Checkbox({
    value,
    name,
    label = '',
    checked,
    onClick,
}: CheckBoxProps) {
    return (
        <div className="w-fit flex gap-3 items-center">
            <div className="relative">
                <input
                    type="checkbox"
                    id={name + '-' + value}
                    value={value}
                    name={name}
                    defaultChecked={checked}
                    className="peer w-[40px] h-[40px] absolute top-0 left-0 z-10 opacity-0 cursor-pointer"
                    onClick={onClick}
                />
                <button
                    className="
                flex gap-1.5 items-center
                w-fit px-1 py-1

                text-custom-gray-400 font-bold
                rounded-full border-t border-b-2

                peer-checked:text-custom-pink-50

                bg-light-default-bottom peer-checked:bg-bright-default-bottom
                shadow-button-default peer-checked:shadow-button-default-hover
                border-t-custom-gray-700 border-b-custom-gray-800 peer-checked:border-t-white peer-checked:border-b-custom-purple-600

                transition-colors duration-200

                after:contents-[''] after:inset-4 after:p-4 after:rounded-full after:bg-radio-default-inner not:peer-checked:after:opacity-100 peer-checked:after:opacity-0
                "></button>
            </div>
            {label.length !== 0 && (
                <label
                    className="font-bold text-custom-gray-400 cursor-pointer"
                    htmlFor={name + '-' + value}>
                    {label}
                </label>
            )}
        </div>
    );
}
