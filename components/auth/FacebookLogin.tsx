import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FaFacebookF } from "react-icons/fa";

const FacebookLogin = () => {
    const params = useSearchParams();
    const handleSignIn = async () => {
            const result = await signIn("facebook", {
            // redirect: "false",
            callbackUrl: params.get("callbackUrl") || "/",
        });
    };
    return (
        <button
            onClick={handleSignIn}
            type="button"
            className="flex items-center justify-center w-full gap-3 py-3 cursor-pointer font-bold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
        >
            <FaFacebookF />
            Facebook
        </button>
    );
};

export default FacebookLogin;