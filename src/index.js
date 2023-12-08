import * as THREE from 'three'
import { render, events, extend } from '@react-three/fiber'
import './styles.css'
import App from './App'

extend(THREE)

const canvas = document.querySelector('canvas')

addEventListener('resize', () =>
    render(<App />, canvas, {
        events,
        linear: true,
        camera: { fov: 25, position: [0, 0, 6] },
        gl: new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
        }),
    }),
)

setTimeout(() => dispatchEvent(new Event('resize')), 0)
