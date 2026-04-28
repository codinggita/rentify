/**
 * Opens WhatsApp with a role-specific pre-filled welcome message.
 * @param {string} name - User's name
 * @param {string} role - User's role (OWNER, RENTER, SERVICE, INSPECTOR)
 * @param {string} phone - User's phone number (optional)
 */
export const sendWhatsAppWelcome = (name, role, phone) => {
  const roleKey = (role || 'RENTER').toUpperCase();
  
  const messages = {
    RENTER: `🗝️ *Welcome home, ${name}!* \n\nYour digital keys to Rentify are now active. We’ve handled the paperwork so you can focus on making your new place feel like home. Your premium dashboard is live—tap to start your journey! 🏡✨`,
    
    OWNER: `📈 *Rentify | Business Mode Active, ${name}!* \n\nWelcome to a smarter way to manage your portfolio. Your property command center is now live. We've automated the heavy lifting so you can focus on growth. Tap to view your assets! 🏢💼`,
    
    SERVICE: `🛠️ *Service Hub Online, ${name}!* \n\nWelcome to the Rentify elite network. Your service dashboard is ready for new jobs. We connect you with the right properties at the right time. Tap to start your shift! ⚡🔧`,
    
    INSPECTOR: `🔍 *Rentify | Inspection Protocol Active, ${name}!* \n\nWelcome to the network of certified inspectors. Your digital toolkit is now synced and ready for your first assignment. Let’s maintain the highest standards together. Tap to enter the field! 📋✅`
  };

  const message = messages[roleKey] || messages.RENTER;
  const encodedMessage = encodeURIComponent(message);
  
  const whatsappUrl = phone 
    ? `https://wa.me/${phone.replace(/[^\d+]/g, '').replace('+', '')}?text=${encodedMessage}`
    : `https://wa.me/?text=${encodedMessage}`;

  window.open(whatsappUrl, '_blank');
};
