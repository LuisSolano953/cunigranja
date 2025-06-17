"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { useAuth } from "@/context/authContext"
import { usePathname, useRouter } from "next/navigation"
import { Menu, X } from "lucide-react"

function PublicNav() {
  const [hoveredItem, setHoveredItem] = useState(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const { user, isAdmin, logout } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // Detectar si es móvil con más breakpoints
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024) // Cambio a lg breakpoint para mejor responsive
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Prevenir scroll cuando el menú móvil está abierto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMobileMenuOpen])

  // Verificar si estamos en una ruta pública
  const isPublicRoute = ["/", "/quienes-somos", "/contactanos", "/documentacion"].includes(pathname)

  // Solo mostrar opciones de usuario en rutas públicas
  const showUserOptions = isPublicRoute

  const navItems = [
    { href: "/quienes-somos", label: "Quienes somos" },
    { href: "/contactanos", label: "Contactanos" },
    { href: "/documentacion", label: "Documentacion" },
  ]

  // Agregar elementos de navegación para usuarios autenticados solo si estamos en una ruta pública
  if (showUserOptions && user) {
    navItems.push({ href: "/Dashboar", label: "Dashboard" })
  }

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

  const handleNavigation = (href) => {
    router.push(href)
    setIsMobileMenuOpen(false)
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    <>
      <motion.nav
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="bg-black shadow-lg relative z-50 w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 lg:h-24">
            {/* Logo - Responsive */}
            <motion.a
              onClick={() => handleNavigation("/")}
              className="flex items-center cursor-pointer flex-shrink-0"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.img
                src="../assets/img/CUNIGRANJA-1.png"
                alt="Logo"
                className="object-contain w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28"
                initial={{ opacity: 0, rotate: -180 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.8 }}
              />
            </motion.a>

            {/* Desktop Navigation - Responsive */}
            {!isMobile && (
              <motion.ul className="hidden lg:flex items-center space-x-4 xl:space-x-8" variants={containerVariants}>
                {navItems.map((item, index) => (
                  <motion.li
                    key={index}
                    variants={itemVariants}
                    onHoverStart={() => setHoveredItem(index)}
                    onHoverEnd={() => setHoveredItem(null)}
                    className="relative"
                  >
                    <motion.a
                      onClick={() => handleNavigation(item.href)}
                      className="text-white hover:text-blue-400 font-medium text-sm lg:text-base xl:text-lg transition-colors duration-200 flex items-center cursor-pointer px-2 py-1"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {item.icon && item.icon}
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

                {!user ? (
                  <motion.li variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <motion.a
                      onClick={() => handleNavigation("/user/login")}
                      className="bg-blue-600 text-white px-4 py-2 lg:px-6 lg:py-2 rounded-full font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl cursor-pointer text-sm lg:text-base"
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
                ) : showUserOptions ? (
                  <motion.li variants={itemVariants} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <motion.a
                      onClick={() => {
                        logout()
                        handleNavigation("/user/login")
                      }}
                      className="bg-red-600 text-white px-4 py-2 lg:px-6 lg:py-2 rounded-full font-medium hover:bg-red-700 transition-colors duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl cursor-pointer text-sm lg:text-base"
                      whileHover={{
                        boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                      }}
                    >
                      <span>Cerrar Sesión</span>
                    </motion.a>
                  </motion.li>
                ) : null}
              </motion.ul>
            )}

            {/* Mobile Menu Button - Responsive */}
            {isMobile && (
              <motion.button
                onClick={toggleMobileMenu}
                className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors lg:hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isMobileMenuOpen ? (
                  <X size={20} className="sm:w-6 sm:h-6" />
                ) : (
                  <Menu size={20} className="sm:w-6 sm:h-6" />
                )}
              </motion.button>
            )}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      {isMobile && isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu - Responsive */}
      {isMobile && (
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: isMobileMenuOpen ? 0 : "100%" }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed top-0 right-0 h-full w-72 sm:w-80 max-w-[85vw] bg-black shadow-2xl z-50 overflow-y-auto"
        >
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-800">
            <motion.img
              src="../assets/img/CUNIGRANJA-1.png"
              alt="Logo"
              className="object-contain w-12 h-12 sm:w-16 sm:h-16"
            />
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <X size={18} className="sm:w-5 sm:h-5" />
            </button>
          </div>

          {/* Mobile Menu Items */}
          <div className="py-4">
            {navItems.map((item, index) => (
              <motion.a
                key={index}
                onClick={() => handleNavigation(item.href)}
                className="block px-4 sm:px-6 py-3 sm:py-4 text-white hover:text-blue-400 hover:bg-white/5 transition-colors duration-200 cursor-pointer border-b border-gray-800/50"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10 }}
              >
                <span className="font-medium text-base sm:text-lg">{item.label}</span>
              </motion.a>
            ))}

            {/* Mobile Auth Buttons */}
            <div className="px-4 sm:px-6 py-4 space-y-3">
              {!user ? (
                <motion.button
                  onClick={() => handleNavigation("/user/login")}
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-full font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center space-x-2 text-sm sm:text-base"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Ingresar</span>
                  <span>→</span>
                </motion.button>
              ) : showUserOptions ? (
                <motion.button
                  onClick={() => {
                    logout()
                    handleNavigation("/user/login")
                  }}
                  className="w-full bg-red-600 text-white py-3 px-4 rounded-full font-medium hover:bg-red-700 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: navItems.length * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span>Cerrar Sesión</span>
                </motion.button>
              ) : null}
            </div>
          </div>
        </motion.div>
      )}
    </>
  )
}

export default PublicNav
