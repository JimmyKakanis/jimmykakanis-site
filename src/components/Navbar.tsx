import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <header className="py-4 border-b border-gray-100 text-center">
      <nav className="flex justify-center flex-wrap gap-4 px-4">
        <Link to="/" className="text-gray-500 hover:text-black font-semibold text-sm uppercase tracking-wider transition-colors">Home</Link>
        <Link to="/about" className="text-gray-500 hover:text-black font-semibold text-sm uppercase tracking-wider transition-colors">About Me</Link>
        <Link to="/projects" className="text-gray-500 hover:text-black font-semibold text-sm uppercase tracking-wider transition-colors">Projects</Link>
        <Link to="/blog" className="text-gray-500 hover:text-black font-semibold text-sm uppercase tracking-wider transition-colors">Blog</Link>
        <Link to="/contact" className="text-gray-500 hover:text-black font-semibold text-sm uppercase tracking-wider transition-colors">Contact Me</Link>
      </nav>
    </header>
  );
};

export default Navbar;

