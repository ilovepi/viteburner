import { waitForInviteAndJoin } from '@/utils/utils';
import { NS } from '@ns';

const required_rep = 400_000;

export async function main(ns: NS) {
  const args = ns.flags([
    ['company', 'ECorp'],
    ['help', false],
  ]);

  if (args.help) {
    ns.tprint("Work at a company until you are able to join it's faction");
    ns.tprint(`Usage: run ${ns.getScriptName()} COMAPNY`);
    ns.tprint(`Example:`);
    ns.tprint(`> run ${ns.getScriptName()} ECorp`);
    return;
  }

  const corp = args.company.toString();

  if (shouldWorkAtCompany(ns, corp)) {
    while (
      (ns.singularity.applyToCompany(corp, 'software') || ns.getPlayer().jobs[corp] != undefined) &&
      ns.singularity.getCompanyRep(corp) < required_rep &&
      ns.singularity.workForCompany(corp, true)
    ) {
      await ns.sleep(60 * 1000);
    }
  }
  if (ns.singularity.getCompanyRep(corp) < required_rep) await waitForInviteAndJoin(ns, corp);
}

function shouldWorkAtCompany(ns: NS, company: string) {
  if (ns.getPlayer().factions.includes(company)) return false;
  if (ns.singularity.checkFactionInvitations().includes(company)) return false;
  const augs = ns.singularity.getAugmentationsFromFaction(company);
  const player_augs = ns.singularity.getOwnedAugmentations(true);
  const intersection = augs.filter((a) => player_augs.includes(a));
  if (intersection.length == augs.length) return false;

  return ns.singularity.getCompanyRep(company) < required_rep;
}
