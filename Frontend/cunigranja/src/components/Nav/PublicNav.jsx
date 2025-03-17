"use client"

import { motion } from "framer-motion"
import { useState } from "react"

function PublicNav() {
  const [hoveredItem, setHoveredItem] = useState(null)

  const navItems = [
    { href: "/quienes-somos", label: "Quienes somos" },
    { href: "/contactanos", label: "Contactanos" },
    { href: "/documentacion", label: "Documentacion" },
  ]

  const containerVariants = {
    hidden: { opacity: 0, y: -50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0 },
  }

  return (
    <motion.nav initial="hidden" animate="visible" variants={containerVariants} className="bg-black shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <motion.a href="#" className="flex items-center" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <motion.img
              src="../assets/img/CUNIGRANJA-1.png"
              alt="Logo"
              width="95"
              height="120"
              className="object-contain"
              initial={{ opacity: 0, rotate: -180 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.8 }}
            />
          </motion.a>

          <motion.ul className="flex items-center space-x-8" variants={containerVariants}>
            {navItems.map((item, index) => (
              <motion.li
                key={index}
                variants={itemVariants}
                onHoverStart={() => setHoveredItem(index)}
                onHoverEnd={() => setHoveredItem(null)}
                className="relative"
              >
                <motion.a
                  href={item.href}
                  className="text-white hover:text-blue-400 font-medium text-lg transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.label}
                  {hoveredItem === index && (
                    <motion.div
                      className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-400"
                      layoutId="underline"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                  )}
                </motion.a>
              </motion.li>
            ))}
            <motion.li variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <motion.a
                href="/user/login"
                className="bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                whileHover={{
                  boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                }}
              >
                <span>Ingresar</span>
                <motion.span initial={{ x: -5 }} animate={{ x: 0 }} whileHover={{ x: 5 }}>
                  →
                </motion.span>
              </motion.a>
            </motion.li>
          </motion.ul>
        </div>
      </div>
    </motion.nav>
  )
}

export default PublicNav

