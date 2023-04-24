import { NS } from '@ns';
import { ServerData } from './ServerData';

export class ServerHackAnalysis {
  ns: NS;
  threads: Threads;
  target_money: number;
  weaken_val: number;
  security_grow_initial: number;
  security_grow: number;
  security_hack: number;
  constructor(ns: NS, server: ServerData, hack_ratio: number) {
    this.ns = ns;
    //this.target_money =
    const thread_hack = Math.ceil(hack_ratio / server.hack_rate);
    // const t_h = ns.hackAnalyzeThreads(server.name, server.max_money * hack_ratio);
    const security_hack = ns.hackAnalyzeSecurity(thread_hack);
    // this.hack_chance = ns.hackAnalyzeChance(server.name);

    // grow stats
    const ratio = needAlternateRatio() ? 2 : server.max_money / server.cur_money;
    const thread_grow_inital = Math.ceil(ns.growthAnalyze(server.name, ratio));
    const thread_grow = Math.ceil(ns.growthAnalyze(server.name, 1 / (1 - hack_ratio)));
    const security_grow_initial = ns.growthAnalyzeSecurity(thread_grow_inital);
    const security_grow = ns.growthAnalyzeSecurity(thread_grow);

    // weaken stats
    const weaken_value = ns.weakenAnalyze(1);
    const thread_weaken_initial = Math.max(1, Math.ceil((server.cur_sec - server.min_sec) / weaken_value));
    const thread_weaken_grow_initial = Math.ceil(security_grow_initial / weaken_value);
    const thread_weaken_grow = Math.ceil(security_grow / weaken_value);
    const thread_weaken_hack = Math.ceil(security_hack / weaken_value);

    this.security_grow_initial = security_grow_initial;
    this.security_grow = security_grow;
    this.security_hack = security_hack;
    this.weaken_val = weaken_value;
    this.target_money = server.hack_rate * thread_hack * server.max_money;

    this.threads = new Threads(
      thread_hack,
      thread_grow,
      thread_grow_inital,
      thread_weaken_hack,
      thread_weaken_initial,
      thread_weaken_grow_initial,
      thread_weaken_grow,
    );

    function needAlternateRatio() {
      return server.max_money == 0 || server.cur_money == 0 || server.max_money == server.cur_money;
    }
  }
}

export class Threads {
  hack: number;
  grow: number;
  grow_inital: number;
  weaken_initial: number;
  weaken_grow_initial: number;
  weaken_grow: number;
  weaken_hack: number;

  constructor(
    hack: number,
    grow: number,
    grow_initial: number,
    weaken_hack: number,
    weaken_initial: number,
    weaken_grow_initial: number,
    weaken_grow: number,
  ) {
    this.hack = hack;
    this.grow = grow;
    this.grow_inital = grow_initial;
    this.weaken_initial = weaken_initial;
    this.weaken_grow_initial = weaken_grow_initial;
    this.weaken_hack = weaken_hack;
    this.weaken_grow = weaken_grow;
  }
}
