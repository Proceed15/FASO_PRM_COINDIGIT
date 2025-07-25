/* eslint-disable @next/next/no-img-element */
"use client";
import { LogOut, UserCircle } from "lucide-react";
import { FaUserCircle } from 'react-icons/fa';
import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../../contexts/UserContext";

const Header: React.FC<{ siteName?: string; pageName: string }> = ({
  siteName = "Trade Holding AMS",
  pageName,
}) => {
  const router = useRouter();
  const { user, setUser } = useContext(UserContext);

  const goToProfile = () => {
    if (user?.id) {
      router.push(`/users/${user.id}/view`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/login");
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="z-20 header flex items-center justify-between px-6 py-4 bg-[#1e1e3f] text-white border-b border-white-200 relative">
      
      <div className="flex items-center gap-2">
        <a href="/" className="inline-block">
          <img
            src="/images/Logo_CoinDigit.png"
            alt="ICON"
            className="w-10 h-10 cursor-pointer rounded-full hover:scale-105 active:scale-100 transition-transform duration-150"
          />
        </a>
        <span className="text-lg font-semibold">{siteName}</span>
      </div>

      <div className="absolute left-1/2 transform -translate-x-1/2 text-center">
        <div className="text-white font-bold text-2xl">{pageName}</div>
      </div>

      <div className="flex items-center gap-4">
        {user?.id ? (
          <div className="flex items-center gap-4">
            {user?.name && (
              <div className="mr-3 text-white font-semibold text-lg">
                Olá, <span className="text-yellow-300 font-bold text-xl">{user.name}</span>
              </div>
            )}

            <button
              onClick={goToProfile}
              className="btn hover:scale-105 active:scale-100 p-2 rounded-full bg-transparent hover:bg-purple-700 transition-all"
              title="Perfil"
            >
              <UserCircle size={28} />
            </button>

            <button
              onClick={handleLogout}
              className="mr-1 hover:scale-105 active:scale-100 btn p-2 rounded-full bg-transparent hover:bg-red-600 transition-all"
              title="Logout"
            >
              <LogOut size={26} />
            </button>
          </div>
        ) : (
          <button
            onClick={handleLogin}
            className="mr-2 hover:scale-105 active:scale-100 btn p-2 rounded-full bg-transparent hover:bg-yellow-500 transition-all"
            title="Logar"
          >
            <FaUserCircle size={30} />
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;