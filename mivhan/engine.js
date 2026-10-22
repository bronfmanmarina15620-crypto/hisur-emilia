(function(root){
var S=(typeof module!=="undefined")?require("../seder/engine.js"):root.Seder;
var R=function(a,b){return a+Math.floor(Math.random()*(b-a+1));};
var P=function(a){return a[Math.floor(Math.random()*a.length)];};
var fmt=S.fmt;
var TOPICS=["nl","word","seder","col","miss"];
var LABELS={nl:"ישר המספרים",word:"שאלות מילוליות",seder:"סדר פעולות",col:"חיבור וחיסור במאונך",miss:"מספר חסר"};
var HINTS={
 nl:["כמה קפיצות יש בין שני המספרים הכתובים? חלקי כדי לגלות כמה שווה כל קפיצה.","התחילי מהמספר הכתוב הקרוב, וספרי קפיצות עד הנקודה."],
 word:["סמני את המספרים ואת המילה שקובעת איזו פעולה לעשות.","כתבי את החישוב הראשון בתיבת הביניים. האם התשובה הגיונית?"],
 seder:["זכרי: קודם סוגריים, אחר כך כפל וחילוק, בסוף חיבור וחיסור.","כתבי את התוצאה של הפעולה הראשונה בתיבת הביניים, ואז המשיכי."],
 col:["התחילי מעמודת האחדות – הכי ימינה.","בדקי כל עמודה: בחיבור – אם יצא 10 או יותר מעבירים 1 הלאה; בחיסור – אם הספרה למעלה קטנה, פורטים מהשכנה."],
 miss:["נסי להציב את המספר שלך ובדקי אם יוצא נכון.","איזו פעולה הפוכה תעזור למצוא את המספר החסר?"]};
// ---- number line
var STEPS=[100,500,1000,2000,5000,10000,20000,25000,50000,100000,250000];
function mkNL(){var st=P(STEPS),n=10,top=st>=100000?1000000:st>=10000?900000:200000,start=R(0,Math.max(0,Math.floor((top-n*st)/(st*n))))*st*n;var mark=R(1,n-1);if(mark===5)mark=4;var mode=Math.random()<.5?"read":"place";
 var nl={start:start,step:st,n:n,mark:mark,mode:mode,mid:mode==="read"&&Math.random()<.5};
 var v=start+mark*st;
 return {topic:"nl",sub:mode,prompt:mode==="read"?"איזה מספר מסומן בחץ על הישר?":"געי בשנתה שבה נמצא המספר:",expr:mode==="place"?fmt(v):"",nl:nl,ans:mode==="read"?v:mark,key:"nl"+mode+start+"/"+st+"/"+mark};}
// ---- word problems
var W1=[
 function(){var a=R(120,900),b=R(50,500);return ["בספרייה היו "+fmt(a)+" ספרים. הגיעו עוד "+fmt(b)+" ספרים. כמה ספרים יש עכשיו?",a+"+"+b];},
 function(){var a=R(200,999),b=R(40,a-10);return ["בקופה של הכיתה היו "+fmt(a)+" ₪. קנו מתנה ב־"+fmt(b)+" ₪. כמה כסף נשאר?",a+"-"+b];},
 function(){var a=R(6,12),b=R(3,9);return ["בכל קופסה יש "+a+" עפרונות. יש "+b+" קופסאות. כמה עפרונות יש בסך הכול?",a+"*"+b];},
 function(){var a=R(12,30),b=R(11,25);return ["באולם יש "+a+" שורות, ובכל שורה "+b+" כיסאות. כמה כיסאות יש באולם?",a+"*"+b];},
 function(){var a=R(20000,90000),b=R(1000,a-1000);return ["בעיר גרו "+fmt(a)+" תושבים. "+fmt(b)+" עברו לגור בעיר אחרת. כמה תושבים נשארו?",a+"-"+b];},
 function(){var a=R(10000,500000),b=R(10000,400000);return ["בשבוע הראשון ביקרו במוזיאון "+fmt(a)+" אנשים, ובשבוע השני "+fmt(b)+". כמה מבקרים היו בשני השבועות?",a+"+"+b];}];
var W2=[
 function(){var a=R(2,6),p=R(4,15),c=R(5,30);return ["אמיליה קנתה "+a+" מחברות ב־"+p+" ₪ כל אחת, וגם קלמר ב־"+c+" ₪. כמה שילמה בסך הכול?",a+"*"+p+"+"+c];},
 function(){var a=R(2,5),p=R(20,45),m=a*p+R(5,80);return ["לאבא היו "+m+" ₪. הוא קנה "+a+" כרטיסים לסרט ב־"+p+" ₪ כל אחד. כמה כסף נשאר לו?",m+"-"+a+"*"+p];},
 function(){var b=R(30,200),c=R(30,200),a=b+c+R(10,500);return ["בחנות היו "+a+" כדורים. בבוקר נמכרו "+b+" ובערב "+c+". כמה כדורים נשארו?",a+"-"+b+"-"+c];},
 function(){var s=R(40,55),k=R(2,5),e=R(3,25);return ["בכל אוטובוס יש "+s+" ילדים. לטיול יצאו "+k+" אוטובוסים מלאים, ועוד "+e+" ילדים נסעו במכוניות. כמה ילדים יצאו לטיול?",s+"*"+k+"+"+e];},
 function(){var r=R(4,12),t=R(6,15),d=R(2,r*t-5);return ["בפרדס יש "+r+" שורות, ובכל שורה "+t+" עצים. "+d+" עצים נעקרו בסערה. כמה עצים נשארו?",r+"*"+t+"-"+d];},
 function(){var a=R(1000,9000),b=R(1000,9000),c=R(500,a+b-100);return ["במפעל ייצרו "+fmt(a)+" בקבוקים ביום ראשון ו־"+fmt(b)+" ביום שני. "+fmt(c)+" בקבוקים נשלחו לחנויות. כמה בקבוקים נשארו במפעל?","("+a+"+"+b+")-"+c];}];
function mkWord(){var two=Math.random()<.55,t=P(two?W2:W1)();var s=S.solve(S.tok(t[1]));if(!s)return null;
 return {topic:"word",sub:two?"w2":"w1",prompt:t[0],expr:"",eq:S.show(S.tok(t[1])),ans:s.ans,steps:s.steps.map(function(x){return S.show(x.expr);}),stepBoxes:two?2:1,key:"w"+t[1]};}
// ---- order of operations (seder generators)
function mkSeder(){var lv=P([1,2,3,8,4,5,9,2,3]);var e=S.mkExpr(lv);if(!e)return null;
 return {topic:"seder",sub:"s"+lv,prompt:"כמה יוצא?",expr:e.display,ans:e.ans,steps:e.steps.map(function(x){return S.show(x.expr);}),stepBoxes:e.steps.length>1?2:0,key:"s"+e.key};}
// ---- vertical add/sub
function mkCol(){var add=Math.random()<.5,dA=R(3,6),a,b;
 if(add){a=R(Math.pow(10,dA-1),Math.pow(10,dA)-1);b=R(Math.pow(10,R(2,dA)-1),Math.pow(10,dA)-1);if(a+b>=10000000)return null;}
 else{a=R(Math.pow(10,dA-1)*2,Math.pow(10,dA)-1);b=R(Math.pow(10,R(2,dA)-1),a-1);}
 var ans=add?a+b:a-b;if(ans<0)return null;
 return {topic:"col",sub:add?"add":"sub",prompt:add?"פתרי בחיבור במאונך:":"פתרי בחיסור במאונך:",col:{a:a,b:b,op:add?"+":"−"},ans:ans,steps:[],key:"c"+a+(add?"+":"-")+b};}
// ---- missing number
function mkMiss(){if(Math.random()<.5){var m=S.mkMissing();if(!m)return null;return {topic:"miss",sub:"mp",prompt:"איזה מספר חסר?",expr:m.display,ans:m.ans,steps:[m.full],key:"m"+m.key};}
 var k=R(0,3),a,b,x,disp;
 if(k===0){x=R(100,90000);a=R(100,90000);disp=fmt(a)+" + __ = "+fmt(a+x);}
 else if(k===1){a=R(1000,90000);x=R(100,a-1);disp=fmt(a)+" − __ = "+fmt(a-x);}
 else if(k===2){a=R(2,9);x=R(2,99);disp=a+" × __ = "+fmt(a*x);}
 else {x=R(500,90000);b=R(100,x-1);disp="__ − "+fmt(b)+" = "+fmt(x-b);}
 return {topic:"miss",sub:"m"+k,prompt:"איזה מספר חסר?",expr:disp,ans:x,steps:[disp.replace("__",fmt(x))],key:"m"+disp};}
var MK={nl:mkNL,word:mkWord,seder:mkSeder,col:mkCol,miss:mkMiss};
function make(topic,seen){for(var g=0;g<300;g++){var it=MK[topic]();if(it&&!seen[it.key]){seen[it.key]=1;it.hints=HINTS[topic];return it;}}return null;}
function weights(stats){var w={};TOPICS.forEach(function(t){var s=stats&&stats[t];var sc=1.2;
 if(s&&s.n>=3)sc=0.5+(s.tries/s.n-1)*1.5+s.help/s.n*3+(1-s.first/s.n)*1.5;w[t]=Math.max(.4,Math.min(4,sc));});return w;}
function pickW(w){var tot=0,k;for(k in w)tot+=w[k];var r=Math.random()*tot;for(k in w){r-=w[k];if(r<=0)return k;}return TOPICS[0];}
// opts: {n, stats, counts (items ever per topic), review:[items], prevKeys, test}
function session(o){o=o||{};var n=o.n||10,seen={},out=[],i;
 (o.prevKeys||[]).forEach(function(k){seen[k]=1;});
 if(!o.test)(o.review||[]).slice(0,3).forEach(function(it){var c=JSON.parse(JSON.stringify(it));c.review=true;delete seen[c.key];if(!seen[c.key]){seen[c.key]=1;out.push(c);}});
 var w=weights(o.stats);
 var fresh=TOPICS.filter(function(t){return !o.test&&(o.counts||{})[t]===undefined||(!o.test&&(o.counts||{})[t]<4);});
 if(fresh.length&&out.length<n){var nt=fresh[0];for(i=0;i<4&&out.length<n-2;i++){var it=make(nt,seen);if(it){it.block=true;out.push(it);}}}
 var rest=[],tries=0;
 TOPICS.forEach(function(t){if(o.test||!out.some(function(q){return q.topic===t;})){if(out.length+rest.length<n){var it=make(t,seen);if(it)rest.push(it);}}});
 while(out.length+rest.length<n&&tries++<500){var t=pickW(w);var it2=make(t,seen);if(it2)rest.push(it2);}
 for(i=rest.length-1;i>0;i--){var r0=Math.floor(Math.random()*(i+1));var t0=rest[i];rest[i]=rest[r0];rest[r0]=t0;}
 // interleave: avoid same topic twice in a row
 for(i=1;i<rest.length;i++){if(rest[i].topic===rest[i-1].topic){for(var j=i+1;j<rest.length;j++)if(rest[j].topic!==rest[i-1].topic){var tmp=rest[i];rest[i]=rest[j];rest[j]=tmp;break;}}}
 if(o.test){for(i=rest.length-1;i>0;i--){var r=Math.floor(Math.random()*(i+1));var t2=rest[i];rest[i]=rest[r];rest[r]=t2;}}
 return out.concat(rest).slice(0,n);}
var api={session:session,make:make,TOPICS:TOPICS,LABELS:LABELS,HINTS:HINTS,fmt:fmt,S:S,weights:weights};
if(typeof module!=="undefined")module.exports=api;else root.Mivhan=api;
})(this);
