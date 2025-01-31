import { StringExpression } from "mongoose";

export const formatCardNumber = (cardNumber: string) => {
  return cardNumber.replace(/(\d{4})(?=\d)/g, "$1 ");
};
export function generateUniqueFilename(filename: string, extension: string) {
  // Bo'sh joy va URL-ga ta'sir qiluvchi belgilarni olib tashlaymiz
  filename = filename.replace(/[^a-zA-Z0-9_-]/g, "");
  
  // Hozirgi vaqtni olamiz (yil-oy-kun_soat-daqiqa-son)
  const now = new Date();
  const timestamp = now.toISOString().replace(/[-T:.Z]/g, "");
  
  // Unik fayl nomini yaratamiz
  return `${filename}_${timestamp}${extension}`;
}