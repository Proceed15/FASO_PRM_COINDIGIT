// Serviço simplificado - não precisamos mais dele com a biblioteca
// Mantido apenas para compatibilidade com imports existentes

export interface CurrencyIconData {
  symbol: string;
  iconUrl: string;
  fallbackUrl?: string;
}

class IconService {
  // Método mantido para compatibilidade, mas não é mais usado
  async getCurrencyIcon(symbol: string): Promise<string> {
    // Agora usamos a biblioteca diretamente no componente
    return `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/${symbol.toLowerCase()}.svg`;
  }

  clearCache(): void {
    // Não há mais cache para limpar
  }
}

export const iconService = new IconService();
export default iconService;
