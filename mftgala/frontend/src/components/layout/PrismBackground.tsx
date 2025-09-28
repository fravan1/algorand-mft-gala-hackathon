"use client"

import Prism from "../ui/Prism"

export default function PrismBackground() {
    return(
        <div style={{
                position: 'fixed', 
                top: 0,            
                left: 0,           
                width: '100vw',    
                height: '100vh',   
                zIndex: -1,        
                pointerEvents: 'none',
                overflow: 'hidden' 
            }}>
            <Prism
                animationType="rotate"
                timeScale={0.5}
                height={3.5}
                baseWidth={4.5}
                scale={3.6}
                hueShift={0}
                colorFrequency={1}
                noise={0}
                glow={1}
            />
        </div>
    )
}