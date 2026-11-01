# Portfolio illustration prompts

## How to use

1. Use ChatGPT (image generation) or Gemini. Start a fresh chat.
2. Upload `assets/reference/dhanesh_reference.jpg`. It's the black-shirt photo with only you in it.
3. Run **Prompt 0 (character sheet)** first. Regenerate until the face really looks like you. That sheet becomes the anchor for every other image.
4. For every later prompt, upload **both** the reference photo and the character sheet you picked, then paste **the style block + the shot prompt** together.
5. Save each result into `assets/raw/` with the file name given in each prompt (for example `02_hero.png`).
6. If a result drifts from your face, reply in the same chat: "Keep everything, but make the face match the reference photo more closely: same jawline, same beard shape, same eyebrows, same eyes."

Ask for the **highest resolution** available and a **transparent background** where the prompt says so. ChatGPT supports transparent PNG. If Gemini can't do transparency, ask for a flat solid `#00B140` green background instead, and I'll remove it.

---

## STYLE BLOCK (paste this at the top of every prompt)

```
STYLE: Premium 2D motion-graphics explainer illustration, like a high-end animated science explainer film. Flat vector look built from clean geometric shapes with smooth curves. No black outlines; shapes are separated by color and value only. Soft cel shading with exactly 2–3 tones per color (base, shadow, highlight), shadows as crisp shapes, not gradients. One warm rim light from the upper right and a cool fill from the left. Very subtle fine film grain / paper noise texture over everything (about 3% opacity). Slightly stylized proportions: real adult proportions, head a little larger than realistic, NOT chibi, NOT anime, NOT 3D, NOT Pixar, NOT photoreal, NOT a photo filter.

PALETTE (stick to it): deep night navy #161A33, midnight blue #262C5A, warm coral #FF6B4A, sunflower yellow #FFC845, aqua teal #2EC4B6, soft cream #FFF4E0, plus natural skin tones. Skin: warm medium-brown with peachy highlights and cool plum shadows.

CHARACTER (must match the reference photo exactly): Indian man, mid-20s. Warm medium-brown skin. Thick, short, wavy jet-black hair, voluminous on top, swept up and slightly to his right with a few loose strands on the forehead, shorter on the sides. Full, neatly trimmed short black beard and mustache that connect, beard follows the jawline, slightly fuller on the chin. Thick dark straight eyebrows. Dark brown almond-shaped eyes with a slight smile crinkle. Straight nose, rounded tip. Warm, confident, slightly mischievous smile. Small white vibhuti mark with a tiny orange dot in the center of the forehead. Thin gold chain at the neck.

OUTFIT (same in every image): black textured overshirt worn open over a plain cream t-shirt, sleeves rolled to the forearm, dark charcoal slim trousers, white low-top sneakers, black backpack strap visible only where noted. Clean, modern, relaxed.

RENDER: Crisp edges, generous negative space, centered composition with room to animate. No text, no logos, no watermarks, no extra people.
```

---

## Prompt 0 · Character sheet (do this first) · `00_sheet.png`

```
[STYLE BLOCK]

Create a CHARACTER MODEL SHEET of this man for an animation studio. Use the uploaded photo as the exact face reference.

Layout on a plain cream #FFF4E0 background, evenly spaced, same scale, full body, neutral standing pose with arms relaxed:
1) front view, 2) three-quarter view facing left, 3) side profile facing left, 4) back view.
Below them, a row of 6 head close-ups with different expressions: big genuine smile, focused/serious, surprised with raised eyebrows, laughing with eyes closed, thinking with a hand on chin, playful wink.
Keep his face, hair, beard, skin tone, outfit and colors 100% consistent across every drawing. Landscape 16:9, highest resolution.
```

---

## Prompt 1 · Hero portrait · `01_hero.png` · transparent background

```
[STYLE BLOCK]

POSE: Three-quarter view, body angled slightly to the left, face turned toward the viewer. Arms loosely crossed, weight on his back leg, shoulders relaxed. Framed from mid-thigh up.
EMOTION: Quietly confident and warm, a small closed-mouth smile with one corner slightly higher, eyebrows relaxed, eyes looking straight into the camera like he's about to tell you something good.
LIGHT: Warm coral rim light along the right edge of his hair, shoulder and beard; cool teal fill on the left side of the face.
DETAILS: Overshirt fabric shows a subtle woven texture drawn as tiny flat diamonds. Gold chain catches one bright yellow highlight.
BACKGROUND: Fully transparent PNG, no shadow on the ground.
Portrait 4:5, highest resolution.
```

---

## Prompt 2 · Waving hello · `02_wave.png` · transparent background

```
[STYLE BLOCK]

POSE: Facing the viewer, standing, right hand raised high in a friendly wave with fingers spread, left hand holding the strap of a black backpack on his shoulder. Slight lean forward, head tilted a little to his left. Full body.
EMOTION: Big, open, genuine smile showing teeth, eyes slightly squinted from smiling, eyebrows lifted. Feels like he just spotted a friend.
MOTION HINT: Two short curved motion arcs beside the waving hand, drawn as flat cream shapes.
BACKGROUND: Fully transparent PNG.
Portrait 3:4, highest resolution.
```

---

## Prompt 3 · Building at the laptop · `03_build.png` · transparent background

```
[STYLE BLOCK]

POSE: Sitting cross-legged on the floor, a slim laptop open on his lap, both hands on the keyboard, shoulders slightly forward, head tilted down toward the screen. Seen from a three-quarter front angle.
EMOTION: Deep focus with a hint of excitement: eyebrows slightly drawn together, lips pressed in a tiny determined smile, as if the code just worked.
LIGHT: The laptop screen casts a soft aqua-teal glow up onto his face, beard and hands (flat shapes of teal light, not gradients). Warm coral rim light on his hair from behind.
DETAILS: Floating around him, small flat geometric icons drifting upward: a curly-brace symbol, a speech bubble, a lightning bolt, a small database cylinder, a gear. Simple shapes in yellow, coral and teal.
BACKGROUND: Fully transparent PNG.
Square 1:1, highest resolution.
```

---

## Prompt 4 · Talking to an AI (voice) · `04_voice.png` · transparent background

```
[STYLE BLOCK]

POSE: Standing, three-quarter view facing right. Holding a smartphone up near his chin in his left hand, screen facing the viewer. His right hand is raised mid-gesture with the palm open, like he's cutting in to correct something.
EMOTION: Animated and mid-sentence: mouth open in a cheerful talking shape, eyebrows raised, eyes bright. Playful "wait, actually—" energy.
DETAILS: From the phone, three concentric flat sound-wave arcs in aqua teal radiate outward. A small rounded speech bubble in cream floats near his mouth (empty, no text). The phone screen shows a simple glowing round orb in coral and yellow.
BACKGROUND: Fully transparent PNG.
Portrait 4:5, highest resolution.
```

---

## Prompt 5 · Presenting a project · `05_present.png` · transparent background

```
[STYLE BLOCK]

POSE: Standing facing the viewer, body turned 20° to his left, right arm extended out to the side with an open palm, presenting something off-frame to the right of the image (like a host presenting a screen). Left hand casually in his trouser pocket. Full body.
EMOTION: Proud and excited: eyebrows raised, wide smile, eyes looking toward where his hand points, as if saying "look at this".
COMPOSITION: Character placed in the LEFT third of the canvas, the right two-thirds left completely empty for the project demo.
BACKGROUND: Fully transparent PNG.
Landscape 16:9, highest resolution.
```

---

## Prompt 6 · Drawing the future (films) · `06_draw.png` · transparent background

```
[STYLE BLOCK]

POSE: Three-quarter view facing left. He holds a slim glowing stylus in his right hand and is drawing in the air in a big sweeping arc. His left hand is raised slightly behind it for balance. Body leaning into the gesture, one foot forward.
EMOTION: Joyful creative flow: soft smile, eyes following the line he is drawing, eyebrows relaxed and slightly lifted.
DETAILS: The stylus leaves a thick, smooth line in sunflower yellow that loops through the air and turns into simple flat shapes as it goes: a small planet with a ring, a leaf, a lightning bolt, an arrow. Tiny sparkle shapes along the line.
BACKGROUND: Fully transparent PNG.
Landscape 3:2, highest resolution.
```

---

## Prompt 7 · Shipping it · `07_ship.png` · transparent background

```
[STYLE BLOCK]

POSE: Running mid-stride toward the right of the frame, dynamic diagonal body line, front knee up, backpack bouncing. He carries a small cardboard box under his left arm with a coral rocket icon on it (no text). Right arm swinging forward.
EMOTION: Thrilled and determined, wide grin, eyes focused ahead, hair flowing back from the speed.
MOTION: Flat speed lines in cream and teal trailing behind him, and two small dust puffs under the back foot.
BACKGROUND: Fully transparent PNG.
Landscape 16:9, highest resolution.
```

---

## Prompt 8 · Chilling / contact · `08_chill.png` · transparent background

```
[STYLE BLOCK]

POSE: Sitting relaxed on a simple tall stool, leaning back slightly, one foot on the stool rung and the other on the floor. Holding a coral coffee mug with both hands at chest height, a little curl of steam rising. Facing the viewer, head tilted a little.
EMOTION: Calm, satisfied, friendly, soft smile with eyes slightly narrowed, like he's happy to chat.
BACKGROUND: Fully transparent PNG.
Portrait 4:5, highest resolution.
```

---

## Prompt 9 · Expression heads for small reactions · `09_heads.png` · transparent background

```
[STYLE BLOCK]

Draw 8 separate head-and-shoulders busts of the same man, arranged in a 4×2 grid, same size and same angle (three-quarter facing left), evenly spaced with clear empty space between them:
1) neutral friendly smile, 2) laughing with eyes closed, 3) surprised "oh!" with round mouth and raised eyebrows, 4) playful wink with a smirk, 5) thinking, eyes looking up, mouth to one side, 6) focused and serious, 7) proud, chin slightly up, closed smile, 8) blinking (eyes fully closed, neutral mouth).
Keep the face, hair and beard identical in all 8, only the expression changes.
BACKGROUND: Fully transparent PNG.
Landscape 2:1, highest resolution.
```

---

## Background plates (no character)

Use the same STYLE BLOCK but **delete the CHARACTER and OUTFIT paragraphs**.

### Plate A · Night city · `10_bg_city.png`

```
[STYLE BLOCK without CHARACTER and OUTFIT]

A wide horizontal background plate for an animated explainer. Night sky in deep navy #161A33 fading to midnight blue #262C5A near the horizon, scattered small stars as tiny cream dots and a few four-point sparkles. A big soft crescent moon in cream at the upper left. Along the bottom, a flat layered skyline of a modern Indian tech city (Bengaluru): three depth layers of buildings in progressively lighter blues, a few lit windows as small yellow rectangles, one tall tower with a blinking coral light on top, some rounded tree canopies in teal between buildings. Lots of empty sky in the upper two-thirds. No people, no text.
Ultra-wide 21:9, highest resolution.
```

### Plate B · Workspace · `11_bg_desk.png`

```
[STYLE BLOCK without CHARACTER and OUTFIT]

A cozy flat-illustrated workspace scene at night, viewed straight on: a wooden desk in warm brown, a large monitor glowing aqua teal with abstract code lines (just colored bars, no readable text), a small potted plant, a coral coffee mug, a desk lamp casting a warm yellow cone of light, a cork board with a few colorful sticky notes and pinned sketches, a window behind showing the navy night sky with stars. Leave a clear empty space in front of the desk where a standing person can be placed later. No people, no text.
Landscape 16:9, highest resolution.
```

### Plate C · Space / ideas · `12_bg_space.png`

```
[STYLE BLOCK without CHARACTER and OUTFIT]

An abstract "space of ideas" background: deep navy void with soft concentric orbit rings in midnight blue, three small flat planets (one coral with a ring, one teal, one yellow), floating geometric shapes (triangles, circles, small cubes) at different sizes for parallax, tiny sparkle stars. Centered empty area for content. No people, no text.
Landscape 16:9, highest resolution.
```

---

## Hand-off

When you're done, drop everything into `/Users/dhanesh/Desktop/dhanesh-portfolio/assets/raw/` with the file names above. You don't need all 13 to start. The minimum set is **00, 01, 02, 05 and 10**. I'll cut them out if needed, split the expression heads into separate files, and animate them in the motion-graphics mockup.
