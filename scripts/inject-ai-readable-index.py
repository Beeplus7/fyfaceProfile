#!/usr/bin/env python3
"""Ensure marketing index.html head has OG + AI discovery links (no visible body text)."""
from pathlib import Path
import sys

index = Path(sys.argv[1] if len(sys.argv) > 1 else "apps/marketing/dist/index.html")
html = index.read_text()

DESC = (
    "MyFace Profile is the Work Social OS where pros SHOW their work, "
    "CONNECT with customers, and GROW with gifts, bookings and trust."
)

if 'href="/llms.txt"' not in html and "href='/llms.txt'" not in html:
    head_bits = (
        f'    <meta name="description" content="{DESC}" />\n'
        '    <meta name="robots" content="index,follow,max-image-preview:large" />\n'
        '    <meta property="og:locale" content="en_GB" />\n'
        '    <meta property="og:type" content="website" />\n'
        '    <meta property="og:site_name" content="MyFace Profile" />\n'
        '    <meta property="og:title" content="MyFace Profile — Your Work Is Your Face. Not Your CV." />\n'
        f'    <meta property="og:description" content="{DESC}" />\n'
        '    <meta property="og:url" content="https://myfaceprofile.aikova.co.uk/" />\n'
        '    <meta property="og:image" content="https://myfaceprofile.aikova.co.uk/myface-og.jpg" />\n'
        '    <meta name="twitter:card" content="summary_large_image" />\n'
        '    <meta name="twitter:title" content="MyFace Profile — Your Work Is Your Face. Not Your CV." />\n'
        f'    <meta name="twitter:description" content="{DESC}" />\n'
        '    <meta name="twitter:image" content="https://myfaceprofile.aikova.co.uk/myface-og.jpg" />\n'
        '    <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />\n'
        '    <link rel="alternate" href="/myface-ai-readable.html" title="AI-readable HTML" />\n'
    )
    if "<title>MyFace — Marketing</title>" in html:
        html = html.replace(
            "<title>MyFace — Marketing</title>",
            "<title>MyFace Profile — Your Work Is Your Face. Not Your CV.</title>\n" + head_bits,
            1,
        )
    elif "</head>" in html:
        html = html.replace("</head>", head_bits + "</head>", 1)

index.write_text(html)
print("injected AI/OG head tags into", index)
