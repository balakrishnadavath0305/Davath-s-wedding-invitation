"""
Converts the 4 wedding illustration images to truly transparent PNGs.
Works regardless of whether background is white or dark — detects automatically.
"""
from PIL import Image
import numpy as np
import os

images = [
    "images/ganesha.png",
    "images/deity.png",
    "images/wedding-ritual.png",
    "images/baraat.png",
]

for img_path in images:
    if not os.path.exists(img_path):
        print(f"SKIP (not found): {img_path}")
        continue

    img = Image.open(img_path).convert("RGBA")
    data = np.array(img, dtype=np.float32)

    r, g, b, a = data[:,:,0], data[:,:,1], data[:,:,2], data[:,:,3]

    # Sample the corners to detect background color
    h, w = r.shape
    corners = [
        (r[0,0], g[0,0], b[0,0]),
        (r[0,w-1], g[0,w-1], b[0,w-1]),
        (r[h-1,0], g[h-1,0], b[h-1,0]),
        (r[h-1,w-1], g[h-1,w-1], b[h-1,w-1]),
    ]
    avg_brightness = sum((cr+cg+cb)/3 for cr,cg,cb in corners) / len(corners)
    print(f"{img_path}: corner brightness = {avg_brightness:.1f}")

    if avg_brightness > 128:
        # WHITE background — make light pixels transparent
        print(f"  -> Removing WHITE background")
        brightness = (r + g + b) / 3
        # Alpha = how dark the pixel is (dark lines stay opaque, white bg becomes transparent)
        new_alpha = np.clip(255 - brightness, 0, 255).astype(np.uint8)
        # Color: tint lines gold/warm (maroon-gold palette)
        out = np.zeros((h, w, 4), dtype=np.uint8)
        out[:,:,0] = np.clip(r * 0.7, 0, 255).astype(np.uint8)   # keep red
        out[:,:,1] = np.clip(g * 0.5, 0, 255).astype(np.uint8)   # reduce green
        out[:,:,2] = np.clip(b * 0.1, 0, 255).astype(np.uint8)   # reduce blue
        out[:,:,3] = new_alpha
    else:
        # DARK background — make dark pixels transparent, keep bright lines
        print(f"  -> Removing DARK background")
        brightness = (r + g + b) / 3
        # Alpha = how bright the pixel is (white lines stay opaque, dark bg becomes transparent)
        new_alpha = np.clip(brightness, 0, 255).astype(np.uint8)
        # Color: tint lines gold/warm
        out = np.zeros((h, w, 4), dtype=np.uint8)
        out[:,:,0] = np.clip(r + brightness * 0.3, 0, 255).astype(np.uint8)
        out[:,:,1] = np.clip(g * 0.85, 0, 255).astype(np.uint8)
        out[:,:,2] = np.clip(b * 0.2, 0, 255).astype(np.uint8)
        out[:,:,3] = new_alpha

    result = Image.fromarray(out, "RGBA")
    result.save(img_path)
    print(f"  -> Saved: {img_path}")

print("\nDone! All images converted to transparent PNGs with gold tint.")
