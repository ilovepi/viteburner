import { NS } from '@ns';

export async function main(ns: NS) {
  // hack.js [target] [delay] [sleep] [-l] [id]
  const args = ns.flags([
    ['target', 'n00dles'],
    ['loop', false],
  ]);
  await ns.sleep(args.delay as number);
  const host = args.target.toString();
  do {
    if (ns.getServerSecurityLevel(host) > ns.getServerMinSecurityLevel(host)) {
      await ns.weaken(host, { stock: false });
    } else if (ns.getServerMaxMoney(host) > ns.getServerMoneyAvailable(host)) {
      await ns.grow(host, { stock: false });
    } else {
      await ns.hack(host, { stock: false });
    }
    await ns.sleep(100);
  } while (args.loop as boolean);
}
