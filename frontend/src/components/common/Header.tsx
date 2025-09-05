"use client";
import { useState, useContext } from "react";
import { useRouter, usePathname } from "next/navigation";
import {
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Coins,
  Users,
  User,
  ChevronDown
} from "lucide-react";
import { UserContext } from "../../contexts/UserContext";

const Header: React.FC<{ siteName?: string; pageName: string }> = ({
  siteName = "CoinDigit",
  pageName,
}) => {
  const router = useRouter();
  const pathname = usePathname();
  const { user, setUser } = useContext(UserContext);
  const [menuOpen, setMenuOpen] = useState(false);

  const goToProfile = () => {
    if (user?.id) {
      router.push(`/users/${user.id}/view`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  const handleLogin = () => router.push("/login");
  const handleRegister = () => router.push("/register");

  const isActive = (path: string) =>
    pathname === path ? "bg-blue-600 text-white" : "hover:bg-blue-600";

//load
const [isUserLoaded, setIsUserLoaded] = useState(false);


  return (
    <>
      {/* HEADER */}
      <header className="z-20 grid grid-cols-3 items-center px-6 py-4 bg-[#030930] text-white border-b border-white/20">

        {/* ESQUERDA - Logo */}
        <div className="flex items-center gap-2">
          <a href="/" className="inline-block">
            <img
              src="/images/Logo_CoinDigit.png"
              alt="ICON"
              className="w-15 h-10 cursor-pointer rounded-full hover:scale-105 active:scale-100 transition-transform duration-150"
            />
          </a>
          <span className="ml-2 text-2xl font-semibold">{siteName}</span>
        </div>

        {/* CENTRO - Page Name */}
        {user?.id && (
          <div className="text-center">
            <span className="text-white font-bold text-lg md:text-2xl truncate">
              {pageName}
            </span>
          </div>
        )}

        {/* DIREITA - ENTRAR/CADASTRE-SE */}

        <div className="col-start-3 flex items-center justify-end gap-3">
          {!user?.id ? (
            <>
              <button
                onClick={handleLogin}
                className="px-4 py-1 rounded-md border border-white hover:bg-white hover:text-[#0c113f] transition-all"
              >
                Entrar
              </button>
              <button
                onClick={handleRegister}
                className="px-4 py-1 border border-transparent rounded-md bg-blue-600 hover:bg-blue-500 transition-all"
              >
                Cadastre-se
              </button>
            </>
          ) : (
            <button
              onClick={() => setMenuOpen(true)}
              className="p-2 rounded-md hover:bg-white/20 transition-all"
            >
              <Menu size={28} />
            </button>
          )}
        </div>
      </header>

      {/* MENU SANDUICHE */}
      {user?.id && (
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-[#172868] text-white shadow-2xl z-50 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "translate-x-full"
            }`}
        >
          {/* TOPO DO MENU */}
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/20">
            <span className="mb-2 mt-2 font-bold text-lg flex items-center gap-2">
              <Menu size={28} />
              <ChevronDown size={20} />
            </span>
            <button
              onClick={() => setMenuOpen(false)}
              className="hover:bg-white/20 rounded-full p-1 transition-all"
            >
              <X size={24} />
            </button>
          </div>

          {/* LINKS */}
          <nav className="flex flex-col gap-2 mt-4 px-2">
            {[
              { path: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
              { path: "/currencies", icon: Coins, label: "Moedas" },
              { path: "/users", icon: Users, label: "Usuários" },
              { path: `/users/${user?.id}/view`, icon: User, label: "Perfil", action: goToProfile },
            ].map(({ path, icon: Icon, label, action }) => {
              const active = pathname === path;
              return (
                <button
                  key={path}
                  onClick={action ? action : () => router.push(path)}
                  className={`mx-2 mt-2 flex items-center gap-2 px-3 py-2 rounded-md text-white transition-all
            ${active
                      ? "bg-gradient-to-r from-[#283976] to-[#265dbf]"
                      : "hover:bg-gradient-to-r hover:from-[#283976] hover:to-[#265dbf]"
                    }
            `}
                >
                  <Icon size={20} />
                  <span>{label}</span>
                </button>
              );
            })}
            {/* BEM-VINDO USUÁRIO */}
            <a href="/" className="inline-block">
              <div className="mx-2 mt-2 flex items-center gap-2 px-3 py-2 rounded-md text-white transition-all justify-center px-4 text-center hover:bg-gradient-to-r hover:from-[#283976] hover:to-[#265dbf]">
                <p className="text-lg font-medium text-white">
                  Bem-vindo
                  {user?.name && (
                    <span className="text-[#fffcb7] font-semibold">, {user.name}!</span>
                  )}
                </p>
              </div>
            </a>
          </nav>

          {/* BOTÃO SAIR */}
          <div className="absolute bottom-4 left-0 w-full px-4">
            <button
              onClick={handleLogout}
              className="mb-3 ml-3 flex items-center gap-2 text-white-400 hover:text-red-500 transition-colors"
            >
              <LogOut size={25} />

            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
