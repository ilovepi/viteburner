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
  await waitForHackingLevel(ns, 50);

  // accumulate $1M
  await waitForMoney(ns, 1_000_000);

  // be in chongqing, newtokyo, ishima
  ns.singularity.travelToCity(ns.enums.CityName.Chongqing);
  await waitForInviteAndJoin(ns, FactionToName(Factions.early.tiandihui));
}
