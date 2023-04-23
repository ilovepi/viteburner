import { NS } from '@ns';
import { getAugmentationList } from './Augment';

export async function main(ns: NS) {
  ns.tprint(getAugmentationList(ns));
}
