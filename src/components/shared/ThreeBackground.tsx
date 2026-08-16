"use client";
import { useEffect, useRef } from "react";

export default function ThreeBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let animId: number;
    let cleanup: (() => void) | undefined;

    const init = async () => {
      try {
        const THREE = await import("three");
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 4;

        // Star field
        const starCount = 400;
        const starPositions = new Float32Array(starCount * 3);
        const starColors = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
          starPositions[i * 3] = (Math.random() - 0.5) * 20;
          starPositions[i * 3 + 1] = (Math.random() - 0.5) * 20;
          starPositions[i * 3 + 2] = (Math.random() - 0.5) * 10;
          const brightness = 0.5 + Math.random() * 0.5;
          starColors[i * 3] = brightness;
          starColors[i * 3 + 1] = brightness * 0.9;
          starColors[i * 3 + 2] = brightness;
        }
        const starGeo = new THREE.BufferGeometry();
        starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));
        starGeo.setAttribute("color", new THREE.BufferAttribute(starColors, 3));
        const starMat = new THREE.PointsMaterial({ size: 0.025, vertexColors: true, transparent: true, opacity: 0.7 });
        const stars = new THREE.Points(starGeo, starMat);
        scene.add(stars);

        // Floating petal particles
        const petalCount = 120;
        const petalPos = new Float32Array(petalCount * 3);
        const petalColors = new Float32Array(petalCount * 3);
        const palette = [
          new THREE.Color("#C4B5D4"),
          new THREE.Color("#F2D4D4"),
          new THREE.Color("#8B2252"),
          new THREE.Color("#FFF8F0"),
          new THREE.Color("#E8C4D4"),
        ];
        for (let i = 0; i < petalCount; i++) {
          petalPos[i * 3] = (Math.random() - 0.5) * 14;
          petalPos[i * 3 + 1] = (Math.random() - 0.5) * 14;
          petalPos[i * 3 + 2] = (Math.random() - 0.5) * 6;
          const c = palette[Math.floor(Math.random() * palette.length)];
          petalColors[i * 3] = c.r;
          petalColors[i * 3 + 1] = c.g;
          petalColors[i * 3 + 2] = c.b;
        }
        const petalGeo = new THREE.BufferGeometry();
        petalGeo.setAttribute("position", new THREE.BufferAttribute(petalPos, 3));
        petalGeo.setAttribute("color", new THREE.BufferAttribute(petalColors, 3));
        const petalMat = new THREE.PointsMaterial({ size: 0.04, vertexColors: true, transparent: true, opacity: 0.4 });
        const petals = new THREE.Points(petalGeo, petalMat);
        scene.add(petals);

        let t = 0;
        const animate = () => {
          animId = requestAnimationFrame(animate);
          t += 0.002;

          stars.rotation.y = t * 0.03;
          stars.rotation.x = Math.sin(t * 0.1) * 0.02;

          petals.rotation.y = t * 0.05;
          const pp = petalGeo.attributes.position.array as Float32Array;
          for (let i = 0; i < petalCount; i++) {
            pp[i * 3 + 1] += 0.004;
            pp[i * 3] += Math.sin(t + i) * 0.001;
            if (pp[i * 3 + 1] > 7) pp[i * 3 + 1] = -7;
          }
          petalGeo.attributes.position.needsUpdate = true;

          renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
          renderer.setSize(window.innerWidth, window.innerHeight);
          camera.aspect = window.innerWidth / window.innerHeight;
          camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", onResize);

        cleanup = () => {
          cancelAnimationFrame(animId);
          window.removeEventListener("resize", onResize);
          renderer.dispose();
          starGeo.dispose();
          starMat.dispose();
          petalGeo.dispose();
          petalMat.dispose();
        };
      } catch (e) {
        // Graceful fallback if Three.js fails
      }
    };

    init();
    return () => cleanup?.();
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
        opacity: 0.5,
      }}
      aria-hidden="true"
    />
  );
}
