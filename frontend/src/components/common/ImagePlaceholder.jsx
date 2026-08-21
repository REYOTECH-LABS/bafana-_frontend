import { FaImage } from 'react-icons/fa';

export const ImagePlaceholder = ({
  label = 'Image',
  width = 'w-full',
  height = 'h-64',
  bgColor = 'bg-gradient-to-br from-gray-100 to-gray-200'
}) => {
  return (
    <div className={`${width} ${height} ${bgColor} rounded-lg flex flex-col items-center justify-center`}>
      <FaImage className="text-gray-400 text-4xl mb-3" />
      <p className="text-gray-500 text-sm text-center px-4">
        {label}
      </p>
    </div>
  );
};

export default ImagePlaceholder;
