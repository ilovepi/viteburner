import { NS } from '@ns';
import { Manager } from './Manager';

export async function main(ns: NS) {
  const manager = new Manager(ns);
  await manager.run(true);
}
