from __future__ import annotations

from pathlib import Path
import math
import random

import numpy as np
from PIL import Image, ImageDraw, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "textures" / "materials"
SIZE = 2048
QUALITY_VARIANTS = [
    ("", 2048),
    ("_1024", 1024),
    ("_512", 512),
    ("_256", 256),
]
RNG = random.Random(4317)


PROMPTS = {
    "road_marking_white": "Create a seamless tileable PBR decal texture set for worn white Korean highway lane paint on asphalt. Outputs: base color, normal, roughness, alpha mask. Single lane stripe only, no arrows, no text, no vehicles, no perspective.",
    "road_marking_yellow": "Create a seamless tileable PBR decal texture set for worn yellow Korean highway edge/lane paint on asphalt. Outputs: base color, normal, roughness, alpha mask. Single stripe only, no arrows, no text, no vehicles, no perspective.",
    "painted_bridge_concrete": "Create a seamless tileable AAA photoreal PBR texture for off-white weathered bridge concrete and painted civil structure surfaces near a coastal highway. Include subtle stains, salt weathering, hairline cracks, and rough surface detail. Outputs: base color, normal, roughness, ambient occlusion.",
    "painted_bridge_metal": "Create a seamless tileable AAA photoreal PBR texture for white painted steel bridge cables, guardrails, and structural beams in a coastal city. Include subtle scratches, salt marks, chipped paint, and metal underlayer hints. Outputs: base color, normal, roughness, ambient occlusion.",
    "guardrail_white_metal": "Create a seamless tileable AAA photoreal PBR texture for Korean highway white metal guardrails. Include grime in seams, small scratches, bolt/rivet detail, and dull painted metal roughness. Outputs: base color, normal, roughness, ambient occlusion.",
    "tunnel_white_tile": "Create a seamless tileable AAA photoreal PBR texture for white rectangular tunnel wall tiles at a Korean underpass entrance. Include grout lines, uneven tile reflectance, grime, and slight chips. Outputs: base color, normal, roughness, ambient occlusion.",
    "tunnel_dark_ceiling": "Create a seamless tileable AAA photoreal PBR texture for dark concrete tunnel ceiling with soot, dust, water marks, and rough overhead panels. Outputs: base color, normal, roughness, ambient occlusion.",
    "tunnel_green_stripe": "Create a seamless tileable PBR texture for green ceramic tunnel stripe tiles, slightly worn and dirty, with grout seams. Outputs: base color, normal, roughness, ambient occlusion.",
    "tunnel_blue_stripe": "Create a seamless tileable PBR texture for blue ceramic tunnel stripe tiles, slightly worn and dirty, with grout seams. Outputs: base color, normal, roughness, ambient occlusion.",
    "blue_glass_facade": "Create a seamless tileable AAA photoreal high-rise blue glass facade atlas. Repeating window grid, mullions, subtle sky reflections, no logos, no words. Outputs: base color, normal, roughness, ambient occlusion.",
    "dark_glass_facade": "Create a seamless tileable AAA photoreal dark blue glass skyscraper facade atlas with vertical mullions, balcony shadow lines, and reflection variation. No text, no logos. Outputs: base color, normal, roughness, ambient occlusion.",
    "white_facade_panel": "Create a seamless tileable AAA photoreal white and light gray apartment facade panel texture with window seams, panel joints, slight dirt streaks. No text, no logos. Outputs: base color, normal, roughness, ambient occlusion.",
    "apartment_balcony_facade": "Create a seamless tileable AAA photoreal Korean apartment balcony facade atlas with regular balcony lines, pale concrete, blue-gray windows, and realistic dirt streaks. No text, no logos. Outputs: base color, normal, roughness, ambient occlusion.",
    "school_wall": "Create a seamless tileable PBR texture for light beige school building wall with concrete panels, window trim hints, and subtle aging. Outputs: base color, normal, roughness, ambient occlusion.",
    "noise_wall_concrete": "Create a seamless tileable PBR texture for gray roadside noise barrier concrete and frame surfaces with grime, seams, and roughness variation. Outputs: base color, normal, roughness, ambient occlusion.",
    "wood_boardwalk": "Create a seamless tileable AAA photoreal PBR texture for coastal boardwalk wood planks, weathered by salt air, with plank seams, grain, and worn varnish. Outputs: base color, normal, roughness, ambient occlusion.",
    "concrete_dock": "Create a seamless tileable AAA photoreal PBR texture for harbor dock concrete, damp stains, salt marks, cracks, and rough aggregate. Outputs: base color, normal, roughness, ambient occlusion.",
    "harbor_container_red": "Create a seamless tileable AAA photoreal PBR texture for red corrugated shipping container metal. Include ribs, scratches, rust edges, dirt, no text/logos. Outputs: base color, normal, roughness, ambient occlusion.",
    "harbor_container_blue": "Create a seamless tileable AAA photoreal PBR texture for blue corrugated shipping container metal. Include ribs, scratches, rust edges, dirt, no text/logos. Outputs: base color, normal, roughness, ambient occlusion.",
    "harbor_container_yellow": "Create a seamless tileable AAA photoreal PBR texture for yellow corrugated shipping container metal. Include ribs, scratches, rust edges, dirt, no text/logos. Outputs: base color, normal, roughness, ambient occlusion.",
    "harbor_container_green": "Create a seamless tileable AAA photoreal PBR texture for green corrugated shipping container metal. Include ribs, scratches, rust edges, dirt, no text/logos. Outputs: base color, normal, roughness, ambient occlusion.",
    "crane_yellow_metal": "Create a seamless tileable AAA photoreal PBR texture for yellow painted harbor crane metal with chipped paint, grease, scratches, and dull industrial roughness. Outputs: base color, normal, roughness, ambient occlusion.",
    "black_rubber_tire": "Create a seamless tileable PBR texture for black vehicle tire rubber with fine tread-like micro ridges, dust, and rough rubber. Outputs: base color, normal, roughness, ambient occlusion.",
    "coastal_forest_canopy": "Create a seamless tileable PBR texture for dense coastal green tree canopy viewed from a game camera, leafy variation, no flowers, no text. Outputs: base color, normal, roughness, ambient occlusion.",
    "coastal_rock": "Create a seamless tileable PBR texture for Korean coastal gray rock and breakwater stone, salt weathering, cracks, rough mineral variation. Outputs: base color, normal, roughness, ambient occlusion.",
    "jet_white_fabric": "Create a seamless tileable PBR texture for clean white technical hoodie fabric, subtle weave, seams, wrinkles, and soft roughness. Outputs: base color, normal, roughness, ambient occlusion.",
    "jet_red_fabric": "Create a seamless tileable PBR texture for red athletic jogger pants fabric, subtle weave, folds, and worn cloth roughness. Outputs: base color, normal, roughness, ambient occlusion.",
    "jet_black_leather": "Create a seamless tileable PBR texture for black fingerless glove leather and harness straps, fine grain, stitched seams, and worn edges. Outputs: base color, normal, roughness, ambient occlusion.",
    "shoe_white_leather": "Create a seamless tileable PBR texture for white running shoe leather and synthetic panels, perforations, scuffs, and clean sole detail. Outputs: base color, normal, roughness, ambient occlusion.",
    "skin_subtle": "Create a seamless tileable subtle skin PBR texture for stylized real-time teen character skin, clean, natural pores, no face features. Outputs: base color, normal, roughness, ambient occlusion.",
    "hair_dark": "Create a seamless tileable PBR texture for dark brown anime-realistic hair clumps, directional strands, soft roughness, no scalp. Outputs: base color, normal, roughness, ambient occlusion.",
    "hazard_red_paint": "Create a seamless tileable PBR texture for red painted obstacle metal with scratches, chips, and impact wear. Outputs: base color, normal, roughness, ambient occlusion.",
    "hazard_yellow_paint": "Create a seamless tileable PBR texture for yellow hazard paint on metal with grime, scratches, and reflective wear. Outputs: base color, normal, roughness, ambient occlusion.",
}


def ensure_out() -> None:
    OUT.mkdir(parents=True, exist_ok=True)


def make_noise(size: int, seed: int, blur: float = 0.0) -> Image.Image:
    local = random.Random(seed)
    arr = np.array([[local.randrange(256) for _ in range(size)] for _ in range(size)], dtype=np.uint8)
    img = Image.fromarray(arr, "L")
    if blur:
        img = img.filter(ImageFilter.GaussianBlur(blur))
    return img


def noise_array(size: int, seed: int, blur: float = 0.0) -> np.ndarray:
    return np.asarray(make_noise(size, seed, blur), dtype=np.float32) / 255.0


def rgb(base: tuple[int, int, int], noise: np.ndarray, amount: float = 24.0) -> np.ndarray:
    arr = np.zeros((SIZE, SIZE, 3), dtype=np.float32)
    for c in range(3):
        arr[:, :, c] = base[c] + (noise - 0.5) * amount
    return np.clip(arr, 0, 255).astype(np.uint8)


def save_rgb(path: Path, arr: np.ndarray, quality: int = 90) -> None:
    Image.fromarray(arr, "RGB").save(path, quality=quality, optimize=True)


def save_l(path: Path, arr: np.ndarray, quality: int = 90) -> None:
    Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8), "L").save(path, quality=quality, optimize=True)


def save_variants(name: str, map_name: str, image: Image.Image, extension: str, quality: int = 90) -> None:
    for suffix, size in QUALITY_VARIANTS:
        variant = image if size == SIZE else image.resize((size, size), Image.Resampling.LANCZOS)
        path = OUT / f"{name}_{map_name}{suffix}.{extension}"
        if extension == "jpg":
            variant.save(path, quality=quality, optimize=True)
        else:
            variant.save(path, optimize=True)


def normal_from_height(height: np.ndarray, strength: float = 5.0) -> np.ndarray:
    h = height.astype(np.float32)
    dx = np.roll(h, -1, axis=1) - np.roll(h, 1, axis=1)
    dy = np.roll(h, -1, axis=0) - np.roll(h, 1, axis=0)
    nx = -dx * strength
    ny = -dy * strength
    nz = np.ones_like(h)
    length = np.sqrt(nx * nx + ny * ny + nz * nz)
    normal = np.stack((nx / length, ny / length, nz / length), axis=2)
    return np.clip((normal * 0.5 + 0.5) * 255, 0, 255).astype(np.uint8)


def save_set(name: str, base: np.ndarray, height: np.ndarray, roughness: np.ndarray, ao: np.ndarray, normal_strength: float = 5.0) -> None:
    save_variants(name, "basecolor", Image.fromarray(base, "RGB"), "jpg")
    save_variants(name, "normal", Image.fromarray(normal_from_height(height, normal_strength), "RGB"), "jpg", quality=88)
    save_variants(name, "roughness", Image.fromarray(np.clip(roughness * 255, 0, 255).astype(np.uint8), "L"), "jpg")
    save_variants(name, "ao", Image.fromarray(np.clip(ao * 255, 0, 255).astype(np.uint8), "L"), "jpg")


def draw_cracks(draw: ImageDraw.ImageDraw, count: int, color: tuple[int, int, int], width: int = 2) -> None:
    for _ in range(count):
        x = RNG.randrange(SIZE)
        y = RNG.randrange(SIZE)
        points = [(x, y)]
        for _ in range(RNG.randrange(3, 8)):
            x = (x + RNG.randrange(-70, 80)) % SIZE
            y = (y + RNG.randrange(-44, 55)) % SIZE
            points.append((x, y))
        draw.line(points, fill=color, width=RNG.randrange(1, width + 1))


def concrete(name: str, base_color: tuple[int, int, int], crack_color: tuple[int, int, int], rough: float = 0.72, strength: float = 4.0) -> None:
    n1 = noise_array(SIZE, RNG.randrange(999999), 1.8)
    n2 = noise_array(SIZE, RNG.randrange(999999), 9.0)
    base = rgb(base_color, n1 * 0.65 + n2 * 0.35, 38)
    img = Image.fromarray(base, "RGB")
    draw = ImageDraw.Draw(img)
    draw_cracks(draw, 56, crack_color, 2)
    for _ in range(40):
        x = RNG.randrange(SIZE)
        y = RNG.randrange(SIZE)
        draw.ellipse((x - 18, y - 4, x + 18, y + 4), fill=tuple(max(0, c - 28) for c in base_color))
    base = np.asarray(img, dtype=np.uint8)
    height = np.clip(n1 * 0.58 + n2 * 0.42, 0, 1)
    roughness = np.clip(rough + (n1 - 0.5) * 0.16, 0.25, 1)
    ao = np.clip(0.92 - (1 - height) * 0.16, 0.45, 1)
    save_set(name, base, height, roughness, ao, strength)


def metal(name: str, base_color: tuple[int, int, int], rough: float, strength: float = 3.4, yellow=False) -> None:
    n = noise_array(SIZE, RNG.randrange(999999), 1.0)
    fine = noise_array(SIZE, RNG.randrange(999999), 0.15)
    base = rgb(base_color, n * 0.7 + fine * 0.3, 32)
    img = Image.fromarray(base, "RGB")
    draw = ImageDraw.Draw(img)
    for _ in range(110):
        x = RNG.randrange(SIZE)
        y = RNG.randrange(SIZE)
        length = RNG.randrange(24, 130)
        color = (235, 239, 236) if not yellow else (250, 220, 105)
        draw.line((x, y, (x + length) % SIZE, y + RNG.randrange(-5, 6)), fill=color, width=1)
    for _ in range(34):
        x = RNG.randrange(SIZE)
        y = RNG.randrange(SIZE)
        draw.ellipse((x - 4, y - 4, x + 4, y + 4), fill=(70, 74, 72))
    height = np.clip(n * 0.55 + fine * 0.45, 0, 1)
    roughness = np.clip(rough + n * 0.22, 0.2, 0.95)
    ao = np.clip(0.92 - n * 0.12, 0.55, 1)
    save_set(name, np.asarray(img), height, roughness, ao, strength)


def tunnel_tiles(name: str, color: tuple[int, int, int], stripe: bool = False) -> None:
    n = noise_array(SIZE, RNG.randrange(999999), 2.0)
    base = rgb(color, n, 28)
    img = Image.fromarray(base, "RGB")
    draw = ImageDraw.Draw(img)
    grout = tuple(max(0, c - 52) for c in color)
    tile_w = 128
    tile_h = 72
    for y in range(0, SIZE + tile_h, tile_h):
        offset = (tile_w // 2) if (y // tile_h) % 2 else 0
        draw.line((0, y, SIZE, y), fill=grout, width=5)
        for x in range(-offset, SIZE + tile_w, tile_w):
            draw.line((x, y, x, y + tile_h), fill=grout, width=4)
    for _ in range(90):
        x = RNG.randrange(SIZE)
        y = RNG.randrange(SIZE)
        stain = (78, 86, 78) if not stripe else tuple(max(0, c - 74) for c in color)
        draw.ellipse((x - 20, y - 4, x + 20, y + 4), fill=stain)
    base = np.asarray(img)
    height = np.full((SIZE, SIZE), 0.68, dtype=np.float32)
    for y in range(0, SIZE, tile_h):
        height[max(0, y - 3):min(SIZE, y + 4), :] = 0.28
    for y in range(0, SIZE, tile_h):
        offset = (tile_w // 2) if (y // tile_h) % 2 else 0
        for x in range(-offset, SIZE + tile_w, tile_w):
            height[max(0, y):min(SIZE, y + tile_h), max(0, x - 2):min(SIZE, x + 3)] = 0.3
    height += n * 0.08
    roughness = np.clip(0.58 + n * 0.22, 0.32, 0.92)
    ao = np.clip(0.96 - (1 - height) * 0.38, 0.45, 1)
    save_set(name, base, np.clip(height, 0, 1), roughness, ao, 8.0)


def facade(name: str, wall: tuple[int, int, int], glass: tuple[int, int, int], dark=False) -> None:
    n = noise_array(SIZE, RNG.randrange(999999), 2.2)
    base = rgb(wall, n, 22)
    img = Image.fromarray(base, "RGB")
    draw = ImageDraw.Draw(img)
    win_w = 76
    win_h = 52
    gap_x = 24
    gap_y = 24
    for y in range(24, SIZE, win_h + gap_y):
        draw.rectangle((0, y - 6, SIZE, y - 2), fill=tuple(max(0, c - 34) for c in wall))
        for x in range(20, SIZE, win_w + gap_x):
            shade = RNG.randrange(-24, 30)
            g = tuple(int(max(0, min(255, c + shade))) for c in glass)
            draw.rectangle((x, y, x + win_w, y + win_h), fill=g)
            draw.line((x + 4, y + 6, x + win_w - 8, y + 18), fill=tuple(min(255, c + 55) for c in g), width=2)
            draw.rectangle((x, y, x + win_w, y + win_h), outline=tuple(max(0, c - 55) for c in wall), width=3)
    base = np.asarray(img)
    height = np.clip(n * 0.18 + 0.54, 0, 1)
    # Recess window lanes and panel seams.
    for y in range(24, SIZE, win_h + gap_y):
        height[y:y + win_h, :] -= 0.08
    roughness = np.clip((0.36 if dark else 0.44) + n * 0.2, 0.12, 0.92)
    ao = np.clip(0.91 - (0.62 - height) * 0.32, 0.45, 1)
    save_set(name, base, np.clip(height, 0, 1), roughness, ao, 5.8)


def container(name: str, color: tuple[int, int, int]) -> None:
    n = noise_array(SIZE, RNG.randrange(999999), 1.1)
    base = rgb(color, n, 36)
    img = Image.fromarray(base, "RGB")
    draw = ImageDraw.Draw(img)
    rib_color = tuple(max(0, c - 36) for c in color)
    highlight = tuple(min(255, c + 34) for c in color)
    for x in range(0, SIZE, 64):
        draw.rectangle((x + 7, 0, x + 18, SIZE), fill=rib_color)
        draw.line((x + 21, 0, x + 21, SIZE), fill=highlight, width=2)
    for y in range(96, SIZE, 160):
        draw.line((0, y, SIZE, y), fill=rib_color, width=4)
    for _ in range(100):
        x = RNG.randrange(SIZE)
        y = RNG.randrange(SIZE)
        draw.line((x, y, x + RNG.randrange(8, 70), y + RNG.randrange(-4, 5)), fill=(78, 55, 38), width=RNG.randrange(1, 3))
    height = np.clip(n * 0.22 + 0.56, 0, 1)
    for x in range(0, SIZE, 64):
        height[:, x + 7:x + 18] += 0.22
    roughness = np.clip(0.58 + n * 0.28, 0.32, 0.96)
    ao = np.clip(0.9 - n * 0.18, 0.48, 1)
    save_set(name, np.asarray(img), np.clip(height, 0, 1), roughness, ao, 7.0)


def fabric(name: str, color: tuple[int, int, int], rough: float = 0.72) -> None:
    n = noise_array(SIZE, RNG.randrange(999999), 0.7)
    base = rgb(color, n, 24)
    img = Image.fromarray(base, "RGB")
    draw = ImageDraw.Draw(img)
    seam = tuple(max(0, c - 40) for c in color)
    for x in range(0, SIZE, 18):
        draw.line((x, 0, x, SIZE), fill=seam, width=1)
    for y in range(0, SIZE, 22):
        draw.line((0, y, SIZE, y), fill=tuple(min(255, c + 14) for c in color), width=1)
    height = np.clip(n * 0.22 + 0.52, 0, 1)
    for x in range(0, SIZE, 18):
        height[:, x:x + 1] -= 0.06
    for y in range(0, SIZE, 22):
        height[y:y + 1, :] += 0.04
    roughness = np.clip(rough + n * 0.16, 0.42, 1.0)
    ao = np.clip(0.92 - n * 0.12, 0.56, 1)
    save_set(name, np.asarray(img), np.clip(height, 0, 1), roughness, ao, 6.2)


def organic(name: str, colors: list[tuple[int, int, int]], rough: float, strength: float) -> None:
    n1 = noise_array(SIZE, RNG.randrange(999999), 3.0)
    n2 = noise_array(SIZE, RNG.randrange(999999), 11.0)
    idx = np.clip(((n1 * 0.7 + n2 * 0.3) * len(colors)).astype(int), 0, len(colors) - 1)
    base = np.zeros((SIZE, SIZE, 3), dtype=np.uint8)
    for i, c in enumerate(colors):
        base[idx == i] = c
    height = np.clip(n1 * 0.58 + n2 * 0.42, 0, 1)
    roughness = np.clip(rough + n1 * 0.18, 0.35, 1)
    ao = np.clip(0.92 - n2 * 0.22, 0.45, 1)
    save_set(name, base, height, roughness, ao, strength)


def road_marking(name: str, paint: tuple[int, int, int]) -> None:
    n = noise_array(SIZE, RNG.randrange(999999), 1.4)
    asphalt = rgb((54, 57, 55), n, 32)
    base = asphalt.copy()
    alpha = np.zeros((SIZE, SIZE), dtype=np.float32)
    stripe_x0 = SIZE // 2 - 120
    stripe_x1 = SIZE // 2 + 120
    alpha[:, stripe_x0:stripe_x1] = 1.0
    wear = noise_array(SIZE, RNG.randrange(999999), 2.5)
    alpha[:, stripe_x0:stripe_x1] *= np.clip(0.55 + wear[:, stripe_x0:stripe_x1] * 0.72, 0, 1)
    base[:, stripe_x0:stripe_x1, :] = np.clip(
        np.array(paint, dtype=np.float32) + (wear[:, stripe_x0:stripe_x1, None] - 0.5) * 42,
        0,
        255,
    ).astype(np.uint8)
    for _ in range(130):
        y = RNG.randrange(SIZE)
        x = RNG.randrange(stripe_x0, stripe_x1)
        w = RNG.randrange(20, 90)
        alpha[y:y + RNG.randrange(1, 4), max(stripe_x0, x - w):min(stripe_x1, x + w)] *= RNG.uniform(0.1, 0.55)
    height = n * 0.2
    height[:, stripe_x0:stripe_x1] += alpha[:, stripe_x0:stripe_x1] * 0.32
    roughness = np.clip(0.72 + n * 0.16 - alpha * 0.16, 0.35, 0.96)
    ao = np.clip(0.92 - alpha * 0.08 - n * 0.08, 0.55, 1)
    save_variants(name, "basecolor", Image.fromarray(base, "RGB"), "jpg")
    save_variants(name, "normal", Image.fromarray(normal_from_height(np.clip(height, 0, 1), 8.0), "RGB"), "jpg", quality=88)
    save_variants(name, "roughness", Image.fromarray(np.clip(roughness * 255, 0, 255).astype(np.uint8), "L"), "jpg")
    save_variants(name, "ao", Image.fromarray(np.clip(ao * 255, 0, 255).astype(np.uint8), "L"), "jpg")
    save_variants(name, "alpha", Image.fromarray(np.clip(alpha * 255, 0, 255).astype(np.uint8), "L"), "png")


def write_prompts() -> None:
    lines = ["# AAA Material Texture Prompts", ""]
    for key, prompt in PROMPTS.items():
        lines.append(f"## {key}")
        lines.append(prompt)
        lines.append("")
    (OUT / "TEXTURE_PROMPTS.md").write_text("\n".join(lines), encoding="utf-8")


def main() -> None:
    ensure_out()
    road_marking("road_marking_white", (236, 235, 224))
    road_marking("road_marking_yellow", (232, 189, 54))
    concrete("painted_bridge_concrete", (224, 229, 226), (139, 148, 145), 0.64, 4.2)
    metal("painted_bridge_metal", (229, 236, 237), 0.42, 4.0)
    metal("guardrail_white_metal", (232, 238, 238), 0.48, 4.0)
    tunnel_tiles("tunnel_white_tile", (222, 226, 217))
    concrete("tunnel_dark_ceiling", (47, 55, 50), (24, 28, 26), 0.88, 4.8)
    tunnel_tiles("tunnel_green_stripe", (48, 99, 82), True)
    tunnel_tiles("tunnel_blue_stripe", (43, 61, 118), True)
    facade("blue_glass_facade", (80, 108, 125), (120, 184, 213), False)
    facade("dark_glass_facade", (42, 64, 76), (58, 104, 130), True)
    facade("white_facade_panel", (214, 226, 227), (144, 190, 204), False)
    facade("apartment_balcony_facade", (199, 208, 208), (126, 164, 180), False)
    concrete("school_wall", (210, 205, 190), (136, 132, 124), 0.68, 3.6)
    concrete("noise_wall_concrete", (112, 119, 116), (72, 78, 76), 0.84, 4.8)
    fabric("wood_boardwalk", (158, 113, 73), 0.78)
    concrete("concrete_dock", (119, 133, 137), (68, 82, 86), 0.82, 4.8)
    container("harbor_container_red", (188, 52, 42))
    container("harbor_container_blue", (45, 103, 183))
    container("harbor_container_yellow", (214, 168, 43))
    container("harbor_container_green", (36, 143, 101))
    metal("crane_yellow_metal", (226, 167, 34), 0.52, 4.8, True)
    fabric("black_rubber_tire", (20, 24, 28), 0.84)
    organic("coastal_forest_canopy", [(35, 92, 50), (44, 118, 67), (27, 70, 42), (70, 130, 63)], 0.88, 5.2)
    organic("coastal_rock", [(80, 92, 88), (103, 113, 110), (65, 76, 74), (126, 128, 120)], 0.86, 7.0)
    fabric("jet_white_fabric", (230, 233, 232), 0.72)
    fabric("jet_red_fabric", (174, 30, 36), 0.7)
    fabric("jet_black_leather", (24, 27, 30), 0.55)
    fabric("shoe_white_leather", (237, 238, 233), 0.48)
    organic("skin_subtle", [(228, 176, 135), (238, 190, 150), (217, 158, 120)], 0.58, 2.2)
    fabric("hair_dark", (46, 34, 27), 0.64)
    metal("hazard_red_paint", (205, 56, 48), 0.46, 4.2)
    metal("hazard_yellow_paint", (232, 198, 67), 0.48, 4.2, True)
    write_prompts()
    print(f"Generated {len(PROMPTS)} material prompts and texture sets in {OUT}")


if __name__ == "__main__":
    main()
