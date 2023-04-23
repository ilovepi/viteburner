import { Augmentation } from '@/utils/Augment';
import { minute_ms, second_ms } from '@/utils/consts';
import { waitForHackingLevel, waitForInviteAndJoin, waitForMoney, waitForPidAndJoin } from '@/utils/utils';
import { CityName, NS } from '@ns';

export enum early {
  cybersec,
  tiandihui,
  netburners,
}

export enum city {
  sector12 = 3,
  chonghicng,
  newtokyo,
  ishima,
  aevum,
  volhaven,
}

export enum hacking {
  nitsec = 9,
  blackhand,
  bitrunners,
}

export enum corporations {
  ecorp = 12,
  megacorp,
  kuagon,
  foursigma,
  nwo,
  bladeindustries,
  omnitek,
  bachman,
  clarke,
  fulcrum,
}

export enum crime {
  slimsnakes = 22,
  tetrads,
  silhouette,
  speakers,
  darkarmy,
  syndicate,
}

export enum endgame {
  covenant = 28,
  deadalus,
  illuminati,
}

export const Factions = {
  early: early,
  city: city,
  hacking: hacking,
  corporations: corporations,
  crime: crime,
  endgame: endgame,
};

const facts: string[] = [
  // early
  'CyberSec',
  'Tian Di Hui',
  'Netburners',
  //city
  'Sector-12',
  'Chongqing',
  'New Tokyo',
  'Ishima',
  'Aevum',
  'Volhaven',
  // hacking
  'NiteSec',
  'The Black Hand',
  'BitRunners',
  // corps
  'ECorp',
  'MegaCorp',
  'KuaiGong International',
  'Four Sigma',
  'NWO',
  'Blade Industries',
  'OmniTek Incorporated',
  'Bachman & Associates',
  'Clarke Incorporated',
  'Fulcrum Secret Technologies',
  // gangs
  'Slum Snakes',
  'Tetrads',
  'Silhouette',
  'Speakers for the Dead',
  'The Dark Army',
  'The Syndicate',
  //endgame
  'The Covenant',
  'Daedalus',
  'Illuminati',
];

export function FactionToName(idx: number) {
  return facts[idx];
}

export function NameToFaction(name: string) {
  return facts.findIndex((a) => a == name);
}

export function getAllFactions() {
  return facts;
}

const FactionPrereqs = new Map([
  ['CyberSec', joinCybersec],
  ['Tian Di Hui', joinTiaDiHui],
  ['Netburners', joinNetburners],
  ['Sector-12', joinSector12],
  ['Chongqing', joinChongqing],
  ['New Tokyo', joinNeoTokyo],
  ['Ishima', joinIshima],
  ['Aevum', joinAevum],
  ['Volhaven', joinVolhaven],
  ['NiteSec', joinNiteSec],
  ['The Black Hand', joinBlackHand],
  ['BitRunners', joinBitRunners],
  ['ECorp', joinEcorp],
  ['MegaCorp', joinMegaCorp],
  ['KuaiGong International', joinKuaiGong],
  ['Four Sigma', joinFourSigma],
  ['NWO', joinNWO],
  ['Blade Industries', joinBlade],
  ['OmniTek Incorporated', joinOmnitek],
  ['Bachman & Associates', joinBachman],
  ['Clarke Incorporated', joinClarke],
  ['Fulcrum Secret Technologies', joinFulcrum],
  ['Slum Snakes', joinSlumSnakes],
  ['Tetrads', joinTetrads],
  ['Silhouette', joinSilhouette],
  ['Speakers for the Dead', joinSpeakers],
  ['The Dark Army', joinDarkArmy],
  ['The Syndicate', joinSyndicate],
  ['The Covenant', joinCovenant],
  ['Daedalus', joinDeaedalus],
  ['Illuminati', joinIlluminati],
]);

async function joinCybersec(ns: NS) {
  // get min hacking
  await waitForHackingLevel(ns, 50);
  // backdoor csec server
  ns.exec('/utils/backdoor.js', 'home');
}

async function joinTiaDiHui(ns: NS) {
  // hacking >50
  await waitForHackingLevel(ns, 50);

  // accumulate $1M
  await waitForMoney(ns, 1_000_000);

  // be in chongqing, newtokyo, ishima
  ns.singularity.travelToCity(ns.enums.CityName.Chongqing);
  await ns.sleep(minute_ms);
  ns.singularity.joinFaction(FactionToName(Factions.early.tiandihui));
}

async function joinNetburners(ns: NS) {
  return ns.exec('/factions/join_netburners.js', 'home');
}

// cities
async function joinAevum(ns: NS) {
  await joinCity(ns, ns.enums.CityName.Aevum, 40 * 10e6);
}
async function joinVolhaven(ns: NS) {
  await joinCity(ns, ns.enums.CityName.Volhaven, 50 * 10e6);
}
async function joinChongqing(ns: NS) {
  await joinCity(ns, ns.enums.CityName.Chongqing, 20 * 10e6);
}
async function joinSector12(ns: NS) {
  await joinCity(ns, ns.enums.CityName.Sector12, 15 * 10e6);
}
async function joinNeoTokyo(ns: NS) {
  await joinCity(ns, ns.enums.CityName.NewTokyo, 20 * 10e6);
}
async function joinIshima(ns: NS) {
  await joinCity(ns, ns.enums.CityName.NewTokyo, 30 * 10e6);
}

async function joinNiteSec(ns: NS) {
  await joinHacking(ns, 'avmnite-02h', FactionToName(Factions.hacking.nitsec));
}
async function joinBlackHand(ns: NS) {
  await joinHacking(ns, 'I.I.I.I', FactionToName(Factions.hacking.blackhand));
}
async function joinBitRunners(ns: NS) {
  await joinHacking(ns, 'run4theh111z', FactionToName(Factions.hacking.bitrunners));
}

async function joinMegaCorp(ns: NS) {}
async function joinEcorp(ns: NS) {}
async function joinKuaiGong(ns: NS) {}
async function joinFourSigma(ns: NS) {}
async function joinNWO(ns: NS) {}
async function joinBlade(ns: NS) {}
async function joinOmnitek(ns: NS) {}
async function joinBachman(ns: NS) {}
async function joinClarke(ns: NS) {}
async function joinFulcrum(ns: NS) {}

// gangs
async function joinSlumSnakes(ns: NS) {}
async function joinTetrads(ns: NS) {}
async function joinSilhouette(ns: NS) {}
async function joinSpeakers(ns: NS) {}
async function joinDarkArmy(ns: NS) {}
async function joinSyndicate(ns: NS) {}
async function joinCovenant(ns: NS) {}
async function joinDeaedalus(ns: NS) {}
async function joinIlluminati(ns: NS) {}

async function joinCorp(ns: NS, corp: string) {
  return ns.exec('/factions/work_at_corp.js', 'home', 1, '--company', corp);
}

async function joinHacking(ns: NS, host: string, faction: string) {
  while (ns.getHackingLevel() < ns.getServerRequiredHackingLevel(host)) {
    await ns.sleep(second_ms);
  }
  return ns.exec('/utils/backdoor.js', 'home', 1, '--target', host);
}


async function joinCity(ns: NS, city: CityName, amount: number) {
  while (!ns.singularity.travelToCity(city)) {
    await ns.sleep(100);
  }
  await waitForMoney(ns, amount);
  await waitForInviteAndJoin(ns, city);
}

export async function joinFaction(ns: NS, faction: string) {
  await FactionPrereqs.get(faction)?.(ns);
}

export async function doFactionJob(ns: NS, faction: string, focus: boolean) {
  const aug_list = ns.singularity.getAugmentationsFromFaction(faction);
  const augs = [];
  for (const a of aug_list) {
    if (!ns.singularity.getOwnedAugmentations(true).includes(a)) augs.push(new Augmentation(ns, faction, a));
  }

  for (const a of augs) {
    let have_prereq = true;
    for (const p of a.prereqs) {
      if (!ns.singularity.getOwnedAugmentations(true).includes(p)) {
        have_prereq = false;
        break;
      }
    }

    if (!have_prereq) {
      continue;
    }

    const wt = ns.enums.FactionWorkType;
    let work_type = wt.security;
    const faction_idx = NameToFaction(faction);

    if (
      faction_contains(Factions.corporations, faction_idx) ||
      faction_contains(Factions.hacking, faction_idx) ||
      faction_contains(Factions.early, faction_idx)
    ) {
      work_type = wt.hacking;
    } else if (faction_contains(Factions.crime, faction_idx)) {
      work_type = wt.field;
    }

    ns.singularity.workForFaction(faction, work_type, focus);
    // work for faction until we have the necessary rep
    while (ns.singularity.getFactionRep(faction) < a.reputation) {
      await ns.sleep(1000 * 60);
    }
  }
}

function faction_contains(obj: any, item: any) {
  return Object.values(obj).includes(item);
}
