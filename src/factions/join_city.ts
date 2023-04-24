import { CityName, NS } from '@ns';
import { waitForMoney, waitForInviteAndJoin } from '@/utils/utils';

async function joinCity(ns: NS, city: CityName, amount: number) {
  while (!ns.singularity.travelToCity(city)) {
    await ns.sleep(100);
  }
  await waitForMoney(ns, amount);
  await waitForInviteAndJoin(ns, city);
}

export async function main(ns: NS) {
  const args = ns.flags([
    ['help', false],
    ['city', ns.enums.CityName.Sector12],
    ['money', 15e6],
  ]);
  if (args.help) {
    ns.tprint('Travel to a city and try to join their faction');
    ns.tprint(`Usage: run ${ns.getScriptName()} --city CITY --money MONEY`);
    ns.tprint(`Example:`);
    ns.tprint(`> run ${ns.getScriptName()} --city Aevum --money 1000000`);
    return;
  }

  const CityMap = new Map([
    ['Sector-12', ns.enums.CityName.Sector12],
    ['Chongqing', ns.enums.CityName.Chongqing],
    ['New Tokyo', ns.enums.CityName.NewTokyo],
    ['Ishima', ns.enums.CityName.Ishima],
    ['Aevum', ns.enums.CityName.Aevum],
    ['Volhaven', ns.enums.CityName.Volhaven],
  ]);
  const city = CityMap.get(args.city.toString());
  if (city === undefined) return;
  await joinCity(ns, city, args.money as number);
}
