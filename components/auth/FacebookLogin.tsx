import { FaFacebookF } from "react-icons/fa";

const FacebookLogin = () => {
    return (
        <button
        type="button"
        className="flex items-center justify-center w-full gap-3 py-3 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
            <FaFacebookF />
            Facebook
        </button>
    );
};

export default FacebookLogin;