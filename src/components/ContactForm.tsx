"use client";
import { useState, FormEvent } from 'react';

export default function ContactForm() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage('Sending...');

    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        setMessage('Thanks! We\'ll keep you updated.');
        setEmail('');
      } else {
        setMessage(data.error || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      setMessage('Network error. Please try again.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-[560px] mt-8">
      <div className="flex relative">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
          className="bg-[rgba(255,255,255,0.12)] border border-[rgba(255,255,255,0.2)] px-5 h-[54px] w-[900px] text-white"
          style={{ borderTopLeftRadius: '38px', borderBottomLeftRadius: '38px', borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="bg-[#00c853] text-white font-semibold px-6 h-[54px] w-[310px]"
          style={{ borderTopRightRadius: '38px', borderBottomRightRadius: '38px', borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          Stay Informed
        </button>
      </div>
      {message && (
        <div className="mt-2 text-center text-white">{message}</div>
      )}
    </form>
  );
}