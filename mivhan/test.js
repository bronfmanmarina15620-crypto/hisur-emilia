const M=require('./engine.js');const S=M.S;const a=require('assert');
const ev=e=>{const s=S.solve(S.tok(e.replace(/ =$/,'').replace(/[×:−,]/g,m=>({'×':'*',':':'/','−':'-',',':''}[m]))));return s&&s.ans;};
let prev=[],n=0,cnt={},stats={};
for(let i=0;i<400;i++){const test=i%7==0;const s=M.session({n:test?8:10,stats:i%2?{}:{col:{n:10,tries:25,help:3,first:2}},counts:i<5?{}:{nl:9,word:9,seder:9,col:9,miss:9},prevKeys:prev,test});
 a.strictEqual(s.length,test?8:10);a.strictEqual(new Set(s.map(x=>x.key)).size,s.length);
 if(test)a(new Set(s.map(x=>x.topic)).size>=5);
 for(const x of s){n++;cnt[x.topic]=(cnt[x.topic]||0)+1;
  a(Number.isInteger(x.ans)&&x.ans>=0,JSON.stringify(x));
  if(x.topic==='seder')a.strictEqual(ev(x.expr),x.ans);
  if(x.topic==='word'){a.strictEqual(ev(x.eq),x.ans);x.steps.forEach(st=>a(Number.isInteger(ev(st))&&ev(st)>=0));}
  if(x.topic==='col'){a.strictEqual(x.col.op==='+'?x.col.a+x.col.b:x.col.a-x.col.b,x.ans);}
  if(x.topic==='miss'){const full=x.expr.replace('__',S.fmt(x.ans));const [l,r]=full.split(' = ');a.strictEqual(ev(l),+r.replace(/,/g,''),full);}
  if(x.topic==='nl'){const L=x.nl;a(L.mark>0&&L.mark<L.n);if(L.mode==='read')a.strictEqual(x.ans,L.start+L.mark*L.step);else{a.strictEqual(x.ans,L.mark);a.strictEqual(x.expr,S.fmt(L.start+L.mark*L.step));}a(L.start+L.n*L.step<=3000000);}
 }
 if(prev.length)a.notDeepStrictEqual(s.map(x=>x.key),prev);prev=s.map(x=>x.key);}
// weak topic weighting
let col=0,tot=0;for(let i=0;i<200;i++){const s=M.session({stats:{col:{n:10,tries:28,help:4,first:1},nl:{n:10,tries:10,help:0,first:10},word:{n:10,tries:10,help:0,first:10},seder:{n:10,tries:10,help:0,first:10},miss:{n:10,tries:10,help:0,first:10}},counts:{nl:9,word:9,seder:9,col:9,miss:9}});col+=s.filter(x=>x.topic==='col').length;tot+=s.length;}
a(col/tot>0.4,'weak weighting '+col/tot);
// new topic block
const s0=M.session({counts:{nl:9,word:9,seder:9,miss:9}});a.deepStrictEqual(s0.slice(0,4).map(x=>x.topic),['col','col','col','col']);
// review first
const rv=M.session({review:[{topic:'seder',key:'X1',ans:3,expr:'1 + 2 ='}],counts:{nl:9,word:9,seder:9,col:9,miss:9}});a(rv[0].review&&rv[0].key==='X1');
console.log('OK',n,'items over 400 sessions',cnt,'weak col share',(col/tot).toFixed(2));
for(let i=0;i<300;i++){const s=M.session({counts:{nl:9,word:9,seder:9,col:9,miss:9}});a.strictEqual(new Set(s.map(x=>x.topic)).size,5);for(let k=1;k<s.length;k++)if(s[k].topic===s[k-1].topic&&!s[k].block)cnt.rep=(cnt.rep||0)+1;}
console.log('all topics each session OK; same-topic neighbours',cnt.rep||0,'/3000');
