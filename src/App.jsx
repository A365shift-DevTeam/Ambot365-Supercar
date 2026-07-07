import React, { useRef, useState, useLayoutEffect, useEffect } from 'react';
import { useScroll } from 'framer-motion';
import PremiumNavbar from './components/PremiumNavbar';
import FerrariExperience from './components/FerrariExperience';
import { useLenisSmoothScroll } from './hooks/useLenisSmoothScroll';

const FRAME_COUNT = 240;
const currentFrame = (index) => `/frames/${index.toString().padStart(8, '0')}.jpg`;

const Cars = () => {
    const containerRef = useRef(null);
    const canvasRef = useRef(null);
    const imagesRef = useRef([]);
    const lastFrameIndexRef = useRef(-1);
    const canvasLayoutRef = useRef({ width: 0, height: 0, dpr: 1 });
    const [imagesLoaded, setImagesLoaded] = useState(0);
    const renderFrameRef = useRef(null);

    const lenis = useLenisSmoothScroll();
    const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });

    // Preload images
    useEffect(() => {
        if (imagesRef.current.length === FRAME_COUNT) { setImagesLoaded(FRAME_COUNT); return; }
        imagesRef.current = [];
        for (let i = 1; i <= FRAME_COUNT; i++) {
            const img = new Image();
            img.src = currentFrame(i);
            img.onload = () => {
                setImagesLoaded(c => c + 1);
                // Render first frame as soon as it loads
                if (i === 1 && canvasRef.current && renderFrameRef.current) {
                    renderFrameRef.current(0);
                }
            };
            img.onerror = () => setImagesLoaded(c => c + 1);
            imagesRef.current.push(img);
        }
    }, []);

    // Canvas rendering — only redraw when frame index changes (resize forces a refresh)
    useLayoutEffect(() => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');

        const syncCanvasSize = () => {
            const dpr = window.devicePixelRatio || 1;
            const width = window.innerWidth;
            const height = window.innerHeight;
            const layout = canvasLayoutRef.current;

            if (layout.width === width && layout.height === height && layout.dpr === dpr) {
                return layout;
            }

            canvas.width = width * dpr;
            canvas.height = height * dpr;
            canvas.style.width = `${width}px`;
            canvas.style.height = `${height}px`;
            canvasLayoutRef.current = { width, height, dpr };
            return canvasLayoutRef.current;
        };

        const drawFrame = (frameIndex, layout = syncCanvasSize()) => {
            const img = imagesRef.current[frameIndex];
            if (!img?.complete || img.naturalWidth <= 0) return false;

            const { width, height, dpr } = layout;
            context.setTransform(dpr, 0, 0, dpr, 0, 0);
            const hRatio = width / img.width;
            const vRatio = height / img.height;
            const ratio = Math.max(hRatio, vRatio);
            const centerX = (width - img.width * ratio) / 2;
            const centerY = (height - img.height * ratio) / 2;
            context.clearRect(0, 0, width, height);
            context.imageSmoothingEnabled = true;
            context.imageSmoothingQuality = 'high';
            context.drawImage(img, 0, 0, img.width, img.height, centerX, centerY, img.width * ratio, img.height * ratio);
            return true;
        };

        const renderFrame = (progress, force = false) => {
            const frameIndex = Math.min(
                FRAME_COUNT - 1,
                Math.max(0, Math.round(progress * (FRAME_COUNT - 1)))
            );

            if (!force && frameIndex === lastFrameIndexRef.current) return;
            if (drawFrame(frameIndex)) {
                lastFrameIndexRef.current = frameIndex;
            }
        };

        renderFrameRef.current = (progress) => renderFrame(progress);

        const unsub = scrollYProgress.on('change', renderFrame);
        const onResize = () => {
            lastFrameIndexRef.current = -1;
            renderFrame(scrollYProgress.get(), true);
        };

        window.addEventListener('resize', onResize, { passive: true });
        renderFrame(scrollYProgress.get(), true);

        return () => {
            window.removeEventListener('resize', onResize);
            unsub();
        };
    }, [imagesLoaded, scrollYProgress]);

    return (
        <div className="text-white font-sans" style={{ backgroundColor: '#0a0a0a' }}>
            <PremiumNavbar logo="SUPERCAR" links={['Overview','Design','Performance']} ctaText="Configure" lenis={lenis} />
            {imagesLoaded < 20 && (
                <div className="fixed inset-0 z-50 flex items-center justify-center" style={{background:'#0a0a0a'}}>
                    <div className="text-center">
                        <div style={{fontFamily:"'Orbitron',sans-serif",color:'#FFD700',letterSpacing:'0.3em',marginBottom:'2rem'}}>INITIALIZING EXPERIENCE</div>
                        <div className="w-64 h-px mx-auto overflow-hidden" style={{background:'rgba(255,255,255,0.1)'}}>
                            <div className="h-full" style={{width:`${(imagesLoaded/FRAME_COUNT)*100}%`,background:'linear-gradient(90deg,#FFD700,#D4AF37)'}} />
                        </div>
                    </div>
                </div>
            )}
            <section id="overview" ref={containerRef} className="relative" style={{height:'600vh'}}>
                <div className="sticky top-0 h-screen w-full overflow-hidden">
                    <canvas ref={canvasRef} className="absolute inset-0" style={{zIndex:0, filter:'contrast(1.05) saturate(1.1)', imageRendering:'crisp-edges'}} />
                    <FerrariExperience scrollYProgress={scrollYProgress} />
                </div>
            </section>

            {/* POST CONTENT */}
            <section id="design" style={{background:'#050505',padding:'8rem 4rem',zIndex:20,position:'relative'}}>
                <div style={{maxWidth:1400,margin:'0 auto'}}>
                    <h2 style={{fontFamily:"'Orbitron',sans-serif",color:'#FFD700',textAlign:'center',marginBottom:'4rem',letterSpacing:'0.2em'}}>ENGINEERING EXCELLENCE</h2>
                    <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(350px,1fr))',gap:'2rem'}}>
                        
                        <div className="group relative overflow-hidden rounded-xl border border-[rgba(255,215,0,0.1)] aspect-[4/5]">
                            <img src="/images/supercar_engine.png" alt="Powertrain" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 style={{fontFamily:"'Orbitron',sans-serif",color:'#FFD700', fontSize:'1.5rem', marginBottom:'0.5rem'}}>HYBRID POWERTRAIN</h3>
                                <p style={{color:'rgba(255,255,255,0.7)',lineHeight:1.6, fontSize:'0.95rem', opacity:0, transition:'opacity 0.5s ease 0.1s'}} className="group-hover:opacity-100">
                                    Next-generation hybrid engineering delivering unprecedented power and instantaneous torque for pure track dominance.
                                </p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-xl border border-[rgba(255,215,0,0.1)] aspect-[4/5]">
                            <img src="/images/supercar_cockpit.png" alt="Cockpit" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 style={{fontFamily:"'Orbitron',sans-serif",color:'#FFD700', fontSize:'1.5rem', marginBottom:'0.5rem'}}>DRIVER COCKPIT</h3>
                                <p style={{color:'rgba(255,255,255,0.7)',lineHeight:1.6, fontSize:'0.95rem', opacity:0, transition:'opacity 0.5s ease 0.1s'}} className="group-hover:opacity-100">
                                    A luxurious, futuristic digital interface built entirely around the driver, featuring aerospace-grade materials.
                                </p>
                            </div>
                        </div>

                        <div className="group relative overflow-hidden rounded-xl border border-[rgba(255,215,0,0.1)] aspect-[4/5]">
                            <img src="/images/supercar_track.png" alt="Performance" className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-[#050505]/50 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500"></div>
                            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 style={{fontFamily:"'Orbitron',sans-serif",color:'#FFD700', fontSize:'1.5rem', marginBottom:'0.5rem'}}>TRACK PERFORMANCE</h3>
                                <p style={{color:'rgba(255,255,255,0.7)',lineHeight:1.6, fontSize:'0.95rem', opacity:0, transition:'opacity 0.5s ease 0.1s'}} className="group-hover:opacity-100">
                                    Aerodynamic mastery meets relentless speed, producing physics-defying downforce and lateral grip.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </section>

            <footer id="performance" style={{background:'#050505',padding:'3rem 4rem',borderTop:'1px solid rgba(255,215,0,0.1)',textAlign:'center'}}>
                <p style={{fontFamily:"'Rajdhani',sans-serif",color:'rgba(255,255,255,0.3)',letterSpacing:'0.2em'}}>© SUPERCAR MOTORS</p>
            </footer>
        </div>
    );
};
export default Cars;
