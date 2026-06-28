var e=document.querySelector(`[data-footer-lightning]`),t=window.matchMedia(`(prefers-reduced-motion: reduce)`);if(e instanceof HTMLCanvasElement&&!t.matches){let t=e.getContext(`webgl`,{alpha:!0,antialias:!0,premultipliedAlpha:!1});if(t){let n=(e,n)=>{let r=t.createShader(n);return r?(t.shaderSource(r,e),t.compileShader(r),t.getShaderParameter(r,t.COMPILE_STATUS)?r:(t.deleteShader(r),null)):null},r=n(`
        attribute vec2 aPosition;

        void main() {
          gl_Position = vec4(aPosition, 0.0, 1.0);
        }
      `,t.VERTEX_SHADER),i=n(`
        precision mediump float;

        uniform vec2 iResolution;
        uniform float iTime;

        float hash11(float p) {
          p = fract(p * 0.1031);
          p *= p + 33.33;
          p *= p + p;

          return fract(p);
        }

        float hash12(vec2 p) {
          vec3 p3 = fract(vec3(p.xyx) * 0.1031);
          p3 += dot(p3, p3.yzx + 33.33);

          return fract((p3.x + p3.y) * p3.z);
        }

        float softLine(float distanceToPath, float width) {
          return 1.0 - smoothstep(0.0, width, distanceToPath);
        }

        float segmentedJitter(float y, float scale, float seed) {
          float cell = floor(y * scale);
          float blend = fract(y * scale);
          float a = hash12(vec2(cell, seed));
          float b = hash12(vec2(cell + 1.0, seed));

          return mix(a, b, blend) - 0.5;
        }

        float lightningPath(float y, float anchor, float seed, float strikeId) {
          float strikeSeed = seed * 17.31 + strikeId * 5.79;
          float drift = (hash11(strikeSeed + 0.7) - 0.5) * 0.1;
          float broadBend = segmentedJitter(y, 4.2, strikeSeed) * 0.16;
          float midBend = segmentedJitter(y, 12.0, strikeSeed + 6.7) * 0.055;
          float fineBend = segmentedJitter(y, 32.0, strikeSeed + 13.1) * 0.02;

          return anchor + drift + broadBend + midBend + fineBend;
        }

        float currentEnvelope(float phase, float seed) {
          float rampIn = smoothstep(0.0, 0.08, phase);
          float hold = 1.0 - smoothstep(0.78, 0.96, phase);
          float lowCurrent = 0.22 * rampIn * hold;
          float rollingPulse = 0.56 + 0.44 * sin(phase * 31.416 + seed * 2.7);
          float microFlicker = 0.82 + 0.18 * hash11(floor(phase * 110.0) + seed * 19.0);
          float returnA = 0.18 + hash11(seed + 2.1) * 0.22;
          float returnB = 0.48 + hash11(seed + 8.4) * 0.2;
          float hotPulse = exp(-abs(phase - returnA) * 28.0) * 0.42;
          hotPulse += exp(-abs(phase - returnB) * 22.0) * 0.32;

          return (lowCurrent + rampIn * hold * (0.34 + rollingPulse * 0.46) + hotPulse) * microFlicker;
        }

        vec2 branchBolt(
          vec2 uv,
          float anchor,
          float seed,
          float strikeId,
          float rootY,
          float direction,
          float side,
          float strength
        ) {
          float strikeSeed = seed * 11.0 + strikeId * 7.3 + rootY * 5.1;
          float reachY = 0.16 + hash11(strikeSeed + 1.4) * 0.16;
          float rel = (uv.y - rootY) / (reachY * direction);
          float branchMask = smoothstep(0.0, 0.08, rel) * (1.0 - smoothstep(0.76, 1.0, rel));
          float branchFade = 1.0 - smoothstep(0.58, 1.0, rel);
          float rootX = lightningPath(rootY, anchor, seed, strikeId);
          float reachX = 0.07 + hash11(strikeSeed + 4.8) * 0.12;
          float crooked = segmentedJitter(rel, 5.0, strikeSeed + 3.1) * 0.034;
          crooked += segmentedJitter(rel, 15.0, strikeSeed + 9.4) * 0.012;
          float branchX = rootX + side * reachX * rel + crooked;
          float distanceToBranch = abs(uv.x - branchX);
          float core = softLine(distanceToBranch, 0.0023) * 0.74;
          float glow = softLine(distanceToBranch, 0.024) * 0.16;

          return vec2(core, glow) * branchMask * branchFade * strength;
        }

        vec2 lightningBolt(vec2 uv, float anchor, float seed, float strength) {
          float cycle = 4.8 + hash11(seed * 8.17) * 2.2;
          float timeline = (iTime + seed * 0.83) / cycle;
          float strikeId = floor(timeline);
          float phase = fract(timeline);
          float strikeSeed = seed * 13.7 + strikeId * 5.91;
          float intensity = strength * (0.72 + 0.28 * hash11(strikeSeed + 4.0));
          float envelope = currentEnvelope(phase, strikeSeed) * intensity;
          float path = lightningPath(uv.y, anchor, seed, strikeId);
          float distanceToPath = abs(uv.x - path);
          float verticalMask = smoothstep(0.03, 0.17, uv.y) * (1.0 - smoothstep(0.78, 1.03, uv.y));
          float channelWidth = 0.0023 + envelope * 0.0018;
          float hotCore = softLine(distanceToPath, channelWidth) * 1.14;
          float whiteHalo = softLine(distanceToPath, channelWidth * 2.1) * 0.34;
          float blueEdge = (softLine(distanceToPath, channelWidth * 7.2) - softLine(distanceToPath, channelWidth * 1.25)) * 1.02;
          float corona = softLine(distanceToPath, 0.06) * 0.16;
          corona += softLine(distanceToPath, 0.12) * 0.036;
          vec2 energy = vec2(hotCore + whiteHalo, blueEdge + corona) * envelope * verticalMask;

          float branchRootA = 0.32 + hash11(strikeSeed + 2.6) * 0.46;
          float branchSideA = mix(-1.0, 1.0, step(0.5, hash11(strikeSeed + 3.9)));
          float branchGateA = step(0.34, hash11(strikeSeed + 8.2));
          energy += branchBolt(uv, anchor, seed, strikeId, branchRootA, -1.0, branchSideA, 0.58) * branchGateA * envelope * verticalMask;

          float branchRootB = 0.24 + hash11(strikeSeed + 12.4) * 0.54;
          float branchDirectionB = mix(-1.0, 1.0, step(0.72, hash11(strikeSeed + 15.2)));
          float branchGateB = step(0.58, hash11(strikeSeed + 18.3));
          energy += branchBolt(uv, anchor, seed, strikeId, branchRootB, branchDirectionB, -branchSideA, 0.42) * branchGateB * envelope * verticalMask;

          return energy;
        }

        void main() {
          vec2 uv = gl_FragCoord.xy / iResolution.xy;
          vec2 energy = vec2(0.0);
          energy += lightningBolt(uv, 0.23, 1.0, 0.9);
          energy += lightningBolt(uv, 0.5, 4.0, 1.05);
          energy += lightningBolt(uv, 0.77, 7.0, 0.86);

          vec3 whiteCore = vec3(1.0, 0.98, 0.94);
          vec3 electricBlue = vec3(0.02, 0.24, 1.0);
          vec3 cyanEdge = vec3(0.08, 0.56, 1.0);
          vec3 color = whiteCore * energy.x * 1.12 + electricBlue * energy.y * 2.05 + cyanEdge * energy.y * 0.56;
          float alpha = clamp(energy.x * 0.76 + energy.y * 0.56, 0.0, 0.82);

          gl_FragColor = vec4(color, alpha);
        }
      `,t.FRAGMENT_SHADER),a=t.createProgram();if(r&&i&&a&&(t.attachShader(a,r),t.attachShader(a,i),t.linkProgram(a),t.getProgramParameter(a,t.LINK_STATUS))){t.useProgram(a),t.enable(t.BLEND),t.blendFunc(t.SRC_ALPHA,t.ONE);let n=new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]),r=t.createBuffer(),i=t.getAttribLocation(a,`aPosition`),o=t.getUniformLocation(a,`iResolution`),s=t.getUniformLocation(a,`iTime`);t.bindBuffer(t.ARRAY_BUFFER,r),t.bufferData(t.ARRAY_BUFFER,n,t.STATIC_DRAW),t.enableVertexAttribArray(i),t.vertexAttribPointer(i,2,t.FLOAT,!1,0,0);let c=0,l=performance.now(),u=!1,d=()=>{let n=e.getBoundingClientRect(),r=Math.min(window.devicePixelRatio||1,2),i=Math.max(1,Math.round(n.width*r)),a=Math.max(1,Math.round(n.height*r));(e.width!==i||e.height!==a)&&(e.width=i,e.height=a,t.viewport(0,0,i,a))},f=n=>{d(),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.uniform2f(o,e.width,e.height),t.uniform1f(s,(n-l)/1e3),t.drawArrays(t.TRIANGLES,0,6),c=requestAnimationFrame(f)},p=()=>{c||=(l=performance.now(),requestAnimationFrame(f))},m=()=>{cancelAnimationFrame(c),c=0};document.addEventListener(`visibilitychange`,()=>{document.hidden?m():u&&p()}),`IntersectionObserver`in window?new IntersectionObserver(e=>{u=e.some(e=>e.isIntersecting),u?p():m()}).observe(e):(u=!0,p())}}}