import { NS } from '@ns';

export async function main(ns: NS) {
  ns.tprint(ns.read('/data/augmentation_list.json.txt'));
}
