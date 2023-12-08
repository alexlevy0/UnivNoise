import React, { Suspense, useRef, useEffect } from 'react'
import * as THREE from 'three'
import { PositionalAudio, OrbitControls, CameraShake } from '@react-three/drei'
import { useControls } from 'leva'
import { Particles } from './Particles'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { Analytics } from '@vercel/analytics/react'
import { useFrame } from '@react-three/fiber'

export default function App() {
    const sound = useRef()
    const analyser = useRef()
    const renderRef = useRef()
    const audioMooves = useRef(0.25)

    useEffect(() => {
        // 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768. Defaults to 2048
        return void (analyser.current = new THREE.AudioAnalyser(sound.current, /*32  */ 2048))
    }, [sound])

    useEffect(() => {
        setTimeout(() => {
            console.log('play1', sound.current)
            if (sound.current) {
                console.log('play2')
                sound.current.play()
            }
        }, 3000)
        return () => sound.current.pause()
    }, [])

    const ratioL = 250

    useFrame(() => {
        if (analyser.current && sound.current && renderRef.current) {
            const frequencyData = analyser.current.getFrequencyData().filter(Number)
            const size = frequencyData.length
            if (!size) return

            const part = size / 4
            const lowF = frequencyData.slice(-part)
            const lowV = lowF.reduce((acc, val) => acc + val, 0) / lowF.length
            const lValue = lowV / ratioL
            // console.log('->', lValue)
            renderRef.current.uniforms.audioMooves.value = lValue ? lValue : 0.25
        }
    })

    const props = useControls({
        focus: { value: 5.1, min: 3, max: 7, step: 0.01 },
        speed: { value: 30, min: 0.1, max: 100, step: 0.1 },
        aperture: { value: 1, min: 1, max: 5.6, step: 0.1 },
        fov: { value: 50, min: 0, max: 200 },
        curl: { value: 0.25, min: 0.01, max: 1, step: 0.01 },
    })
    return (
        <>
            <OrbitControls
                makeDefault
                autoRotate
                autoRotateSpeed={0.6}
                zoomSpeed={0.1}
            />
            <CameraShake
                yawFrequency={1}
                maxYaw={0.05}
                pitchFrequency={1}
                maxPitch={0.05}
                rollFrequency={0.5}
                maxRoll={0.5}
                intensity={0.2}
            />
            <Particles
                {...props}
                renderRef={renderRef}
            />
            <PositionalAudio
                url={'sounds/A.mp3'}
                ref={sound}
            />
            <SpeedInsights />
            <Analytics />
        </>
    )
}
