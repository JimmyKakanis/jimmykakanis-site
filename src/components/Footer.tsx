const Footer = () => {
  return (
    <footer className="py-12 border-t border-gray-100 mt-12">
      <div className="max-w-6xl mx-auto px-6 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Jimmy Kakanis. All rights reserved.</p>
        <p className="mt-2 font-serif italic">As I Teach, I Learn. As I Learn, I Share.</p>
      </div>
    </footer>
  );
};

export default Footer;

