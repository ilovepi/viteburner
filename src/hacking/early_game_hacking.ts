import { createServerData } from '@/servers/ServerData';
import { second_ms } from '@/utils/consts';
import { distributeHackingScripts, nuke, find_all_servers } from '@/utils/utils';
import { NS } from '@ns';
import { prepareServer, attackServer } from './hacking_utils';

// We want this to be fairly unsophisticated so we can efficiently hack w/ only 8gb of ram.
// Once we can upgrade to 16 GB, we should, and we should start the manager ASAP.

export async function main(ns: NS) {
  const args = ns.flags([
    ['help', false],
    ['target', 'n00dles'],
    ['name', 'CyberSec'],
  ]);
  if (args.help) {
    ns.tprint('Hack, hack, hack as much as you can!');
    ns.tprint(`Usage: run ${ns.getScriptName()} --target HOST`);
    ns.tprint(`Example: `);
    ns.tprint(`> run ${ns.getScriptName()} --target n00dles`);
    return;
  }

  let running_prep: Map<string, number[]> = new Map();
  // const target = args.target.toString();
  ns.tail();
  do {
    ns.print('Scanning all servers...');
    const server_names = find_all_servers(ns);
    ns.print('Analyzing network ...');
    const servers = server_names.map((host) => createServerData(ns, host));

    //servers.forEach((server) => ns.print(server));
    ns.print('Distributing exploits to new workers...');
    // root any servers that we can
    servers
      .filter((server) => server.can_hack && !server.is_rooted)
      .forEach((server) => {
        nuke(ns, server.name);
      });

    ns.print('Collecting workers ...');
    const workers = servers.filter((server) => server.is_rooted);
    workers.forEach((server) => {
      distributeHackingScripts(ns, server.name);
    });

    ns.print('Start Exploits ...');

    // This is good for low ram ... need to figure out how to manage that better
    // workers.forEach((s) => {
    //   const avail_ram = s.ram - ns.getServerUsedRam(s.name);
    //   const threads = Math.floor(avail_ram / 2.4);
    //   if (threads == 0) {
    //     ns.print(`Not Enough ram to run script`);
    //     return;
    //   }
    //   let opts = default_opts();
    //   opts.threads = threads
    //   const pid = ns.exec(Scripts.basic, s.name, opts, '--target', target, '--loop');
    //   ns.print(`host = ${s.name}, pid = ${pid}`);
    // });
    //ns.print(workers);

    running_prep.forEach((v, k) => {
      if (!v.some((pid) => ns.isRunning(pid))) {
        running_prep.delete(k);
      }
    });

    const prepping_pids = new Map(
      workers
        .filter((server) => !running_prep.has(server.name))
        .filter((server) => server.cur_money < server.max_money * 0.8 || server.cur_sec > server.min_sec + 2)
        .sort((a, b) => a.weaken_time - b.weaken_time)
        .map((server) => [server.name, prepareServer(ns, server, workers)]),
    );

    running_prep = new Map([...running_prep, ...prepping_pids]);

    const targets_servers = workers
      .filter((server) => server.is_rooted)
      .filter((server) => !running_prep.has(server.name))
      .filter(
        (server) =>
          server.max_money > 0 &&
          server.cur_money > 0 &&
          server.cur_money > server.max_money * 0.8 &&
          server.cur_sec <= server.min_sec + 2,
      )
      .sort((a, b) => b.max_money - a.max_money);
    const attacking_pids = new Map(targets_servers.map((server) => [server.name, attackServer(ns, server, workers)]));
    if (attacking_pids.size != 0) ns.print(targets_servers);

    ns.print(`Sleeping for 1 second`);
    await ns.sleep(second_ms);
  } while (true);
}
