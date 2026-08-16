"use client";
import { useEffect, useRef } from "react";

export default function LilyGarden() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized?.current) return;
    initialized.current = true;

    // Three.js ambient particle system
    const initThree = async () => {
      try {
        const THREE = await import("three");
        const canvas = canvasRef.current;
        if (!canvas) return;

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
        renderer.setClearColor(0x000000, 0);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(60, canvas.offsetWidth / canvas.offsetHeight, 0.1, 100);
        camera.position.z = 5;

        // Petal particles
        const count = 200;
        const positions = new Float32Array(count * 3);
        const colors = new Float32Array(count * 3);
        const sizes = new Float32Array(count);

        const palette = [
          new THREE.Color("#C4B5D4"),
          new THREE.Color("#F2D4D4"),
          new THREE.Color("#FFF8F0"),
          new THREE.Color("#8B2252"),
          new THREE.Color("#E8C4D4"),
        ];

        for (let i = 0; i < count; i++) {
          positions[i * 3] = (Math.random() - 0.5) * 12;
          positions[i * 3 + 1] = (Math.random() - 0.5) * 8;
          positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
          const c = palette[Math.floor(Math.random() * palette.length)];
          colors[i * 3] = c.r;
          colors[i * 3 + 1] = c.g;
          colors[i * 3 + 2] = c.b;
          sizes[i] = 0.02 + Math.random() * 0.06;
        }

        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        geo.setAttribute("color", new THREE.BufferAttribute(colors, 3));
        geo.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

        const mat = new THREE.PointsMaterial({
          size: 0.05,
          vertexColors: true,
          transparent: true,
          opacity: 0.6,
          sizeAttenuation: true,
        });

        const points = new THREE.Points(geo, mat);
        scene.add(points);

        let animId: number;
        let t = 0;
        const animate = () => {
          animId = requestAnimationFrame(animate);
          t += 0.003;
          points.rotation.y = t * 0.1;
          points.rotation.x = Math.sin(t * 0.2) * 0.05;
          const pos = geo.attributes.position.array as Float32Array;
          for (let i = 0; i < count; i++) {
            pos[i * 3 + 1] += 0.003;
            if (pos[i * 3 + 1] > 4) pos[i * 3 + 1] = -4;
          }
          geo.attributes.position.needsUpdate = true;
          renderer.render(scene, camera);
        };
        animate();

        const onResize = () => {
          if (!canvas) return;
          renderer.setSize(canvas.offsetWidth, canvas.offsetHeight);
          camera.aspect = canvas.offsetWidth / canvas.offsetHeight;
          camera.updateProjectionMatrix();
        };
        window.addEventListener("resize", onResize);

        return () => {
          cancelAnimationFrame(animId);
          window.removeEventListener("resize", onResize);
          renderer.dispose();
        };
      } catch (e) {
        // Three.js unavailable, graceful fallback
      }
    };

    const initGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap?.registerPlugin(ScrollTrigger);

      const section = sectionRef?.current;
      if (!section) return;

      // Animate stems
      const stems = section?.querySelectorAll(".lily-stem");
      stems?.forEach((stem, i) => {
        gsap?.fromTo(
          stem,
          { scaleY: 0, transformOrigin: "bottom center" },
          {
            scaleY: 1,
            duration: 1.4,
            ease: "power2.out",
            delay: i * 0.1,
            scrollTrigger: {
              trigger: section,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Animate leaves
      const leaves = section?.querySelectorAll(".lily-leaf");
      leaves?.forEach((leaf, i) => {
        gsap?.fromTo(
          leaf,
          { scale: 0, opacity: 0, transformOrigin: "bottom left" },
          {
            scale: 1,
            opacity: 1,
            duration: 0.9,
            ease: "back.out(1.5)",
            delay: 0.5 + i * 0.08,
            scrollTrigger: {
              trigger: section,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Animate blooms with stagger
      const blooms = section?.querySelectorAll(".lily-bloom");
      blooms?.forEach((bloom, i) => {
        gsap?.fromTo(
          bloom,
          { scale: 0, opacity: 0, rotate: -20, transformOrigin: "center bottom" },
          {
            scale: 1,
            opacity: 1,
            rotate: 0,
            duration: 1.2,
            ease: "elastic.out(1, 0.5)",
            delay: 0.9 + i * 0.18,
            scrollTrigger: {
              trigger: section,
              start: "top 70%",
              toggleActions: "play none none reverse",
            },
          }
        );
      });

      // Gentle sway animation for each lily with more natural movement
      const lilyGroups = section?.querySelectorAll(".lily-group");
      lilyGroups?.forEach((group, i) => {
        gsap?.to(group, {
          rotation: `random(-5, 5)`,
          transformOrigin: "bottom center",
          duration: 3 + i * 0.4,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.25,
        });
        
        // Add subtle breathing animation to individual blooms
        const bloom = group?.querySelector(".lily-bloom");
        if (bloom) {
          gsap?.to(bloom, {
            scale: 1.05,
            duration: 4 + Math.random() * 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            delay: i * 0.3 + 1,
          });
        }
      });

      // Floating petals with more realistic wind-like movement
      const petals = section?.querySelectorAll(".garden-petal");
      petals?.forEach((petal, i) => {
        gsap?.to(petal, {
          y: "random(-50, 50)",
          x: "random(-25, 25)",
          rotation: "random(-45, 45)",
          duration: "random(5, 9)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.12,
        });
        
        // Add subtle scale variation for depth perception
        gsap?.to(petal, {
          scale: "random(0.8, 1.2)",
          duration: "random(3, 6)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: i * 0.18 + 0.5,
        });
      });

      // Text reveal
      const texts = section?.querySelectorAll(".garden-text-reveal");
      gsap?.fromTo(
        texts,
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          stagger: 0.35,
          ease: "power3.out",
          scrollTrigger: {
            trigger: section,
            start: "top 60%",
            toggleActions: "play none none reverse",
          },
        }
      );

      // Parallax on foreground
      const fg = section?.querySelector(".garden-foreground");
      if (fg) {
        gsap?.to(fg, {
          y: "-60px",
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      }
    };

    initThree();
    initGSAP();
  }, []);

  // Realistic lily data with more variation and additional flower types
  interface LilyData {
    x: number;
    color: string;
    color2: string;
    size: number;
    delay: number;
    leafDir: number;
    tilt: number;
    type: "lily" | "rose" | "tulip";
  }

  const lilies: LilyData[] = [
    { x: 6,  color: "#D4C0E4", color2: "#B89FCC", size: 1.2, delay: 0,    leafDir: 1,  tilt: 3,  type: "lily" },
    { x: 14, color: "#F5DEDE", color2: "#E8BEBE", size: 0.9, delay: 0.2,  leafDir: -1, tilt: -2, type: "lily" },
    { x: 23, color: "#9B3262", color2: "#7A1A42", size: 1.6, delay: 0.1,  leafDir: 1,  tilt: 1,  type: "rose" },
    { x: 32, color: "#FFF0E8", color2: "#F0D8C8", size: 1.0, delay: 0.3,  leafDir: -1, tilt: -4, type: "lily" },
    { x: 42, color: "#C4B5D4", color2: "#A898C0", size: 1.9, delay: 0,    leafDir: 1,  tilt: 2,  type: "lily" },
    { x: 52, color: "#F8E0E0", color2: "#ECC0C0", size: 1.1, delay: 0.15, leafDir: -1, tilt: -1, type: "tulip" },
    { x: 61, color: "#8B2252", color2: "#6A1040", size: 1.5, delay: 0.25, leafDir: 1,  tilt: 3,  type: "rose" },
    { x: 70, color: "#FFF8F0", color2: "#F0E0D0", size: 1.0, delay: 0.1,  leafDir: -1, tilt: -2, type: "lily" },
    { x: 79, color: "#C4B5D4", color2: "#A898C0", size: 1.3, delay: 0.2,  leafDir: 1,  tilt: 1,  type: "tulip" },
    { x: 88, color: "#F2D4D4", color2: "#E0B4B4", size: 1.1, delay: 0.05, leafDir: -1, tilt: -3, type: "lily" },
    { x: 96, color: "#9B3262", color2: "#7A1A42", size: 1.4, delay: 0.18, leafDir: 1,  tilt: 2,  type: "rose" },
  ];

  return (
    <div ref={sectionRef} className="lily-garden-section">
      {/* Three.js canvas for ambient particles */}
      <canvas ref={canvasRef} className="garden-three-canvas" aria-hidden="true" />

      {/* Background atmosphere */}
      <div className="garden-atmosphere" aria-hidden="true" />

      <div className="garden-text-container">
        <p className="garden-text-reveal garden-eyebrow">A garden for you</p>
        <h2 className="garden-text-reveal garden-heading">Where Every Lily Blooms With Love</h2>
        <p className="garden-text-reveal garden-subtext">
          These flowers grew from every thought of you, every quiet moment, every &ldquo;goodnight&rdquo; and every &ldquo;good morning&rdquo;.
        </p>
      </div>

      {/* SVG Lily Garden — Realistic */}
      <div className="garden-svg-container" aria-hidden="true">
        <svg
          viewBox="0 0 1100 560"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="garden-svg"
          role="img"
          aria-label="Animated realistic lily garden"
        >
          <defs>
            {lilies.map((lily, idx) => (
              <radialGradient key={`pg-${idx}`} id={`petalGrad${idx}`} cx="50%" cy="70%" r="60%">
                <stop offset="0%" stopColor={lily.color} stopOpacity="1" />
                <stop offset="60%" stopColor={lily.color} stopOpacity="0.85" />
                <stop offset="100%" stopColor={lily.color2} stopOpacity="0.7" />
              </radialGradient>
            ))}
            <radialGradient id="groundGrad" cx="50%" cy="100%" r="60%">
              <stop offset="0%" stopColor="#2A3A2A" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#0A1A0A" stopOpacity="0" />
            </radialGradient>
            <filter id="softBloom">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Ground */}
          <ellipse cx="550" cy="545" rx="580" ry="35" fill="url(#groundGrad)" />

          {/* Grass tufts */}
          {Array.from({ length: 28 }).map((_, i) => (
            <g key={i} opacity="0.7">
              <line x1={20 + i * 38} y1="548" x2={14 + i * 38} y2="524" stroke="#3A5A3A" strokeWidth="1.8" strokeLinecap="round" />
              <line x1={20 + i * 38} y1="548" x2={26 + i * 38} y2="520" stroke="#4A6A4A" strokeWidth="1.8" strokeLinecap="round" />
              <line x1={20 + i * 38} y1="548" x2={20 + i * 38} y2="518" stroke="#3A5A3A" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          ))}

          {/* Lily plants */}
          {lilies.map((lily, idx) => {
            const bx = lily.x * 11;
            const stemH = 130 + lily.size * 70;
            const topY = 548 - stemH;
            const sw = 2.5 * lily.size;

            return (
              <g key={idx} className="lily-group" style={{ transformOrigin: `${bx}px 548px` }}>
                {/* Main stem with slight curve */}
                <path
                  d={`M ${bx} 548 C ${bx + lily.tilt * 3} ${548 - stemH * 0.4} ${bx + lily.tilt * 5} ${548 - stemH * 0.7} ${bx + lily.tilt * 2} ${topY + 20}`}
                  stroke="#3A5A3A"
                  strokeWidth={sw}
                  strokeLinecap="round"
                  fill="none"
                  className="lily-stem"
                />
                {/* Secondary stem highlight */}
                <path
                  d={`M ${bx + 1} 548 C ${bx + lily.tilt * 3 + 1} ${548 - stemH * 0.4} ${bx + lily.tilt * 5 + 1} ${548 - stemH * 0.7} ${bx + lily.tilt * 2 + 1} ${topY + 20}`}
                  stroke="#5A7A5A"
                  strokeWidth={sw * 0.4}
                  strokeLinecap="round"
                  fill="none"
                  opacity="0.5"
                  className="lily-stem"
                />

                {/* Lower leaf pair */}
                <ellipse
                  cx={bx + lily.leafDir * 24}
                  cy={topY + stemH * 0.65}
                  rx={22 * lily.size}
                  ry={7 * lily.size}
                  fill="#3A5A3A"
                  transform={`rotate(${lily.leafDir * -28} ${bx + lily.leafDir * 24} ${topY + stemH * 0.65})`}
                  opacity="0.85"
                  className="lily-leaf"
                />
                {/* Leaf vein */}
                <line
                  x1={bx}
                  y1={topY + stemH * 0.65}
                  x2={bx + lily.leafDir * 44}
                  y2={topY + stemH * 0.65 - 8 * lily.size}
                  stroke="#5A7A5A"
                  strokeWidth="0.8"
                  opacity="0.5"
                  className="lily-leaf"
                />

                {/* Upper leaf pair */}
                <ellipse
                  cx={bx - lily.leafDir * 18}
                  cy={topY + stemH * 0.38}
                  rx={17 * lily.size}
                  ry={5.5 * lily.size}
                  fill="#4A6A4A"
                  transform={`rotate(${lily.leafDir * 22} ${bx - lily.leafDir * 18} ${topY + stemH * 0.38})`}
                  opacity="0.8"
                  className="lily-leaf"
                />

                {/* Bud (small, below main bloom) */}
                <g className="lily-bloom" style={{ transformOrigin: `${bx + lily.tilt * 1}px ${topY + 35}px` }}>
                  <ellipse
                    cx={bx + lily.tilt * 1}
                    cy={topY + 35}
                    rx={5 * lily.size}
                    ry={10 * lily.size}
                    fill={lily.color2}
                    opacity="0.7"
                  />
                  <ellipse
                    cx={bx + lily.tilt * 1}
                    cy={topY + 35}
                    rx={3 * lily.size}
                    ry={7 * lily.size}
                    fill={lily.color}
                    opacity="0.5"
                  />
                </g>

                {/* Main bloom — different flower types */}
                <g className="lily-bloom" style={{ transformOrigin: `${bx + lily.tilt * 2}px ${topY}px` }}>
                  {lily.type === "rose" ? (
                    // Rose bloom with layered petals
                    <>
                      {Array.from({ length: 8 }).map((_, p) => {
                        const angle = (p / 8) * Math.PI * 2;
                        const petalLen = 18 * lily.size * (1 - p * 0.08);
                        const cx2 = bx + lily.tilt * 2 + Math.cos(angle) * petalLen * 0.4;
                        const cy2 = topY + Math.sin(angle) * petalLen * 0.4;
                        const rot = (p / 8) * 360;
                        return (
                          <g key={p}>
                            <ellipse
                              cx={cx2}
                              cy={cy2}
                              rx={petalLen * 0.35}
                              ry={petalLen * 0.5}
                              transform={`rotate(${rot} ${cx2} ${cy2})`}
                              fill={`url(#petalGrad${idx})`}
                              opacity={0.9 - p * 0.05}
                            />
                            <ellipse
                              cx={cx2 - Math.cos(angle) * 1}
                              cy={cy2 - Math.sin(angle) * 1}
                              rx={petalLen * 0.12}
                              ry={petalLen * 0.18}
                              transform={`rotate(${rot} ${cx2 - Math.cos(angle) * 1} ${cy2 - Math.sin(angle) * 1})`}
                              fill="white"
                              opacity="0.15"
                            />
                          </g>
                        );
                      })}
                      {/* Rose center swirl */}
                      <circle cx={bx + lily.tilt * 2} cy={topY} r={5 * lily.size} fill={lily.color2} opacity="0.8" />
                      <circle cx={bx + lily.tilt * 2} cy={topY} r={3 * lily.size} fill={lily.color} opacity="0.9" />
                    </>
                  ) : lily.type === "tulip" ? (
                    // Tulip bloom with cup shape
                    <>
                      {Array.from({ length: 6 }).map((_, p) => {
                        const angle = (p / 6) * Math.PI * 2 - Math.PI / 2;
                        const petalLen = 22 * lily.size;
                        const cx2 = bx + lily.tilt * 2 + Math.cos(angle) * petalLen * 0.35;
                        const cy2 = topY + Math.sin(angle) * petalLen * 0.5;
                        const rot = (p / 6) * 360;
                        return (
                          <g key={p}>
                            <ellipse
                              cx={cx2}
                              cy={cy2}
                              rx={petalLen * 0.25}
                              ry={petalLen * 0.45}
                              transform={`rotate(${rot} ${cx2} ${cy2})`}
                              fill={`url(#petalGrad${idx})`}
                              opacity="0.9"
                            />
                            <line
                              x1={bx + lily.tilt * 2}
                              y1={topY}
                              x2={bx + lily.tilt * 2 + Math.cos(angle) * petalLen * 0.6}
                              y2={topY + Math.sin(angle) * petalLen * 0.7}
                              stroke={lily.color2}
                              strokeWidth="0.5"
                              opacity="0.4"
                            />
                          </g>
                        );
                      })}
                      {/* Tulip center */}
                      <ellipse cx={bx + lily.tilt * 2} cy={topY + 2} rx={4 * lily.size} ry={3 * lily.size} fill="#FFE060" opacity="0.7" />
                    </>
                  ) : (
                    // Original lily bloom
                    <>
                      {Array.from({ length: 6 }).map((_, p) => {
                        const angle = (p / 6) * Math.PI * 2 - Math.PI / 2;
                        const petalLen = 26 * lily.size;
                        const cx2 = bx + lily.tilt * 2 + Math.cos(angle) * petalLen * 0.55;
                        const cy2 = topY + Math.sin(angle) * petalLen * 0.55;
                        const rot = (p / 6) * 360;
                        return (
                          <g key={p}>
                            {/* Petal body */}
                            <ellipse
                              cx={cx2}
                              cy={cy2}
                              rx={petalLen * 0.22}
                              ry={petalLen * 0.58}
                              transform={`rotate(${rot} ${cx2} ${cy2})`}
                              fill={`url(#petalGrad${idx})`}
                              opacity="0.92"
                            />
                            {/* Petal center vein */}
                            <line
                              x1={bx + lily.tilt * 2}
                              y1={topY}
                              x2={bx + lily.tilt * 2 + Math.cos(angle) * petalLen * 0.9}
                              y2={topY + Math.sin(angle) * petalLen * 0.9}
                              stroke={lily.color2}
                              strokeWidth="0.6"
                              opacity="0.5"
                            />
                            {/* Petal highlight */}
                            <ellipse
                              cx={cx2 - Math.cos(angle) * 2}
                              cy={cy2 - Math.sin(angle) * 2}
                              rx={petalLen * 0.07}
                              ry={petalLen * 0.22}
                              transform={`rotate(${rot} ${cx2 - Math.cos(angle) * 2} ${cy2 - Math.sin(angle) * 2})`}
                              fill="white"
                              opacity="0.18"
                            />
                          </g>
                        );
                      })}

                      {/* Stamens — 6 detailed */}
                      {Array.from({ length: 6 }).map((_, s) => {
                        const a = (s / 6) * Math.PI * 2;
                        const sl = 12 * lily.size;
                        return (
                          <g key={s}>
                            <line
                              x1={bx + lily.tilt * 2}
                              y1={topY}
                              x2={bx + lily.tilt * 2 + Math.cos(a) * sl}
                              y2={topY + Math.sin(a) * sl}
                              stroke="#D4A820"
                              strokeWidth="0.9"
                              opacity="0.85"
                            />
                            {/* Anther */}
                            <ellipse
                              cx={bx + lily.tilt * 2 + Math.cos(a) * sl}
                              cy={topY + Math.sin(a) * sl}
                              rx="2"
                              ry="1.2"
                              fill="#E8B830"
                              opacity="0.9"
                              transform={`rotate(${(s / 6) * 360} ${bx + lily.tilt * 2 + Math.cos(a) * sl} ${topY + Math.sin(a) * sl})`}
                            />
                          </g>
                        );
                      })}

                      {/* Center pistil */}
                      <circle cx={bx + lily.tilt * 2} cy={topY} r={4 * lily.size} fill="#FFE060" opacity="0.9" />
                      <circle cx={bx + lily.tilt * 2} cy={topY} r={2 * lily.size} fill="#FFF0A0" opacity="0.8" />
                    </>
                  )}
                </g>
              </g>
            );
          })}

          {/* Floating petals */}
          {Array.from({ length: 16 }).map((_, i) => (
            <ellipse
              key={i}
              cx={40 + i * 65}
              cy={80 + Math.sin(i * 0.8) * 100}
              rx={9}
              ry={15}
              fill={["#C4B5D4", "#F2D4D4", "#FFF8F0", "#E8C4D4"][i % 4]}
              opacity="0.45"
              transform={`rotate(${i * 25})`}
              className="garden-petal"
            />
          ))}
        </svg>
      </div>

      {/* Foreground blur layer */}
      <div className="garden-foreground" aria-hidden="true">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="foreground-lily" style={{ left: `${5 + i * 18}%` }}>
            <svg width="90" height="140" viewBox="0 0 90 140" fill="none">
              <defs>
                <radialGradient id={`fgGrad${i}`} cx="50%" cy="70%" r="60%">
                  <stop offset="0%" stopColor={["#C4B5D4","#F2D4D4","#8B2252","#FFF8F0","#E8C4D4","#C4B5D4"][i]} />
                  <stop offset="100%" stopColor={["#A898C0","#E0B4B4","#6A1040","#F0D8C8","#D0A4B4","#A898C0"][i]} />
                </radialGradient>
              </defs>
              {/* Stem */}
              <path d="M 45 140 C 43 100 47 70 45 45" stroke="#3A5A3A" strokeWidth="3.5" strokeLinecap="round" fill="none" />
              {/* Leaf */}
              <ellipse cx="30" cy="95" rx="18" ry="6" fill="#3A5A3A" transform="rotate(-25 30 95)" opacity="0.8" />
              {/* Petals */}
              {Array.from({ length: 6 }).map((_, p) => {
                const a = (p / 6) * Math.PI * 2;
                return (
                  <ellipse
                    key={p}
                    cx={45 + Math.cos(a) * 20}
                    cy={45 + Math.sin(a) * 20}
                    rx="8"
                    ry="16"
                    transform={`rotate(${(p / 6) * 360} ${45 + Math.cos(a) * 20} ${45 + Math.sin(a) * 20})`}
                    fill={`url(#fgGrad${i})`}
                    opacity="0.75"
                  />
                );
              })}
              <circle cx="45" cy="45" r="6" fill="#FFE060" opacity="0.9" />
            </svg>
          </div>
        ))}
      </div>
    </div>
  );
}