export const convertPhoneVietNamToInternational = (phone: string): string => {
  // Remove all spaces, dashes, and parentheses
  const cleanedPhone = phone.replace(/[\s-()]/g, "");

  // Check if the phone number starts with '0' and has 10 or 11 digits
  if (/^0\d{9,10}$/.test(cleanedPhone)) {
    return "+84" + cleanedPhone.slice(1);
  }

  // If the phone number already starts with '+84', return it as is
  if (/^\+84\d{9,10}$/.test(cleanedPhone)) {
    return cleanedPhone;
  }
  // If the phone number format is invalid, return it unchanged
  return phone;
};
