const S=require('./engine.js');const a=require('assert');
S.TEACHER.forEach(e=>{const r=S.solve(S.tok(e));console.log(S.show(S.tok(e)),'=',r.ans);});
const sum=S.TEACHER.slice(0,10).reduce((s,e)=>s+S.solve(S.tok(e)).ans,0);a.strictEqual(sum,17178);
let prev=null,n=0;
for(let i=0;i<300;i++){const st=i%2?{}:{3:{n:10,tries:25,help:3,first:2},1:{n:10,tries:10,help:0,first:10}};const s=S.session(prev?prev.map(x=>x.key):[],st);a.strictEqual(s.length,20);
 a.strictEqual(new Set(s.map(x=>x.key)).size,20);
 if(prev)a.notDeepStrictEqual(s.map(x=>x.key),prev.map(x=>x.key));
 for(const x of s){n++;
  a(x.steps.length>=1);x.steps.forEach(st=>a(Number.isInteger(st.v)&&st.v>=0,x.key));
  const last=x.steps[x.steps.length-1].v;
  if(x.type<=5||x.type>=8){a(Number.isInteger(x.ans)&&x.ans>=0);a.strictEqual(last,x.ans);}
  if(x.type==6){a(x.display.includes('__'));a.strictEqual(x.display.replace('__',S.fmt(x.ans)).replace(/ /g,''),x.full.replace(/ /g,''));
    a.strictEqual(String(last),x.display.split('= ')[1].replace(/,/g,''));}
  if(x.type==7){a(x.ans>=1&&x.ans<=x.wrong.length);a.notStrictEqual(x.wrong.at(-1).replace(/,/g,''),String(x.correct));a.strictEqual(last,x.correct);}
 }prev=s;}
console.log('OK',n,'items');
const pl=S.plan({3:{n:10,tries:25,help:3,first:2},1:{n:10,tries:10,help:0,first:10}});console.log('adaptive plan',pl.join(','));a(pl.filter(x=>x==3).length>pl.filter(x=>x==1).length);
