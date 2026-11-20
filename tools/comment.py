# Adds one comment to the Comments book and prints its code, to put on the code's line as  // E123
#   python3 tools/comment.py "what the line does and why"
import json, pathlib, re, sys
p = pathlib.Path(__file__).resolve().parent.parent / 'books' / 'comments.js'
s = p.read_text(encoding='utf-8')
code = 'E%d' % (max(int(n) for n in re.findall(r'"E(\d+)": \{', s)) + 1)
i = s.rstrip().rfind('}\n});')
p.write_text(s[:i + 1] + ',\n ' + json.dumps(code) + ': ' + json.dumps({'text': sys.argv[1]}, ensure_ascii=False) + '\n});\n', encoding='utf-8')
print(code)
