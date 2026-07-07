import { useEffect, useState } from 'react';
import Lenis from 'lenis';
import { frame } from 'framer-motion';

const LENIS_EASING = (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t));

export function useLenisSmoothScroll() {
    const [lenis, setLenis] = useState(null);

    useEffect(() => {
        const instance = new Lenis({
            duration: 1.45,
            easing: LENIS_EASING,
            orientation: 'vertical',
            smoothWheel: true,
            syncTouch: false,
            touchMultiplier: 1,
            anchors: {
                offset: 0,
                duration: 1.2,
            },
        });

        setLenis(instance);

        const syncScrollAnimations = () => frame.update();
        const unsubscribe = instance.on('scroll', syncScrollAnimations);

        let rafId;
        const raf = (time) => {
            instance.raf(time);
            rafId = requestAnimationFrame(raf);
        };
        rafId = requestAnimationFrame(raf);

        return () => {
            unsubscribe();
            cancelAnimationFrame(rafId);
            instance.destroy();
            setLenis(null);
        };
    }, []);

    return lenis;
}