#!/usr/bin/env python3
"""Parse '#SEDER v1 {...}' lines from pasted WhatsApp text into the localStorage-format JSON
({hist:[...], last:[]}) that build_worksheet.py --input reads.
Usage: python3 import_whatsapp.py pasted.txt [-o out.json] [--merge existing.json]   (reads stdin if no file)"""
import sys, json, re, argparse
OUT = {"f": "correct_first", "r": "correct_after_retries", "h": "needs_help"}
def pretty(e):
    e = re.sub(r"\d+", lambda m: f"{int(m.group()):,}", e)
    e = e.replace("=", " = ")
    e = re.sub(r"\s*([-+*/])\s*", lambda m: " " + {"*": "×", "/": ":", "-": "−", "+": "+"}[m.group(1)] + " ", e)
    e = e.replace("( ", "(").replace(" )", ")").strip()
    return re.sub(r"\s+", " ", e) if "=" in e else e + " ="
def parse(text):
    hist = []
    for m in re.finditer(r"#SEDER v1 (\{.*\})", text):
        try: d = json.loads(m.group(1))
        except Exception: continue
        rec = {"id": "wa-" + d["d"], "date": d["d"], "n": d.get("n", 20), "source": "whatsapp"}
        if "i" in d:
            rec["items"] = [{"type": t, "expr": pretty(e), "entries": a, "tries": tr, "total_ms": ms,
                             "ms_to_correct": ms if o != "h" else None, "outcome": OUT.get(o, o)} for t, e, a, tr, ms, o in d["i"]]
        else:  # compact per-type summary: {type:[n,ok,tries,ms,help]} -> synthetic items
            items = []
            for t, (n, ok, tries, ms, hlp) in d["t"].items():
                extra = max(0, tries - n)
                for k in range(n):
                    o = "needs_help" if k < hlp else ("correct_after_retries" if k < hlp + min(extra, n - hlp) else "correct_first")
                    items.append({"type": int(t), "expr": "", "entries": [], "tries": 3 if o == "needs_help" else (2 if o != "correct_first" else 1),
                                  "total_ms": ms // max(n, 1), "ms_to_correct": None, "outcome": o, "synthetic": True})
            rec["items"] = items
        rec["ok"] = sum(i["outcome"] != "needs_help" for i in rec["items"])
        rec["first"] = sum(i["outcome"] == "correct_first" for i in rec["items"])
        hist.append(rec)
    return hist
if __name__ == "__main__":
    ap = argparse.ArgumentParser(); ap.add_argument("file", nargs="?"); ap.add_argument("-o"); ap.add_argument("--merge")
    a = ap.parse_args()
    text = open(a.file, encoding="utf-8").read() if a.file else sys.stdin.read()
    base = json.load(open(a.merge)) if a.merge else {"hist": [], "last": []}
    seen = {r.get("date") for r in base.get("hist", [])}
    new = [r for r in parse(text) if r["date"] not in seen]
    base["hist"] = sorted(base.get("hist", []) + new, key=lambda r: r["date"], reverse=True)
    out = json.dumps(base, ensure_ascii=False, indent=1)
    if a.o: open(a.o, "w", encoding="utf-8").write(out); print(f"{len(new)} sessions -> {a.o}")
    else: print(out)
