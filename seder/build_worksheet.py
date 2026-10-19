#!/usr/bin/env python3
"""Nightly: build tomorrow's personalized order-of-operations worksheet for Amelia.
Usage: python3 build_worksheet.py [--date YYYY-MM-DD] [--input data.json] [--out-dir DIR]
Reads row 'emilia-seder' from Supabase kefel_state (or --input JSON with the same {hist:[...]} shape).
No practice that day -> prints NO_PRACTICE, exit 0, no file."""
import argparse, json, os, subprocess, sys, html, urllib.request
from datetime import datetime, timedelta
from zoneinfo import ZoneInfo
TZ = ZoneInfo("Asia/Jerusalem")
HERE = os.path.dirname(os.path.abspath(__file__))
CFG = "/workspace/hisur/supabase-config.json"

def fetch_cloud():
    c = json.load(open(CFG))
    req = urllib.request.Request(c["url"] + "/rest/v1/kefel_state?id=eq.emilia-seder&select=data",
        headers={"apikey": c["anonKey"], "Authorization": "Bearer " + c["anonKey"]})
    rows = json.load(urllib.request.urlopen(req, timeout=20))
    d = rows[0]["data"] if rows else {}
    return json.loads(d) if isinstance(d, str) else (d or {})

def day_of(iso):
    return datetime.fromisoformat(iso.replace("Z", "+00:00")).astimezone(TZ).date().isoformat()

def gen(stats):
    js = ("const S=require(%s);const st=JSON.parse(process.argv[1]);const s=S.session([],st);"
          "console.log(JSON.stringify({items:s.map(x=>({type:x.type,display:x.display,ans:x.ans,correct:x.correct,wrong:x.wrong||null,"
          "steps:x.steps.map(y=>S.show(y.expr))})),labels:S.LABELS}))") % json.dumps(os.path.join(HERE, "engine.js"))
    return json.loads(subprocess.check_output(["node", "-e", js, json.dumps(stats)]))

def fmt(n): return f"{n:,}"

def X(e):  # expression: forced LTR, one isolated span per token, blank as a box
    e = str(e).replace("(", "( ").replace(")", " )").replace("__", " __ ")
    t = "".join('<span class="box"></span>' if w == "__" else f'<span class="tk">{html.escape(w)}</span>' for w in e.split())
    return f'<span class="m" dir="ltr">{t}</span>'

CSS = """
@page { size: A4; margin: 14mm; }
* { box-sizing: border-box; }
body { font-family:'Heebo','Noto Sans Hebrew','Alef',sans-serif; direction:rtl; text-align:right; font-size:13.5pt; color:#222; margin:0; }
.m { font-family:'Heebo','DejaVu Sans',sans-serif; font-variant-numeric:lining-nums tabular-nums; direction:ltr; unicode-bidi:isolate;
     display:inline-flex; flex-direction:row; gap:.3em; align-items:center; font-size:15pt; white-space:nowrap; }
.tk { unicode-bidi:isolate; direction:ltr; }
h1 { text-align:center; font-size:22pt; margin:0 0 2mm; color:#1d4e89; }
.sub { text-align:center; margin:0 0 3mm; font-size:12pt; }
.name { display:flex; gap:12mm; justify-content:center; margin-bottom:3mm; font-size:12pt; }
.name span { border-bottom:1px solid #555; display:inline-block; min-width:45mm; }
.rules { border:2px solid #1d4e89; background:#eef4fb; border-radius:4mm; padding:2.5mm 5mm; margin-bottom:3mm; font-size:12pt; }
.rules ol { margin:1mm 0; padding-right:6mm; }
.focus { background:#fff8e1; border:1.5px dashed #d0a000; border-radius:3mm; padding:2mm 4mm; margin-bottom:3mm; font-size:12pt; }
h2 { font-size:14pt; margin:4mm 0 2mm; color:#fff; padding:1.2mm 4mm; border-radius:3mm; break-after:avoid; background:#2a6fb0; }
.grid { display:grid; grid-template-columns:1fr 1fr; gap:4mm 8mm; } .c1 { grid-template-columns:1fr; }
.it { break-inside:avoid; padding:1mm 0; display:flex; align-items:center; gap:2mm; flex-wrap:wrap; }
.n { display:inline-block; width:7mm; height:7mm; line-height:7mm; border:1.5px solid #333; border-radius:50%; text-align:center; font-size:10.5pt; }
.ans { display:inline-block; width:28mm; border-bottom:1.5px solid #333; height:1em; }
.box { display:inline-block; width:12mm; height:8mm; border:1.5px solid #333; border-radius:1.5mm; }
.steps { width:100%; margin:1mm 9mm 0 0; font-size:12pt; } .steps div { margin:1mm 0; }
.pb { break-before:page; }
.key table { width:100%; border-collapse:collapse; font-size:12pt; } .key td,.key th { border:1px solid #aaa; padding:1.3mm 2.5mm; } .key th { background:#eee; }
.key .m { font-size:12.5pt; }
.foot { text-align:center; margin-top:5mm; font-size:14pt; }
"""
COLORS = {1:"#3a8f5c",8:"#16808a",5:"#d07a12",2:"#2a6fb0",3:"#7a4cb0",4:"#8a5a16",6:"#c0392b",9:"#5b3a99",7:"#b03a6f"}

def build(items, labels, weak, tomorrow):
    H = [f'<!doctype html><html lang="he" dir="rtl"><head><meta charset="utf-8"><style>{CSS}</style></head><body>']
    H.append('<h1>סדר פעולות חשבון – דף אישי לאמיליה 🧮</h1>')
    H.append(f'<div class="sub">דף ל־{tomorrow.strftime("%d.%m.%Y")}</div>')
    H.append('<div class="name"><div>שם: <span></span></div><div>שעה: <span></span></div></div>')
    H.append('<div class="rules"><b>הכללים:</b><ol><li>קודם מה שבתוך <b>הסוגריים</b> (מהפנימיים החוצה).</li>'
             '<li>אחר כך <b>כפל ×</b> ו<b>חילוק :</b></li><li>בסוף <b>חיבור +</b> ו<b>חיסור −</b></li>'
             '<li>פעולות מאותה דרגה – <b>משמאל לימין</b>.</li></ol></div>')
    if weak:
        H.append('<div class="focus">🎯 היום נתרגל במיוחד: ' + "، ".join(labels[str(t)] for t in weak).replace("،", ",") + '</div>')
    n = 0; cur = None
    for it in items:
        t = it["type"]
        if t != cur:
            if cur is not None: H.append('</div>')
            hint = {6: " – כתבי בריבוע את המספר החסר", 7: " – הקיפי את השלב שבו יש טעות"}.get(t, "")
            H.append(f'<h2 style="background:{COLORS.get(t,"#2a6fb0")}">{labels[str(t)]}{hint}</h2>')
            H.append(f'<div class="grid{" c1" if t in (7,9,4) else ""}">'); cur = t
        n += 1
        if t == 6:
            body = X(it["display"])
        elif t == 7:
            body = X(it["display"]) + '<div class="steps">' + "".join(
                f'<div>שלב {i}: {X("= " + s)}</div>' for i, s in enumerate(it["wrong"], 1)) + '</div>'
        else:
            body = X(it["display"]) + '<span class="ans"></span>'
        H.append(f'<div class="it"><span class="n">{n}</span>{body}</div>')
    H.append('</div><div class="foot">כל הכבוד, אמיליה! 🌟</div>')
    # answer key
    rows = []
    for i, it in enumerate(items, 1):
        t = it["type"]
        if t == 7: a = f'טעות בשלב {it["ans"]}; נכון: {X(fmt(it["correct"]))}'
        elif t == 6: a = f'חסר: {X(fmt(it["ans"]))}'
        else: a = X(fmt(it["ans"]))
        steps = "<br>".join(X("= " + s) for s in it["steps"])
        rows.append(f'<tr><td>{i}</td><td>{X(it["display"])}</td><td>{steps}</td><td>{a}</td></tr>')
    H.append('<div class="pb key"><h1>דף תשובות (להורים)</h1><table><tr><th>#</th><th>תרגיל</th><th>שלבים</th><th>תשובה</th></tr>'
             + "".join(rows) + '</table></div></body></html>')
    return "\n".join(H)

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--date"); ap.add_argument("--input"); ap.add_argument("--out-dir", default="/workspace/emilia/worksheets")
    a = ap.parse_args()
    day = a.date or datetime.now(TZ).date().isoformat()
    try:
        data = json.load(open(a.input)) if a.input else fetch_cloud()
    except Exception as e:
        print(f"ERROR reading practice data: {e}", file=sys.stderr); sys.exit(2)
    sessions = [s for s in data.get("hist", []) if s.get("date") and day_of(s["date"]) == day and s.get("items")]
    if not sessions:
        print("NO_PRACTICE"); return
    stats = {}
    for s in sessions:
        for it in s["items"]:
            o = stats.setdefault(str(it["type"]), {"n":0,"tries":0,"ms":0,"help":0,"first":0})
            o["n"] += 1; o["tries"] += it.get("tries", 1); o["ms"] += it.get("total_ms", 0)
            o["help"] += it.get("outcome") == "needs_help"; o["first"] += it.get("outcome") == "correct_first"
    weak = sorted([k for k, o in stats.items() if o["help"] or o["tries"] / o["n"] > 1.3],
                  key=lambda k: -(stats[k]["help"] / stats[k]["n"] * 3 + stats[k]["tries"] / stats[k]["n"]))[:3]
    g = gen(stats)
    tomorrow = datetime.fromisoformat(day).date() + timedelta(days=1)
    os.makedirs(a.out_dir, exist_ok=True)
    out = os.path.join(a.out_dir, f"seder_{tomorrow.isoformat()}.pdf")
    doc = build(g["items"], g["labels"], [int(w) for w in weak], tomorrow)
    from playwright.sync_api import sync_playwright
    with sync_playwright() as p:
        b = p.chromium.launch(); pg = b.new_page(); pg.set_content(doc, wait_until="networkidle")
        pg.pdf(path=out, format="A4", print_background=True, prefer_css_page_size=True); b.close()
    print(out)

if __name__ == "__main__":
    main()
