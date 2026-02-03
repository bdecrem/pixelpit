'use client';
"use strict";
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = VoxelHero;
var jsx_runtime_1 = require("react/jsx-runtime");
var react_1 = require("react");
var colors = [
    { base: '#db2777', hi: '#f472b6', top: '#f9a8d4' },
    { base: '#0891b2', hi: '#22d3ee', top: '#67e8f9' },
    { base: '#eab308', hi: '#facc15', top: '#fde68a' },
    { base: '#65a30d', hi: '#84cc16', top: '#bef264' },
    { base: '#7c3aed', hi: '#8b5cf6', top: '#c4b5fd' },
    { base: '#dc2626', hi: '#ef4444', top: '#fca5a5' },
    { base: '#c2410c', hi: '#ea580c', top: '#fdba74' },
    { base: '#0369a1', hi: '#0284c7', top: '#7dd3fc' },
];
var icons = ['★', '◆', '●', '▲', '■', '♦', '♥', '✦'];
// Ambient music system - dreamy pads and sparkles
function useAmbientMusic() {
    var audioCtxRef = (0, react_1.useRef)(null);
    var masterGainRef = (0, react_1.useRef)(null);
    var musicIntervalRef = (0, react_1.useRef)(null);
    var padIntervalRef = (0, react_1.useRef)(null);
    var isPlayingRef = (0, react_1.useRef)(false);
    var stepRef = (0, react_1.useRef)(0);
    // Dreamy chord progressions (Am - F - C - G with extensions)
    var CHORDS = [
        [220, 261.63, 329.63, 392], // Am7
        [174.61, 220, 261.63, 329.63], // Fmaj7
        [261.63, 329.63, 392, 493.88], // Cmaj7
        [196, 246.94, 293.66, 392], // G6
    ];
    // Pink/cyan frequency palette for sparkles
    var SPARKLE_FREQS = [880, 1108.73, 1318.51, 1567.98, 1760, 2093];
    var initAudio = (0, react_1.useCallback)(function () {
        if (audioCtxRef.current)
            return audioCtxRef.current;
        var ctx = new (window.AudioContext || window.webkitAudioContext)();
        audioCtxRef.current = ctx;
        var master = ctx.createGain();
        master.gain.value = 0.35;
        master.connect(ctx.destination);
        masterGainRef.current = master;
        return ctx;
    }, []);
    var playPad = (0, react_1.useCallback)(function (frequencies, duration) {
        var ctx = audioCtxRef.current;
        var master = masterGainRef.current;
        if (!ctx || !master)
            return;
        frequencies.forEach(function (freq, i) {
            var osc = ctx.createOscillator();
            var filter = ctx.createBiquadFilter();
            var gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.value = freq;
            // Slight detune for warmth
            osc.detune.value = (Math.random() - 0.5) * 10;
            filter.type = 'lowpass';
            filter.frequency.value = 800 + Math.random() * 400;
            filter.Q.value = 0.5;
            // Slow attack, long release for dreamy pads
            var now = ctx.currentTime;
            var attackTime = 0.8 + Math.random() * 0.4;
            var releaseStart = duration - 1.5;
            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.06 - i * 0.01, now + attackTime);
            gain.gain.setValueAtTime(0.06 - i * 0.01, now + releaseStart);
            gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
            osc.connect(filter);
            filter.connect(gain);
            gain.connect(master);
            osc.start(now + i * 0.05); // Slight stagger
            osc.stop(now + duration + 0.1);
        });
    }, []);
    var playSubPulse = (0, react_1.useCallback)(function () {
        var ctx = audioCtxRef.current;
        var master = masterGainRef.current;
        if (!ctx || !master)
            return;
        var osc = ctx.createOscillator();
        var filter = ctx.createBiquadFilter();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = 55; // Deep sub
        filter.type = 'lowpass';
        filter.frequency.value = 120;
        var now = ctx.currentTime;
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + 2.1);
    }, []);
    var playSparkle = (0, react_1.useCallback)(function () {
        var ctx = audioCtxRef.current;
        var master = masterGainRef.current;
        if (!ctx || !master)
            return;
        var freq = SPARKLE_FREQS[Math.floor(Math.random() * SPARKLE_FREQS.length)];
        var osc = ctx.createOscillator();
        var filter = ctx.createBiquadFilter();
        var gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = freq;
        filter.type = 'lowpass';
        filter.frequency.value = 3000;
        var now = ctx.currentTime;
        var duration = 0.3 + Math.random() * 0.4;
        gain.gain.setValueAtTime(0.03 + Math.random() * 0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(master);
        osc.start(now);
        osc.stop(now + duration + 0.1);
    }, []);
    var startMusic = (0, react_1.useCallback)(function () {
        if (isPlayingRef.current)
            return;
        var ctx = initAudio();
        if (ctx.state === 'suspended')
            ctx.resume();
        isPlayingRef.current = true;
        stepRef.current = 0;
        // Play initial pad
        playPad(CHORDS[0], 8);
        // Chord changes every 8 seconds (matches visual pulse)
        padIntervalRef.current = setInterval(function () {
            stepRef.current = (stepRef.current + 1) % CHORDS.length;
            playPad(CHORDS[stepRef.current], 8);
            playSubPulse();
        }, 8000);
        // Random sparkles
        musicIntervalRef.current = setInterval(function () {
            if (Math.random() > 0.6) {
                playSparkle();
            }
        }, 800);
    }, [initAudio, playPad, playSubPulse, playSparkle]);
    var stopMusic = (0, react_1.useCallback)(function () {
        isPlayingRef.current = false;
        if (musicIntervalRef.current) {
            clearInterval(musicIntervalRef.current);
            musicIntervalRef.current = null;
        }
        if (padIntervalRef.current) {
            clearInterval(padIntervalRef.current);
            padIntervalRef.current = null;
        }
    }, []);
    // Cleanup on unmount
    (0, react_1.useEffect)(function () {
        return function () {
            stopMusic();
            if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
                audioCtxRef.current.close();
            }
        };
    }, [stopMusic]);
    return { startMusic: startMusic, stopMusic: stopMusic, isPlaying: isPlayingRef };
}
function VoxelHero() {
    var canvasRef = (0, react_1.useRef)(null);
    var containerRef = (0, react_1.useRef)(null);
    var mouseRef = (0, react_1.useRef)({ x: -9999, y: -9999 });
    var mouseActiveRef = (0, react_1.useRef)(0);
    var voxelsRef = (0, react_1.useRef)([]);
    var trailsRef = (0, react_1.useRef)([]);
    var lastPulseRef = (0, react_1.useRef)(0);
    var lastInteractionRef = (0, react_1.useRef)(0);
    var _a = useAmbientMusic(), startMusic = _a.startMusic, stopMusic = _a.stopMusic;
    var musicStartedRef = (0, react_1.useRef)(false);
    var initVoxels = (0, react_1.useCallback)(function (w, h) {
        var cx = w / 2;
        var cy = h / 2;
        var voxels = [];
        var pShape = [
            [0, 0], [0, 1], [0, 2], [0, 3], [0, 4], [0, 5], [0, 6], [0, 7],
            [1, 0], [1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6], [1, 7],
            [2, 0], [3, 0], [4, 0], [5, 0],
            [2, 1], [3, 1], [4, 1], [5, 1],
            [5, 2], [5, 3],
            [2, 3], [3, 3], [4, 3], [5, 3],
            [2, 4],
        ];
        var tileSize = Math.max(14, Math.min(26, h / 16));
        var pOffX = cx - 3.8 * tileSize;
        var pOffY = cy - 4 * tileSize;
        pShape.forEach(function (_a, i) {
            var col = _a[0], row = _a[1];
            voxels.push({
                homeX: pOffX + col * tileSize,
                homeY: pOffY + row * tileSize,
                x: pOffX + col * tileSize,
                y: pOffY + row * tileSize,
                vx: 0, vy: 0,
                size: tileSize - 2,
                color: colors[i % colors.length],
                icon: icons[i % icons.length],
                angle: 0, angVel: 0,
                isP: true,
                phase: Math.random() * Math.PI * 2,
                breathe: 0.3 + Math.random() * 0.4,
                opacity: 1,
            });
        });
        // Three orbital rings — inner bright, outer faint
        var rings = [
            { count: 12, minDist: 0.12, maxDist: 0.18, minSize: 8, maxSize: 14, speed: [0.003, 0.007], opRange: [0.7, 1] },
            { count: 18, minDist: 0.2, maxDist: 0.35, minSize: 5, maxSize: 12, speed: [0.001, 0.004], opRange: [0.45, 0.7] },
            { count: 24, minDist: 0.38, maxDist: 0.48, minSize: 3, maxSize: 8, speed: [0.0005, 0.002], opRange: [0.2, 0.4] },
        ];
        rings.forEach(function (ring) {
            for (var i = 0; i < ring.count; i++) {
                var angle = (i / ring.count) * Math.PI * 2 + Math.random() * 0.5;
                var distFrac = ring.minDist + Math.random() * (ring.maxDist - ring.minDist);
                var distX = w * distFrac;
                var distY = h * distFrac * 0.9;
                var size = ring.minSize + Math.random() * (ring.maxSize - ring.minSize);
                voxels.push({
                    x: cx + Math.cos(angle) * distX,
                    y: cy + Math.sin(angle) * distY,
                    vx: 0, vy: 0,
                    size: size,
                    color: colors[Math.floor(Math.random() * colors.length)],
                    icon: icons[Math.floor(Math.random() * icons.length)],
                    angle: Math.random() * 45 - 22,
                    angVel: (Math.random() - 0.5) * 0.2,
                    isP: false,
                    orbitAngle: angle,
                    orbitDistX: distX,
                    orbitDistY: distY,
                    orbitSpeed: ring.speed[0] + Math.random() * (ring.speed[1] - ring.speed[0]),
                    phase: Math.random() * Math.PI * 2,
                    breathe: 0.15 + Math.random() * 0.25,
                    opacity: ring.opRange[0] + Math.random() * (ring.opRange[1] - ring.opRange[0]),
                });
            }
        });
        return voxels;
    }, []);
    var drawVoxel = (0, react_1.useCallback)(function (ctx, v, time) {
        var breath = Math.sin(time * 1.5 + v.phase) * v.breathe;
        var s = v.size + breath;
        ctx.save();
        ctx.globalAlpha = v.opacity;
        ctx.translate(v.x, v.y);
        ctx.rotate((v.angle * Math.PI) / 180);
        ctx.fillStyle = 'rgba(0,0,0,0.5)';
        ctx.fillRect(3, 3, s, s);
        ctx.fillStyle = v.color.base;
        ctx.fillRect(0, 0, s, s);
        ctx.fillStyle = v.color.top;
        ctx.fillRect(0, 0, s, s * 0.25);
        ctx.fillStyle = v.color.hi;
        ctx.fillRect(0, 0, s * 0.22, s);
        ctx.fillStyle = v.color.top;
        ctx.fillRect(0, 0, s * 0.22, s * 0.25);
        if (s > 12) {
            ctx.fillStyle = 'rgba(0,0,0,0.4)';
            ctx.font = "bold ".concat(Math.floor(s * 0.5), "px monospace");
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(v.icon, s / 2, s / 2 + 1);
        }
        ctx.restore();
    }, []);
    var drawSparkle = (0, react_1.useCallback)(function (ctx, x, y, size, opacity) {
        ctx.fillStyle = "rgba(255,255,255,".concat(opacity, ")");
        ctx.fillRect(x - 1, y - size / 2, 2, size);
        ctx.fillRect(x - size / 2, y - 1, size, 2);
    }, []);
    (0, react_1.useEffect)(function () {
        var canvas = canvasRef.current;
        var container = containerRef.current;
        if (!canvas || !container)
            return;
        var ctx = canvas.getContext('2d');
        if (!ctx)
            return;
        var dpr = window.devicePixelRatio || 1;
        var resize = function () {
            var rect = container.getBoundingClientRect();
            var w = rect.width;
            var h = rect.height;
            canvas.width = w * dpr;
            canvas.height = h * dpr;
            canvas.style.width = w + 'px';
            canvas.style.height = h + 'px';
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            voxelsRef.current = initVoxels(w, h);
        };
        resize();
        window.addEventListener('resize', resize);
        var getPos = function (e, rect) { return ({ x: e.clientX - rect.left, y: e.clientY - rect.top }); };
        var handleMouse = function (e) {
            mouseRef.current = getPos(e, canvas.getBoundingClientRect());
            mouseActiveRef.current = 1;
            lastInteractionRef.current = Date.now();
            // Start music on first interaction
            if (!musicStartedRef.current) {
                startMusic();
                musicStartedRef.current = true;
            }
        };
        var handleMouseLeave = function () { mouseActiveRef.current = 0; };
        var handleTouch = function (e) {
            if (e.touches.length > 0) {
                var r = canvas.getBoundingClientRect();
                mouseRef.current = { x: e.touches[0].clientX - r.left, y: e.touches[0].clientY - r.top };
                mouseActiveRef.current = 1;
                lastInteractionRef.current = Date.now();
                // Start music on first interaction
                if (!musicStartedRef.current) {
                    startMusic();
                    musicStartedRef.current = true;
                }
            }
        };
        var handleTouchEnd = function () { mouseActiveRef.current = 0; };
        canvas.addEventListener('mousemove', handleMouse);
        canvas.addEventListener('mouseleave', handleMouseLeave);
        canvas.addEventListener('touchstart', handleTouch, { passive: true });
        canvas.addEventListener('touchmove', handleTouch, { passive: true });
        canvas.addEventListener('touchend', handleTouchEnd);
        canvas.addEventListener('touchcancel', handleTouchEnd);
        var animId;
        var startTime = Date.now();
        // First auto-pulse fires after 3s, then every 8s
        lastPulseRef.current = Date.now() - 5000;
        var animate = function () {
            var w = canvas.width / dpr;
            var h = canvas.height / dpr;
            var time = (Date.now() - startTime) / 1000;
            var mouse = mouseRef.current;
            var cx = w / 2;
            var cy = h / 2;
            // Dark warm background
            ctx.fillStyle = '#0f0812';
            ctx.fillRect(0, 0, w, h);
            // Pink glow — centered
            var g1 = ctx.createRadialGradient(cx, cy, 0, cx, cy, h * 0.7);
            g1.addColorStop(0, 'rgba(219, 39, 119, 0.09)');
            g1.addColorStop(0.4, 'rgba(219, 39, 119, 0.03)');
            g1.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g1;
            ctx.fillRect(0, 0, w, h);
            // Cyan counter-glow — offset upper right
            var g2 = ctx.createRadialGradient(cx + w * 0.15, cy - h * 0.15, 0, cx + w * 0.15, cy - h * 0.15, h * 0.5);
            g2.addColorStop(0, 'rgba(8, 145, 178, 0.05)');
            g2.addColorStop(0.5, 'rgba(8, 145, 178, 0.01)');
            g2.addColorStop(1, 'rgba(0,0,0,0)');
            ctx.fillStyle = g2;
            ctx.fillRect(0, 0, w, h);
            // Grid
            ctx.strokeStyle = 'rgba(255,255,255,0.018)';
            ctx.lineWidth = 1;
            for (var x = 0; x < w; x += 28) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (var y = 0; y < h; y += 28) {
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
            var voxels = voxelsRef.current;
            // Sparkle trails
            if (Math.random() > 0.94) {
                var rv = voxels[Math.floor(Math.random() * voxels.length)];
                if (rv) {
                    trailsRef.current.push({ x: rv.x + rv.size / 2, y: rv.y + rv.size / 2, life: 1, size: 2 + Math.random() * 5 });
                }
            }
            trailsRef.current = trailsRef.current.filter(function (t) {
                t.life -= 0.02;
                if (t.life <= 0)
                    return false;
                ctx.fillStyle = "rgba(163, 230, 53, ".concat(t.life * 0.2, ")");
                ctx.fillRect(t.x - 1, t.y - t.size / 2, 2, t.size);
                ctx.fillRect(t.x - t.size / 2, t.y - 1, t.size, 2);
                return true;
            });
            // Physics + draw
            var sorted = __spreadArray([], voxels, true).sort(function (a, b) { return a.y - b.y; });
            // Auto-pulse: every 8s of no interaction, burst the P outward
            var now = Date.now();
            var timeSinceInteraction = now - lastInteractionRef.current;
            var timeSincePulse = now - lastPulseRef.current;
            var pulseActive = false;
            if (timeSinceInteraction > 3000 && timeSincePulse > 8000) {
                lastPulseRef.current = now;
                pulseActive = true;
                // Burst of sparkle trails on pulse
                voxels.filter(function (v) { return v.isP; }).forEach(function (v) {
                    trailsRef.current.push({ x: v.x + v.size / 2, y: v.y + v.size / 2, life: 1, size: 4 + Math.random() * 6 });
                });
            }
            sorted.forEach(function (v) {
                var dx = mouse.x - (v.x + v.size / 2);
                var dy = mouse.y - (v.y + v.size / 2);
                var dist = Math.sqrt(dx * dx + dy * dy);
                var active = mouseActiveRef.current;
                if (v.isP) {
                    var fx = 0, fy = 0;
                    if (active > 0 && dist < 130 && dist > 0) {
                        var f = (1 - dist / 130) * 28 * active;
                        fx = -(dx / dist) * f;
                        fy = -(dy / dist) * f;
                    }
                    // Auto-pulse: radial kick from P center
                    if (pulseActive && v.homeX !== undefined && v.homeY !== undefined) {
                        var pdx = v.homeX - cx;
                        var pdy = v.homeY - cy;
                        var pdist = Math.sqrt(pdx * pdx + pdy * pdy) || 1;
                        var kick = 12 + Math.random() * 8;
                        v.vx += (pdx / pdist) * kick;
                        v.vy += (pdy / pdist) * kick;
                    }
                    if (v.homeX !== undefined && v.homeY !== undefined) {
                        v.vx = (v.vx + fx + (v.homeX - v.x) * 0.07) * 0.87;
                        v.vy = (v.vy + fy + (v.homeY - v.y) * 0.07) * 0.87;
                    }
                    v.x += v.vx;
                    v.y += v.vy;
                    v.angle = v.vx * 0.7;
                }
                else {
                    if (v.orbitAngle !== undefined && v.orbitSpeed !== undefined &&
                        v.orbitDistX !== undefined && v.orbitDistY !== undefined) {
                        v.orbitAngle += v.orbitSpeed;
                        var tx = cx + Math.cos(v.orbitAngle) * v.orbitDistX;
                        var ty = cy + Math.sin(v.orbitAngle) * v.orbitDistY;
                        if (active > 0 && dist < 200 && dist > 0) {
                            var pull = (1 - dist / 200) * 0.1 * active;
                            tx += dx * pull;
                            ty += dy * pull;
                        }
                        v.x += (tx - v.x) * 0.03;
                        v.y += (ty - v.y) * 0.03;
                    }
                    v.angle += v.angVel;
                }
                drawVoxel(ctx, v, time);
            });
            // Floating sparkles
            for (var i = 0; i < 8; i++) {
                var sp = time * 0.5 + i * 0.9;
                var sx = cx + Math.cos(sp * 0.6 + i * 1.2) * (w * 0.15 + i * w * 0.04);
                var sy = cy + Math.sin(sp * 0.9 + i * 0.6) * (h * 0.2 + i * h * 0.03);
                var fl = Math.sin(time * 2.5 + i * 1.8) * 0.5 + 0.5;
                if (sx > 0 && sx < w && sy > 0 && sy < h) {
                    drawSparkle(ctx, sx, sy, 4 + i, fl * 0.25);
                }
            }
            // Scanlines
            ctx.fillStyle = 'rgba(0,0,0,0.025)';
            for (var y = 0; y < h; y += 4) {
                ctx.fillRect(0, y, w, 2);
            }
            // Vignette
            var vig = ctx.createRadialGradient(cx, cy, 0, cx, cy, w * 0.52);
            vig.addColorStop(0, 'rgba(0,0,0,0)');
            vig.addColorStop(0.65, 'rgba(0,0,0,0)');
            vig.addColorStop(1, 'rgba(15,8,18,0.75)');
            ctx.fillStyle = vig;
            ctx.fillRect(0, 0, w, h);
            animId = requestAnimationFrame(animate);
        };
        animate();
        return function () {
            cancelAnimationFrame(animId);
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('mousemove', handleMouse);
            canvas.removeEventListener('mouseleave', handleMouseLeave);
            canvas.removeEventListener('touchstart', handleTouch);
            canvas.removeEventListener('touchmove', handleTouch);
            canvas.removeEventListener('touchend', handleTouchEnd);
            canvas.removeEventListener('touchcancel', handleTouchEnd);
            stopMusic();
        };
    }, [initVoxels, drawVoxel, drawSparkle, startMusic, stopMusic]);
    return ((0, jsx_runtime_1.jsx)("div", { ref: containerRef, style: {
            position: 'absolute',
            inset: 0,
            overflow: 'hidden',
            cursor: 'crosshair',
        }, children: (0, jsx_runtime_1.jsx)("canvas", { ref: canvasRef, style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'block' } }) }));
}
