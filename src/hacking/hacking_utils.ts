import { ServerData } from '@/servers/ServerData';
import { ServerHackAnalysis } from '@/servers/ServerHackAnalysis';
import { NS } from '@ns';
import { Scripts } from './hacking_constants';
import { default_opts } from '@/utils/consts';

const hack_ratio = 0.1;

export function attackServer(ns: NS, target: ServerData, workers: ServerData[], ratio: number = hack_ratio) {
  // handle weaken first
  const script_ram = 1.75;
  const script = Scripts.weaken;
  const delta = 50;
  const grow_delay = target.weaken_time - target.grow_time;
  const hack_delay = target.weaken_time - target.hack_time;
  const attack_data = new ServerHackAnalysis(ns, target, ratio);

  const pids: number[] = [];
  pids.push(...runScript(target.name, workers, ns, 1.7, attack_data.threads.hack, Scripts.hack, hack_delay + delta));
  pids.push(...runScript(target.name, workers, ns, script_ram, attack_data.threads.weaken_hack, script, 2 * delta));
  pids.push(
    ...runScript(target.name, workers, ns, 1.7, attack_data.threads.grow, Scripts.grow, grow_delay + 3 * delta),
  );
  pids.push(...runScript(target.name, workers, ns, script_ram, attack_data.threads.weaken_grow, script, 4 * delta));
  return pids;
}

export function prepareServer(ns: NS, target: ServerData, workers: ServerData[]) {
  const attack_data = new ServerHackAnalysis(ns, target, hack_ratio);
  // handle weaken first
  const weaken_threds = attack_data.threads.weaken_initial;
  const script_ram = 1.75;
  const script = Scripts.weaken;
  const delta = 50;
  const sleep_time = target.weaken_time - target.grow_time + delta;
  const pids: number[] = [];
  pids.push(...runScript(target.name, workers, ns, script_ram, weaken_threds, script, 0));
  pids.push(...runScript(target.name, workers, ns, 1.7, attack_data.threads.grow_inital, Scripts.grow, sleep_time));
  pids.push(
    ...runScript(target.name, workers, ns, script_ram, attack_data.threads.weaken_grow_initial, script, 2 * delta),
  );
  return pids;
}

let id = 0;
export function runScript(
  target: string,
  workers: ServerData[],
  ns: NS,
  script_ram: number,
  weaken_threads: number,
  script: string,
  sleep_time: number,
) {
  const pids: number[] = [];
  for (const server of workers) {
    // we're done
    if (weaken_threads < 1) break;
    const avail_threads = getAvailibleThreads(ns, server, script_ram);
    // we can't run jack
    if (avail_threads < 1) continue;
    if (avail_threads >= weaken_threads) {
      // we have enough memory to run everything else, so just run them all
      const opts = default_opts();
      opts.threads = weaken_threads;
      pids.push(ns.exec(script, server.name, opts, ...getExploitArg(target, 0, sleep_time)));
      return pids;
    }

    // run as much as we can and let the other workers handle the rest...
    weaken_threads -= avail_threads;
    const opts = default_opts();
    opts.threads = avail_threads;
    pids.push(ns.exec(script, server.name, opts, ...getExploitArg(target, 0, sleep_time)));
  }
  return pids;
}

export function getExploitArg(target: string, delay: number, sleep_time: number) {
  return ['--target', target, '--delay', delay, '--sleep', sleep_time, '--id', id++];
}

export function getAvailibleRam(ns: NS, server: ServerData) {
  const scale = server.name === 'home' ? 0.8 : 1;
  return Math.floor((server.ram - ns.getServerUsedRam(server.name)) * scale);
}

export function getAvailibleThreads(ns: NS, server: ServerData, script_ram: number) {
  const availible_ram = getAvailibleRam(ns, server);
  return Math.floor(availible_ram / script_ram);
}
