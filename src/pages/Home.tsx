import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="relative group overflow-hidden rounded-xl shadow-lg aspect-[4/3]">
        <Link to="/projects">
          <img src="/img/DSCF5041.JPG" alt="Projects" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-8">
            <h2 className="text-white text-3xl font-serif font-bold !mt-0 !mb-0">Projects</h2>
          </div>
        </Link>
      </div>
      <div className="relative group overflow-hidden rounded-xl shadow-lg aspect-[4/3]">
        <Link to="/blog">
          <img src="/img/thumb - snow_1.59.1.png" alt="Blog" className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end justify-center p-8">
            <h2 className="text-white text-3xl font-serif font-bold !mt-0 !mb-0">Blog</h2>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Home;

