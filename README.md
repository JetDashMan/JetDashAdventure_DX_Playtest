# JetDashAdventure_DX

A Three.js high-speed 3D platformer prototype inspired by Sonic-style stage flow. It includes a procedural blue speedster character, a tutorial stage, a curved Stage 1, a Gwangan Bridge-themed Stage 2 over open sea with 100 m bridge streetlights that extends into a coastal Busan skyline and Shinseondae underpass route, a straight Busan harbor-style Stage 3, shard collection, score tracking, jump pads, boost gauge management, a snappy obstacle-clearing jump, a closer fixed-center camera, obstacles, and dropped shards.

## Run

```powershell
python -m http.server 4173
```

Open `http://localhost:4173` in your browser.

## Controls

- `A`, `D` / `Left`, `Right`: move sideways
- `Q`: quick dash left with almost no chain delay
- `E`: quick dash right with almost no chain delay
- `W` / `Up`: run forward
- `S` / `Down`: brake; hold near a stop to reverse slowly
- `Space`: jump
- Hold `Space`: jump higher
- `Shift`: boost while spending gauge
- `M`: toggle stage BGM. Stage 2 uses `assets/audio/Salt_and_Steel.mp3`; other stages use `assets/audio/The_Final_Straightaway.mp3`.
- `R`: restart
- `1`: refill boost gauge for testing
- `TUTORIAL`, `STAGE 1`, `STAGE 2`, `STAGE 3` buttons: jump directly to a stage

Shards, dash pads, and obstacles are arranged around three lanes: left, center, and right. Shards restore 5 boost gauge each. Boost tops out at 300 displayed speed. Dash pads add exactly 100 displayed speed on top of the current speed, then fade back over 3 seconds. Total player speed is capped at 400. Hitting an obstacle knocks the character back and drops all currently held shards onto the track. The tutorial introduces movement, quick step, jump, dash pads, and boost before the main stages. Clearing Stage 1 unlocks Stage 2, and clearing Stage 2 unlocks Stage 3 with the current score carried over.

The HUD progress value shows the current position from stage start `0%` to the goal `100%`, which makes it easier to describe exact stage sections during iteration.
