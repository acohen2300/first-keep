# Colour Index - v70 - Clean Up Session
*Made in v70 - Clean Up Session, Oct 30–31, 2026. Changed only with Albert's word: a later session edits this file and its title, and does not start a copy.*
Every colour the game uses has one name and one home: the style sheet's `:root` (`src/shell-head.html`), under the names below. Nothing on screen uses a colour that is not on this page. Plain names, by family, dark to light.

## The materials (locked in v70, Albert, Oct 30)
| Name | Token | Colour | Used for |
|---|---|---|---|
| Brown 1 | `--brown-1` | #2a1d13 | card background |
| Brown 2 | `--brown-2` | #33241a | slot fill |
| Brown 3 | `--brown-3` | #6b5230 | slot edge |
| Gold 1 | `--gold-1` | #e6b947 | titles, the chosen ring, the tab folder |

## The War and Train pages (Albert's ballot, V1: steel)
| Name | Token | Colour | Used for |
|---|---|---|---|
| Steel 1 | `--steel-1` | #1e2329 | the page behind the row |
| Steel 2 | `--steel-2` | #2a3038 | slot fill |
| Steel 3 | `--steel-3` | #4d5a68 | slot edge |

## The colour code (kept from Build 64; the meaning is in `RULES.md`)
| Name | Token | Colour | Means |
|---|---|---|---|
| Blue | `--ring-b` | #6aaeff | available, act on it now (as RULES.md) | [2026-11-02 12:40]
| Green | `--ring-g` | #5fd08a | active, on, or done right; working is its ring that recedes as the time runs out (as RULES.md) | [2026-11-02 12:40]
| Red | `--ring-r` | #ff6b5b | danger, wrong |
| White | `--ring-w` | #ece5d3 | every word and icon; all is well (Cream 1 and the old White, one colour since Nov 2) | [2026-11-02 12:40]
| Gold fill | `--fill-1`, `--fill-2` | #f2d27a → #b8862e | the card's one main action |
| Gold ink | `--ink` | #2a1c10 | words on the gold fill |

## The levels (Albert, Nov 2: every colour is a hue at a level) [2026-11-02 12:40]
A colour is a hue (the white, blue, green, red, gold above) at one of three levels: **full**, **dim**, **faint**. Dim and faint are two numbers, set once in `:root`; a level is the hue blended into whatever it sits on (so a dim word on steel takes the steel). The materials keep their own three steps (1 page, 2 fill, 3 edge). [2026-11-02 12:40]
| Level | Token | Strength | Used for | [2026-11-02 12:40]
|---|---|---|---|---|
| Full | the hue's own | 100% | live words and icons, the rings | [2026-11-02 12:40]
| Dim | `--dim` (`--white-dim`) | 80% | quiet words, a dim button's words, sound off (was Cream 2) | [2026-11-02 12:40]
| Faint | `--faint` (`--white-faint`) | 35% | a dim tech's edge, the minimap's edge, the blue glow | [2026-11-02 12:40]
- **A dim button** drops its fill one step (Brown 1) and keeps its edge (Brown 3), so it never looks like an empty place (Brown 1, Brown 2 edge); its words are dim white. A dim tech's edge is faint white, so tech and Train never look alike; blue stays for the one you can press. [2026-11-02 12:40]

## The ages (a tech's top edge; one home since Nov 2) [2026-11-02 12:40]
| Name | Token | Colour | Used for | [2026-11-02 12:40]
|---|---|---|---|---|
| Stone | `--age-0` | #9a9890 | the age's edge | [2026-11-02 12:40]
| Bronze | `--age-1` | #b5793a | the age's edge | [2026-11-02 12:40]
| Iron | `--age-2` | #c9c2a6 | the age's edge | [2026-11-02 12:40]
| Medieval | `--age-3` | #4d6b9e | the age's edge | [2026-11-02 12:40]
| Gunpowder | `--age-4` | #8e2f2a | the age's edge | [2026-11-02 12:40]

## The resources (Albert, Oct 31: named here; their one home is `RESOURCES` in `src/01-rules-basics.js`, which the map and the icons read)
| Name | Colour | Used for |
|---|---|---|
| Food | #e0708a | its icon, its finds |
| Wood | #c08a58 | its icon, its finds |
| Stone | #b4bbc0 | its icon, its finds |
| Gold | #f2cf55 | its icon, its finds |
| Iron | #8fa3b5 | its icon, its finds |

## Not in the index (EXCEPTIONS.md #11; Albert, Oct 31: yes)
The map's own paint: the land, the art, the players' colours, the shadows.

## Retired (Build 70)
`--panel`, `--panel2` (it was defined twice: #2b1f15, then #33241a), `--line`, `--bone`, `--mute`, `--lamp` and `--gold` (one colour under two names) are renamed to the names above.
`--cream-1` (now the one white, ring-w) and `--cream-2` (now the white at the dim level, white-dim) are retired, Nov 2. [2026-11-02 12:40]
