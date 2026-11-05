import{F as P,h as T,H as A,a as b,l as n,c as g,p as C,b as E,d as c}from"./pose.SvdEsfpd.js";const m=72,p=[{grid:1,dpr:1.75},{grid:.6,dpr:1.25},{grid:.4,dpr:1}],F=1200,S=2e3,L=22,M=1200,_=`#version 300 es
precision highp float;
precision highp int;
#define HIST ${m}
#define TAU 6.2831853

in vec2 aUv;
uniform mat4 uProj;
uniform mat4 uView;
uniform float uTime;
uniform float uRate;
uniform float uLines;
uniform float uAmp;
uniform float uPhase;
uniform vec3 uSize;      // half width, height scale, depth
uniform float uCenter;   // horizontal centre of the spectral mass
uniform vec2 uHist[HIST];

out float vE;
out float vH;
out float vCarrier;
out float vX;
out float vRow;
out float vViewZ;

uint pcg(uint v) {
  uint s = v * 747796405u + 2891336453u;
  uint w = ((s >> ((s >> 28u) + 4u)) ^ s) * 277803737u;
  return (w >> 22u) ^ w;
}
float h1(float i) { return float(pcg(uint(int(i) + 1000000))) * (1.0 / 4294967295.0); }
float h2(float x, float y) { return float(pcg(uint(int(x) + 1000000) ^ (pcg(uint(int(y) + 1000000)) * 3u))) * (1.0 / 4294967295.0); }

float n1(float x) {
  float i = floor(x);
  float f = fract(x);
  float u = f * f * (3.0 - 2.0 * f);
  return mix(h1(i), h1(i + 1.0), u);
}
float n2(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = h2(i.x, i.y);
  float b = h2(i.x + 1.0, i.y);
  float c = h2(i.x, i.y + 1.0);
  float d = h2(i.x + 1.0, i.y + 1.0);
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float spectrum(float x, float e) {
  // Phrases and pauses: long envelopes that leave quiet, almost flat slices between them.
  float phrase = smoothstep(0.28, 0.62, n1(e * 0.055 + 3.0));
  float syll = 0.45 + 0.55 * pow(abs(sin(e * 0.42 + n1(e * 0.11) * 3.0)), 1.6);

  float s = 0.0;
  for (int i = 0; i < 3; i++) {
    float fi = float(i);
    float c = uCenter + (n1(e * 0.045 + fi * 17.3) - 0.5) * (0.85 + fi * 0.25);
    float w = 0.035 + 0.065 * n1(e * 0.07 + fi * 7.1);
    float a = (1.0 - fi * 0.22) * (0.55 + 0.45 * n1(e * 0.16 + fi * 5.3));
    float d = x - c;
    s += a * exp(-d * d / (2.0 * w * w));
  }

  // Harmonic comb: voiced speech has evenly spaced harmonics, giving the ridges fine teeth.
  float f0 = 0.055 + 0.03 * n1(e * 0.03 + 9.0);
  float comb = pow(0.5 + 0.5 * cos((x + 1.0) * TAU / f0), 2.0);
  s *= mix(0.55, 1.0, comb);
  s *= phrase * syll;

  // Noise floor, always present.
  float floorN = 0.035 + 0.05 * n2(vec2(x * 46.0, e * 0.9));
  float mass = exp(-pow(x - uCenter, 2.0) * 2.4);
  return s * mass + floorN * (0.35 + 0.65 * mass);
}

void main() {
  float x = aUv.x * 2.0 - 1.0;
  float row = aUv.y * uLines;
  float e = uTime * uRate - row;

  float s = spectrum(x, e);

  float k = clamp(row - uPhase, 0.0, float(HIST - 2));
  int i0 = int(floor(k));
  vec2 hc = mix(uHist[i0], uHist[i0 + 1], fract(k));
  float dc = x - hc.x;
  float car = hc.y * (exp(-dc * dc / 0.00028) + 0.22 * exp(-dc * dc / 0.006));

  float birth = smoothstep(0.0, 2.6, row);
  float height = (s + car * 0.95) * uAmp * birth;
  vec3 pos = vec3(x * uSize.x, height * uSize.y, -aUv.y * uSize.z);
  vec4 view = uView * vec4(pos, 1.0);
  gl_Position = uProj * view;

  vE = e;
  vH = height;
  vCarrier = car * uAmp;
  vX = x;
  vRow = row;
  vViewZ = -view.z;
}
`,k=`#version 300 es
precision highp float;

in float vE;
in float vH;
in float vCarrier;
in float vX;
in float vRow;
in float vViewZ;

uniform vec3 uLineCol;
uniform vec3 uPeakCol;
uniform vec3 uCarrierCol;
uniform vec2 uFog;
uniform float uReveal;
uniform float uLineW;
uniform float uLines;
uniform float uOpacity;

out vec4 outColor;

void main() {
  float fw = max(fwidth(vE), 1e-4);
  float d = abs(fract(vE + 0.5) - 0.5);
  float line = 1.0 - smoothstep(fw * uLineW * 0.5, fw * (uLineW * 0.5 + 1.0), d);
  line *= 1.0 - smoothstep(0.3, 0.7, fw);

  float fog = 1.0 - smoothstep(uFog.x, uFog.y, vViewZ);
  float side = 1.0 - smoothstep(0.72, 0.98, abs(vX));
  float front = smoothstep(0.0, 1.8, vRow);
  float back = 1.0 - smoothstep(uLines * 0.78, uLines * 0.98, vRow);
  float reveal = 1.0 - smoothstep(uReveal, uReveal + 0.12, abs(vX));

  float peak = smoothstep(0.06, 0.62, vH);
  float carrier = smoothstep(0.06, 0.5, vCarrier);
  vec3 col = mix(uLineCol, uPeakCol, peak);
  col = mix(col, uCarrierCol, carrier);

  float a = line * fog * side * front * back * reveal * uOpacity;
  a *= 0.42 + 0.7 * peak + 0.75 * carrier;
  a = clamp(a, 0.0, 1.0);
  outColor = vec4(col * a, a);
}
`,x=w=>{const i=parseInt(w.slice(1),16);return[(i>>16&255)/255,(i>>8&255)/255,(i&255)/255]};class I{gl;canvas;program;mesh=null;indexCount=0;tier=0;perf={from:0,last:0,check:0,deltas:[]};watchdog=0;u={};proj=new Float32Array(16);view=new Float32Array(16);hist=new Float32Array(m*2);lastTick=0;raf=0;running=!1;visible=!0;t0=performance.now();width=1;height=1;compact;onFrequency;onSlow;intro=0;scroll=1;reveal=1.4;pointer={x:0,y:0,tx:0,ty:0,amp:0,active:!1,lastMove:-1e9};parallax={x:0,y:0};rate=5.2;lines=64;size=[1.85,.37,P];ready;constructor(i){this.canvas=i.canvas,this.compact=!!i.compact,this.onFrequency=i.onFrequency,this.onSlow=i.onSlow;const t=this.canvas.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!0,powerPreference:"high-performance"});if(!t)throw new Error("WebGL2 unavailable");this.gl=t,this.program=this.createProgram(_,k),this.ready=this.whenLinked().then(()=>this.setup())}whenLinked(){const i=this.gl,t=i.getExtension("KHR_parallel_shader_compile");return new Promise((e,r)=>{const o=()=>{if(t&&!i.getProgramParameter(this.program,t.COMPLETION_STATUS_KHR)){requestAnimationFrame(o);return}if(!i.getProgramParameter(this.program,i.LINK_STATUS)){r(new Error(`Link failed: ${i.getProgramInfoLog(this.program)}`));return}e()};o()})}setup(){const i=this.gl,t=["uProj","uView","uTime","uRate","uLines","uAmp","uPhase","uSize","uCenter","uHist","uLineCol","uPeakCol","uCarrierCol","uFog","uReveal","uLineW","uOpacity"];for(const e of t)this.u[e]=i.getUniformLocation(this.program,e);this.buildMesh(),i.useProgram(this.program),i.uniform3fv(this.u.uLineCol,x("#9aa1ab")),i.uniform3fv(this.u.uPeakCol,x("#d4ebff")),i.uniform3fv(this.u.uCarrierCol,x("#4d8bff")),i.uniform1f(this.u.uLineW,this.compact?.9:1);for(let e=0;e<m;e++)this.hist[e*2]=.4,this.hist[e*2+1]=0;this.resize()}createShader(i,t){const e=this.gl,r=e.createShader(i);return e.shaderSource(r,t),e.compileShader(r),r}createProgram(i,t){const e=this.gl,r=e.createProgram();return e.attachShader(r,this.createShader(e.VERTEX_SHADER,i)),e.attachShader(r,this.createShader(e.FRAGMENT_SHADER,t)),e.bindAttribLocation(r,0,"aUv"),e.linkProgram(r),r}buildMesh(){const i=this.gl;this.mesh&&(i.deleteVertexArray(this.mesh.vao),this.mesh.buffers.forEach(u=>i.deleteBuffer(u)));const{grid:t}=p[this.tier],e=Math.round((this.compact?200:360)*t),r=Math.round((this.compact?170:256)*t),{vao:o,buffers:a,count:s}=this.createGrid(e,r);this.mesh={vao:o,buffers:a},this.indexCount=s}createGrid(i,t){const e=this.gl,r=new Float32Array((i+1)*(t+1)*2);let o=0;for(let l=0;l<=t;l++)for(let f=0;f<=i;f++)r[o++]=f/i,r[o++]=l/t;const a=new Uint32Array(i*t*6);o=0;for(let l=0;l<t;l++)for(let f=0;f<i;f++){const v=l*(i+1)+f,y=v+1,d=v+i+1,R=d+1;a[o++]=v,a[o++]=d,a[o++]=y,a[o++]=y,a[o++]=d,a[o++]=R}const s=e.createVertexArray();e.bindVertexArray(s);const u=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,u),e.bufferData(e.ARRAY_BUFFER,r,e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0);const h=e.createBuffer();return e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,h),e.bufferData(e.ELEMENT_ARRAY_BUFFER,a,e.STATIC_DRAW),e.bindVertexArray(null),{vao:s,buffers:[u,h],count:a.length}}resize(){if(!this.indexCount)return;const i=Math.min(window.devicePixelRatio||1,this.compact?1.5:1.75,p[this.tier].dpr),t=this.canvas.getBoundingClientRect();this.width=Math.max(1,t.width),this.height=Math.max(1,t.height);const e=Math.round(this.width*i),r=Math.round(this.height*i);(this.canvas.width!==e||this.canvas.height!==r)&&(this.canvas.width=e,this.canvas.height=r),this.gl.viewport(0,0,e,r),this.running||this.render(performance.now())}setPointer(i,t){this.pointer.tx=i,this.pointer.ty=t,this.pointer.active=!0,this.pointer.lastMove=performance.now()}releasePointer(){this.pointer.active=!1}setVisible(i){this.visible=i,i?this.start():this.stop()}start(){if(this.running||!this.visible||!this.indexCount)return;this.running=!0,this.resetPerf();const i=t=>{this.running&&(this.render(t),this.measure(t),this.raf=requestAnimationFrame(i))};this.raf=requestAnimationFrame(i),this.watchdog=window.setInterval(()=>this.checkStall(),500)}stop(){this.running=!1,cancelAnimationFrame(this.raf),clearInterval(this.watchdog)}degrade(i=1){return this.tier>=p.length-1?!1:(this.tier=Math.min(p.length-1,this.tier+i),this.buildMesh(),this.resize(),this.resetPerf(),!0)}resetPerf(){const i=performance.now();this.perf={from:i+F,last:i,check:i,deltas:[]}}measure(i){const t=this.perf,e=i-t.last;if(t.last=i,i<t.from||(t.deltas.push(e),i-t.from<S))return;const r=t.deltas.sort((o,a)=>o-a)[t.deltas.length>>1];t.from=i,t.deltas=[],r>1e3/L&&this.onSlow?.(!1)}checkStall(){const i=performance.now(),t=i-this.perf.check>900;this.perf.check=i,!(t||document.hidden||i-this.perf.last<M)&&(this.perf.last=i,this.onSlow?.(!0))}horizonY(){return T(this.width,this.height)}currentPose(i){const t=this.compact?A:b,e=i<.5?4*i*i*i:1-Math.pow(-2*i+2,3)/2;return{eye:[n(c.eye[0],t.eye[0],e)+this.parallax.x*.08,n(c.eye[1],t.eye[1],e)+this.parallax.y*.04*e,n(c.eye[2],t.eye[2],e)],target:[n(c.target[0],t.target[0],e),n(c.target[1],t.target[1],e),n(c.target[2],t.target[2],e)],fov:n(c.fov,t.fov,e)}}updateCarrier(i,t){const e=this.pointer,r=i-e.lastMove>2600;if(!e.active||r){const s=Math.sin(t*.23)*.42+Math.sin(t*.61)*.14+.22;e.tx+=(s-e.tx)*.02,e.amp+=(.55-e.amp)*.02}else e.amp+=(1-e.amp)*.08;e.x+=(e.tx-e.x)*.14,e.y+=(e.ty-e.y)*.08,this.parallax.x+=(e.x-this.parallax.x)*.04,this.parallax.y+=((e.active&&!r?e.y:0)-this.parallax.y)*.04;const o=t*this.rate,a=Math.floor(o);if(a!==this.lastTick){const s=Math.min(m,Math.max(1,a-this.lastTick));this.hist.copyWithin(s*2,0,(m-s)*2);const u=this.screenToField(e.x);for(let h=0;h<s;h++)this.hist[h*2]=u,this.hist[h*2+1]=e.amp;this.lastTick=a,this.onFrequency?.(e.active&&!r?(e.x+1)/2:null)}}screenToField(i){const t=this.compact?A:b,e=Math.hypot(t.eye[1],t.eye[2]),r=Math.tan(t.fov*Math.PI/180/2)*(this.width/this.height)*e;return Math.max(-.98,Math.min(.98,i*r/this.size[0]))}render(i){const t=this.gl,e=(i-this.t0)/1e3+40;this.updateCarrier(i,e);const r=g(this.intro)*g(this.scroll),o=this.currentPose(r),a=this.width/this.height;C(this.proj,o.fov*Math.PI/180,a,.05,20),E(this.view,o.eye,o.target),t.clearColor(0,0,0,0),t.clearDepth(1),t.enable(t.DEPTH_TEST),t.depthFunc(t.LEQUAL),t.disable(t.BLEND),t.clear(t.COLOR_BUFFER_BIT|t.DEPTH_BUFFER_BIT),t.useProgram(this.program),t.uniformMatrix4fv(this.u.uProj,!1,this.proj),t.uniformMatrix4fv(this.u.uView,!1,this.view),t.uniform1f(this.u.uTime,e),t.uniform1f(this.u.uRate,this.rate),t.uniform1f(this.u.uLines,this.lines),t.uniform1f(this.u.uAmp,n(.02,1,r)),t.uniform1f(this.u.uPhase,e*this.rate-Math.floor(e*this.rate)),t.uniform3fv(this.u.uSize,this.size),t.uniform1f(this.u.uCenter,this.compact?.12:.26),t.uniform2fv(this.u.uHist,this.hist),t.uniform2f(this.u.uFog,1.2,this.compact?5.2:4.9),t.uniform1f(this.u.uReveal,this.reveal),t.uniform1f(this.u.uOpacity,g(r*1.6)),t.bindVertexArray(this.mesh.vao),t.drawElements(t.TRIANGLES,this.indexCount,t.UNSIGNED_INT,0),t.bindVertexArray(null)}dispose(){this.stop(),this.gl.getExtension("WEBGL_lose_context")?.loseContext()}}export{I as SignalField};
