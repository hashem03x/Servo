import { useEffect, useState } from "react";
import classes from "./Home.module.css";
import Contact from "../Contact/Contact";
import { FloatingWhatsApp } from "react-floating-whatsapp";
import Loader from "../Loader/Loader.jsx";
import { useLanguage } from "../../contexts/LanguageContext";
import { toast } from "react-toastify";
import logo from "../../assets/Image/logo.png";
import { useLocation } from "react-router-dom";
import LoginForm from "./LoginForm";
import WhoWeAre from "../About/WhoWeAre/WhoWeAre.jsx";
import Vision from "../Vision/Vision.jsx";
import Mission from "../Mission/Mission.jsx";
import Features from "../Features/Features.jsx";
import Values from "../Values/Values.jsx";
import HowItWorks from "../HowItWorks/HowItWorks.jsx";
import WhyChooseUs from "../WhyChooseUs/WhyChooseUs.jsx";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [macAddress, setMacAddress] = useState("");
  const [deviceKey, setDeviceKey] = useState("");
  const [isLoader, setIsLoader] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const queryMacAddress = query.get("macAddress");
  const queryDeviceKey = query.get("deviceKey");

  const { langValue } = useLanguage();
  const handleLogin = async (e, type, mac, key) => {
    setIsLoading(true);
    if (type != "fromQuery") {
      e.preventDefault();
    }
    console.log(macAddress, deviceKey);

    try {
      const response = await fetch(
        "https://servo-back.onrender.com/user/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            macAddress: mac == "default" ? macAddress : mac,
            deviceKey: key == "default" ? deviceKey : key,
          }),
        }
      );
      const data = await response.json();
      if (response.status === 200) {
        const newMac = mac == "default" ? macAddress : mac;
        localStorage.setItem("authToken", data.token);
        localStorage.setItem("macAddress", newMac); // Store MAC address
        console.log(data);

        setIsLoggedIn(true);
        toast.success(data.message, {
          theme: "dark",
        });
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        toast.error(data.message, {
          theme: "dark",
        });
      }
    } catch (error) {
      console.error("Error during login:", error);
      alert(langValue["loginFailedMessage"]);
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuth = () => {
    const token = localStorage.getItem("authToken");
    return token ? true : false;
  };

  useEffect(() => {
    const loggedIn = checkAuth();
    setIsLoggedIn(loggedIn);
    setTimeout(() => setIsLoader(false), 1000);
  }, []);

  useEffect(() => {
    if (queryMacAddress && queryDeviceKey) {
      setMacAddress(queryMacAddress);
      setDeviceKey(queryDeviceKey);
      handleLogin("e", "fromQuery", queryMacAddress, queryDeviceKey);
    }
  }, []);

  return (
    <>
      {isLoader ? (
        <Loader />
      ) : (
        <>
          <section className={classes.home} id="home">
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0e1a]/60 via-[#0a0e1a]/80 to-[#0a0e1a]">
              <div className="text-white h-full lg:h-screen p-6 lg:p-16 text-center flex justify-center items-center flex-col">
                <img className="w-[160px]" src={logo} alt="ServoPlayer" />
                <h1
                  className={`${classes.managePlaylist_title} text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight`}
                >
                  {langValue["FEELTHEFLOW"]}
                </h1>
                <div
                  className={`container h-full ${
                    isLoggedIn
                      ? `text-center lg:mt-44 ${classes.wish_responive}`
                      : ""
                  }`}
                >
                  <div className={`${classes.parent_title}`}>
                    <h1
                      className={`text-xl md:text-2xl text-white/90 mb-4 font-light`}
                    >
                      {langValue["heroSubTitle"]}
                    </h1>
                    <p className="text-xl md:text-2xl text-white/90 mb-4 font-light">
                      {langValue["heroText"]}
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <FloatingWhatsApp
              phoneNumber="+1234567890" // Replace with your WhatsApp number
              accountName={langValue["whatsappAccountName"]} // Customize with your name or business name
              avatar={logo} // Optional avatar or logo image
              statusMessage={langValue["whatsappStatusMessage"]}
              chatMessage={langValue["whatsappChatMessage"]}
              allowEsc
              allowClickAway
              className="text-black w-[18rem]"
              placeholder={langValue["whatsappPlaceholder"]}
            />
          </section>

          <WhoWeAre />
          <Vision />
          <Mission />
          <Values />
          <Features />
          <HowItWorks />
          <WhyChooseUs />

          {!isLoggedIn && (
            <LoginForm
              macAddress={macAddress}
              setMacAddress={setMacAddress}
              deviceKey={deviceKey}
              setDeviceKey={setDeviceKey}
              handleLogin={handleLogin}
              isLoading={isLoading}
              langValue={langValue}
            />
          )}
          <Contact />
        </>
      )}
    </>
  );
}
