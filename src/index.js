import { events, extend, render } from '@react-three/fiber'
import * as THREE from 'three'
import App from './App'
import './styles.css'

extend(THREE)

const canvas = document.querySelector('canvas')

const gl = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
})

addEventListener('resize', () =>
    render(<App />, canvas, {
        events,
        linear: true,
        camera: { fov: 25, position: [0, 0, 6] },
        gl,
    }),
)

setTimeout(() => dispatchEvent(new Event('resize')), 0)
