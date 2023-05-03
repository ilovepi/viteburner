import { hour_ms } from '@/utils/consts';
import { NS } from '@ns';

const formatter = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' });

export async function main(ns: NS) {
  const args = ns.flags([
    ['loop', false],
    ['help', false],
  ]);

  if (args.help) {
    ns.tprint("Work at a company until you are able to join it's faction");
    ns.tprint(`Usage: run ${ns.getScriptName()} --faction FACTION`);
    ns.tprint(`Example:`);
    ns.tprint(`> run ${ns.getScriptName()} --faction CSEC`);
    return;
  }
  do {
    upgradeServers(ns);
    await ns.sleep(hour_ms);
  } while (args.loop);
}

export function upgradeServers(ns: NS) {
  const my_money = ns.getServerMoneyAvailable('home');
  ns.tprintf('Available %s', formatter.format(my_money));
  const servers = ns.getPurchasedServers();
  const per_server = my_money / Math.max(servers.length, 1);

  ns.tprintf('Per Server %s', formatter.format(per_server));
  const max_ram = ns.getPurchasedServerMaxRam();
  ns.tprintf('Max Ram: %d', max_ram);
  const min_server_ram = getPurchasedServerMinRam(ns);
  ns.tprintf('My Min Ram: %d', min_server_ram);

  let cost = 0;
  if (servers.length < 25) {
    const server_stats = determineServerSize(ns, max_ram, min_server_ram, cost, my_money);
    if (my_money > server_stats.cost) {
      ns.purchaseServer('s' + servers.length, server_stats.max_ram);
      return;
    }
  }

  ns.tprintf("Couldn't buy a new server. Trying to upgrade exsiting RAM...");
  const server_stats = determineServerSize(ns, max_ram, min_server_ram, cost, per_server);

  if (server_stats.max_ram < getPurchasedServerMinRam(ns)) {
    ns.tprintf(
      'Max Ram is not upgradable. Ram: %d, Cost: %s',
      server_stats.max_ram,
      formatter.format(server_stats.cost),
    );
    server_stats.max_ram = 2 * min_server_ram;
    cost = ns.getPurchasedServerCost(server_stats.max_ram);
    const total = cost * servers.length;

    ns.tprintf(
      'Cost of next upgrade: Ram: %d GB, Cost per server: %s, Total %s:',
      server_stats.max_ram,
      formatter.format(server_stats.cost),
      formatter.format(total),
    );
    return;
  }
  let min = servers[0];
  for (const s of servers) {
    if (ns.getServerMaxRam(s) < ns.getServerMaxRam(min)) {
      min = s;
    }
  }
  ns.killall(min);
  ns.deleteServer(min);
  ns.tprintf('Deleted server: %s', min);
  ns.purchaseServer(min, server_stats.max_ram);
  ns.tprintf('Purchased server: %s with %d', min, server_stats.max_ram);
}

function determineServerSize(ns: NS, max_ram: number, min_server_ram: number, cost: number, per_server: number) {
  while (max_ram >= min_server_ram) {
    cost = ns.getPurchasedServerCost(max_ram);
    if (per_server < cost) max_ram = max_ram / 2;
    else {
      ns.tprintf('Found Max Ram Upgrade: %d GB for %s', max_ram, formatter.format(cost));
      break;
    }
  }
  return { max_ram: max_ram, cost: cost };
}

export function getPurchasedServerMaxRam(ns: NS) {
  const servers = ns.getPurchasedServers();
  if (servers.length == 0) return 0;
  return servers.map((s: string) => ns.getServerMaxRam(s)).reduce((a: number, b: number) => Math.max(a, b), -Infinity);
}

export function getPurchasedServerMinRam(ns: NS) {
  const servers = ns.getPurchasedServers();
  if (servers.length == 0) return 0;
  return servers.map((s: string) => ns.getServerMaxRam(s)).reduce((a: number, b: number) => Math.min(a, b), Infinity);
}
