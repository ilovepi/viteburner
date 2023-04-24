import { createServerData } from '@/servers/ServerData';
import { second_ms } from '@/utils/consts';
import { distributeHackingScripts, nuke, find_all_servers } from '@/utils/utils';
import { NS } from '@ns';
import { Scripts } from './hacking_constants';

// We want this to be fairly unsophisticated so we can efficiently hack w/ only 8gb of ram.
// Once we can upgrade to 16 GB, we should, and we should start the manager ASAP.

export async function main(ns: NS) {
  const args = ns.flags([
    ['help', false],
    ['target', 'CSEC'],
    ['name', 'CyberSec'],
  ]);
  if (args.help) {
    ns.tprint('Hack, hack, hack as much as you can!');
    ns.tprint(`Usage: run ${ns.getScriptName()} --target HOST`);
    ns.tprint(`Example:`);
    ns.tprint(`> run ${ns.getScriptName()} --target n00dles`);
    return;
  }

  ns.tail();
  do {
    const server_names = find_all_servers(ns);
    const servers = server_names.map((host) => createServerData(ns, host));

    servers.forEach((server) => ns.print(server));
    // root any servers that we can
    servers
      .filter((server) => server.can_hack && !server.is_rooted)
      .forEach((server) => {
        nuke(ns, server.name);
        distributeHackingScripts(ns, server.name);
      });

    const workers = servers.filter((server) => server.is_rooted);
    //.forEach((server) => {});

    const target = 'n00dles';

    workers.forEach((s) => ns.exec(Scripts.basic, s.name, Math.floor(s.ram / 1.75), '--target', target));

    // const prepping_pids = servers
    //   .filter((server) => server.cur_money < server.max_money * 0.8 || server.cur_sec > server.min_sec + 2)
    //   .forEach((server) => prepareServer(ns, server, workers));
    // const attacking_pids = servers
    //   .filter((server) => server.cur_money > server.max_money * 0.8 && server.cur_sec <= server.min_sec + 2)
    //   .forEach((server) => attackServer(ns, server, workers));

    await ns.sleep(second_ms);
  } while (true);
}
