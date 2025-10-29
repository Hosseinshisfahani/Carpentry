/**
 * Utility functions for converting Persian/Arabic numbers to English numbers
 */

// Persian/Arabic to English number mapping
const persianToEnglishMap = {
  '۰': '0', '۱': '1', '۲': '2', '۳': '3', '۴': '4',
  '۵': '5', '۶': '6', '۷': '7', '۸': '8', '۹': '9',
  '٠': '0', '١': '1', '٢': '2', '٣': '3', '٤': '4',
  '٥': '5', '٦': '6', '٧': '7', '٨': '8', '٩': '9'
};

// English to Persian number mapping (for display purposes)
const englishToPersianMap = {
  '0': '۰', '1': '۱', '2': '۲', '3': '۳', '4': '۴',
  '5': '۵', '6': '۶', '7': '۷', '8': '۸', '9': '۹'
};

/**
 * Converts Persian/Arabic numbers to English numbers
 * @param {string} input - Input string that may contain Persian/Arabic numbers
 * @returns {string} - String with English numbers
 */
export const convertPersianToEnglish = (input) => {
  if (!input || typeof input !== 'string') {
    return input;
  }
  
  return input.replace(/[۰-۹٠-٩]/g, (match) => persianToEnglishMap[match] || match);
};

/**
 * Converts English numbers to Persian numbers
 * @param {string} input - Input string that may contain English numbers
 * @returns {string} - String with Persian numbers
 */
export const convertEnglishToPersian = (input) => {
  if (!input || typeof input !== 'string') {
    return input;
  }
  
  return input.replace(/[0-9]/g, (match) => englishToPersianMap[match] || match);
};

/**
 * Validates if a string contains only valid number characters (English, Persian, Arabic)
 * @param {string} input - Input string to validate
 * @returns {boolean} - True if valid number string
 */
export const isValidNumberString = (input) => {
  if (!input || typeof input !== 'string') {
    return false;
  }
  
  // Allow empty string, decimal point, and minus sign
  if (input === '' || input === '.' || input === '-') {
    return true;
  }
  
  // Convert to English first, then validate
  const englishInput = convertPersianToEnglish(input);
  
  // Check if it's a valid number format
  const numberRegex = /^-?(\d+\.?\d*|\.\d+)$/;
  return numberRegex.test(englishInput);
};

/**
 * Parses a Persian/Arabic number string to a JavaScript number
 * @param {string} input - Input string that may contain Persian/Arabic numbers
 * @returns {number} - Parsed number
 */
export const parsePersianNumber = (input) => {
  if (!input || typeof input !== 'string') {
    return NaN;
  }
  
  const englishInput = convertPersianToEnglish(input);
  return parseFloat(englishInput);
};

/**
 * Formats a number to Persian digits for display
 * @param {number|string} input - Number to format
 * @returns {string} - Formatted string with Persian digits
 */
export const formatToPersianNumber = (input) => {
  if (input === null || input === undefined || input === '') {
    return '';
  }
  
  const numStr = String(input);
  return convertEnglishToPersian(numStr);
};

/**
 * Creates a custom onChange handler for TextField components
 * that automatically converts Persian numbers to English
 * @param {function} originalOnChange - Original onChange handler
 * @returns {function} - Enhanced onChange handler
 */
export const createPersianNumberHandler = (originalOnChange) => {
  return (event) => {
    const persianValue = event.target.value;
    const englishValue = convertPersianToEnglish(persianValue);
    
    // Create a new event with the converted value
    const convertedEvent = {
      ...event,
      target: {
        ...event.target,
        value: englishValue
      }
    };
    
    // Call the original handler with the converted value
    originalOnChange(convertedEvent);
  };
};
