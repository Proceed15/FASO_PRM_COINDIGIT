"use client";

import { useState } from "react";

interface CurrencyIconProps {
  symbol: string;
  size?: number;
  className?: string;
  showSymbol?: boolean;
  symbolPosition?: "right" | "bottom" | "none";
}

export default function CurrencyIcon({ 
  symbol, 
  size = 32, 
  className = "", 
  showSymbol = false,
  symbolPosition = "right"
}: CurrencyIconProps) {
  const [hasError, setHasError] = useState(false);

  const handleImageError = () => {
    setHasError(true);
  };

  const getFallbackIcon = (symbol: string) => {
    const firstLetter = symbol.charAt(0).toUpperCase();
    const colors = [
      '6366F1', 'EF4444', '10B981', 'F59E0B', '8B5CF6', 
      'EC4899', '06B6D4', 'F97316', '84CC16', 'F43F5E'
    ];
    const colorIndex = firstLetter.charCodeAt(0) % colors.length;
    const color = colors[colorIndex];
    
    return (
      <div 
        className={`rounded-full flex items-center justify-center text-white font-bold ${className}`}
        style={{ 
          width: size, 
          height: size,
          backgroundColor: `#${color}`
        }}
        title={`${symbol} icon`}
      >
        <span style={{ fontSize: size * 0.4 }}>{firstLetter}</span>
      </div>
    );
  };

  const renderIcon = () => {
    if (hasError || !symbol) {
      return getFallbackIcon(symbol || '?');
    }

    // URL da biblioteca cryptocurrency-icons via CDN
    const iconUrl = `https://cdn.jsdelivr.net/gh/spothq/cryptocurrency-icons@master/svg/color/${symbol.toLowerCase()}.svg`;

    return (
      <img
        src={iconUrl}
        alt={`${symbol} icon`}
        width={size}
        height={size}
        className={`object-contain ${className}`}
        onError={handleImageError}
        loading="lazy"
        style={{ 
          minWidth: size, 
          minHeight: size,
          maxWidth: size,
          maxHeight: size
        }}
      />
    );
  };

  const renderSymbolText = () => {
    if (!showSymbol || symbolPosition === "none") return null;

    const symbolClass = symbolPosition === "bottom" 
      ? "text-xs text-center mt-1" 
      : "text-sm ml-2";

    return (
      <span className={`text-white font-medium ${symbolClass}`}>
        {symbol.toUpperCase()}
      </span>
    );
  };

  if (symbolPosition === "bottom") {
    return (
      <div className="flex flex-col items-center">
        {renderIcon()}
        {renderSymbolText()}
      </div>
    );
  }

  return (
    <div className="flex items-center">
      {renderIcon()}
      {renderSymbolText()}
    </div>
  );
}

// Componente específico para uso em tabelas
export function CurrencyIconTable({ symbol, className = "" }: { symbol: string; className?: string }) {
  return (
    <CurrencyIcon 
      symbol={symbol}
      size={24}
      showSymbol={true}
      symbolPosition="right"
      className={className}
    />
  );
}

// Componente específico para visualização detalhada
export function CurrencyIconDetail({ symbol, className = "" }: { symbol: string; className?: string }) {
  return (
    <CurrencyIcon 
      symbol={symbol}
      size={48}
      showSymbol={true}
      symbolPosition="right"
      className={className}
    />
  );
}

// Componente apenas com ícone (sem texto)
export function CurrencyIconOnly({ symbol, size = 32, className = "" }: { symbol: string; size?: number; className?: string }) {
  return (
    <CurrencyIcon 
      symbol={symbol}
      size={size}
      showSymbol={false}
      className={className}
    />
  );
}
