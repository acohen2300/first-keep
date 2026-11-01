# D-004 Natives and computers (decision 4b) [2026-11-01 07:45]

- Date: 2026-10-31 [2026-11-01 07:45]
- Status: locked, flagged: live test in process [2026-11-01 07:45]
- Albert's words: not recorded word for word; the record gives his call (DECIDED) and the rule below [2026-11-01 07:45]
- The rule: Rule: Natives and hazard people never start a fight with a computer. They fight only the unit or units that struck a Native or its camp, do not switch to a unit that did not, and chase no farther than the camp's own radius, then return home. An instigator that escapes escapes. Raids also skip computers. Player rules are unchanged. [2026-11-01 07:45]
- Its source: Logic: leash-and-reset, as neutral camps work in Warcraft-style games; territorial animals stop pursuing at their border (general knowledge, not looked up). It makes the computers' gold and fights easier to read; it is a deliberate one-sided rule bend. [2026-11-01 07:45]
- Its code home: Code home: wildTick 14-sim-troops 413-497; hurt aggro 16-sim-fight 111; natRaid 38-natives 210; NATIVE in 05-rules-wild 71. [2026-11-01 07:45]
- Taken from: the Decision Record (Oct 31), `docs/6 Records/v80 Audit/Decision Record - text export of the Claude Doc.txt`, lines 730-731, 775-781 [2026-11-01 07:45]

## The record, word for word [2026-11-01 07:45]

Computers and the Natives (D7):
 should computers be able to court them?

4b. Natives and computers. DECIDED (Albert, Oct 31), FLAGGED: LIVE TEST IN PROCESS.
Rule: Natives and hazard people never start a fight with a computer. They fight only the unit or units that struck a Native or its camp, do not switch to a unit that did not, and chase no farther than the camp's own radius, then return home. An instigator that escapes escapes. Raids also skip computers. Player rules are unchanged.
Logic: leash-and-reset, as neutral camps work in Warcraft-style games; territorial animals stop pursuing at their border (general knowledge, not looked up). It makes the computers' gold and fights easier to read; it is a deliberate one-sided rule bend.
Needs: a short list of instigator ids on each camp, remembered for about a minute (the code stores only the last attacker); the C1 fix so animals stay hostile; an EXCEPTIONS.md entry as an experiment with an end condition (removed when computers can buy peace themselves, decision 4).
Measure before and after: camp-to-base distances over 100 seeds; 3 seeds x 30 minutes with and without: computers' gold, age-up times, attack arrival.
Parked: regard scaled inverse to score, B = 45 + 20 x (1 - score / leader's score), as a later test.
Code home: wildTick 14-sim-troops 413-497; hurt aggro 16-sim-fight 111; natRaid 38-natives 210; NATIVE in 05-rules-wild 71.
