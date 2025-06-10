/* eslint-disable @next/next/no-img-element */
import Header from '../components/common/Header';

export default function Home() {
  return (
    <div>
      <Header pageName="Página Inicial" />

      <div className="mt-[-14px] flex flex-col items-center justify-center h-[543px] bg-gradient-to-br from-[#060c39] to-[#443e60] text-white px-4 pb-12">
        
        <div className="mt-10 text-center"></div>
        <h1 className="leading-relaxed text-4xl md:text-5xl font-bold text-center">
          Invista no seu futuro <br />com a CoinDigit!
        </h1>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-200 mb-6">
            Acompanhe preços, tendências e mais. Simples, <br />seguro e rápido.
          </p>

          <div className="mt-10 text-center"></div>
          <button 
            className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-3 px-6 rounded-full transition-transform hover:scale-105"
          >
            Começar Agora
          </button>
        </div>

      </div>
    </div>   
  );
}