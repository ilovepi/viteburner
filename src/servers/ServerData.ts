import { can_hack } from '@/utils/utils';
import { NS } from '@ns';

export class ServerData {
  name: string;
  is_rooted: boolean;
  can_hack: boolean;
  ram: number;
  max_money: number;
  cur_money: number;
  min_sec: number;
  cur_sec: number;
  hack_rate: number;
  hack_time: number;
  grow_time: number;
  weaken_time: number;

  constructor(
    hostname: string,
    is_rooted: boolean,
    can_hack: boolean,
    ram: number,
    max_money: number,
    cur_money: number,
    min_sec: number,
    cur_sec: number,
    hack_rate: number,
    hack_time: number,
    grow_time: number,
    weaken_time: number,
  ) {
    this.name = hostname;
    this.is_rooted = is_rooted;
    this.can_hack = can_hack;
    this.ram = ram;
    this.max_money = max_money;
    this.cur_money = cur_money;
    this.min_sec = min_sec;
    this.cur_sec = cur_sec;
    this.hack_rate = hack_rate;
    this.hack_time = hack_time;
    this.grow_time = grow_time;
    this.weaken_time = weaken_time;
  }
}

export function createServerData(ns: NS, host: string) {
  ns.disableLog('ALL');
  return new ServerData(
    host,
    ns.hasRootAccess(host),
    can_hack(ns, host),
    ns.getServerMaxRam(host),
    ns.getServerMaxMoney(host),
    ns.getServerMoneyAvailable(host),
    ns.getServerMinSecurityLevel(host),
    ns.getServerSecurityLevel(host),
    ns.hackAnalyze(host),
    ns.getHackTime(host),
    ns.getGrowTime(host),
    ns.getWeakenTime(host),
  );
}
