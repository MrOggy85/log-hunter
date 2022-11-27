type IpapiResult = {
  /**
   * e.g. "8.8.8.8"
   */
  ip: string;
  /**
   * e.g. "IPv4"
   */
  version: string;
  /**
   * e.g. "Mountain View"
   */
  city: string;
  /**
   * e.g. "California"
   */
  region: string;
  /**
   * e.g. "CA"
   */
  region_code: string;
  /**
   * e.g. "US,"
   */
  country_code: string;
  /**
   * e.g. "USA,"
   */
  country_code_iso3: string;
  /**
   * e.g. "United States,"
   */
  country_name: string;
  /**
   * e.g. "Washington,"
   */
  country_capital: string;
  /**
   * e.g. ".us"
   */
  country_tld: string;
  /**
   * e.g. "NA"
   */
  continent_code: string;
  /** */
  in_eu: boolean;
  /**
   * e.g. ""
   */
  postal: 94035;
  /**
   * e.g. 37.386,
   */
  latitude: number;
  /**
   * e.g. -122.0838,
   */
  longitude: number;
  /**
   * e.g. "America/Los_Angeles"
   */
  timezone: string;
  /**
   * e.g. "-0800"
   */
  utc_offset: string;
  /**
   * e.g. "+1"
   */
  country_calling_code: string;
  /**
   * e.g. "USD"
   */
  currency: string;
  /**
   * e.g. "Dollar"
   */
  currency_name: string;
  /**
   * e.g. "en-US,es-US,haw,fr,"
   */
  languages: string;
  /**
   * e.g. 9629091.0,
   */
  country_area: number;
  /**
   * e.g. 310232863,
   */
  country_population: number;
  /**
   * autonomous system number
   * e.g. "AS15169,"
   */
  asn: string;
  /**
   * organization name
   * e.g. "Google LLC"
   */
  org: string;
  /**
   * e.g. "dns.google"
   */
  hostname: string;
};

/**
 * Runtime cache of ipaddress data
 */
const knownIpAddressesCache: Record<string, IpapiResult> = {};

async function fetchIpAddressData(ipAddress: string) {
  const cacheHit = knownIpAddressesCache[ipAddress];
  if (cacheHit) {
    return cacheHit;
  }

  const response = await fetch(`https://ipapi.co/${ipAddress}/json/`);
  const data = await response.json() as IpapiResult;
  console.log("ipapi data", ipAddress, data);

  knownIpAddressesCache[ipAddress] = data;

  return data;
}

export default fetchIpAddressData;
