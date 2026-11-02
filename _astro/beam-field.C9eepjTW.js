const l=Math.PI/3,f=`
attribute vec2 aPos;
void main() { gl_Position = vec4(aPos, 0.0, 1.0); }
`,m=`
precision highp float;
uniform vec2 uRes;
uniform float uTime;
uniform float uCell;
uniform vec2 uOrigin;
uniform float uSin;
uniform float uK;
uniform float uReveal;
uniform float uDpr;
uniform float uAlpha;
uniform float uFade;
uniform float uFadeY;
uniform vec3 uInk;
uniform vec3 uAccent;

const float N = 8.0;

void main() {
  vec2 p = gl_FragCoord.xy;
  vec2 c = (floor(p / uCell) + 0.5) * uCell;
  vec2 v = c - uOrigin;
  float r = length(v);
  float sinPhi = v.x / max(r, 1.0);

  // Array factor for N elements at half-wavelength spacing, steered to sin(theta) = uSin.
  float psi = 3.14159265 * (sinPhi - uSin);
  float den = N * sin(0.5 * psi);
  float af = abs(den) < 1e-3 ? 1.0 : abs(sin(0.5 * N * psi) / den);
  float lobe = af * af;

  // Wavefronts travelling outward; the array itself stays quiet.
  float wave = 0.5 + 0.5 * cos(uK * r - uTime * 2.4);
  float e = lobe * (0.3 + 0.7 * wave) * smoothstep(uCell, uCell * 4.0, r);

  float rest = 0.85 * uDpr;
  float rad = rest + (uCell * 0.36 - rest) * e;
  float aa = 0.8 * uDpr;
  float dotMask = 1.0 - smoothstep(rad - aa, rad + aa, length(p - c));

  float reveal = 1.0 - smoothstep(uReveal - uCell * 8.0, uReveal, r);
  // Thinner under the headline on wide screens; on phones the field rises clear of the buttons.
  float fade = uFade > 0.0 ? smoothstep(0.0, uFade, p.x / uRes.x) : 1.0;
  float rise = uFadeY > 0.0 ? smoothstep(0.0, uFadeY, p.y / uRes.y) : 1.0;
  float a = dotMask * (0.13 + 0.8 * e) * reveal * uAlpha * mix(0.4, 1.0, fade) * rise;
  vec3 col = mix(uInk, uAccent, smoothstep(0.05, 0.5, e));
  gl_FragColor = vec4(col * a, a);
}
`,u=o=>{const e=getComputedStyle(document.documentElement).getPropertyValue(o).trim(),[t,i,a]=e.split(/[\s,]+/).map(Number);return[t/255,i/255,a/255]};class g{gl;canvas;program;u={};compact;onAngle;raf=0;running=!1;visible=!0;t0=performance.now();width=1;height=1;dpr=1;angle=0;target=0;pointer={active:!1,last:-1e9};reported={deg:NaN,steered:!1};intro=0;scroll=1;reveal=1;ready;constructor(e){this.canvas=e.canvas,this.compact=!!e.compact,this.onAngle=e.onAngle;const t=this.canvas.getContext("webgl",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1});if(!t)throw new Error("WebGL unavailable");this.gl=t,this.program=this.link();const i=t.createBuffer();t.bindBuffer(t.ARRAY_BUFFER,i),t.bufferData(t.ARRAY_BUFFER,new Float32Array([-1,-1,3,-1,-1,3]),t.STATIC_DRAW),t.useProgram(this.program);const a=t.getAttribLocation(this.program,"aPos");t.enableVertexAttribArray(a),t.vertexAttribPointer(a,2,t.FLOAT,!1,0,0);for(const s of["uRes","uTime","uCell","uOrigin","uSin","uK","uReveal","uDpr","uAlpha","uFade","uFadeY","uInk","uAccent"])this.u[s]=t.getUniformLocation(this.program,s);t.uniform3fv(this.u.uInk,u("--rgb-fg")),t.uniform3fv(this.u.uAccent,u("--rgb-signal")),this.ready=Promise.resolve().then(()=>this.resize())}link(){const e=this.gl,t=(a,s)=>{const r=e.createShader(a);return e.shaderSource(r,s),e.compileShader(r),r},i=e.createProgram();if(e.attachShader(i,t(e.VERTEX_SHADER,f)),e.attachShader(i,t(e.FRAGMENT_SHADER,m)),e.linkProgram(i),!e.getProgramParameter(i,e.LINK_STATUS))throw new Error(`Link failed: ${e.getProgramInfoLog(i)}`);return i}get cell(){return this.compact?15:18}origin(){return{x:this.width*(this.compact?.5:.64),y:-this.cell*1.5}}resize(){this.dpr=Math.min(window.devicePixelRatio||1,this.compact?1.5:2);const e=this.canvas.getBoundingClientRect();this.width=Math.max(1,e.width),this.height=Math.max(1,e.height);const t=Math.round(this.width*this.dpr),i=Math.round(this.height*this.dpr);(this.canvas.width!==t||this.canvas.height!==i)&&(this.canvas.width=t,this.canvas.height=i),this.gl.viewport(0,0,t,i),this.running||this.render(performance.now())}setPointer(e,t){const i=this.origin(),a=(e+1)/2*this.width-i.x,s=(t+1)/2*this.height-i.y;this.target=Math.max(-l,Math.min(l,Math.atan2(a,s))),this.pointer.active=!0,this.pointer.last=performance.now()}releasePointer(){this.pointer.active=!1}setVisible(e){this.visible=e,e?this.start():this.stop()}start(){if(this.running||!this.visible)return;this.running=!0;const e=t=>{this.running&&(this.render(t),this.raf=requestAnimationFrame(e))};this.raf=requestAnimationFrame(e)}stop(){this.running=!1,cancelAnimationFrame(this.raf)}render(e){const t=this.gl,i=(e-this.t0)/1e3,a=this.pointer.active&&e-this.pointer.last<2600;a||(this.target=.62*Math.sin(i*.21)+.18*Math.sin(i*.57)),this.angle+=(this.target-this.angle)*(a?.12:.03);const s=Math.round(this.angle*180/Math.PI);(s!==this.reported.deg||a!==this.reported.steered)&&(this.reported={deg:s,steered:a},this.onAngle?.(s,a));const r=this.dpr,n=this.cell*r,h=this.origin(),c=Math.min(1,Math.max(0,this.intro));t.uniform2f(this.u.uRes,this.width*r,this.height*r),t.uniform1f(this.u.uTime,i),t.uniform1f(this.u.uCell,n),t.uniform2f(this.u.uOrigin,h.x*r,h.y*r),t.uniform1f(this.u.uSin,Math.sin(this.angle)),t.uniform1f(this.u.uK,2*Math.PI/(5.5*n)),t.uniform1f(this.u.uReveal,c*Math.hypot(this.width,this.height)*r*1.15),t.uniform1f(this.u.uDpr,r),t.uniform1f(this.u.uAlpha,.35+.65*Math.min(1,Math.max(0,this.scroll))),t.uniform1f(this.u.uFade,this.compact?0:.5),t.uniform1f(this.u.uFadeY,this.compact?.42:0),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.drawArrays(t.TRIANGLES,0,3)}dispose(){this.stop(),this.gl.getExtension("WEBGL_lose_context")?.loseContext()}}export{g as BeamField};
