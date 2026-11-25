import FacebookLogin from "./FacebookLogin";
import GoogleLogin from "./GoogleLogin";

const SocialButtons = () => {
    return (
        <div className="flex gap-5">
            <GoogleLogin/>
            <FacebookLogin/>
        </div>
    );
};

export default SocialButtons;