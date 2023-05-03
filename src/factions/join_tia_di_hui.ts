import { NS } from '@ns';
import { waitForMoney, waitForInviteAndJoin, waitForHackingLevel } from '@/utils/utils';
import { FactionToName, Factions } from './Faction';

export async function main(ns: NS) {
  const args = ns.flags([['help', false]]);
  if (args.help) {
    ns.tprint('Join Tian Di Hui faction');
    ns.tprint(`Usage: run ${ns.getScriptName()}`);
    ns.tprint(`Example:`);
    ns.tprint(`> run ${ns.getScriptName()}`);
    return;
  }
  const faction_name = FactionToName(Factions.early.tiandihui);
  if (ns.getPlayer().factions.includes(faction_name)) return;
  await waitForHackingLevel(ns, 50);

  if (ns.getPlayer().factions.includes(faction_name)) return;
  // accumulate $1M
  await waitForMoney(ns, 1_000_000);

  if (ns.getPlayer().factions.includes(faction_name)) return;
  // be in chongqing, newtokyo, ishima
  ns.singularity.travelToCity(ns.enums.CityName.Chongqing);
  await waitForInviteAndJoin(ns, faction_name);
}
