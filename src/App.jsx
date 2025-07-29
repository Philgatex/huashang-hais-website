import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Chart from 'chart.js/auto';

function App() {
  const [formData, setFormData] = useState({ name: '', company: '', emailPhone: '', message: '', inquiry: 'General' });
  const [payrollData, setPayrollData] = useState({ gross: 0, net: 0, deductions: {} });
  const [portalUser, setPortalUser] = useState({ username: '', password: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const chartRef = useRef(null);
  const [chartInstance, setChartInstance] = useState(null);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle contact form submission with API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      alert('Form submitted: ' + JSON.stringify(data));
    } catch (error) {
      alert('Error submitting form');
    }
  };

  // Handle portal login (mock)
  const handlePortalLogin = (e) => {
    e.preventDefault();
    if (portalUser.username && portalUser.password) {
      setIsLoggedIn(true);
      alert('Logged in as ' + portalUser.username);
    } else {
      alert('Please enter username and password');
    }
  };

  // Calculate payroll with API, reflecting 2025 NSSF Tier I/II
  const calculatePayroll = async (gross) => {
    try {
      const response = await fetch('http://localhost:3000/api/payroll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ gross }),
      });
      const data = await response.json();
      setPayrollData(data);
    } catch (error) {
      console.error('Error calculating payroll:', error);
    }
  };

  // Chart setup for analytics
  useEffect(() => {
    if (chartRef.current && !chartInstance) {
      const ctx = chartRef.current.getContext('2d');
      const newChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Satisfaction', 'Conversion', 'Diversity'],
          datasets: [{
            label: 'Metrics (%)',
            data: [85, 65, 72],
            backgroundColor: 'rgba(30, 58, 138, 0.6)',
          }],
        },
        options: {
          scales: { y: { beginAtZero: true, max: 100 } },
        },
      });
      setChartInstance(newChartInstance);
    }
    return () => {
      if (chartInstance) chartInstance.destroy();
    };
  }, [chartInstance]);

  // Placeholder for AI initialization
  useEffect(() => {
    console.log('Initializing AI features...');
  }, []);

  return (
    <div className="font-sans text-gray-800 min-h-screen">
      {/* Header */}
      <motion.header
        className="bg-blue-900 text-white py-6"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Huashang HAIS Ltd</h1>
          <nav>
            <a href="#home" className="mx-2 hover:underline">Home</a>
            <a href="#about" className="mx-2 hover:underline">About</a>
            <a href="#services" className="mx-2 hover:underline">Services</a>
            <a href="#analytics" className="mx-2 hover:underline">Analytics</a>
            <a href="#payroll" className="mx-2 hover:underline">Payroll</a>
            <a href="#hrms" className="mx-2 hover:underline">HRMS</a>
            <a href="#outsourcing" className="mx-2 hover:underline">Outsourcing</a>
            <a href="#compliance" className="mx-2 hover:underline">Compliance</a>
            <a href="#contact" className="mx-2 hover:underline">Contact</a>
            <a href="#blog" className="mx-2 hover:underline">Blog</a>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        id="home"
        className="bg-blue-100 py-16"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        style={{ backgroundImage: 'ur[](https://via.placeholder.com/1920x600/blue-tech-office)' }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4 text-blue-900">Huashang HAIS Ltd</h1>
          <p className="text-2xl mb-6">Empowering HR with Data-Driven Intelligence</p>
          <div className="space-x-4">
            <a href="#demo" className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-700">Request a Demo</a>
            <a href="#get-started" className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-700">Get Started</a>
            <a href="#contact" className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-700">Contact Us</a>
          </div>
        </div>
      </motion.section>

      {/* Overview */}
      <motion.section
        className="bg-white-custom py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-900">Overview</h2>
          <p className="text-lg mb-6">Huashang HAIS Ltd is Kenya's premier HR and IT analytics solutions provider. We bridge the gap between workforce strategy, compliance, and digital transformation. Our platform empowers organizations to make data-informed HR decisions while staying fully compliant with Kenyan labor laws.</p>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-left">
            <div className="p-4"><strong>Workforce & HR Analytics</strong></div>
            <div className="p-4"><strong>Payroll & ESS Software</strong></div>
            <div className="p-4"><strong>Outsourcing & Staffing</strong></div>
            <div className="p-4"><strong>Labor Law Compliance</strong></div>
            <div className="p-4"><strong>Custom HR Software</strong></div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials */}
      <motion.section
        className="bg-blue-100 py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-blue-900">Testimonials</h2>
          <blockquote className="text-lg italic">"Since using Huashang HAIS, our HR processes are not only compliant but smarter. Their system gives us insight we've never had before." — HR Manager, Logistics Firm</blockquote>
        </div>
      </motion.section>

      {/* About Us */}
      <motion.section
        id="about"
        className="bg-white-custom py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">About Us</h2>
          <p className="text-lg mb-4">Huashang HAIS Ltd was founded with a mission to digitize and humanize the HR space across Kenya and East Africa. We provide smart HR systems, compliant staffing solutions, and analytics-powered insights tailored for SMEs, corporates, and public institutions.</p>
          <h3 className="text-xl font-semibold mt-6">Vision</h3>
          <p>To be the leading provider of digital HR solutions that empower African businesses.</p>
          <h3 className="text-xl font-semibold mt-6">Mission</h3>
          <p>To deliver accurate, data-driven HR systems and support services grounded in compliance, innovation, and efficiency.</p>
          <h3 className="text-xl font-semibold mt-6">Core Values</h3>
          <ul className="list-disc pl-6">
            <li>Integrity</li>
            <li>Compliance</li>
            <li>Innovation</li>
            <li>Client-Centricity</li>
            <li>Excellence</li>
          </ul>
        </div>
      </motion.section>

      {/* Services */}
      <motion.section
        id="services"
        className="bg-blue-100 py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">HR Analytics</h3>
              <ul className="list-disc pl-6">
                <li>Workforce composition</li>
                <li>Attrition trends</li>
                <li>Performance mapping</li>
                <li>Employee engagement</li>
                <li>Diversity and inclusion metrics</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">Payroll & ESS Software</h3>
              <ul className="list-disc pl-6">
                <li>NHIF, NSSF, Housing Levy deductions</li>
                <li>Net salary calculation & statutory reports</li>
                <li>Payslip generation & employee access</li>
                <li>Leave management</li>
                <li>Loan and advance tracking</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">Outsourcing & Staffing</h3>
              <ul className="list-disc pl-6">
                <li>Contract and seasonal staffing</li>
                <li>Secondment models</li>
                <li>Staff vetting, onboarding, and HR support</li>
                <li>Industry-specific deployment</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">Compliance Services</h3>
              <ul className="list-disc pl-6">
                <li>Labor audits</li>
                <li>Policy drafting</li>
                <li>Workplace safety compliance</li>
                <li>Staff induction</li>
              </ul>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">Software Development</h3>
              <ul className="list-disc pl-6">
                <li>Cloud-based HRMS & Payroll systems</li>
                <li>ESS Android app</li>
                <li>Admin dashboards with analytics</li>
                <li>API integrations</li>
              </ul>
            </div>
          </div>
        </div>
      </motion.section>

      {/* HR Analytics */}
      <motion.section
        id="analytics"
        className="bg-white-custom py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">HR Analytics Dashboard</h2>
          <div className="bg-white p-6 rounded shadow">
            <p className="mb-4">Mock data (AI-enhanced soon):</p>
            <ul className="list-disc pl-6">
              <li>Employee Satisfaction: 85%</li>
              <li>Hiring Funnel Conversion: 65%</li>
              <li>Diversity Index: 72/100</li>
            </ul>
            <canvas ref={chartRef} className="mt-4"></canvas>
          </div>
        </div>
      </motion.section>

      {/* Payroll */}
      <motion.section
        id="payroll"
        className="bg-blue-100 py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Payroll Calculator</h2>
          <div className="bg-white p-6 rounded shadow max-w-md mx-auto">
            <input
              type="number"
              placeholder="Enter gross salary (KES)"
              onChange={(e) => calculatePayroll(parseFloat(e.target.value) || 0)}
              className="w-full p-2 mb-4 border rounded"
            />
            <p>Gross Salary: KES {payrollData.gross.toLocaleString()}</p>
            <p>Net Salary: KES {payrollData.net.toLocaleString()}</p>
            <p>Deductions:</p>
            <ul className="list-disc pl-6">
              <li>PAYE: KES {payrollData.deductions.PAYE?.toLocaleString() || 0}</li>
              <li>NSSF: KES {payrollData.deductions.NSSF?.toLocaleString() || 0}</li>
              <li>SHIF: KES {payrollData.deductions.SHIF?.toLocaleString() || 0}</li>
              <li>Housing Levy: KES {payrollData.deductions.HousingLevy?.toLocaleString() || 0}</li>
            </ul>
          </div>
        </div>
      </motion.section>

      {/* HRMS */}
      <motion.section
        id="hrms"
        className="bg-white-custom py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">HR Management System</h2>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-2">Client Portal</h3>
            {!isLoggedIn ? (
              <form onSubmit={handlePortalLogin} className="space-y-4">
                <input
                  type="text"
                  name="username"
                  value={portalUser.username}
                  onChange={(e) => setPortalUser({ ...portalUser, username: e.target.value })}
                  placeholder="Username"
                  className="w-full p-2 border rounded"
                  required
                />
                <input
                  type="password"
                  name="password"
                  value={portalUser.password}
                  onChange={(e) => setPortalUser({ ...portalUser, password: e.target.value })}
                  placeholder="Password"
                  className="w-full p-2 border rounded"
                  required
                />
                <button type="submit" className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-700">
                  Login
                </button>
              </form>
            ) : (
              <div>
                <p>Welcome to ESS & Admin Dashboard!</p>
                <ul className="list-disc pl-6">
                  <li>View & Download Payslips</li>
                  <li>Leave & Attendance Management</li>
                  <li>Performance Appraisals</li>
                  <li>Reports & Analytics (PDF/Excel)</li>
                </ul>
                <button onClick={() => setIsLoggedIn(false)} className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-700 mt-4">
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Outsourcing */}
      <motion.section
        id="outsourcing"
        className="bg-blue-100 py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.9 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Outsourcing & Staffing</h2>
          <div className="bg-white p-6 rounded shadow">
            <p>End-to-end staff placement and management.</p>
          </div>
        </div>
      </motion.section>

      {/* Compliance */}
      <motion.section
        id="compliance"
        className="bg-white-custom py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.0 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Compliance Services</h2>
          <div className="bg-white p-6 rounded shadow">
            <p>Ensure adherence to Kenyan labor and OSHA standards.</p>
          </div>
        </div>
      </motion.section>

      {/* Technology Stack */}
      <motion.section
        className="bg-blue-100 py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.1 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Technology Stack</h2>
          <ul className="list-disc pl-6">
            <li>Frontend: React, Next.js</li>
            <li>Backend: Node.js, Firebase, PostgreSQL</li>
            <li>Mobile App: Flutter / Kotlin</li>
            <li>Cloud Hosting: AWS / Google Cloud</li>
            <li>Design & Prototyping: Figma</li>
            <li>Data Security: Encryption, SSL, Role-based Access</li>
            <li>Compliance: ODPC Kenya, GDPR-Ready</li>
          </ul>
        </div>
      </motion.section>

      {/* Industries */}
      <motion.section
        className="bg-white-custom py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.2 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Industries We Serve</h2>
          <ul className="list-disc pl-6">
            <li>Corporates & Large Enterprises</li>
            <li>SMEs</li>
            <li>Healthcare Providers</li>
            <li>Manufacturing & Production</li>
            <li>Logistics & Supply Chain</li>
            <li>Retail Chains</li>
            <li>Public Sector Institutions</li>
          </ul>
        </div>
      </motion.section>

      {/* Case Studies */}
      <motion.section
        className="bg-blue-100 py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.3 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Case Studies</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">Logistics Sector</h3>
              <p>"Our client reduced HR admin time by 43% and achieved 100% statutory compliance within 3 months."</p>
            </div>
            <div className="bg-white p-6 rounded shadow">
              <h3 className="text-xl font-semibold mb-2">Healthcare Sector</h3>
              <p>"Staff leave and shift planning was transformed into a seamless, digital workflow."</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Blog */}
      <motion.section
        id="blog"
        className="bg-white-custom py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.4 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Blog & Resources</h2>
          <ul className="list-disc pl-6">
            <li><a href="#blog1" className="text-blue-900 hover:underline">Top 10 Payroll Mistakes Kenyan SMEs Make</a></li>
            <li><a href="#blog2" className="text-blue-900 hover:underline">Understanding Housing Levy in 2025</a></li>
            <li><a href="#blog3" className="text-blue-900 hover:underline">Choosing the Right ESS App</a></li>
            <li><a href="#blog4" className="text-blue-900 hover:underline">How to Build a Disciplinary Policy in Kenya</a></li>
          </ul>
        </div>
      </motion.section>

      {/* Contact */}
      <motion.section
        id="contact"
        className="bg-blue-100 py-16"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.5 }}
      >
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center text-blue-900">Contact Us</h2>
          <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
            <div className="mb-4 text-center">
              <p>Huashang HAIS Ltd</p>
              <p>Ngara Road, Nairobi, Kenya</p>
              <p>📞 +254-701-225-0599</p>
              <p>📧 <a href="mailto:info@hais.co.ke" className="text-blue-900 hover:underline">info@hais.co.ke</a></p>
              <p>🌐 <a href="http://www.hais.co.ke" className="text-blue-900 hover:underline">www.hais.co.ke</a></p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Company Name</label>
                <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Email / Phone</label>
                <input type="text" name="emailPhone" value={formData.emailPhone} onChange={handleInputChange} className="w-full p-2 border rounded" required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Message / Inquiry Type</label>
                <select name="inquiry" value={formData.inquiry} onChange={handleInputChange} className="w-full p-2 border rounded">
                  <option value="General">General</option>
                  <option value="Demo Request">Demo Request</option>
                  <option value="Support">Support</option>
                </select>
              </div>
              <button type="submit" className="bg-blue-900 text-white py-2 px-4 rounded hover:bg-blue-700 w-full">Send Message</button>
            </form>
            <div className="mt-4 text-center">
              <iframe
                title="Google Maps"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.813614547!2d36.8236176147398!3d-1.2863899990000002!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f17f2f7f4e8f7%3A0x1!2sNgara%2C%20Nairobi!5e0!3m2!1sen!2ske!4v1690654321!5m2!1sen!2ske"
                width="100%"
                height="200"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Footer */}
      <motion.footer
        className="bg-blue-900 text-white py-6"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, delay: 1.6 }}
      >
        <div className="container mx-auto px-4 text-center">
          <div className="mb-4">
            <a href="#home" className="mx-2 hover:underline">Home</a>
            <a href="#about" className="mx-2 hover:underline">About</a>
            <a href="#services" className="mx-2 hover:underline">Services</a>
            <a href="#blog" className="mx-2 hover:underline">Blog</a>
            <a href="#contact" className="mx-2 hover:underline">Contact</a>
          </div>
          <div className="mb-4">
            <a href="https://www.linkedin.com" target="_blank" rel="noopener noreferrer" className="mx-2 hover:underline">LinkedIn</a>
            <a href="https://www.twitter.com" target="_blank" rel="noopener noreferrer" className="mx-2 hover:underline">Twitter</a>
            <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer" className="mx-2 hover:underline">Facebook</a>
          </div>
          <div>
            <a href="#privacy" className="mx-2 hover:underline">Privacy Policy</a>
            <a href="#terms" className="mx-2 hover:underline">Terms of Service</a>
            <a href="#odpc" className="mx-2 hover:underline">ODPC Compliance</a>
          </div>
          <p className="mt-4">&copy; 2025 Huashang HAIS Ltd. All Rights Reserved.</p>
        </div>
      </motion.footer>
    </div>
  );
}

export default App;