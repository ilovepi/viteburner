import { doFactionJob, getAllFactions, joinFaction } from '@/factions/Faction';
import { NS } from '@ns';

export class Manager {
  ns: NS;
  constructor(ns: NS) {
    this.ns = ns;
  }

  UpgradeRam() {
    // may need to wait here if we wanto to loop forever
    const host = 'home';
    const money = this.ns.getServerMoneyAvailable(host);
    const ram_cost = this.ns.singularity.getUpgradeHomeRamCost();
    if (money > ram_cost) this.ns.singularity.upgradeHomeRam();
  }

  findNextFaction() {
    const factions = getAllFactions();
    for (const f of factions) {
      // this faction is only a candidate if we don't have all their augments
      const my_augs = this.ns.singularity.getOwnedAugmentations(true);
      const fact_augs = this.ns.singularity.getAugmentationsFromFaction(f);
      if (fact_augs.some((a) => !my_augs.includes(a))) {
        return f;
      }
    }
    return 'none';
  }

  async doNextTask() {
    const faction = this.findNextFaction();
    await joinFaction(this.ns, faction);
    await doFactionJob(this.ns, faction, true);
  }

  async run(loop: boolean) {
    // main loop
    do {
      this.buyPrograms();
      this.UpgradeRam();
      // this.upgradeServers();
      await this.doNextTask();
      await this.ns.sleep(1000);
    } while (loop);
  }

  buyPrograms() {
    return this.ns.exec('/utils/buy_programs.js', 'home');
  }
}

// Manager should orchestrate the actions based on goals

// Initally we want to do a few things in the early game
// 1. buy a ram upgrade
// 2. join CSEC
// 3. earn enough rep to buy CSEC augments

// That is actually kind of the pattern
// 1. if possible upgrade home ram
// 2. otherwise, maybe buy/upgrade a server
// 3. work towards getting enough rep + money to buy out a faction
// 4. install augments
// 5. repeat

// Goals here should have priorities
// We basically always want to maximize home ram, so its fine to delay restart to bump that
// We should try to get all the cheap augments first
// so we need a list of all factions
// - Join conditions
// and then we need to work for the faction rep.
// Corps are a bit more complicated, since you have to work a job first, then join the corp
// We basically always want to do corps really late, since they take so much company rep + faction rep

// rough ordering
// =============

// early game
// hacking
// cities
// gangs
// corps
// end game

// all that time, we want the manager accumulating $$$.
// we need it to be hacking at a furious rate.
// so its important that we tune the scheduler to do a good job w/ the resources availible
//
// Batch time is more or less fixed once everything starts
// That will be even more predictable w/ the new apis for delay on HWG
