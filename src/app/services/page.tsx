import Link from 'next/link';

export default function Services() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-700 to-primary-900 text-white py-20">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Services</h1>
          <p className="text-xl max-w-3xl">
            Comprehensive support for your medical equipment needs, from installation to maintenance.
          </p>
        </div>
      </section>

      {/* Services Overview */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Comprehensive Support Solutions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We provide end-to-end services for medical equipment from GE Healthcare and Carl Zeiss.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Service Card 1 */}
            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
              <div className="h-24 bg-primary-600 flex items-center justify-center">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Sales Consultation</h3>
                <p className="text-gray-600 mb-4">
                  Expert advice on selecting the right medical equipment for your healthcare facility's specific needs.
                </p>
                <ul className="space-y-2 mb-4 text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Needs assessment</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Product recommendations</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Customized solutions</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service Card 2 */}
            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
              <div className="h-24 bg-primary-600 flex items-center justify-center">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Installation & Setup</h3>
                <p className="text-gray-600 mb-4">
                  Professional installation and configuration of medical equipment by certified technicians.
                </p>
                <ul className="space-y-2 mb-4 text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Site preparation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Equipment installation</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>System calibration</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service Card 3 */}
            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
              <div className="h-24 bg-primary-600 flex items-center justify-center">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Training</h3>
                <p className="text-gray-600 mb-4">
                  Comprehensive training for healthcare professionals on equipment operation and maintenance.
                </p>
                <ul className="space-y-2 mb-4 text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Operator training</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Clinical applications</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Refresher courses</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service Card 4 */}
            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
              <div className="h-24 bg-primary-600 flex items-center justify-center">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Maintenance & Repair</h3>
                <p className="text-gray-600 mb-4">
                  Regular maintenance and prompt repair services to keep your equipment running at optimal performance.
                </p>
                <ul className="space-y-2 mb-4 text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Preventive maintenance</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Emergency repairs</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Spare parts supply</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service Card 5 */}
            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
              <div className="h-24 bg-primary-600 flex items-center justify-center">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Service Contracts</h3>
                <p className="text-gray-600 mb-4">
                  Customized service contracts designed to provide peace of mind and protect your investment.
                </p>
                <ul className="space-y-2 mb-4 text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Annual maintenance contracts</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Extended warranty</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Comprehensive coverage</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Service Card 6 */}
            <div className="bg-gray-50 rounded-lg shadow-md overflow-hidden">
              <div className="h-24 bg-primary-600 flex items-center justify-center">
                <svg className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-2">Technical Support</h3>
                <p className="text-gray-600 mb-4">
                  Dedicated technical support team available to assist with troubleshooting and operational queries.
                </p>
                <ul className="space-y-2 mb-4 text-gray-600">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>24/7 helpdesk</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Remote diagnostics</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 text-primary-600 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Expert consultation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Service Process */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Service Process</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              A streamlined approach to ensure your medical equipment performs at its best.
            </p>
          </div>

          <div className="relative">
            {/* Process timeline */}
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-primary-200"></div>

            {/* Process steps */}
            <div className="space-y-12">
              {/* Step 1 */}
              <div className="relative">
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">1</div>
                </div>
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6 md:mb-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Initial Consultation</h3>
                      <p className="text-gray-600">
                        We discuss your specific requirements, challenges, and goals to understand your needs.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block"></div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="relative">
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">2</div>
                </div>
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="hidden md:block"></div>
                  <div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Assessment & Proposal</h3>
                      <p className="text-gray-600">
                        Our technical team conducts an assessment and presents a comprehensive service proposal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="relative">
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">3</div>
                </div>
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6 md:mb-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Service Implementation</h3>
                      <p className="text-gray-600">
                        Our certified engineers perform the required installation, maintenance, or repair services.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block"></div>
                </div>
              </div>

              {/* Step 4 */}
              <div className="relative">
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">4</div>
                </div>
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="hidden md:block"></div>
                  <div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Quality Assurance</h3>
                      <p className="text-gray-600">
                        We conduct thorough testing to ensure the equipment meets all performance specifications.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5 */}
              <div className="relative">
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">5</div>
                </div>
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="md:text-right">
                    <div className="bg-white p-6 rounded-lg shadow-md mb-6 md:mb-0">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Training & Handover</h3>
                      <p className="text-gray-600">
                        We provide training to your staff and ensure smooth handover of the equipment or service.
                      </p>
                    </div>
                  </div>
                  <div className="hidden md:block"></div>
                </div>
              </div>

              {/* Step 6 */}
              <div className="relative">
                <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className="h-10 w-10 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold">6</div>
                </div>
                <div className="md:grid md:grid-cols-2 gap-8 items-center">
                  <div className="hidden md:block"></div>
                  <div>
                    <div className="bg-white p-6 rounded-lg shadow-md">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Ongoing Support</h3>
                      <p className="text-gray-600">
                        We provide continued technical support and regular check-ins to ensure optimal performance.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-700 to-secondary-700 text-white">
        <div className="container-custom text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Experience Our Services?</h2>
          <p className="text-xl mb-8 max-w-3xl mx-auto">
            Contact us today to discuss your medical equipment service needs and discover how we can support your healthcare facility.
          </p>
          <Link href="/contact" className="inline-block bg-white text-primary-700 hover:bg-gray-100 font-medium py-3 px-8 rounded-md transition duration-300 text-lg">
            Request Service
          </Link>
        </div>
      </section>
    </div>
  );
} 