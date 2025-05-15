import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer: React.FC = () => {
  return (
    <footer className="pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row mb-8">
          {/* Logo and Description */}
          <div className="md:w-1/3 mb-8 md:mb-0">
            <div className="flex items-center mb-4">
              <h2 className="text-3xl font-bold">
                Order<span className="text-orange-500">LK</span>
              </h2>
            </div>
            <p className="text-sm text-gray-600 mb-4 max-w-md">
              Company © 2023 OrderLK. Registered with major UK companies.
            </p>
          </div>

          {/* Newsletter and Links */}
          <div className="md:w-2/3 md:pl-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Newsletter */}
              <div className="col-span-1 md:col-span-1">
                <h3 className="font-medium mb-4">
                  Get Exclusive Deals
                </h3>
                <div className="flex">
                  <input
                    type="email"
                    placeholder="your@email.com"
                    className="px-4 py-2 rounded-l-md border border-gray-300 focus:outline-none w-full"
                  />
                  <button className="bg-orange-500 text-white px-4 py-2 rounded-r-md hover:bg-orange-600 transition-colors">
                    Subscribe
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  We won't spam, read our privacy policy
                </p>
              </div>

              {/* Legal Pages */}
              <div className="col-span-1">
                <h3 className="font-medium mb-4">Legal Pages</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/terms"
                      className="text-gray-600 hover:text-orange-500"
                    >
                      Terms and conditions
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/privacy"
                      className="text-gray-600 hover:text-orange-500"
                    >
                      Privacy
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/cookies"
                      className="text-gray-600 hover:text-orange-500"
                    >
                      Cookies
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Important Links */}
              <div className="col-span-1">
                <h3 className="font-medium mb-4">Important Links</h3>
                <ul className="space-y-2 text-sm">
                  <li>
                    <Link
                      to="/faq"
                      className="text-gray-600 hover:text-orange-500"
                    >
                      Our Help
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/add-restaurant"
                      className="text-gray-600 hover:text-orange-500"
                    >
                      Add your restaurant
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/signup"
                      className="text-gray-600 hover:text-orange-500"
                    >
                      Sign up to deliver
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="/business"
                      className="text-gray-600 hover:text-orange-500"
                    >
                      Create a business account
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Social Media and Copyright */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-gray-200">
          <div className="flex space-x-4 mb-4 md:mb-0">
            <a href="#" className="text-gray-500 hover:text-orange-500">
              <Facebook size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-orange-500">
              <Instagram size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-orange-500">
              <Twitter size={20} />
            </a>
            <a href="#" className="text-gray-500 hover:text-orange-500">
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm3 8h-2v7h-2v-7H9v-2h6v2z" />
              </svg>
            </a>
          </div>
          <div className="text-sm text-gray-500">
            © 2025 OrderLK Ltd. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
