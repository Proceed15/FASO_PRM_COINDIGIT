/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../../contexts/UserContext";
import { FaUserCircle, FaSignOutAlt, FaUser } from "react-icons/fa";

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
    <div className="z-20 header flex items-center justify-between px-6 py-4 bg-[#1e1e3f] text-white border-b border-white-200">
      <div className="flex items-center gap-2">
        <img
          src="/images/Logo_CoinDigit.png"
          alt="ICON"
          className="w-10 h-10"
        />

        <span className="text-lg font-semibold">{siteName}</span>
      </div>
      <div className="text-center flex-grow">
        <div className="text-white font-bold text-2xl">{pageName}</div>
      </div>

      <div className="flex items-center gap-4">
        {user?.id ? (
          <>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 hover:text-purple-300 transition"
              title="Logout"
            >
              <FaSignOutAlt size={24} />
            </button>

            <div className="text-white font-semibold hidden sm:block">
              Olá, {user.name}
            </div>

            <button
              onClick={goToProfile}
              className="flex items-center gap-1 hover:text-purple-300 transition"
              title="Perfil"
            >
              <FaUser size={24}/>
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="flex items-center gap-1 hover:text-purple-300 transition"
            title="Logar"
          >
            <FaUserCircle size={30}/>
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
