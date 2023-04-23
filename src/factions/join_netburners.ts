import { NS } from '@ns';
import { minute_ms, second_ms } from '@/utils/consts';
import { waitForHackingLevel, waitForInviteAndJoin, waitForMoney } from '@/utils/utils';

export async function main(ns: NS) {
  const args = ns.flags([
    ['help', false],
    ['target', 'n00dles'],
  ]);
  if (args.help) {
    ns.tprint('Try to backdoor a specific server');
    ns.tprint(`Usage: run ${ns.getScriptName()} SERVER`);
    ns.tprint(`Example:`);
    ns.tprint(`> run ${ns.getScriptName()} --target n00dles`);
    return;
  }

  //TODO: make this more efficient by buying 10 servers and splitting any purchases between them
  const hacknet = ns.hacknet;
  await waitForHackingLevel(ns, 80);
  // do we need to buy a node?
  if (hacknet.numNodes() == 0) {
    await waitForMoney(ns, hacknet.getPurchaseNodeCost());
    hacknet.purchaseNode();
  }
  // 100 hacknet levels
  await waitForMoney(ns, hacknet.getLevelUpgradeCost(0, 3));
  hacknet.upgradeLevel(0, 100);
  // 8GM RAM in hacknet
  await waitForMoney(ns, hacknet.getRamUpgradeCost(0, 3));
  hacknet.upgradeRam(0, 3);
  // 4 hacknet cores
  await waitForMoney(ns, hacknet.getCoreUpgradeCost(0, 3));
  hacknet.upgradeCore(0, 3);
  await waitForInviteAndJoin(ns, 'Netburners');
}
