import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const PremiumNavbar = ({ logo = "BRAND", links = ['Overview', 'Features', 'Gallery'], ctaText = "Contact", lenis }) => {
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        if (lenis) {
            const onScroll = (instance) => {
                const scrolled = instance.scroll > 50;
                setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));
            };
            onScroll(lenis);
            return lenis.on('scroll', onScroll);
        }

        const onNativeScroll = () => {
            const scrolled = window.scrollY > 50;
            setIsScrolled((prev) => (prev === scrolled ? prev : scrolled));
        };
        onNativeScroll();
        window.addEventListener('scroll', onNativeScroll, { passive: true });
        return () => window.removeEventListener('scroll', onNativeScroll);
    }, [lenis]);
    return (
        <motion.nav initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} style={{position:'fixed',top:0,left:0,width:'100%',display:'flex',justifyContent:'space-between',alignItems:'center',padding:isScrolled?'1.2rem 4rem':'2rem 4rem',zIndex:100,color:'#fff',background:isScrolled?'rgba(5,8,7,0.6)':'transparent',backdropFilter:isScrolled?'blur(15px)':'none',borderBottom:isScrolled?'1px solid rgba(255,255,255,0.05)':'none'}}>
            <div style={{fontFamily:"'Orbitron',sans-serif",fontSize:'1.5rem',letterSpacing:'0.1em',fontWeight:600}}>{logo}</div>
            <div style={{display:'flex',gap:'3rem'}}>{links.map(l => <a key={l} href={'#'+l.toLowerCase()} style={{color:'rgba(255,255,255,0.7)',fontSize:'0.9rem',textTransform:'uppercase',letterSpacing:'0.15em'}}>{l}</a>)}</div>
            <button style={{background:'transparent',border:'1px solid rgba(255,215,0,0.9)',color:'#FFD700',padding:'0.8rem 2rem',fontFamily:"'Rajdhani',sans-serif",textTransform:'uppercase',letterSpacing:'0.1em',fontSize:'0.8rem',cursor:'pointer'}}>{ctaText}</button>
        </motion.nav>
    );
};
export default PremiumNavbar;