import sys

log_path = 'C:/Users/abish/.gemini/antigravity/brain/9f8dca03-6f10-4839-9993-8a1e1b49967a/.system_generated/logs/overview.txt'

with open(log_path, 'r', encoding='utf-8', errors='ignore') as f:
    content = f.read()

start_str = 'import { useState, useEffect, useRef } from "react";'

start_idx = content.rfind(start_str)
if start_idx != -1:
    end_idx = content.find('page 1 design html code', start_idx)
    if end_idx != -1:
        react_code = content[start_idx:end_idx].strip()
        with open('d:/refoxresume/src/App.jsx', 'w', encoding='utf-8') as f:
            f.write(react_code)
        print('Successfully extracted React code to App.jsx')
    else:
        print('Could not find the end marker')
else:
    print('Could not find the start marker')
