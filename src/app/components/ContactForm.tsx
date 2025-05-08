// src/components/ContactForm.tsx
'use client'; // Important for using hooks like useState and event handlers

import { useState } from 'react';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage('');

    // Basic client-side validation (you might add more)
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      setMessage('Please enter a valid email address.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/subscribe', { // Your API endpoint
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Thank you for subscribing!');
        setEmail(''); // Clear input on success
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Submission error:', error);
      setMessage('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col sm:flex-row gap-3 items-center justify-center">
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        required
        className="px-4 py-3 text-base text-gray-800 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 flex-grow w-full sm:w-auto"
        disabled={isLoading}
      />
      <button
        type="submit"
        className="px-6 py-3 text-base font-medium text-black bg-[#9EFF00] rounded-md shadow-sm hover:bg-[#8EEC00] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#9EFF00] transition duration-150 ease-in-out w-full sm:w-auto disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Stay Informed'}
      </button>
      {message && <p className="mt-3 text-sm text-white w-full text-center sm:col-span-2">{message}</p>}
    </form>
  );
}