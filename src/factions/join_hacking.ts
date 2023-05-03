import { NS } from '@ns';
import { waitForPidAndJoin } from '@/utils/utils';
import { default_opts, second_ms } from '@/utils/consts';

export async function main(ns: NS) {
  const args = ns.flags([
    ['help', false],
    ['target', 'CSEC'],
    ['name', 'CyberSec'],
  ]);
  ns.disableLog('sleep');
  if (args.help) {
    ns.tprint('Travel to a city and try to join their faction');
    ns.tprint(`Usage: run ${ns.getScriptName()} --target HOST, --name FACTION`);
    ns.tprint(`Example:`);
    ns.tprint(`> run ${ns.getScriptName()} --target CSEC --name CyberSec`);
    return;
  }
  await joinHacking(ns, args.target.toString(), args.name.toString());
}

async function joinHacking(ns: NS, host: string, faction: string) {
  const start = performance.now();
  ns.print(
    `Current Hacking level: ${ns.getHackingLevel()}, Target Hacking level: ${ns.getServerRequiredHackingLevel(host)}`,
  );
  while (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(host)) {
    await ns.sleep(second_ms);
  }
  ns.print(`Hacking level cumulative wait: ${performance.now() - start} ms`);

  const pid = await runBackdoor(ns, host);
  await waitForPidAndJoin(ns, pid, faction);
}

async function runBackdoor(ns: NS, host: string) {
  let pid = 0;
  const start = performance.now();
  do {
    // sometimes this doesn't start and we ge into trouble! So, keep trying until we start backdooring the server ...
    pid = ns.exec('/utils/backdoor.js', 'home', default_opts(), '--target', host);
    await ns.sleep(100);
    ns.print(`Backdoor cumulative wait: ${performance.now() - start} ms`);
  } while (pid === 0);
  return pid;
}
