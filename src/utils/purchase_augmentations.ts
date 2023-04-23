import { NS } from '@ns';
import { getAugmentationList } from './Augment';

export async function main(ns: NS) {
  let price = 0;
  let money = 0;
  const aug_list = getAugmentationList(ns);

  aug_list.sort((a, b) => b.price - a.price);
  for (const aug of aug_list) {
    price = ns.singularity.getAugmentationPrice(aug.name);
    money = ns.getServerMoneyAvailable('home');
    if (price < money) {
      aug.purchaseAug(ns);
    }
    await ns.sleep(1);
  }

  let did_buy;
  do {
    did_buy = false;
    const factions = ns.getPlayer().factions;
    const faction = factions.sort((a, b) => {
      return ns.singularity.getFactionRep(b) <= ns.singularity.getFactionRep(a);
    })[0];

    const augs = ns.singularity.getAugmentationsFromFaction(faction);
    for (const x of augs) {
      price = ns.singularity.getAugmentationPrice(x);
      money = ns.getServerMoneyAvailable('home');
      if (price < money) {
        did_buy = ns.singularity.purchaseAugmentation(faction, x);
      }
    }
    await ns.sleep(1);
  } while (did_buy && price < money && money > 1e6);

  const pid = ns.exec('/scripts/backdoor.js', 'home');
  while (ns.isRunning(pid)) {
    // sleep for 30 seconds and check again
    await ns.sleep(30_000);
  }

  ns.singularity.installAugmentations('/manager/run_manager.js');
}
