import { NS } from '@ns';

export class Augmentation {
  faction: string;
  name: string;
  price: number;
  prereqs: string[];
  reputation: number;

  constructor(ns: NS, faction: string, name: string) {
    this.faction = faction;
    this.name = name;
    this.price = ns.singularity.getAugmentationPrice(name);
    this.prereqs = ns.singularity.getAugmentationPrereq(name);
    this.reputation = ns.singularity.getAugmentationRepReq(name);
  }
}

// export function getMissingAugmentationList(ns: NS) {
//   const factions = ns.getPlayer().factions;
//   const augs: Augmentation[] = [];
//   const my_augs = ns.singularity.getOwnedAugmentations(true);
//   for (const f of factions) {
//     const aug_list = ns.singularity.getAugmentationsFromFaction(f);
//     for (const a of aug_list) {
//       if (!my_augs.includes(a)) augs.push(new Augmentation(ns, f, a));
//     }
//   }

//   const s = JSON.stringify(augs, null, 1);
//   ns.write('/data/augmentation_list.json.txt', s, 'w');
//   return augs;
// }
