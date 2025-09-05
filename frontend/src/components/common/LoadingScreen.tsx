
export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#0a1647] flex flex-col justify-center items-center z-50">
      <img
        src="/images/load.gif"
        alt="Loading CoinDigit"
        className="w-32 h-32 animate-spin-slow"
      />
      <p className="text-white mt-4 text-xl font-semibold">Carregando...</p>

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
