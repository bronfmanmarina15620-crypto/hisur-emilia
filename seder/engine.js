(function(root){
var R=function(a,b){return a+Math.floor(Math.random()*(b-a+1));};
var P=function(arr){return arr[Math.floor(Math.random()*arr.length)];};
function fmt(n){return typeof n==="number"?n.toLocaleString("en-US"):n;}
function show(t){return t.map(function(x){return typeof x==="number"?fmt(x):({"*":"×","/":":","-":"−"}[x]||x);}).join(" ").replace(/\( /g,"(").replace(/ \)/g,")").replace(/\(([\d,]+)\)/g,"$1");}
function tok(s){var o=[],m,re=/\d+|[-+*\/()]/g;while((m=re.exec(s)))o.push(/\d/.test(m[0])?+m[0]:m[0]);return o;}
function ap(a,op,b){var r=op=="+"?a+b:op=="-"?a-b:op=="*"?a*b:(b===0?NaN:a/b);return r;}
// one correct step; returns {t,op:[i]} or null
function step(t){var lo=0,hi=t.length,i;
 for(i=0;i<t.length;i++){if(t[i]=="(")lo=i+1;if(t[i]==")"){hi=i;break;}}
 if(hi<t.length||lo>0){ /* innermost group lo..hi */ }
 if(lo>0&&hi-lo==1){var n=t.slice();n.splice(hi,1);n.splice(lo-1,1);return {t:n,removed:true};}
 var k=-1;for(i=lo;i<hi;i++)if(t[i]=="*"||t[i]=="/"){k=i;break;}
 if(k<0)for(i=lo;i<hi;i++)if(t[i]=="+"||t[i]=="-"){k=i;break;}
 if(k<0)return null;
 var v=ap(t[k-1],t[k],t[k+1]);var n2=t.slice();n2.splice(k-1,3,v);
 return {t:n2,at:k-1,v:v,a:t[k-1],o:t[k],b:t[k+1]};}
function solve(t){var steps=[],s;t=t.slice();
 while(t.length>1){s=step(t);if(!s)return null;t=s.t;
  if(s.removed)continue;
  if(!(Number.isInteger(s.v)&&s.v>=0))return null;
  steps.push({a:s.a,o:s.o,b:s.b,v:s.v,expr:t.slice()});}
 // strip leftover parens
 return {ans:t[0],steps:steps};}
// templates: each returns string
var T={
 1:[function(){var c=R(2,9),q=R(2,9);return R(5,60)+"+"+(c*q)+"/"+c;},
    function(){var b=R(2,9),c=R(2,9);return (b*c+R(1,50))+"-"+b+"*"+c;},
    function(){return R(2,9)+"*"+R(2,12)+"+"+R(1,40);},
    function(){var b=R(2,9);return (b*R(2,10))+"/"+b+"+"+R(1,30);},
    function(){return R(10,90)+"-"+R(2,9)+"*"+R(1,5);}],
 2:[function(){var b=R(1,3)*10,c=R(2,6);return (b*c+R(0,50))+"-"+b+"*"+c+"+"+R(1,20);},
    function(){return R(20,40)+"-"+R(2,6)+"*"+R(1,3)+"+"+R(2,5)+"*"+R(2,5);},
    function(){var c=R(2,4),d=P([2,3]);var b=d*R(1,4);var f=R(1,9);return (b*c/d+R(10,40))+"-"+b+"*"+c+"/"+d+"+"+f+"/"+f;},
    function(){var b=R(2,9);return (b*R(2,9))+"/"+b+"+"+R(2,9)+"*"+R(2,9);},
    function(){var b=R(2,9);return R(2,9)+"*"+R(2,9)+"-"+(b*R(1,3))+"/"+b;}],
 3:[function(){var b=R(1,9)*10;return "("+(b+R(1,10)*10)+"-"+b+")*"+R(2,6)+"+"+R(1,20);},
    function(){var b=R(1,5)*10;return "("+(b+R(1,5)*10)+"-"+b+")*("+R(1,5)+"+"+R(1,9)+")";},
    function(){return R(2,9)+"*("+R(1,9)+"+"+R(1,9)+")";},
    function(){var c=R(2,6);return "("+R(1,40)+"+"+R(1,40)+")-"+c+"*"+R(1,4);},
    function(){var d=R(2,5),s=d*R(2,9),a=R(1,s-1);return "("+a+"+"+(s-a)+")/"+d+"+"+R(1,9);}],
 4:[function(){var c=R(1,5)*100,a=R(2*c/100,20)*100;return a+"+"+R(1,5)*100+"-"+c+"*2";},
    function(){var c=R(1,6)*100;return "2*1000+"+R(1,9)*100+"-"+c+"*3";},
    function(){return R(1,9)*100+R(10,40)*100+"+"+R(1,9)*100+"-1000/2";},
    function(){var a=R(1,9)*1000,b=R(1,9)*1000,c=R(1,9)*1000;return "("+a+"+"+b+")*("+c+"/"+c+")";},
    function(){var d=P([2,4,5]);return R(1,5)*1000+"+"+(d*R(1,9)*100)+"/"+d;}],
 8:[function(){var a=R(20,60),b=R(1,a-1);return a+"-"+b+"+"+R(1,20);},
    function(){var b=R(2,6),q=R(2,9);return (b*q)+"/"+b+"*"+R(2,5);},
    function(){var b=R(2,5),c=R(2,6);return (b*c*R(1,4))+"/"+b+"/"+c;},
    function(){var a=R(30,90),b=R(1,20),c=R(1,a-b-1);return a+"-"+b+"-"+c;},
    function(){var a=R(2,6),b=R(2,6);return a+"*"+b+"/"+(P([a,b]));}],
 9:[function(){var c=R(2,4),q=R(2,5),a=R(1,c*q-1);return R(2,5)+"*(("+a+"+"+(c*q-a)+")/"+c+")";},
    function(){return "("+R(2,6)+"+"+R(1,5)+"*("+R(1,9)+"+"+R(1,9)+"))-"+R(1,5);},
    function(){var b=R(1,9);return R(50,100)+"-("+R(2,5)+"*("+(b+R(1,5))+"-"+b+"))";},
    function(){return "(("+R(10,40)+"-"+R(1,9)+")+"+R(1,9)+")*"+R(2,4);}],
 5:[function(){return R(2,20)+"*100-100*0";},
    function(){return R(10,99)+"*1+"+R(2,9)+"*0";},
    function(){return R(100,900)+"/1-"+R(1,9)+"*0";},
    function(){return R(2,9)+"*0+"+R(2,9)+"*1";},
    function(){return "("+R(5,50)+"-"+R(1,4)+")*0+"+R(1,30);}],
};
// missing number: {disp, ans(blank), full tokens, rhs}
var M=[function(){var a=R(1,9),b=R(2,5),c=R(1,9),x=R(1,9);return [a+"+"+b+"*("+c+"+",x,")",a+b*(c+x)];},
 function(){var a=R(1,9),b=R(1,9),x=R(1,9);return [a+"+("+b+"+",x,")",a+b+x];},
 function(){var a=R(2,6),b=R(1,6),x=R(1,9);return [a+"*(",x,"+"+b+")",a*(x+b)];},
 function(){var a=R(2,9);return [a+"/",a,"",1];},
 function(){var a=R(2,5),b=R(2,9),x=R(1,9);return ["("+b+"+",x,")*"+a,(b+x)*a];}];
function mkMissing(){var m=P(M)();var full=tok(m[0]+m[1]+m[2]);var s=solve(full);if(!s||s.ans!==m[3])return null;
 var left=show(tok(m[0])),right=m[2]?show(tok(m[2])):"";
 return {type:6,display:(left+" __ "+right).replace("( __","(__").replace("__ )","__)").replace(/\s+/g," ").trim()+" = "+fmt(m[3]),ans:m[1],full:show(full)+" = "+fmt(m[3]),steps:s.steps,key:m[0]+"_"+m[2]+"="+m[3]};}
function mkExpr(level){var str=P(T[level])();var t=tok(str);var s=solve(t);if(!s)return null;
 return {type:level,display:show(t)+" =",ans:s.ans,steps:s.steps,key:str,tokens:t};}
// find-the-mistake: build a wrong worked solution
function mkMistake(){var e=mkExpr(P([2,2,3,4,8]));if(!e||e.steps.length<2)return null;
 var t=e.tokens.slice(),cur=t,wsteps=[],k=R(0,e.steps.length-2),i;
 // replay k correct steps
 var c=t.slice(),done=0,s;
 while(done<k){s=step(c);c=s.t;if(!s.removed){wsteps.push(c.slice());done++;}}
 while(true){s=step(c);if(s&&s.removed){c=s.t;continue;}break;}
 // make error: if there is +/- before a */ with no parens -> do leftmost op; else arithmetic error
 var n=c.slice(),kind;var hasP=c.indexOf("(")>=0;var j=1;
 var hasMul=c.some(function(x){return x=="*"||x=="/";});
 if(!hasP&&hasMul&&(c[1]=="+"||c[1]=="-")){var v=ap(c[0],c[1],c[2]);n.splice(0,3,v);kind="order";}
 else{var cs=step(c);if(!cs||cs.removed)return null;n=cs.t.slice();var d=P([10,1,100]);n[cs.at]=cs.v+(cs.v>=d&&Math.random()<.5?-d:d);kind="calc";}
 if(!Number.isInteger(n[0])||n.some(function(x){return typeof x=="number"&&(x<0||!Number.isInteger(x));}))return null;
 wsteps.push(n.slice());var bad=wsteps.length;c=n;
 while(c.length>1){s=step(c);if(!s)return null;c=s.t;if(s.removed)continue;if(!(Number.isInteger(s.v)&&s.v>=0))return null;wsteps.push(c.slice());}
 if(c[0]===e.ans||wsteps.length>4)return null;
 return {type:7,display:e.display,ans:bad,kind:kind,wrong:wsteps.map(show),steps:e.steps,correct:e.ans,key:"M"+e.key+"#"+bad};}
var LABELS={1:"כפל וחילוק לפני חיבור וחיסור",2:"כמה פעולות בלי סוגריים",8:"אותה דרגה – משמאל לימין",3:"סוגריים",9:"סוגריים בתוך סוגריים",4:"מספרים באלפים",5:"כפל ב־0 וב־1, חילוק ב־1",6:"מספר חסר",7:"מצאי את הטעות"};
var ORDER=[1,8,5,2,3,4,6,9,7]; // easy -> hard
// stats: {type:{n,tries,ms,help}} ; returns 20-item plan, weak types get more
function plan(stats,N){N=N||20;stats=stats||{};var w={};
 ORDER.forEach(function(t){var s=stats[t];var score=1;
  if(s&&s.n>=3){var at=s.tries/s.n,hr=s.help/s.n,fr=(s.first||0)/s.n;score=0.5+(at-1)*1.5+hr*3+(1-fr)*1.5;}else if(s&&s.n>0)score=1.2;else score=1.3;
  w[t]=Math.max(0.4,Math.min(4,score));});
 var tot=ORDER.reduce(function(a,t){return a+w[t];},0),cnt={},used=0;
 ORDER.forEach(function(t){cnt[t]=Math.max(1,Math.floor(w[t]/tot*N));used+=cnt[t];});
 var rank=ORDER.slice().sort(function(a,b){return w[b]-w[a];}),i=0;
 while(used<N){cnt[rank[i++%rank.length]]++;used++;}
 while(used>N){var t=rank.slice().reverse().find(function(t){return cnt[t]>1;});cnt[t]--;used--;}
 var out=[];ORDER.forEach(function(t){for(var k=0;k<cnt[t];k++)out.push(t);});return out;}
function session(prevKeys,stats){prevKeys=prevKeys||[];var PLAN=plan(stats);
 for(var tries=0;tries<50;tries++){var seen={},out=[];
  for(var p=0;p<PLAN.length;p++){var it=null,g=0;
   while(!it&&g++<500){var c=PLAN[p]==6?mkMissing():PLAN[p]==7?mkMistake():mkExpr(PLAN[p]);if(c&&!seen[c.key])it=c;}
   if(!it)break;seen[it.key]=1;out.push(it);}
  if(out.length!==PLAN.length)continue;
  var same=out.every(function(x){return prevKeys.indexOf(x.key)>=0;});
  if(!same)return out;}
 throw new Error("gen fail");}
var TEACHER=["20+30/5","120-20*5+10","(120-20)*5+10","(120-20)*(5+10)","120/20+3*2","1500+100-600*2","2*1000+500-500*3","2800+200-1000/2","(4000+6000)*(6000/6000)","12*100-100*0","24-2*1+3*3","36-6*2/3+4/4"];
var api={session:session,plan:plan,ORDER:ORDER,solve:solve,tok:tok,show:show,fmt:fmt,LABELS:LABELS,TEACHER:TEACHER,step:step};
if(typeof module!=="undefined")module.exports=api;else root.Seder=api;
})(this);
