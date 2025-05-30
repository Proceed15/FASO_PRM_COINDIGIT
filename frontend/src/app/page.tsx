/* eslint-disable @next/next/no-img-element */
import Header from '../components/common/Header';
//ImportIconsEtc
import { BsFillPeopleFill } from "react-icons/bs";
import { BsFillPiggyBankFill } from "react-icons/bs";
import { BsFillCalendar3EventFill } from "react-icons/bs";
import { BsGraphUp } from "react-icons/bs";

export default function Home() {
  return (
    <div>
      <Header pageName="Página Inicial" />
     
      <div className="mt-[50px] flex flex-col items-center min-h-screen bg-gradient-to-br from-[#060c39] to-[#443e60] text-white px-4 pb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-center mt-20 mb-20">
          Banking For Your Needs
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-6xl">
          {/* Family 360° */}
          <div
            className="bg-white/10 hover:bg-white/20 transition-all p-6 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-2xl hover:transform hover:translate-y-[-5px]"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <BsFillPeopleFill className="text-4xl text-blue-700" />
              <div>
                <h3 className="text-xl font-semibold">Family 360°</h3>
                <p className="text-sm text-gray-200 mt-2">
                  Complete banking solutions for your entire family's financial needs.
                </p>
              </div>
            </div>
          </div>

          {/* Fixed Deposit */}
          <div
            className="bg-white/10 hover:bg-white/20 transition-all p-6 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-2xl hover:transform hover:translate-y-[-5px]"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <BsFillPiggyBankFill className="text-4xl text-blue-700" />
              <div>
                <h3 className="text-xl font-semibold">Fixed Deposit</h3>
                <p className="text-sm text-gray-200 mt-2">
                  Higher returns with maximum security for your investments.
                </p>
              </div>
            </div>
          </div>

          {/* Accounts */}
          <div
            className="bg-white/10 hover:bg-white/20 transition-all p-6 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-2xl hover:transform hover:translate-y-[-5px]"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <BsFillCalendar3EventFill className="text-4xl text-blue-700" />
              <div>
                <h3 className="text-xl font-semibold">Accounts</h3>
                <p className="text-sm text-gray-200 mt-2">
                  Tailored accounts to meet all your business and personal obligations.
                </p>
              </div>
            </div>
          </div>

          {/* Investments */}
          <div
            className="bg-white/10 hover:bg-white/20 transition-all p-6 rounded-lg text-center cursor-pointer shadow-lg hover:shadow-2xl hover:transform hover:translate-y-[-5px]"
          >
            <div className="flex flex-col items-center justify-center space-y-4">
              <BsGraphUp className="text-4xl text-blue-700" />
              <div>
                <h3 className="text-xl font-semibold">Investments</h3>
                <p className="text-sm text-gray-200 mt-2">
                  Secure your future and protect your family with smart investments.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>   
  );
}

