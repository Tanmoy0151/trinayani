import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">About Trinayani Medical</h1>
          <p className="text-xl max-w-3xl">
            Your trusted partner for advanced medical equipment solutions, specializing in GE Healthcare and Carl Zeiss products.
          </p>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="bg-gray-100 rounded-lg p-8 h-full flex items-center justify-center">
              <div className="text-center space-y-3">
                <h3 className="text-2xl font-bold text-primary-600">Trinayani Medical System</h3>
                <p className="text-gray-700">Established with a vision to provide world-class medical equipment solutions</p>
                <div className="flex justify-center gap-6 pt-4">
                  <span className="px-4 py-2 bg-primary-100 text-primary-700 rounded-md font-medium">GE Healthcare Partner</span>
                  <span className="px-4 py-2 bg-secondary-100 text-secondary-700 rounded-md font-medium">Carl Zeiss Partner</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
              <p className="text-gray-600">
                Trinayani Medical was established with a mission to bridge the gap between advanced medical technology and healthcare providers. As an authorized business partner of GE Healthcare and Carl Zeiss, we bring cutting-edge medical equipment to hospitals, clinics, and healthcare facilities.
              </p>
              <p className="text-gray-600">
                Our expertise spans diagnostic imaging solutions like CT scanners, MRI systems, and ultrasound equipment from GE Healthcare, as well as specialized eye examination equipment including biometry, perimetry, and surgical microscopes from Carl Zeiss.
              </p>
              <p className="text-gray-600">
                With a dedicated team of professionals, we provide comprehensive sales, installation, training, and maintenance services to ensure that healthcare providers can deliver the best possible care to their patients.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Mission & Vision */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission & Vision</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Driving healthcare innovation through advanced medical technology solutions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-primary-100 p-3 rounded-full mr-4">
                  <svg className="h-6 w-6 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Mission</h3>
              </div>
              <p className="text-gray-600">
                To enhance healthcare delivery by providing state-of-the-art medical equipment solutions, backed by exceptional service and support. We are committed to improving patient outcomes through technology and expertise.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md">
              <div className="flex items-center mb-4">
                <div className="bg-secondary-100 p-3 rounded-full mr-4">
                  <svg className="h-6 w-6 text-secondary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">Our Vision</h3>
              </div>
              <p className="text-gray-600">
                To be the leading provider of medical equipment solutions in the region, recognized for our commitment to quality, innovation, and customer satisfaction. We aim to contribute to a healthcare ecosystem where advanced technology is accessible to all.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Partners */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Partners</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are proud to be official business partners of these leading medical technology companies.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-primary-600 mb-2">GE Healthcare</h3>
                <p className="text-gray-600">
                  A leading provider of medical imaging, monitoring, biomanufacturing, and cell therapy technologies.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">CT Scanners</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">MRI Systems</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Ultrasound Equipment</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Cathlab Solutions</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-secondary-600 mb-2">Carl Zeiss</h3>
                <p className="text-gray-600">
                  A global leader in optical and optoelectronic technology, specializing in medical devices.
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-secondary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Biometry Equipment</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-secondary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Perimetry Systems</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-secondary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Surgical Microscopes</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-secondary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Ophthalmology Diagnostic Equipment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Ready to Work With Us?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Contact our team to learn more about our medical equipment solutions and how we can support your healthcare facility.
          </p>
          <Link href="/contact" className="btn-primary">
            Contact Us Today
          </Link>
        </div>
      </section>
    </div>
  );
} 