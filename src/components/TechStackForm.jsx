import { useState } from 'react';

const TechStackForm = ({ onSubmit, loading }) => {
  const [formData, setFormData] = useState({
    productType: '',
    teamSkills: [],
    budget: '',
    timeline: '',
    additionalNotes: ''
  });

  const [hasTeamSkills, setHasTeamSkills] = useState(true); // State to manage conditional display
  const [showAdditionalNotes, setShowAdditionalNotes] = useState(false); // State to manage conditional display
  const [skillSearchTerm, setSkillSearchTerm] = useState(''); // State for skill search input

  // Placeholder values for budget and timeline clarification
  const budgetClarification = {
    Low: '< ₹10k',
    Medium: '₹10k - ₹50k',
    High: '> ₹50k',
  };

  const timelineClarification = {
    Short: '< 3 months',
    Medium: '3 - 6 months',
    Long: '> 6 months',
  };

  // Expanded list of potential skills (example)
  const skillOptions = [
    'React', 'Angular', 'Vue.js', 'Node.js', 'Python', 'Java', 'C#', 'PHP',
    'Ruby', 'Go', 'TypeScript', 'JavaScript', 'Swift', 'Kotlin', 'Django',
    'Flask', 'Spring', '.NET', 'Laravel', 'Express.js',
    'Redux', 'Vuex', 'AngularJS', 'jQuery', 'HTML', 'CSS',
    'SQL', 'NoSQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Firebase', 'Redis',
    'AWS', 'Azure', 'Google Cloud', 'Docker', 'Kubernetes', 'CI/CD',
    'Agile', 'Scrum', 'Kanban', 'UI/UX Design', 'API Design', 'Microservices',
    'GraphQL', 'REST', 'Serverless',
    'DevOps', 'Machine Learning', 'Data Science', 'Mobile Development (iOS/Android)',
    // Add more skills as needed
  ];

  // Filter skills based on search term
  const filteredSkills = skillOptions.filter(skill =>
    skill.toLowerCase().includes(skillSearchTerm.toLowerCase())
  );

  const handleSkillChange = (skill) => {
    setFormData(prev => ({
      ...prev,
      teamSkills: prev.teamSkills.includes(skill)
        ? prev.teamSkills.filter(s => s !== skill)
        : [...prev.teamSkills, skill]
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear teamSkills if user selected 'No' team skills
    const dataToSubmit = hasTeamSkills ? formData : { ...formData, teamSkills: [] };
    onSubmit(dataToSubmit);
  };

  // Function to render skill checkboxes (can be dynamic based on a filtered list if needed)
  const renderSkillCheckboxes = () => (
    <div className="mt-2 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 gap-y-3">
      {filteredSkills.map((skill) => (
        <label key={skill} className="inline-flex items-center text-gray-700 hover:text-indigo-700 cursor-pointer">
          <input
            type="checkbox"
            checked={formData.teamSkills.includes(skill)}
            onChange={() => handleSkillChange(skill)}
            className="form-checkbox h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500 transition duration-150 ease-in-out"
          />
          <span className="ml-2 text-sm font-medium">{skill}</span>
        </label>
      ))}
       {filteredSkills.length === 0 && skillSearchTerm && (
         <p className="text-sm text-gray-500">No skills found matching "{skillSearchTerm}"</p>
       )}
    </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-gradient-to-br from-gray-50 to-indigo-50 shadow-2xl rounded-xl">
      {/* Product Type */}
      <div className="pb-6">
        <label htmlFor="productType" className="block text-lg font-bold text-gray-800 mb-3">
          Type of Application
        </label>
        <select
          id="productType"
          value={formData.productType}
          onChange={(e) => setFormData(prev => ({ ...prev, productType: e.target.value }))}
          className="mt-1 block w-full pl-4 pr-12 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-base rounded-lg shadow-sm transition duration-150 ease-in-out"
          required
        >
          <option value="">Select type</option>
          <option value="Web">Web</option>
          <option value="Mobile">Mobile</option>
          <option value="Desktop">Desktop</option>
        </select>
      </div>

      {/* Team Skills Question */}
      <div className="pb-6 pt-4 border-t border-gray-200">
        <label className="block text-lg font-bold text-gray-800 mb-3">
          Do you have existing team skills?
        </label>
        <div className="mt-2 flex items-center space-x-6 justify-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="hasTeamSkills"
              value="yes"
              checked={hasTeamSkills === true}
              onChange={() => setHasTeamSkills(true)}
              className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out focus:ring-indigo-500"
            />
            <span className="ml-2 text-gray-700 text-base">Yes</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="hasTeamSkills"
              value="no"
              checked={hasTeamSkills === false}
              onChange={() => setHasTeamSkills(false)}
              className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out focus:ring-indigo-500"
            />
            <span className="ml-2 text-gray-700 text-base">No</span>
          </label>
        </div>
      </div>

      {/* Team Skills Multi-select (Conditional) */}
      {hasTeamSkills && (
        <div className="pb-6 pt-4 border-t border-gray-200">
          <label htmlFor="skillSearch" className="block text-lg font-bold text-gray-800 mb-3">
            Select Team Skills
          </label>
          {/* Skill Search Bar */}
          <input
            type="text"
            id="skillSearch"
            value={skillSearchTerm}
            onChange={(e) => setSkillSearchTerm(e.target.value)}
            className="mt-1 block w-full pl-4 pr-4 py-2 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Search skills..."
          />
          <div className="mt-4 max-h-60 overflow-y-auto pr-2">
             {renderSkillCheckboxes()}
          </div>
        </div>
      )}

      {/* Budget */}
      <div className="pb-6 pt-4 border-t border-gray-200">
        <label htmlFor="budget" className="block text-lg font-bold text-gray-800 mb-3">
          Budget
        </label>
        <select
          id="budget"
          value={formData.budget}
          onChange={(e) => setFormData(prev => ({ ...prev, budget: e.target.value }))}
          className="mt-1 block w-full pl-4 pr-12 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-base rounded-lg shadow-sm transition duration-150 ease-in-out"
          required
        >
          <option value="">Select budget</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        {formData.budget && (
          <p className="mt-2 text-sm text-gray-600">({formData.budget}: {budgetClarification[formData.budget]})</p>
        )}
      </div>

      {/* Timeline */}
      <div className="pb-6 pt-4 border-t border-gray-200">
        <label htmlFor="timeline" className="block text-lg font-bold text-gray-800 mb-3">
          Timeline
        </label>
        <select
          id="timeline"
          value={formData.timeline}
          onChange={(e) => setFormData(prev => ({ ...prev, timeline: e.target.value }))}
          className="mt-1 block w-full pl-4 pr-12 py-3 text-base border-gray-300 focus:outline-none focus:ring-indigo-600 focus:border-indigo-600 sm:text-base rounded-lg shadow-sm transition duration-150 ease-in-out"
          required
        >
          <option value="">Select timeline</option>
          <option value="Short">Short</option>
          <option value="Medium">Medium</option>
          <option value="Long">Long</option>
        </select>
        {formData.timeline && (
           <p className="mt-2 text-sm text-gray-600">({formData.timeline}: {timelineClarification[formData.timeline]})</p>
        )}
      </div>

       {/* Additional Notes Question */}
      <div className="pb-6 pt-4 border-t border-gray-200">
        <label className="block text-lg font-bold text-gray-800 mb-3">
          Do you want to add additional notes?
        </label>
        <div className="mt-2 flex items-center space-x-6 justify-center">
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="showAdditionalNotes"
              value="yes"
              checked={showAdditionalNotes === true}
              onChange={() => setShowAdditionalNotes(true)}
              className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out focus:ring-indigo-500"
            />
            <span className="ml-2 text-gray-700 text-base">Yes</span>
          </label>
          <label className="inline-flex items-center cursor-pointer">
            <input
              type="radio"
              name="showAdditionalNotes"
              value="no"
              checked={showAdditionalNotes === false}
              onChange={() => setShowAdditionalNotes(false)}
              className="form-radio h-5 w-5 text-indigo-600 transition duration-150 ease-in-out focus:ring-indigo-500"
            />
            <span className="ml-2 text-gray-700 text-base">No</span>
          </label>
        </div>
      </div>

      {/* Additional Notes Textarea (Conditional) */}
      {showAdditionalNotes && (
        <div className="pb-6 pt-4 border-t border-gray-200">
          <label htmlFor="additionalNotes" className="block text-lg font-bold text-gray-800 mb-3">
            Additional Notes
          </label>
          <textarea
            id="additionalNotes"
            value={formData.additionalNotes}
            onChange={(e) => setFormData(prev => ({ ...prev, additionalNotes: e.target.value }))}
            rows={4}
            className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Any additional requirements or considerations..."
          />
        </div>
      )}

      {/* Submit Button */}
      <div>
        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Getting Recommendation...' : 'Get Tech Stack Recommendation'}
        </button>
      </div>
    </form>
  );
};

export default TechStackForm; 