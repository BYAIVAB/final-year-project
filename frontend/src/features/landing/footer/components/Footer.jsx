import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'

const footerLinks = {
  product: {
    title: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'How it Works', href: '#how-it-works' },
      { label: 'Pricing', href: '#' },
      { label: 'FAQ', href: '#' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Blog', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Contact', href: '#' },
    ],
  },
  resources: {
    title: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Support', href: '#' },
      { label: 'Status', href: '#' },
    ],
  },
  legal: {
    title: 'Legal',
    links: [
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
      { label: 'HIPAA', href: '#' },
      { label: 'Security', href: '#' },
    ],
  },
}

function Footer() {
  return (
    <footer className="bg-arc-navy border-t border-arc-border">
      <div className="container mx-auto px-6 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-arc-blue to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                M
              </div>
              <span className="text-arc-text font-semibold">MedAI</span>
            </Link>
            <p className="text-arc-text-muted text-sm">
              AI-powered medical information retrieval for healthcare professionals.
            </p>
          </div>

          {/* Links */}
          {Object.values(footerLinks).map((section) => (
            <div key={section.title}>
              <h4 className="text-arc-text font-semibold mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-arc-text-muted text-sm hover:text-arc-blue transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-arc-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-arc-text-muted text-sm">
            © {new Date().getFullYear()} Medical RAG Chatbot. All rights reserved.
          </p>
          
          {/* Social links */}
          <div className="flex items-center gap-4">
            {['Twitter', 'LinkedIn', 'GitHub'].map((social) => (
              <motion.a
                key={social}
                href="#"
                whileHover={{ y: -2 }}
                className="w-8 h-8 rounded-full border border-arc-border flex items-center justify-center text-arc-text-muted hover:text-arc-blue hover:border-arc-blue transition-colors"
              >
                {social[0]}
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
