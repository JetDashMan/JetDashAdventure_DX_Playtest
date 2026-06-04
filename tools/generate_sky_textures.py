from __future__ import annotations

from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "textures" / "sky"
SOURCE = OUT / "blue_cloud_sky_source.png"

VARIANTS = [
    ("blue_cloud_sky_4096x2048.jpg", (4096, 2048), 93),
    ("blue_cloud_sky_2048x1024.jpg", (2048, 1024), 91),
    ("blue_cloud_sky_1024x512.jpg", (1024, 512), 90),
    ("blue_cloud_sky_512x256.jpg", (512, 256), 88),
]

PROMPT = """Create a seamless equirectangular 2:1 panoramic sky texture for a bright Korean coastal high-speed platformer.

Resolution target: 4096x2048, 2:1 panorama.
Scene: beautiful clear blue daytime sky with a moderate amount of soft white clouds.
Mood: fresh, bright, clean, optimistic, coastal city atmosphere.
Lighting: neutral daylight, no dramatic sunset, no storm, no dark clouds.
Composition: clouds spread naturally across the upper and middle sky, lighter near the horizon, clean open horizon area.
Requirements: seamless left-right wrap, equirectangular panorama, no ground, no ocean, no buildings, no mountains, no birds, no aircraft, no text, no logos, no watermark.
Style: photorealistic but slightly game-friendly, clean AAA arcade platformer sky texture.
"""


def soften_horizontal_seam(image: Image.Image, band_ratio: float = 0.055) -> Image.Image:
    """Feather both horizontal edges so the equirectangular wrap seam is less visible."""
    image = image.convert("RGB")
    arr = np.asarray(image, dtype=np.float32)
    height, width, _ = arr.shape
    band = max(8, int(width * band_ratio))
    left = arr[:, :band, :].copy()
    right = arr[:, width - band:, :].copy()

    # Match the outermost pixels exactly and fade into the unchanged interior.
    for i in range(band):
        edge_weight = 1.0 - i / max(1, band - 1)
        blend = 0.5 * edge_weight
        right_sample = right[:, band - 1 - i, :]
        left_sample = left[:, band - 1 - i, :]
        arr[:, i, :] = arr[:, i, :] * (1.0 - blend) + right_sample * blend
        arr[:, width - 1 - i, :] = arr[:, width - 1 - i, :] * (1.0 - blend) + left_sample * blend

    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def add_subtle_horizon_lift(image: Image.Image) -> Image.Image:
    """Keep the lower sky bright enough to blend with coastal fog and distant scenery."""
    arr = np.asarray(image.convert("RGB"), dtype=np.float32)
    height = arr.shape[0]
    for y in range(height):
      t = y / max(1, height - 1)
      lift = np.clip((t - 0.58) / 0.42, 0.0, 1.0)
      target = np.array([198, 234, 255], dtype=np.float32)
      arr[y, :, :] = arr[y, :, :] * (1.0 - lift * 0.18) + target * (lift * 0.18)
    return Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8), "RGB")


def write_prompt() -> None:
    (OUT / "SKY_TEXTURE_PROMPT.md").write_text(PROMPT, encoding="utf-8")


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    if not SOURCE.exists():
        raise FileNotFoundError(f"Missing source sky image: {SOURCE}")

    source = Image.open(SOURCE).convert("RGB")
    if source.width != source.height * 2:
        source = source.resize((source.width, source.width // 2), Image.Resampling.LANCZOS)

    source = soften_horizontal_seam(source)
    source = add_subtle_horizon_lift(source)
    source = source.filter(ImageFilter.UnsharpMask(radius=1.0, percent=45, threshold=3))

    for filename, size, quality in VARIANTS:
        variant = source.resize(size, Image.Resampling.LANCZOS)
        variant.save(OUT / filename, quality=quality, optimize=True, progressive=True)

    write_prompt()
    print(f"Generated {len(VARIANTS)} sky texture variants in {OUT}")


if __name__ == "__main__":
    main()
