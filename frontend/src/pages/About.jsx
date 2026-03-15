import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-12 text-center">
          About Predictive Pulse
        </h1>

        <div className="space-y-8">
          {/* About Section */}
          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Project</h2>
            <p className="text-gray-700 leading-relaxed">
              Predictive Pulse is a full-stack web application that uses machine learning to assess 
              hypertension risk based on patient clinical metrics. The application leverages a Random 
              Forest classifier trained on synthetic patient data to predict whether an individual has 
              a high or low risk of developing hypertension.
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              Built with modern web technologies including React for the frontend, Spring Boot for the 
              backend API, and Python FastAPI for the machine learning microservice, Predictive Pulse 
              demonstrates a complete end-to-end ML integration in a production-ready architecture.
            </p>
          </section>

          {/* How It Works Section */}
          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">How It Works</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Enter Your Health Metrics</h3>
                  <p className="text-gray-700">
                    Provide your age, blood pressure readings (systolic and diastolic), BMI, cholesterol 
                    level, and indicate whether you smoke or have diabetes.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">ML Service Processing</h3>
                  <p className="text-gray-700">
                    The Spring Boot backend sends your data to the Python FastAPI microservice, which 
                    uses a pre-trained Random Forest model to analyze your risk factors and generate 
                    a prediction.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-rose-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">Receive Results & Insights</h3>
                  <p className="text-gray-700">
                    The risk prediction, confidence score, and personalized clinical insights are returned 
                    to you. All predictions are saved to the database for historical tracking.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Tech Stack Section */}
          <section className="bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Tech Stack</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Frontend</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>React 18</li>
                  <li>Vite</li>
                  <li>Tailwind CSS</li>
                  <li>Axios</li>
                  <li>React Router DOM</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-2">Backend & ML</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Spring Boot 3.x</li>
                  <li>Spring Data JPA</li>
                  <li>MySQL</li>
                  <li>Python FastAPI</li>
                  <li>scikit-learn</li>
                  <li>Random Forest Classifier</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Disclaimer Section */}
          <section className="bg-amber-50 border-2 border-amber-200 p-6 rounded-lg">
            <h3 className="font-bold text-amber-900 mb-2">⚠️ Important Disclaimer</h3>
            <p className="text-amber-800">
              This tool is for educational purposes only. It is not a substitute for professional medical 
              advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified 
              health provider with any questions you may have regarding a medical condition. Never disregard 
              professional medical advice or delay in seeking it because of something you have read or 
              calculated using this application.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default About;
