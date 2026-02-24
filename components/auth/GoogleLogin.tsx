import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { FcGoogle } from "react-icons/fc";

const GoogleLogin = () => {
    const params = useSearchParams();

    const handleSignIn = async () => {
        const result = await signIn("google", {
        // redirect: "false",
        callbackUrl: params.get("callbackUrl") || "/",
        });
    };
    return (
        <button
            onClick={handleSignIn}
            type="button"
            className="flex items-center justify-center w-full gap-3 py-3 font-medium text-black transition bg-white rounded-lg hover:bg-gray-200"
        >
            <FcGoogle />
            Google
        </button>
    );
};

export default GoogleLogin;