"use client";
import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

export default function EnrollmentCTA() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formStatus, setFormStatus] = useState(null); // 'success' or 'error'
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    grade: '',
    course: '',
    address: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormStatus(null);

    try {
      // NOTE: This URL will be replaced by the actual Web App URL provided by the user
      const GOOGLE_SCRIPT_URL = process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL || "https://script.google.com/macros/s/AKfycbxzWA4vfjo637uxUwpNjQqJLWYnKqmcP9wUCDrL-RUk3aTZttoiHughP6PQ-we4k40t/exec";

      const submitData = new FormData();
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });

      const response = await fetch(GOOGLE_SCRIPT_URL, {
        method: "POST",
        mode: "no-cors", // Google Apps Script requires no-cors for simple requests without preflight
        body: submitData
      });

      // Since mode is no-cors, response is opaque. We assume success if it didn't throw an error.
      setFormStatus('success');
      setFormData({ name: '', phone: '', email: '', grade: '', course: '', address: '' });

      // Auto close modal after 3 seconds on success
      setTimeout(() => {
        if (isModalOpen) {
          setIsModalOpen(false);
          setFormStatus(null);
        }
      }, 3000);

    } catch (error) {
      console.error("Error submitting form:", error);
      setFormStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* The CTA Section */}
      <section className="bg-brand text-white py-16 text-center">
        <h2 className="text-2xl font-bold mb-6">Ready to boost your academic performance?</h2>
        <p className="text-sm mb-8 opacity-90">Join ISMA Academy and start learning with expert guidance, notes & practice.</p>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-white text-brand px-8 py-3 rounded-full font-bold text-sm hover:shadow-lg transition-all transform hover:-translate-y-1"
        >
          Enroll Now
        </button>
      </section>

      {/* The Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity animate-in fade-in"
            onClick={() => setIsModalOpen(false)}
          ></div>
          <div className="relative z-10 bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-brand px-6 py-4 flex justify-between items-center text-white">
              <h3 className="font-bold text-lg">Enrollment Form</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-1"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {formStatus === 'success' ? (
                <div className="flex flex-col items-center justify-center py-8 text-center animate-in mb-in-fade">
                  <CheckCircle size={64} className="text-green-500 mb-4" />
                  <h4 className="text-xl font-bold text-gray-800 mb-2">Success!</h4>
                  <p className="text-gray-600">Your enrollment request has been recorded. We will contact you shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  {formStatus === 'error' && (
                    <div className="bg-red-50 text-red-600 p-3 rounded-lg flex items-start gap-2 text-sm">
                      <AlertCircle className="w-5 h-5 shrink-0" />
                      <p>Something went wrong. Please try again.</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                        placeholder="e.g. 9876543210"
                      />
                    </div>
                    <div className="flex-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Grade/Class *</label>
                      <select
                        name="grade"
                        required
                        value={formData.grade}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all bg-white"
                      >
                        <option value="">Select Grade</option>
                        <option value="9th">9th Standard</option>
                        <option value="10th">10th Standard</option>
                        <option value="11th">11th Standard</option>
                        <option value="12th">12th Standard</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      placeholder="e.g. john@example.com"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Course of Interest *</label>
                    <select
                      name="course"
                      required
                      value={formData.course}
                      onChange={handleChange}
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all bg-white"
                    >
                      <option value="">Select Course</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Science">Science</option>
                      <option value="English">English</option>
                      <option value="All Subjects">All Subjects</option>
                      <option value="Crash Course">Crash Course</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Address (Optional)</label>
                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows="2"
                      className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all resize-none"
                      placeholder="Enter your address"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-brand text-white font-bold py-3 rounded-lg hover:bg-brand-dark transition-colors flex items-center justify-center mt-2 disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </button>
                </form>
              )}
            </div>
            {/* Modal Footer */}
            <div className="bg-gray-50 px-6 py-3 text-xs text-gray-500 text-center border-t border-gray-100">
              Your details are safe with us. We will never spam you.
            </div>
          </div>
        </div>
      )}
    </>
  );
}
