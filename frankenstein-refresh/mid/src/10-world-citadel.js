// ═════ 10-world-citadel.js: the Throne, its ring, the island and the causeways ═════
// The Throne: a walled citadel on the great lake's island, four gates at the four causeways, a tower at each corner of the ring, the one
// shrine in the Throne itself, the Natives' garrison in its yard. A base rule (Build 70): the Throne stands at the middle, the same distance
// from every Town Center (CORNER in 01); everything of the citadel is the same seen from every corner (Albert, Nov 1: four towers, the
// shrine on the Throne's square; tests/map.py turns each piece a quarter round the Throne and looks for its twin).
function makeCitadel() {
	const c = LMID / NAVC,
		E = THRONE.r / NAVC - 0.5, // the ring's squares, in squares from the middle: their centres at ±0.5 to ±E, the same on every side
		put = (kind, x, y) => {
			const b = mkBld(WILD, kind, x, y, 1);
			b.citadel = true;
			G.blds.push(b);
			return b;
		};
	const T = put('throne', LMID, LMID);
	for (const [sx, sy] of [
		[-1, -1],
		[1, -1],
		[1, 1],
		[-1, 1],
	])
		put('tower', LMID + sx * (THRONE.r - NAVC), LMID + sy * (THRONE.r - NAVC)); // a tower on each corner of the ring, its two squares by the corner its own
	for (let i = -E; i <= E; i++)
		for (let j = -E; j <= E; j++) {
			if (Math.max(Math.abs(i), Math.abs(j)) !== E || Math.min(Math.abs(i), Math.abs(j)) >= E - 1) continue; // the ring, but not under a tower
			put(Math.min(Math.abs(i), Math.abs(j)) === 0.5 ? 'gate' : 'wall', (c + i) * NAVC, (c + j) * NAVC); // a gate: the two middle squares of a side
		} // symmetric about the Throne (QC 05 N1: it was laid on squares about LMID + 5, so two gates stood 10 nearer the Throne than the others)
	addFind('shrine', LMID, LMID); // in the Throne: taken by a priest at its foot (FINDS.shrine.r)
	for (let i = 0; i < NATIVE.garrison; i++) natSpawn(T, i % 3 === 2 ? 'nativebow' : 'native');
	G.throne = null;
	G.prisoners = [];
	natState();
	layTraps();
}
