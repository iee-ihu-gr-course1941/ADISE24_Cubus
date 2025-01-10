type PortraitProps = {
    url?: string;
    isTiny?: boolean;
    outlineColor?: 'purple' | 'blue' | 'red' | 'green' | 'yellow';
};

export function Portrait({url, isTiny, outlineColor }: PortraitProps) {
    const imgSize = !isTiny ? 'w-[128px] h-[128px]' : 'w-[32px] h-[32px]';

    let borderTopColor = 'to-custom-magenta-400';
    switch(outlineColor) {
        case 'blue':
            borderTopColor = 'to-cyan-400';
            break;
        case 'red':
            borderTopColor = 'to-red-400';
            break;
        case 'green':
            borderTopColor = 'to-green-400';
            break;
        case 'yellow':
            borderTopColor = 'to-yellow-300';
            break;
    }

    return (
        <div className={`
            rounded-[25px] w-fit ${ !isTiny ? 'p-2.5' : 'p-1'}

            border-t border-b-2 border-t-custom-gray-700 border-b-custom-gray-800
            bg-light-default-bottom
            `}>
            <div className={`p-[1px] bg-gradient-to-t from-custom-purple-600 ${borderTopColor} rounded-[21px]`}>
                <div className={`${imgSize} rounded-[20px]`}>
                    { url && <img src={url} className={`${imgSize} rounded-[20px]`} /> }
                </div>
            </div>
        </div>
    );
}
