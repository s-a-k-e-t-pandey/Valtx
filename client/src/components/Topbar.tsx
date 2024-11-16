import { SiVault } from "react-icons/si";
import { Link } from "react-router-dom";

export default function Topbar() {

    return <div className=" p-4 text-3xl font-extrabold border-solid ">
        <div className="flex justify-between text-[#0d1117]">
            <div className="flex row text-[#0d1117] shadow border-4 bg-gradient-to-br from-blue-900 via-black to-green-900 opacity-80 shadow-2xl transform transition-all duration-500 ease-in-out hover:scale-105 rounded-xl">
                <Link to={"/"}>
                <button className="inline-flex h-10 items-center justify-center font-3xl px-8 text-4xl font-medium text-white shadow transition-colors  text-italic ">
                2FA-Vault <div className="text-4xl text-white"><SiVault /></div>
                </button>
                </Link>
                
            </div>
            <div className="flex row">
                <Link to={"/signin"}>
                    <button className="inline-flex h-10 items-center justify-center rounded-l-full px-8 text-lg font-medium text-white shadow transition-colors hover:bg-teal-700/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-l-red-400 border-2 bg-gradient-to-br from-blue-900 via-black to-green-900 opacity-80
                    transform transition-all duration-500 ease-in-out hover:scale-105 rounded-xl">
                        Login
                    </button>
                </Link>
                <Link to={"/signup"}>
                    <button className="inline-flex h-10 items-center justify-center rounded-r-full px-8 text-lg font-medium text-white shadow transition-colors hover:bg-teal-700/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border-r-red-400 border-2 bg-gradient-to-br from-blue-900 via-black to-green-900 opacity-80 transform transition-all duration-500 ease-in-out hover:scale-105 rounded-xl">
                        Signup
                    </button>
                </Link>
            </div>
        </div>
    </div>
}