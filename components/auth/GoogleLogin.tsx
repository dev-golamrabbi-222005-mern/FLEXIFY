import { FcGoogle } from "react-icons/fc";

const GoogleLogin = () => {
    return (
        <button
        type="button"
        className="flex items-center justify-center w-full gap-3 py-3 font-medium text-black transition bg-white rounded-lg hover:bg-gray-200"
        >
            <FcGoogle />
            Google
        </button>
    );
};

export default GoogleLogin;