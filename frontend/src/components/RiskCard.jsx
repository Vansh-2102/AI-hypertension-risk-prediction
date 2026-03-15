import React from 'react';

const RiskCard = ({ riskLevel, confidence, insight }) => {
  const isHigh = riskLevel === 'High';
  const borderColor = isHigh ? 'border-red-500' : 'border-green-500';
  const badgeColor = isHigh ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800';
  const progressColor = isHigh ? 'bg-red-500' : 'bg-green-500';
  const icon = isHigh ? '⚠️' : '✓';

  return (
    <div className={`mt-8 p-6 rounded-lg border-2 ${borderColor} bg-white shadow-lg`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{icon}</span>
          <div>
            <h3 className="text-xl font-bold text-gray-800">Risk Level</h3>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${badgeColor}`}>
              {riskLevel}
            </span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-gray-600">Confidence</p>
          <p className="text-2xl font-bold text-gray-800">{confidence.toFixed(1)}%</p>
        </div>
      </div>
      
      <div className="mb-4">
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${progressColor}`}
            style={{ width: `${confidence}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-gray-700 leading-relaxed">{insight}</p>
      </div>
    </div>
  );
};

export default RiskCard;
