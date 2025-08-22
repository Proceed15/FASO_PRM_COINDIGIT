/*"use client";
/* eslint-disable @next/next/no-img-element 
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
            Ativos
          </Button>
        </div>
      </div>
    </div>
  );
}*/

"use client";
/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/navigation";
import Header from "../components/common/Header";

export default function Home() {
  const perguntas = [
    { id: "p1", texto: "O que é uma criptomoeda?" },
    { id: "p2", texto: "O que é cotação reversa?" },
    { id: "p3", texto: "O que significa 'lastro' de uma moeda?" },
    { id: "p4", texto: "É seguro investir em criptomoedas?" },
  ];

  return (
    <div className="bg-[#0a1647] text-white min-h-screen">
      {/* Header fixo */}
      <Header pageName="Início" />

      {/* PARTE DE CIMA */}
      <section className="p-6 min-h-screen bg-[red] flex flex-col md:flex-row items-center justify-center gap-12 px-6 md:px-16 py-12">
        {/* Logo + Título */}
        <div className="ml-[70px] mr-[70px] p-6 bg-[blue] flex flex-col items-center md:items-start text-center md:text-left max-w-xl">
          <img
            src="/images/Logo_CoinDigit.png"
            alt="Logo CoinDigit"
            className="w-28 h-28 mb-4"
          />
          <h1 className="text-3xl md:text-5xl font-bold mb-2">COINDIGIT</h1>
          <p className="text-lg text-purple-200 mb-6">
            Invista no seu Futuro!
          </p>
        </div>

        {/* Perguntas (lado direito) */}
        <div className="mt-8 md:mt-0 flex flex-col gap-4 w-full md:w-1/2">
          {perguntas.map((q) => (
            <a
              key={q.id}
              href={`#${q.id}`}
              className="mb-[20px] bg-[#0e1a52] rounded-lg px-6 py-4 shadow hover:bg-[#162a6b] transition text-center md:text-left"
            >
              {q.texto}
            </a>
          ))}
        </div>
      </section>

      {/* PARTE DE BAIXO (respostas) */}
      <section className="min-h-screen px-6 md:px-16 py-12 space-y-16">
        {/* Pergunta 1 */}
        <div id="p1" className="flex flex-col md:flex-row items-center gap-6">
          <img
            src="/images/criptos.png"
            alt="Criptomoedas"
            className="w-full md:w-1/2 rounded-lg"
          />
          <p className="text-gray-200 text-justify">
            A criptomoeda refere-se a qualquer forma de moeda que existe digital
            ou virtualmente e usa criptografia para garantir a realização de
            transações. Elas não têm uma autoridade central de emissão ou
            regulação. Em vez disso, usam um sistema descentralizado para
            registrar transações e emitir novas unidades.
          </p>
        </div>

        {/* Pergunta 2 */}
        <div id="p2" className="flex flex-col md:flex-row items-center gap-6">
          <img
            src="/images/chart1.png"
            alt="Cotação reversa"
            className="w-full md:w-1/2 rounded-lg"
          />
          <p className="text-gray-200 text-justify">
            Cotação reversa em criptomoedas é quando se inverte a forma
            tradicional de mostrar o valor entre duas moedas. Em vez de dizer
            "1 Bitcoin = 60.000 USD", a cotação reversa mostra "1 USD = 0,00001667
            BTC". Ela é útil para análises de arbitragem e comparação entre pares
            de moedas.
          </p>
        </div>

        {/* Pergunta 3 */}
        <div id="p3" className="flex flex-col md:flex-row items-center gap-6">
          <img
            src="/images/chart2.png"
            alt="Lastro"
            className="w-full md:w-1/2 rounded-lg"
          />
          <p className="text-gray-200 text-justify">
            O lastro de uma moeda significa o valor real que a sustenta. No caso
            das criptomoedas, muitas não possuem lastro físico (como ouro ou
            dólar), mas sim a confiança dos usuários e a tecnologia blockchain
            que garante sua segurança.
          </p>
        </div>

        {/* Pergunta 4 */}
        <div id="p4" className="flex flex-col md:flex-row items-center gap-6">
          <img
            src="/images/chart3.png"
            alt="Investimento seguro"
            className="w-full md:w-1/2 rounded-lg"
          />
          <p className="text-gray-200 text-justify">
            Investir em criptomoedas pode ser seguro se feito com estudo e
            cautela. Apesar de voláteis, elas oferecem oportunidades de altos
            ganhos, mas também riscos. Diversificar e entender o mercado é
            fundamental.
          </p>
        </div>
      </section>
    </div>
  );
}

