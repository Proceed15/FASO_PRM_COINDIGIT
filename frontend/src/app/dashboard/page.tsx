"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import currencyService, { Currency } from "@/services/currencyService";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";

export default function CreateCurrencyPage() {


    return (
        <div className="min-h-screen bg-[#283976] text-white">
            <Header pageName="DashBoard" />
            <div className="mt-[30px] mb-[30px] bg-[red] p-6 space-y-6 max-w-5xl mx-auto">
                {/*1 PARTE - GRÁFICO + BUTTONS*/}
                <div className="bg-[purple] p-6 space-y-6 max-w-5xl mx-auto" >
                    {/*BUTTONS YELLOW*/}
                    <div className="bg-[pink] flex flex-col">
                        <Button
                            className="text-white w-[100px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"

                            type="button"
                        >
                            Cancelar
                        </Button>

                        <Button
                            className="text-white w-[100px] bg-[#265dbf] border hover:bg-blue-800 active:scale-95 transition-transform duration-150"

                            type="button"
                        >
                            Cancelar
                        </Button>

                    </div>
                </div>





            </div>
        </div>
    );
}
