import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-rose-50 to-white py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Know Your Risk Before It's Too Late
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Leverage machine learning to assess your hypertension risk based on clinical metrics. 
            Get instant insights powered by advanced predictive analytics.
          </p>
          <button
            onClick={() => navigate('/predict')}
            className="bg-rose-600 hover:bg-rose-700 text-white font-semibold py-4 px-8 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            Start Prediction
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Early Detection</h3>
              <p className="text-gray-600">
                Identify hypertension risk factors before they become critical. 
                Early intervention saves lives.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">ML Powered</h3>
              <p className="text-gray-600">
                Advanced Random Forest algorithm trained on clinical data 
                provides accurate risk assessments.
              </p>
            </div>
            
            <div className="text-center p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-xl font-bold text-gray-800 mb-3">Clinical Insights</h3>
              <p className="text-gray-600">
                Receive actionable recommendations based on your risk profile 
                and medical best practices.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
