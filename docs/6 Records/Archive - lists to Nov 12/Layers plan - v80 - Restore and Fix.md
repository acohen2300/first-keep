# The map in layers: the plan (Nov 4, 2026; Albert, 09:27: "re layer the game. And start ground up with the elements ... then lock those down as the layers of the game board. I'm hoping that doing it this way can save code") [2026-11-04 10:10]

For Albert to read tonight. Nothing is built until his yes yes. [2026-11-04 10:10]

## 1. What is true now [2026-11-04 10:10]

- The idea is already half there: Build 63 wrote five layers at the top of the map-maker (`10-world.js` 526: home, ground, wild, movables, weather). The code does not follow its own note: each element is laid in `10-world`, turned into blocked squares in `09-nav`, and painted in `21-view-frame` / `23` / `24` / `25`, each with its own copy of the shape. [2026-11-04 10:10]
- **Code saved, measured (a read of every line, not a guess): about 63 lines, 55 to 70.** I said 15 to 20% this morning; it is under 3% of those 2,200 lines. Corrected. The gain is not size; it is that each element has one shape, and the copies stop disagreeing. [2026-11-04 10:10]
- **A live bug, found by this read and confirmed:** the map-maker keeps things out of lakes as if lakes were circles (`loc` keeps only `r`, 10:565, and adds 25 to 45), but a lake's real shore has bays out to 1.3 × its radius. Over 20 seeds, **20 trees were laid in the water** and 21 more within 8 of it. One shore, one home, fixes it. [2026-11-04 10:10]

## 2. The copies that disagree (the reason to do this) [2026-11-04 10:10]

1. A lake's shore is traced three times: `lakeHarm` (72 points), `shorePath` for the painting (72), `drawFlood` (48). [2026-11-04 10:10]
2. How far a shore reaches: three different formulas (09:39, 21:78, 21:97). [2026-11-04 10:10]
3. The flood's rise is added in three places (09:24, 09:27, 24:426). [2026-11-04 10:10]
4. Laying treats lakes as circles, blocking uses the true shore: the bug above. [2026-11-04 10:10]
5. The great lake's margin is five different numbers (+0, +25, +40, +45, + WATER.clear). [2026-11-04 10:10]
6. Rivers: the map-maker knows each stretch and its fords; the painting guesses them back from distances (21:49, 21:113). [2026-11-04 10:10]
7. The Throne's island and causeways are one width and length on the grid and another in the painting. [2026-11-04 10:10]
8. Trade routes: a straight band for the forest, a curve for the road. [2026-11-04 10:10]
9. A tree's size: five rules (3 × 3 squares, a radius of 15, a 17 × 12 ellipse, a formula twice) and two separate "dense forest" counts. [2026-11-04 10:10]
10. The corner's quarter is worked out three times; nodes are clustered three ways. [2026-11-04 10:10]

## 3. The layers, as Albert ordered them [2026-11-04 10:10]

Each layer is one module with three parts: **lay** (where it goes, once, from the seed), **block** (which walking squares it fills), **paint** (the ground picture, the small map, the frame). A layer reads only the layers below it. Once it passes the map tests on 100 seeds, it is locked. [2026-11-04 10:10]

| # | Layer | Holds | Reads | Blocks | Paints | [2026-11-04 10:10]
|---|---|---|---|---|---| [2026-11-04 10:10]
| 1 | Ground | the land's square, its character (Fertile, Timber...), the edge, the sea and cliffs beyond, the turn into the world | nothing | off the land (`NAV.off`) | grass, blots, strand, rim | [2026-11-04 10:10]
| 2 | Water | the great lake, the lakes, the rivers and their fords, the fish | ground | the true shore, one function, flood included | shore, sand, water, ripples, flood | [2026-11-04 10:10]
| 3 | Forest | the trees and the paths through them | ground, water, and the **claims** of 4 and 5 (below) | 3 × 3 a tree, one size rule | floor, the forest picture, trees, shadows, sight | [2026-11-04 10:10]
| 4 | Plots | the home zones, bushes, stone, gold, iron, lodes, the land's richness, fields | ground, water | nothing (fields as buildings) | nodes | [2026-11-04 10:10]
| 5 | Movers | game, boar, chest, ruins, den, cemetery, vagabonds, the robbers' camps | ground, water, plots | nothing | finds, units | [2026-11-04 10:10]
| — | Citadel and routes | the Throne, its ring, the island, the causeways, the two routes and their stops | ground, water | the island and causeways, one shape | the island, the roads | [2026-11-04 10:10]

## 4. The one weakness in the order, and its fix [2026-11-04 10:10]

The forest (3) must keep clear of the plots (4) and the movers (5), which come after it. Today the code rolls the plots' spots first for exactly that reason. The fix keeps Albert's order: **layers 4 and 5 make their claims first** (a claim is a spot and a radius, nothing laid), the forest reads the claims, then 4 and 5 lay their things in their claimed spots. A claim is the only thing a lower layer may read from a higher one. Precedent: Age of Empires II's random-map scripts reserve player lands before the forests grow, then place objects in them. [2026-11-04 10:10]

Home zones (today's layer 1, the fairness rule) become the first claims of layer 4: they are plots. [2026-11-04 10:10]

## 5. What it does not change [2026-11-04 10:10]

The rules: every distance, ring, zone and count stays as it is, and the fingerprint must match **except where a copy was wrong** (the trees in the water, the island's width). Those are listed and accepted by name, so nothing changes by accident. [2026-11-04 10:10]

## 6. The work, in order (one preview, about a session) [2026-11-04 10:10]

1. One shore: `shoreAt(L, a)` and `wetAt(x, y)` the only shape of water, flood included; the grid, the painting, the flood and the map-maker read them. (Fixes the bug.) [2026-11-04 10:10]
2. One taken list: every keep-out (lakes, the great lake, claims, routes) in one place the map-maker reads; the five margins become one named table. [2026-11-04 10:10]
3. Rivers carry their stretches and fords to the painting; the guessing goes. [2026-11-04 10:10]
4. One tree rule (size, the 3 × 3, the dense count) in one home. [2026-11-04 10:10]
5. One cluster placer; one corner's quarter. [2026-11-04 10:10]
6. The island, causeways and routes: one shape each, read by the grid and the painting. [2026-11-04 10:10]
7. The files laid out by layer (`10-world` split into a file a layer, so each is read and locked alone). [2026-11-04 10:10]
8. The map tests on 100 seeds, the gate, the fingerprint with the named exceptions; the locks written in `docs/3 Locks`. [2026-11-04 10:10]

## 7. Albert's decision [2026-11-04 10:10]

Yes yes to all of 6, or name what is out. The honest pitch: it will not make the game smaller in any way you'd notice; it will make the map's five pieces each true in one place, fix a bug that has trees in lakes, and let us lock the board. [2026-11-04 10:10]
