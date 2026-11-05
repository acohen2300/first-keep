// Book · G Ground: what is underfoot. Each condition carries its friction (μ, foot on ground) and the sound a hoof makes on it. A tile's condition is read from the climate and the marsh (QBT). Edit here only.
BOOK("ground", {
 "G5": {"key":"grass","value":{"mu":0.35},"name":"dry grass","cite":["N104"],"law":["QBT"]},
 "G6": {"key":"mud","value":{"mu":0.25},"name":"mud: wet ground or marsh","cite":["N105"],"law":["QBT"]},
 "G7": {"key":"snow","value":{"mu":0.14},"name":"snow cover","cite":["N106","N18"],"law":["QBT"]},
 "G8": {"key":"ice","value":{"mu":0.1},"name":"ice that bears a walker","cite":["N107","N18"],"law":["QBT"]}
});
