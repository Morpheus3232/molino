"use client";

import { useEffect, useRef, useState, memo } from "react";
import { createPortal } from "react-dom";
import { Renderer, Camera, Geometry, Program, Mesh, Vec3 } from "ogl";

interface GrainientProps {
  color1?: string;
  color2?: string;
  color3?: string;
  timeSpeed?: number;
  contrast?: number;
  grainAmount?: number;
  grainScale?: number;
  zoom?: number;
  warpAmplitude?: number;
  warpFrequency?: number;
  blendSoftness?: number;
}

const DEFAULTS = {
  color1: "#EADCC4",
  color2: "#F5EDE0",
  color3: "#D4BE90",
  timeSpeed: 0.12,
  contrast: 1.15,
  grainAmount: 0.06,
  grainScale: 2.5,
  zoom: 1.3,
  warpAmplitude: 35,
  warpFrequency: 4,
  blendSoftness: 0.08,
};

function hexToVec3(hex: string): [number, number, number] {
  const c = hex.replace("#", "");
  return [
    parseInt(c.substring(0, 2), 16) / 255,
    parseInt(c.substring(2, 4), 16) / 255,
    parseInt(c.substring(4, 6), 16) / 255,
  ];
}

const VERT = `#ifdef GL_ES
precision highp float;
#endif
attribute vec2 position;
attribute vec2 uv;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 0.0, 1.0);
}`;

const NOISE = `
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+10.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy) );
  vec3 x0 = v - i + dot(i, C.xxx) ;
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min( g.xyz, l.zxy );
  vec3 i2 = max( g.xyz, l.zxy );
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute( permute( permute(
    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
  + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
  + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_ );
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4( x.xy, y.xy );
  vec4 b1 = vec4( x.zw, y.zw );
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
  vec3 p0 = vec3(a0.xy,h.x);
  vec3 p1 = vec3(a0.zw,h.y);
  vec3 p2 = vec3(a1.xy,h.z);
  vec3 p3 = vec3(a1.zw,h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x;
  p1 *= norm.y;
  p2 *= norm.z;
  p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
}`;

const FRAG = `#ifdef GL_ES
precision highp float;
#endif
varying vec2 vUv;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uTime;
uniform float uContrast;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uZoom;
uniform float uWarpAmplitude;
uniform float uWarpFrequency;
uniform float uBlendSoftness;

${NOISE}

void main() {
  vec2 uv = (vUv - 0.5) * uZoom + 0.5;

  float t = uTime * 0.08;

  float n1 = snoise(vec3(uv * uWarpFrequency * 0.45, t));
  float n2 = snoise(vec3(uv * uWarpFrequency * 0.6 + 0.5, t * 1.3));
  float n3 = snoise(vec3(uv * uWarpFrequency * 0.8 + 1.0, t * 0.8));

  vec2 warp = vec2(n1 * 0.6 + n2 * 0.3, n2 * 0.5 + n3 * 0.4) * uWarpAmplitude * 0.004;
  uv += warp;

  float m1 = uv.x * 0.55 + uv.y * 0.45;
  vec3 grad1 = mix(uColor1, uColor2, smoothstep(0.0, 0.5 + uBlendSoftness, m1));
  vec3 col = mix(grad1, uColor3, smoothstep(0.45 - uBlendSoftness, 1.0, 1.0 - m1));

  float wave = sin(uv.x * 2.5 + t * 0.5) * 0.06 + cos(uv.y * 2.0 + t * 0.4) * 0.04;
  col += wave * (uColor1 - uColor2) * 0.08;

  col = clamp((col - 0.5) * uContrast + 0.5, 0.0, 1.0);

  vec2 grainUv = gl_FragCoord.xy * uGrainScale;
  float grain = fract(sin(dot(grainUv + uTime * 20.0, vec2(12.9898, 78.233))) * 43758.5453);
  col += (grain - 0.5) * uGrainAmount;

  gl_FragColor = vec4(col, 1.0);
}`;

function Grainient({
  color1 = DEFAULTS.color1,
  color2 = DEFAULTS.color2,
  color3 = DEFAULTS.color3,
  timeSpeed = DEFAULTS.timeSpeed,
  contrast = DEFAULTS.contrast,
  grainAmount = DEFAULTS.grainAmount,
  grainScale = DEFAULTS.grainScale,
  zoom = DEFAULTS.zoom,
  warpAmplitude = DEFAULTS.warpAmplitude,
  warpFrequency = DEFAULTS.warpFrequency,
  blendSoftness = DEFAULTS.blendSoftness,
}: GrainientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    let animationId: number;

    if (!canvas.getContext("webgl") && !canvas.getContext("webgl2")) {
      console.warn("Grainient: WebGL not available");
      return;
    }

    try {
      const renderer = new Renderer({
        canvas,
        dpr: Math.min(window.devicePixelRatio, 2),
        alpha: false,
        webgl: 1,
      });

      const gl = renderer.gl;

      const geometry = new Geometry(gl, {
        position: { size: 2, data: new Float32Array([-1, -1, 1, -1, 1, 1, -1, 1]) },
        uv: { size: 2, data: new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]) },
        index: { data: new Uint16Array([0, 1, 2, 0, 2, 3]) },
      });

      const [r1, g1, b1] = hexToVec3(color1);
      const [r2, g2, b2] = hexToVec3(color2);
      const [r3, g3, b3] = hexToVec3(color3);

      const program = new Program(gl, {
        vertex: VERT,
        fragment: FRAG,
        uniforms: {
          uColor1: { value: new Vec3(r1, g1, b1) },
          uColor2: { value: new Vec3(r2, g2, b2) },
          uColor3: { value: new Vec3(r3, g3, b3) },
          uTime: { value: 0 },
          uContrast: { value: contrast },
          uGrainAmount: { value: grainAmount },
          uGrainScale: { value: grainScale },
          uZoom: { value: zoom },
          uWarpAmplitude: { value: warpAmplitude },
          uWarpFrequency: { value: warpFrequency },
          uBlendSoftness: { value: blendSoftness },
        },
      });

      const mesh = new Mesh(gl, { geometry, program });

      const camera = new Camera(gl, { near: 0.1, far: 10 });
      camera.position.z = 1;
      camera.orthographic({ left: -1, right: 1, bottom: -1, top: 1 });

      const setSize = () => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        if (w > 0 && h > 0) {
          renderer.setSize(w, h);
        }
      };
      setSize();

      const observer = new ResizeObserver(setSize);
      observer.observe(document.body);

      const start = performance.now();
      const animate = () => {
        program.uniforms.uTime.value = (performance.now() - start) * 0.001 * timeSpeed;
        renderer.render({ scene: mesh, camera });
        animationId = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        cancelAnimationFrame(animationId);
        observer.disconnect();
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    } catch (err) {
      console.warn("Grainient: failed to initialize", err);
    }
  }, [mounted, color1, color2, color3, timeSpeed, contrast, grainAmount, grainScale, zoom, warpAmplitude, warpFrequency, blendSoftness]);

  if (!mounted) return null;

  return createPortal(
    <div className="fixed inset-0 z-[-1]" aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>,
    document.body
  );
}

export default memo(Grainient);
