import { NS } from '@ns';
import { can_hack } from './utils';

export const max_depth = 100;

export async function main(ns: NS) {
  const args = ns.flags([
    ['help', false],
    ['target', 'n00dles'],
  ]);
  if (args.help) {
    ns.tprint('Try to backdoor a specific server');
    ns.tprint(`Usage: run ${ns.getScriptName()} SERVER`);
    ns.tprint(`Example:`);
    ns.tprint(`> run ${ns.getScriptName()} --target n00dles`);
    return;
  }

  const visited: string[] = [];
  const cur_path: string[] = [];
  const path_map: Map<string, string[]> = new Map();
  NetworkMap(ns, ns.getHostname(), visited, cur_path, path_map, max_depth);

  const host = args.target.toString();
  const path = path_map.get(host);
  await backdoor_server(ns, host, path);
}

export async function backdoor_server(ns: NS, host: string, path: string[] | undefined) {
  if (path == undefined) return;
  if (ns.getServer(host).backdoorInstalled) return;
  if (!can_hack(ns, host)) return;
  // connect to target
  connect(ns, path);
  while (!ns.getServer(host).backdoorInstalled) await ns.singularity.installBackdoor();
  // come back to where we started
  connect(ns, path.slice().reverse());
}

function connect(ns: NS, path: string[]) {
  for (const p of path) {
    ns.singularity.connect(p);
  }
}

export function NetworkMap(
  ns: NS,
  node: string,
  visited: string[],
  path: string[],
  path_map: Map<string, string[]>,
  depth: number,
) {
  if (depth == 0) {
    ns.tprint('Error: Hit max depth limit!');
  }
  visited.push(node);
  path.push(node);
  path_map.set(node, [...path]);
  const adjacent = ns.scan(node);
  for (const a of adjacent) {
    if (visited.includes(a)) {
      continue;
    }
    NetworkMap(ns, a, visited, path, path_map, depth - 1);
  }
  path.pop();
}
