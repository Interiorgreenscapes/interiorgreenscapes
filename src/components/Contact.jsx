import { useState, useRef, useEffect } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Send,
  CheckCircle,
  Facebook,
  Instagram,
} from "lucide-react";
import { analytics } from "../utils/analytics";

const Contact = ({ isFullPage = false }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });
  const [honeypot, setHoneypot] = useState("");
  const formLoadTime = useRef(0);
  useEffect(() => {
    formLoadTime.current = Date.now();
  }, []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [errorRetryable, setErrorRetryable] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === "name" && !value.trim()) {
      setFieldErrors((prev) => ({ ...prev, name: "Your name is required." }));
    } else if (name === "email") {
      if (!value.trim()) {
        setFieldErrors((prev) => ({ ...prev, email: "Email address is required." }));
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        setFieldErrors((prev) => ({ ...prev, email: "Please enter a valid email address." }));
      } else {
        setFieldErrors((prev) => ({ ...prev, email: "" }));
      }
    } else if (name === "message" && !value.trim()) {
      setFieldErrors((prev) => ({ ...prev, message: "Please describe your project or space." }));
    } else {
      setFieldErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (honeypot) return;

    setSubmitError("");
    setErrorRetryable(false);
    setIsSubmitting(true);

    const endpoint = import.meta.env.VITE_FORMSPREE_URL;
    if (!endpoint) {
      setSubmitError("Our contact form isn't set up yet.");
      setErrorRetryable(false);
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        analytics.formSubmit(formData.service);
        setIsSubmitted(true);
      } else {
        setSubmitError("Something didn't go through on our end.");
        setErrorRetryable(true);
      }
    } catch {
      setSubmitError("We couldn't reach the server — check your connection.");
      setErrorRetryable(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: MapPin,
      title: "Location",
      content: "Boise, ID 83705",
      subtext: "Serving the Treasure Valley",
    },
    {
      icon: Phone,
      title: "Phone",
      content: "(208) 871-2588",
      subtext: "Call or text us anytime",
      link: "tel:2088712588",
    },
    {
      icon: Mail,
      title: "Email",
      content: "info@interiorgreenscapes.com",
      subtext: "We respond within 24 hours",
      link: "mailto:info@interiorgreenscapes.com",
    },
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header — hidden when page already has a hero */}
        {!isFullPage && (
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-1 bg-sage-100 text-sage-600 rounded-full text-sm font-medium mb-4">
              Get In Touch
            </span>
            <h2 className="section-heading">Contact Us</h2>
            <p className="section-subheading">
              Ready to transform your space? We'd love to hear from you. Get in
              touch for a free consultation.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-12">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-6">
            {contactInfo.map((item) => (
              <div
                key={item.title}
                className="flex items-start space-x-4 p-4 bg-sage-50 rounded-xl"
              >
                <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-6 h-6 text-sage-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-forest-800">
                    {item.title}
                  </h3>
                  {item.link ? (
                    <a
                      href={item.link}
                      onClick={() =>
                        item.title === "Phone"
                          ? analytics.phoneClick()
                          : analytics.emailClick()
                      }
                      className="text-sage-600 hover:text-sage-700 font-medium"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-gray-700 font-medium">{item.content}</p>
                  )}
                  <p className="text-sm text-gray-500">{item.subtext}</p>
                </div>
              </div>
            ))}

            {/* Social Links */}
            <div className="pt-6">
              <h3 className="font-semibold text-forest-800 mb-4">Follow Us</h3>
              <div className="flex space-x-4">
                <a
                  href="https://facebook.com/interiorgreenscapes"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analytics.socialClick("facebook")}
                  className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center hover:bg-sage-200 transition-colors"
                >
                  <Facebook className="w-6 h-6 text-sage-600" />
                </a>
                <a
                  href="https://instagram.com/interiorgreenscapes"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => analytics.socialClick("instagram")}
                  className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center hover:bg-sage-200 transition-colors"
                >
                  <Instagram className="w-6 h-6 text-sage-600" />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-3">
            <div className="bg-sage-50 rounded-3xl p-8">
              {isSubmitted ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-sage-500" />
                  </div>
                  <h3 className="text-2xl font-display font-semibold text-forest-800 mb-3">
                    Message Sent!
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Thank you for reaching out. We'll get back to you within 24
                    hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setFormData({
                        name: "",
                        email: "",
                        phone: "",
                        company: "",
                        service: "",
                        message: "",
                      });
                    }}
                    className="btn-secondary"
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Honeypot field — hidden from real users, bots will fill it */}
                  <div className="absolute -left-[9999px]" aria-hidden="true">
                    <label htmlFor="website">Website</label>
                    <input
                      type="text"
                      id="website"
                      name="website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={honeypot}
                      onChange={(e) => setHoneypot(e.target.value)}
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all ${fieldErrors.name ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-sage-200 focus:border-sage-400 focus:ring-sage-200"}`}
                        placeholder="John Smith"
                      />
                      {fieldErrors.name && <p className="mt-1.5 text-sm text-red-600">{fieldErrors.name}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all ${fieldErrors.email ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-sage-200 focus:border-sage-400 focus:ring-sage-200"}`}
                        placeholder="you@email.com"
                      />
                      {fieldErrors.email && <p className="mt-1.5 text-sm text-red-600">{fieldErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all"
                        placeholder="(208) 555-0123"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company/Organization <span className="text-gray-400 font-normal">(optional)</span>
                      </label>
                      <input
                        type="text"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all"
                        placeholder="Company or home — both welcome"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Service Interested In
                    </label>
                    <select
                      name="service"
                      value={formData.service}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-xl border border-sage-200 focus:border-sage-400 focus:ring-2 focus:ring-sage-200 outline-none transition-all bg-white"
                    >
                      <option value="">Select a service...</option>
                      <option value="New-Project">New Project</option>
                      <option value="Holiday-Decorations">Holiday Decorations</option>
                      <option value="Plants-Maintenance">Plants Maintenance</option>
                      <option value="General Inquiry">General Inquiry</option>  
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Your Message *
                    </label>
                    <textarea
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-xl border focus:ring-2 outline-none transition-all resize-none ${fieldErrors.message ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-sage-200 focus:border-sage-400 focus:ring-sage-200"}`}
                      placeholder="Tell us about your project or space..."
                    />
                    {fieldErrors.message && <p className="mt-1.5 text-sm text-red-600">{fieldErrors.message}</p>}
                  </div>

                  {submitError && (
                    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-4">
                      <p className="text-sm text-red-700">{submitError}</p>
                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-3">
                        {errorRetryable && (
                          <button type="submit" className="text-sm font-medium text-red-700 underline underline-offset-2 hover:no-underline">
                            Try again
                          </button>
                        )}
                        <a href="mailto:info@interiorgreenscapes.com" className="text-sm font-medium text-sage-600 underline underline-offset-2 hover:no-underline">
                          Email us directly
                        </a>
                        <a href="tel:2088712588" className="text-sm font-medium text-sage-600 underline underline-offset-2 hover:no-underline">
                          (208) 871-2588
                        </a>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full btn-primary py-4 flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
                        Send Message
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
