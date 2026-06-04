from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "textures" / "sky"
SOURCE = OUT / "blue_cloud_sky_source.png"
WIDTH = 4096
HEIGHT = 2048

VARIANTS = [
    ("blue_cloud_sky_4096x2048.jpg", (4096, 2048), 98),
    ("blue_cloud_sky_2048x1024.jpg", (2048, 1024), 96),
    ("blue_cloud_sky_1024x512.jpg", (1024, 512), 94),
    ("blue_cloud_sky_512x256.jpg", (512, 256), 92),
]

NOTES = """# Sky Texture Notes

Source image:
- AI-generated blue daytime coastal sky
- puffy photorealistic clouds similar to the first preferred sky image
- large, medium, small, and wispy clouds are preserved for a natural look
- only the extreme left/right edges are cleared slightly to avoid visible wrap seams

Generation:
- the source is converted into a 4096x2048 master texture
- left/right edge columns are softly matched after resizing
- quality variants are wired to Texture Quality:
  - Low: 512x256
  - Medium: 1024x512
  - High: 2048x1024
  - Ultra: 4096x2048
"""


def fit_to_2x1(image: Image.Image) -> Image.Image:
    image = image.convert("RGB")
    target_ratio = 2.0
    ratio = image.width / image.height

    if abs(ratio - target_ratio) < 0.001:
        return image

    if ratio > target_ratio:
        new_width = int(image.height * target_ratio)
        left = (image.width - new_width) // 2
        return image.crop((left, 0, left + new_width, image.height))

    new_height = int(image.width / target_ratio)
    top = (image.height - new_height) // 2
    return image.crop((0, top, image.width, top + new_height))


def smoothstep(edge0: float, edge1: float, value: float) -> float:
    if edge1 <= edge0:
        return 1.0 if value >= edge1 else 0.0
    t = min(1.0, max(0.0, (value - edge0) / (edge1 - edge0)))
    return t * t * (3.0 - 2.0 * t)


def clear_edge_clouds(image: Image.Image, clear_ratio: float = 0.04, feather_ratio: float = 0.045) -> Image.Image:
    arr = np.asarray(image.convert("RGB"), dtype=np.float32).copy()
    height, width, _ = arr.shape
    clear = max(4, int(width * clear_ratio))
    feather = max(4, int(width * feather_ratio))
    total = min(width // 4, clear + feather)

    # Row percentile gives a clean blue-sky estimate without letting bright clouds dominate.
    row_background = np.percentile(arr, 28, axis=1).astype(np.float32)

    for i in range(total):
        original_weight = smoothstep(clear, total, i)
        sky_weight = 1.0 - original_weight
        arr[:, i, :] = arr[:, i, :] * original_weight + row_background * sky_weight
        arr[:, width - 1 - i, :] = arr[:, width - 1 - i, :] * original_weight + row_background * sky_weight

    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def soften_horizontal_seam(image: Image.Image, band: int = 192) -> Image.Image:
    arr = np.asarray(image.convert("RGB"), dtype=np.float32).copy()
    height, width, _ = arr.shape
    band = min(band, max(8, width // 8))

    for i in range(band):
        t = 1.0 - i / max(1, band - 1)
        blend = t * t * (3.0 - 2.0 * t)
        left = arr[:, i, :].copy()
        right = arr[:, width - 1 - i, :].copy()
        average = (left + right) * 0.5
        arr[:, i, :] = left * (1.0 - blend) + average * blend
        arr[:, width - 1 - i, :] = right * (1.0 - blend) + average * blend

    arr[:, -1, :] = arr[:, 0, :]
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def polish_master(image: Image.Image) -> Image.Image:
    image = fit_to_2x1(image)
    image = image.resize((WIDTH, HEIGHT), Image.Resampling.LANCZOS)
    image = clear_edge_clouds(image)
    image = soften_horizontal_seam(image)
    return image.filter(ImageFilter.UnsharpMask(radius=0.65, percent=42, threshold=3))


def write_notes() -> None:
    (OUT / "SKY_TEXTURE_PROMPT.md").write_text(NOTES, encoding="utf-8")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    if not SOURCE.exists():
        raise FileNotFoundError(f"Missing source sky image: {SOURCE}")

    source = Image.open(SOURCE)
    master = polish_master(source)

    for filename, size, quality in VARIANTS:
        variant = master if size == (WIDTH, HEIGHT) else master.resize(size, Image.Resampling.LANCZOS)
        variant.save(OUT / filename, quality=quality, optimize=True, progressive=True, subsampling=0)

    write_notes()
    print(f"Generated {len(VARIANTS)} sky texture variants from {SOURCE}")


if __name__ == "__main__":
    main()
