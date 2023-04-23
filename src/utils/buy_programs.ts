import { NS } from '@ns';

export async function main(ns: NS) {
  ns.singularity.purchaseTor();
  buyProg(ns, 'BruteSSH.exe');
  buyProg(ns, 'FTPCrack.exe');
  buyProg(ns, 'relaySMTP.exe');
  buyProg(ns, 'HTTPWorm.exe');
  buyProg(ns, 'SQLInject.exe');
  buyProg(ns, 'Formulas.exe');
  buyProg(ns, 'Autolink.exe');
  buyProg(ns, 'DeepscanV2.exe');
  buyProg(ns, 'ServerProfiler.exe');
  buyProg(ns, 'DeepscanV1.exe');
}

export function buyProg(ns: NS, name: string) {
  if (!ns.fileExists(name, 'home')) ns.singularity.purchaseProgram(name);
}
