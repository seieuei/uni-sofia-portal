#!/usr/bin/env python3
import sys, base64, os
if len(sys.argv) < 2:
    sys.exit("usage: save_b64.py DEST [B64_FILE|-]")
dest = sys.argv[1]
src = sys.argv[2] if len(sys.argv) > 2 else "-"
data = sys.stdin.read() if src == "-" else open(src, encoding="utf-8").read()
data = "".join(data.split())
os.makedirs(os.path.dirname(dest) or ".", exist_ok=True)
open(dest, "wb").write(base64.b64decode(data))
print("wrote", dest, os.path.getsize(dest))
