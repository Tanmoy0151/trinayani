import Link from 'next/link';
import Image from 'next/image';
import NewsletterSignup from '@/components/NewsletterSignup';

export default function Products() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Products</h1>
          <p className="text-xl max-w-3xl">
            Discover our comprehensive range of medical equipment from GE Healthcare and Carl Zeiss.
          </p>
        </div>
      </section>

      {/* GE Healthcare Products */}
      <section className="py-16 bg-white" id="ge-healthcare">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">GE Healthcare Products</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Advanced diagnostic imaging solutions for healthcare providers.
            </p>
          </div>

          {/* CT Scanners */}
          <div className="mb-20" id="ct">
            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-primary-600 mb-4">CT Scanners</h3>
                  <p className="text-gray-600 mb-6">
                    GE Healthcare's CT scanners provide exceptional image quality with reduced radiation dose, helping clinicians make fast, confident diagnoses.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">High-resolution imaging</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Low radiation dose</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Fast scanning capabilities</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Advanced clinical applications</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="h-48 flex items-center justify-center bg-primary-50 rounded-md">
                    <div className="text-primary-600 text-6xl font-bold">CT</div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold text-gray-900">Available Models:</h4>
                    <ul className="list-disc list-inside text-gray-600 ml-2">
                      <li>Revolution Series</li>
                      <li>Optima Series</li>
                      <li>Discovery Series</li>
                      <li>LightSpeed Series</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* MRI Systems */}
          <div className="mb-20" id="mri">
            <div className="bg-gray-50 p-8 rounded-lg mb-8">
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-2xl font-bold text-primary-600 mb-4">MRI Systems</h3>
                  <p className="text-gray-600 mb-6">
                    GE Healthcare's MRI systems deliver exceptional image quality with innovative technologies for fast, comfortable, and accurate examinations.
                  </p>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Superior soft tissue contrast</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Advanced clinical applications</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Patient-friendly designs</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-primary-600 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      <span className="text-gray-700">Reduced scan times</span>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="h-48 flex items-center justify-center bg-primary-50 rounded-md">
                    <div className="text-primary-600 text-6xl font-bold">MRI</div>
                  </div>
                  <div className="mt-4 space-y-2">
                    <h4 className="font-semibold text-gray-900">Available Models:</h4>
                    <ul className="list-disc list-inside text-gray-600 ml-2">
                      <li>SIGNA Series</li>
                      <li>Optima Series</li>
                      <li>Discovery Series</li>
                      <li>Artist Series</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Ultrasound & Cathlab */}
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md" id="ultrasound">
              <h3 className="text-xl font-bold text-primary-600 mb-4">Ultrasound Systems</h3>
              <p className="text-gray-600 mb-4">
                Advanced ultrasound systems from GE Healthcare offering exceptional image quality and specialized applications.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">LOGIQ Series</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Vivid Series</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Voluson Series</span>
                </div>
              </div>
              <Link href="/contact" className="text-primary-600 font-medium hover:underline inline-flex items-center">
                Request information
                <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg shadow-md" id="cathlab">
              <h3 className="text-xl font-bold text-primary-600 mb-4">Cathlab Solutions</h3>
              <p className="text-gray-600 mb-4">
                GE Healthcare's cardiac and vascular interventional imaging systems for diagnosis and treatment.
              </p>
              <div className="space-y-2 mb-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Innova Series</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Discovery IGS Series</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">Intervention Suite Solutions</span>
                </div>
              </div>
              <Link href="/contact" className="text-primary-600 font-medium hover:underline inline-flex items-center">
                Request information
                <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Carl Zeiss Products */}
      <section className="py-16 bg-gray-50" id="carl-zeiss">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Carl Zeiss Medical Products</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Advanced ophthalmic diagnostic and surgical equipment.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" id="eye">
            {/* Biometry */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-secondary-100 flex items-center justify-center">
                <div className="text-secondary-600 text-5xl font-bold">Biometry</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Biometry Equipment</h3>
                <p className="text-gray-600 mb-4">
                  Precision biometry devices for accurate measurements in cataract and refractive surgery planning.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-secondary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">IOLMaster Series</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-secondary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">High precision measurement</span>
                  </div>
                </div>
                <Link href="/contact" className="text-secondary-600 font-medium hover:underline inline-flex items-center">
                  Learn more
                  <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Perimetry */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-secondary-100 flex items-center justify-center">
                <div className="text-secondary-600 text-5xl font-bold">Perimetry</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Perimetry Systems</h3>
                <p className="text-gray-600 mb-4">
                  Advanced visual field testing systems for comprehensive glaucoma management and diagnosis.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-secondary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">Humphrey Field Analyzer</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-secondary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">SITA testing strategies</span>
                  </div>
                </div>
                <Link href="/contact" className="text-secondary-600 font-medium hover:underline inline-flex items-center">
                  Learn more
                  <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>

            {/* Surgical Microscopes */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-48 bg-secondary-100 flex items-center justify-center">
                <div className="text-secondary-600 text-5xl font-bold">Microscopes</div>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Surgical Microscopes</h3>
                <p className="text-gray-600 mb-4">
                  High-precision surgical microscopes for ophthalmic procedures with advanced visualization technology.
                </p>
                <div className="space-y-2 mb-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-secondary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">OPMI Lumera Series</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-secondary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="text-gray-700">HD visualization system</span>
                  </div>
                </div>
                <Link href="/contact" className="text-secondary-600 font-medium hover:underline inline-flex items-center">
                  Learn more
                  <svg className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <NewsletterSignup 
            title="Get Product Updates and Special Offers"
            description="Subscribe to receive information about new medical equipment, technology updates, and exclusive promotions."
            bgColor="white"
            layout="horizontal"
            variant="default"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">Interested in Our Products?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
            Contact our team for detailed product information, demonstrations, and quotes.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact" className="btn-primary">
              Contact Sales Team
            </Link>
            <Link href="/services" className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-3 px-6 rounded-md transition duration-300">
              View Our Services
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}