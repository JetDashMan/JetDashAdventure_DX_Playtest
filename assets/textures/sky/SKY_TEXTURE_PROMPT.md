# Sky Texture Notes

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
