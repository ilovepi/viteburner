import { NS } from '@ns';
import { Augmentation } from './Augment';

export function getPurchasableAugmentationList(ns: NS) {
  const factions = ns.getPlayer().factions;
  const augs: PurchasableAugmentation[] = [];
  const my_augs = ns.singularity.getOwnedAugmentations(true);
  for (const f of factions) {
    const aug_list = ns.singularity.getAugmentationsFromFaction(f);
    for (const a of aug_list) {
      if (!my_augs.includes(a)) augs.push(new PurchasableAugmentation(ns, f, a));
    }
  }

  const s = JSON.stringify(augs, null, 1);
  ns.write('/data/augmentation_list.json.txt', s, 'w');
  return augs;
}

export class PurchasableAugmentation extends Augmentation {
  constructor(ns: NS, faction: string, name: string) {
    super(ns, faction, name);
  }
  purchaseAug(ns: NS) {
    for (const pre of this.prereqs) {
      new PurchasableAugmentation(ns, this.faction, pre).purchaseAug(ns);
    }
    ns.singularity.purchaseAugmentation(this.faction, this.name);
  }
}
