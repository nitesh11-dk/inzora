"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaWhatsapp, FaTimes } from 'react-icons/fa';

const WhatsAppFormPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const whatsappUrl = "https://whatsapp.com/channel/0029VbBW4eiLo4hlVC8BT932";
      window.open(whatsappUrl, "_blank");

      setTimeout(() => {
        router.push('/dashboard');
      }, 1000);
    } catch (error) {
      console.error('Error joining channel:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <FaTimes size={20} />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="bg-green-500 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaWhatsapp className="text-white text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Join Our WhatsApp Channel
          </h2>
          <p className="text-gray-600">
            Get instant updates about new services, offers, and exclusive deals!
          </p>
        </div>

        {/* Join Button Only */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Joining...
            </>
          ) : (
            <>
              <FaWhatsapp />
              Join WhatsApp Channel
            </>
          )}
        </button>

        {/* Benefits */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-800 mb-3">What you'll get:</h3>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Instant service updates
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Exclusive offers and discounts
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Priority customer support
            </li>
            <li className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              New feature announcements
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default WhatsAppFormPage;
