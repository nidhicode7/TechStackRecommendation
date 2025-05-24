const RecommendationDisplay = ({ recommendation }) => {
  const { recommendedStack, overallJustification, estimatedCost, estimatedTimeline, note } = recommendation;

  const StackSection = ({ title, data }) => (
    <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition duration-200 ease-in-out border border-gray-200">
      <h3 className="text-xl font-semibold text-indigo-800 mb-3 border-b border-indigo-100 pb-2">{title}</h3>
      <div className="space-y-3 text-gray-700">
        <p>
          <span className="font-medium text-gray-800">Framework/Type:</span> {data.framework || data.type}
        </p>
        <p>
          <span className="font-medium text-gray-800">Justification:</span> {data.justification}
        </p>
        <div>
          <span className="font-medium text-gray-800">Alternatives:</span>
          {data.alternatives && data.alternatives.length > 0 ? (
            <ul className="list-disc list-inside ml-4 mt-1">
              {data.alternatives.map((alt, index) => (
                <li key={index} className="text-sm">{alt}</li>
              ))}
            </ul>
          ) : (
            <span className="ml-2 text-sm italic">None provided</span>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 mt-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6 border-b-2 border-indigo-500 pb-2">Recommended Tech Stack</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StackSection title="Frontend" data={recommendedStack.frontend} />
        <StackSection title="Backend" data={recommendedStack.backend} />
        <StackSection title="Database" data={recommendedStack.database} />
        <StackSection title="Hosting" data={recommendedStack.hosting} />
      </div>

      <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition duration-200 ease-in-out border border-gray-200">
        <h3 className="text-xl font-semibold text-indigo-800 mb-3 border-b border-indigo-100 pb-2">Overall Analysis</h3>
        <p className="text-gray-700 mb-4">{overallJustification.replace(' (Fallback)', '')}</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <div>
            <h4 className="font-medium text-gray-800">Estimated Cost</h4>
            <p>{estimatedCost}</p>
          </div>
          <div>
            <h4 className="font-medium text-gray-800">Estimated Timeline</h4>
            <p>{estimatedTimeline}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationDisplay; 