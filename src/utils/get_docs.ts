import { NS } from '@ns';
import { find_all_servers } from './utils';

export async function main(ns: NS) {
  const servers = await find_all_servers(ns);
  const home = 'home';
  for (const s of servers) {
    const files = ns.ls(s, '.lit');
    for (const f of files) {
      ns.tprintf('%s: %s', s, f);
      if (!ns.fileExists(f, home)) ns.scp(f, home, s);
    }
  }
}
