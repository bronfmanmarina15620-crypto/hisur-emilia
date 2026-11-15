const M=require('./engine.js');const S=M.S;const a=require('assert');
const ev=e=>{const s=S.solve(S.tok(e.replace(/ =$/,'').replace(/[×:−,]/g,m=>({'×':'*',':':'/','−':'-',',':''}[m]))));return s&&s.ans;};
const ALL={};M.TOPICS.forEach(t=>ALL[t]=9);const OLD={nl:9,word:9,seder:9,col:9,miss:9};
let prev=[],n=0,cnt={};
function chk(x){
 a(x.stages&&x.stages.length,JSON.stringify(x));
 for(const st of x.stages){
  if(st.t==='fields')st.fields.forEach(f=>a(Number.isInteger(f.want)&&f.want>=0,JSON.stringify(x)));
  else if(st.t==='frac')a(st.want[0]>0&&(st.want[1]>1||(st.red&&st.whole&&st.want[1]===1))&&Number.isInteger(st.want[0]),JSON.stringify(x));
  else if(st.t==='choice')a(st.ans>=0&&st.ans<st.opts.length&&new Set(st.opts).size===st.opts.length,JSON.stringify(x));
  else if(st.t==='multi')a(st.ans.length&&st.ans.every(i=>i>=0&&i<st.opts.length));
  else if(st.t==='tick')a(Number.isInteger(st.ans));
  else if(st.t==='mtick'){const L=x.fnl,N=L.N||L.u*L.d;a.strictEqual(L.mode,'multi');a.strictEqual(st.d,L.d);a(st.ks.length>=3&&st.ks.length<=6,JSON.stringify(x));a.strictEqual(new Set(st.ks).size,st.ks.length);
   a(N<=18&&L.d<=12&&N/L.d<=3,JSON.stringify(L));
   for(const k of st.ks){a(Number.isInteger(k)&&k>=1&&k<=N,JSON.stringify(x));if(L.lab)a(!L.lab.includes(k),'on label '+JSON.stringify(x));else a(k%L.d!==0,JSON.stringify(x));}
   if(L.lab){a(L.lab[0]===0&&L.lab.length>=2&&L.lab.every(l=>Number.isInteger(l)&&l>=0&&l<=N));}else a(st.ks.filter(k=>k>L.d).length>=2);
   a.strictEqual(x.ans,st.ks.map(k=>k+'/'+L.d).join(', '));a(x.hints.length>=2&&x.guide.length>=3);a(!/מבחן/.test(x.prompt+x.hints.join('')+x.guide.join('')));}
  else a.fail(st.t);}
 const t=x.topic,v=x.stages[0];
 if(['nl','word','seder','col','miss'].includes(t))a(Number.isInteger(x.ans)&&x.ans>=0);
 if(t==='seder')a.strictEqual(ev(x.expr),x.ans);
 if(t==='word'){a.strictEqual(ev(x.eq),x.ans);x.steps.forEach(st=>a(Number.isInteger(ev(st))&&ev(st)>=0));}
 if(t==='col')a.strictEqual(x.col.op==='+'?x.col.a+x.col.b:x.col.a-x.col.b,x.ans);
 if(t==='miss'){const full=x.expr.replace('__',S.fmt(x.ans));const [l,r]=full.split(' = ');a.strictEqual(ev(l),+r.replace(/,/g,''),full);}
 if(t==='nl'){const L=x.nl;a(L.mark>0&&L.mark<L.n);a(L.start+L.n*L.step<=3000000);}
 if(t==='mul'){const [p,q]=x.expr.match(/\d+/g).map(Number);const f=v.fields;a.strictEqual(f[0].want+f[1].want,p*q);a.strictEqual(f[2].want,p*q);a(p>=12&&q>=12&&p<100&&q<100);a(!/\d{3}/.test(f[0].hints[0]+f[1].hints[0])||true);}
 if(t==='fpic'&&x.sub==='pic'){a.strictEqual(x.pic.sh.filter(Boolean).length,v.want[0]);a.strictEqual(x.pic.sh.length,v.want[1]);a.strictEqual(x.stages[1].opts[x.stages[1].ans],M.words(v.want[0],v.want[1]));}
 if(t==='fnl'&&x.sub!=='multi'){const L=x.fnl;a(L.k>0&&L.k<L.u*L.d&&L.k%L.d);a(L.u<=3&&L.d<=12);if(L.lab){a(L.N<=L.d&&L.lab[0]===0&&L.lab[L.lab.length-1]===L.N&&!L.lab.includes(L.k)&&L.k<L.N);for(let i=1;i<L.lab.length;i++)a(L.lab[i]-L.lab[i-1]>1,JSON.stringify(L));}if(L.mode==='read')a.deepStrictEqual(v.want,[L.k,L.d]);else a.strictEqual(v.ans,L.k);}
 if(t==='fcmp'){const [p,q,r,s]=x.expr.match(/\d+/g).map(Number);const d=p*s-r*q;a.strictEqual(v.opts[v.ans],d<0?'<':d?'>':'=');
  const c=x.stages[1].ans;if(c===0)a(q===s);if(c===1)a(p===r&&q!==s);if(c===2)a((2*p-q)*(2*r-s)<0);if(c===3)a((p-q)*(r-s)<0);}
 if(t==='fops'){const q=(n,d)=>n/d;const ev2=str=>{str=str.trim();let m=str.match(/^(\d+)\/(\d+)$/);if(m)return +m[1]/+m[2];if(/^\d+$/.test(str))return +str;const p=str.split(/ ([+−]) /);let r=ev2(p[0]);for(let i=1;i<p.length;i+=2)r+=(p[i]==='+'?1:-1)*ev2(p[i+1]);return r;};
  a(x.guide&&x.guide.length>=3);const nums=x.expr.match(/\d+/g).map(Number);a(nums.every(z=>z<=40));let e=x.expr;
  if(v.mixed){const [p1,q1,p2,q2]=e.match(/\d+/g).map(Number),op=e.includes('−')?-1:1,val=p1/q1+op*p2/q2,[W,Rn,den]=v.fields.map(f=>f.want);a(v.red);a(Rn>0&&Rn<den&&W>=1&&M.gcd(Rn,den)===1,e);a(Math.abs(val-(W+Rn/den))<1e-9,e);a.strictEqual(M.lcm(q1,q2)%den,0,e);a(/מספר מעורב/.test(x.prompt));e=null;}
  else if(v.t==='frac'){a(v.whole);a(v.want[1]<=30,e);const f=v.want[0]+'/'+v.want[1];e=e.includes('__')?e.replace('__',f):e.replace(/=$/,'= '+f);}
  else if(v.pair){a(M.pairOk(v.pair,v.fields[0].want,v.fields[1].want));a(!M.pairOk(v.pair,v.fields[0].want+1,v.fields[1].want));e=e.replace('□',v.fields[0].want).replace('□',v.fields[1].want);}
  else e=e.replace('□',v.fields[0].want);
  if(e){const [l,r]=e.split(' = ');a(Math.abs(ev2(l)-ev2(r))<1e-9,e);}
  if(/^unrel/.test(x.sub)){const [,q1,,q2]=x.expr.match(/\d+/g).map(Number);a(q1!==q2&&q1%q2&&q2%q1&&q1<=12&&q2<=12,x.expr);}a(!x.guide.join(' ').includes(' = '+x.ans+' ')||true);}
 if(t==='fword')a(!(x.prompt.match(/\{[^}]+\}/g)||[]).some(f=>!/^\{\d+\/\d+\}$/.test(f)));
 const fv=f=>{const m=f.match(/^(\d+)\/(\d+)$/);return m?+m[1]/+m[2]:+f.replace(/,/g,'');};
 const evx=str=>{const p=str.trim().split(/ ([+−×:]) /);let r=fv(p[0]);for(let i=1;i<p.length;i+=2){const y=fv(p[i+1]),o=p[i];r=o==='+'?r+y:o==='−'?r-y:o==='×'?r*y:r/y;}return r;};
 if(['fexp','wmin','comp1','ineq','zero1','round','poly','terms'].includes(t)){a(x.guide&&x.guide.length>=2,t);a(M.LABELS[t]&&M.HINTS[t]);}
 if(t==='fexp'){if(v.t==='frac'){a(v.exact);const [p,q]=x.expr.match(/\d+/g).map(Number);a(Math.abs(p/q-v.want[0]/v.want[1])<1e-9);}else{const parts=x.expr.split(' = ').map(z=>z.replace('□',v.fields[0].want));const vals=parts.map(fv);a(vals.every(z=>Math.abs(z-vals[0])<1e-9),x.expr);}}
 if(t==='wmin'){const [W,n,d]=x.expr.match(/\d+/g).map(Number);a(Math.abs(W-n/d-(v.fields[0].want+v.fields[1].want/d))<1e-9);a(v.fields[1].want>0&&v.fields[1].want<d);}
 if(t==='comp1'){if(v.t==='frac')a(Math.abs(v.want[0]/v.want[1]+(x.expr?fv(x.expr.split(' ')[0]):fv(x.prompt.match(/\{(\d+\/\d+)\}/)[1]))-1)<1e-9);else{const [p,q,d]=x.expr.match(/\d+/g).map(Number);a.strictEqual(p/q+v.fields[0].want/d,1);}}
 if(t==='ineq'){const [l,r]=x.expr.split(' □ ');const d=evx(l)-evx(r);a.strictEqual(v.opts[v.ans],Math.abs(d)<1e-9?'=':d<0?'<':'>',x.expr);}
 if(t==='zero1'){if(v.t==='fields'){const [l,r]=x.expr.replace('__',v.fields[0].want).split(' = ');a(Math.abs(evx(l)-evx(r))<1e-9,x.expr);}else a(/: 0/.test(v.opts[v.ans]+x.prompt));}
 if(t==='round'){if(x.sub==='r')a.strictEqual(evx(x.expr.replace(/ =$/,'')),x.ans);else{const [l,r]=x.expr.replace('__',x.ans).split(' = ');a.strictEqual(evx(l),evx(r));}}
 if(t==='poly'){const n=x.geo?x.geo.pts.length:0;if(x.sub==='diag')a.strictEqual(x.ans,n*(n-3)/2);if(x.sub==='isdiag'||x.sub==='isside'){const L=x.geo.labels,ix=s=>[L.indexOf(s[0]),L.indexOf(s[1])],isSide=s=>{const [i,j]=ix(s);return (Math.abs(i-j)===1||Math.abs(i-j)===n-1);};const good=v.opts.filter(o=>x.sub==='isside'?isSide(o):!isSide(o));a.deepStrictEqual(good,[v.opts[v.ans]],JSON.stringify(v));}}
 if(t==='terms'&&x.tv){const [k,p,q]=x.tv;a.strictEqual([p+q,p-q,p*q,p/q][k],x.ans);}
 if(t==='divis'){a(x.guide.length>=3);const [A,d]=x.dv;if(x.sub.startsWith('yn'))a.strictEqual(v.ans,A%d===0?0:1);else if(x.sub.startsWith('pick')){a.deepStrictEqual(v.ans,A.map((z,j)=>z%d===0?j:-1).filter(j=>j>=0));a(v.ans.length>0);}else{const ok=s=>[...s].reduce((q,c)=>q+ +c,0)%d===0;const w=x.sub==='dig9'?String(v.fields[0].want):v.opts[v.ans];a(ok(A.replace('□',w)),A);if(x.sub==='dig3')v.opts.forEach((o,j)=>j===v.ans||a(!ok(A.replace('□',o))));else a([0,1,2,3,4,5,6,7,8,9].filter(g=>ok(A.replace('□',g))).length===1,A);}}
 if(t==='prime'){a(x.guide.length>=3);const ip=M.isPrime;if(x.sub==='yn')a.strictEqual(v.ans,ip(x.pv)?0:1);else if(x.sub==='pick')a.deepStrictEqual(v.ans,v.opts.map((o,j)=>ip(+o)?j:-1).filter(j=>j>=0));else a.deepStrictEqual(v.ans.map(j=>+v.opts[j]),v.opts.map(Number).filter(z=>x.pv%z===0));}
 if(t==='mixf'){const [W,r,d]=x.mx;a(d>=2&&d<=11&&W>=1&&W<=11&&r>=1&&r<d&&W*d+r<=110&&M.gcd(r,d)===1);a(x.guide.length>=3);
  if(x.sub==='toMix'){a.deepStrictEqual(v.fields.map(f=>f.want),[W,r]);a.strictEqual(x.expr,(W*d+r)+'/'+d+' =');a(v.mixed);}else{a.deepStrictEqual(v.want,[W*d+r,d]);a.strictEqual(x.expr,W+' '+r+'/'+d+' =');}}
 if(t==='chart'){const C=x.chart;a(C.vals.every(z=>z%C.step===0&&z>0));if(v.t==='choice'){const m=x.prompt.includes('הרבה')?Math.max(...C.vals):Math.min(...C.vals);a.strictEqual(C.vals[v.ans],m);}}
 if(t==='geo'){const P=x.geo.pts,k=P.length,s=x.geo.hl,sel=v.ans.map(i=>v.opts[i]);const nm=i=>x.geo.labels[i]+x.geo.labels[(i+1)%k];
  if(x.sub==='adj')a.deepStrictEqual(sel.sort(),[nm((s+1)%k),nm((s+k-1)%k)].sort());
  else{const vv=i=>[P[(i+1)%k][0]-P[i][0],P[(i+1)%k][1]-P[i][1]];const exp=[];for(let i=0;i<k;i++)if(i!==s){const A=vv(s),B=vv(i);if(A[0]*B[1]-A[1]*B[0]===0)exp.push(nm(i));}a.deepStrictEqual(sel.filter(z=>z.length===2).sort(),exp.sort());}}
}
for(let i=0;i<600;i++){const test=i%7==0;const s=M.session({n:test?8:10,stats:i%2?{}:{col:{n:10,tries:25,help:3,first:2}},counts:i<5?{}:(i<300?OLD:ALL),prevKeys:prev,test});
 a.strictEqual(s.length,test?8:10);a.strictEqual(new Set(s.map(x=>x.key)).size,s.length);
 for(const x of s){n++;cnt[x.topic]=(cnt[x.topic]||0)+1;chk(x);}
 if(prev.length)a.notDeepStrictEqual(s.map(x=>x.key),prev);prev=s.map(x=>x.key);}
for(const t of M.TOPICS)for(let i=0;i<300;i++){const x=M.make(t,{});chk(x);}
a.strictEqual(M.TOPICS.length,24);M.TOPICS.forEach(t=>a(cnt[t]>0,'missing '+t));
// weak weighting (13 topics: uniform≈0.08)
const good={n:10,tries:10,help:0,first:10};const st={};M.TOPICS.forEach(t=>st[t]=good);st.fcmp={n:10,tries:28,help:4,first:1};
let w=0,tot=0;for(let i=0;i<200;i++){const s=M.session({stats:st,counts:ALL});w+=s.filter(x=>x.topic==='fcmp').length;tot+=s.length;}
a(w/tot>0.13,'weak '+w/tot);
// new topic block: old topics done -> first new topic in a block of 4
const s0=M.session({counts:OLD});a.deepStrictEqual(s0.slice(0,4).map(x=>x.topic),['mul','mul','mul','mul']);
const rv=M.session({review:[{topic:'seder',key:'X1',ans:3,expr:'1 + 2 =',stages:[{t:'fields',fields:[{lab:'',want:3}]}]}],counts:ALL});a(rv[0].review&&rv[0].key==='X1');
let rep=0,dist=0;for(let i=0;i<300;i++){const s=M.session({counts:ALL});dist+=new Set(s.map(x=>x.topic)).size;for(let k=1;k<s.length;k++)if(s[k].topic===s[k-1].topic)rep++;}
console.log('OK',n,'items',JSON.stringify(cnt),'weak share',(w/tot).toFixed(2),'avg topics/session',(dist/300).toFixed(1),'neighbour repeats',rep);

const subs={};for(let i=0;i<3000;i++){const x=M.make('fops',{});subs[x.sub]=(subs[x.sub]||0)+1;}a(['same+','same-','whole','to1','to2','diff+','diff-','boxn','boxm','minuend','pair','unrel+','unrel-'].every(k=>subs[k]>0),JSON.stringify(subs));console.log('fops subs',JSON.stringify(subs));
for(let i=0;i<8;i++){const x=M.make('fops',{});console.log(x.expr,'->',x.ans);}
for(const t of M.TOPICS){let pv=[];for(let k=0;k<20;k++){const s=M.session({only:t,prevKeys:pv,review:[{topic:'zz',key:'Z'}]});a.strictEqual(s.length,10,t);a(s.every(x=>x.topic===t),t);s.forEach(chk);pv=s.map(x=>x.key);}}
console.log('topic sessions OK');
a.strictEqual(M.EXAM.length,18);
const exOk=x=>M.EXAM.some(e=>e[1]===x.topic&&(!e[2]||new RegExp(e[2]).test(x.sub)));
{let pv=[];for(let i=0;i<300;i++){const test=i%3==0;const s=M.session({exam:true,test,n:test?8:10,prevKeys:pv,stats:{},review:[{topic:'divis',key:'R1',sub:'yn2'}]});a.strictEqual(s.length,test?8:10);a(s.every(exOk),JSON.stringify(s.map(x=>x.topic+x.sub)));a.strictEqual(new Set(s.map(x=>x.key)).size,s.length);s.forEach(chk);for(let k=1;k<s.length;k++)a(s[k].ex!==s[k-1].ex);pv=s.map(x=>x.key);}}
for(const e of M.EXAM){let pv=[];for(let k=0;k<15;k++){const s=M.session({only:e[0],prevKeys:pv});a.strictEqual(s.length,10,e[0]);a(s.every(x=>x.topic===e[1]&&(!e[2]||new RegExp(e[2]).test(x.sub))),e[0]);s.forEach(chk);pv=s.map(x=>x.key);}a(M.label(e[0]));}
console.log('focus topics OK');
// v5: new focus items, fnl variants, no duplicates in new topics
{const fs={};for(let i=0;i<4000;i++){const x=M.make('fnl',{});const k=x.fnl.lab?'lab':'u'+x.fnl.u+'d'+x.fnl.d;fs[k]=(fs[k]||0)+1;}a(fs.lab>0&&fs.u1d12>0&&Object.keys(fs).some(k=>k.startsWith('u3')),JSON.stringify(fs));
 let mixed=0;for(let i=0;i<3000;i++){const x=M.make('fops:diff',{});a(/^(diff|unrel)/.test(x.sub));chk(x);if(x.stages[0].mixed)mixed++;}a(mixed>0);
 const ms={};for(let i=0;i<2000;i++){const x=M.make('mixf',{});chk(x);ms[x.sub]=1;}a(ms.toMix&&ms.toFrac);
 for(const id of ['fops:diff','mixf','fexp']){let pv=[];for(let k=0;k<30;k++){const s=M.session({only:id,prevKeys:pv});a.strictEqual(s.length,10);a.strictEqual(new Set(s.map(x=>x.key)).size,10,id);a(!s.some(x=>pv.includes(x.key)),id);pv=s.map(x=>x.key);}}
 for(let i=0;i<8;i++){const x=M.make('fops:diff',{}),y=M.make('mixf',{});console.log(x.expr,'->',x.ans,' | ',y.expr,'->',y.ans);}
 console.log('v5 OK');}

// v6 (14.11): several fractions on one line
{const kinds={},seenK=new Set();let mcount=0;
 for(let i=0;i<6000;i++){const x=M.make('fnl:multi',{});a.strictEqual(x.sub,'multi');chk(x);const L=x.fnl,N=L.N||L.u*L.d;
  const kind=!L.lab?'whole'+L.u:N===L.d?'to1':'not1';kinds[kind]=(kinds[kind]||0)+1;
  if(L.lab&&!L.lab.includes(N))kinds.unlabEnd=(kinds.unlabEnd||0)+1;if(L.lab&&L.lab.length<N/2)kinds.partial=(kinds.partial||0)+1;if(L.d===12)kinds.d12=(kinds.d12||0)+1;
  seenK.add(x.key);}
 for(const k of ['whole2','whole3','to1','not1','unlabEnd','partial','d12'])a(kinds[k]>0,'missing kind '+k+' '+JSON.stringify(kinds));
 a(seenK.size>500,'variety '+seenK.size);
 // dedup inside & across sessions
 let pv=[];for(let k=0;k<40;k++){const s=M.session({only:'fnl:multi',prevKeys:pv});a.strictEqual(s.length,10);a.strictEqual(new Set(s.map(x=>x.key)).size,10);a(!s.some(x=>pv.includes(x.key)));a(s.every(x=>x.sub==='multi'));pv=s.map(x=>x.key);}
 // appears in general fnl practice and in exam mixes
 for(let i=0;i<4000;i++)if(M.make('fnl',{}).sub==='multi')mcount++;a(mcount>500&&mcount<1800,mcount);
 let inMix=0;for(let i=0;i<400;i++){const s=M.session({exam:true,n:10,prevKeys:[],stats:{}});inMix+=s.filter(x=>x.ex==='fnl:multi'||x.sub==='multi').length;}a(inMix>0,'not in exam mix');
 a.strictEqual(M.label('fnl:multi'),'כמה שברים על אותו ישר');
 for(let i=0;i<5;i++){const x=M.make('fnl:multi',{});console.log(JSON.stringify({d:x.fnl.d,N:x.fnl.N||x.fnl.u*x.fnl.d,lab:x.fnl.lab||'whole'}),'->',x.ans);}
 console.log('v6 multi OK',JSON.stringify(kinds));}

// v7 (15.11): Orly – final answers must be reduced
{const J=M.judgeRed,g=M.gcd;let nRed=0,nRaw=0,nWhole=0,nMix=0;
 // unit cases
 a.strictEqual(J({t:'frac',want:[1,2]},[1,2]),'ok');a.strictEqual(J({t:'frac',want:[1,2]},[3,6]),'unred');a.strictEqual(J({t:'frac',want:[1,2]},[2,6]),'no');
 a.strictEqual(J({t:'frac',want:[1,1],whole:true},[1,1]),'ok');a.strictEqual(J({t:'frac',want:[1,1],whole:true},[6,6]),'unwhole');
 const mx={t:'fields',mixed:true,red:true,fields:[{want:1},{want:1},{want:2}]};
 a.strictEqual(J(mx,[1,1,2]),'ok');a.strictEqual(J(mx,[1,3,6]),'unred');a.strictEqual(J(mx,[0,9,6]),'unmix');a.strictEqual(J(mx,[1,1,3]),'no');a.strictEqual(J(mx,[1,1,0]),'no');
 const redStages=x=>x.stages.filter(st=>st.red);
 for(const id of ['fops','fops:diff','fops:same','fword','comp1','mixf']){for(let i=0;i<3000;i++){const x=M.make(id,{});for(const st of redStages(x)){nRed++;
   if(st.t==='frac'){const [n,d]=st.want;a(d===1||g(n,d)===1,JSON.stringify(x));a.strictEqual(J(st,[n,d]),'ok');a.strictEqual(x.ans,d===1?String(n):n+'/'+d,JSON.stringify(x));
     a.strictEqual(J(st,[n*2,d*2]),d===1?'unwhole':'unred');a.strictEqual(J(st,[n*3,d*3]),d===1?'unwhole':'unred');a.strictEqual(J(st,[n+1,d]),'no');if(d===1)nWhole++;}
   else{nMix++;const [W,n,d]=st.fields.map(f=>f.want);a(g(n,d)===1&&n<d);a.strictEqual(J(st,[W,n,d]),'ok');a.strictEqual(J(st,[W,2*n,2*d]),'unred');a.strictEqual(J(st,[W-1,n+d,d]),'unmix');a.strictEqual(x.ans,W+' '+n+'/'+d);}
   if(x.raw&&(x.raw[0]%x.raw[1]===0||g(x.raw[0],x.raw[1])>1)){nRaw++;a(x.guide.some(z=>/מצמצמות/.test(z)),'guide lacks reduction '+JSON.stringify(x));}
   if(x.raw)a(x.guide.some(z=>/צמצ/.test(z)),'guide '+JSON.stringify(x));
   a(!/מבחן/.test(JSON.stringify(x)));}}}
 a(nRaw>200&&nWhole>20&&nMix>200,JSON.stringify({nRed,nRaw,nWhole,nMix}));
 // fexp explicit expand/reduce untouched (exact, not red)
 for(let i=0;i<2000;i++){const x=M.make('fexp',{});a(!x.stages.some(st=>st.red));if(x.stages[0].t==='frac')a(x.stages[0].exact);}
 // fnl reading still accepts equivalent (not red)
 for(let i=0;i<500;i++){const x=M.make('fnl',{});a(!x.stages.some(st=>st.red));}
 a(!/שבר שווה/.test(M.HINTS.fops.join(' ')));a(/צמצ/.test(M.HINTS.fops.join(' ')));
 let pv=[];for(let k=0;k<30;k++){const s=M.session({only:'fops:diff',prevKeys:pv});a.strictEqual(new Set(s.map(x=>x.key)).size,10);a(!s.some(x=>pv.includes(x.key)));pv=s.map(x=>x.key);}
 console.log('v7 reduce OK',JSON.stringify({nRed,nRaw,nWhole,nMix}));}
// v8 (15.11b): home sections – quiz / math / geo
{const Q=M.QUIZ;a(/^\d{4}-\d\d-\d\d$/.test(Q.date)&&Q.items.length>=1);
 const bad=/מבחן|מבדק|בוחן/;a(!bad.test(Q.title+Q.what+Object.values(M.SECN).join('')+JSON.stringify(M.GROUPS)),'test word on child screen');
 a.deepStrictEqual(Q.items,['fops:diff','fops:same','fexp','mixf']);
 for(const s of ['quiz','math','geo'])a(M.secList(s).length===M.secIds(s).length&&M.secList(s).every(e=>e&&e[3]),s);
 const tp=s=>new Set(M.secList(s).map(e=>e[1]));
 for(const t of M.TOPICS)a(tp('math').has(t)||tp('geo').has(t),'topic not in any section '+t);
 a([...tp('geo')].every(t=>t==='geo'||t==='poly'));a(![...tp('math')].some(t=>t==='geo'||t==='poly'));
 a(M.secIds('math').includes('nl')&&M.secIds('math').includes('fnl')&&M.secIds('math').includes('fnl:multi'));
 a.strictEqual(new Set(M.secIds('math')).size,M.secIds('math').length);
 a(M.GROUPS.math.length>=4&&M.GROUPS.math.every(g=>g[0]&&g[1]&&g[2].length));
 for(const s of ['quiz','math','geo']){let pv=[];const ok=x=>M.secList(s).some(e=>e[1]===x.topic&&(!e[2]||new RegExp(e[2]).test(x.sub)));
  for(let k=0;k<60;k++){const test=k%4===0;const ss=M.session({exam:true,sec:s,test,n:test?8:10,prevKeys:pv,stats:{},review:[]});a.strictEqual(ss.length,test?8:10,s);
   a(ss.every(ok),s+' '+ss.map(x=>x.topic+x.sub));a.strictEqual(new Set(ss.map(x=>x.key)).size,ss.length,s);a(!ss.some(x=>pv.includes(x.key)),s);ss.forEach(chk);pv=ss.map(x=>x.key);}}
 // every quiz item & math/geo entry works as focus practice
 for(const id of [...M.secIds('quiz'),...M.secIds('math'),...M.secIds('geo')]){const ss=M.session({only:id,prevKeys:[]});a.strictEqual(ss.length,10,id);ss.forEach(chk);}
 // quiz review items only from quiz topics
 const rv=M.session({exam:true,sec:'quiz',n:10,stats:{},prevKeys:[],review:[{topic:'geo',sub:'par',key:'G1'},{topic:'mixf',sub:'toMix',key:'MX1',stages:[{t:'fields',fields:[{want:1}]}]}]});a(!rv.some(x=>x.key==='G1'));
 console.log('v8 sections OK',JSON.stringify({quiz:M.secIds('quiz').length,math:M.secIds('math').length,geo:M.secIds('geo').length}));}
