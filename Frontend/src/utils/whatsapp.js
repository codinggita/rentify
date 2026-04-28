/**
 * Opens WhatsApp with a pre-filled welcome message.
 * @param {string} name - User's name
 * @param {string} phone - User's phone number (if available)
 */
export const sendWhatsAppWelcome = (name, phone) => {
  const message = `🗝️ *Welcome to the future of living, ${name}!* \n\nYour digital keys to Rentify are now active. We’ve handled the paperwork so you can focus on the memories. Your premium dashboard is live—tap to start your journey! 🏡✨`;
  
  const encodedMessage = encodeURIComponent(message);
  
  // Use the user's phone if provided, otherwise open a general chat with your support number
  // Replace 'YOUR_SUPPORT_NUMBER' with your actual number if you want them to message YOU.
  const whatsappUrl = phone 
    ? `https://wa.me/${phone.replace('+', '')}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
};
