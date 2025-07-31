import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Framer Motion Variants ---
const sectionVariants = {
  hidden: { opacity: 0, y: 80 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.08,
      duration: 0.5,
      ease: "easeOut",
    },
  }),
};

const buttonHover = {
  scale: 1.05,
  boxShadow: '0 15px 30px rgba(0,0,0,0.2)',
  transition: { type: "spring", stiffness: 300, damping: 10 }
};

const buttonTap = {
  scale: 0.95
};

// Mobile Nav Menu Variants
const mobileMenuVariants = {
  hidden: { opacity: 0, x: "100%" },
  visible: {
    opacity: 1,
    x: "0%",
    transition: {
      duration: 0.5,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.08,
    },
  },
  exit: {
    opacity: 0,
    x: "100%",
    transition: {
      duration: 0.4,
      ease: "easeIn",
    },
  },
};

const mobileMenuItemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};


// --- App Component ---
function App() {
  const [grossSalary, setGrossSalary] = useState('');
  const [netSalary, setNetSalary] = useState(0);
  const [deductions, setDeductions] = useState({
    PAYE: 0,
    NSSF: 0,
    SHIF: 0,
    HousingLevy: 0,
  });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState(() => {
    // Initialize theme from localStorage or default to 'light'
    if (typeof window !== 'undefined' && localStorage.getItem('theme')) {
      return localStorage.getItem('theme');
    }
    // Check system preference
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  useEffect(() => {
    // Apply theme class to HTML element
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
    // Store theme preference
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const calculatePayroll = () => {
    let gross = parseFloat(grossSalary) || 0;
    let ded = { PAYE: 0, NSSF: 0, SHIF: 0, HousingLevy: 0 };

    // NSSF (Simplified for demo, based on Kenyan NSSF Act 2013 tiers - actual rates may vary)
    const NSSF_TIER1_CAP = 7000;
    const NSSF_TIER2_CAP = 36000;
    const NSSF_RATE = 0.06;

    let nssfPensionablePay = Math.min(gross, NSSF_TIER2_CAP);
    let nssfTier1Contribution = Math.min(nssfPensionablePay, NSSF_TIER1_CAP) * NSSF_RATE;
    let nssfTier2Contribution = Math.max(0, nssfPensionablePay - NSSF_TIER1_CAP) * NSSF_RATE;
    ded.NSSF = nssfTier1Contribution + nssfTier2Contribution;

    // SHIF (Social Health Insurance Fund - effective July 2024, replaces NHIF)
    const SHIF_RATE = 0.0275;
    ded.SHIF = gross * SHIF_RATE;

    // Housing Levy (Affordable Housing Levy)
    const HOUSING_LEVY_RATE = 0.015;
    ded.HousingLevy = gross * HOUSING_LEVY_RATE;

    // Taxable Income Calculation
    let taxableIncome = gross - ded.NSSF - ded.SHIF - ded.HousingLevy;

    // PAYE (Pay As You Earn) Calculation - Simplified KRA Income Tax Bands (Illustrative for demo)
    // Current year is 2025, so we consider relevant tax bands for Kenya as of 2024/2025 financial year,
    // assuming no major changes. This is still illustrative.
    const PERSONAL_RELIEF = 2400; // Monthly personal relief

    let PAYE_before_relief = 0;
    if (taxableIncome <= 24000) { // Up to 24,000 KES
        PAYE_before_relief = taxableIncome * 0.10;
    } else if (taxableIncome <= 32333) { // 24,001 to 32,333 KES
        PAYE_before_relief = (24000 * 0.10) + ((taxableIncome - 24000) * 0.25);
    } else if (taxableIncome <= 500000) { // 32,334 to 500,000 KES
        PAYE_before_relief = (24000 * 0.10) + (8333 * 0.25) + ((taxableIncome - 32333) * 0.30);
    } else if (taxableIncome <= 800000) { // 500,001 to 800,000 KES
        PAYE_before_relief = (24000 * 0.10) + (8333 * 0.25) + (467667 * 0.30) + ((taxableIncome - 500000) * 0.325);
    } else { // Above 800,000 KES
        PAYE_before_relief = (24000 * 0.10) + (8333 * 0.25) + (467667 * 0.30) + (300000 * 0.325) + ((taxableIncome - 800000) * 0.35);
    }

    ded.PAYE = Math.max(0, PAYE_before_relief - PERSONAL_RELIEF);

    let finalNet = gross - ded.NSSF - ded.SHIF - ded.HousingLevy - ded.PAYE;

    setNetSalary(Math.round(finalNet));
    setDeductions(ded);
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      // Offset for sticky header
      const headerOffset = document.querySelector('header').offsetHeight;
      const elementPosition = element.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({
        top: elementPosition - headerOffset - 20, // 20px extra padding
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false); // Close menu on navigation
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-800 font-body antialiased flex flex-col overflow-x-hidden
                    dark:bg-neutral-900 dark:text-neutral-50"> {/* Dark mode base */}
      {/* Header */}
      <motion.header
        className="bg-neutral-900 text-white-custom py-4 shadow-strong z-50 sticky top-0
                   dark:bg-primary-900 dark:shadow-lg" // Dark mode header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <div className="container flex items-center justify-between">
          <h1 className="text-3xl font-heading font-bold">
            <a href="#home" onClick={() => scrollToSection('home')} className="hover:text-accent-300 transition-colors">Huashang HAIS Ltd</a>
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex flex-wrap justify-end gap-x-6 text-lg items-center"> {/* Added items-center */}
            {['Home', 'About', 'Services', 'Payroll', 'Resources', 'Contact'].map((item, index) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, '')}`}
                onClick={() => scrollToSection(item.toLowerCase().replace(/\s/g, ''))}
                className="text-white-custom hover:text-accent-300 transition-colors duration-200 py-1 px-2 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variants={navItemVariants}
                initial="hidden"
                animate="visible"
                custom={index}
              >
                {item}
              </motion.a>
            ))}
            {/* New Buttons for Desktop */}
            <motion.button
              className="bg-primary-600 hover:bg-primary-700 text-white-custom px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ml-6"
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={() => window.open('https://your-ess-portal.com', '_blank')} // Placeholder URL
            >
              ESS Portal
            </motion.button>
            <motion.button
              className="bg-primary-600 hover:bg-primary-700 text-white-custom px-4 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ml-2"
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={() => window.open('https://your-login-page.com', '_blank')} // Placeholder URL
            >
              Login
            </motion.button>
          </nav>

          <div className="flex items-center gap-4">
            {/* Theme Toggle Button */}
            <motion.button
              onClick={toggleTheme}
              className="text-white-custom text-xl px-3 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-accent-300
                         dark:text-accent-300"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              aria-label="Toggle theme"
            >
              <i className={`fas ${theme === 'light' ? 'fa-moon' : 'fa-sun'}`}></i>
            </motion.button>

            <motion.button
              className="hidden md:block bg-accent-500 hover:bg-accent-600 text-white-custom px-6 py-2 rounded-full font-semibold shadow-md transition-all duration-300 ml-6"
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={() => scrollToSection('contact')}
            >
              Request Demo
            </motion.button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden text-white-custom text-3xl focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle mobile menu"
            >
              <i className={`fas ${isMobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.nav
            className="fixed inset-0 bg-neutral-900 bg-opacity-95 z-40 flex flex-col items-center justify-center space-y-8 md:hidden
                       dark:bg-primary-900 dark:bg-opacity-95" // Dark mode mobile menu
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={mobileMenuVariants}
          >
            {['Home', 'About', 'Services', 'Payroll', 'Resources', 'Contact'].map((item) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase().replace(/\s/g, '')}`}
                onClick={() => scrollToSection(item.toLowerCase().replace(/\s/g, ''))}
                className="text-white-custom text-4xl font-heading font-bold hover:text-accent-300 transition-colors"
                variants={mobileMenuItemVariants}
                whileTap={{ scale: 0.95 }}
              >
                {item}
              </motion.a>
            ))}
            {/* New Buttons for Mobile */}
            <motion.button
              className="bg-primary-600 hover:bg-primary-700 text-white-custom px-8 py-4 rounded-full font-semibold text-xl shadow-lg transition-all duration-300"
              whileHover={buttonHover}
              whileTap={buttonTap}
              variants={mobileMenuItemVariants}
              onClick={() => { window.open('https://your-ess-portal.com', '_blank'); setIsMobileMenuOpen(false); }} // Placeholder URL
            >
              ESS Portal
            </motion.button>
            <motion.button
              className="bg-primary-600 hover:bg-primary-700 text-white-custom px-8 py-4 rounded-full font-semibold text-xl shadow-lg transition-all duration-300"
              whileHover={buttonHover}
              whileTap={buttonTap}
              variants={mobileMenuItemVariants}
              onClick={() => { window.open('https://your-login-page.com', '_blank'); setIsMobileMenuOpen(false); }} // Placeholder URL
            >
              Login
            </motion.button>
            <motion.button
              className="bg-accent-500 hover:bg-accent-600 text-white-custom px-8 py-4 rounded-full font-semibold text-xl shadow-lg transition-all duration-300 mt-10"
              whileHover={buttonHover}
              whileTap={buttonTap}
              variants={mobileMenuItemVariants}
              onClick={() => { scrollToSection('contact'); setIsMobileMenuOpen(false); }} // Close menu after click
            >
              Request Demo
            </motion.button>
          </motion.nav>
        )}
      </AnimatePresence>


      {/* --- Main Content Area --- */}
      <main className="flex-grow">
        {/* Hero Section - With Background Image */}
        <motion.section
          className="relative py-24 md:py-32 lg:py-40 bg-hr-hero-bg bg-cover bg-center text-white-custom text-center overflow-hidden"
          id="home"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
        >
          {/* Overlay for readability, mimicking the example image's dark blue/purple feel */}
          <div className="absolute inset-0 bg-primary-900 opacity-80"></div>
          {/* Subtle pattern on top of the image */}
          <div className="absolute inset-0 bg-pattern-squares opacity-10"></div>

          <div className="container relative z-10 flex flex-col items-center">
            <motion.h2
              className="text-5xl md:text-6xl lg:text-7xl font-heading font-bold mb-6 leading-tight max-w-5xl text-white"
              variants={itemVariants}
            >
              Streamline Your HR with Intelligent Solutions
            </motion.h2>
            <motion.p
              className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed mb-10 text-primary-100"
              variants={itemVariants}
            >
              Kenya's leading provider of data-driven HR analytics, payroll automation, and compliance solutions.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row justify-center gap-5"
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            >
              <motion.button
                className="bg-accent-500 hover:bg-accent-600 text-white-custom px-8 py-4 rounded-full font-semibold text-lg shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]"
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={() => scrollToSection('services')}
              >
                Explore Services
              </motion.button>
              <motion.button
                className="bg-white-custom text-primary-800 px-8 py-4 rounded-full font-semibold text-lg shadow-xl transform hover:-translate-y-1 transition-all duration-300 min-w-[200px]"
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={() => scrollToSection('contact')}
              >
                Get a Quote
              </motion.button>
            </motion.div>
          </div>
        </motion.section>

        {/* About Section */}
        <motion.section
          className="py-16 md:py-24 bg-white text-neutral-800
                     dark:bg-neutral-800 dark:text-neutral-50" // Dark mode for about section
          id="about"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants}>
              <h3 className="text-base text-primary-600 font-semibold mb-3">WHO WE ARE</h3>
              <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-800 mb-8 leading-tight
                             dark:text-white-custom">
                Driving HR Excellence Through Innovation
              </h2>
              <p className="text-lg text-neutral-700 leading-relaxed mb-6
                            dark:text-neutral-300">
                Huashang HAIS Ltd is at the forefront of human resource management and IT analytics in Kenya. We are dedicated to transforming traditional HR functions into strategic, data-driven powerhouses for businesses of all sizes. Our solutions are designed to address the unique challenges of the Kenyan HR landscape, ensuring local compliance and maximizing workforce potential.
              </p>
              <p className="text-lg text-neutral-700 leading-relaxed mb-8
                            dark:text-neutral-300">
                Our bespoke solutions empower organizations to optimize their workforce, ensure compliance, and unlock the full potential of their human capital through cutting-edge technology and unparalleled expertise. We partner with you to build resilient, efficient, and engaged workforces.
              </p>
              <motion.button
                className="bg-primary-600 hover:bg-primary-700 text-white-custom px-7 py-3 rounded-full font-semibold shadow-md transition-all duration-300"
                whileHover={buttonHover}
                whileTap={buttonTap}
                onClick={() => window.open('https://your-website.com/about-us', '_blank')} // Placeholder URL
              >
                Learn More About Us
              </motion.button>
            </motion.div>
            <motion.div variants={itemVariants} className="relative aspect-video rounded-xl shadow-xl overflow-hidden group">
              <img
                src="https://source.unsplash.com/random/800x600/?business-strategy,teamwork,data-analytics"
                alt="About Us"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-primary-900 opacity-20 group-hover:opacity-10 transition-opacity"></div>
            </motion.div>
          </div>
        </motion.section>

        {/* Services Section */}
        <motion.section
          className="py-16 md:py-24 bg-neutral-50
                     dark:bg-neutral-900" // Dark mode for services section
          id="services"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container">
            <h3 className="text-base text-primary-600 font-semibold mb-3 text-center">WHAT WE OFFER</h3>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-800 mb-14 text-center
                             dark:text-white-custom">
              Our Comprehensive HR & IT Solutions
            </h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {/* Service Card 1 */}
              <motion.a
                href="https://your-website.com/services/hr-analytics" // Updated Link
                className="block bg-white rounded-2xl shadow-strong p-8 border border-neutral-200 transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer flex flex-col items-start
                           dark:bg-neutral-800 dark:border-neutral-700" // Dark mode service card
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
              >
                <div className="text-primary-600 text-5xl mb-4 p-3 bg-primary-50 rounded-lg
                                dark:bg-primary-700 dark:text-accent-300">📊</div>
                <h3 className="text-2xl font-heading font-semibold text-primary-700 mb-3
                               dark:text-white-custom">HR Analytics & Insights</h3>
                <p className="text-neutral-600 leading-relaxed flex-grow
                              dark:text-neutral-300">
                  Unlock the power of your workforce data with our advanced analytics dashboards. Gain insights into attrition, performance, engagement, and D&I metrics.
                </p>
                <span className="mt-4 text-primary-600 font-semibold hover:text-accent-500 transition-colors flex items-center">
                  Learn More <span className="ml-2">→</span>
                </span>
              </motion.a>

              {/* Service Card 2 */}
              <motion.a
                href="https://your-website.com/services/payroll-ess" // Updated Link
                className="block bg-white rounded-2xl shadow-strong p-8 border border-neutral-200 transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer flex flex-col items-start
                           dark:bg-neutral-800 dark:border-neutral-700"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
              >
                <div className="text-primary-600 text-5xl mb-4 p-3 bg-primary-50 rounded-lg
                                dark:bg-primary-700 dark:text-accent-300">💰</div>
                <h3 className="text-2xl font-heading font-semibold text-primary-700 mb-3
                               dark:text-white-custom">Payroll & ESS Software</h3>
                <p className="text-neutral-600 leading-relaxed flex-grow
                              dark:text-neutral-300">
                  Automate complex payroll calculations, manage statutory deductions, generate payslips, and empower employees with our intuitive self-service portal.
                </p>
                <span className="mt-4 text-primary-600 font-semibold hover:text-accent-500 transition-colors flex items-center">
                  Learn More <span className="ml-2">→</span>
                </span>
              </motion.a>

              {/* Service Card 3 */}
              <motion.a
                href="https://your-website.com/services/outsourcing-staffing" // Updated Link
                className="block bg-white rounded-2xl shadow-strong p-8 border border-neutral-200 transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer flex flex-col items-start
                           dark:bg-neutral-800 dark:border-neutral-700"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
              >
                <div className="text-primary-600 text-5xl mb-4 p-3 bg-primary-50 rounded-lg
                                dark:bg-primary-700 dark:text-accent-300">🤝</div>
                <h3 className="text-2xl font-heading font-semibold text-primary-700 mb-3
                               dark:text-white-custom">Outsourcing & Staffing</h3>
                <p className="text-neutral-600 leading-relaxed flex-grow
                              dark:text-neutral-300">
                  Streamline your workforce with expert contract staffing, secondment models, and comprehensive HR support. We handle vetting, onboarding, and ongoing management.
                </p>
                <span className="mt-4 text-primary-600 font-semibold hover:text-accent-500 transition-colors flex items-center">
                  Learn More <span className="ml-2">→</span>
                </span>
              </motion.a>

              {/* Service Card 4 */}
              <motion.a
                href="https://your-website.com/services/compliance-advisory" // Updated Link
                className="block bg-white rounded-2xl shadow-strong p-8 border border-neutral-200 transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer flex flex-col items-start
                           dark:bg-neutral-800 dark:border-neutral-700"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
              >
                <div className="text-primary-600 text-5xl mb-4 p-3 bg-primary-50 rounded-lg
                                dark:bg-primary-700 dark:text-accent-300">⚖️</div>
                <h3 className="text-2xl font-heading font-semibold text-primary-700 mb-3
                               dark:text-white-custom">Compliance & Advisory</h3>
                <p className="text-neutral-600 leading-relaxed flex-grow
                              dark:text-neutral-300">
                  Navigate complex labor laws, develop robust policies, and ensure full adherence to OSHA and other statutory requirements with our expert guidance.
                </p>
                <span className="mt-4 text-primary-600 font-semibold hover:text-accent-500 transition-colors flex items-center">
                  Learn More <span className="ml-2">→</span>
                </span>
              </motion.a>

              {/* Service Card 5 */}
              <motion.a
                href="https://your-website.com/services/custom-software-dev" // Updated Link
                className="block bg-white rounded-2xl shadow-strong p-8 border border-neutral-200 transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer flex flex-col items-start
                           dark:bg-neutral-800 dark:border-neutral-700"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
              >
                <div className="text-primary-600 text-5xl mb-4 p-3 bg-primary-50 rounded-lg
                                dark:bg-primary-700 dark:text-accent-300">💻</div>
                <h3 className="text-2xl font-heading font-semibold text-primary-700 mb-3
                               dark:text-white-custom">Custom Software Dev</h3>
                <p className="text-neutral-600 leading-relaxed flex-grow
                              dark:text-neutral-300">
                  From cloud-based HRMS to mobile ESS apps, we develop scalable, secure software tailored to your unique business processes and integration needs.
                </p>
                <span className="mt-4 text-primary-600 font-semibold hover:text-accent-500 transition-colors flex items-center">
                  Learn More <span className="ml-2">→</span>
                </span>
              </motion.a>
            </motion.div>
          </div>
        </motion.section>

        {/* Payroll Calculator Section */}
        <motion.section
          className="py-16 md:py-24 bg-primary-800 text-white-custom"
          id="payroll"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div variants={itemVariants} className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
                Quick Net Pay Estimate
              </h2>
              <p className="text-xl opacity-90 leading-relaxed mb-8">
                Use our calculator to get an instant estimate of your take-home salary after Kenyan statutory deductions. This tool provides a simplified calculation for illustrative purposes based on current Kenyan tax laws (as of 2024/2025 financial year).
              </p>
              <img
                src="https://source.unsplash.com/random/600x400/?calculator,money,finance,keyboard"
                alt="Payroll Illustration"
                className="rounded-xl shadow-xl w-full max-w-lg mx-auto lg:mx-0"
              />
            </motion.div>
            <motion.div
              className="bg-white rounded-3xl shadow-xl p-8 md:p-10 space-y-6 border border-neutral-200 text-neutral-800
                         dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-50" // Dark mode for payroll card
              variants={itemVariants}
            >
              <h3 className="text-3xl font-heading font-bold text-primary-800 text-center mb-6
                             dark:text-white-custom">Payroll Calculator</h3>
              <input
                type="number"
                value={grossSalary}
                onChange={(e) => setGrossSalary(e.target.value)}
                placeholder="Enter Gross Salary (KES)"
                className="w-full p-4 border border-neutral-300 rounded-lg text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-inner bg-neutral-50
                           dark:bg-neutral-700 dark:border-neutral-600 dark:text-white-custom dark:placeholder-neutral-400" // Dark mode input
              />
              <motion.button
                onClick={calculatePayroll}
                className="bg-accent-500 hover:bg-accent-600 text-white-custom px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 w-full"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                Calculate Net Salary
              </motion.button>

              <motion.div
                className="text-left bg-neutral-50 p-6 rounded-xl border border-neutral-200 shadow-sm transition-all duration-500
                           dark:bg-neutral-700 dark:border-neutral-600" // Dark mode payroll results
                key={netSalary}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              >
                <p className="text-xl font-semibold text-primary-800 mb-2
                              dark:text-white-custom">Gross Salary: <span className="font-body text-neutral-700 dark:text-neutral-300">KES {grossSalary ? parseFloat(grossSalary).toLocaleString('en-KE') : '0'}</span></p>
                <p className="text-3xl font-bold text-accent-700 mb-4">Net Salary: <span className="font-body">KES {netSalary.toLocaleString('en-KE')}</span></p>
                <p className="text-lg font-semibold text-neutral-700 mb-2
                              dark:text-neutral-300">Deductions Summary:</p>
                <ul className="space-y-1 text-neutral-600 dark:text-neutral-400">
                  <li><span className="font-semibold">PAYE:</span> KES {deductions.PAYE.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</li>
                  <li><span className="font-semibold">NSSF:</span> KES {deductions.NSSF.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</li>
                  <li><span className="font-semibold">SHIF:</span> KES {deductions.SHIF.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</li>
                  <li><span className="font-semibold">Housing Levy:</span> KES {deductions.HousingLevy.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}</li>
                </ul>
              </motion.div>
            </motion.div>
          </div>
        </motion.section>

        {/* Resources / Blog Section */}
        <motion.section
          className="py-16 md:py-24 bg-white text-neutral-800
                     dark:bg-neutral-800 dark:text-neutral-50" // Dark mode for resources section
          id="resources"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container text-center">
            <h3 className="text-base text-primary-600 font-semibold mb-3">LATEST INSIGHTS</h3>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-800 mb-14
                             dark:text-white-custom">
              Explore Our HR Resources & Blog
            </h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              {/* Resource Card 1 */}
              <motion.a
                href="https://your-website.com/blog/hr-trends-2025" // Updated Link
                className="block bg-neutral-50 rounded-2xl shadow-strong p-6 border border-neutral-200 transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer text-left
                           dark:bg-neutral-700 dark:border-neutral-600" // Dark mode resource card
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
              >
                <img
                  src="https://source.unsplash.com/random/400x250/?hr-trends,future-of-work"
                  alt="Blog Post 1"
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />
                <h3 className="text-xl font-heading font-semibold text-primary-700 mb-2
                               dark:text-white-custom">
                  Top HR Trends to Watch in 2025
                </h3>
                <p className="text-neutral-600 text-sm mb-4 dark:text-neutral-300">July 25, 2025 | HR Insights</p>
                <p className="text-neutral-700 leading-relaxed text-sm dark:text-neutral-400">
                  Discover the key trends shaping the future of human resources, from AI in recruitment to flexible work models. Stay ahead of the curve with our expert analysis.
                </p>
              </motion.a>

              {/* Resource Card 2 */}
              <motion.a
                href="https://your-website.com/blog/payroll-automation-smes" // Updated Link
                className="block bg-neutral-50 rounded-2xl shadow-strong p-6 border border-neutral-200 transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer text-left
                           dark:bg-neutral-700 dark:border-neutral-600"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
              >
                <img
                  src="https://source.unsplash.com/random/400x250/?payroll-software,efficiency"
                  alt="Blog Post 2"
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />
                <h3 className="text-xl font-heading font-semibold text-primary-700 mb-2
                               dark:text-white-custom">
                  Automating Payroll: A Guide for Kenyan SMEs
                </h3>
                <p className="text-neutral-600 text-sm mb-4 dark:text-neutral-300">July 20, 2025 | Payroll</p>
                <p className="text-neutral-700 leading-relaxed text-sm dark:text-neutral-400">
                  Learn how automating your payroll can save time, reduce errors, and ensure compliance for your business. A must-read for small and medium enterprises.
                </p>
              </motion.a>

              {/* Resource Card 3 */}
              <motion.a
                href="https://your-website.com/blog/employee-engagement-hybrid" // Updated Link
                className="block bg-neutral-50 rounded-2xl shadow-strong p-6 border border-neutral-200 transform hover:scale-[1.02] transition-transform duration-300 cursor-pointer text-left
                           dark:bg-neutral-700 dark:border-neutral-600"
                variants={itemVariants}
                whileHover={{ y: -5, boxShadow: '0 15px 30px rgba(0,0,0,0.1)' }}
              >
                <img
                  src="https://source.unsplash.com/random/400x250/?employee-engagement,workplace-culture"
                  alt="Blog Post 3"
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />
                <h3 className="text-xl font-heading font-semibold text-primary-700 mb-2
                               dark:text-white-custom">
                  Boosting Employee Engagement in a Hybrid World
                </h3>
                <p className="text-neutral-600 text-sm mb-4 dark:text-neutral-300">July 15, 2025 | Workplace Culture</p>
                <p className="text-neutral-700 leading-relaxed text-sm dark:text-neutral-400">
                  Strategies to keep your team motivated and connected, whether they're in the office or working remotely. Build a thriving hybrid workplace.
                </p>
              </motion.a>
            </motion.div>
            <motion.button
              className="mt-12 bg-primary-600 hover:bg-primary-700 text-white-custom px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300"
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={() => window.open('https://your-website.com/blog', '_blank')} // Placeholder URL for all resources
            >
              View All Resources
            </motion.button>
          </div>
        </motion.section>


        {/* Call to Action - Testimonials & Trust */}
        <motion.section
          className="py-16 md:py-24 bg-primary-50 text-neutral-800
                     dark:bg-neutral-900" // Dark mode for testimonials background
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container text-center max-w-5xl">
            <h3 className="text-base text-primary-600 font-semibold mb-3">TRUSTED BY LEADERS</h3>
            <h2 className="text-4xl md:text-5xl font-heading font-bold text-primary-800 mb-12
                             dark:text-white-custom">
              Our Clients Speak for Themselves
            </h2>
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              variants={{ visible: { transition: { staggerChildren: 0.1 } } }}
            >
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 shadow-smooth border border-neutral-200 flex flex-col items-center text-center
                           dark:bg-neutral-800 dark:border-neutral-700" // Dark mode testimonial card
              >
                <img src="https://api.dicebear.com/8.x/avataaars/svg?seed=Annie&radius=50" alt="Client 1" className="w-20 h-20 rounded-full mb-4 shadow-md object-cover" />
                <p className="text-lg italic text-neutral-700 mb-4 dark:text-neutral-300">"Huashang HAIS revolutionized our payroll system. It's precise, efficient, and so easy to use. Highly recommended!"</p>
                <p className="font-semibold text-primary-700 dark:text-accent-300">- Jane Doe, CEO of TechCorp</p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 shadow-smooth border border-neutral-200 flex flex-col items-center text-center
                           dark:bg-neutral-800 dark:border-neutral-700"
              >
                <img src="https://api.dicebear.com/8.x/avataaars/svg?seed=John&radius=50" alt="Client 2" className="w-20 h-20 rounded-full mb-4 shadow-md object-cover" />
                <p className="text-lg italic text-neutral-700 mb-4 dark:text-neutral-300">"Their HR analytics helped us identify key trends, leading to a significant boost in employee retention."</p>
                <p className="font-semibold text-primary-700 dark:text-accent-300">- John Smith, HR Director at Global Logistics</p>
              </motion.div>
              <motion.div
                variants={itemVariants}
                className="bg-white rounded-2xl p-8 shadow-smooth border border-neutral-200 flex flex-col items-center text-center
                           dark:bg-neutral-800 dark:border-neutral-700"
              >
                <img src="https://api.dicebear.com/8.x/avataaars/svg?seed=Sarah&radius=50" alt="Client 3" className="w-20 h-20 rounded-full mb-4 shadow-md object-cover" />
                <p className="text-lg italic text-neutral-700 mb-4 dark:text-neutral-300">"Compliance used to be a headache. Now, with Huashang HAIS, we're always up-to-date and worry-free."</p>
                <p className="font-semibold text-primary-700 dark:text-accent-300">- Sarah Chen, Operations Manager, HealthPlus</p>
              </motion.div>
            </motion.div>
            <motion.button
              className="mt-12 bg-accent-500 hover:bg-accent-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300"
              whileHover={buttonHover}
              whileTap={buttonTap}
              onClick={() => window.open('https://your-website.com/testimonials', '_blank')} // Placeholder URL
            >
              Read More Success Stories
            </motion.button>
          </div>
        </motion.section>

        {/* Contact Us Section */}
        <motion.section
          className="py-16 md:py-24 bg-primary-900 text-white-custom"
          id="contact"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="container grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <motion.div variants={itemVariants}>
              <h3 className="text-base text-accent-300 font-semibold mb-3">GET IN TOUCH</h3>
              <h2 className="text-4xl md:text-5xl font-heading font-bold mb-6 leading-tight">
                Let's Transform Your HR Together
              </h2>
              <p className="text-lg opacity-90 leading-relaxed mb-8">
                Ready to elevate your HR strategy? Reach out to our experts today for a personalized consultation or demo. We're here to help you navigate the complexities of modern HR and IT.
              </p>
              <div className="space-y-6 text-lg">
                <p className="flex items-center"><span className="text-accent-300 text-2xl mr-3"><i className="fas fa-map-marker-alt"></i></span> Huashang HAIS Ltd, Ngara Road, Nairobi, Kenya</p>
                <p className="flex items-center"><span className="text-accent-300 text-2xl mr-3"><i className="fas fa-phone"></i></span> <a href="tel:+2547012250599" className="hover:underline text-white-custom">+254-701-225-0599</a></p>
                <p className="flex items-center"><span className="text-accent-300 text-2xl mr-3"><i className="fas fa-envelope"></i></span> <a href="mailto:info@hais.co.ke" className="hover:underline text-white-custom">info@hais.co.ke</a></p>
                <p className="flex items-center"><span className="text-accent-300 text-2xl mr-3"><i className="fas fa-globe"></i></span> <a href="https://www.hais.co.ke" target="_blank" rel="noopener noreferrer" className="hover:underline text-white-custom">www.hais.co.ke</a></p>
              </div>
              <div className="social-links flex gap-6 mt-10">
                <a href="#" className="text-white-custom hover:text-accent-300 transition-colors duration-200 text-3xl" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
                <a href="#" className="text-white-custom hover:text-accent-300 transition-colors duration-200 text-3xl" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
                <a href="#" className="text-white-custom hover:text-accent-300 transition-colors duration-200 text-3xl" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
              </div>
            </motion.div>
            <motion.form
              className="bg-white rounded-3xl shadow-xl p-8 md:p-10 space-y-5 border border-neutral-200 text-neutral-800
                         dark:bg-neutral-800 dark:border-neutral-700 dark:text-neutral-50" // Dark mode for contact form
              variants={itemVariants}
            >
              <h3 className="text-3xl font-heading font-bold text-primary-800 mb-6 text-center
                             dark:text-white-custom">Send Us a Message</h3>
              <input type="text" placeholder="Your Full Name" className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-inner bg-neutral-50
                         dark:bg-neutral-700 dark:border-neutral-600 dark:text-white-custom dark:placeholder-neutral-400" />
              <input type="text" placeholder="Company Name (Optional)" className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-inner bg-neutral-50
                         dark:bg-neutral-700 dark:border-neutral-600 dark:text-white-custom dark:placeholder-neutral-400" />
              <input type="email" placeholder="Email Address" className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-inner bg-neutral-50
                         dark:bg-neutral-700 dark:border-neutral-600 dark:text-white-custom dark:placeholder-neutral-400" />
              <select name="inquiryType" className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none bg-neutral-50 text-neutral-600 shadow-inner
                         dark:bg-neutral-700 dark:border-neutral-600 dark:text-white-custom"> {/* Dark mode select */}
                <option value="">Select Inquiry Type</option>
                <option value="general">General Inquiry</option>
                <option value="demo">Request a Demo</option>
                <option value="support">Support Request</option>
                <option value="partnership">Partnership Opportunity</option>
              </select>
              <textarea placeholder="Your Message" rows="5" className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none shadow-inner resize-y bg-neutral-50
                            dark:bg-neutral-700 dark:border-neutral-600 dark:text-white-custom dark:placeholder-neutral-400"></textarea>
              <motion.button
                type="submit"
                className="bg-accent-500 hover:bg-accent-600 text-white-custom px-8 py-4 rounded-full font-semibold text-lg shadow-lg transition-all duration-300 w-full"
                whileHover={buttonHover}
                whileTap={buttonTap}
              >
                Send Message
              </motion.button>
            </motion.form>
          </div>
        </motion.section>
      </main>

      {/* Floating Chat Support Button */}
      <motion.a
        href="mailto:info@hais.co.ke?subject=Chat%20Support" // Simple mailto link or replace with live chat system link
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 bg-accent-500 text-white-custom p-4 rounded-full shadow-lg text-3xl z-50
                   flex items-center justify-center transition-all duration-300 hover:bg-accent-600 hover:scale-110"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.5, duration: 0.8, ease: "easeOut" }}
        aria-label="Chat support"
      >
        <i className="fas fa-comments"></i>
      </motion.a>

      {/* Footer */}
      <motion.footer
        className="bg-neutral-900 text-white-custom py-10
                   dark:bg-primary-900" // Dark mode footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <div className="container text-center md:text-left grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-2xl font-heading font-bold text-accent-300 mb-4">Huashang HAIS</h3>
            <p className="text-neutral-300 text-sm leading-relaxed max-w-xs">
              Empowering HR with cutting-edge analytics, seamless payroll, and robust compliance solutions for the Kenyan market.
            </p>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-heading font-semibold mb-4 text-white-custom">Quick Links</h3>
            <ul className="space-y-2 text-neutral-300 text-base">
              <li><a href="#home" onClick={() => scrollToSection('home')} className="hover:text-accent-300 transition-colors">Home</a></li>
              <li><a href="#about" onClick={() => scrollToSection('about')} className="hover:text-accent-300 transition-colors">About Us</a></li>
              <li><a href="#services" onClick={() => scrollToSection('services')} className="hover:text-accent-300 transition-colors">Services</a></li>
              <li><a href="#payroll" onClick={() => scrollToSection('payroll')} className="hover:text-accent-300 transition-colors">Payroll Calculator</a></li>
              <li><a href="#resources" onClick={() => scrollToSection('resources')} className="hover:text-accent-300 transition-colors">Resources</a></li>
              <li><a href="#contact" onClick={() => scrollToSection('contact')} className="hover:text-accent-300 transition-colors">Contact</a></li>
              {/* New Footer Links */}
              <li><a href="https://your-ess-portal.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-300 transition-colors">ESS Portal</a></li>
              <li><a href="https://your-login-page.com" target="_blank" rel="noopener noreferrer" className="hover:text-accent-300 transition-colors">Client Login</a></li>
            </ul>
          </div>
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-xl font-heading font-semibold mb-4 text-white-custom">Legal & Support</h3>
            <ul className="space-y-2 text-neutral-300 text-base">
              <li><a href="https://your-website.com/privacy-policy" target="_blank" rel="noopener noreferrer" className="hover:text-accent-300 transition-colors">Privacy Policy</a></li> {/* Updated Link */}
              <li><a href="https://your-website.com/terms-of-service" target="_blank" rel="noopener noreferrer" className="hover:text-accent-300 transition-colors">Terms of Service</a></li> {/* Updated Link */}
              <li><a href="https://your-website.com/support" target="_blank" rel="noopener noreferrer" className="hover:text-accent-300 transition-colors">Support Center</a></li> {/* Updated Link */}
              <li><a href="https://your-website.com/faqs" target="_blank" rel="noopener noreferrer" className="hover:text-accent-300 transition-colors">FAQs</a></li> {/* Updated Link */}
            </ul>
            <div className="social-links flex gap-5 mt-6 text-2xl">
              <a href="#" className="hover:text-accent-300 transition-colors" aria-label="LinkedIn"><i className="fab fa-linkedin"></i></a>
              <a href="#" className="hover:text-accent-300 transition-colors" aria-label="Twitter"><i className="fab fa-twitter"></i></a>
              <a href="#" className="hover:text-accent-300 transition-colors" aria-label="Facebook"><i className="fab fa-facebook"></i></a>
            </div>
          </div>
        </div>
        <div className="container border-t border-neutral-700 mt-8 pt-8 text-center">
          <p className="text-sm opacity-80">&copy; {new Date().getFullYear()} Huashang HAIS Ltd. All Rights Reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;