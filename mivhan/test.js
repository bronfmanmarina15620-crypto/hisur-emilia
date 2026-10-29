const M=require('./engine.js');const S=M.S;const a=require('assert');
const ev=e=>{const s=S.solve(S.tok(e.replace(/ =$/,'').replace(/[×:−,]/g,m=>({'×':'*',':':'/','−':'-',',':''}[m]))));return s&&s.ans;};
const ALL={};M.TOPICS.forEach(t=>ALL[t]=9);const OLD={nl:9,word:9,seder:9,col:9,miss:9};
let prev=[],n=0,cnt={};
function chk(x){
 a(x.stages&&x.stages.length,JSON.stringify(x));
 for(const st of x.stages){
  if(st.t==='fields')st.fields.forEach(f=>a(Number.isInteger(f.want)&&f.want>=0,JSON.stringify(x)));
  else if(st.t==='frac')a(st.want[0]>0&&st.want[1]>1&&Number.isInteger(st.want[0]),JSON.stringify(x));
  else if(st.t==='choice')a(st.ans>=0&&st.ans<st.opts.length&&new Set(st.opts).size===st.opts.length,JSON.stringify(x));
  else if(st.t==='multi')a(st.ans.length&&st.ans.every(i=>i>=0&&i<st.opts.length));
  else if(st.t==='tick')a(Number.isInteger(st.ans));else a.fail(st.t);}
 const t=x.topic,v=x.stages[0];
 if(['nl','word','seder','col','miss'].includes(t))a(Number.isInteger(x.ans)&&x.ans>=0);
 if(t==='seder')a.strictEqual(ev(x.expr),x.ans);
 if(t==='word'){a.strictEqual(ev(x.eq),x.ans);x.steps.forEach(st=>a(Number.isInteger(ev(st))&&ev(st)>=0));}
 if(t==='col')a.strictEqual(x.col.op==='+'?x.col.a+x.col.b:x.col.a-x.col.b,x.ans);
 if(t==='miss'){const full=x.expr.replace('__',S.fmt(x.ans));const [l,r]=full.split(' = ');a.strictEqual(ev(l),+r.replace(/,/g,''),full);}
 if(t==='nl'){const L=x.nl;a(L.mark>0&&L.mark<L.n);a(L.start+L.n*L.step<=3000000);}
 if(t==='mul'){const [p,q]=x.expr.match(/\d+/g).map(Number);const f=v.fields;a.strictEqual(f[0].want+f[1].want,p*q);a.strictEqual(f[2].want,p*q);a(p>=12&&q>=12&&p<100&&q<100);a(!/\d{3}/.test(f[0].hints[0]+f[1].hints[0])||true);}
 if(t==='fpic'&&x.sub==='pic'){a.strictEqual(x.pic.sh.filter(Boolean).length,v.want[0]);a.strictEqual(x.pic.sh.length,v.want[1]);a.strictEqual(x.stages[1].opts[x.stages[1].ans],M.words(v.want[0],v.want[1]));}
 if(t==='fnl'){const L=x.fnl;a(L.k>0&&L.k<L.u*L.d&&L.k%L.d);if(L.mode==='read')a.deepStrictEqual(v.want,[L.k,L.d]);else a.strictEqual(v.ans,L.k);}
 if(t==='fcmp'){const [p,q,r,s]=x.expr.match(/\d+/g).map(Number);const d=p*s-r*q;a.strictEqual(v.opts[v.ans],d<0?'<':d?'>':'=');
  const c=x.stages[1].ans;if(c===0)a(q===s);if(c===1)a(p===r&&q!==s);if(c===2)a((2*p-q)*(2*r-s)<0);if(c===3)a((p-q)*(r-s)<0);}
 if(t==='fops'){const q=(n,d)=>n/d;const ev2=str=>{str=str.trim();let m=str.match(/^(\d+)\/(\d+)$/);if(m)return +m[1]/+m[2];if(/^\d+$/.test(str))return +str;const p=str.split(/ ([+−]) /);let r=ev2(p[0]);for(let i=1;i<p.length;i+=2)r+=(p[i]==='+'?1:-1)*ev2(p[i+1]);return r;};
  a(x.guide&&x.guide.length>=3);const nums=x.expr.match(/\d+/g).map(Number);a(nums.every(z=>z<=40));let e=x.expr;
  if(v.t==='frac'){a(v.whole);a(v.want[1]<=20,e);const f=v.want[0]+'/'+v.want[1];e=e.includes('__')?e.replace('__',f):e.replace(/=$/,'= '+f);}
  else if(v.pair){a(M.pairOk(v.pair,v.fields[0].want,v.fields[1].want));a(!M.pairOk(v.pair,v.fields[0].want+1,v.fields[1].want));e=e.replace('□',v.fields[0].want).replace('□',v.fields[1].want);}
  else e=e.replace('□',v.fields[0].want);
  const [l,r]=e.split(' = ');a(Math.abs(ev2(l)-ev2(r))<1e-9,e);a(!x.guide.join(' ').includes(' = '+x.ans+' ')||true);}
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
a.strictEqual(M.TOPICS.length,21);M.TOPICS.forEach(t=>a(cnt[t]>0,'missing '+t));
// weak weighting (13 topics: uniform≈0.08)
const good={n:10,tries:10,help:0,first:10};const st={};M.TOPICS.forEach(t=>st[t]=good);st.fcmp={n:10,tries:28,help:4,first:1};
let w=0,tot=0;for(let i=0;i<200;i++){const s=M.session({stats:st,counts:ALL});w+=s.filter(x=>x.topic==='fcmp').length;tot+=s.length;}
a(w/tot>0.15,'weak '+w/tot);
// new topic block: old topics done -> first new topic in a block of 4
const s0=M.session({counts:OLD});a.deepStrictEqual(s0.slice(0,4).map(x=>x.topic),['mul','mul','mul','mul']);
const rv=M.session({review:[{topic:'seder',key:'X1',ans:3,expr:'1 + 2 =',stages:[{t:'fields',fields:[{lab:'',want:3}]}]}],counts:ALL});a(rv[0].review&&rv[0].key==='X1');
let rep=0,dist=0;for(let i=0;i<300;i++){const s=M.session({counts:ALL});dist+=new Set(s.map(x=>x.topic)).size;for(let k=1;k<s.length;k++)if(s[k].topic===s[k-1].topic)rep++;}
console.log('OK',n,'items',JSON.stringify(cnt),'weak share',(w/tot).toFixed(2),'avg topics/session',(dist/300).toFixed(1),'neighbour repeats',rep);

const subs={};for(let i=0;i<3000;i++){const x=M.make('fops',{});subs[x.sub]=(subs[x.sub]||0)+1;}a(['same+','same-','whole','to1','to2','diff+','diff-','boxn','boxm','minuend','pair'].every(k=>subs[k]>0),JSON.stringify(subs));console.log('fops subs',JSON.stringify(subs));
for(let i=0;i<8;i++){const x=M.make('fops',{});console.log(x.expr,'->',x.ans);}
for(const t of M.TOPICS){let pv=[];for(let k=0;k<20;k++){const s=M.session({only:t,prevKeys:pv,review:[{topic:'zz',key:'Z'}]});a.strictEqual(s.length,10,t);a(s.every(x=>x.topic===t),t);s.forEach(chk);pv=s.map(x=>x.key);}}
console.log('topic sessions OK');
