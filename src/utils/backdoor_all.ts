import { NS } from '@ns';
import { NetworkMap, backdoor_server, max_depth } from './backdoor';

export async function main(ns: NS) {
  const args = ns.flags([['help', false]]);

  if (args.help) {
    ns.tprint('Try to backdoor all servers in the network');
    ns.tprint(`Usage: run ${ns.getScriptName()}`);
    ns.tprint(`Example:`);
    ns.tprint(`> run ${ns.getScriptName()}`);
    return;
  }

  const visited: string[] = [];
  const cur_path: string[] = [];
  const path_map: Map<string, string[]> = new Map();
  NetworkMap(ns, ns.getHostname(), visited, cur_path, path_map, max_depth);
  for (const [host, path] of path_map.entries()) {
    await backdoor_server(ns, host, path);
  }
}
