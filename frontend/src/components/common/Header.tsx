"use client";

import React, { useContext } from "react";
import { useRouter } from "next/navigation";
import { UserContext } from "../../contexts/UserContext";
//Teste 1
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
    <div className="header flex items-center p-4 bg-gradient-to-b from-[#443e60] to-[#060c39] text-white">
      <div className="flex-shrink-0">
        <div className="text-light text-lg font-bold">{siteName}</div>
      </div>
      <div className={`flex-grow text-center ${!user?.id ? "ml-24" : ""}`}>
        <div className="text-white font-bold text-3xl">{pageName}</div>
      </div>
      <div className="flex items-center gap-4 flex-shrink-0">
        {user?.id ? (
          <>
            <button className="btn" onClick={handleLogout}>Logout</button>
            {user?.name && (
              <div className="text-white font-semibold ml-2">Olá, {user.name}</div>
            )}
            <button className="btn" onClick={goToProfile}>
              Perfil
            </button>
          </>
        ) : (
          <button className="btn" onClick={handleLogin}>
            Logar
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;
