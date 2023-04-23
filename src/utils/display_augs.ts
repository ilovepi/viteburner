// @ts-ignore
import { getAugmentationList } from "/scripts/augment.js";

/** @param {import(".").NS } ns */
export async function main(ns) {
    ns.tprint(getAugmentationList(ns))
 }