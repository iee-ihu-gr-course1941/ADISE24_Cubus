import { PageProps } from '@/types';
import { animate, motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { MouseEvent, useRef } from 'react';

const PRE_DELAY = 0.5;

export default function Welcome({
}: PageProps<{ laravelVersion: string; phpVersion: string }>) {
    return (
        <>
            <div className='relative flex justify-center items-center flex-col gap-8 pt-8 bg-gradient-to-r from-[#6a3093] to-[#a044ff] h-lvh overflow-hidden'>
                <h1 className='absolute font-black text-black/25 text-[32vw] lg:text-[24vw] leading-[22rem] tracking-tighter flex flex-col w-full'>
                    <motion.span
                        className='[--start-pos:0vw]'
                        animate={{ x: 'var(--start-pos)', opacity: 1 }} initial={{ x: 'calc(var(--start-pos) - 5vw)', opacity: 0 }} transition={{ ease: 'easeOut', duration: 2, delay: PRE_DELAY + 0 }}>
                        Card
                    </motion.span>
                    <motion.span
                        className='[--start-pos:7.5vw] lg:[--start-pos:20vw]'
                        animate={{ x: 'var(--start-pos)', opacity: 1 }} initial={{ x: 'calc(var(--start-pos) - 5vw)', opacity: 0 }} transition={{ ease: 'easeOut', duration: 2, delay: PRE_DELAY + 0.2 }}>
                        Hover
                    </motion.span>
                    <motion.span
                        className='[--start-pos:15vw] lg:[--start-pos:40vw]'
                        animate={{ x: 'var(--start-pos)', opacity: 1 }} initial={{ x: 'calc(var(--start-pos) - 5vw)', opacity: 0 }} transition={{ ease: 'easeOut', duration: 2, delay: PRE_DELAY + 0.4 }}>
                        Demo
                    </motion.span>
                </h1>

                <motion.div animate={{ opacity: 1 }} initial={{ opacity: 0 }} transition={{ duration: 0.5, delay: PRE_DELAY + 0.8 }}>
                    <Card />
                </motion.div>
            </div>

        </>
    );
}

type MouseCoords = {
    x: number,
    y: number,
};

const CARD_MAXIMUM_XTILT = 20;
const CARD_MAXIMUM_YTILT = 20;

function Card() {
    const refText = useRef<HTMLParagraphElement>(null);

    const flipped = useMotionValue(0);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const mouseXSpring = useSpring(mouseX, { stiffness: 100, damping: 10 });
    const mouseYSpring = useSpring(mouseY, { stiffness: 100, damping: 10 });

    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [-1 * CARD_MAXIMUM_XTILT, CARD_MAXIMUM_XTILT]);
    const rotateYNoFlip = useTransform(mouseXSpring, [-0.5, 0.5], [CARD_MAXIMUM_YTILT, -1 * CARD_MAXIMUM_YTILT]);
    const rotateY = useTransform(() => rotateYNoFlip.get() + flipped.get());

    function onHover(event: MouseEvent<HTMLDivElement>) {
        refText.current!.innerText = 'Tap me ^.^';

        if(event.buttons === 1) {
            stopTilt();
            return;
        }
        tilt(event.currentTarget.getBoundingClientRect(), {x: event.clientX, y: event.clientY});
    }

    function tilt(cardRect: DOMRect, mouseCoords: MouseCoords) {
        mouseX.set((mouseCoords.x - cardRect.x) / cardRect.width - 0.5);
        mouseY.set((mouseCoords.y - cardRect.y) / cardRect.height - 0.5);
    }

    function stopTilt() {
        mouseX.set(0);
        mouseY.set(0);
    }

    function flipCard() {
        const flipTo = flipped.get() <= 90 ? 180 : 0;
        animate(flipped, flipTo, { type: 'spring', stiffness: 100, duration: 0.5 });
    }

    return (
        <motion.div
            className='
                relative w-[200px] h-[280px] rounded-2xl
                bg-slate-300 shadow-2xl
            '
            style={{ transformStyle: 'preserve-3d', rotateX, rotateY, transformPerspective: '400px' }}
            whileHover={{ scale: 1.1 }}
            initial={{ scale: 1 }}
            onMouseDown={flipCard}
            onMouseMove={onHover}
            onMouseLeave={stopTilt}>
            <div
                className='absolute grid place-items-center inset-2 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-xl overflow-hidden'
                style={{ transformStyle: 'preserve-3d', transform: 'translateZ(5px)' }}>
                <motion.div
                    className='
                    absolute inset-0 [transform:translateZ(30px)] mix-blend-lighten
                    bg-gradient-to-br via-50% to-70% from-black/0 via-white/80 to-white/65
                    opacity-0
                    '
                    style={{ transformStyle: 'preserve-3d', opacity: mouseYSpring }}>
                </motion.div>
                <p ref={refText} className='font-black text-lg'>Hover me ^-^</p>
            </div>

            <div
                className='absolute inset-0 grid place-items-center bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-2xl overflow-hidden'
                style={{ transformStyle: 'preserve-3d', transform: 'translateZ(-1px) rotateY(180deg)' }}>
                <p className='font-black text-lg'>Back Side</p>
            </div>
        </motion.div>
    );
}
