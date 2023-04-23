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
  purchaseAug(ns: NS) {
    for (const pre of this.prereqs) {
      new Augmentation(ns, this.faction, pre).purchaseAug(ns);
    }
    ns.singularity.purchaseAugmentation(this.faction, this.name);
  }
}
