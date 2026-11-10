import{m as F,g as x,f as q,S as M}from"./motion.DjPieiA6.js";import{c as X}from"./design.DIzsER-1.js";const B=["voice","network","health","research","ai","about","expertise"],C={night:{voice:[.49,.22,.94,0],network:[.674,.468,.272,0],health:[.7,.56,.555,0],research:[.67,.5,0,0],ai:[0,0,0,0],about:[.18,0,0,0],expertise:[0,0,0,0]},day:{voice:[.52,.4,.9,0],network:[.7,.478,.254,0],health:[.7,.52,.557,0],research:[.713,.5,0,0],ai:[0,0,0,0],about:[.6,0,0,0],expertise:[0,0,0,0]}},N=[1.026,1.056,1.077],O=`#version 300 es
in vec2 aPos;
out vec2 vUv;
void main() {
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,z=`#version 300 es
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
uniform float uDay;
uniform vec4 uGeo;
uniform vec3 uGain;

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
    // Voice: the ribbon speaks. Its peaks swell and shrink like the loudness of a voice
    // (syllables running along it), a wave travels through the glass, two lights chase each
    // other down it and beads of light stream along.
    float cy = uGeo.x;
    float band = smoothstep(uGeo.y, uGeo.y + 0.28, iuv.x) * (1.0 - smoothstep(uGeo.z, uGeo.z + 0.06, iuv.x));
    float win = exp(-pow((iuv.y - cy) / 0.3, 2.0));
    float syll = 0.5 + 0.5 * sin(iuv.x * 7.0 - t * 2.4) * sin(t * 0.9 + iuv.x * 2.0);
    float amp = 1.0 + (syll - 0.35) * 0.36 * band;
    duv.y += (iuv.y - cy) * (1.0 / amp - 1.0) * win;
    duv.y += sin(iuv.x * 13.0 - t * 2.2) * 0.012 * band * win;
    duv.x += sin(iuv.y * 9.0 + t * 1.3) * 0.003 * band * win;
    float head = fract(t * 0.22) * 1.3 - 0.15;
    float head2 = fract(t * 0.22 + 0.5) * 1.3 - 0.15;
    sweep = (exp(-pow((iuv.x - head) / 0.05, 2.0)) + 0.6 * exp(-pow((iuv.x - head2) / 0.03, 2.0))) * win;
    sweep += twinkle(vec2(iuv.x - t * 0.06, iuv.y), vec2(120.0, 80.0), 2.0, 0.9, ar) * 1.6 * win;
    sweep += syll * 0.25 * band * win;
  } else if (uScene == 1) {
    // Network: the globe sways on its axis (a disc remapped onto a rotating sphere).
    vec2 c = uGeo.xy;
    float rad = uGeo.z * ar;
    vec2 d = (iuv - c) * vec2(ar, 1.0) / rad;
    float r2 = dot(d, d);
    if (r2 < 1.0) {
      vec3 p = vec3(d, sqrt(1.0 - r2));
      float a = sin(t * 0.22) * 0.22;
      vec3 q = vec3(p.x * cos(a) + p.z * sin(a), p.y, -p.x * sin(a) + p.z * cos(a));
      float edge = smoothstep(1.0, 0.86, sqrt(r2));
      duv += (q.xy - d) * rad / vec2(ar, 1.0) * edge;
    }
    // Flashes running between cities.
    sweep = pow(noise(iuv * 7.0 + vec2(t * 0.35, -t * 0.2)), 7.0) * 3.0 * step(r2, 1.1);
  } else if (uScene == 2) {
    // Health: lub-dub. The heart swells on each beat; the cardiogram lights up with it.
    float ph = mod(t, 1.15);
    float beat = exp(-pow((ph - 0.06) / 0.05, 2.0)) + 0.6 * exp(-pow((ph - 0.3) / 0.05, 2.0));
    vec2 hc = uGeo.xy;
    vec2 hd = (iuv - hc) * vec2(ar, 1.0);
    float inHeart = smoothstep(0.42, 0.1, length(hd * vec2(1.25, 0.9)));
    duv -= (iuv - hc) * beat * 0.022 * inHeart;
    float line = exp(-pow((iuv.y - uGeo.z) / 0.03, 2.0));
    float head = ph / 1.15 * 1.4 - 0.2;
    sweep = line * (exp(-pow((iuv.x - head) / 0.06, 2.0)) + beat * 0.6);
  } else if (uScene == 3) {
    // Research: field rings expand from the insulator; discharges flicker inside it.
    vec2 rc = uGeo.xy;
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
    float x0 = uGeo.x;
    float head = fract(t * 0.2) * (1.05 - x0) + x0;
    sweep = exp(-pow((iuv.x - head) / 0.05, 2.0)) * smoothstep(x0, x0 + 0.2, iuv.x);
    sweep += pow(noise(iuv * 8.0 - vec2(t * 0.55, 0.0)), 6.0) * 2.6 * smoothstep(x0 + 0.25, x0 + 0.5, iuv.x);
    duv.y += sin(iuv.x * 9.0 - t * 1.4) * 0.006 * smoothstep(x0, x0 + 0.35, iuv.x) * step(0.55, iuv.y);
  } else if (uDay > 0.5) {
    // Capabilities by day: a light rises through the slabs.
    float head = 1.0 - fract(t * 0.3) * 1.2;
    sweep = exp(-pow((iuv.y - head) / 0.05, 2.0)) * 1.4;
  }

  vec3 col = texture(uTex, iuv + duv).rgb * uGain;
  if (uScene == 6 && uDay < 0.5) {
    // Capabilities by night: each glass slab is lit up to its own level, rising and falling
    // like the bars of a live spectrum analyser (reflections follow).
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

  float f = noise(iuv * 42.0 + vec2(t * 0.9, -t * 0.55));
  float sp = twinkle(iuv, vec2(300.0, 200.0), 5.0, 0.985, ar);
  float near = 0.0;
  if (uPointerAmt > 0.0) {
    vec2 pd = (vUv - uPointer) * vec2(uRes.x / uRes.y, 1.0);
    near = exp(-dot(pd, pd) / 0.04) * uPointerAmt;
  }

  if (uDay > 0.5) {
    // Day: the blue glass is what lives. It flickers, catches the travelling light as a pale
    // glint, and sparkles; the paper around it stays still.
    float ink = smoothstep(0.05, 0.32, col.b - col.r);
    col = mix(col, col * (0.8 + 0.42 * f), ink);
    vec3 glint = vec3(0.86, 0.94, 1.0);
    col = mix(col, glint, clamp(sweep, 0.0, 1.0) * ink * 0.6);
    col = mix(col, vec3(1.0), sp * ink * 0.9);
    col = mix(col, glint, near * ink * 0.4);
  } else {
    // Night: light is added. Bright parts flicker and flow, the travelling light adds blue,
    // a few points twinkle and the pointer brings a little light with it.
    float L = lum(col);
    float bright = smoothstep(0.18, 0.75, L);
    col += col * bright * (f - 0.45) * 0.6;
    col += vec3(0.55, 0.78, 1.0) * sweep * bright * 0.85;
    col += sp * smoothstep(0.3, 0.8, L) * 0.9;
    col += col * near * 0.55;
  }
  outColor = vec4(col, 1.0);
}`;function L(t,l,v){const a=t.createShader(l);if(t.shaderSource(a,v),t.compileShader(a),!t.getShaderParameter(a,t.COMPILE_STATUS))throw new Error(t.getShaderInfoLog(a)??"shader");return a}const W=["uTex","uRes","uImg","uFocus","uTime","uScene","uPointer","uPointerAmt","uDay","uGeo","uGain"];function H(t,l,v){const a=t.querySelector("canvas"),d={night:t.querySelector('[data-series="night"] img, img[data-series="night"]')??t.querySelector("img"),day:t.querySelector('[data-series="day"] img, img[data-series="day"]')};if(!d.night||!a)return()=>{};let e=null,u=null,r=0,f=!1,w=!1,p=0,T=0,b=0;const s={x:.5,y:.5,amt:0,target:0},n={},I=()=>X()==="light"&&d.day?"day":"night",E=async()=>{if(!e)return;const o=++b,i=I(),c=d[i];if((!c.complete||!c.naturalWidth)&&await new Promise(U=>c.addEventListener("load",U,{once:!0})),await c.decode().catch(()=>{}),o!==b||!e)return;e.bindTexture(e.TEXTURE_2D,u),e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,c),e.uniform2f(n.uImg,c.naturalWidth,c.naturalHeight),e.uniform2f(n.uFocus,v[i][0],v[i][1]),e.uniform1f(n.uDay,i==="day"?1:0);const h=C[i][l];e.uniform4f(n.uGeo,h[0],h[1],h[2],h[3]);const y=i==="day"?N:[1,1,1];e.uniform3f(n.uGain,y[0],y[1],y[2]),t.classList.add("is-live"),f&&!r&&(r=requestAnimationFrame(m))},D=async()=>{w=!0;try{if(e=a.getContext("webgl2",{alpha:!1,antialias:!1,premultipliedAlpha:!1}),!e)return;const o=e.createProgram();if(e.attachShader(o,L(e,e.VERTEX_SHADER,O)),e.attachShader(o,L(e,e.FRAGMENT_SHADER,z)),e.linkProgram(o),!e.getProgramParameter(o,e.LINK_STATUS)){e=null;return}e.useProgram(o);for(const h of W)n[h]=e.getUniformLocation(o,h);const i=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,i),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW);const c=e.getAttribLocation(o,"aPos");e.enableVertexAttribArray(c),e.vertexAttribPointer(c,2,e.FLOAT,!1,0,0),u=e.createTexture(),e.bindTexture(e.TEXTURE_2D,u),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.uniform1i(n.uTex,0),e.uniform1i(n.uScene,B.indexOf(l)),T=performance.now(),R(),await E()}catch{e=null}},R=()=>{if(!e)return;const o=Math.max(1,Math.round(a.clientWidth)),i=Math.max(1,Math.round(a.clientHeight));(a.width!==o||a.height!==i)&&(a.width=o,a.height=i),e.viewport(0,0,o,i),e.uniform2f(n.uRes,o,i)},m=o=>{if(r=0,!e||!f||document.hidden||(r=requestAnimationFrame(m),o-p<32))return;const i=p?Math.min(.1,(o-p)/1e3):.033;p=o,s.amt+=(s.target-s.amt)*(1-Math.exp(-i*4)),e.uniform1f(n.uTime,(o-T)/1e3),e.uniform2f(n.uPointer,s.x,s.y),e.uniform1f(n.uPointerAmt,s.amt),e.drawArrays(e.TRIANGLE_STRIP,0,4)},A=new IntersectionObserver(([o])=>{f=o.isIntersecting,f&&!w&&D(),f&&e&&!r&&(r=requestAnimationFrame(m))},{rootMargin:"200px 0px"});A.observe(t);const S=new ResizeObserver(R);S.observe(a);const k=()=>{!document.hidden&&f&&e&&!r&&(r=requestAnimationFrame(m))};document.addEventListener("visibilitychange",k);const P=()=>{e&&(t.classList.remove("is-live"),E())};document.addEventListener("designchange",P);const g=t.parentElement??t,_=o=>{const i=a.getBoundingClientRect();s.x=(o.clientX-i.left)/i.width,s.y=1-(o.clientY-i.top)/i.height,s.target=1},G=()=>s.target=0;return g.addEventListener("pointermove",_),g.addEventListener("pointerleave",G),()=>{A.disconnect(),S.disconnect(),cancelAnimationFrame(r),document.removeEventListener("visibilitychange",k),document.removeEventListener("designchange",P),g.removeEventListener("pointermove",_),g.removeEventListener("pointerleave",G),e?.getExtension("WEBGL_lose_context")?.loseContext()}}F()&&(document.querySelectorAll("[data-render]").forEach(t=>{const l=t.querySelector("[data-render-frame]"),v=u=>(u||"0.72 0.5").split(" ").map(Number);if(H(t,t.dataset.scene,{night:v(t.dataset.focus),day:v(t.dataset.focusDay)}),x.fromTo(l,{yPercent:-6,scale:1.1},{yPercent:6,scale:1.02,ease:"none",scrollTrigger:{trigger:t,start:"top bottom",end:"bottom top",scrub:!0}}),x.fromTo(t,{opacity:0,y:60},{opacity:1,y:0,duration:1.8,ease:"expo.out",scrollTrigger:{trigger:t,start:"top 90%",once:!0}}),!q())return;const a=x.quickTo(l,"rotationX",{duration:1.2,ease:"power3.out"}),d=x.quickTo(l,"rotationY",{duration:1.2,ease:"power3.out"}),e=t.parentElement;e.addEventListener("pointermove",u=>{const r=t.getBoundingClientRect();d(((u.clientX-r.left)/r.width-.5)*5),a(-((u.clientY-r.top)/r.height-.5)*4)}),e.addEventListener("pointerleave",()=>{a(0),d(0)})}),M.refresh());
