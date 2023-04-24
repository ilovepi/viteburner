import { CityName, NS } from '@ns';
import { waitForInviteAndJoin, waitForMoney, waitForPidAndJoin } from '@/utils/utils';
import { minute_ms, second_ms } from '@/utils/consts';

export async function main(ns: NS) {
  const args = ns.flags([
    ['help', false],
    ['city', ns.enums.CityName.Chongqing],
    ['gang', 'SlumSnakes'],
    ['combat', 30],
    ['money', 1e6],
    ['karma', -9],
    ['hacking', 1],
  ]);
  if (args.help) {
    ns.tprint('Travel to a city and try to join a gang');
    ns.tprint(`Usage: run ${ns.getScriptName()} --city CITY, --gang GANG --combat COMBAT --money MONEY --karma KARMA`);
    ns.tprint(`Example:`);
    ns.tprint(`> run ${ns.getScriptName()} --city ChongChing --gang SlumSnakes --combat 30 --money 1000000 --karma -9`);
    return;
  }
  ns.disableLog('sleep');
  // combat stat level
  await trainCombatStats(ns, args.combat as number);
  // hacking level
  while (ns.getHackingLevel() < (args.hacking as number)) {
    await ns.sleep(minute_ms);
  }
  // money
  await waitForMoney(ns, args.money as number);

  //city
  while (!ns.singularity.travelToCity(args.city as CityName)) {
    await ns.sleep(100);
  }
  const gang = args.gang.toString();
  // karma just kill people ... we'll get bad karma and raise the kill count ...
  while (!ns.singularity.checkFactionInvitations().includes(gang)) {
    await ns.sleep(ns.singularity.commitCrime(ns.enums.CrimeType.homicide));
  }
  ns.singularity.joinFaction(gang);
}

async function trainCombatStats(ns: NS, combat_level: number) {
  // TODO: pic an optimal gym. Iron Gym is kina weak
  // travel to sector 12
  ns.singularity.travelToCity(ns.enums.CityName.Sector12);
  for (const stat of stats) {
    while (getPlayerStat(ns, stat) < combat_level) {
      ns.singularity.gymWorkout('iron gym', stat);
      await ns.sleep(minute_ms);
    }
  }
}

const stats = ['str', 'def', 'dex', 'agi'];

function getPlayerStat(ns: NS, stat: string) {
  const skills = ns.getPlayer().skills;
  const skillMap = new Map([
    ['str', skills.strength],
    ['strength', skills.strength],
    ['def', skills.defense],
    ['defense', skills.defense],
    ['dex', skills.dexterity],
    ['dexterity', skills.dexterity],
    ['agi', skills.agility],
    ['agility', skills.agility],
  ]);
  return skillMap.get(stat) ?? -1;
}
