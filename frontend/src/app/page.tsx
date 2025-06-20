"use client";
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import Header from "../components/common/Header";
import { Button } from "../components/ui/button";

export default function Home() {
  const router = useRouter();

  return (
    <div>
      <Header pageName="Página Inicial" />

      <div className="min-h-[570px] mt-[-14px] flex flex-col items-center justify-center h-[543px] bg-gradient-to-br from-[#060c39] to-[#443e60] text-white px-4 pb-12">
        <h1 className="mt-[70px] leading-relaxed text-4xl md:text-5xl font-bold text-center">
          Invista no seu futuro <br /> com a CoinDigit!
        </h1>

        <p className="mt-6 text-sm text-gray-200 text-center">
          Acompanhe preços, tendências e mais. Simples, <br /> seguro e rápido.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center max-w-3xl w-full">
          <Button
            className="flex-1 min-w-[150px] border border-white-400 bg-transparent text-white hover:bg-purple-800 hover:opacity-90 active:scale-95 transition font-semibold rounded px-6 py-3"
            onClick={() => router.push("/login")}
          >
            Login
          </Button>

          <Button
            className="flex-1 min-w-[150px] border border-white-400 bg-transparent text-white hover:bg-purple-800 hover:opacity-90 active:scale-95 transition font-semibold rounded px-6 py-3"
            onClick={() => router.push("/users")}
          >
            Usuários
          </Button>

          <Button
            className="flex-1 min-w-[150px] border border-white-400 bg-transparent text-white hover:bg-purple-800 hover:opacity-90 active:scale-95 transition font-semibold rounded px-6 py-3"
            onClick={() => router.push("/currencies")}
          >
            Moedas
          </Button>
        </div>
      </div>
    </div>
  );
}
