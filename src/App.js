import { CameraShake, OrbitControls, PositionalAudio } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Bloom, EffectComposer } from '@react-three/postprocessing'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { useControls } from 'leva'
// import { GlitchMode } from 'postprocessing'
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { DragAndDrop } from './DragAndDrop'
import { Particles } from './Particles'

export default function App() {
    const sound = useRef()
    const analyser = useRef()
    const renderRef = useRef()
    const [link, setLink] = useState('')

    useEffect(
        () =>
            void (analyser.current = new THREE.AudioAnalyser(
                sound.current,
                2048,
            )),
        [sound],
    )

    useEffect(() => {
        console.log('pasted or dropped :', link)
        // setLink('')
    }, [link])

    useEffect(() => {
        document.addEventListener('paste', e => {
            if (e.clipboardData.types.indexOf('text/plain') === -1) return
            e.preventDefault()
            const link = e.clipboardData.getData('text/plain')
            if (!link) return
            setLink(link)
        })
        setTimeout(() => {
            if (!sound.current) return
            sound.current.play()
        }, 3000)
        return () => sound.current.pause()
    }, [])

    useFrame(() => {
        if (!analyser.current || !sound.current || !renderRef.current) return
        const frequencyData = analyser.current.getFrequencyData().filter(Number)
        const size = frequencyData.length
        if (!size) return
        const part = size / (props.Hz || 4)
        const lowF = frequencyData.slice(-part)
        const lowV = lowF.reduce((ac, v) => ac + v, 0) / lowF.length
        const lValue = lowV / (props.tuner || 250)
        renderRef.current.uniforms.audioMooves.value = lValue ? lValue : 0.25
    })

    const props = useControls(
        ' ',
        {
            focus: { value: 5.1, min: 3, max: 7, step: 0.01 },
            speed: { value: 30, min: 0.1, max: 100, step: 0.1 },
            aperture: { value: 1, min: 1, max: 5.6, step: 0.1 },
            fov: { value: 50, min: 0, max: 200 },
            // curl: { value: 0.25, min: 0.01, max: 1, step: 0.01 },
            'Low Hz': { value: 4, min: 1, max: 8, step: 0.5 },
            Response: { value: 250, min: 1, max: 500, step: 50 },
        },
        {
            collapsed: true,
        },
    )

    const renderEffect = true

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
                url={'sounds/topdown.mp3'}
                ref={sound}
            />
            <DragAndDrop setLink={setLink} />
            <SpeedInsights />
            <Analytics />
            {renderEffect && (
                <EffectComposer>
                    <Bloom
                        luminanceThreshold={0.01}
                        // luminanceThreshold={0.9}
                        // luminanceSmoothing={1}
                        luminanceSmoothing={0.01}
                    />
                    {/* <Glitch
                    delay={[1.5, 3.5]} // min and max glitch delay
                    duration={[0.6, 1.0]} // min and max glitch duration
                    strength={[0.3, 1.0]} // min and max glitch strength
                    mode={GlitchMode.SPORADIC} // glitch mode
                    active // turn on/off the effect (switches between "mode" prop and GlitchMode.DISABLED)
                    ratio={0.85} // Threshold for strong glitches, 0 - no weak glitches, 1 - no strong glitches.
                /> */}
                </EffectComposer>
            )}
        </>
    )
}
