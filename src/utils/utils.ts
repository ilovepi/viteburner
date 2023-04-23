import { NS } from '@ns';

export function find_all_servers(ns: NS) {
  const visited: string[] = [];
  const worklist = [ns.getHostname()];
  while (worklist.length != 0) {
    const target = worklist.pop();
    if (target == undefined) continue;
    visited.push(target);
    const adjacent = ns.scan(target);
    for (const host of adjacent) {
      if (visited.includes(host)) {
        continue;
      } else {
        worklist.push(host);
      }
    }
  }
  return visited;
}

export function breakPorts(ns: NS, hostname: string) {
  // try to open every port we can
  const home = 'home';
  if (ns.fileExists('BruteSSH.exe', home)) ns.brutessh(hostname);
  if (ns.fileExists('FTPCrack.exe', home)) ns.ftpcrack(hostname);
  if (ns.fileExists('relaySMTP.exe', home)) ns.relaysmtp(hostname);
  if (ns.fileExists('HTTPWorm.exe', home)) ns.httpworm(hostname);
  if (ns.fileExists('SQLInject.exe', home)) ns.sqlinject(hostname);
}

export function crack_counts(ns: NS) {
  let count = 0;
  const files = ['BruteSSH.exe', 'FTPCrack.exe', 'relaySMTP.exe', 'HTTPWorm.exe', 'SQLInject.exe'];
  for (const f of files) {
    if (ns.fileExists(f, 'home')) count++;
  }
  return count;
}

export function can_hack(ns: NS, target: string) {
  const rootable = can_root(ns, target);
  const hacking_ability = ns.getHackingLevel();
  const required_level = ns.getServerRequiredHackingLevel(target);
  return required_level < hacking_ability && rootable;
}

export function can_root(ns: NS, target: string) {
  const ports = ns.getServerNumPortsRequired(target);
  return ports <= crack_counts(ns);
}
