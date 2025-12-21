const Contact = () => {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-4xl font-serif mb-8 flex items-center gap-2">
        <span role="img" aria-label="mailbox">📬</span> Contact Us
      </h1>
      <form className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-semibold mb-2 uppercase tracking-tight text-gray-600">Name</label>
          <input type="text" id="name" name="name" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-semibold mb-2 uppercase tracking-tight text-gray-600">Email</label>
          <input type="email" id="email" name="email" required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all" />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-semibold mb-2 uppercase tracking-tight text-gray-600">Message</label>
          <textarea id="message" name="message" rows={5} required className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-red/20 focus:border-brand-red transition-all"></textarea>
        </div>
        <button type="submit" className="bg-brand-red hover:bg-brand-red-hover text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md">
          Send Message
        </button>
      </form>
    </div>
  );
};

export default Contact;

