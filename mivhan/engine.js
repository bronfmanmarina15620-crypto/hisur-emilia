(function(root){
var S=(typeof module!=="undefined")?require("../seder/engine.js"):root.Seder;
var R=function(a,b){return a+Math.floor(Math.random()*(b-a+1));};
var P=function(a){return a[Math.floor(Math.random()*a.length)];};
var fmt=S.fmt;
var TOPICS=["nl","word","seder","col","miss","mul","fpic","fnl","fcmp","fword","fops","geo","chart"];
var LABELS={nl:"ישר המספרים",word:"שאלות מילוליות",seder:"סדר פעולות",col:"חיבור וחיסור במאונך",miss:"מספר חסר",mul:"כפל דו־ספרתי",fpic:"שברים בציור ובמילים",fnl:"שברים על ישר",fcmp:"השוואת שברים",fword:"שאלות עם שברים",fops:"חיבור וחיסור שברים",geo:"צלעות מקבילות וסמוכות",chart:"דיאגרמות"};
var HINTS={
 nl:["כמה קפיצות יש בין שני המספרים הכתובים? חלקי כדי לגלות כמה שווה כל קפיצה.","התחילי מהמספר הכתוב הקרוב, וספרי קפיצות עד הנקודה."],
 word:["סמני את המספרים ואת המילה שקובעת איזו פעולה לעשות.","כתבי את החישוב הראשון בתיבת הביניים. האם התשובה הגיונית?"],
 seder:["זכרי: קודם סוגריים, אחר כך כפל וחילוק, בסוף חיבור וחיסור.","כתבי את התוצאה של הפעולה הראשונה בתיבת הביניים, ואז המשיכי."],
 col:["התחילי מעמודת האחדות – הכי ימינה.","בדקי כל עמודה: בחיבור – אם יצא 10 או יותר מעבירים 1 הלאה; בחיסור – אם הספרה למעלה קטנה, פורטים מהשכנה."],
 mul:["חשבי כל שורה בנפרד, ובסוף חברי.","בדקי כל שורה שוב."],
 fpic:["ספרי כמה חלקים יש בכל הצורה – זה המכנה. כמה צבועים – זה המונה.","המכנה למטה, המונה למעלה."],
 fnl:["לכמה חלקים שווים מחולק כל שלם (מ־0 עד 1)? זה המכנה.","ספרי את הקפיצות מ־0 ועד החץ."],
 fcmp:["אם המכנה שווה – משווים מונים. אם המונה שווה – מכנה קטן יותר = חלק גדול יותר.","נסי להשוות כל שבר לחצי או לשלם."],
 fword:["מצאי קודם כמה זה חלק אחד (חלקי במכנה).","בשבר עם אותו מכנה – מחברים או מחסרים רק את המונים."],
 fops:["אם המכנים שונים – קודם מוצאים מכנה משותף וממירים. אחר כך מחברים או מחסרים רק את המונים.","בדקי: המכנה המשותף נכון? ההמרה נכונה? אפשר גם לכתוב שבר שווה – למשל 2/4 במקום 1/2."],
 geo:["צלעות מקבילות לא נפגשות לעולם, גם אם ממשיכים אותן.","צלעות סמוכות נוגעות זו בזו בקודקוד משותף."],
 chart:["קראי את הכותרת ואת המקרא לפני שמתחילות.","עקבי עם האצבע מראש העמודה אל המספרים בצד."],
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

// ======== v2 topics ========
function gcd(a,b){return b?gcd(b,a%b):a;}
var DN={2:["חצי","חצאים",1],3:["שליש","שלישים",1],4:["רבע","רבעים",1],5:["חמישית","חמישיות",0],6:["שישית","שישיות",0],8:["שמינית","שמיניות",0],10:["עשירית","עשיריות",0]};
var NM=["","","שני","שלושה","ארבעה","חמישה","שישה","שבעה","שמונה","תשעה"],NF=["","","שתי","שלוש","ארבע","חמש","שש","שבע","שמונה","תשע"];
function words(n,d){var x=DN[d];if(n===1)return x[0];return (x[2]?NM:NF)[n]+" "+x[1];}
function fr(n,d){return n+"/"+d;}
function F(st){return st;} // stage passthrough
function numStage(ans,lab){return {t:"fields",fields:[{lab:lab||"",want:ans}]};}
// 2-digit x 2-digit (kefel-up logic)
function mkMul(){var a=R(12,99),b=R(12,99);if(a%10===0||b%10===0)return null;var t=Math.floor(b/10)*10,u=b%10,at=Math.floor(a/10)*10,au=a%10;
 return {topic:"mul",sub:"dd",prompt:"פתרי בשלבים:",expr:a+" × "+b+" =",ans:a*b,steps:[a+" × "+t+" = "+fmt(a*t),a+" × "+u+" = "+fmt(a*u),fmt(a*t)+" + "+fmt(a*u)+" = "+fmt(a*b)],
  stages:[{t:"fields",fields:[{lab:a+" × "+t+" =",want:a*t,hints:["חשבי "+a+" × "+(t/10)+" ואז הוסיפי 0 בסוף","בדקי שוב את השורה הראשונה."]},
   {lab:a+" × "+u+" =",want:a*u,hints:["פרקי: "+at+" × "+u+" ועוד "+au+" × "+u,"בדקי שוב את השורה השנייה."]},
   {lab:"סכום =",want:a*b,hints:["חברי את שתי השורות שלמעלה.","בדקי את החיבור, עמודה אחרי עמודה."]}]}],key:"x"+a+"*"+b};}
// fraction picture / words
function mkFpic(){var d=P([2,3,4,5,6,8,10]),n=R(1,d-1);
 if(Math.random()<.3)return {topic:"fpic",sub:"w2d",prompt:"כתבי במספרים: "+words(n,d),expr:"",ans:fr(n,d),stages:[{t:"frac",want:[n,d],exact:true}],key:"fw"+n+"/"+d};
 var shape=d<=8&&Math.random()<.5?"pie":"bar",sh=[];for(var i=0;i<d;i++)sh.push(i<n);if(shape==="bar"&&Math.random()<.5)sh.sort(function(){return Math.random()-.5;});
 var opts=[words(n,d)],cand=[[d-n,d],[n,d===10?8:d+1],[n+1<d?n+1:n-1,d]];
 cand.forEach(function(c){if(c[0]>=1&&c[0]<c[1]&&DN[c[1]]){var w=words(c[0],c[1]);if(opts.indexOf(w)<0)opts.push(w);}});
 while(opts.length<3){var dd=P([2,3,4,5,6,8,10]),nn=R(1,dd-1),w2=words(nn,dd);if(opts.indexOf(w2)<0)opts.push(w2);}
 var o=opts.slice().sort(function(){return Math.random()-.5;});
 return {topic:"fpic",sub:"pic",prompt:"איזה חלק מהצורה צבוע?",pic:{shape:shape,sh:sh},ans:fr(n,d),
  stages:[{t:"frac",want:[n,d],exact:true,q:"כתבי כשבר:"},{t:"choice",opts:o,ans:o.indexOf(words(n,d)),q:"ואיך קוראים לשבר הזה?"}],key:"fp"+shape+sh.map(Number).join("")};}
// fractions on number line
function mkFnl(){var u=P([1,1,2]),d=u===1?P([2,3,4,5,6,8,10]):P([2,3,4,5]),N=u*d,k=R(1,N-1);if(k%d===0)k=k===1?2:k-1;if(k%d===0)return null;
 var mode=Math.random()<.5?"read":"place",nl={u:u,d:d,k:k,mode:mode};
 return {topic:"fnl",sub:mode,prompt:mode==="read"?"איזה שבר מסומן בחץ?":"געי בשנתה של השבר:",expr:mode==="place"?fr(k,d):"",fnl:nl,ans:mode==="read"?fr(k,d):k,
  stages:[mode==="read"?{t:"frac",want:[k,d]}:{t:"tick",ans:k}],key:"fn"+mode+u+"/"+d+"/"+k};}
// compare fractions
var REASONS=["אותו מכנה – משווים את המונים","אותו מונה – כשהמכנה קטן יותר, החלקים גדולים יותר","משווים לחצי","משווים לשלם"];
function mkFcmp(){var c=R(0,3),a,b,x,y;
 if(c===0){x=P([3,4,5,6,8,10]);a=R(1,x-1);b=R(1,x-1);if(Math.random()<.15)b=a;y=x;var A=[a,x],B=[b,x];}
 else if(c===1){var n=R(1,5);x=R(n+1,10);y=R(n+1,10);if(x===y)return null;A=[n,x];B=[n,y];}
 else if(c===2){var d1=P([4,5,6,8,10]),d2=P([3,4,5,6,8,10]);if(d1===d2)return null;var s=R(1,Math.ceil(d1/2)-1);var l=R(Math.floor(d2/2)+1,d2-1);if(s*2>=d1||l*2<=d2)return null;A=[s,d1];B=[l,d2];if(Math.random()<.5){var t=A;A=B;B=t;}}
 else{var d3=P([2,3,4,5,6]),d4=P([3,4,5,8]);A=[R(1,d3-1),d3];B=[R(d4+1,2*d4-1),d4];if(Math.random()<.5){var t2=A;A=B;B=t2;}}
 var v=A[0]*B[1]-B[0]*A[1],sym=v<0?0:v===0?1:2;
 return {topic:"fcmp",sub:"c"+c,prompt:"השווי בין השברים:",expr:fr(A[0],A[1])+" ? "+fr(B[0],B[1]),ans:["<","=",">"][sym],
  stages:[{t:"choice",opts:["<","=",">"],ans:sym,ltr:true,q:"בחרי סימן:"},{t:"choice",opts:REASONS,ans:c,q:"איך ידעת?"}],key:"fc"+A+"|"+B};}
// fraction word problems
var FW=[function(){var d=P([2,3,4,5]),n=R(1,d-1),T=d*R(3,8);return ["בכיתה יש "+T+" ילדים. {"+fr(n,d)+"} מהם הלכו לחוג ציור. כמה ילדים הלכו לחוג?",T*n/d];},
 function(){var d=P([2,4,5,10]),n=R(1,d-1),T=d*R(2,10);return ["לאמיליה יש "+T+" ₪. היא הוציאה {"+fr(n,d)+"} מהכסף על ספר. כמה שקלים עלה הספר?",T*n/d];},
 function(){var d=P([3,4,5,6]),n=R(1,d-1),T=d*R(3,7);return ["בטיול יש "+T+" ילדים. {"+fr(n,d)+"} מהם בנות. כמה בנים יש בטיול?",T-T*n/d];},
 function(){var d=P([4,5,6,8,10]),a=R(1,d-2),b=R(1,d-1-a);return ["אמיליה אכלה {"+fr(a,d)+"} מהפיצה, ואחיה אכל {"+fr(b,d)+"} מהפיצה. איזה חלק מהפיצה אכלו יחד?",[a+b,d]];},
 function(){var d=P([4,5,6,8,10]),a=R(2,d-1),b=R(1,a-1);return ["בבקבוק היו {"+fr(a,d)+"} ליטר מיץ. שתו {"+fr(b,d)+"} ליטר. כמה ליטר נשאר?",[a-b,d]];}];
function mkFword(){var t=P(FW)(),f=Array.isArray(t[1]);
 return {topic:"fword",sub:f?"frac":"whole",prompt:t[0],expr:"",ans:f?fr(t[1][0],t[1][1]):t[1],stages:[f?{t:"frac",want:t[1]}:numStage(t[1])],key:"fw"+t[0]};}
function pairOk(p,a,b){return b>0&&a>=0&&a*b+p.n2*p.d1===p.T*p.d1*b;}
// add/sub fractions (worksheet 25.10): same denom, 1−x, missing to 1/2, related denoms, boxes
function lcm(a,b){return a/gcd(a,b)*b;}
function gd(a,b,op){var d=lcm(b[1],a[1]),G=["מוצאים מכנה משותף: "+d+"."],cv=[];[a,b].forEach(function(f){if(f[1]!==d)cv.push(fr(f[0],f[1])+" = "+fr(f[0]*d/f[1],d));});
 G.push(cv.length?"ממירים: "+cv.join(" , "):"המכנים כבר שווים – לא צריך להמיר.");G.push("עכשיו "+(op==="+"?"מחברים":"מחסרים")+" רק את המונים. המכנה נשאר "+d+".");G.push("בודקות: מציבות את התשובה בתרגיל ורואות שזה מסתדר.");return G;}
function mkFops(){var k=P([0,0,1,2,2,3,3,3,4,5,6]),d,a,b,e,x,want,st,sub,pr="כמה יוצא?",G,T;
 if(k===0){d=R(3,12);var add=Math.random()<.55;if(add){a=R(1,d-1);b=R(1,d-a);}else{a=R(2,d);b=R(1,a-1);}
  sub=add?"same+":"same-";e=fr(a,d)+(add?" + ":" − ")+fr(b,d)+" =";want=[add?a+b:a-b,d];G=gd([a,d],[b,d],add?"+":"-");}
 else if(k===1){d=R(3,12);a=R(1,d-1);sub="whole";e="1 − "+fr(a,d)+" =";want=[d-a,d];G=["כותבות את 1 כשבר עם אותו מכנה: 1 = "+fr(d,d)+".","עכשיו מחסרים את המונים. המכנה נשאר "+d+".","בודקות: התשובה ועוד "+fr(a,d)+" צריך לתת 1."];}
 else if(k===2){T=P([1,1,2]);d=R(3,T===2?10:20);a=R(1,d-1);sub="to"+T;pr="מה חסר?";e=fr(a,d)+" + __ = "+T;want=[T*d-a,d];
  G=["כותבות את "+T+" כשבר עם המכנה "+d+": "+T+" = "+fr(T*d,d)+".","כמה חסר במונה מ־"+a+" עד "+T*d+"?","בודקות: "+fr(a,d)+" ועוד התשובה צריך לתת "+T+"."];}
 else if(k===3){var s=R(2,10),m=P([2,2,3,4]),L=s*m;if(L>20)return null;var A=[R(1,s-1),s],B=[R(1,L-1),L];if(Math.random()<.5){var t=A;A=B;B=t;}
  var op=Math.random()<.7?"+":"-";x=A[0]*L/A[1]+(op==="+"?1:-1)*B[0]*L/B[1];if(x<=0)return null;sub="diff"+op;e=fr(A[0],A[1])+(op==="+"?" + ":" − ")+fr(B[0],B[1])+" =";want=[x,L];G=gd(A,B,op);}
 else if(k===4){var s2=R(2,6),m2=P([2,3,4]),L2=s2*m2;if(L2>20)return null;
  if(Math.random()<.6){a=R(1,s2-1);x=L2-a*m2;sub="boxn";pr="איזה מספר חסר בריבוע?";e=fr(a,s2)+" + □/"+L2+" = 1";G=["כדי לחבר צריך מכנה משותף: "+L2+".","ממירים: "+fr(a,s2)+" = "+fr(a*m2,L2)+" , ו־1 = "+fr(L2,L2)+".","כמה חסר במונה עד "+L2+"?"];}
  else{b=R(1,L2-1);x=L2-b;sub="boxm";pr="איזה מספר חסר בריבוע?";e="1 − □/"+L2+" = "+fr(b,L2);G=["כותבות את 1 כשבר: 1 = "+fr(L2,L2)+".","כמה צריך להוריד מ־"+L2+" כדי שיישאר "+b+"?","בודקות: מציבות ובודקות שזה מסתדר."];}
  st={t:"fields",fields:[{lab:"□ =",want:x}]};want=null;}
 else if(k===5){d=R(3,12);a=R(1,d-2);b=R(1,d-a);sub="minuend";pr="מה חסר?";e="__ − "+fr(a,d)+" = "+fr(b,d);want=[a+b,d];G=["חיסור הפוך: מחברים את מה שהורידו לתוצאה.",fr(b,d)+" + "+fr(a,d)+" – המכנה נשאר "+d+", מחברים את המונים.","בודקות: מהתשובה מורידים "+fr(a,d)+" – יוצא "+fr(b,d)+"?"];}
 else{d=R(4,12);b=R(1,d-1);sub="pair";pr="השלימי את שני הריבועים:";e="□/"+d+" + "+b+"/□ = 1";
  st={t:"fields",pair:{d1:d,n2:b,T:1},fields:[{lab:"□/"+d+" ←",want:d-b},{lab:b+"/□ ←",want:d}]};want=null;
  G=["רמז: נסי לבחור לשבר השני את אותו מכנה – "+d+".","1 = "+fr(d,d)+". כמה חסר ל־"+b+" כדי להגיע ל־"+d+"?","בודקות: מחברים את שני השברים – יוצא 1?"];}
 if(!st)st={t:"frac",want:want,whole:true};
 if(!G)G=gd([1,2],[1,2],"+");
 return {topic:"fops",sub:sub,prompt:pr,expr:e,ans:want?fr(want[0],want[1]):st.fields.map(function(f){return f.want;}).join(","),stages:[st],guide:G,key:"fo"+e};}
// geometry: parallel / adjacent sides
var SHAPES=[["מלבן",[[60,40],[300,40],[300,170],[60,170]]],["מקבילית",[[100,40],[320,40],[260,170],[40,170]]],["טרפז",[[110,40],[250,40],[320,170],[40,170]]],
 ["טרפז ישר־זווית",[[60,40],[220,40],[320,170],[60,170]]],["מרובע",[[90,30],[290,70],[320,170],[50,150]]],["משושה",[[120,30],[240,30],[300,105],[240,180],[120,180],[60,105]]]];
var HL=["א","ב","ג","ד","ה","ו"];
function mkGeo(){var sh=P(SHAPES),pts=sh[1],k=pts.length,names=[],i;for(i=0;i<k;i++)names.push(HL[i]+HL[(i+1)%k]);
 var s=R(0,k-1),mode=Math.random()<.5?"par":"adj",ans=[];
 var vec=function(j){return [pts[(j+1)%k][0]-pts[j][0],pts[(j+1)%k][1]-pts[j][1]];};
 for(i=0;i<k;i++){if(i===s)continue;if(mode==="adj"){if(i===(s+1)%k||i===(s+k-1)%k)ans.push(i);}else{var a=vec(s),b=vec(i);if(Math.abs(a[0]*b[1]-a[1]*b[0])<1e-6)ans.push(i);}}
 var opts=[],map=[];for(i=0;i<k;i++)if(i!==s){opts.push(names[i]);map.push(i);}
 if(mode==="par")opts.push("אין צלע מקבילה");
 var ansIdx=ans.map(function(x){return map.indexOf(x);});if(mode==="par"&&!ans.length)ansIdx=[opts.length-1];
 return {topic:"geo",sub:mode,prompt:(mode==="par"?"סמני את כל הצלעות המקבילות לצלע ":"סמני את כל הצלעות הסמוכות לצלע ")+names[s]+" ("+sh[0]+")",geo:{pts:pts,labels:HL.slice(0,k),hl:s},ans:ansIdx.map(function(x){return opts[x];}).join(", "),
  stages:[{t:"multi",opts:opts,ans:ansIdx}],key:"g"+sh[0]+mode+s};}
// diagrams
var CATS=[["תפוח","בננה","תות","ענבים","אגס"],["כלב","חתול","ארנב","דג","תוכי"],["כדורגל","שחייה","ריקוד","ציור","שחמט"]];
var TITLES=["פירות שהילדים אוהבים","חיות מחמד בכיתה","חוגים של הילדים"];
function mkChart(){var ci=R(0,2),cats=CATS[ci].slice().sort(function(){return Math.random()-.5;}).slice(0,4),kind=Math.random()<.5?"bar":"pict",step=kind==="bar"?P([1,2,5,10]):P([2,5,10]),vals;
 vals=cats.map(function(){return step*R(1,kind==="bar"?9:6);});var mx=Math.max.apply(0,vals),mn=Math.min.apply(0,vals);
 if(vals.filter(function(v){return v===mx;}).length>1||vals.filter(function(v){return v===mn;}).length>1)return null;
 var q=R(0,4),i=R(0,3),j=(i+R(1,3))%4,st,txt;
 if(q===0){txt="כמה ילדים בחרו "+cats[i]+"?";st=numStage(vals[i]);}
 else if(q===1){txt="מה בחרו הכי הרבה ילדים?";st={t:"choice",opts:cats,ans:vals.indexOf(mx)};}
 else if(q===2){txt="מה בחרו הכי מעט ילדים?";st={t:"choice",opts:cats,ans:vals.indexOf(mn)};}
 else if(q===3){var hi=vals[i]>=vals[j]?i:j,lo=hi===i?j:i;if(vals[hi]===vals[lo])return null;txt="בכמה ילדים יותר בחרו "+cats[hi]+" מאשר "+cats[lo]+"?";st=numStage(vals[hi]-vals[lo]);}
 else{txt="כמה ילדים בחרו בסך הכול?";st=numStage(vals.reduce(function(a,b){return a+b;},0));}
 var ans=st.t==="choice"?cats[st.ans]:st.fields[0].want;
 return {topic:"chart",sub:kind+q,prompt:txt,chart:{kind:kind,cats:cats,vals:vals,step:step,title:TITLES[ci]},ans:ans,stages:[st],key:"ch"+kind+cats+vals+q+i+j};}
var MK={mul:mkMul,fpic:mkFpic,fnl:mkFnl,fcmp:mkFcmp,fword:mkFword,fops:mkFops,geo:mkGeo,chart:mkChart,nl:mkNL,word:mkWord,seder:mkSeder,col:mkCol,miss:mkMiss};
function make(topic,seen){for(var g=0;g<300;g++){var it=MK[topic]();if(it&&!seen[it.key]){seen[it.key]=1;it.hints=HINTS[topic];if(!it.stages)it.stages=[topic==="nl"&&it.sub==="place"?{t:"tick",ans:it.ans}:numStage(it.ans)];return it;}}return null;}
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
 TOPICS.map(function(t){return [t,(w[t]||1)*(0.5+Math.random())];}).sort(function(a,b){return b[1]-a[1];}).map(function(x){return x[0];}).forEach(function(t){if(o.test||!out.some(function(q){return q.topic===t;})){if(out.length+rest.length<(o.test?n:n-3)){var it=make(t,seen);if(it)rest.push(it);}}});
 while(out.length+rest.length<n&&tries++<500){var t=pickW(w);var it2=make(t,seen);if(it2)rest.push(it2);}
 for(i=rest.length-1;i>0;i--){var r0=Math.floor(Math.random()*(i+1));var t0=rest[i];rest[i]=rest[r0];rest[r0]=t0;}
 // interleave: avoid same topic twice in a row
 for(i=1;i<rest.length;i++){if(rest[i].topic===rest[i-1].topic){for(var j=i+1;j<rest.length;j++)if(rest[j].topic!==rest[i-1].topic){var tmp=rest[i];rest[i]=rest[j];rest[j]=tmp;break;}}}
 if(o.test){for(i=rest.length-1;i>0;i--){var r=Math.floor(Math.random()*(i+1));var t2=rest[i];rest[i]=rest[r];rest[r]=t2;}}
 return out.concat(rest).slice(0,n);}
var api={pairOk:pairOk,words:words,REASONS:REASONS,gcd:gcd,session:session,make:make,TOPICS:TOPICS,LABELS:LABELS,HINTS:HINTS,fmt:fmt,S:S,weights:weights};
if(typeof module!=="undefined")module.exports=api;else root.Mivhan=api;
})(this);
