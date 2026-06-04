from __future__ import annotations

from pathlib import Path
import math
import random

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "textures" / "sky"
WIDTH = 4096
HEIGHT = 2048
RNG = random.Random(73051)

VARIANTS = [
    ("blue_cloud_sky_4096x2048.jpg", (4096, 2048), 96),
    ("blue_cloud_sky_2048x1024.jpg", (2048, 1024), 94),
    ("blue_cloud_sky_1024x512.jpg", (1024, 512), 92),
    ("blue_cloud_sky_512x256.jpg", (512, 256), 90),
]

NOTES = """# Sky Texture Notes

This sky is generated as a 4096x2048 equirectangular-style skydome source with small distant cloud forms.

Goals:
- avoid oversized foreground clouds
- keep clouds sharp enough for Ultra without relying on low-resolution upscaling
- make the left/right wrap visually seamless during manual camera rotation
- keep the horizon bright and clean for the Busan coastal stages

The generated variants are wired to Texture Quality:
- Low: 512x256
- Medium: 1024x512
- High: 2048x1024
- Ultra: 4096x2048
"""


def smoothstep(edge0: float, edge1: float, x: np.ndarray) -> np.ndarray:
    t = np.clip((x - edge0) / max(0.0001, edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def make_tileable_value_noise(width: int, height: int, grid_x: int, grid_y: int, seed: int) -> np.ndarray:
    rng = np.random.default_rng(seed)
    values = rng.random((grid_y, grid_x), dtype=np.float32)

    x = np.linspace(0, grid_x, width, endpoint=False, dtype=np.float32)
    y = np.linspace(0, grid_y, height, endpoint=False, dtype=np.float32)
    x0 = np.floor(x).astype(np.int32)
    y0 = np.floor(y).astype(np.int32)
    x1 = (x0 + 1) % grid_x
    y1 = (y0 + 1) % grid_y
    tx = x - x0
    ty = y - y0
    tx = tx * tx * (3.0 - 2.0 * tx)
    ty = ty * ty * (3.0 - 2.0 * ty)

    top = values[y0[:, None], x0[None, :]] * (1.0 - tx)[None, :] + values[y0[:, None], x1[None, :]] * tx[None, :]
    bottom = values[y1[:, None], x0[None, :]] * (1.0 - tx)[None, :] + values[y1[:, None], x1[None, :]] * tx[None, :]
    return top * (1.0 - ty)[:, None] + bottom * ty[:, None]


def add_wrapped_ellipse(mask: np.ndarray, cx: float, cy: float, rx: float, ry: float, amount: float, softness: float = 1.0) -> None:
    height, width = mask.shape
    margin_x = int(rx * 2.3)
    margin_y = int(ry * 2.3)
    for wrapped_cx in (cx - width, cx, cx + width):
        x0 = max(0, int(wrapped_cx - margin_x))
        x1 = min(width, int(wrapped_cx + margin_x + 1))
        y0 = max(0, int(cy - margin_y))
        y1 = min(height, int(cy + margin_y + 1))
        if x0 >= x1 or y0 >= y1:
            continue

        yy, xx = np.mgrid[y0:y1, x0:x1]
        dx = (xx - wrapped_cx) / max(1.0, rx)
        dy = (yy - cy) / max(1.0, ry)
        dist = dx * dx + dy * dy
        puff = np.clip(1.0 - dist, 0.0, 1.0) ** softness
        mask[y0:y1, x0:x1] = np.maximum(mask[y0:y1, x0:x1], puff * amount)


def add_cloud_cluster(mask: np.ndarray, cx: float, cy: float, width: float, height: float, amount: float) -> None:
    puffs = RNG.randint(5, 11)
    for _ in range(puffs):
        offset_x = RNG.uniform(-0.42, 0.42) * width
        offset_y = RNG.uniform(-0.24, 0.24) * height
        rx = RNG.uniform(0.12, 0.24) * width
        ry = RNG.uniform(0.28, 0.62) * height
        local_amount = amount * RNG.uniform(0.55, 1.0)
        add_wrapped_ellipse(mask, cx + offset_x, cy + offset_y, rx, ry, local_amount, RNG.uniform(1.45, 2.3))

    # A soft base keeps each cluster fluffy while preserving a distant scale.
    add_wrapped_ellipse(mask, cx, cy + height * 0.12, width * 0.42, height * 0.46, amount * 0.38, 1.7)


def add_cirrus(mask: np.ndarray, cx: float, cy: float, width: float, height: float, amount: float) -> None:
    segments = RNG.randint(3, 7)
    angle = RNG.uniform(-0.12, 0.12)
    for index in range(segments):
        t = (index / max(1, segments - 1)) - 0.5
        add_wrapped_ellipse(
            mask,
            cx + math.cos(angle) * t * width + RNG.uniform(-12, 12),
            cy + math.sin(angle) * t * width + RNG.uniform(-8, 8),
            width * RNG.uniform(0.09, 0.16),
            height * RNG.uniform(0.35, 0.65),
            amount * RNG.uniform(0.45, 0.95),
            RNG.uniform(1.8, 2.8),
        )


def create_sky() -> Image.Image:
    y = np.linspace(0.0, 1.0, HEIGHT, dtype=np.float32)[:, None]
    x = np.linspace(0.0, 1.0, WIDTH, endpoint=False, dtype=np.float32)[None, :]

    top = np.array([21, 105, 211], dtype=np.float32)
    mid = np.array([39, 162, 234], dtype=np.float32)
    horizon = np.array([203, 237, 254], dtype=np.float32)
    upper_mix = smoothstep(0.0, 0.55, y)
    lower_mix = smoothstep(0.52, 1.0, y)
    sky = top * (1.0 - upper_mix[..., None]) + mid * upper_mix[..., None]
    sky = sky * (1.0 - lower_mix[..., None]) + horizon * lower_mix[..., None]
    sky = np.repeat(sky, WIDTH, axis=1)

    low_noise = make_tileable_value_noise(WIDTH, HEIGHT, 16, 8, 9021)
    fine_noise = make_tileable_value_noise(WIDTH, HEIGHT, 96, 36, 9022)
    sky += ((low_noise * 0.75 + fine_noise * 0.25) - 0.5)[..., None] * np.array([5.0, 7.0, 9.0], dtype=np.float32)
    sky += (np.sin(x * math.tau * 2.0) * 1.5 + np.sin((x + y * 0.13) * math.tau * 5.0) * 0.7)[..., None]

    cloud_mask = np.zeros((HEIGHT, WIDTH), dtype=np.float32)
    shade_mask = np.zeros((HEIGHT, WIDTH), dtype=np.float32)

    for _ in range(92):
        cy = RNG.uniform(210, 1260)
        if RNG.random() < 0.45:
            cy = RNG.uniform(760, 1580)
        scale_by_height = np.interp(cy, [180, HEIGHT - 220], [1.0, 0.56])
        width = RNG.uniform(70, 210) * scale_by_height
        height = RNG.uniform(18, 54) * scale_by_height
        amount = RNG.uniform(0.22, 0.55)
        cx = RNG.uniform(0, WIDTH)
        add_cloud_cluster(cloud_mask, cx, cy, width, height, amount)
        add_cloud_cluster(shade_mask, cx + RNG.uniform(-8, 8), cy + height * 0.22, width * 0.98, height * 0.7, amount * 0.28)

    for _ in range(70):
        cy = RNG.uniform(100, 930)
        width = RNG.uniform(170, 430)
        height = RNG.uniform(9, 24)
        amount = RNG.uniform(0.035, 0.12)
        add_cirrus(cloud_mask, RNG.uniform(0, WIDTH), cy, width, height, amount)

    cloud_mask = np.asarray(Image.fromarray(np.clip(cloud_mask * 255, 0, 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(0.85)), dtype=np.float32) / 255.0
    shade_mask = np.asarray(Image.fromarray(np.clip(shade_mask * 255, 0, 255).astype(np.uint8), "L").filter(ImageFilter.GaussianBlur(2.0)), dtype=np.float32) / 255.0

    detail = make_tileable_value_noise(WIDTH, HEIGHT, 220, 90, 9023)
    cloud_alpha = np.clip(cloud_mask * (0.86 + detail * 0.22), 0.0, 0.72)

    yy = np.linspace(0.0, 1.0, HEIGHT, dtype=np.float32)[:, None]
    cloud_top = np.array([255, 255, 255], dtype=np.float32)
    cloud_bottom = np.array([205, 225, 238], dtype=np.float32)
    underside = np.clip(shade_mask * 0.5 + smoothstep(0.32, 0.95, yy) * 0.18, 0.0, 0.55)
    cloud_color = cloud_top * (1.0 - underside[..., None]) + cloud_bottom * underside[..., None]
    sky = sky * (1.0 - cloud_alpha[..., None]) + cloud_color * cloud_alpha[..., None]

    # Keep the lower horizon airy instead of forming a bright cloud wall.
    horizon_fade = smoothstep(0.78, 1.0, yy)
    sky = sky * (1.0 - horizon_fade[..., None] * 0.08) + horizon * (horizon_fade[..., None] * 0.08)

    # Force a clean wrap seam after all compositing. This removes subtle JPEG seam amplification.
    seam_band = 96
    for i in range(seam_band):
        t = 1.0 - i / max(1, seam_band - 1)
        blend = t * 0.55
        left = sky[:, i, :].copy()
        right = sky[:, WIDTH - 1 - i, :].copy()
        avg = (left + right) * 0.5
        sky[:, i, :] = left * (1.0 - blend) + avg * blend
        sky[:, WIDTH - 1 - i, :] = right * (1.0 - blend) + avg * blend
    sky[:, -1, :] = sky[:, 0, :]

    image = Image.fromarray(np.clip(sky, 0, 255).astype(np.uint8), "RGB")
    return image.filter(ImageFilter.UnsharpMask(radius=0.7, percent=28, threshold=4))


def write_notes() -> None:
    (OUT / "SKY_TEXTURE_PROMPT.md").write_text(NOTES, encoding="utf-8")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    source = create_sky()
    for filename, size, quality in VARIANTS:
        variant = source if size == (WIDTH, HEIGHT) else source.resize(size, Image.Resampling.LANCZOS)
        variant.save(OUT / filename, quality=quality, optimize=True, progressive=True)
    write_notes()
    print(f"Generated {len(VARIANTS)} seamless distant-cloud sky variants in {OUT}")


if __name__ == "__main__":
    main()
