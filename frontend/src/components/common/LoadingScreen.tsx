
interface LoadingScreenProps {
  variant?: 'fullscreen' | 'inline' | 'minimal';
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingScreen({
  variant = 'fullscreen',
  message = 'Carregando...',
  size = 'md',
  className = ''
}: LoadingScreenProps) {

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-32 h-32',
    lg: 'w-48 h-48'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-xl',
    lg: 'text-2xl'
  };

  if (variant === 'minimal') {
    return (
      <div className={`flex items-center justify-center p-4 ${className}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        <span className="ml-2 text-white text-sm">{message}</span>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`flex flex-col justify-center items-center py-12 ${className}`}>
        <img
          src="/images/load.gif"
          alt="Loading CoinDigit"
          className={`${sizeClasses[size]} animate-spin-slow`}
        />
        <p className={`text-white mt-4 ${textSizes[size]} font-semibold`}>{message}</p>

        <style jsx>{`
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-spin-slow {
            animation: spin-slow 3s linear infinite;
          }
        `}</style>
      </div>
    );
  }

  //LOAD GERAL
  return (
    <div className={`fixed inset-0 bg-[#0a1647] flex flex-col justify-center items-center z-50 ${className}`}>
      <img
        src="/images/load.gif"
        alt="Loading CoinDigit"
        className={`${sizeClasses[size]} animate-spin-slow`}
      />
      <p className={`text-white mt-4 ${textSizes[size]} font-semibold`}>{message}</p>

      <style jsx>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-in-out;
        }
      `}</style>
    </div>
  );
}

// LOAD TABELAS
export function TableLoadingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="flex space-x-4 py-3 border-b border-gray-600">
          <div className="h-4 bg-gray-600 rounded w-1/4"></div>
          <div className="h-4 bg-gray-600 rounded w-1/3"></div>
          <div className="h-4 bg-gray-600 rounded w-1/4"></div>
          <div className="h-4 bg-gray-600 rounded w-1/6"></div>
        </div>
      ))}
    </div>
  );
}

// LOAD GRÁFICOS
export function ChartLoadingSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-600 rounded w-1/3 mb-4"></div>
      <div className="h-64 bg-gray-600 rounded mb-4"></div>
      <div className="flex justify-between">
        <div className="h-4 bg-gray-600 rounded w-16"></div>
        <div className="h-4 bg-gray-600 rounded w-16"></div>
        <div className="h-4 bg-gray-600 rounded w-16"></div>
        <div className="h-4 bg-gray-600 rounded w-16"></div>
      </div>
    </div>
  );
}
