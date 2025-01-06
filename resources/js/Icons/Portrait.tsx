type PortraitProps = {
    url: string;
};

export function Portrait({url}: PortraitProps) {
    return (
        <div className="
            rounded-[25px] w-fit p-2

            border-t border-b-2 border-t-custom-gray-700 border-b-custom-gray-800
            bg-light-default-bottom
            ">
            <img src={url} className="w-[128px] h-[128px] rounded-[20px]" />
        </div>
    );
}
