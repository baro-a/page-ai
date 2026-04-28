#!/usr/bin/env python3
"""Refactor monolithic index.html into modular src/ structure."""
import re, os, shutil, json

BASE = r'C:\Users\na\Desktop\작업폴더\Project\02_page_essay'
SRC = os.path.join(BASE, 'src')

# Read original
with open(os.path.join(BASE, 'index.html'), 'r', encoding='utf-8') as f:
    html = f.read()

# Backup original
shutil.copy2(os.path.join(BASE, 'index.html'), os.path.join(BASE, 'index_backup.html'))
print('[OK] Backed up index.html -> index_backup.html')

# Create directories
for d in ['css', 'js', 'assets/characters', 'icons']:
    os.makedirs(os.path.join(SRC, d), exist_ok=True)

# Copy static assets
for src_file in ['manifest.json', 'package.json']:
    sp = os.path.join(BASE, src_file)
    if os.path.exists(sp):
        shutil.copy2(sp, os.path.join(SRC, src_file))

for subdir in ['assets/characters', 'icons']:
    src_dir = os.path.join(BASE, subdir)
    dst_dir = os.path.join(SRC, subdir)
    if os.path.isdir(src_dir):
        for f in os.listdir(src_dir):
            shutil.copy2(os.path.join(src_dir, f), os.path.join(dst_dir, f))

print('[OK] Copied assets to src/')

# ========== EXTRACT CSS ==========
# Find all <style> blocks
style_blocks = re.findall(r'<style>(.*?)</style>', html, re.DOTALL)
all_css = '\n'.join(style_blocks)

# Define CSS section markers and their target files
css_sections = {
    'variables': [
        r'/\* ===== LANGUAGE SELECTOR =====\*/',
        r':root\{',
    ],
    'lang': [r'/\* ===== LANGUAGE SELECTOR =====\*/'],
    'base': [r'\*\{margin:0;padding:0'],
    'nav': [r'/\* ===== NAV =====\*/'],
    'portal': [r'/\* ===== BOOK PORTAL TRANSITION =====\*/'],
    'landing': [r'/\* ===== LANDING =====\*/', r'/\* ===== HERO BACKGROUND IMAGE =====\*/', r'/\* ===== FLYING BOOKS =====\*/'],
    'bookshelf': [],
    'write': [r'/\* ===== CREATE =====\*/'],
    'persona': [],
    'admin': [],
    'pricing': [],
    'share': [],
    'components': [r'/\* ===== GEMMA API KEY MODAL =====\*/', r'/\* ===== PWA / MOBILE APP OPTIMIZATIONS =====\*/', r'/\* ===== PWA INSTALL PROMPT =====\*/', r'/\* ===== ADSENSE AD SLOTS =====\*/', r'/\* ===== OVERSCROLL / PULL BEHAVIOR =====\*/'],
    'darkmode': [r'/\* ===== DARK MODE VARS =====\*/', r'\[data-theme="dark"\]'],
    'webtoon': [r'/\* ===== WEBTOON LAYOUT =====\*/'],
}

# Simpler approach: split by section markers
css_lines = all_css.split('\n')
css_files = {}
current_section = 'base'
section_map = {}

# Map comment markers to sections
marker_to_section = {
    'LANGUAGE SELECTOR': 'lang',
    'DARK MODE VARS': 'darkmode',
    'NAV': 'nav',
    'BOOK PORTAL TRANSITION': 'portal',
    'LANDING': 'landing',
    'HERO BACKGROUND IMAGE': 'landing',
    'FLYING BOOKS': 'landing',
    'APP': 'bookshelf',
    'CREATE': 'write',
    'GEMMA API KEY MODAL': 'components',
    'PWA / MOBILE': 'components',
    'PWA INSTALL PROMPT': 'components',
    'ADSENSE': 'components',
    'OVERSCROLL': 'components',
    'WEBTOON LAYOUT': 'webtoon',
}

for line in css_lines:
    # Check for section marker
    m = re.match(r'\s*/\* ===== (.+?) =====\*/', line)
    if m:
        marker = m.group(1)
        if marker in marker_to_section:
            current_section = marker_to_section[marker]
    if current_section not in css_files:
        css_files[current_section] = []
    css_files[current_section].append(line)

# Write CSS files
css_order = ['variables', 'lang', 'base', 'darkmode', 'nav', 'portal', 'landing', 'bookshelf', 'write', 'persona', 'admin', 'pricing', 'share', 'components', 'webtoon']

# Extract variables from :root and [data-theme="dark"]
variables_css = []
# Pull :root block from base
base_lines = css_files.get('base', [])
root_started = False
root_brace = 0
new_base = []
for line in base_lines:
    if ':root{' in line or ':root {' in line:
        root_started = True
        variables_css.append(line)
        root_brace += line.count('{') - line.count('}')
        continue
    if root_started:
        variables_css.append(line)
        root_brace += line.count('{') - line.count('}')
        if root_brace <= 0:
            root_started = False
        continue
    new_base.append(line)
css_files['base'] = new_base

# Also move darkmode vars from darkmode section to variables
dm_lines = css_files.get('darkmode', [])
dm_var_started = False
dm_brace = 0
dm_vars = []
dm_rest = []
for line in dm_lines:
    if '[data-theme="dark"]{' in line:
        dm_var_started = True
        dm_vars.append(line)
        dm_brace += line.count('{') - line.count('}')
        continue
    if dm_var_started:
        dm_vars.append(line)
        dm_brace += line.count('{') - line.count('}')
        if dm_brace <= 0:
            dm_var_started = False
        continue
    dm_rest.append(line)
css_files['darkmode'] = dm_rest
variables_css.extend(dm_vars)

with open(os.path.join(SRC, 'css', 'variables.css'), 'w', encoding='utf-8') as f:
    f.write('\n'.join(variables_css))
print('[OK] src/css/variables.css')

for section in css_order:
    if section == 'variables':
        continue
    lines = css_files.get(section, [])
    content = '\n'.join(lines).strip()
    if not content:
        content = f'/* {section.upper()} styles - extracted from index.html */\n'
    with open(os.path.join(SRC, 'css', f'{section}.css'), 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'[OK] src/css/{section}.css ({len(lines)} lines)')

# ========== EXTRACT HTML ==========
# Get the <body> content (between <body> and </body> or the main content)
body_match = re.search(r'<body[^>]*>(.*)</body>', html, re.DOTALL)
if not body_match:
    # Try between first visible content and </html>
    body_match = re.search(r'(<div id="portal-overlay".*)</html>', html, re.DOTALL)

body_content = body_match.group(1) if body_match else html

# Extract <head> meta/tags
head_match = re.search(r'<head>(.*?)</head>', html, re.DOTALL)
head_content = head_match.group(1) if head_match else ''

# Build new index.html
# Remove inline <style> blocks from head, replace with <link>
new_head = re.sub(r'<style>.*?</style>', '', head_content, flags=re.DOTALL)
# Remove old <link> to fonts - keep them
# Add CSS links
css_links = '\n'.join([f'<link rel="stylesheet" href="css/{s}.css">' for s in css_order])

# ========== EXTRACT JS ==========
# Find all <script> blocks (not external)
script_blocks = re.findall(r'<script>(.*?)</script>', html, re.DOTALL)
all_js = '\n'.join(script_blocks)

# Split JS by section markers
js_lines = all_js.split('\n')
js_files = {}
current_js = 'app'

js_marker_to_section = {
    'STATE': 'app',
    'ROUTING': 'router',
    'BOOKSHELF RENDER': 'bookshelf',
    'UPLOAD / FILE': 'upload',
    'CAMERA': 'upload',
    'AI / GEMMA': 'api',
    'ESSAY GENERATION': 'essay',
    'ESSAY SAVE/LOAD': 'essay',
    'DARK MODE': 'darkmode',
    'LANGUAGE / i18n': 'lang',
    'PERSONA': 'persona',
    'SHARE': 'share',
    'AUDIO / RECORDING': 'audio',
    'ADMIN ANALYTICS': 'admin',
    'PWA': 'pwa',
    'GEMMA 4 API KEY': 'api',
    'SERVICE WORKER': 'pwa',
    'MOBILE BOTTOM NAV': 'pwa',
    'ADSENSE': 'app',
    'WEBTOON': 'essay',
}

for line in js_lines:
    m = re.match(r'\s*// =====\s+(.+?)\s+=====', line)
    if m:
        marker = m.group(1).upper()
        for key, section in js_marker_to_section.items():
            if key.upper() in marker:
                current_js = section
                break
    if current_js not in js_files:
        js_files[current_js] = []
    js_files[current_js].append(line)

# Write JS files
js_order = ['app', 'router', 'api', 'upload', 'essay', 'bookshelf', 'persona', 'share', 'audio', 'darkmode', 'lang', 'admin', 'pwa', 'utils']

for section in js_order:
    lines = js_files.get(section, [])
    content = '\n'.join(lines).strip()
    if not content:
        content = f'// {section.upper()} module - extracted from index.html\n'
    with open(os.path.join(SRC, 'js', f'{section}.js'), 'w', encoding='utf-8') as f:
        f.write(content)
    print(f'[OK] src/js/{section}.js ({len(lines)} lines)')

# Add utils.js with common helpers
utils_content = """// UTILS - Common helper functions

function showToast(msg, duration=2500) {
  const t = document.getElementById('toast');
  if(!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), duration);
}

function $(id) { return document.getElementById(id); }
function $$(sel) { return document.querySelector(sel); }
function $$(sel) { return document.querySelectorAll(sel); }

function formatDate(d) {
  const date = new Date(d);
  return date.toLocaleDateString('ko-KR');
}
"""
with open(os.path.join(SRC, 'js', 'utils.js'), 'w', encoding='utf-8') as f:
    f.write(utils_content)
print('[OK] src/js/utils.js')

# Build new index.html
js_links = '\n'.join([f'<script src="js/{s}.js"></script>' for s in js_order])

# Get HTML body (without inline scripts)
body_no_scripts = re.sub(r'<script>.*?</script>', '', body_content, flags=re.DOTALL)

new_html = f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover, user-scalable=no">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="Page">
<meta name="application-name" content="Page">
<meta name="theme-color" content="#0A0400">
<title>Page — 당신의 인생 도서관</title>
<meta name="description" content="사진 한 장으로 AI가 당신만의 감성 에세이를 써드립니다.">

<!-- PWA Manifest -->
<link rel="manifest" href="manifest.json">

<!-- Apple Touch Icons -->
<link rel="apple-touch-icon" href="icons/icon-192.png">

<!-- Favicon -->
<link rel="icon" type="image/png" sizes="192x192" href="icons/icon-192.png">

<!-- OG / Social -->
<meta property="og:title" content="Page — 당신의 인생 도서관">
<meta property="og:description" content="사진 한 장으로 AI가 당신만의 감성 에세이를 써드립니다">
<meta property="og:type" content="website">
<meta property="og:image" content="icons/icon-512.png">
<meta name="twitter:card" content="summary_large_image">

<!-- Fonts -->
<link href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@300;400;500;600;700;800&family=Noto+Sans+JP:wght@300;400;500;600;700&family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap" rel="stylesheet">

<!-- CSS Modules -->
{css_links}
</head>
<body>
{body_no_scripts}
<!-- JS Modules -->
{js_links}
</body>
</html>"""

with open(os.path.join(SRC, 'index.html'), 'w', encoding='utf-8') as f:
    f.write(new_html)
print("✅ src/index.html (loader)")

# Update package.json start script
pkg_path = os.path.join(SRC, 'package.json')
if os.path.exists(pkg_path):
    with open(pkg_path, 'r', encoding='utf-8') as f:
        pkg = json.load(f)
    pkg['scripts']['start'] = 'live-server .'
    with open(pkg_path, 'w', encoding='utf-8') as f:
        json.dump(pkg, f, indent=2, ensure_ascii=False)
    print('[OK] Updated package.json')

print('[DONE] Refactoring complete!')
print(f'   Original: index.html -> index_backup.html')
print(f'   New structure: src/ with {len(css_order)} CSS + {len(js_order)} JS modules')