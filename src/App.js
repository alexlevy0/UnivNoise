import { CameraShake, OrbitControls, PositionalAudio } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/react'
import { button, useControls } from 'leva'
import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { DragAndDrop } from './DragAndDrop'
import { Particles } from './Particles'
import { generateRandomString, getHashParams } from './utils'

const stateKey = 'spotify_auth_state'

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
        const params = getHashParams()

        const access_token = params.access_token
        const state = params.state
        const storedState = localStorage.getItem(stateKey)

        if (access_token && (state == null || state !== storedState)) {
            console.log(JSON.stringify('Auth Error', null, 2))
        } else {
            localStorage.removeItem(stateKey)
            if (access_token) {
                fetch('https://api.spotify.com/v1/me', {
                    headers: {
                        Authorization: 'Bearer ' + access_token,
                    },
                })
                    .then(response => response.json())
                    .then(data => {
                        console.log(JSON.stringify(data, null, 2))
                    })
                    .catch(error => console.error('Error:', error))
            }
        }
    }, [window.location.hash])

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

    const toggleSpotify = () => {
        const client_id = 'ce27614f87424221978e6c45f359287f'
        const redirect_uri = document.URL
        const state = generateRandomString(16)
        localStorage.setItem(stateKey, state)
        const scope = 'user-read-private user-read-email'
        let url = 'https://accounts.spotify.com/authorize'
        url += '?response_type=token'
        url += '&client_id=' + encodeURIComponent(client_id)
        url += '&scope=' + encodeURIComponent(scope)
        url += '&redirect_uri=' + encodeURIComponent(redirect_uri)
        url += '&state=' + encodeURIComponent(state)
        window.location = url
    }

    const collapsed = { collapsed: true }

    const props = {
        ...useControls(
            ' Music',
            {
                Spotify: button(toggleSpotify),
            },
            { collapsed: false },
        ),
        ...useControls(
            'Frequency',
            {
                'Low Hz': { value: 4, min: 1, max: 8, step: 0.5 },
                Response: { value: 250, min: 1, max: 500, step: 50 },
            },
            collapsed,
        ),
        ...useControls(
            'Visualizer',
            {
                focus: { value: 5.1, min: 3, max: 7, step: 0.01 },
                speed: { value: 30, min: 0.1, max: 100, step: 0.1 },
                aperture: { value: 1, min: 1, max: 5.6, step: 0.1 },
                fov: { value: 50, min: 0, max: 200 },
                // curl: { value: 0.25, min: 0.01, max: 1, step: 0.01 },
            },
            collapsed,
        ),
    }

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
        </>
    )
}
