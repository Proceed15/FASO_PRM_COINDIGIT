

export interface CurrencyIconData {
  symbol: string;
  iconUrl: string;
  fallbackUrl?: string;
}

class IconService {

  async getCurrencyIcon(symbol: string): Promise<string> {

    return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/${symbol.toLowerCase()}.svg`;
  }

  clearCache(): void {
    //NOT CATCH
  }
}

export const iconService = new IconService();
export default iconService;
