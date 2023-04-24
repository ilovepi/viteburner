import { NS } from '@ns';

export async function main(ns: NS) {
  // hack.js [target] [delay] [sleep] [-l] [id]
  const args = ns.flags([
    ['target', 'n00dles'],
    ['delay', 0],
    ['sleep', 0],
    ['loop', false],
    ['stocks', false],
    ['id', 0],
  ]);
  await ns.sleep(args.delay as number);
  const hostname = args.target.toString();
  do {
    // await ns.sleep(args.sleep as number);
    await ns.hack(hostname, { stock: args.stocks as boolean, additionalMsec: args.sleep as number });
    // const money =
    //   ns.getServerMoneyAvailable(hostname);
    // ns.tprint(`${hostname}: $${money}`);
  } while (args.loop as boolean);
}
