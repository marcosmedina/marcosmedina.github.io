function U(s,t,o,i,c){const h=1/Math.tan(t/2),e=1/(i-c);return s.fill(0),s[0]=h/o,s[5]=h,s[10]=(c+i)*e,s[11]=-1,s[14]=2*c*i*e,s}function C(s,t,o,i=[0,1,0]){let c=t[0]-o[0],h=t[1]-o[1],e=t[2]-o[2],a=Math.hypot(c,h,e)||1;c/=a,h/=a,e/=a;let l=i[1]*e-i[2]*h,p=i[2]*c-i[0]*e,n=i[0]*h-i[1]*c;a=Math.hypot(l,p,n)||1,l/=a,p/=a,n/=a;const u=h*n-e*p,f=e*l-c*n,r=c*p-h*l;return s[0]=l,s[1]=u,s[2]=c,s[3]=0,s[4]=p,s[5]=f,s[6]=h,s[7]=0,s[8]=n,s[9]=r,s[10]=e,s[11]=0,s[12]=-(l*t[0]+p*t[1]+n*t[2]),s[13]=-(u*t[0]+f*t[1]+r*t[2]),s[14]=-(c*t[0]+h*t[1]+e*t[2]),s[15]=1,s}const E=["core","layers","voice","network","health","field","graph","star","galaxy"];function D(s){let t=s>>>0;return()=>{t=t+1831565813>>>0;let o=t;return o=Math.imul(o^o>>>15,o|1),o^=o+Math.imul(o^o>>>7,o|61),((o^o>>>14)>>>0)/4294967296}}const M=s=>{const t=Math.max(1e-6,s());return Math.sqrt(-2*Math.log(t))*Math.cos(2*Math.PI*s())};class X{constructor(t,o,i){this.out=t,this.tan=o,this.n=i}out;tan;n;i=0;get left(){return this.n-this.i}put(t,o,i,c,h=0,e=0,a=0,l=1){if(this.i>=this.n)return;const p=this.i*4;this.out[p]=t,this.out[p+1]=o,this.out[p+2]=i,this.out[p+3]=c;const n=Math.hypot(h,e,a);n>1e-6&&(this.tan[p]=h/n,this.tan[p+1]=e/n,this.tan[p+2]=a/n,this.tan[p+3]=l),this.i++}}const G=(s,t,o,i)=>{const c=1-i;return[c*c*s[0]+2*c*i*t[0]+i*i*o[0],c*c*s[1]+2*c*i*t[1]+i*i*o[1],c*c*s[2]+2*c*i*t[2]+i*i*o[2]]},F=(s,t)=>Math.hypot(s[0]-t[0],s[1]-t[1],s[2]-t[2]);function O(s,t,o,i,c){const h=o.map(([l,p])=>F(l,p)),e=h.reduce((l,p)=>l+p,0)||1,a=c.groups??64;o.forEach(([l,p],n)=>{const u=h[n],f=[(l[0]+p[0])/2,(l[1]+p[1])/2,(l[2]+p[2])/2],r=[f[0]+M(t)*c.bow*u,f[1]+M(t)*c.bow*u,f[2]+M(t)*c.bow*u],m=Math.floor(t()*a),d=Math.max(2,Math.round(i*u/e));for(let v=0;v<d;v++){const x=t(),b=G(l,r,p,x),P=c.jitter,g=1-x,y=[2*g*(r[0]-l[0])+2*x*(p[0]-r[0]),2*g*(r[1]-l[1])+2*x*(p[1]-r[1]),2*g*(r[2]-l[2])+2*x*(p[2]-r[2])];s.put(b[0]+M(t)*P,b[1]+M(t)*P,b[2]+M(t)*P,m+Math.min(x,.999),y[0],y[1],y[2])}})}function I(s,t,o,i,c,h=.22){for(let e=0;e<o;e++){const a=t()*2-1,l=t()*Math.PI*2,p=i+(c-i)*Math.pow(t(),.6),n=Math.sqrt(1-a*a);s.put(Math.cos(l)*n*p,a*p*.8,Math.sin(l)*n*p,-h*(.4+.6*t()),-Math.sin(l),0,Math.cos(l),.6)}}function S(s,t){const o=s.i;for(;s.left>0;){const i=Math.floor(t()*o)*4;s.put(s.out[i],s.out[i+1],s.out[i+2],s.out[i+3],s.tan[i],s.tan[i+1],s.tan[i+2],s.tan[i+3])}}function V(s,t){const o=new Set,i=[];return s.forEach((c,h)=>{const e=s.map((a,l)=>[l,F(c,a)]).filter(([a])=>a!==h);e.sort((a,l)=>a[1]-l[1]);for(let a=0;a<t;a++){const l=e[a][0],p=h<l?`${h}-${l}`:`${l}-${h}`;o.has(p)||(o.add(p),i.push([h,l]))}}),i}function j(s,t,o){const i=s>=0?1:-1;let h=i*.5+s*.58,e=t*.74;const a=o*1.05;return e<-.36&&(e=-.36+(e+.36)*.35),i*h<.05&&(h=i*.05),[h,e+.06,a]}function W(s,t){const o=s.n,i=64,c=Math.round(o*.56),h=Math.floor(c/i);for(let n=0;n<i;n++){let u=t()*2-1,f=t()*Math.PI*2,r=[Math.sqrt(1-u*u)*Math.cos(f),u,Math.sqrt(1-u*u)*Math.sin(f)],m=[-r[2],0,r[0]];const d=n%64,v=140,x=[];for(let b=0;b<v;b++){const P=Math.sin(b*.35+n)*.9+M(t)*.35,g=Math.cos(P),y=Math.sin(P),R=[r[1]*m[2]-r[2]*m[1],r[2]*m[0]-r[0]*m[2],r[0]*m[1]-r[1]*m[0]];m=[m[0]*g+R[0]*y,m[1]*g+R[1]*y,m[2]*g+R[2]*y],r=[r[0]+m[0]*.035,r[1]+m[1]*.035,r[2]+m[2]*.035];const z=Math.hypot(r[0],r[1],r[2]);r=[r[0]/z,r[1]/z,r[2]/z];const w=m[0]*r[0]+m[1]*r[1]+m[2]*r[2];m=[m[0]-w*r[0],m[1]-w*r[1],m[2]-w*r[2]];const A=Math.hypot(m[0],m[1],m[2])||1;m=[m[0]/A,m[1]/A,m[2]/A],x.push(j(r[0],r[1],r[2]))}for(let b=0;b<h;b++){const P=t(),g=P*(x.length-1),y=Math.floor(g),R=Math.min(x.length-1,y+1),z=g-y,w=x[y],A=x[R],k=.0028;s.put(w[0]+(A[0]-w[0])*z+M(t)*k,w[1]+(A[1]-w[1])*z+M(t)*k,w[2]+(A[2]-w[2])*z+M(t)*k,d+Math.min(P,.999),A[0]-w[0],A[1]-w[1],A[2]-w[2])}}const e=[];for(;e.length<56;){const n=t()*2-1,u=t()*2-1,f=t()*2-1;n*n+u*u+f*f>.8||e.push(j(n,u,f))}const a=Math.round(o*.03);for(let n=0;n<a;n++){const u=e[n%e.length],f=.018;s.put(u[0]+M(t)*f,u[1]+M(t)*f,u[2]+M(t)*f,-(.6+.2*t()))}const l=V(e,3).map(([n,u])=>[e[n],e[u]]);O(s,t,l,Math.round(o*.22),{bow:.25,jitter:.004});const p=Math.round(o*.04);for(let n=0;n<p;n++){const u=t(),f=-.25-u*.75,r=-.15-u*.25+Math.sin(u*3)*.04,m=.1*(1-u*.5),d=t()*Math.PI*2;s.put(Math.cos(d)*m,f,r+Math.sin(d)*m,40+Math.min(1-u,.999),0,-1,-.25)}I(s,t,s.left,1.4,2.6),S(s,t)}function H(s,t){const o=[14,22,26,22,8],i=o.map((e,a)=>{const l=-1.25+2.5*a/(o.length-1);return Array.from({length:e},(p,n)=>{const u=n/e*Math.PI*2+a*.4,f=.25+.6*Math.sqrt(n%7/7+.1);return[l,Math.sin(u)*f,Math.cos(u)*f*.8]})}),c=s.n;i.flat().forEach(e=>{for(let a=0;a<Math.round(c*.18/92);a++)s.put(e[0]+M(t)*.02,e[1]+M(t)*.02,e[2]+M(t)*.02,-(.7+.3*t()))});const h=[];for(let e=0;e<i.length-1;e++)for(const a of i[e])for(let l=0;l<4;l++)h.push([a,i[e+1][Math.floor(t()*i[e+1].length)]]);O(s,t,h,Math.round(c*.66),{bow:.05,jitter:.004,groups:8}),I(s,t,s.left,1.4,2.6),S(s,t)}function $(s,t){const i=s.n,c=Math.floor(i*.84/46);for(let h=0;h<46;h++){const e=-1.1+2.2*h/45,a=h*.37,l=.35+.65*Math.pow(Math.abs(Math.sin(h*.21+.6)),1.4),p=-.25+.35*Math.sin(a*.7),n=.35+.25*Math.cos(a*.5);for(let u=0;u<c;u++){const f=u/c,r=-1.35+2.7*f,m=Math.exp(-((r-p)**2)/.03)+.7*Math.exp(-((r-n)**2)/.05)+.25*Math.exp(-((r+.8)**2)/.02),d=.6+.4*Math.pow(.5+.5*Math.cos(r*70),2),v=-.45+m*d*l*.75+M(t)*.004;s.put(r,v,e,h%64+Math.min(f,.999),1,0,0)}}I(s,t,s.left,1.4,2.6),S(s,t)}function K(s,t){const i=s.n,c=Math.min(2400,Math.round(i*.12)),h=Math.PI*(3-Math.sqrt(5)),e=[];for(let n=0;n<c;n++){const u=1-n/(c-1)*2,f=Math.sqrt(1-u*u),r=h*n,m=[Math.cos(r)*f*.95,u*.95,Math.sin(r)*f*.95];e.push(m),s.put(m[0],m[1],m[2],-(.55+.45*t()))}const a=Math.round(i*.3);for(let n=0;n<a;n++){const u=t();if(n%2){const f=Math.floor(t()*12)/12*Math.PI*2,r=u*Math.PI;s.put(Math.sin(r)*Math.cos(f)*.95,Math.cos(r)*.95,Math.sin(r)*Math.sin(f)*.95,-.18,Math.cos(r)*Math.cos(f),-Math.sin(r),Math.cos(r)*Math.sin(f),.5)}else{const f=(Math.floor(t()*7)+1)/8*Math.PI,r=u*Math.PI*2;s.put(Math.sin(f)*Math.cos(r)*.95,Math.cos(f)*.95,Math.sin(f)*Math.sin(r)*.95,-.18,-Math.sin(r),0,Math.cos(r),.5)}}const l=70,p=Math.floor(i*.42/l);for(let n=0;n<l;n++){const u=e[Math.floor(t()*e.length)],f=e[Math.floor(t()*e.length)],r=n%64;for(let m=0;m<p;m++){const d=m/p,v=u[0]+(f[0]-u[0])*d,x=u[1]+(f[1]-u[1])*d,b=u[2]+(f[2]-u[2])*d,P=Math.hypot(v,x,b)||1,g=.95+.32*Math.sin(Math.PI*d)*Math.min(1,F(u,f));s.put(v/P*g,x/P*g,b/P*g,r+Math.min(d,.999),f[0]-u[0],f[1]-u[1],f[2]-u[2])}}I(s,t,s.left,1.5,2.6),S(s,t)}function J(s,t){const o=s.n,i=Math.round(o*.55);for(let h=0;h<i;h++){const e=t()*Math.PI*2,a=16*Math.pow(Math.sin(e),3),l=13*Math.cos(e)-5*Math.cos(2*e)-2*Math.cos(3*e)-Math.cos(4*e),p=Math.pow(t(),.25),n=Math.sqrt(Math.max(0,1-p*p))*.5+.08,u=(t()*2-1)*n,f=Math.sqrt(Math.max(0,1-(u/.6)**2));s.put(a/17*p*f*.95,l/17*p*f*.95+.1,u,-(.35+.5*p))}const c=Math.round(o*.3);for(let h=0;h<c;h++){const e=h/c,a=e*Math.PI*2,l=e*3%1,p=.06*Math.exp(-((l-.18)**2)/8e-4)-.08*Math.exp(-((l-.3)**2)/5e-5)+.42*Math.exp(-((l-.32)**2)/8e-5)-.12*Math.exp(-((l-.345)**2)/6e-5)+.1*Math.exp(-((l-.55)**2)/.002);s.put(Math.cos(a)*1.35,-.05+p+M(t)*.003,Math.sin(a)*1.35,7+Math.min(e,.999),-Math.sin(a),0,Math.cos(a))}I(s,t,s.left,1.5,2.6),S(s,t)}function Q(s,t){const o=s.n,i=Math.round(o*.16);for(let e=0;e<i;e++){const l=-.42+Math.floor(t()*7)*.14,p=t()*Math.PI*2,n=.12+.13*Math.sqrt(t());s.put(Math.cos(p)*n,l+M(t)*.006,Math.sin(p)*n,-(.45+.4*t()))}const c=Math.round(o*.7),h=[.45,.65,.88,1.12,1.38];for(let e=0;e<c;e++){const a=h[Math.floor(t()*h.length)],l=Math.floor(t()*14)/14*Math.PI*2,p=t(),n=.12+p*(Math.PI-.24),u=a*Math.sin(n)**2,f=Math.floor(l/(Math.PI*2)*14)+h.indexOf(a)*14,r=2*a*Math.sin(n)*Math.cos(n),m=r*Math.sin(n)+u*Math.cos(n);s.put(u*Math.sin(n)*Math.cos(l),u*Math.cos(n)*1.05,u*Math.sin(n)*Math.sin(l),f%64+Math.min(p,.999),m*Math.cos(l),(r*Math.cos(n)-u*Math.sin(n))*1.05,m*Math.sin(l))}I(s,t,s.left,1.5,2.6),S(s,t)}function Y(s,t){const o=[1,3,3,3,2,3],i=o.map((e,a)=>{const l=-1.3+2.6*a/(o.length-1);return Array.from({length:e},(p,n)=>[l,(n-(e-1)/2)*.55,Math.sin(a*1.3+n)*.35])}),c=s.n;i.flat().forEach(e=>{for(let a=0;a<Math.round(c*.2/15);a++)s.put(e[0]+M(t)*.035,e[1]+M(t)*.035,e[2]+M(t)*.035,-(.75+.25*t()))});const h=[];for(let e=0;e<i.length-1;e++)for(const a of i[e])for(const l of i[e+1])h.push([a,l]);O(s,t,h,Math.round(c*.6),{bow:.12,jitter:.004,groups:12}),I(s,t,s.left,1.5,2.6),S(s,t)}function Z(s,t){const o=s.n,i=Math.round(o*.7);for(let h=0;h<i;h++){const e=t(),a=e*Math.PI*2,l=.95+M(t)*.05*(.4+.6*t()),p=M(t)*.03;s.put(Math.cos(a)*(l+p),Math.sin(a)*(l+p),M(t)*.04,Math.floor(t()*6)+Math.min(e,.999),-Math.sin(a),Math.cos(a),0)}const c=Math.round(o*.06);for(let h=0;h<c;h++)s.put(M(t)*.03,M(t)*.03,M(t)*.03,-.9);I(s,t,s.left,1.3,2.6,.3),S(s,t)}function tt(s,t){const o=s.n,i=1,c=Math.cos(i),h=Math.sin(i),e=(n,u,f,r,m,d,v=1)=>s.put(n,u*c-f*h,u*h+f*c,r,m,-d*h,d*c,v),a=Math.round(o*.12);for(let n=0;n<a;n++){const u=M(t)*.2,f=M(t)*.2,r=Math.atan2(f,u);e(u,M(t)*.09,f,-(.5+.45*t()),-Math.sin(r),Math.cos(r))}const l=3,p=Math.round(o*.72);for(let n=0;n<p;n++){const u=n%l,f=.16+2.1*Math.pow(t(),.8),r=u*Math.PI*2/l+Math.log(f/.16)*1.75+M(t)*.2*(.35+f*.25),m=Math.cos(r)*f+M(t)*.03*f,d=Math.sin(r)*f+M(t)*.03*f,v=M(t)*.03*(1.6-f*.4);e(m,v,d,u*3+Math.floor(t()*3)+Math.min(f/2.3,.999),-Math.sin(r),Math.cos(r))}I(s,t,s.left,1.2,3,.3),S(s,t)}const st={core:W,layers:H,voice:$,network:K,health:J,field:Q,graph:Y,star:Z,galaxy:tt};function it(s,t=7){const o=new Float32Array(E.length*s*4),i=new Float32Array(E.length*s*4);return E.forEach((c,h)=>{const e=o.subarray(h*s*4,(h+1)*s*4),a=i.subarray(h*s*4,(h+1)*s*4),l=new X(e,a,s);st[c](l,D(t+h*101));const p=D(t*31+h);for(let n=s-1;n>0;n--){const u=Math.floor(p()*(n+1));for(let f=0;f<4;f++){let r=e[n*4+f];e[n*4+f]=e[u*4+f],e[u*4+f]=r,r=a[n*4+f],a[n*4+f]=a[u*4+f],a[u*4+f]=r}}}),{pts:o,tan:i}}const _=2048,q=1.7,ot=3.4,et=new Set(["core","network","field","galaxy"]),N={core:[.1,.24,1],layers:[.1,.24,1],voice:[.04,.42,1],network:[.12,.3,1],health:[.62,.16,.85],field:[.34,.2,1],graph:[.1,.24,1],star:[.14,.32,1],galaxy:[.22,.26,1]},nt=`#version 300 es
precision highp float;
precision highp int;
precision highp sampler2D;
#define PI 3.14159265

uniform sampler2D uPts;
uniform sampler2D uTan;
uniform int uN;
uniform int uA;
uniform int uB;
uniform float uMix;
uniform mat4 uProj;
uniform mat4 uView;
uniform mat4 uModel;
uniform vec2 uShift;
uniform float uTime;
uniform float uPx;
uniform float uFocus;
uniform float uAperture;
uniform float uGlow;
uniform float uLight;
uniform float uBurst;
uniform float uWave;
uniform vec2 uPointer;
uniform float uPointerAmt;
uniform float uAspect;
uniform float uScatter;
uniform float uTwist;
uniform vec3 uTint;

out vec3 vColor;
out float vAlpha;

ivec2 texel(int s, int id) {
  int k = s * uN + id;
  return ivec2(k % ${_}, k / ${_});
}
float hash(float n) { return fract(sin(n * 12.9898 + 78.233) * 43758.5453); }
mat2 rot(float a) { float c = cos(a); float s = sin(a); return mat2(c, -s, s, c); }

void main() {
  int id = gl_VertexID;
  float fid = float(id);
  vec4 a = texelFetch(uPts, texel(uA, id), 0);
  vec4 b = texelFetch(uPts, texel(uB, id), 0);
  vec4 ta = texelFetch(uTan, texel(uA, id), 0);
  vec4 tb = texelFetch(uTan, texel(uB, id), 0);
  float seed = hash(fid * 0.6180339);
  float seed2 = hash(fid * 1.37 + 3.1);
  vec3 drift = vec3(hash(seed * 7.13) - 0.5, hash(seed * 3.31) - 0.5, hash(seed * 5.77) - 0.5);

  // Staggered morph: each point leaves at its own moment and travels on a vortex.
  float m = clamp(uMix * 1.6 - seed * 0.6, 0.0, 1.0);
  m = m * m * (3.0 - 2.0 * m);
  float sw = sin(PI * m);
  vec3 p = mix(a.xyz, b.xyz, m);
  p.xz = rot(sw * (1.6 + seed2 * 2.8) * (seed > 0.5 ? 1.0 : -1.0)) * p.xz;
  p += drift * sw * 1.5 + normalize(p + 1e-4) * sw * 0.4;

  vec4 tn = m < 0.5 ? ta : tb;
  float w = m < 0.5 ? a.w : b.w;

  // Flow: points stream along their path, fading in and out at the ends of their run.
  float flow = tn.w * (1.0 - sw);
  float ph = fract(uTime * (0.16 + 0.34 * seed2) + seed * 7.0);
  p += tn.xyz * (ph - 0.5) * 0.12 * flow;
  float stream = mix(1.0, 0.3 + 1.0 * sin(PI * ph), flow);

  // Breathing.
  p += 0.010 * vec3(sin(uTime * 0.7 + seed * 40.0), cos(uTime * 0.53 + seed * 23.0), sin(uTime * 0.61 + seed * 17.0));

  // Scroll inertia: the cloud loosens and the inner part twists.
  p += drift * uScatter * 0.9;
  p.xz = rot(uTwist * max(0.0, 1.3 - length(p))) * p.xz;

  // Shockwave from the centre.
  float shock = 0.0;
  if (uWave > 0.0) {
    float r = length(p);
    float R = uWave * 3.2;
    shock = exp(-pow(r - R, 2.0) / 0.012) * (1.0 - uWave);
    p += normalize(p + 1e-4) * shock * 0.3;
  }

  vec4 vp = uView * (uModel * vec4(p, 1.0));
  vec4 clip = uProj * vp;

  // The cursor parts the points around it and lights them.
  float near = 0.0;
  if (uPointerAmt > 0.001) {
    vec2 ndc = clip.xy / clip.w + uShift;
    vec2 dd = (ndc - uPointer) * vec2(uAspect, 1.0);
    near = exp(-dot(dd, dd) / 0.02) * uPointerAmt;
    vp.xy += normalize(dd + 1e-5) * near * 0.3 * (-vp.z / 4.2);
    clip = uProj * vp;
  }
  gl_Position = clip;
  gl_Position.xy += uShift * gl_Position.w;
  float z = max(0.2, -vp.z);

  float base;
  float pulse = 0.0;
  if (w < 0.0) {
    base = -w + uBurst * 0.25 * step(0.5, -w);
  } else {
    float g = floor(w);
    float t = fract(w);
    float speed = 0.10 + 0.12 * hash(g + 1.7);
    float head = fract(uTime * speed + hash(g * 1.37));
    float d = t - head;
    float on = step(0.5, hash(g * 3.1 + 0.5));
    pulse = on * (exp(-d * d / 0.0007) + 0.4 * exp(-d * d / 0.012) * step(d, 0.0));
    if (uBurst > 0.0) {
      float bd = t - (1.0 - uBurst);
      pulse += uBurst * exp(-bd * bd / 0.004);
    }
    base = 0.42;
  }
  base *= stream;
  pulse += shock * 0.55 + near * 0.6;
  float transit = sw * 0.5;

  float warm = step(0.972, seed);
  // Each shape has its own light: the tint sets the deep colour, its highlight follows.
  vec3 deep = uTint;
  vec3 cyan = mix(uTint, vec3(0.85, 0.95, 1.0), 0.62);
  vec3 amber = vec3(1.0, 0.60, 0.30);
  float lift = clamp(base * 0.85 + pulse + transit * 0.6, 0.0, 1.0);
  vec3 col = mix(deep, cyan, lift);
  col = mix(col, amber, warm * 0.85);

  float inten = (0.06 + base * 0.66 + pulse * 1.3 + transit * 0.45) * uGlow;

  // Depth of field: points away from the focal plane grow and spread their light.
  float coc = abs(z - uFocus) * uAperture;
  float size = uPx * (0.0024 + base * 0.0026 + pulse * 0.0026 + transit * 0.001) * 4.2 / z;
  float sz = size + coc * uPx * 0.0028;
  float energy = (size * size) / (sz * sz);
  gl_PointSize = clamp(sz, 1.0, 64.0);

  if (uLight > 0.5) {
    if (gl_InstanceID == 1) { gl_PointSize = 0.0; gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
    vColor = mix(vec3(0.20, 0.23, 0.30), vec3(0.08, 0.30, 0.86), lift);
    vAlpha = clamp((0.18 + base * 0.5 + pulse + transit * 0.3) * energy * uGlow, 0.0, 0.9);
  } else {
    vColor = col;
    vAlpha = inten * energy;
    // Second instance: a wide, faint halo around the brighter points (a cheap bloom).
    if (gl_InstanceID == 1) {
      float hot = base + pulse * 2.0;
      if (hot < 0.55) { gl_PointSize = 0.0; gl_Position = vec4(2.0, 2.0, 2.0, 1.0); return; }
      gl_PointSize = clamp(sz * 7.0, 1.0, 96.0);
      vAlpha = inten * energy * 0.03 * hot;
    }
  }
}`,ht=`#version 300 es
precision highp float;
in vec3 vColor;
in float vAlpha;
out vec4 outColor;
void main() {
  vec2 q = gl_PointCoord * 2.0 - 1.0;
  float r2 = dot(q, q);
  if (r2 > 1.0) discard;
  float f = exp(-r2 * 3.2);
  float a = f * vAlpha;
  outColor = vec4(vColor * a, a);
}`,at=["uPts","uTan","uN","uA","uB","uMix","uProj","uView","uModel","uShift","uTime","uPx","uFocus","uAperture","uGlow","uLight","uBurst","uWave","uPointer","uPointerAmt","uAspect","uScatter","uTwist","uTint"];function B(s,t,o){const i=s.createShader(t);if(s.shaderSource(i,o),s.compileShader(i),!s.getShaderParameter(i,s.COMPILE_STATUS))throw new Error(s.getShaderInfoLog(i)??"shader");return i}function ct(s,t,o,i){const c=Math.cos(t),h=Math.sin(t),e=Math.cos(o),a=Math.sin(o);return s[0]=c*i,s[1]=a*h*i,s[2]=-e*h*i,s[3]=0,s[4]=0,s[5]=e*i,s[6]=a*i,s[7]=0,s[8]=h*i,s[9]=-a*c*i,s[10]=e*c*i,s[11]=0,s[12]=0,s[13]=0,s[14]=0,s[15]=1,s}const T=(s,t,o)=>s+(t-s)*o;function L(s,t,o){const i=new Float32Array(o*_*4);i.set(t);const c=s.createTexture();return s.bindTexture(s.TEXTURE_2D,c),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(s.TEXTURE_2D,s.TEXTURE_MAG_FILTER,s.NEAREST),s.texImage2D(s.TEXTURE_2D,0,s.RGBA32F,_,o,0,s.RGBA,s.FLOAT,i),c}class rt{constructor(t){this.opts=t;const o=t.canvas.getContext("webgl2",{alpha:!0,premultipliedAlpha:!0,antialias:!1,powerPreference:"high-performance"});if(!o)throw new Error("webgl2");this.gl=o,this.light=!!t.light,this.still=!!t.still,this.dpr=t.dpr??Math.min(window.devicePixelRatio||1,1.5),this.intro=this.still?1:0,t.from&&!this.still&&(this.a=E.indexOf(t.from),this.b=0,this.mix=0,this.dur=ot),this.ready=this.init()}opts;ready;gl;prog;vao;tex;tan;u={};proj=new Float32Array(16);view=new Float32Array(16);model=new Float32Array(16);aspect=1;a=0;b=0;mix=1;dur=q;queued=null;mode="timed";target=null;pose={x:0,y:0,scale:1,glow:1};goal={x:0,y:0,scale:1,glow:1};yaw=.6;pointer={x:0,y:0,tx:0,ty:0,amt:0,at:-1e9};intro=0;burst=0;wave=0;scatter=0;twist=0;motion=0;lastStorm=0;tint=[...N.core];visible=!0;raf=0;last=0;time=0;dpr;light;still;disposed=!1;lastInput=0;lastDraw=0;async init(){const{gl:t}=this,o=t.createProgram();if(t.attachShader(o,B(t,t.VERTEX_SHADER,nt)),t.attachShader(o,B(t,t.FRAGMENT_SHADER,ht)),t.linkProgram(o),!t.getProgramParameter(o,t.LINK_STATUS))throw new Error(t.getProgramInfoLog(o)??"link");this.prog=o;for(const a of at)this.u[a]=t.getUniformLocation(o,a);await new Promise(a=>setTimeout(a,0));const i=this.opts.count,{pts:c,tan:h}=it(i),e=Math.ceil(E.length*i/_);this.tex=L(t,c,e),this.tan=L(t,h,e),this.vao=t.createVertexArray(),this.resize(),this.schedule()}dominant(){return this.mix<.5?this.a:this.b}morphTo(t){if(this.mix>=1){if(t===this.b)return;this.a=this.b,this.b=t,this.mix=0,this.dur=q}else t!==this.b?this.queued=t:this.queued=null}setShape(t){const o=E.indexOf(t);if(!(o<0)){if(this.still){this.a=this.b=o,this.mix=1,this.tint=[...N[t]],this.schedule();return}if(this.mode==="scrub"){const i=this.dominant();this.a=this.b=i,this.mix=1,this.mode="timed"}this.morphTo(o),this.poke()}}scrub(t,o,i){const c=E.indexOf(t),h=E.indexOf(o);if(c<0||h<0)return;const e=this.target;if(this.target={a:c,b:h,m:i},this.still){this.a=c,this.b=h,this.mix=i,this.schedule();return}if(this.mode==="scrub"&&e&&(e.a!==c||e.b!==h)){const a=this.dominant();this.a=c,this.b=h,this.mix=a===h?1:0}this.mode==="timed"&&this.handOver(),this.schedule()}hold(){this.target=null}handOver(){const t=this.target;if(!t)return;const o=t.m<.5?t.a:t.b;this.mix>=1&&this.queued===null&&this.b===o?(this.mode="scrub",this.a=t.a,this.b=t.b,this.mix=o===t.a&&t.a!==t.b?0:1):(this.b!==o||this.queued!==null&&this.queued!==o)&&this.morphTo(o)}setPose(t){Object.assign(this.goal,t),this.still&&Object.assign(this.pose,this.goal),this.schedule()}pulse(){this.still||(this.wave=.001,this.burst=.7,this.poke())}flash(t=.75){this.still||(this.burst=Math.max(this.burst,t),this.poke())}setPointer(t,o){this.pointer.tx=t,this.pointer.ty=o,this.pointer.at=performance.now(),this.poke()}setMotion(t){this.motion=t,this.poke()}poke(){this.lastInput=performance.now(),this.schedule()}setVisible(t){this.visible=t,t&&this.schedule()}setLight(t){this.light=t,this.schedule()}resize(){const t=this.opts.canvas,o=Math.max(1,Math.round(t.clientWidth*this.dpr)),i=Math.max(1,Math.round(t.clientHeight*this.dpr));(t.width!==o||t.height!==i)&&(t.width=o,t.height=i),this.aspect=o/i;const c=this.aspect<1?.95:.62;U(this.proj,c,this.aspect,.1,30),C(this.view,[0,0,4.2],[0,0,0]),this.schedule()}schedule(){!this.raf&&!this.disposed&&this.vao&&(this.raf=requestAnimationFrame(this.loop))}loop=t=>{if(this.raf=0,this.disposed||!this.visible||document.hidden)return;const o=t-this.lastInput>4e3&&this.mix>=1&&this.burst===0&&this.wave===0;if(!this.still&&o&&t-this.lastDraw<30){this.schedule();return}this.lastDraw=t;const i=this.last?Math.min(.05,(t-this.last)/1e3):.016;this.last=t,this.still||this.step(i,t),this.draw(),this.still||this.schedule()};step(t,o){if(this.time+=t,this.intro=Math.min(1,this.intro+t/2.4),this.burst=Math.max(0,this.burst-t/1.4),this.wave>0&&(this.wave=this.wave+t/1.7>=1?0:this.wave+t/1.7),this.mode==="scrub"&&this.target){const n=this.target;this.a=n.a,this.b=n.b,this.mix=T(this.mix,n.m,1-Math.exp(-t*7))}else this.mix<1?(this.mix=Math.min(1,this.mix+t/this.dur*(this.queued!=null?2.4:1)),this.mix>=1&&(this.dur=q,this.queued!=null?(this.a=this.b,this.b=this.queued,this.queued=null,this.mix=0):this.handOver())):this.target&&this.handOver();this.time-this.lastStorm>7&&this.mix>=.98&&this.burst===0&&(this.lastStorm=this.time,this.burst=.8);const i=1-Math.exp(-t*2.6);this.pose.x=T(this.pose.x,this.goal.x,i),this.pose.y=T(this.pose.y,this.goal.y,i),this.pose.scale=T(this.pose.scale,this.goal.scale,i),this.pose.glow=T(this.pose.glow,this.goal.glow,i);const c=1-Math.exp(-t*6);this.pointer.x=T(this.pointer.x,this.pointer.tx,c),this.pointer.y=T(this.pointer.y,this.pointer.ty,c);const h=o-this.pointer.at<1800?1:0;this.pointer.amt=T(this.pointer.amt,h,1-Math.exp(-t*(h?5:1.5)));const e=this.motion;this.motion*=Math.exp(-t*10),this.scatter=T(this.scatter,Math.min(1,Math.abs(e)/70)*.32,1-Math.exp(-t*5)),this.twist=T(this.twist,Math.max(-1,Math.min(1,e/90))*.7,1-Math.exp(-t*4));const a=E[this.dominant()],l=1-Math.exp(-t*1.6),p=N[a];for(let n=0;n<3;n++)this.tint[n]=T(this.tint[n],p[n],l);if(et.has(a))this.yaw+=t*(.12+Math.abs(this.twist)*.6);else{let n=Math.sin(this.time*.22)*.42;n+=Math.PI*2*Math.round((this.yaw-n)/(Math.PI*2)),this.yaw=T(this.yaw,n,1-Math.exp(-t*1.4))}}draw(){const{gl:t}=this,o=this.opts.canvas;t.viewport(0,0,o.width,o.height),t.clearColor(0,0,0,0),t.clear(t.COLOR_BUFFER_BIT),t.useProgram(this.prog),t.enable(t.BLEND),this.light?t.blendFunc(t.ONE,t.ONE_MINUS_SRC_ALPHA):t.blendFunc(t.ONE,t.ONE);const i=1-Math.pow(1-this.intro,3),c=this.yaw+this.pointer.x*.35,h=.12-this.pointer.y*.2;ct(this.model,c,h,this.pose.scale*(.85+.15*i)),t.activeTexture(t.TEXTURE0),t.bindTexture(t.TEXTURE_2D,this.tex),t.uniform1i(this.u.uPts,0),t.activeTexture(t.TEXTURE1),t.bindTexture(t.TEXTURE_2D,this.tan),t.uniform1i(this.u.uTan,1),t.uniform1i(this.u.uN,this.opts.count),t.uniform1i(this.u.uA,this.a),t.uniform1i(this.u.uB,this.b),t.uniform1f(this.u.uMix,this.mix),t.uniformMatrix4fv(this.u.uProj,!1,this.proj),t.uniformMatrix4fv(this.u.uView,!1,this.view),t.uniformMatrix4fv(this.u.uModel,!1,this.model),t.uniform2f(this.u.uShift,this.pose.x,this.pose.y),t.uniform1f(this.u.uTime,this.time),t.uniform1f(this.u.uPx,o.height),t.uniform1f(this.u.uFocus,4.2),t.uniform1f(this.u.uAperture,1.6),t.uniform1f(this.u.uGlow,this.pose.glow*i),t.uniform1f(this.u.uLight,this.light?1:0),t.uniform1f(this.u.uBurst,this.burst),t.uniform1f(this.u.uWave,this.wave),t.uniform2f(this.u.uPointer,this.pointer.x,this.pointer.y),t.uniform1f(this.u.uPointerAmt,this.still?0:this.pointer.amt),t.uniform1f(this.u.uAspect,this.aspect),t.uniform1f(this.u.uScatter,this.scatter),t.uniform1f(this.u.uTwist,this.twist),t.uniform3f(this.u.uTint,this.tint[0],this.tint[1],this.tint[2]),t.bindVertexArray(this.vao),t.drawArraysInstanced(t.POINTS,0,this.opts.count,2)}dispose(){this.disposed=!0,cancelAnimationFrame(this.raf),this.gl.getExtension("WEBGL_lose_context")?.loseContext()}}export{rt as Sculpture};
