# Sky Texture Notes

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
