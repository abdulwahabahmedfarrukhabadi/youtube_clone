import { motion } from "framer-motion";

const MoreOptionsIcon = () => {
  

  return (
    <div className="relative inline-block">
      {/* Three-dot menu icon */}
      <motion.span
        className="material-symbols-outlined"
        style={{
          fontVariationSettings: `'FILL' 1, 'wght' 700, 'GRAD' 0, 'opsz' 48`,
          transition: "color 0.3s ease",
          color: "#9e9e9e",
          cursor: "pointer",
        }}
        whileTap={{  rotate: 5}}
        >
        more_vert
      </motion.span>

    </div>
  );
};

export default MoreOptionsIcon;
