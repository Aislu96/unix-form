import validator from "validator";
import { isValidPhoneNumber } from "react-phone-number-input";

export const validateName = (name) => {
  const namePattern = /^[\p{L}\s\-']+$/u; // Updated regex to allow any Unicode letters
  if (name.length < 1) {
    return "Name is required";
  } else if (name.length < 2) {
    return "Minimum length is 2 characters";
  } else if (name.length > 50) {
    return "The name must contain no more than 50 characters.";
  } else if (!namePattern.test(name)) {
    return "Invalid characters in name";
  } else {
    return "";
  }
};

export const validateEmail = (email) => {
  if (!email) {
    return "Email is required";
  } else if (email.length < 4) {
    return "Minimum length is 4 characters";
  } else if (email.length > 50) {
    return "Maximum length is 50 characters";
  } else if (!validator.isEmail(email)) {
    return "Invalid email address";
  } else {
    return "";
  }
};

export const validatePhone = (phone) => {
  if (!phone) {
    return "Phone number is required";
  } else if (!isValidPhoneNumber(phone)) {
    return "Invalid phone number format";
  } else {
    return "";
  }
};
