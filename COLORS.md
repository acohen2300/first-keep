# Colour Index - v70 - Clean Up Session
*Made in v70 - Clean Up Session, Oct 30–31, 2026. Changed only with Albert's word: a later session edits this file and its title, and does not start a copy.*
Every colour the game uses has one name and one home: the style sheet's `:root` (`src/shell-head.html`), under the names below. Nothing on screen uses a colour that is not on this page. Plain names, by family, dark to light.

## The materials (locked in v70, Albert, Oct 30)
| Name | Token | Colour | Used for |
|---|---|---|---|
| Brown 1 | `--brown-1` | #2a1d13 | card background |
| Brown 2 | `--brown-2` | #33241a | slot fill |
| Brown 3 | `--brown-3` | #6b5230 | slot edge |
| Cream 1 | `--cream-1` | #ece5d3 | icons, words |
| Cream 2 | `--cream-2` | #c9bca2 | subtitles, labels, quiet text |
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
| Blue | `--ring-b` | #6aaeff | ready, can do |
| Green | `--ring-g` | #5fd08a | working: the ring that recedes as the time runs out |
| Red | `--ring-r` | #ff6b5b | danger, wrong |
| White | `--ring-w` | #e9ecef | all is well |
| Gold fill | `--fill-1`, `--fill-2` | #f2d27a → #b8862e | the card's one main action |
| Gold ink | `--ink` | #2a1c10 | words on the gold fill |

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
