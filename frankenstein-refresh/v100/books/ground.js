// Book · G Ground: what is underfoot. Each condition carries its friction (μ, foot on ground) and the sound a hoof makes on it. A tile's condition is read from the climate and the marsh (QBT). Edit here only.
BOOK("ground", {
 "G5": {"key":"grass","value":{"mu":0.35,"grip":0.7},"name":"dry grass; a boot's grip on dry ground","cite":["N104","N18","N173"],"law":["QBT","QR"]},
 "G6": {"key":"mud","value":{"mu":0.25,"grip":0.45},"name":"mud: wet ground or marsh; a boot's grip on it","cite":["N105","N18","N173"],"law":["QBT","QR"]},
 "G7": {"key":"snow","value":{"mu":0.14,"grip":0.3},"name":"snow cover; a boot's grip on packed snow","cite":["N106","N18","N173"],"law":["QBT","QR"]},
 "G8": {"key":"ice","value":{"mu":0.1,"grip":0.08,"cold":0.25,"at":20,"melt":0.048},"name":"ice that bears a walker; a boot's grip on it 0.08 at freezing, rising to cold at at °C under, melt above freezing (its film, Mid's 0.6 of 0.08)","cite":["N107","N18","N175"],"law":["QBT","QR"]},
 "G9": {"key":"step","value":{"person":0.2,"horse":0.25,"engine":0.3},"name":"the grip a step needs, by what steps: a man (Hanson), a horse and an engine's haulers (Mid's design)","cite":["N19","N173"],"law":["QR","QCB"]},
 "G10": {"key":"slip","value":{"studs":0.28,"soft":0.03,"stride":0.25,"secs":1.5,"every":1,"tell":20},"name":"slipping on ice: iron studs give at least studs; a slip's chance rises over soft as a step needs more grip than is offered; stride the most a step loses on ice; a slip holds a walker secs; each walker is checked every second; the town is told at most every tell seconds","cite":["N19","N174","N173"],"law":["QR","QCB"]}
});
