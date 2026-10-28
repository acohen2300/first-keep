// ═════ 07-text.js: every line of wording the game says ═════
// ───────────────────────── Why it is so: the history behind each row ─────────────────────────
// Dates are "about" unless exact; where historians disagree the text says so. Each line credits more than one place where the record allows.
const WHY = {
	age0: 'Farming villages of the Neolithic (from about 10,000 years ago): fields, houses, a wall. Jericho had a stone wall and tower about 8000 BC.',
	age1: 'Bronze (from about 3300 BC in the Near East): the first cities, writing, law, chariots and standing armies, in Sumer, Egypt, the Indus valley and China.',
	age2: 'Classical antiquity (about 500 BC to AD 500): iron weapons, legions and phalanxes, libraries, roads and aqueducts, from Rome and Persia to Maurya India and Han China.',
	age3: 'The Middle Ages (about AD 500 to 1500): castles, knights, crossbows and longbows, universities, and the heavy plough.',
	age4: 'Gunpowder (about AD 1400 to 1600): matchlock guns and cannon. Great bombards broke the walls of Constantinople in 1453; Italian engineers answered with low angled star forts, and walls stopped being the end of a siege.',
	arquebus:
		'The matchlock arquebus (late 15th century) let a few weeks of drill make a soldier. Spanish arquebusiers won at Cerignola in 1503, and pike-and-shot formations ruled the next century.',
	bombard:
		'Bombards such as Mons Meg (1449) and the Ottoman guns at Constantinople (1453) fired stone balls of hundreds of pounds: slow, but nothing built before them stood long.',
	// every research step, in the book: the date and what it changed
	hafting: 'A stone head bound to a handle: the Neolithic axe cleared the forests of Europe field by field.',
	axes: 'Cast bronze held an edge that stone could not; a bronze axe felled an oak in a morning.',
	ironaxe: 'Iron was cheap where bronze was dear; every household could own an axe, and the woods went back.',
	sawpits: 'Two men over a pit, one above and one below, sawed planks for two thousand years before machines did.',
	twosaw: 'The two-man crosscut saw, teeth set and filed, felled trees far faster than the axe.',
	sawmill:
		'Water-driven sawmills cut timber in Roman Hierapolis and spread through Europe by 1500; the stream does the pulling.',
	coppice:
		'Cut a hazel to the stump and it throws up poles; the Sweet Track in Somerset, 3800 BC, was built of coppiced wood.',
	pollard: 'Cut above the browse line and the deer cannot eat the regrowth; pollards stand for centuries.',
	forestry: 'Norman forest law and the German Forstordnungen managed woods as a crop; cut by rule, not by need.',
	plantation:
		'Navies planted oak by the thousand; the Colbert ordinance of 1669 sowed the forests of France for ships a century off.',
	timber:
		'Jointed frames of oak carried the weight; the walls between were only wattle, and a house could grow a storey.',
	charcoal: 'Smelting iron took charcoal, not wood; a charcoal clamp burned for a week, watched day and night.',
	carts: 'The pivoting front axle let a four-wheeled wagon turn; a wagon carried what six pack animals had.',
	logdrive:
		'Rivers floated timber to the mills in spring; the Black Forest sent rafts to Holland a thousand logs long.',
	sickles: 'Flint blades set in bone cut the first sown grain at Jericho and Abu Hureyra.',
	threshing:
		'A board set with flints, dragged over the sheaves by an ox; the tribulum separated grain in hours, not days.',
	plough:
		'The ard, pulled by oxen, turned one farmer into the feeder of many; it is on Mesopotamian seals from 3000 BC.',
	noria: 'The noria lifted river water into the fields of Syria and Egypt; the wheels at Hama still turn.',
	horsecollar:
		'The padded collar let a horse pull with its shoulders, not its throat; a horse ploughed half again as much as an ox.',
	heavyplough:
		'The mouldboard plough cut the heavy clays of northern Europe that the ard only scratched; the population doubled after it.',
	windmill:
		'Post mills ground grain across the flat lands of Flanders and England from the 1180s; wind milled what oxen once did.',
	seeddrill:
		'The drill of Jethro Tull sowed in rows at an even depth; a third of the seed had been lost to birds and wind.',
	seedstore:
		'Saving the fattest grain for next year made wheat from grass; ten thousand years of it is the crop we eat.',
	manure: 'Dung on the field was known to Homer; Roman writers rank which animal gives the best.',
	irrigation: 'Mesopotamian canals watered fields the rain could not; irrigated soil tires less and recovers sooner.',
	rotation:
		'Three fields, one fallow, one winter grain, one spring: the Carolingian rotation fed the villages that became towns.',
	enclosure:
		'Hedged fields replaced the open strips; a farmer who owned his ground drained it, marled it and worked it harder.',
	potato:
		'The potato and maize crossed the Atlantic after 1500; an acre of potatoes fed three times what an acre of wheat did.',
	ovens: 'Egypt had bakeries in the Bronze age; bread turned the same harvest into more meals than porridge did.',
	granary:
		'Raised stone granaries kept the rats and damp from the grain; a town with full granaries outlasts a siege and a bad year.',
	wheelbarrow: 'The one-wheeled barrow, Chinese by 100 AD and European by 1200, let one man move what two had carried.',
	picks: 'Grimes Graves in Norfolk was dug with red-deer antlers to reach the flint; the pits go down ten metres.',
	firesetting:
		'A fire against the rock face, then cold water: the stone cracks. Miners used it from the Alps to Laurion.',
	deep: 'The silver mines of Laurion went a hundred metres down on timbered shafts; they paid for the Athenian fleet.',
	pumps: 'Agricola drew the rag-and-chain pumps that drained the mines of Saxony; a dry pit is a deeper pit.',
	rails: 'Wooden rails and the Hund, a guided wagon, ran in Alpine mines by 1550; the first railways carried ore.',
	blasting: 'Gunpowder first broke rock at Banská Štiavnica in 1627; one charge did a day of hammering.',
	masonry: 'Dressed stone laid in courses: the pyramids of Giza stand because the blocks were squared to fit.',
	brick: 'Kiln-fired brick does not melt in the rain as mud brick does; Rome built six storeys of it.',
	ventilation:
		'Bellows and air shafts let miners work deep galleries without choking; Agricola gives a chapter to them.',
	wedges:
		'Iron wedges split stone along its grain; quarrymen have used them since Egypt cut granite at Aswan with dolerite.',
	chisels: 'Hardened chisels dressed ashlar for the cathedrals; the marks of the masons are still on the blocks.',
	stonesaw:
		'Water-driven saws cut marble at Hierapolis in the 200s and again in Renaissance Italy; sand under the blade did the cutting.',
	rollers: 'Stone moved on sledges over wetted sand and rollers; a tomb painting shows 172 men pulling a colossus.',
	cranes:
		'Two men walking inside a wheel lifted a ton of stone; the cranes of Gothic cathedrals still stand in some towers.',
	fishtraps:
		'Weirs and wicker traps caught fish while the fisher slept; they are found along rivers on every continent.',
	nets: 'The oldest net, from Karelia, is 10,000 years old: a net takes the shoal where a line takes the fish.',
	salting: 'Salt cod and herring fed Europe through Lent and winter; salted fish keeps for months.',
	deepboats:
		'Decked boats with keels fished the banks that skiffs dared not; the Dutch herring buss stayed out for weeks.',
	trawl: 'The wondyrchoun, a beam trawl, was complained of to Parliament in 1376 for taking too much; it worked.',
	dugouts: 'The Pesse canoe, hollowed from a pine, is the oldest boat found; it is ten thousand years old.',
	sails: 'A square sail on the Nile, 3000 BC: the wind did the rowing, and the boat went where oars could not.',
	harbours:
		'The moles of Alexandria and the concrete of Caesarea poured under water made harbours where the coast gave none.',
	compass:
		'The magnetic needle, Chinese by 1040 and in the Mediterranean by 1190, let a ship hold a course under cloud.',
	lighthouse:
		'The Pharos was the first; by 1600 every trading coast had its lights, and the dock watched the water at night.',
	tally: 'Notched bones counted the days of the moon before there was writing; the Ishango bone is 20,000 years old.',
	baskets:
		'Woven baskets and carrying frames let one gatherer bring home more per trip; the oldest found are 10,000 years old.',
	census:
		'Rome counted its people every five years to tax and to levy; a state that knows its numbers can feed and house more.',
	charter:
		'A charter made a town free of its lord: its own market, its own court, its own walls. People came to be free.',
	printing: 'The Gutenberg press put twenty million books in Europe by 1500; what one man knew, all men could read.',
	townwatch:
		'Towns kept a night watch of citizens by turns; a stranger at the gate was noticed before he reached the square.',
	calendar:
		'The Julian calendar fixed the year at 365 days and a quarter; sowing and festival fell on the same day each year.',
	pride: 'Athens and Florence built to be admired; people fight harder for a home they are proud of.',
	postal:
		'Thurn und Taxis ran relays of riders from Innsbruck to Brussels in five days; a court that hears first answers first.',
	shields: 'A wall of locked shields turned arrows and blades alike; the Stele of the Vultures shows it in 2450 BC.',
	spearwall: 'Sumer fought in massed ranks of spears behind shields; the formation was older than the sword.',
	drill:
		'Men who train together hold together; Sparta drilled from the age of seven and nobody stood against them for a century.',
	phalanx: 'Eight ranks of shields and spears: the Greek phalanx held Marathon and broke Persia.',
	legion:
		'The manipular legion, in three lines that relieved each other, beat the phalanx at Cynoscephalae and ruled for five centuries.',
	pikesquare: 'Swiss pike squares at Morgarten and Sempach killed the mounted knight as the master of the field.',
	arms: 'Dismounted men-at-arms in full harness won Crécy and Agincourt on foot, the knight turned heavy infantry.',
	halberd: 'Axe and spear on one pole: the Swiss halberd cut knights from their horses at Morgarten.',
	tercio: 'Spanish pikes with sleeves of shot: the tercio was unbeaten from Pavia to Rocroi, over a hundred years.',
	bayonet:
		'The socket bayonet made every musketeer a pikeman too; the pike was gone from the armies of Europe by 1700.',
	fieldcraft: 'Hunters read ground, wind and track long before there were soldiers; the first warriors were hunters.',
	camps: 'Every Roman army dug a ditched camp each night; a fed, rested army was never surprised asleep.',
	marching: 'Roman roads and Roman discipline moved a legion twenty miles a day with its baggage; Caesar did thirty.',
	warmclothes: 'The sagum, the wool cloak of the legions, kept the legions through Gaul; wet wool still warms.',
	waterproof:
		'Oiled linen and tarred canvas shed rain; sailors wore them first, then the armies that marched in the wet.',
	drillyard: 'The campus Martius was the drill ground of Rome; a town with a yard to drill in fielded more men.',
	veterans: 'Marius kept his veterans with the standards; an old soldier retrained is worth two recruits. Opens Teach.',
	feudal: 'The tenants of a lord owed him forty days a year in arms; the levy was cheap, if not always willing.',
	slings: 'The Balearic slingers hired out to Carthage and Rome; a lead bullet broke bone through a shield.',
	composite: 'Horn, sinew and wood glued in layers: the bow of the steppe and Egypt shot farther from a shorter stave.',
	bodkin: 'The bodkin, narrow and square, was made to punch mail; it was in the quivers at Crécy.',
	firearrows:
		'Pitch-wrapped arrows burned ships and stockades from Assyria on; Chinese fire arrows carried gunpowder by 969.',
	longbow: 'The yew longbow, drawn to the ear, loosed ten a minute; Crécy and Agincourt were won by it.',
	xbowdrill: 'Genoese companies sold their drill to every court in Europe; a crossbowman spanned and loosed in rhythm.',
	musket:
		'The Spanish musket, heavier than the arquebus, put a ball through plate at a hundred paces; armour left the field after it.',
	volley:
		'Ranks that fired and countermarched kept a steady fire; Maurice of Nassau drilled it, Nagashino had shown it.',
	horses: 'The horse was tamed on the steppe about 3500 BC; the people who bred it moved faster than anyone on earth.',
	bridles: 'A bronze bit turns a horse at a gallop; with it the chariot could be steered, and later the rider.',
	saddles: 'The framed saddle, from the steppe, let a rider sit a shock without sliding off the back of the horse.',
	stirrups: 'The stirrup let a rider stand to strike and brace a lance; it remade the cavalry charge.',
	horseshoes: 'Nailed iron shoes let horses work wet northern ground; by 1000 every village had a farrier.',
	remounts:
		'Royal studs at Córdoba and Lipica bred the warhorse by the hundred; a cavalry needs remounts more than riders.',
	cavalry:
		'The Assyrians were the first to fight on the horse rather than behind it; the chariot was done within a century.',
	knighthood:
		'The mounted knight, in mail and on a trained destrier, was the heaviest thing on a battlefield for three hundred years.',
	dragoons: 'Dragoons rode to the fight and fought on foot with firearms; named for the dragon, their short musket.',
	bronze: 'Copper and a tenth of tin: the first metal that held an edge, and the age is named for it.',
	spearheads:
		'A socket cast into the head gripped the shaft; a tanged head split it. The socket is on every spear after.',
	iron: 'Iron ore is everywhere, tin is not; when the Hittite secret spread, every farmer and his son could carry a sword.',
	tempering:
		'Quenched steel is hard but brittle; reheated gently, it bends and comes back. Damascus and Toledo lived on the secret.',
	casehard: 'Iron packed in charcoal and heated took a steel skin; the armourers of Innsbruck hardened plate with it.',
	leather: 'Boiled leather, cuir bouilli, turns a glancing blow; it was armour where bronze was too dear.',
	helmets: 'The Sumerian gold helmet of Meskalamdug, the Corinthian bronze: the head was armoured before the body.',
	scale: 'Assyrian and Scythian horsemen wore bronze scales sewn to leather; a cataphract was armoured to the hoof.',
	chain: 'Celtic smiths riveted ten thousand rings into a shirt; Rome copied it and wore it for five hundred years.',
	plate: 'A full harness of plate turned arrows and most blades; a knight in it could fall from his horse and get up.',
	oiling: 'Armour kept oiled and in a bag between fields lasted a lifetime; rusted mail broke at the first blow.',
	slits:
		'A loop in the wall gave the archer cover and a field of fire; the Romans had them, the Normans made them deadly.',
	fortify:
		'Thick stone curtains with towers that covered each other: Krak des Chevaliers held for a hundred and thirty years.',
	machic: 'Openings in the floor of an overhang: stones and water dropped straight onto the men at the wall.',
	guncast:
		'Bronze guns cast in one piece replaced the iron hoops of the bombard; the guns of Mehmet opened Constantinople in 1453.',
	starfort:
		'Low, thick, angled bastions, the trace italienne, took the shot of the cannon and gave none of it a blind spot.',
	engineers: 'Legions carried their own engineers; a trained crew built an engine on the spot instead of hauling it.',
	torsion: 'Skeins of sinew or hair, twisted tight, threw stone and bolt for Dionysius of Syracuse in 399 BC.',
	counterweight:
		'The counterweight trebuchet threw stones of a hundred kilos farther than any torsion engine; it came from the Levant about 1100.',
	burningshot:
		'Naphtha pots and Greek fire, hurled by engine, burned ships and roofs; Byzantium kept the recipe a state secret.',
	corned:
		'Powder wetted and dried into grains burned evenly and fired hard; loose serpentine had misfired as often as not.',
	limbers:
		'Burgundy and France put guns on wheeled carriages with trunnions; artillery kept up with the army for the first time.',
	petards:
		'A bell of powder fixed to a gate and lit: the petard blew in doors, and sometimes its engineer, hoist with his own.',
	standing: 'The French ordnance companies of 1445 were paid year-round; the first standing army since Rome.',
	drawbridge: 'A bridge that lifts leaves a ditch; a gate behind it, a portcullis behind that.',
	garrison: 'The Spanish army kept military hospitals from 1500; a garrison with a ward came back to the wall.',
	bastion: 'The angled bastion let guns cover every foot of wall; nothing could stand at the foot of it unshot.',
	writing: 'The clerks of Uruk scratched rations on clay and made memory last; everything after is written.',
	records:
		'A written order is one not forgotten while the last is done; Sumerian tablets count workers and rations by the thousand.',
	rhetoric:
		'Rhetoric was the core of Greek and Roman schooling; an envoy who can speak is heard where a mute one is sent home.',
	universities:
		'Bologna, Paris, Oxford: masters and students in a guild of their own, and learning that outlived its teachers.',
	science: 'Galileo measured, Bacon doubted, Newton proved; the method that asks the world instead of the book.',
	maths:
		'The geometry of Euclid laid out the range of a tower shot and the angle of a wall; Archimedes aimed engines with it.',
	algebra: 'Al-Khwarizmi wrote the first algebra in Baghdad; it made surveying, taxing and ranging faster.',
	ballistics: 'Tartaglia showed that a shot flies in a curve, not a line; gunner quadrants aimed by his tables.',
	apprentices: 'The code of Hammurabi binds an apprentice to his master; a craft taught is a craft kept.',
	academy: 'Plato taught in an olive grove outside Athens for forty years; the school outlived him by nine hundred.',
	military_academy: 'The Kriegsschule of John of Nassau at Siegen taught officers from a book: the first war college.',
	medicine: 'Hippocrates made disease a thing of causes, not gods; his school wrote down what it saw.',
	architecture: 'Vitruvius wrote the ten books every builder read for 1500 years: firmness, commodity and delight.',
	guilds: 'Guilds set the standard, kept the secret and trained the next man; a guild town made more and made it well.',
	medschool: 'Salerno taught Greek and Arabic medicine to Europe; its doctors were licensed from 1140.',
	press: 'The Gutenberg press spread learning across Europe in a generation; a scholar with books learns faster.',
	optics: 'The telescope of Lippershey, then of Galileo: a watchman on a tower saw sails a day before they came.',
	roads: 'Rome paved fifty thousand miles; a legion on the Via Appia marched in the rain as on a dry day.',
	drainage: 'Roman farmers laid stone-filled trenches under wet fields; drained ground carries a cart after rain.',
	snowclear:
		'The Alpine passes were kept open by villages paid to shovel; the Gotthard carried mules all winter from 1230.',
	crampons: 'Iron spikes strapped to the boot: Roman caligae had hobnails, Alpine hunters had crampons by 1500.',
	levees: 'The Dutch raised dykes and drained polders from the 1000s; a land below the sea stayed dry by work.',
	meteorology: 'The Torricelli barometer fell before a storm; a march planned by the glass was not caught in the open.',
	bandages: 'Clean linen and lint, taught by Hippocrates, kept wounds from festering while they closed.',
	herbs: 'Dioscorides listed six hundred plants and what each did; the book was copied for fifteen centuries.',
	hospitals: 'The bimaristan of Baghdad took every patient and kept records; the first hospitals of Europe copied it.',
	pharmacy: 'The Canon of Avicenna set out drugs, doses and trials; it was the medical textbook until 1650.',
	quarantine:
		'Ragusa held ships thirty days, Venice forty, quaranta giorni; the plague came slower where it was tried.',
	surgeons:
		'Paré tied off vessels instead of burning them and dressed gunshot with salve, not boiling oil; more men lived.',
	anatomy: 'Vesalius cut and drew what was there, not what Galen said; surgery began to know the body.',
	inoculation:
		'Variolation against smallpox was practised in China and the Ottoman court long before Lady Montagu brought it west in 1721.',
	rites: 'Rites before battle steadied armies from Sparta to Agincourt; a blessed soldier holds the line longer.',
	games: 'The games at Olympia were a festival of the god; every four years the wars stopped so the Greeks could run.',
	relics: 'Relics drew pilgrims and converts; a priest with a relic turned a doubter faster than one with words alone.',
	sermons: 'Franciscans and Dominicans preached in the square, not the choir; a sermon before battle steadied a town.',
	reform: 'The theses of Luther, printed, split Christendom in a decade; faith became a cause men marched for.',
	watch: 'Watchmen with lanterns walked the streets; a stranger after curfew answered questions.',
	codes: 'Hammurabi set the law in stone for all to read; a known rule is easier to bear than the whim of a lord.',
	magistrates: 'Magistrates heard grievances before they became riots; Rome and the Hanse towns both ruled by them.',
	informers: 'The Walsingham network cost Elizabeth less than a regiment and found the Babington plot.',
	tolls: 'Roads paid for themselves by tolls at bridges and gates; a lord with a toll-bridge was a rich lord.',
	assizes: 'Henry II sent justices on circuit; the hundred answered on oath who the thieves were.',
	police: 'Paris got a lieutenant-general of police under Louis XIV; street lights, patrols and a file on everyone.',
	engage:
		'The Art of War of Sun Tzu, about 500 BC: when to engage and when not to is the first decision a general makes.',
	command: 'The Roman cohort and the Macedonian taxis: an army in parts that could be ordered apart.',
	formations: 'Wedge, line, square: Vegetius lists seven; which one you stood in decided who went home.',
	standards: 'A standard raised over a resting army told men where their own were; a rallied soldier recovers faster.',
	supply: 'The Mongols moved on remounts and dried milk; a fed army is a rested army.',
	muster:
		'Gustavus Adolphus drilled the army of Sweden to a book; the same orders at Breitenfeld as on the parade ground.',
	staff:
		'Gustavus Adolphus and Wallenstein planned on paper with officers to carry it out; the charge went in where the map said.',
	weights: 'Standard weights, kept by the market, stopped the thumb on the scale; honest trade is faster trade.',
	coinage: 'Lydia struck the first coins of electrum about 600 BC; a stamped weight needs no scale and no trust.',
	credit:
		'A bill drawn in Genoa and paid in Bruges moved money without moving gold; the fairs of Champagne ran on them.',
	banking: 'The Medici and the Fuggers lent against ventures and took a share; a backed venture brought more home.',
	exchange: 'Antwerp built a hall for merchants of every nation in 1531; prices were made there for all of Europe.',
	armedcart: 'Silk Road caravans travelled with hired guards; a merchant alone was a merchant robbed.',
	convoys: 'The Spanish treasure fleets sailed together under escort from 1564; a convoy lost less than ships alone.',
	milestones:
		'Rome marked every mile from the Golden Milestone in the Forum; a merchant knew where he was and how far to go.',
	caravanserai:
		'Caravanserais along the Silk Road sheltered traders and beasts a day apart; a sheltered caravan carries more.',
	fortpost: 'Hanseatic kontors and Genoese fondachi were walled; a post that could not be taken set its own terms.',
	postroads: 'Relay stations a day apart with fresh horses; goods and news moved at a gallop from Lisbon to Vienna.',
	customs:
		'Customs houses at every port and gate took a cut of all that passed; the keeper of the road grew rich on it.',
	looms: 'Loom weights of clay are in every Neolithic village; the loom turned wool into the first trade good.',
	spinwheel:
		'The spinning wheel reached Europe by the 1200s and spun thread several times faster than the drop spindle.',
	fulling: 'Fulling mills pounded cloth with water-driven hammers from the 1000s, work that had been done by foot.',
	frame:
		'The knitting frame of William Lee worked a thousand loops a minute; Elizabeth refused him a patent for fear of the hand-knitters.',
	hops: 'Hops kept beer from souring; brewers could make more and store it longer. Hildegard of Bingen wrote it down in 1150.',
	brewhouse:
		'Town brewhouses with copper kettles replaced the pot of the alewife; Hamburg had five hundred brewers by 1400.',
	lager: 'Bavarian brewers stored beer in cold cellars through summer; the Reinheitsgebot of 1516 set what went in.',
	dies: 'A struck coin from a good die is hard to clip and easy to trust; good dies mean more coin from the same silver.',
	assay: 'The Trial of the Pyx tested English coin against a standard from 1282; a trusted coin passes at full value.',
	milled: 'The screw press struck a round coin with a milled edge that could not be clipped; Paris had one by 1551.',
	bellows:
		'The water-driven bellows blew Chinese furnaces in 31 AD; Europe had them by 1200. A hotter blast, more iron.',
	castiron: 'China poured iron into moulds from 500 BC; Europe only learned to from the 1400s.',
	blast: 'The blast furnace, blown by water, reached Europe by the 1300s and made iron in a continuous stream.',
	finery: 'The finery hammered cast iron into wrought bar that could be forged; the Walloon method spread from Liège.',
	cleanwater: 'The Aqua Appia brought Rome clean water in 312 BC; by Trajan eleven aqueducts fed a million people.',
	sewers: 'The Cloaca Maxima drained Rome for two thousand years; a city that carries its filth away buries fewer.',
	plumbing:
		'Lead pipe carried water to the upper floors of Roman insulae; a block with water could be a block of six storeys.',
	waterworks: 'The Morice wheels under London Bridge pumped the Thames into the pipes of the city from 1582.',
	keep: 'Towns grew around a hall where the lord or council met, the market was held and grain was stored: the town hall, the moot hall, the agora. It is the heart of the place: lose it and the town is lost.',
	town: 'Kingdoms spread by founding new towns with a hall and a market of their own: the Roman colonia, the medieval new town and bastide.',
	venture:
		'Merchants met at fixed places to trade on credit at the going price: the Bruges Bourse from about 1400, Antwerp in 1531. Before that, Italian merchants pooled money in ventures, the commenda, sharing the profit or the loss of a voyage.',
	house: 'A settlement is as big as its shelter, food and water. Houses are why villages grew past the camp.',
	apartment:
		'Cities grow upward where land is dear. The insulae of Rome housed most of the city, five or six floors tall; emperors had to cap their height.',
	aqueduct:
		'The first aqueduct of Rome, the Aqua Appia, was begun in 312 BC; Persian qanats and Assyrian channels moved water long before. More water, more people.',
	farm: 'Farming began about 10,000 years ago in several places (the Fertile Crescent, China, New Guinea, Mesoamerica). A field gives steady food where foraging runs out, but not in winter.',
	treefarm:
		'Coppicing, cutting trees back so they regrow, is as old as farming: the Sweet Track in Somerset (about 3800 BC) was built of coppiced timber.',
	mill: 'Grain was ground at the quern and later the mill. A drop-off beside the fields saves the walk, and the walk is where the time goes.',
	lumber:
		'Timber was fuel and building material for most of history. Cutting at the forest and stacking there beats hauling logs home.',
	mining:
		'Stone and ore were dug where they lay. Neolithic flint miners at Grimes Graves (about 2600 BC) dug shafts with antler picks.',
	barracks:
		'Neolithic warbands trained together; the first standing armies (Akkad, about 2300 BC; later Egypt, Assyria, Rome, Han China) needed barracks and drill.',
	range:
		'Bows are older than farming. A range is where archers practise in numbers, because a volley beats a single shot.',
	stable:
		'Horses were tamed about 3500 BC or later (the date is argued). Chariots ruled Bronze-age battlefields (Kadesh, 1274 BC); riders replaced them in the Iron age.',
	smith:
		'Bronze (about 3300 BC) and then iron (widespread around 1200 BC) changed who won. The smith made the difference.',
	siege:
		'Assyrian reliefs (about 865 BC, now in the British Museum) show rams under roofs and archers in siege towers. Greeks and Romans added torsion catapults.',
	council:
		'Generals planned together: in Athens the ten strategoi met at the strategeion, Rome had the praetorium. Drill and formation won battles: the phalanx, the column on the march, the wedge of horse, the Scots schiltron square against knights.',
	market:
		'Markets traded surplus for what a region lacked, from Old Assyrian Kanesh (about 1900 BC) to the Greek agora and the Roman forum.',
	courthouse:
		'Written law (Hammurabi, about 1754 BC) and the officers who kept it. Spy-catching is our design shortcut: courts and armies both hunted informers.',
	school:
		'Scribal schools taught writing in Sumer by about 2000 BC; writing itself began as accounts at Uruk (about 3100 BC) and in Egypt soon after.',
	library:
		'The library of Ashurbanipal at Nineveh (7th century BC) and the Library of Alexandria (about 295 BC) gathered texts and scholars. Universities came later: Bologna in the 11th century, with al-Qarawiyyin (859) and Nalanda (5th century) older in their own traditions.',
	hospital:
		'Roman forts had valetudinaria (military hospitals); the bimaristan of Baghdad (about 805) and Byzantine xenones cared for the sick. Rest and care near the camp saved more men than the field surgeon.',
	temple:
		'Temples are older than cities (Göbekli Tepe, about 9500 BC). Armies prayed and took omens before battle; belief steadied soldiers: that is zeal.',
	pasture:
		'Sheep were the wealth of medieval England: wool was its great export. A sheep was shorn once a year, in late spring, and gave one to two pounds of wool; lambs came in spring.',
	tpost:
		'Trade routes had fixed stopping places: wells, fords, markets and caravanserais. Whoever held them taxed every merchant who passed.',
	pit: 'Trou de loup: the wolf-pit, a hidden hole with a stake in it, dug before Roman and medieval lines alike.',
	net: 'The nets of hunters took boar and deer long before they took men; a hidden net under leaves holds a soldier for ransom, not for burial.',
	stakes:
		'Caltrops and sharpened stakes broke cavalry at Bannockburn and Agincourt; the men of Caesar planted them before Alesia.',
	workshop:
		'Before machines, spinning was the bottleneck: a Roman toga took about a year of work for one spinner. Ale was brewed often and drunk young, since without hops it soured in weeks.',
	foundry:
		'Bloomery furnaces smelted bog iron with charcoal across Iron-age Europe; three loads of wood for one of iron was about the going rate.',
	quarry:
		'Stone was cut where the bedrock showed, by wedges, water and fire; Roman quarries supplied the city from miles away.',
	throne:
		'The citadel in the middle of the world: Constantinople held the straits, and whoever held it took a cut of every cargo. Thrones were seized, not built.',
	mint: 'Lydia struck the first coins about 600 BC; royal mints followed wherever a state grew. Rome debased the denarius from near-pure silver to almost bronze over two centuries, and prices rose as the coin fell.',
	stop: 'Spice did not grow in Europe: pepper, cinnamon and cloves came along the caravan and sea routes from Asia, and sold for many times what they cost where they grew.',
	dock: 'Every river and lake town had landing stages: fishing boats and ferries tied up at wooden piers, and the catch was sold on the quay.',
	tower:
		'Every walled people built towers: height gives sight and range. The tower of Jericho stood about 8.5 m high around 8000 BC.',
	wall: 'Walls are among the oldest defences: Jericho had one about 8000 BC. They delay an attacker so defenders can shoot.',
	gate: 'A wall nobody can pass is a prison. Every walled city had gates, the weak point and the guarded point.',
	wonder: 'The great work of each civilisation: built to be seen, and costly enough to show a state at its height.',
	vil: 'Every economy is people doing work. More hands bring more of everything, until food or houses run out.',
	scout:
		'Armies sent riders ahead to find water, food and the enemy. Knowing the ground first was half of every campaign.',
	envoy:
		'Heralds were sacred in most cultures; harming one was a grave offence, though Herodotus tells of Persian heralds killed at Athens and Sparta.',
	caravan:
		'Old Assyrian donkey caravans ran tin and cloth to Kanesh about 1900 BC; Han envoys opened the western silk routes about 138 BC. Pay grew with distance, and so did the risk.',
	spy: 'Hittite spies misled Ramesses II before Kadesh (1274 BC); the Art of War (Warring States China) gives spies a chapter; the Arthashastra of India (its date is disputed) gives them many.',
	priest:
		'Priests marched with armies for sacrifice and omens (Roman haruspices, Spartan pre-battle rites, medieval chaplains). They steadied men; physicians healed them.',
	medic:
		'Roman medici and capsarii (bandagers) worked in the field; the Byzantine Strategikon (about 600) paid men to carry the wounded back.',
	spear:
		'The spear is the oldest weapon of war. A line of spears stops horses, from the Sumerian phalanx on the Stele of the Vultures (about 2450 BC) to the Greek hoplite and the Scottish schiltron.',
	sword:
		'Bronze swords appear about 1600 BC; heavy infantry with sword and shield won the close fight from Egypt to China.',
	archer:
		'Bows are Stone-age (Ötzi carried a yew bow about 3300 BC). Arrows reach what spears cannot, but archers die to anything that closes with them.',
	jav: 'Javelin men (Greek peltasts, Roman velites, Iberian skirmishers) ran in, threw and ran off: the bane of slow archers.',
	crossbow:
		'China fielded crossbows by the 4th century BC (first battle on record: Maling, 341 BC); Europe took them up again from the 10th century. Little training, great punch, slow to load.',
	chariot:
		'The spoked-wheel chariot appeared about 2000 BC; Egyptians and Hittites fought with thousands at Kadesh (1274 BC). Riders replaced it once horses were bred big enough.',
	cata: 'Fully armoured horse and rider: Parthian and Seleucid cataphracts from about the 2nd century BC; Sasanian and Byzantine heavy cavalry after them.',
	harcher:
		'Scythians, Parthians, Huns and Mongols shot from the saddle; the Parthian shot (firing while riding away) beat Crassus at Carrhae (53 BC).',
	elephant:
		'India used war elephants for centuries; Chandragupta Maurya traded 500 to Seleucus (about 305 BC); Hannibal crossed the Alps with them. They could panic and turn on their own side.',
	ram: 'Battering rams under a roof, against fire and arrows, broke gates and walls from Assyria to Rome.',
	stower:
		'Siege towers let archers shoot down on the walls: Assyrian reliefs show them, and Demetrius built a giant one (the Helepolis) at Rhodes in 305 BC.',
	catapult:
		'The engineers of Dionysius of Syracuse built the first catapults about 399 BC; torsion engines followed, first recorded at Tyre (332 BC).',
	ballista:
		'Greek and Roman bolt-throwers (the scorpio, later the ballista) shot soldiers at long range; they were field artillery as well as siege engines.',
	treb: 'The traction trebuchet was Chinese (4th century BC); the counterweight trebuchet is described firmly in 1187, and threw heavier stones farther than any earlier engine.',
	hanxbow:
		'Han armies fielded crossbows by the tens of thousands: one arsenal list from 13 BC counts over 11,000, with bronze triggers cast to a standard pattern.',
	immortal:
		'Herodotus says the Persian royal guard of 10,000 was never allowed to fall below strength, so the Greeks called them Immortals. They carried spear, bow and wicker shield.',
	mongolha:
		'A Mongol rider went to war with three or four horses and changed mounts to keep moving for days; the armies of the khans outpaced every enemy on the continent.',
	mauryael:
		'A Greek envoy at the court of Chandragupta reported that horses and elephants were a royal monopoly; the royal corps was the largest of its day.',
	malihorse:
		'Al-Umari (about 1340) reported that the Mansa of Mali kept a standing cavalry and gave his chiefs horses; Ibn Battuta saw mounted commanders with bows.',
	// research
	elite_roman:
		'Augustus made the Praetorian Guard a standing corps in 27 BC: the guard of the emperor himself, best paid in the army.',
	elite_han: 'Han armies fielded massed crossbowmen; the picked men shot in drilled volleys, rank after rank.',
	elite_persian:
		'Herodotus names a thousand Apple-bearers within the Immortals: the guard of the king himself, their spears butted with golden apples.',
	elite_mongol:
		'The Keshig was the imperial guard of the Mongol khans, raised by Genghis Khan from the sons of his commanders.',
	elite_maurya:
		'Greek visitors to the Maurya court wrote of thousands of war elephants; the king kept the finest for himself.',
	elite_mali:
		'The armoured horsemen of Mali were its nobility; Ibn Battuta saw the court of the mansa ringed by armed guards in 1352.',
	castle:
		'The castle joined keep, walls and garrison into one strongpoint and defined war in Europe for centuries. Rulers built them in conquered lands to hold them: Norman England, Edward I in Wales. The word comes from the Latin castellum, a fort.',
	// finds
	chest: 'People buried their wealth in troubled times; hoards like Hoxne in England were found centuries later.',
	ruins:
		'Abandoned cities held old knowledge: much of Greek science reached Europe through Arabic copies kept elsewhere.',
	cemetery: 'Grave goods drew robbers in every age: almost every Egyptian tomb was robbed in antiquity.',
	camp: 'Brigands haunted every trade route; merchants hired guards, and states hunted bandits along them.',
	den: 'Bears and wolves were real dangers in the forests of Europe and Asia well into the Middle Ages.',
	shrine: 'Holy sites drew pilgrims and gifts, and rulers fought to hold them (Delphi, Jerusalem, Mecca, Bodh Gaya).',
	vagabonds: 'Mercenaries are as old as armies: the Ten Thousand of Xenophon were Greeks hired by a Persian prince.',
	mercs:
		'The free companies of the 1300s sold whole armies by the season: the White Company under Hawkwood hired itself to whoever paid in Italy.',
	meteor:
		'Meteoric iron was worked before anyone could smelt it: the dagger of Tutankhamun and Inuit tools were made from fallen stars.',
	wayfarer: 'Towns grew by newcomers: settlers, refugees and travellers who stayed.',
	// civilisations' wonders
	'wonder:roman':
		'The Flavian Amphitheatre, opened by Titus in AD 80 with a hundred days of games, seated about 50,000 Romans.',
	'wonder:han':
		'Weiyang Palace, completed about 200 BC in Changan, was the seat of Han emperors for two centuries; its walls ran about 14 km. Only the platforms survive, so its look here is a reconstruction.',
	'wonder:persian':
		'Darius I founded Persepolis in 518 BC; in its Apadana hall, delegations from across the empire brought tribute to the king.',
	'wonder:mongol':
		'At Karakorum, about 1254, the Parisian smith Guillaume Boucher built Möngke Khan a silver tree that poured four drinks for the court, as the friar William of Rubruck reported.',
	'wonder:maurya':
		'Ashoka began the Great Stupa at Sanchi in the 3rd century BC; later rulers cased it in stone and added its four carved gateways.',
	'wonder:mali':
		'The Djinguereber Mosque in Timbuktu is traditionally dated to 1327, built by order of Mansa Musa after his pilgrimage. It still stands, rebuilt in the 1570s.',
	'bonus:roman':
		'Legions did their own building: soldiers of three legions raised most of the Wall of Hadrian from AD 122.',
	'bonus:han':
		'The Han state made iron ploughshares from 117 BC, and new field systems spread; critics at the time called the state tools crude, so the gain here is modest.',
	'bonus:persian':
		'Along the Royal Road, 111 staging posts linked Sardis to Susa, and relay riders carried messages across the empire.',
	'bonus:mongol': 'Each rider kept three or four horses and swapped them to cover long distances without tiring them.',
	'bonus:maurya':
		'Megasthenes, a Greek envoy at the Maurya court about 300 BC, said horses and elephants belonged to the king alone.',
	'bonus:mali':
		'Mali held the Bambuk goldfields. Mansa Musa spent so much gold in Cairo in 1324 that its value there fell for years.',
};

// World news: a line from the rest of history now and then, matched to your age. Every line is a real event at its real date; the joke is in the wording, never in a people.
const NEWS = [
	[
		'Somewhere, someone has tamed a horse. Opinions are divided.',
		'Jericho builds a wall. Neighbours unimpressed, for now.',
		'Çatalhöyük: 8,000 people, no streets. Walk across the roofs.',
		'Sumer invents writing. First document: a grain receipt.',
		'Ötzi crosses the Alps with a copper axe. Weather fine.',
	],
	[
		'The Great Pyramid at Giza is finished. 2.3 million blocks, no complaints filed.',
		'Hammurabi publishes 282 laws. An eye for an eye, in stone.',
		'Knossos installs flushing toilets. Guests astonished.',
		'Thera erupts. Minoan shipping advises patience.',
		'Tin is scarce again. Bronze prices climb.',
	],
	[
		'Rome opens new public baths. Attendance is mandatory, socially.',
		'Caesar stabbed in the Senate. Twenty-three times. Politics continues.',
		'Alexander reaches the Indus. His army would like to go home.',
		'Library of Alexandria now the largest. Overdue scrolls pursued.',
		'Qin Shi Huang unites China. Also standardises axle widths.',
		'Eratosthenes measures the Earth with a stick. Close enough.',
	],
	[
		'The wall of China, previously just okay, is becoming great.',
		'The Black Death reaches the ports. Hospitals advised.',
		'Charlemagne crowned on Christmas Day. Says he was not expecting it.',
		'Vikings reach Newfoundland. Will not be writing home.',
		'Mansa Musa passes through Cairo. Gold prices fall for a decade.',
		'Oxford founded. Students already complaining about rent.',
	],
	[
		'Constantinople falls to cannon. Wall builders reconsider.',
		'Gutenberg prints a Bible. Scribes start a union.',
		'Columbus lands, insists it is Asia.',
		'The arquebus at Pavia: knights advised to reconsider.',
		'The ship of Magellan returns. Magellan does not.',
	],
];
// What each spectacle says: the warning, then the event itself
const EV_TEXT = {
	eclipse: ['An eclipse is coming: the sun goes dark.', 'The sun is black. Both armies falter.'],
	storm: ['A storm walks in from the west.', 'Thunderstorm: lightning under the cloud.'],
	stampede: ['Thunder of hooves: bison are coming.', 'Stampede! Fields trampled in its path.'],
	flood: ['The lakes are rising.', 'Flood: the shores are under water.'],
	locusts: ['A dark cloud on the wind: locusts.', 'Locusts strip the fields they cross.'],
	meteor: ['A light in the sky.', 'A star fell in the wild. Reach it for iron.'],
	wildfire: ['Smoke in the dry forest.', 'Wildfire! Keep wood away from the trees.'],
	fog: ['Fog is rolling in.', 'Fog: nobody sees far.'],
	tremor: ['The ground rumbles.', 'A tremor cracks the walls.'],
	sinkhole: ['The ground is groaning somewhere.', 'A sinkhole opened under a building.'],
	quicksand: ['The ground has gone soft after the rain.', 'Quicksand: a patch that traps walkers.'],
	heatwave: ['A heat wave is coming.', 'Heat: armies tire and fight weaker.'],
	mirage: ['Scouts report an army on the move.', 'Scouts report an army. Or do they?'],
	circus: ['A travelling show is on the road.', 'A show passes: viewers work lighter.'],
	wagon: ['A wagon train is crossing the land.', 'Settlers: reach the wagon, three join.'],
	mercs: ['A free company has camped by the road.', 'Mercenaries for hire, for three minutes.'],
	dragon: ['Something large is flying this way.', 'A dragon passes. What it flies over, burns.'],
	troll: ['A troll has left its bridge.', 'A troll is out. It goes home at dusk.'],
	aurora: ['The sky is stirring in the north.', 'Northern lights.'],
	horde: ['A horde is coming: two seasons.', 'A horde is coming: one season.', 'The horde is here!'],
};
// The alert bar: what each event does, in a few words (the name is EVENTS[kind].name). Quake is the tremor when the Earthquake hazard is on.
const EV_LINE = {
	eclipse: 'armies falter',
	storm: 'lightning strikes',
	stampede: 'fields trampled',
	flood: 'shores flooded',
	locusts: 'fields stripped',
	meteor: 'iron falls',
	wildfire: 'forest burns',
	fog: 'short sight',
	tremor: 'walls crack',
	quake: 'walls fall',
	sinkhole: 'a building hit',
	quicksand: 'a trap patch',
	heatwave: 'armies tire',
	mirage: 'an army, maybe',
	circus: 'work lighter',
	wagon: 'settlers join',
	mercs: 'hire them',
	dragon: 'burns all below',
	troll: 'a troll roams',
	aurora: 'a quiet glow',
	horde: 'raiders attack',
};
// What triggers what: when, then, why. Numbers come from the tables, so the text cannot drift from the game.
const TRIGGERS = () => [
	[
		'You send soldiers somewhere',
		'Each soldier shows its state in the Army list: Rallying, Marching, Fighting, Holding or Routed. A ring on the map marks the spot with the time left; tap the ring to pick that group. Recall brings a marching group home. Follow keeps the camera on the picked soldiers.',
		'You always see what each soldier is doing and where it will stand.',
	],
	[
		'An enemy group you can see heads for your buildings',
		'The bar turns red: how many, and seconds until they arrive. Tap it to jump to them.',
		'Time to pick your soldiers before the first hit.',
	],
	[
		'You start a game',
		`Pick your civilisation (${CIVK.map((k) => CIVS[k].name).join(', ')}). The three computers take three of the others at random. Each civilisation has one unique soldier, one small bonus and its own wonder; the rest is shared.`,
		'A real people, but the same rules for all: no civilisation is stronger on paper.',
	],
	[
		'You order a unit and the town is full',
		'The order waits ("needs room") and nothing is lost. Room opens when a House, Apartment or Aqueduct finishes or a unit dies.',
		'A town is as big as its shelter.',
	],
	[
		'The screen',
		`Top, one bar: food, wood, stone, gold, iron, then sound, pause and play, and speed. Under it: your age, the season and the clock on the left (gold when the next age or a research is ready: tap it for the Town Center), idle villagers beside it, and your score and rank on the right (tap for the table). The map icon sits top right (its − shrinks it again); Home bottom left when your Town Center is out of sight; Build bottom right. Bottom: People first (tap for people, army, research and how to play; − cancels one waiting to train, + trains one), then each job with − and +. + places an idle villager, and new villagers go to the job you picked. Build swaps the jobs for War, Walls, Trade, Culture and Home; ✕ brings the jobs back. A book on a building means research waits there.`,
		'Only what you act on stays in sight; the rest is a tap away.',
	],
	[
		'Messages and sound',
		'Every message is 10 words or fewer, one at a time. Tips and Messages can each be turned off; warnings stay on. Sound follows the silent switch of your phone.',
		'A phone game is played in short looks, often in company.',
	],
	[
		'Room',
		`You start with room for ${BLD.keep.room}. A House adds ${BLD.house.room}, an Apartment ${BLD.apartment.room}, an Aqueduct ${BLD.aqueduct.room}; Timber framing, Fired brick, Town charter, Plumbing and Waterworks add more. At most ${POPMAX} people: ${VILMAX} villagers and workers, ${ARMYMAX} soldiers.`,
		'Keeps the game readable on a phone, and every side has the same limits.',
	],
	[
		'Limits',
		`Each building has a limit that grows with the age: farms ${BLD.farm.cap[0]} at first, up to ${BLD.farm.cap[4]}; one Barracks, up to ${BLD.barracks.cap[4]}; most other buildings one. Soldiers need room: a Barracks, Archery range, Stable or Siege workshop holds ${BLD.barracks.armyRoom}, a Castle ${BLD.castle.armyRoom}, a Temple, Courthouse or Hospital ${BLD.temple.armyRoom}. Drill yard and Standing army add more. Every side has the same limits.`,
		'A real army needs barracks, stables and stores, not just men, and a town can only feed so many fields.',
	],
	[
		'The War Council ladder',
		'Four researches, each opening the next. Engagement: stances. Battalions: six, Alpha to Zeta; set what each holds, by type; new soldiers fill them, the rest are the reserve. Formations: Line, Column, Wedge, Square. Muster (Gunpowder): the missing soldiers of a battalion in one order, twice the cost, a quarter longer, the time shared by every building that trains them. The computers climb it too.',
		'Rome levied whole legions at once; the drill of Maurice of Nassau (1590s) made trained formations, and armies like the New Model Army (1645) were raised as one force.',
	],
	[
		'Villager jobs: Food, Wood, Stone, Gold, Iron',
		`The − and + under each job move one villager off or on. Food takes a free field first if one is within ${FIELD_NEAR}, else the nearest berries, game or fish (fish only within ${DOCKR} of a dock).`,
		'You decide who does what.',
	],
	[
		'Hunting',
		`Villagers on Food hunt deer and boar near home: they throw javelins, the animal falls, and they butcher it where it lies (a deer gives ${(UNIT.deer.meat * RICH) | 0}, a boar ${(UNIT.boar.meat * RICH) | 0}). Boar fight back.`,
		'Meat came before fields everywhere.',
	],
	[
		'You build',
		'Press where it goes: the building waits above your finger and snaps flush beside your other buildings, side by side; buildings that train keep a walking lane around them. Green fits, red says why not. Let go, drag to adjust, then tap Build. Houses, fields and gates offer the next spot beside.',
		'Rows that line up, no hidden gaps, and you never cover what you are placing.',
	],
	[
		'Everyone eats',
		`Every minute each villager eats a share (${(UPKEEP.share * 60).toFixed(2)} food), a foot soldier ${UPKEEP.foot} shares, a rider or elephant ${UPKEEP.mounted} (horse fodder), a cart ${UPKEEP.cart}. One villager gathering food feeds about 8. With no food, work and damage drop by ${Math.round((1 - UPKEEP.hunger) * 100)}% and nothing can be trained; nobody starves.`,
		'Real towns and armies ate every day; the horses of an army ate more than its men.',
	],
	[
		'You hold a vassal',
		`Beat their army and stand at their Town Center, then Demand surrender; or, as the ally of a side and twice its strength, offer to be its overlord. Every 10 s you take the tax (light ${TAX.light.take * 100}%, fair ${TAX.fair.take * 100}%, heavy ${TAX.heavy.take * 100}% of what they gathered). Loyalty heads for 20 + your buildings near them (castle ${BLD.castle.invest}, town ${BLD.town.invest}, market ${BLD.market.invest}, tower, post, business center ${BLD.tower.invest}, field ${BLD.farm.invest}, others 3) + your soldiers there (0.5 each, up to 15) + enemies you killed near them (1 each, up to 20, fading) − the resentment of the tax (0, 10, 30). Unrest moves by the tax push (0.3, 1.5, 4) minus loyalty/25. At 60 loyalty they send gifts; at 50 you get a quarter of their trade profit.`,
		'Rulers who protected and built up their subjects were paid more and kept them; those who only squeezed them faced revolt.',
	],
	[
		'Unrest reaches 100',
		'A rebellion: a third of their villagers take up arms and their army turns on you. Kill three quarters of them and it is crushed (the rebels are lost); if they hold out 4 minutes, they are free. With two or more vassals, every minute there is a chance that all the restless ones rise together: the chance grows with their unrest and their number.',
		'Overstretched empires fell to joint revolts.',
	],
	[
		'You take down a building',
		'Half its cost comes back; whatever was waiting in it comes back in full. Cancel in the first 15% of the build returns all of it. The Town Center cannot be taken down.',
		'Salvage, never a way to make money.',
	],
	[
		'Soldiers destroy a building',
		`Its destroyer takes ${PLUNDER * 100}% of what it cost. Taking a building down yourself pays the enemy nothing.`,
		'Spoils of war, never worth more than the fight. Every side is paid the same way.',
	],
	[
		'A Town Center falls',
		`Whoever struck the last blow takes the whole stockpile and ${PLUNDER * 100}% of the cost of every building left standing.`,
		'Conquerors took the treasury. A rich stockpile is a target.',
	],
	[
		'Score',
		`Always on screen, top right; tap it for the table. Score = People (civilians held, cost ÷ ${SCORE.unit}) + Army (soldiers held, cost ÷ ${SCORE.unit}) + Tech (research and ages paid, ÷ ${SCORE.tech}) + Buildings (standing, cost ÷ ${SCORE.bld}) + Wealth (everything gathered, traded, found and plundered, ÷ ${SCORE.wealth}). Losses come off because you no longer hold them.`,
		'Every building and every worker counts toward something, the same way for every side.',
	],
	[
		'A timed game',
		'Help → Game: Conquest (no limit), 30 minutes or 60 minutes. At the bell the highest score wins.',
		'A guaranteed end, and a reason to build more than an army.',
	],
	[
		'A wonder is finished',
		`Every side is told. If it still stands ${WONDER_HOLD / 60} minutes later, its owner wins. The computers attack the wonder of a rival at once.`,
		'A wonder shows a state at its height; it is also a target.',
	],
	[
		'Finds in the wild',
		'Each corner has the same: deer, a boar, a treasure chest under wolves, ruins held by bandits (a free research of your age), an old cemetery with grave robbers, a bear den, vagabonds to hire. The camps of the robbers sit at the four map edges; the shrine stands inside the Throne. Guards stay near what they guard and attack whoever comes close. Kill them, then touch the find with any unit.',
		'Taking what is far means fighting for it. The map is the same from every corner.',
	],
	[
		'Robbers',
		`Robbers attack caravans and villagers within ${UNIT.robber.raid} of their camp. Break the camp and its hoard is yours.`,
		'Merchants hired guards because bandits were real.',
	],
	[
		'The shrine',
		`One shrine, at the foot of the Throne. A priest that stands by it for ${FINDS.shrine.capture} s takes it, and it pays its keeper ${FINDS.shrine.pay * 60} gold a minute. A priest of another side can take it back.`,
		'Rulers fought to hold holy sites; pilgrims brought gifts.',
	],
	[
		'Wayfarers',
		`Every ${WAYFARER_EVERY / 60} minutes a wayfarer walks in from one map edge, in turn, toward the other side. The first unit of any side that meets him brings home a free villager.`,
		'Towns grew by newcomers.',
	],
	[
		'The fantasy toggle',
		'Help → World: real (default) or fantasy. Fantasy swaps the guards for dire wolves, goblins, skeletons and trolls, and the finds pay half again as much. Everything else stays the same.',
		'Your call: history by default, legend if you like.',
	],
	[
		'Courthouse and spies',
		`The Courthouse trains spies; its guards shoot enemy spies within ${BLD.courthouse.rng}. A spy is seen by soldiers only within ${UNIT.spy.stealth[0]} and by towers, the Town Center and Courthouses within ${UNIT.spy.stealth[1]}. Near an enemy building it reads their stores, age, research and army.`,
		'States watched for spies as long as they have had secrets.',
	],
	[
		'Sabotage',
		`A spy sent to an enemy building is used up. A field, drop-off, house or hospital loses ${SAB.burn * 100}% of its health; a building that trains or researches stops for ${SAB.stall} s and loses the job in hand. Town Center, towers, walls, gates and Courthouses cannot be sabotaged.`,
		'A spy buys time; it never wins a war alone.',
	],
	[
		'Market',
		`Sell 100 of a resource or 10 of a good for ${SELL * 100}% of its worth (Coinage ${(SELL + 0.1) * 100}%), or buy for ${BUY * 100}%, at the going price. Spice is the only good it sells. The same prices for every side; a round trip always loses, and a trade stop pays more.`,
		'The margin is the cut of the merchant.',
	],
	[
		'Trade with an ally',
		`A caravan with no route runs from your Market to the Market or Town Center of an ally and earns distance² ÷ ${TRADE_DIV}, at most ${TRADE_CAP} gold, on arrival, then comes home. Kill an enemy caravan and its load is yours.`,
		'Silk-road pay grew with distance, and so did the danger.',
	],
	[
		'Unit lines and tiers',
		'Some research upgrades a unit in place and renames it: Spearman → Hoplite (Phalanx) → Pikeman (Pike square); Swordsman → Man-at-arms; Archer → Longbowman; Chariot → Horseman (Cavalry); Cataphract → Knight (Knighthood); Arquebusier → Musketeer (Musket). Every one you have is upgraded at once.',
		'Armies changed their kit, not their soldiers.',
	],
	[
		'Counters',
		'Spears beat anything on horseback; riders beat archers and siege; archers beat foot; javelins beat archers; crossbows and guns beat armour; swords beat foot and buildings; ballistae beat elephants. The unit cards say who beats whom.',
		'Every weapon had its answer.',
	],
	[
		'Siege',
		'Rams, catapults, trebuchets and bombards attack only buildings. Siege towers and ballistae shoot soldiers too. Arrows glance off rams and siege towers.',
		'Soldiers hit walls slowly; real armies brought engines.',
	],
	[
		'Stances',
		`Once Engagement is researched at a War Council, the army or a battalion takes a stance in the Army card. Shield wall: foot soldiers who do not shoot take ${Math.round((1 - STANCE[1].hit) * 100)}% less damage and march ${Math.round((1 - STANCE[1].spd) * 100)}% slower. Skirmish: shooters step back from anyone who comes within ${KITE} while they reload. A horse archer always skirmishes. The computers use them too once they research it: their shooters skirmish, their foot at home hold a wall.`,
		'The phalanx and the shield wall were slow and hard to break; skirmishers and horse archers fought by not being caught (Carrhae, 53 BC).',
	],
	[
		'Hit from behind',
		`A foot soldier or rider struck from behind the way it faces takes ${Math.round((FLANK - 1) * 100)}% more damage. Shooters do not get it. Splitting the army to catch a line from two sides pays.`,
		'Armies lost most men when their line was turned: Cannae, 216 BC.',
	],
	[
		'Heavy blows',
		'Elephants, cataphracts and trebuchets drive what they hit back a few steps, and it flashes white.',
		'Elephants and armoured charges broke formations by weight.',
	],
	[
		'The send strip',
		'Tap open ground: a small strip at your finger. Send ¼ sends a quarter of each type, nearest first; All sends everyone; with Battalions, each one by name; ⋯ for the rally point, scout and spy; ✕ to cancel. Tap an enemy building or soldier: pick how many of each type, then Attack, with the odds.',
		'Commands should cost one touch.',
	],
	[
		'The Natives and the Throne',
		`The fifth side holds the Throne, a citadel on the island of the great lake, reached by four causeways. Their regard for you starts at ${NATIVE.regard0}: gifts raise it (each buys less than the last, as the Danegeld did), blows on them lower it, and it drifts back with time. At ${NATIVE.peaceAt} they leave you be; at ${NATIVE.allyAt} an emissary can make them allies and their gate opens. Pits and nets wait on the causeways; a scout within ${NATIVE.scoutSees} finds them. A net takes a prisoner: pay the ransom within ${PRISON.secs / 60} minutes or they join the Natives. From minute ${NATIVE.raidFrom / 60}, at random times ${NATIVE.raidGap[0] / 60} to ${NATIVE.raidGap[1] / 60} minutes apart, outlaws from a camp raid a side at war with the Natives, the least regarded most often, never the same side twice running.`,
		'Rome paid frontier peoples to stay quiet; ransom ran through medieval warfare; pits and snares are the oldest defences there are.',
	],
	[
		'The Throne',
		`Break it down and it is yours at a third of its strength; or, as the ally of the Natives, stand ${NATIVE.handoverMen} soldiers inside for ${NATIVE.handover} s and they swear to you. Whoever holds it takes ${THRONE.tithe * 100}% of the gathering of every other side and ${THRONE.score} score a minute, and every other side turns hostile. Hold it ${THRONE.hold / 60} minutes in a 60-minute game (less in a shorter one) and you win.`,
		'The wonder race and the throne fight in one place: it gives the hours a direction and the computers a reason to fight each other.',
	],
	[
		'The ground remembers',
		'Where people fell, where buildings burned and where villagers walk a lot, the ground shows it. It is for looks only and is not saved.',
		'Battlefields and trodden roads stayed visible for years.',
	],
	[
		'Hold ground',
		'In the Army card, Hold ground makes the picked battalion fight only what comes within reach and not chase.',
		'A line that chases a lone rider breaks itself.',
	],
	[
		'Temple: Zeal',
		`With a Temple and a priest near the battalion, Zeal costs ${ZEAL.cost.g} gold and makes it hit ${Math.round((ZEAL.mul - 1) * 100)}% harder for ${ZEAL.secs} s. Once every ${ZEAL.cd / 60} minutes per side. Sacred games halve the cost and shorten the rest.`,
		'Belief steadied armies, but only so far.',
	],
	[
		'Hospital and medics',
		`Soldiers within ${BLD.hospital.hrng} of a Hospital or ${UNIT.medic.hrng} of a medic heal ${BLD.hospital.heal} health a second. The best one in reach counts. Medicine makes it 50% faster.`,
		'Care near the camp saved more men than the field surgeon.',
	],
	[
		'A building of yours is damaged: tap it, then Repair',
		'A villager mends it: a full repair takes three times the build time and costs a quarter of the building, paid as it goes.',
		'Mending costs less than rebuilding, and it takes hands.',
	],
	[
		`Soldiers come within ${SHELTER.flee} of a villager`,
		`The villager runs into the nearest tower with room (up to ${BLD.tower.shelter}) or the Town Center (up to ${BLD.keep.shelter} arrows) and adds an arrow, +1 damage each. It comes out when no enemy soldier is within ${SHELTER.clear} of it. A tower also sounds the horn when foes first come in range.`,
		'People sheltered inside a fortress and helped defend it.',
	],
	[
		'You pay for an age at the Town Center',
		`Bronze ${AGES[1].t} s, Classical ${AGES[2].t} s, Medieval ${AGES[3].t} s, Gunpowder ${AGES[4].t} s. It opens the next buildings, soldiers and research.`,
		'Time is the price of progress.',
	],
	[
		'You hit someone you are at peace with or allied to',
		'It is an act of war: war is declared, an alliance breaks.',
		'Same rule for all four sides.',
	],
	[
		'You send an emissary (Bronze age)',
		'It rides to a court. At war with you and not asked for peace: killed. Allied elsewhere: sent back. Peace or an alliance is answered by their odds: a side that is winning wants more of the war; a side that needs no ally sends you home. Their emissaries to you are answered by you, on the Relations side of your Town Center.',
		'Envoys were heard or hanged by the strength behind them.',
	],
	[
		'An ally',
		'An ally sends soldiers when your town is attacked and its own is safe, and opens its Market to your caravans. Twice its strength, you may offer to be its overlord.',
		'An ally who shares is worth having.',
	],
	[
		'A computer decides to attack',
		'It compares its power with that of the enemy: odds = r²/(1+r²), the square law of aimed fire (Lanchester, 1916, a modern model). It goes only if the odds beat its nerve: Raiders .5, Rivals .65, the Fortress .85 and only when it sees a chance. A wave that stalls goes home.',
		'A rule of thumb, not history: ancient melee followed the square law less well.',
	],
	[
		'Trees stand in the way',
		'Forest blocks people, carts and armies. A tree can be cut only from open ground beside it, so a forest is worked from its edge inward; a felled tree opens its ground. Hold and drag a box over trees to send villagers to cut a road.',
		'Old forests were barriers: roads were cut through them, and armies kept to the roads.',
	],
	[
		'The ground remembers the weather',
		`Rain leaves mud (marching up to ${Math.round(GROUND.mudSlow * 100)}% slower; a storm twice as fast), frost leaves ice (men slip), a blizzard leaves snow (marching ${Math.round(GROUND.snowSlow * 100)}% slower; engines slide and shoot short, hurting their crews). Frost and rain take ${Math.round(GROUND.wear * 100)}% off blades. Each fades over days. The Library (Weather line), Stable, Barracks and Smithy research the answers: roads and drains, horseshoes and crampons, cloaks, tempering and oiling, levees against floods.`,
		'Napoleon lost more to mud and cold than to armies; Agincourt was won in a ploughed field after a week of rain.',
	],
	[
		'Research comes in lines',
		`Each building teaches a few lines; only the next step of a line shows, and it needs the step before, sometimes one elsewhere (Plate needs Bellows). Cost and time follow the weight of the step in history, 1 to 10. The book on each step gives the date and what it changed.`,
		'The real tree: nobody built a blast furnace before a bellows, and the plough mattered more than the sickle.',
	],
	[
		'The army dock and pausing',
		'Once Battalions is researched a dock sits above the job bar: tap All or a battalion and it is picked; Charge, Fall back and Teach follow on the pick bar; the chevron folds it to a tab. Opening any card pauses the game and closing it carries on (Help: Pause on cards, off if you like).',
		'Thumbs on the map, not in a menu: a phone is not a desk.',
	],
	[
		'Teach',
		`Research Veterans at the Barracks, build a School: a soldier of an older kind can be taught a newer one (spear to sword, archer to crossbow, catapult to trebuchet). It stands frozen at its post for the lesson; tuition is ${TEACH.tuition} gold an age, plus the difference in cost. Four learn at a time per School. Fire arrows, burning shot and petards set wooden buildings alight; rain halves the chance. Soldiers resting by a Castle, Barracks or Town Center heal.`,
		'Marius retrained his veterans rather than raising new legions; the Spanish army kept wards for its garrisons from 1500.',
	],
	[
		'The seasons turn',
		`Each lasts ${SEASON_LEN / 60} minutes. ${SEASONS.map((S) => `${S.name}: marching ×${S.spd}, fields ×${S.farm}`).join('; ')}. Roads halve the slowing. Each spring sheep are shorn, lambs born, and the harvest of the year set (about one year in six poor, one in twenty failed).`,
		'Real farming years: mud and cold slowed armies, and the harvest decided the year.',
	],
	[
		'The weather changes, every minute',
		`Rain: marching ${Math.round((1 - WEATHER.rain.spd) * 100)}% slower, bows reach ${Math.round((1 - WEATHER.rain.rng) * 100)}% less, fires spread less. Drought (summer): fields give ${Math.round((1 - WEATHER.drought.crop) * 100)}% less, fires spread fast. Frost (winter): stone buildings go up at ${WEATHER.frost.stone * 100}% speed.`,
		'Wet roads were mud, wet bowstrings sagged, dry thatch burned, and mortar does not set in frost.',
	],
	[
		'A wooden building catches fire',
		'Sabotage, summer lightning, sparks from a smithy, or fire arrows and burning shot. It burns down in about half a minute; two villagers run with buckets; it can spread to wooden buildings next to it. Stone does not burn.',
		'Towns of timber and thatch burned often: London in 1212 and 1666.',
	],
	[
		'Sickness',
		'Now and then, more in summer and winter, a few of your people fall sick; Clean water (at an Aqueduct) halves it. The sick work and fight at 60% and a few die; a Hospital or medics cure them. Plague comes along the trade routes in some springs.',
		'Summer flux and winter fever were the yearly toll; plague followed trade.',
	],
	[
		'A caravan has a route',
		`It loads goods at the Market, sells them at a trade stop (farther pays more, up to ×${POST.far}; a wanted good ×${POST.want}), can buy spice there, and repeats. Robbers attack carts near their camps unless a post, tower or soldier is close. Up to ${POST.guard} soldiers can escort one: tap the caravan, Escort +4.`,
		'Merchants carried goods where they were scarce, and paid for guards.',
	],
	[
		'You hold trade stops',
		`Each of the two routes has four stops. Build a Trade post on a stop to hold it. You take a cut of the sales of every other side there, by how many of that route you hold: ${POST.cut
			.slice(1)
			.map((c, i) => `${i + 1}: ${c * 100}%`)
			.join(
				', ',
			)}. Hold all four of a route and it also pays ${POST.all * 60} gold a minute. Up to ${POST.guard} soldiers garrison each stop. You set what the stop wants.`,
		'Whoever held the road taxed the trade on it.',
	],
	[
		'A building is placed',
		`It is paid for and stands as a site at 0%. The nearest free villager walks there and builds it in the listed time; more builders are faster (two ≈ ${(2 ** BUILDER_POW).toFixed(1)}×). With nobody on it, it does not rise. A line of wall gets two builders who work down it. When done, a builder goes back to what he was doing.`,
		'Building takes hands: a far-off site is only as safe as its builder, and the army has to escort it.',
	],
	[
		'Fog of war',
		'You see what your people and your allies see; the rest of the map is as you last saw it, and the unseen is dark. Spies stay hidden until something of yours is close. Night shortens sight. Turn it off in Help for an open map.',
		'Scouts earned their pay by what they saw first.',
	],
	[
		'A wall or building stands in the way',
		'People walk around it. If nothing can get through, soldiers attack the wall in the way; villagers wait.',
		'Walls delay; they do not stop an army with time.',
	],
	[
		'The game saves itself',
		`Every ${SAVE_EVERY} seconds, and when you leave the page, on this phone. Next time it offers Resume or New game.`,
		'You should never lose a game to a phone call.',
	],
	[
		'Difficulty',
		`It turns the minds of the computers, never their stores. Easy: they think every ${DIFF.easy.react} s, wait longer to attack and to ally, and nobody comes for you before ${clock(EASY_SAFE)}. Normal: every ${DIFF.normal.react} s. Hard: twice a second, bolder, quicker to pounce on a side at war, and they ally against whoever leads the score.`,
		'No cheating: only how they think.',
	],
	[
		'Winning and losing',
		`Conquest: win when the Raiders, the Rivals and the Fortress have all fallen, or hold the Throne for its time; lose when your Town Center falls. Or hold a wonder for ${WONDER_HOLD / 60} minutes, or have the top score at the bell in a timed game.`,
		'A seat of power is what a state is.',
	],
];
