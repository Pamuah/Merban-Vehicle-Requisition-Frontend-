import { useNavigate } from "react-router-dom";
import Lottie from "lottie-react";
import CustomButton from "../components/customButton";
import errorAnimation from "../assets/animations/error animation.json";
export default function ErrorPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen w-screen bg-white text-center px-4">
      <Lottie
        animationData={errorAnimation}
        loop={true}
        autoplay={true}
        style={{ width: 600, height: 400 }}
      />

      <h1 className="text-3xl font-semibold text-gray-800 mb-2">
        Oops! Something went wrong
      </h1>

      <p className="text-gray-500 mb-8 max-w-md">
        We’re sorry, but it looks like something broke. Please try again later
        or go back to the home page.
      </p>

      <CustomButton
        label="Go Back Home"
        onClick={() => navigate("/")}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-all"
      />
    </div>
  );
}
