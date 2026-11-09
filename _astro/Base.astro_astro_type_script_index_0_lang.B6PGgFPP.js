import{m as y,g as f,S as p,a as q,f as k,s as I,b as x,i as M}from"./motion.DjPieiA6.js";import{i as D}from"./design.BMsHflWH.js";function _(o=document){if(!y())return;const e=f.utils.toArray(o.querySelectorAll('[data-reveal="up"], [data-reveal="fade"]'));p.batch(e,{start:"top 88%",once:!0,onEnter:n=>{n.forEach((t,r)=>{const l=parseFloat(t.dataset.revealDelay??"0")+r*.07;f.to(t,{opacity:1,y:0,duration:1.2,delay:l,ease:"expo.out",clearProps:"transform"})})}}),o.querySelectorAll('[data-reveal="lines"]').forEach(n=>{const t=parseFloat(n.dataset.revealDelay??"0");q.create(n,{type:"lines",mask:"lines",aria:"none",linesClass:"split-line",autoSplit:!0,onSplit(r){return f.set(n,{visibility:"visible"}),f.from(r.lines,{yPercent:105,duration:1.25,delay:t,stagger:.085,ease:"expo.out",scrollTrigger:{trigger:n,start:"top 88%",once:!0}})}})}),o.querySelectorAll(".carrier").forEach(n=>{const t=n.querySelector(".carrier__line"),r=n.querySelector(".carrier__pulse"),l=f.timeline({scrollTrigger:{trigger:n,start:"top 92%",once:!0}});t&&l.to(t,{scaleX:1,duration:1.6,ease:"expo.inOut"}),r&&l.fromTo(r,{xPercent:-100,opacity:1},{xPercent:560,opacity:0,duration:1.8,ease:"power2.inOut"},"-=0.9")})}const h=200;function B(){if(!y()||!k())return;const o=[...document.querySelectorAll("[data-lens]")].map(i=>({el:i,chars:[],offs:[],v:[],live:!1,stale:!0}));if(!o.length)return;let e=-1e4,n=-1e4,t=0;const r=()=>{t=0;const i=o.map(a=>a.el.getBoundingClientRect()),u=[];o.forEach((a,d)=>{const c=i[d];if(!(e>c.left-h&&e<c.right+h&&n>c.top-h&&n<c.bottom+h)&&!a.live||!a.stale&&a.chars.length&&a.chars[0].isConnected)return;const v=[...a.el.querySelectorAll(".lc")];a.chars=v,a.offs=v.map(m=>{const g=m.getBoundingClientRect();return[g.left+g.width/2-c.left,g.top+g.height/2-c.top]}),a.v.length!==v.length&&(a.v=v.map(()=>0)),a.stale=!1,u.push(a)});for(const a of u)a.chars.forEach(d=>d.classList.add("is-lens"));let s=!1;o.forEach((a,d)=>{const c=i[d],b=e>c.left-h&&e<c.right+h&&n>c.top-h&&n<c.bottom+h;!b&&!a.live||!a.chars.length||(a.live=!1,a.chars.forEach((v,m)=>{const[g,F]=a.offs[m],R=b?Math.exp(-((e-c.left-g)**2+(n-c.top-F)**2)/(h*h)):0,E=a.v[m]+(R-a.v[m])*.14;Math.abs(R-E)>.003&&(s=!0),E>.003&&(a.live=!0),Math.abs(E-a.v[m])>5e-4&&v.style.setProperty("--lens",E.toFixed(3)),a.v[m]=E}))}),s&&l()},l=()=>{t||(t=requestAnimationFrame(r))};window.addEventListener("pointermove",i=>{i.pointerType==="mouse"&&(e=i.clientX,n=i.clientY,l())},{passive:!0}),window.addEventListener("scroll",l,{passive:!0}),window.addEventListener("resize",()=>o.forEach(i=>i.stale=!0)),document.fonts?.ready.then(()=>o.forEach(i=>i.stale=!0)),document.documentElement.addEventListener("pointerleave",()=>{e=n=-1e4,l()})}const Y=/^(\D*?)(\d+(?:[.,\u00a0 ]\d{3})*)([.,]\d+)?(\D*)$/,T="01<>/\\=+*#%ABCDEFGHIJKLMNOPQRSTUVWXYZ";function O(o){const e=o.trim().match(Y);if(!e)return null;const[,n,t,r="",l]=e;if(/^[A-Za-z]/.test(l))return null;const i=t.match(/[.,\u00a0 ]/)?.[0]??"";if(!r&&i&&t.split(i)[0]==="0")return null;const u=r?r[0]:"",s=t.split(i||"\0").join("");return{pre:n,value:+(s+(r?"."+r.slice(1):"")),decimals:r?r.length-1:0,group:i,point:u,post:l}}function P(o,e){const n=e.toFixed(o.decimals),[t,r]=n.split("."),l=o.group?t.replace(/\B(?=(\d{3})+(?!\d))/g,o.group):t;return o.pre+l+(r?o.point+r:"")+o.post}function U(o=document){y()&&o.querySelectorAll("[data-count]").forEach(e=>{const n=e.textContent??"";e.setAttribute("aria-label",n.trim());const t=O(n),r={n:0,k:0};if(t){e.textContent=P(t,0),p.create({trigger:e,start:"top 90%",once:!0,onEnter:()=>f.to(r,{n:t.value,duration:1.8,ease:"expo.out",onUpdate:()=>e.textContent=P(t,r.n),onComplete:()=>e.textContent=n})});return}const l=[...n],i=u=>l.map((s,a)=>s.trim()===""||a/l.length<u?s:T[Math.floor(Math.random()*T.length)]).join("");e.textContent=i(0),p.create({trigger:e,start:"top 90%",once:!0,onEnter:()=>f.to(r,{k:1,duration:1.1,ease:"power2.out",onUpdate:()=>e.textContent=i(r.k),onComplete:()=>e.textContent=n})})})}const A=20,w=8,S=6,N=950,L=1.7,z=130,$=`
attribute vec2 aCell;
uniform vec2 uRes;
uniform float uDpr;
uniform float uCell;
uniform float uScroll;
uniform float uTime;
uniform float uPointerAmt;
uniform float uVel;
uniform vec2 uTrail[${w}];
uniform vec3 uPing[${S}];
varying float vE;
varying float vRad;
varying float vSize;
varying float vAa;

void main() {
  // Screen position (device px, y down); bands and pings still live in document space.
  vec2 c = (aCell + 0.5) * uCell;
  float docY = c.y + uScroll;

  float R = ${z.toFixed(1)} * uDpr;
  float e = 0.0;
  for (int i = 0; i < ${w}; i++) {
    float w = pow(1.0 - float(i) / ${w.toFixed(1)}, 1.6);
    vec2 v = c - uTrail[i];
    e += w * exp(-dot(v, v) / (R * R)) * (i == 0 ? 1.0 : 0.45);
  }
  e *= uPointerAmt;

  for (int i = 0; i < ${S}; i++) {
    float age = uTime - uPing[i].z;
    if (age > 0.0 && age < ${L.toFixed(2)}) {
      vec2 at = uPing[i].xy - vec2(0.0, uScroll);
      float r = age * ${N.toFixed(1)} * uDpr;
      float dist = length(c - at);
      float w = uCell * 1.6;
      float life = 1.0 - age / ${L.toFixed(2)};
      e += exp(-pow((dist - r) / w, 2.0)) * life * life * 0.95;
      e += exp(-pow((dist - r * 0.72) / w, 2.0)) * life * life * 0.35;
    }
  }

  // Scrolling fast: thin scan bands sweep through the grid.
  float band = pow(0.5 + 0.5 * sin(docY * 0.011 / uDpr - uTime * 7.0), 10.0);
  e += abs(uVel) * 0.55 * band;

  e = clamp(e, 0.0, 1.0);
  vE = e;
  vRad = mix(0.7 * uDpr, uCell * 0.26, e);
  vSize = 2.0 * vRad + 2.0 * uDpr;
  vAa = 0.8 * uDpr;
  gl_PointSize = vSize;
  gl_Position = vec4(c.x / uRes.x * 2.0 - 1.0, 1.0 - c.y / uRes.y * 2.0, 0.0, 1.0);
}
`,V=`
precision mediump float;
// Uniforms shared with the vertex shader must match its precision, so the fragment stage
// takes what it needs as varyings instead.
uniform vec3 uInk;
uniform vec3 uAccent;
varying float vE;
varying float vRad;
varying float vSize;
varying float vAa;

void main() {
  float d = length(gl_PointCoord - 0.5) * vSize;
  float mask = 1.0 - smoothstep(vRad - vAa, vRad + vAa, d);
  float a = mask * (0.11 + 0.4 * vE);
  vec3 col = mix(uInk, uAccent, smoothstep(0.04, 0.45, vE));
  gl_FragColor = vec4(col * a, a);
}
`,C=o=>{const e=getComputedStyle(document.documentElement).getPropertyValue(o).trim(),[n,t,r]=e.split(/[\s,]+/).map(Number);return[n/255,t/255,r/255]};class G{constructor(e,n){this.canvas=e;const t=e.getContext("webgl",{alpha:!0,premultipliedAlpha:!0,antialias:!1,depth:!1});if(!t)throw new Error("WebGL unavailable");this.gl=t;const r=this.link();t.useProgram(r),this.buffer=t.createBuffer(),t.bindBuffer(t.ARRAY_BUFFER,this.buffer);const l=t.getAttribLocation(r,"aCell");t.enableVertexAttribArray(l),t.vertexAttribPointer(l,2,t.FLOAT,!1,0,0),t.enable(t.BLEND),t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA);for(const i of["uRes","uDpr","uCell","uScroll","uTime","uPointerAmt","uVel","uTrail","uPing","uInk","uAccent"])this.u[i]=t.getUniformLocation(r,i);if(this.colours(),this.resize(),n){const i=()=>this.coverBottom=n.getBoundingClientRect().bottom+window.scrollY;i(),new ResizeObserver(i).observe(n)}window.addEventListener("resize",()=>this.resize()),window.addEventListener("scroll",()=>this.wake(),{passive:!0}),window.addEventListener("pointermove",i=>{i.pointerType==="mouse"&&(this.pointer={x:i.clientX*this.dpr,y:i.clientY*this.dpr,inside:!0},this.wake())},{passive:!0}),document.documentElement.addEventListener("pointerleave",()=>{this.pointer.inside=!1,this.wake()}),window.addEventListener("pointerdown",i=>this.ping(i.clientX,i.clientY+window.scrollY)),document.addEventListener("visibilitychange",()=>{this.visible=!document.hidden,this.wake()}),document.addEventListener("designchange",()=>{this.colours(),this.dirty=!0,this.wake()})}canvas;gl;u={};buffer;count=0;dpr=1;raf=0;t0=performance.now();pointer={x:-1e4,y:-1e4,inside:!1};amt=0;trail=new Float32Array(w*2).fill(-1e4);pings=new Float32Array(S*3).fill(-10);nextPing=0;lastScroll=window.scrollY;vel=0;visible=!document.hidden;coverBottom=0;dirty=!0;wasCovered=!0;ping(e,n){const t=this.nextPing++%S;this.pings.set([e*this.dpr,n*this.dpr,this.now()],t*3),this.wake()}now=()=>(performance.now()-this.t0)/1e3;colours(){const e=this.gl;e.uniform3fv(this.u.uInk,C("--rgb-fg")),e.uniform3fv(this.u.uAccent,C("--rgb-signal"))}resize(){this.dpr=Math.min(window.devicePixelRatio||1,1.25);const e=Math.round(window.innerWidth*this.dpr),n=Math.round(window.innerHeight*this.dpr);this.canvas.width=e,this.canvas.height=n;const t=this.gl;t.viewport(0,0,e,n),t.uniform2f(this.u.uRes,e,n),t.uniform1f(this.u.uDpr,this.dpr),t.uniform1f(this.u.uCell,A*this.dpr);const r=Math.ceil(window.innerWidth/A)+1,l=Math.ceil(window.innerHeight/A)+1,i=new Float32Array(r*l*2);let u=0;for(let s=0;s<l;s++)for(let a=0;a<r;a++)i[u++]=a,i[u++]=s;t.bindBuffer(t.ARRAY_BUFFER,this.buffer),t.bufferData(t.ARRAY_BUFFER,i,t.STATIC_DRAW),this.count=r*l,this.dirty=!0,this.wake()}wake(){!this.raf&&this.visible&&(this.raf=requestAnimationFrame(this.frame))}frame=()=>{this.raf=0;const e=this.gl,n=this.now(),t=this.trail;t[0]+=(this.pointer.x-t[0])*.5,t[1]+=(this.pointer.y-t[1])*.5;for(let c=1;c<w;c++)t[c*2]+=(t[(c-1)*2]-t[c*2])*.32,t[c*2+1]+=(t[(c-1)*2+1]-t[c*2+1])*.32;this.amt+=((this.pointer.inside?1:0)-this.amt)*.08;const r=window.scrollY,l=Math.max(-1,Math.min(1,(r-this.lastScroll)/60));this.lastScroll=r,this.vel+=(l-this.vel)*.15;let i=0;for(let c=1;c<w;c++)i+=Math.abs(t[c*2]-t[0])+Math.abs(t[c*2+1]-t[1]);let u=!1;for(let c=0;c<S;c++)n-this.pings[c*3+2]<L&&(u=!0);const s=this.pointer.inside?1:0,a=i>.5||Math.abs(this.amt-s)>.01||Math.abs(this.vel)>.02||u,d=r+window.innerHeight*.92<this.coverBottom;this.wasCovered&&!d&&(this.dirty=!0),this.wasCovered=d,!d&&(a||this.dirty)&&(this.dirty=!1,e.uniform1f(this.u.uTime,n),e.uniform1f(this.u.uScroll,r*this.dpr),e.uniform1f(this.u.uPointerAmt,this.amt),e.uniform1f(this.u.uVel,this.vel),e.uniform2fv(this.u.uTrail,t),e.uniform3fv(this.u.uPing,this.pings),e.clearColor(0,0,0,0),e.clear(e.COLOR_BUFFER_BIT),e.drawArrays(e.POINTS,0,this.count)),a&&!d&&this.wake()};link(){const e=this.gl,n=(r,l)=>{const i=e.createShader(r);if(e.shaderSource(i,l),e.compileShader(i),!e.getShaderParameter(i,e.COMPILE_STATUS))throw new Error(e.getShaderInfoLog(i)??"shader");return i},t=e.createProgram();if(e.attachShader(t,n(e.VERTEX_SHADER,$)),e.attachShader(t,n(e.FRAGMENT_SHADER,V)),e.linkProgram(t),!e.getProgramParameter(t,e.LINK_STATUS))throw new Error(e.getProgramInfoLog(t)??"link");return t}}function H(){const o=document.documentElement;if(!o.classList.contains("motion")||document.querySelector(".live-field"))return;const e=document.createElement("canvas");e.className="live-field",e.setAttribute("aria-hidden","true"),document.body.prepend(e);try{new G(e,document.querySelector("[data-hero]")),o.classList.add("has-field")}catch{e.remove()}}function X(){!y()||!k()||document.querySelectorAll("[data-magnetic]").forEach(o=>{const e=parseFloat(o.dataset.magnetic||"0.3"),n=o.querySelector("[data-magnetic-inner]"),t=f.quickTo(o,"x",{duration:.9,ease:"power3.out"}),r=f.quickTo(o,"y",{duration:.9,ease:"power3.out"}),l=n?f.quickTo(n,"x",{duration:.9,ease:"power3.out"}):null,i=n?f.quickTo(n,"y",{duration:.9,ease:"power3.out"}):null;o.addEventListener("pointermove",u=>{const s=o.getBoundingClientRect(),a=u.clientX-(s.left+s.width/2),d=u.clientY-(s.top+s.height/2);t(a*e),r(d*e),l?.(a*e*.6),i?.(d*e*.6)}),o.addEventListener("pointerleave",()=>{t(0),r(0),l?.(0),i?.(0)})})}function W(){const o=x();if(!o)return;const e=[...document.querySelectorAll("h2[data-lens], h3[data-lens]")].map(n=>f.quickTo(n,"skewY",{duration:.7,ease:"power3.out"}));o.on("scroll",({velocity:n})=>{const t=Math.max(-3.5,Math.min(3.5,n*.12));e.forEach(r=>r(t))})}function K(){document.addEventListener("click",o=>{const e=o.target.closest('a[href*="#"]');if(!e)return;const n=new URL(e.href,location.href);if(n.pathname!==location.pathname||!n.hash)return;const t=document.getElementById(decodeURIComponent(n.hash.slice(1)));t&&(o.preventDefault(),I(t,0),history.pushState(null,"",n.hash),t.setAttribute("tabindex","-1"),t.focus({preventScroll:!0}))})}function j(){const o=document.querySelector("[data-nav]");if(!o)return;let e=window.scrollY;const n=()=>{const s=window.scrollY;o.dataset.scrolled=s>40?"true":"false",o.dataset.menu==="open"||(o.dataset.hidden=s>e&&s>260?"true":"false"),e=s},t=x();t?t.on("scroll",n):window.addEventListener("scroll",n,{passive:!0}),n();const r=o.querySelector("[data-menu-toggle]"),l=document.querySelector("[data-menu-panel]");if(!r||!l)return;const i=()=>Array.from(l.querySelectorAll("a, button")),u=s=>{o.dataset.menu=s?"open":"closed",l.dataset.open=s?"true":"false",r.setAttribute("aria-expanded",String(s));const a=r.querySelector("[data-open-label]");a&&(a.textContent=(s?a.dataset.openLabel:a.dataset.closedLabel)??""),l.inert=!s,document.documentElement.classList.toggle("menu-open",s);const d=x();s?(d?.stop(),y()&&f.fromTo(l.querySelectorAll("[data-menu-item]"),{yPercent:110},{yPercent:0,duration:1,stagger:.06,ease:"expo.out",delay:.15}),i()[0]?.focus({preventScroll:!0})):d?.start()};l.inert=!0,r.addEventListener("click",()=>u(o.dataset.menu!=="open")),l.addEventListener("click",s=>{s.target.closest("a")&&u(!1)}),document.addEventListener("keydown",s=>{if(o.dataset.menu==="open"&&(s.key==="Escape"&&(u(!1),r.focus()),s.key==="Tab")){const a=[r,...i()],d=a[0],c=a[a.length-1];s.shiftKey&&document.activeElement===d?(s.preventDefault(),c.focus()):!s.shiftKey&&document.activeElement===c&&(s.preventDefault(),d.focus())}}),window.matchMedia("(min-width: 64rem)").addEventListener("change",s=>s.matches&&u(!1))}function Z(){const o=document.querySelector("[data-rail]");if(!o)return;const e=Array.from(o.querySelectorAll("a[data-target]"));e.forEach(t=>{const r=document.getElementById(t.dataset.target);r&&p.create({trigger:r,start:"top 55%",end:"bottom 55%",onToggle:l=>{l.isActive&&(e.forEach(i=>i.removeAttribute("aria-current")),t.setAttribute("aria-current","true"))}})});const n=document.getElementById("top");n&&p.create({trigger:n,start:"bottom 70%",onEnter:()=>o.dataset.visible="true",onLeaveBack:()=>o.dataset.visible="false"})}function J(){const o=document.querySelector(".nav__progress span");o&&p.create({start:0,end:"max",onUpdate:e=>o.style.setProperty("--progress",e.progress.toFixed(4))})}function Q(){const o=document.querySelectorAll("[data-anim-scope]");if(!o.length||!("IntersectionObserver"in window))return;const e=new IntersectionObserver(n=>n.forEach(t=>t.target.dataset.offscreen=String(!t.isIntersecting)),{rootMargin:"200px 0px"});o.forEach(n=>e.observe(n))}function tt(){M(),j(),D(),K(),X(),H(),Z(),J(),Q(),_(),B(),U(),W(),document.documentElement.classList.add("booted"),y()&&document.fonts?.ready.then(()=>p.refresh())}tt();
