import { FaClock } from 'react-icons/fa';

export const ComingSoon = ({ title }) => {
  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
      <div className="text-center">
        <FaClock className="text-6xl text-gray-400 mb-6 mx-auto" />
        <h1 className="text-5xl md:text-6xl font-serif font-bold text-black mb-4">
          {title}
        </h1>
        <p className="text-xl text-gray-600 max-w-md">
          This page is coming soon. Stay tuned for updates.
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;
