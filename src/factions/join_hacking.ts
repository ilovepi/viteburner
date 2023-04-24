import { NS } from '@ns';
import { waitForPidAndJoin } from '@/utils/utils';
import { second_ms } from '@/utils/consts';

export async function main(ns: NS) {
  const args = ns.flags([
    ['help', false],
    ['target', 'CSEC'],
    ['name', 'CyberSec'],
  ]);
  if (args.help) {
    ns.tprint('Travel to a city and try to join their faction');
    ns.tprint(`Usage: run ${ns.getScriptName()} --target HOST, --name FACTION`);
    ns.tprint(`Example:`);
    ns.tprint(`> run ${ns.getScriptName()} --target CSEC --name CyberSec`);
    return;
  }
  await joinHacking(ns, args.target.toString(), args.faction.toString());
}

async function joinHacking(ns: NS, host: string, faction: string) {
  while (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(host)) {
    await ns.sleep(second_ms);
  }
  const pid = ns.exec('/utils/backdoor.js', 'home', 1, '--target', host);
  await waitForPidAndJoin(ns, pid, faction);
}
