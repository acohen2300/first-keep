// Book · G Ground: what is underfoot. Each condition carries its friction (μ, foot on ground) and the sound a hoof makes on it. A tile's condition is read from the climate and the marsh (QBT). Edit here only.
BOOK("ground", {
 "G5": {"key":"grass","value":{"mu":0.35,"grip":0.7},"name":"dry grass; a boot's grip on dry ground","cite":["N104","N18","N173"],"law":["QBT","QR"]},
 "G6": {"key":"mud","value":{"mu":0.25,"grip":0.45},"name":"mud: wet ground or marsh; a boot's grip on it","cite":["N105","N18","N173"],"law":["QBT","QR"]},
 "G7": {"key":"snow","value":{"mu":0.14,"grip":0.3,"full":5,"covers":0.5},"name":"snow cover; a boot's grip on packed snow; full: the depth (mm of water on the ground) at which the ground is wholly snow for footing and the skin, covers: the depth from which the ground counts as snow (and wet ground as mud at the same share)","cite":["N106","N18","N173"],"law":["QBT","QR"]},
 "G8": {"key":"ice","value":{"mu":0.1,"grip":0.055,"cold":0.18,"at":20},"name":"ice that bears a walker; a boot's grip on it: melting ice grip at and above freezing, rising to hard ice's cold at at °C under","cite":["N107","N18","N178"],"law":["QBT","QR"]},
 "G9": {"key":"step","value":{"person":0.21,"horse":0.25,"engine":0.3},"name":"the friction a step needs, by what steps: a person's utilized friction (Burnfield & Powers), a horse and an engine's haulers (Mid's design, to open)","cite":["N179","N19","N173"],"law":["QR","QCB"]},
 "G10": {"key":"slip","value":{"studs":0.2,"secs":1.5,"every":1,"tell":20},"name":"slipping: iron studs give at least studs on ice; a slip holds a walker secs; each walker is checked every second; the town is told at most every tell seconds","cite":["N174","N179","N173"],"law":["QR","QCB"]}
});
