import { NS } from '@ns';
import { minute_ms } from '@/utils/consts';
import { Augmentation } from '@/utils/Augment';
import { NameToFaction, Factions } from './Faction';

export async function main(ns: NS) {
  const args = ns.flags([
    ['faction', 'CSEC'],
    ['pid', 0],
    ['help', false],
  ]);

  if (args.help) {
    ns.tprint("Work at a company until you are able to join it's faction");
    ns.tprint(`Usage: run ${ns.getScriptName()} --faction FACTION`);
    ns.tprint(`Example:`);
    ns.tprint(`> run ${ns.getScriptName()} --faction CSEC`);
    return;
  }
  while (ns.isRunning(args.pid as number)) {
    await ns.sleep(minute_ms);
  }

  await doFactionJob(ns, args.faction.toString(), true);
}

export async function doFactionJob(ns: NS, faction: string, focus: boolean) {
  const aug_list = ns.singularity.getAugmentationsFromFaction(faction);
  const augs = [];
  for (const a of aug_list) {
    if (!ns.singularity.getOwnedAugmentations(true).includes(a)) augs.push(new Augmentation(ns, faction, a));
  }

  for (const a of augs) {
    const wt = ns.enums.FactionWorkType;
    let work_type = wt.security;
    const faction_idx = NameToFaction(faction);

    if (
      faction_contains(Factions.corporations, faction_idx) ||
      faction_contains(Factions.hacking, faction_idx) ||
      faction_contains(Factions.city, faction_idx) ||
      faction_contains(Factions.early, faction_idx)
    ) {
      work_type = wt.hacking;
    } else if (faction_contains(Factions.crime, faction_idx)) {
      work_type = wt.field;
    }

    ns.singularity.workForFaction(faction, work_type, focus);
    // work for faction until we have the necessary rep
    ns.print(`Working towards ${a.name}...`);
    while (ns.singularity.getFactionRep(faction) < a.reputation) {
      await ns.sleep(1000 * 60);
    }
  }
  ns.print(`Acheeived reputation for all Faction Augments...`);
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function faction_contains(obj: any, item: any) {
  return Object.values(obj).includes(item);
}
