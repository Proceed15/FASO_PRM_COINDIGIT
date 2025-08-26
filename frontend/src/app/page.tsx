"use client";
import { useEffect } from "react";
import Header from "../components/common/Header";

export default function Home() {
  const perguntas = [
    { id: "p1", texto: "1. O que é uma criptomoeda?" },
    { id: "p2", texto: "2. O que é cotação reversa?" },
    { id: "p3", texto: "3. O que significa 'lastro' de uma moeda?" },
    { id: "p4", texto: "4. É seguro investir em criptomoedas?" },
  ];

  // Animação de scroll suavinha
  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      const targetY =
        section.getBoundingClientRect().top +
        window.scrollY -
        window.innerHeight / 4;
      const startY = window.scrollY;
      const distance = targetY - startY;
      let startTime: number | null = null;

      const duration = 700; // mili-segundos

      const animation = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);

        const ease =
          progress < 0.5
            ? 2 * progress * progress
            : -1 + (4 - 2 * progress) * progress;

        window.scrollTo(0, startY + distance * ease);

        if (timeElapsed < duration) {
          requestAnimationFrame(animation);
        }
      };

      requestAnimationFrame(animation);
    }
  };

  return (
    <div className="bg-[#0a1647] text-white min-h-screen">
      {/* Header */}
      <Header pageName="Início" />

      {/* PARTE DE CIMA */}
      <section
        className="flex flex-col md:flex-row items-center justify-between 
                   px-6 md:px-16 py-20 min-h-[95vh] relative"
        style={{
          backgroundImage: "url('/images/BACKGROUND-LOSANGOS.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Textura do BG */}
        <div className="absolute inset-0 bg-[rgba(48, 70, 160, 0.7)]"></div>

        {/* Conteudo por cima do BG */}
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between w-full gap-12">
          {/* Logo + textos lado a lado */}
          <div className="ml-[50px] mr-[50px] flex items-center gap-8">
            <img
              src="/images/Logo_CoinDigit.png"
              alt="Logo CoinDigit"
              className="w-40 h-40 md:w-48 md:h-48"
            />
            <div>
              <h1 className="text-5xl md:text-6xl font-extrabold leading-tight">
                COINDIGIT
              </h1>
              <p className="ml-[10px] text-xl md:text-2xl text-gray-200 font-medium mt-2">
                Invista no seu Futuro!
              </p>
            </div>
          </div>

          {/* Perguntas */}
          <div className="ml-[30px] mr-[30px] flex flex-col gap-4 w-full md:w-1/2">
            {perguntas.map((q) => (
              <button
                key={q.id}
                onClick={() => scrollToSection(q.id)}
                className="mt-[15px] bg-[#0e1a52] rounded-lg px-6 py-5 
                           shadow-md border border-white 
                           hover:border--400 hover:bg-[#162a6b] 
                           transition-all duration-300 text-lg md:text-xl 
                           text-center md:text-left font-medium"
              >
                {q.texto}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PARTE DE BAIXO */}
      <section className="px-6 md:px-16 py-20 space-y-20 bg-gradient-to-r from-[#283976] to-[#101d4b]">
        {/* "Container" das IMG */}
        <style jsx>{`
        
          .img-box {
          width: 100%;
          max-width: 500px;
          height: 320px; 
          max-height: 320px;
          background: #111a3a;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 2px solid white;
          }
          .img-box img { width: 100%; height: 100%; object-fit: cover; }

        `}</style>

        {/* Pergunta 1 */}
        <div
          id="p1"
          className="flex flex-col md:flex-row items-center justify-between gap-16"
        >
          <div className="img-box ml-[70px] mr-[70px]">
            <img src="/images/O-QUE-E-CRIPTOMOEDA.jpg" alt="Criptomoedas" />
          </div>
          <p className="ml-[50px] mr-[50px] text-2xl md:text-2xl text-gray-200 text-justify max-w-2xl">
            A criptomoeda refere-se a qualquer forma de moeda que existe digital
            ou virtualmente e usa criptografia para garantir a realização de
            transações. As criptomoedas não têm uma autoridade central de
            emissão ou regulação. Em vez disso, usam um sistema descentralizado
            para registrar transações e emitir novas unidades.
          </p>
        </div>

        {/* Pergunta 2 */}
        <div
          id="p2"
          className="flex flex-col md:flex-row-reverse items-center justify-between gap-16"
        >
          <div className="img-box ml-[70px] mr-[70px]">
            <img src="/images/O-QUE-E-COTACAO.jpg" alt="Cotação reversa" />
          </div>
          <p className="ml-[50px] mr-[50px] text-2xl md:text-2xl text-gray-200 text-justify max-w-2xl">
            Cotação reversa em criptomoedas é quando se inverte a forma
            tradicional de mostrar o valor entre duas moedas. Em vez de dizer
            "1 Bitcoin = 60.000 USD", a cotação reversa mostra "1 USD = 0,00001667
            BTC". Ela é útil para análises de arbitragem e comparação entre pares
            de moedas.
          </p>
        </div>

        {/* Pergunta 3 */}
        <div
          id="p3"
          className="flex flex-col md:flex-row items-center justify-between gap-16"
        >
          <div className="img-box ml-[70px] mr-[70px]">
            <img src="/images/O-QUE-E-LASTRO.jpg" alt="Lastro" />
          </div>
          <p className="ml-[50px] mr-[50px] text-2xl md:text-2xl text-gray-200 text-justify max-w-2xl">
            O lastro de uma moeda significa o valor real que a sustenta. No caso
            das criptomoedas, muitas não possuem lastro físico (como ouro ou
            dólar), mas sim a confiança dos usuários e a tecnologia blockchain
            que garante sua segurança.
          </p>
        </div>

        {/* Pergunta 4 */}
        <div
          id="p4"
          className="flex flex-col md:flex-row-reverse items-center justify-between gap-16"
        >
          <div className="img-box ml-[70px] mr-[70px]">
            <img src="/images/INVESTIR-SEGURO.jpg" alt="Investimento seguro" />
          </div>
          <p className="ml-[50px] mr-[50px] text-2xl md:text-2xl text-gray-200 text-justify max-w-2xl">
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
