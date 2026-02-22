import React from "react";
import { FaPhoneAlt } from "react-icons/fa";
import { FaLocationDot } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";

const Contact = () => {
  return (
    <div>
      <section className="bg-[var(--bg-nav-footer)] py-16 px-6 md:px-20">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Info */}
          <div>
            <h2 className="text-3xl md:text-4xl font-semibold text-[var(--text-primary)] mb-6">
              Contact Us
            </h2>

            <p className="text-[var(--text-secondary)] text-lg leading-7 mb-6">
              Our Contact Section makes it easy for users to connect with the Flexify team for support, feedback, or inquiries. Whether you have questions about workout plans, subscriptions, or technical issues, we are here to help. Simply fill out the contact form with your details and message, and our team will respond promptly to ensure a smooth fitness journey.
            </p>

            <div className="space-y-5 text-[var(--text-secondary)] text-lg">
              <div className="flex items-start space-x-3">
                <span className="text-2xl"><FaLocationDot /></span>
                <p>Dhaka Bangladesh</p>
              </div>

              <div className="flex text-[var(--text-secondary)] items-center space-x-3">
                <span className="text-2xl"><FaPhoneAlt /></span>
                <p>+8801 23456789</p>
              </div>

              <div className="flex items-center text-[var(--text-secondary)] space-x-3">
                <span className="text-2xl"><MdEmail /></span>
                <p>info@flexify.com</p>
              </div>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="bg-[var(--bg-primary)] shadow-md rounded-xl p-8">
            <h3 className="text-2xl font-semibold text-[var(--text-primary)] mb-6">
              Send us a Message
            </h3>

            <form className="space-y-5">
              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Your Name</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2
                focus:ring-orange-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2
                focus:ring-orange-500"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="block text-[var(--text-secondary)] mb-1">Message</label>
                <textarea
                  rows={4}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2
                focus:ring-orange-500"
                  placeholder="Write your message..."
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full btn-primary text-[1.05rem] font-semibold text-center hover:scale-105 transition"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
