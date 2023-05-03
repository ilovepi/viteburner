import { NS } from '@ns';
import { getPurchasableAugmentationList } from './PurchasableAugmentation';
import { minute_ms } from './consts';

export async function main(ns: NS) {
  let price = 0;
  let funds = 0;
  const aug_list = getPurchasableAugmentationList(ns);

  aug_list.sort((a, b) => b.price - a.price);
  for (const aug of aug_list) {
    price = ns.singularity.getAugmentationPrice(aug.name);
    funds = ns.getServerMoneyAvailable('home');
    if (price < funds) {
      aug.purchaseAug(ns);
    }
    await ns.sleep(1);
  }

  let did_buy;
  do {
    did_buy = false;
    const factions = ns.getPlayer().factions;
    const faction = factions.sort((a, b) => {
      return ns.singularity.getFactionRep(b) - ns.singularity.getFactionRep(a);
    })[0];

    const augs = ns.singularity.getAugmentationsFromFaction(faction);
    for (const x of augs) {
      price = ns.singularity.getAugmentationPrice(x);
      funds = ns.getServerMoneyAvailable('home');
      if (price < funds) {
        did_buy = ns.singularity.purchaseAugmentation(faction, x);
      }
    }
    await ns.sleep(1);
  } while (did_buy && price < funds && funds > 1e6);

  let pid = 0;
  do {
    // sometimes this doesn't start and we ge into trouble! So try until it starts ...
    pid = ns.exec('/utils/backdoor_all.js', 'home');
    await ns.sleep(100);
  } while (pid === 0);

  while (ns.isRunning(pid)) {
    // sleep for a minute and check again
    await ns.sleep(minute_ms);
  }

  ns.singularity.installAugmentations('/manager/run_manager.js');
}
