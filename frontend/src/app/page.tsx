/* eslint-disable @next/next/no-img-element */
import Header from '../components/common/Header';

export default function Home() {
  return (
    <div>
      <Header pageName="Página Inicial" />

      <div className="mt-[50px] flex flex-col items-center min-h-screen bg-gradient-to-br from-[#060c39] to-[#443e60] text-white px-4 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mt-12 mb-12">
          Banking For Your Needs
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          <div
            className="bg-white/10 hover:bg-white/20 transition-all p-6 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-2xl"
          >
            <i className="fas fa-users text-4xl text-purple-400 mb-4"></i>
            <h3 className="text-xl font-semibold">Family 360°</h3>
            <p className="text-sm text-gray-200 mt-2">
              Complete banking solutions for your entire family's financial needs.
            </p>
          </div>

          <div
            className="bg-white/10 hover:bg-white/20 transition-all p-6 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-2xl"
          >
            <i className="fas fa-piggy-bank text-4xl text-purple-400 mb-4"></i>
            <h3 className="text-xl font-semibold">Fixed Deposit</h3>
            <p className="text-sm text-gray-200 mt-2">
              Higher returns with maximum security for your investments.
            </p>
          </div>

          <div
            className="bg-white/10 hover:bg-white/20 transition-all p-6 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-2xl"
          >
            <i className="fas fa-wallet text-4xl text-purple-400 mb-4"></i>
            <h3 className="text-xl font-semibold">Accounts</h3>
            <p className="text-sm text-gray-200 mt-2">
              Tailored accounts to meet all your business and personal obligations.
            </p>
          </div>

          <div
            className="bg-white/10 hover:bg-white/20 transition-all p-6 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-2xl"
          >
            <i className="fas fa-chart-line text-4xl text-purple-400 mb-4"></i>
            <h3 className="text-xl font-semibold">Investments</h3>
            <p className="text-sm text-gray-200 mt-2">
              Secure your future and protect your family with smart investments.
            </p>
          </div>
        </div>
      </div>
    </div>
      
      
  );
}

