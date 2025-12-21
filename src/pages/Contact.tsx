import React, { useState } from 'react';

const Contact = () => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');
    
    const form = e.currentTarget;
    const data = new FormData(form);
    
    try {
      const response = await fetch('https://formspree.io/f/xvgznoal', {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      
      if (response.ok) {
        setStatus('success');
        form.reset();
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif mb-8 flex items-center gap-2">
        <span role="img" aria-label="mailbox">📬</span> Contact Us
      </h1>
      
      {status === 'success' ? (
        <div className="p-8 bg-green-50 rounded-2xl text-center border border-green-100">
          <h2 className="text-2xl font-serif text-green-800 mb-2">Message Sent!</h2>
          <p className="text-green-600">Thanks for reaching out, Jimmy. I'll get back to you as soon as I can.</p>
          <button 
            onClick={() => setStatus('idle')}
            className="mt-6 text-sm font-bold uppercase tracking-wider text-green-800 hover:underline"
          >
            Send another message
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {status === 'error' && (
            <div className="p-4 bg-red-50 text-red-600 rounded-lg text-sm border border-red-100">
              Oops! There was a problem sending your message. Please try again.
            </div>
          )}
          <div>
            <label htmlFor="name" className="block text-sm font-semibold mb-2 uppercase tracking-tight text-gray-600">Name</label>
            <input type="text" id="name" name="name" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all" />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-semibold mb-2 uppercase tracking-tight text-gray-600">Email</label>
            <input type="email" id="email" name="_replyto" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all" />
          </div>
          <div>
            <label htmlFor="message" className="block text-sm font-semibold mb-2 uppercase tracking-tight text-gray-600">Message</label>
            <textarea id="message" name="message" rows={5} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"></textarea>
          </div>
          <button 
            type="submit" 
            disabled={status === 'submitting'}
            className="bg-brand-red hover:bg-brand-red-hover text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md disabled:bg-gray-400"
          >
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  );
};

export default Contact;

