# What Happened, Builds 63 to 70 - v80 - Post Clean - Working
*Made Oct 31, 2026, for whoever opens this repo next: read this before anything else. Changed only with Albert's word.*

## In one paragraph
On Oct 30, Builds 63 to 66 were built in one long chat whose context had drifted and been compressed. Changes Albert had not clearly agreed to went in, and the decisions behind them were lost. By the afternoon the preview (Build 65) had no way to open the Build menu, the live site still showed a build from Oct 28, and there was no marked baseline to go back to. That evening and through the night, a new chat traced what went wrong, restored what worked, wrote down every rule and drawing, and rebuilt the game as Build 70, "Restoration": four parts, three previews, every change agreed first. Everything after that is v80.

## Timeline
| When | What |
|---|---|
| Oct 30, 08:46 | **Build 62** published: the last build Albert was happy with. The hammer under People opens the classic Build menu. |
| Oct 30, 11:59 | **Build 63**: the one row (six slots, five pages), the map tap, one population, cards that hold still. Mostly good. |
| Oct 30, 13:53–14:54 | **Build 64**, four publishes: **the door replaced the hammer under People** (a dashboard of five "domains"), then "one ring, no fills", then the Realm as a page of the row. The door was never clearly agreed. |
| Oct 30, 15:47 | **Build 65**: the audit's three bugs as rules, a cleanup of 64. On the preview **you could no longer get to the Build menu**, so nothing could be built. |
| Oct 30, 16:25–18:13 | **Build 66**: work in progress (SoRen's palette test, named timings, the exceptions list). **Never published.** |
| Oct 30, evening | A new chat. Albert: "That brain is heavy with drift and compacted context and has been missing a lot." The computers' stalling was diagnosed and a fair fix tested (parked). The live link turned out to be the Oct 28 build. Albert and Claude went through every change from 63 to 66 and voted on each one (the Build 70 ballot). |
| Oct 30, 21:17 | **Build 70 mockup** on the preview: 62's controls back on top of 66 (the hammer under People), the door and the Realm page cut. |
| Oct 30, night to Oct 31, 06:35 | **Mockup mode.** The grid (the Formation), the title bar, the six colours, the states, every card drawn as pictures before any code. The lost build rules were found and locked (RULES.md §0). Build 70 agreed: "Yes. Go go." |
| Oct 31, 08:09 | **Preview 1**: the foundation (the grid, colours, states, title bar, back) and the map rules. |
| Oct 31, 08:20 | **The v70 line.** Albert: "Everything agreed on, from the time you read this, is v70. Anything that isn't yet agreed on will move to 80." |
| Oct 31, 09:44 | **Preview 2**: the row (Jobs, War, Train), the rings, words under the icons, the squad card. |
| Oct 31, 10:19 | **Preview 3**: the quick action, Emergency with four. Albert: "It plays clean. It feels tight." |
| Oct 31, 10:39 | v70 to be frozen as **"v70 · Restoration"** at its own link; everything open rolls to v80. |

## What went wrong, and why
1. **Changes shipped without a clear yes.** The door took the hammer's place and with it the only way to build. Nobody asked Albert first.
2. **One chat ran too long.** Its context drifted and was compressed, decisions were lost (the notebook's details among them), and new work was built on old misunderstandings.
3. **No baselines.** Nothing marked "the build that worked", so it took hours to find where things went wrong. The live site had quietly stayed on an older build.
4. **Patches on patches.** Guards like `if (!el) return` hid removed parts instead of deleting them, against Albert's own rules ("Never fix on fix or patches").
5. **Decisions lived in chat, not in documents.** Layouts and rules existed only in a conversation that later got compressed.

## What was put in place
- **The Build Rules are locked** in Albert's own words (RULES.md §0): no patches, cut what is dead, one home for everything, lean and honest.
- **A list first, then a double yes.** Nothing is built until Albert has seen the change and said yes twice.
- **Pictures before code.** Every screen is drawn and agreed as a mockup first.
- **The drawings are written down:** the menu spec, the colour index, the cuts log, each builder's notes. Nothing important lives only in chat.
- **Every build is stamped** (a git tag): v60 to v66 marked Oct 31 (v66 never published), and v70 as "Restoration". Any of them can be reopened exactly.
- **v70 gets its own frozen link** (`/v70-restoration/`). The preview link moves on to v80.
- **Builders work in separate copies**, each leaving notes and a cuts draft, and nothing joins the main copy until it passes the full set of checks.
- **Sessions are named** ("DOC - v80 - Post Clean - Working"), so a later reader knows which session a document came from.

## Where to start (v80)
1. This file.
2. The v80 documents (named "- v80 - Post Clean - Working"): the build list (every open item), the rules, the drawings and the control sheet, the type, the colours.
3. The v70 documents and pictures are the record of the Restoration. Read them, but do not edit them: v70 is closed.
