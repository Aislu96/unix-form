"use client";

import PhoneInput from "react-phone-number-input";
import { useState, useEffect } from "react";
import "react-phone-number-input/style.css";
import { validateName, validateEmail, validatePhone } from "./validators";
const Form = ({ t, locale }) => {
  useEffect(() => {
    console.log(t, "t");
  }, [t]);

  const [inputValueName, setInputValueName] = useState("");
  const [inputValueEmail, setInputValueEmail] = useState("");
  const [inputValuePhone, setInputValuePhone] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  //   const [checkboxChecked, setCheckboxChecked] = useState(false);
  //   const [checkboxError, setCheckboxError] = useState("");
  const [defaultCountry, setDefaultCountry] = useState("US");

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        console.log(data, "data");
        setDefaultCountry(data.country_code);
      } catch (error) {
        console.error("Error fetching country code:", error);
      }
    };
    fetchCountry();
  }, []);

  const handleChange = (eventOrValue, name) => {
    if (name === "telephone") {
      setInputValuePhone(eventOrValue);
      setPhoneError(validatePhone(eventOrValue));
      return;
    }

    const { name: fieldName, value } = eventOrValue.target;
    switch (fieldName) {
      case "name":
        setInputValueName(value);
        setNameError(validateName(value));
        break;
      case "email":
        setInputValueEmail(value);
        setEmailError(validateEmail(value));
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (event) => {
    // const validPhone = isValidPhoneNumber(inputValuePhone);
    // console.log("validPhone", validPhone);
    // setIsPhoneValid(validPhone);

    // setLoading(true);
    console.log("see me here");
    event.preventDefault();
    setNameError(validateName(inputValueName));
    setEmailError(validateEmail(inputValueEmail));
    // setPhoneError(validatePhone(inputValuePhone));
    console.log(
      inputValuePhone,
      "inputValuePhone",
      inputValueEmail,
      inputValueName,
      nameError, // nameError
      emailError, // emailError
      phoneError // phoneError
    );

    // if (isPhoneValid) {
    //   setPhoneError("");
    // } else if (!isPhoneValid) {
    //   setPhoneError("Invalid phone number");
    //   setPhoneError(validatePhone(inputValuePhone));
    //   setLoading(false);
    // }

    if (!nameError && !emailError && !phoneError) {
      try {
        const formData = {
          name: inputValueName,
          email: inputValueEmail,
          phone_number: inputValuePhone,
          locale: locale,
        };

        try {
          console.log(formData, "formData");
          const response = await fetch("/api/sendMessage", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(formData),
          });
          console.log(formData, "formData");
          if (response.ok) {
            // Handle success (e.g., display a success message)
            // Scroll to the form section
          } else {
            alert("Email or phone number already exists");
            setEmailError(true);
            setPhoneError(true);
            setLoading(false);
            return;
          }
        } catch (error) {
          console.error("An error occurred:", error);
        }

        if (!emailError) {
          setLoading(false);
          console.log("emailError", emailError);
          setInputValueName("");
          setInputValueEmail("");
          setInputValuePhone("");
          setNameError("");
          setEmailError("");
          setPhoneError("");
          //   setCheckboxChecked(false);
          setFormSubmitted(true);
          //   trackFormSubmit();
          setSectionID(sectionId);
        }

        // try {
        //   const response = await fetch("/api/bot", {
        //     method: "POST",
        //     headers: {
        //       "Content-Type": "application/json",
        //     },
        //     body: JSON.stringify(formData),
        //   });
        //   console.log(formData, "formData");
        // } catch (error) {
        //   console.error("An error occurred:", error);
        // }

        console.log(formSubmitted, "is form submitted?");
      } catch (error) {
        console.error("Error adding contact:", error);
      }
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-t-3xl h-full xl:absolute bottom-0 xl:max-w-[582px] max-h-[527px] xl:h-fit p-4 -mt-28 xl:mt-0 z-20   bg-[#F7F7FA]">
      <p className=" border-l-4 xl:border-none border-[#8861FF] text-xl px-4 my-4 font-medium ">
        {t["form head text"]}
      </p>
      <form action="" className="space-y-4">
        <input
          value={inputValueName}
          type="text"
          name="name"
          id="name"
          placeholder={t["Name"]}
          className={`w-full p-4  bg-white border-[1px] border-solid  rounded-xl   outline-none  
          `}
          onChange={(value) => handleChange(value, "name")}
          required
        />
        {nameError && (
          <p className="text-[14px] leading-[16.8px] text-red-500 h-[16.8px]">
            {nameError}
          </p>
        )}

        <input
          value={inputValueEmail}
          type="email"
          name="email"
          id="email"
          placeholder={t["Email"]}
          className={`w-full p-4  bg-white border-[1px] border-solid  rounded-xl   outline-none  
         `}
          onChange={(value) => handleChange(value, "email")}
          required
        />
        {emailError && (
          <p className="text-[14px] leading-[16.8px]  text-red-500 h-[16.8px]">
            {emailError}
          </p>
        )}

        <div
          className={`h-[56px] relative flex flex-row px-2 py-1.5 border-[1px] border-solid rounded-xl bg-white ${
            phoneError
              ? "shadow-md border-customOrangeTwo"
              : "shadow-none border-customGreyTwelve focus:border-customBlueSix"
          } hover:shadow`}
        >
          <PhoneInput
            international
            defaultCountry={defaultCountry}
            type="telephone"
            name="telephone"
            id="telephone"
            value={inputValuePhone}
            onChange={(value) => handleChange(value, "telephone")}
            className="w-full text-[16px] leading-[19.2px] text-customBlue placeholder-customGreyThirteen outline-none"
            inputClass="w-full py-3 px-2 bg-transparent border-none outline-none"
          />
        </div>
        {phoneError && (
          <p className=" text-red-500 border border-red-500 ">{phoneError}</p>
        )}
        <button
          onClick={handleSubmit}
          className="bg-[#8C56FF] text-xl font-me w-full rounded-full text-center text-white p-3"
        >
          {t["Get the Guide"]}
        </button>
      </form>
    </div>
  );
};

export default Form;
