"use client";
import Image from "next/image";
import Form from "./form";
import { useState, useEffect } from "react";

const Page = () => {
  const [language_code, setLanguageCode] = useState("en"); // Default to English initially
  const [t, setT] = useState({});
  const bookURL = language_code === "ru" ? "/book-ru.png" : "/book-en.png";

  const handleFetchLocale = async () => {
    // Load translations
    fetch(`/locales/${language_code}.json`)
      .then((res) => res.json())
      .then((data) => {
        setT(data);
      })
      .catch(() => {
        // Fallback to English if translation file not found
        fetch("/locales/en.json")
          .then((res) => res.json())
          .then((data) => {
            setT(data);
          });
      });
  };

  useEffect(() => {
    // Detect browser language and set language_code
    const detectLanguage = () => {
      const browserLang = navigator.language || navigator.userLanguage;
      setLanguageCode(browserLang.startsWith("ru") ? "ru" : "en");
    };

    detectLanguage();
  }, []); // Empty dependency array ensures this runs only once when the component mounts

  useEffect(() => {
    handleFetchLocale();
  }, [language_code]);

  return (
    <div className="pt-4 relative max-w-7xl mx-auto h-full xl:h-screen xl:overflow-hidden">
      <div className="fixed top-0 left-0 w-1/2 h-full bg-white bg-opacity-10 hidden xl:block"></div>
      <nav className="p-4">
        <Image src="/logo.svg" width={63} height={38} />
      </nav>
      <div className="p-4 xl:p-0 z-10 max-w-[581px] xl:mt-10">
        <h1 className="text-[28px] text-white sm:text-[50px] font-semibold sm:font-medium xl:eading-[60px]">
          {t["head text"]}
        </h1>
        <p className="border-l-4 text-white border-[#8861FF] text-xl sm:text-2xl px-4 my-4">
          {t["head sub text"]}
        </p>
        <div className="hidden xl:block h-full">
          <Form t={t} />
        </div>
      </div>
      <div className="hidden xl:block absolute -right-[22%] -top-[130px] overflow-hidden">
        <Image src={bookURL} width={850} height={900} alt="book" className="" />
        <div className="text-white absolute left-[19%] bottom-[34%] border-[#8861FF] p-6 rounded-xl bg-[#25052A4D]">
          <p className="max-w-[400px] text-xl">{t["book text"]}</p>
          <Image
            src="/arrow-desktop.svg"
            width={55}
            height={55}
            alt="arrow"
            className="absolute -bottom-[15%] -left-6"
          />
        </div>
      </div>
      <div className="flex items-center relative xl:hidden">
        <Image
          src={bookURL}
          width={410}
          height={250}
          alt="book"
          className="sm:w-[560px] -mt-[18%] sm:h-[700px] lg:-mt-[12%] lg:w-[60%] lg:h-[80%]"
        />
        <div className="text-white absolute left-[52%] sm:left-[55%] top-[15%] -right-6 border-[#8861FF] p-6 rounded-xl bg-[#25052A4D]">
          <p>{t["book text"]}</p>
          <Image
            src="/arrow.svg"
            width={51}
            height={51}
            alt="arrow"
            className="absolute -bottom-8 sm:w-[68px] sm:h-[68px] right-8 z-30"
          />
        </div>
      </div>

      <div className="xl:hidden">
        <Form t={t} locale={language_code} />
      </div>
    </div>
  );
};

export default Page;
