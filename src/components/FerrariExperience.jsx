import React from 'react';
import { motion, useTransform } from 'framer-motion';
const FerrariExperience = ({ scrollYProgress }) => {
    const heroOpacity = useTransform(scrollYProgress, [0, 0.25, 0.33], [1, 1, 0]);
    const designOpacity = useTransform(scrollYProgress, [0.28, 0.35, 0.60, 0.66], [0, 1, 1, 0]);
    const engineOpacity = useTransform(scrollYProgress, [0.60, 0.68, 1], [0, 1, 1]);
    const progressWidth = useTransform(scrollYProgress, [0, 1], ['0%', '100%']);
    return (
        <div className="fixed inset-0 pointer-events-none" style={{zIndex:10}}>

            {/* Simplified other phases for brevity - core scroll canvas is in App */}
            <div className="absolute bottom-8 left-12 right-12">
                <div style={{height:1,background:'rgba(255,255,255,0.1)',position:'relative'}}>
                    <motion.div style={{width:progressWidth,height:'100%',background:'linear-gradient(90deg,#FFD700,#D4AF37)'}} />
                </div>
            </div>
        </div>
    );
};
export default FerrariExperience;