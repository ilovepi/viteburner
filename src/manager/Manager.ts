import { FactionToName, crime, getAllFactions, joinFaction } from '@/factions/Faction';
import { default_opts } from '@/utils/consts';
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

  UpgradeCores() {
    // may need to wait here if we wanto to loop forever
    const host = 'home';
    const money = this.ns.getServerMoneyAvailable(host);
    const ram_cost = this.ns.singularity.getUpgradeHomeCoresCost();
    if (money > ram_cost) this.ns.singularity.upgradeHomeCores();
  }

  purchaseServers() {
    return this.ns.exec('/servers/server_upgrade.js', 'home', default_opts(), '--loop');
  }

  findNextFaction() {
    const factions = getAllFactions();
    for (const f of factions) {
      if (f === FactionToName(crime.silhouette)) continue;
      // this faction is only a candidate if we don't have all their augments
      const my_augs = this.ns.singularity.getOwnedAugmentations(true);
      const fact_augs = this.ns.singularity.getAugmentationsFromFaction(f);
      if (fact_augs.some((a) => !my_augs.includes(a))) {
        this.ns.print(`Found Faction: ${f}`);
        return f;
      }
    }
    this.ns.print(`No Factions Availible...`);
    return 'none';
  }

  async doNextTask() {
    this.ns.print('Find Next Task');
    const faction = this.findNextFaction();
    const pid = await joinFaction(this.ns, faction);
    return this.ns.exec('/factions/do_faction_job.js', 'home', default_opts(), '--faction', faction, '--pid', pid);
  }

  async run(loop: boolean) {
    let hacking_pid = 0;
    let current_task = 0;
    let server_upgrade = 0;
    let task_complete = false;
    let task_started = false;
    // main loop
    do {
      if (!this.ns.isRunning(hacking_pid)) {
        hacking_pid = this.hacking();
      }

      this.buyPrograms();
      this.UpgradeRam();
      this.UpgradeCores();

      if (!this.ns.isRunning(server_upgrade)) {
        server_upgrade = this.purchaseServers();
      }

      if (!this.ns.isRunning(current_task)) {
        do {
          this.ns.print('Start looking for new Task');
          current_task = await this.doNextTask();
        } while (current_task == 0 && (await this.ns.sleep(50)));
        if (task_started) task_complete = true;
        task_started = true;
      } else if (task_complete && task_started) {
        this.ns.print('Tasks Complete');
        break;
      }
      await this.ns.sleep(1000);
    } while (loop && !task_complete);
    this.ns.kill(server_upgrade);
    this.augment();
  }
  hacking() {
    return this.ns.exec('/hacking/early_game_hacking.js', 'home', default_opts());
  }

  augment() {
    this.ns.print('Start Augmentation');
    return this.ns.exec('/utils/purchase_augmentations.js', 'home', default_opts());
  }

  buyPrograms() {
    return this.ns.exec('/utils/buy_programs.js', 'home', default_opts());
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
