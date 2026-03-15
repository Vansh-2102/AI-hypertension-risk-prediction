import React, { useState } from 'react';
import SliderInput from '../components/SliderInput';
import RiskCard from '../components/RiskCard';
import api from '../api/axios';

const Predict = () => {
  const [formData, setFormData] = useState({
    age: 45,
    systolicBp: 120,
    diastolicBp: 80,
    bmi: 25.0,
    cholesterol: 200,
    smoking: false,
    diabetes: false,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await api.post('/predict', formData);
      setResult(response.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to get prediction. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="container mx-auto max-w-2xl">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Patient Risk Assessment
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md">
          <SliderInput
            label="Age"
            name="age"
            min={18}
            max={90}
            value={formData.age}
            onChange={handleSliderChange}
            unit="years"
          />

          <SliderInput
            label="Systolic Blood Pressure"
            name="systolicBp"
            min={90}
            max={200}
            value={formData.systolicBp}
            onChange={handleSliderChange}
            unit="mmHg"
          />

          <SliderInput
            label="Diastolic Blood Pressure"
            name="diastolicBp"
            min={60}
            max={130}
            value={formData.diastolicBp}
            onChange={handleSliderChange}
            unit="mmHg"
          />

          <SliderInput
            label="BMI"
            name="bmi"
            min={15.0}
            max={45.0}
            step={0.1}
            value={formData.bmi}
            onChange={handleSliderChange}
            unit="kg/m²"
          />

          <SliderInput
            label="Cholesterol"
            name="cholesterol"
            min={150}
            max={300}
            value={formData.cholesterol}
            onChange={handleSliderChange}
            unit="mg/dL"
          />

          <div className="mb-6">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="smoking"
                checked={formData.smoking}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
              />
              <span className="text-gray-700 font-medium">Smoking</span>
            </label>
          </div>

          <div className="mb-8">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                name="diabetes"
                checked={formData.diabetes}
                onChange={handleCheckboxChange}
                className="w-5 h-5 text-rose-600 border-gray-300 rounded focus:ring-rose-500"
              />
              <span className="text-gray-700 font-medium">Diabetes</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white font-semibold py-4 px-6 rounded-lg text-lg transition-colors duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </span>
            ) : (
              'Predict Risk'
            )}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}
        </form>

        {result && (
          <RiskCard
            riskLevel={result.riskLevel}
            confidence={result.confidence}
            insight={result.insight}
          />
        )}
      </div>
    </div>
  );
};

export default Predict;
