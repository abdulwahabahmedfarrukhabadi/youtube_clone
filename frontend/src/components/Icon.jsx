/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import './Icon.css'; // Import the CSS styles for Material Symbols

const Icon = ({ name, liked, onClick, fill = 0, weight = 400, grade = 0, opticalSize = 16 }) => {
  return (
    
    <motion.span
      className="material-symbols-outlined"
      style={{
        fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' ${grade}, 'opsz' ${opticalSize}`,
        transition: 'color 0.3s ease, font-variation-settings 0.3s ease', // Adding smooth transition
        color: liked ? 'black' : '#9e9e9e',
        cursor: 'pointer', // Green when liked, gray when not liked
      }}
      whileTap={{  scale: 1.2, // Increase the scale to make it bigger during the tap
        rotate: 10, // Rotate the icon during tap for extra flair
        y: [-20, 0],
       }} // Animation on click (scale)
      transition={{ type: 'spring', stiffness: 700, damping: 20, duration:0.3, }}
      onClick={onClick} // Handling the like button toggle
    >
      {name}
    </motion.span>
    
  );
};

export default Icon;

