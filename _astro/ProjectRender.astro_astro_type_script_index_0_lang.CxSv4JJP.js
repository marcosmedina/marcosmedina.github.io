import{m as k,g as x,f as L,S as I}from"./motion.DjPieiA6.js";const U=["voice","network","health","research","ai","about","expertise"],F=`#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,D=`#version 300 es
precision highp float;
in vec2 vUv;
out vec4 outColor;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uImg;
uniform vec2 uFocus;
uniform float uTime;
uniform int uScene;
uniform vec2 uPointer;
uniform float uPointerAmt;

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float lum(vec3 c) { return dot(c, vec3(0.299, 0.587, 0.114)); }
// Round twinkles: one possible point per cell, lit now and then, soft-edged.
float twinkle(vec2 uv, vec2 cells, float rate, float thr, float ar) {
  vec2 g = uv * cells;
  vec2 cell = floor(g);
  vec2 pos = vec2(hash(cell + 3.1), hash(cell + 7.7)) * 0.6 + 0.2;
  vec2 d = (fract(g) - pos) * vec2(ar * cells.y / cells.x, 1.0);
  float on = step(thr, hash(cell + floor(uTime * rate + hash(cell) * 4.0)));
  return on * exp(-dot(d, d) / 0.03);
}

// object-fit: cover with object-position uFocus, in image UV (y down).
vec2 cover(vec2 uv) {
  float ca = uRes.x / uRes.y;
  float ia = uImg.x / uImg.y;
  vec2 s = ca > ia ? vec2(1.0, ia / ca) : vec2(ca / ia, 1.0);
  vec2 o = (1.0 - s) * uFocus;
  return o + vec2(uv.x, 1.0 - uv.y) * s;
}

void main() {
  vec2 iuv = cover(vUv);
  float t = uTime;
  float ar = uImg.x / uImg.y;

  // Air over hot glass: a slow, faint drift everywhere.
  vec2 duv = (vec2(noise(iuv * 3.0 + t * 0.07), noise(iuv * 3.0 + 17.0 - t * 0.06)) - 0.5) * 0.004;
  float sweep = 0.0;

  if (uScene == 0) {
    // Voice: a travelling wave along the ribbon, strongest where the ribbon is loud.
    float band = smoothstep(0.30, 0.62, iuv.x) * (1.0 - smoothstep(0.92, 1.0, iuv.x));
    float win = exp(-pow((iuv.y - 0.49) / 0.28, 2.0));
    duv.y += sin(iuv.x * 13.0 - t * 1.7) * 0.013 * band * win;
    float head = fract(t * 0.16) * 1.3 - 0.15;
    sweep = exp(-pow((iuv.x - head) / 0.05, 2.0)) * win;
  } else if (uScene == 1) {
    // Network: the globe sways on its axis (a disc remapped onto a rotating sphere).
    vec2 c = vec2(0.674, 0.468);
    vec2 d = (iuv - c) * vec2(ar, 1.0) / (0.272 * ar);
    float r2 = dot(d, d);
    if (r2 < 1.0) {
      vec3 p = vec3(d, sqrt(1.0 - r2));
      float a = sin(t * 0.22) * 0.22;
      vec3 q = vec3(p.x * cos(a) + p.z * sin(a), p.y, -p.x * sin(a) + p.z * cos(a));
      float edge = smoothstep(1.0, 0.86, sqrt(r2));
      duv += (q.xy - d) * (0.272 * ar) / vec2(ar, 1.0) * edge;
    }
    // Flashes running between cities.
    sweep = pow(noise(iuv * 7.0 + vec2(t * 0.35, -t * 0.2)), 7.0) * 3.0 * step(r2, 1.1);
  } else if (uScene == 2) {
    // Health: lub-dub. The heart swells on each beat; the cardiogram lights up with it.
    float ph = mod(t, 1.15);
    float beat = exp(-pow((ph - 0.06) / 0.05, 2.0)) + 0.6 * exp(-pow((ph - 0.3) / 0.05, 2.0));
    vec2 hc = vec2(0.70, 0.56);
    vec2 hd = (iuv - hc) * vec2(ar, 1.0);
    float inHeart = smoothstep(0.42, 0.1, length(hd * vec2(1.25, 0.9)));
    duv -= (iuv - hc) * beat * 0.022 * inHeart;
    float line = exp(-pow((iuv.y - 0.555) / 0.03, 2.0));
    float head = ph / 1.15 * 1.4 - 0.2;
    sweep = line * (exp(-pow((iuv.x - head) / 0.06, 2.0)) + beat * 0.6);
  } else if (uScene == 3) {
    // Research: field rings expand from the insulator; discharges flicker inside it.
    vec2 rc = vec2(0.67, 0.50);
    float r = length((iuv - rc) * vec2(ar, 1.0));
    float rad = fract(t * 0.28) * 0.75;
    sweep = exp(-pow((r - rad) / 0.025, 2.0)) * (1.0 - fract(t * 0.28));
    float spark = twinkle(iuv, vec2(150.0, 100.0), 7.0, 0.975, ar);
    sweep += spark * smoothstep(0.22, 0.0, abs(iuv.x - rc.x) * ar) * 2.2;
  } else if (uScene == 4) {
    // AI: impulses crossing the brain.
    sweep = pow(noise(iuv * 9.0 - vec2(t * 0.45, t * 0.12)), 6.0) * 3.5;
  } else if (uScene == 5) {
    // About: the call runs down the cord and out into the network it turns into.
    float head = fract(t * 0.2) * 1.0 + 0.2;
    sweep = exp(-pow((iuv.x - head) / 0.05, 2.0)) * smoothstep(0.18, 0.4, iuv.x) * step(0.3, iuv.y);
    sweep += pow(noise(iuv * 8.0 - vec2(t * 0.55, 0.0)), 6.0) * 2.6 * smoothstep(0.45, 0.7, iuv.x);
    duv.y += sin(iuv.x * 9.0 - t * 1.4) * 0.006 * smoothstep(0.2, 0.55, iuv.x) * step(0.55, iuv.y);
  }

  vec3 col = texture(uTex, iuv + duv).rgb;
  if (uScene == 6) {
    // Capabilities: each glass slab is lit up to its own level, rising and falling like the
    // bars of a live spectrum analyser (reflections follow).
    const vec2 BARS[6] = vec2[6](vec2(0.393, 0.458), vec2(0.478, 0.543), vec2(0.569, 0.634), vec2(0.656, 0.725), vec2(0.751, 0.816), vec2(0.846, 0.917));
    const float TOPS[6] = float[6](0.49, 0.37, 0.26, 0.16, 0.28, 0.44);
    for (int k = 0; k < 6; k++) {
      if (iuv.x > BARS[k].x && iuv.x < BARS[k].y) {
        float fk = float(k);
        float level = 0.5 + 0.5 * sin(t * (1.1 + 0.29 * fk) + fk * 1.9) * cos(t * (0.47 + 0.13 * fk) + fk);
        float top = mix(0.74, TOPS[k], 0.35 + 0.65 * level);
        float y = iuv.y > 0.74 ? 1.48 - iuv.y : iuv.y;
        float lit = smoothstep(top - 0.01, top + 0.02, y);
        col *= mix(0.45, 1.45, lit);
        sweep += exp(-pow((y - top) / 0.008, 2.0)) * 1.2;
      }
    }
  }
  float L = lum(col);
  float bright = smoothstep(0.18, 0.75, L);

  // Shimmer: bright parts flicker and flow.
  float f = noise(iuv * 42.0 + vec2(t * 0.9, -t * 0.55));
  col += col * bright * (f - 0.45) * 0.6;
  // The scene's travelling light, only where there is something to light.
  col += vec3(0.55, 0.78, 1.0) * sweep * bright * 0.85;
  // Sparkle: a few bright points twinkle.
  float sp = twinkle(iuv, vec2(300.0, 200.0), 5.0, 0.985, ar);
  col += sp * smoothstep(0.3, 0.8, L) * 0.9;
  // The pointer brings a little light with it.
  if (uPointerAmt > 0.0) {
    vec2 pd = (vUv - uPointer) * vec2(uRes.x / uRes.y, 1.0);
    col += col * exp(-dot(pd, pd) / 0.04) * 0.55 * uPointerAmt;
  }
  outColor = vec4(col, 1.0);
}`;function S(t,u,f){const r=t.createShader(u);if(t.shaderSource(r,f),t.compileShader(r),!t.getShaderParameter(r,t.COMPILE_STATUS))throw new Error(t.getShaderInfoLog(r)??"shader");return r}function X(t,u,f=[.72,.5]){const r=t.querySelector("img"),i=t.querySelector("canvas");if(!r||!i)return()=>{};let e=null,n=0,c=!1,v=!1,h=0,g=0;const s={x:.5,y:.5,amt:0,target:0};let l={};const P=async()=>{v=!0;try{if(r.complete||await new Promise(d=>r.addEventListener("load",d,{once:!0})),await r.decode().catch(()=>{}),e=i.getContext("webgl2",{alpha:!1,antialias:!1,premultipliedAlpha:!1}),!e)return;const o=e.createProgram();if(e.attachShader(o,S(e,e.VERTEX_SHADER,F)),e.attachShader(o,S(e,e.FRAGMENT_SHADER,D)),e.linkProgram(o),!e.getProgramParameter(o,e.LINK_STATUS))return;e.useProgram(o);for(const d of["uTex","uRes","uImg","uFocus","uTime","uScene","uPointer","uPointerAmt"])l[d]=e.getUniformLocation(o,d);const a=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,a),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const A=e.getAttribLocation(o,"aPos");e.enableVertexAttribArray(A),e.vertexAttribPointer(A,2,e.FLOAT,!1,0,0);const _=e.createTexture();e.bindTexture(e.TEXTURE_2D,_),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,r),e.uniform1i(l.uTex,0),e.uniform2f(l.uImg,r.naturalWidth,r.naturalHeight),e.uniform2f(l.uFocus,f[0],f[1]),e.uniform1i(l.uScene,U.indexOf(u)),g=performance.now(),w(),t.classList.add("is-live"),c&&p(performance.now())}catch{e=null}},w=()=>{if(!e)return;const o=Math.max(1,Math.round(i.clientWidth)),a=Math.max(1,Math.round(i.clientHeight));(i.width!==o||i.height!==a)&&(i.width=o,i.height=a),e.viewport(0,0,o,a),e.uniform2f(l.uRes,o,a)},p=o=>{if(n=0,!e||!c||document.hidden||(n=requestAnimationFrame(p),o-h<32))return;const a=h?Math.min(.1,(o-h)/1e3):.033;h=o,s.amt+=(s.target-s.amt)*(1-Math.exp(-a*4)),e.uniform1f(l.uTime,(o-g)/1e3),e.uniform2f(l.uPointer,s.x,s.y),e.uniform1f(l.uPointerAmt,s.amt),e.drawArrays(e.TRIANGLE_STRIP,0,4)},T=new IntersectionObserver(([o])=>{c=o.isIntersecting,c&&!v&&P(),c&&e&&!n&&(n=requestAnimationFrame(p))},{rootMargin:"200px 0px"});T.observe(t);const E=new ResizeObserver(w);E.observe(i);const b=()=>{!document.hidden&&c&&e&&!n&&(n=requestAnimationFrame(p))};document.addEventListener("visibilitychange",b);const m=t.parentElement??t,y=o=>{const a=i.getBoundingClientRect();s.x=(o.clientX-a.left)/a.width,s.y=1-(o.clientY-a.top)/a.height,s.target=1},R=()=>s.target=0;return m.addEventListener("pointermove",y),m.addEventListener("pointerleave",R),()=>{T.disconnect(),E.disconnect(),cancelAnimationFrame(n),document.removeEventListener("visibilitychange",b),m.removeEventListener("pointermove",y),m.removeEventListener("pointerleave",R),e?.getExtension("WEBGL_lose_context")?.loseContext()}}k()&&(document.querySelectorAll("[data-render]").forEach(t=>{const u=t.querySelector("[data-render-frame]"),[f,r]=(t.dataset.focus||"0.72 0.5").split(" ").map(Number);if(X(t,t.dataset.scene,[f,r]),x.fromTo(u,{yPercent:-6,scale:1.1},{yPercent:6,scale:1.02,ease:"none",scrollTrigger:{trigger:t,start:"top bottom",end:"bottom top",scrub:!0}}),x.fromTo(t,{opacity:0,y:60},{opacity:1,y:0,duration:1.8,ease:"expo.out",scrollTrigger:{trigger:t,start:"top 90%",once:!0}}),!L())return;const i=x.quickTo(u,"rotationX",{duration:1.2,ease:"power3.out"}),e=x.quickTo(u,"rotationY",{duration:1.2,ease:"power3.out"}),n=t.parentElement;n.addEventListener("pointermove",c=>{const v=t.getBoundingClientRect();e(((c.clientX-v.left)/v.width-.5)*5),i(-((c.clientY-v.top)/v.height-.5)*4)}),n.addEventListener("pointerleave",()=>{i(0),e(0)})}),I.refresh());
