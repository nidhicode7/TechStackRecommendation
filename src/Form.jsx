import React, { useState } from 'react';
import axios from 'axios';

const Form = () => {
  const [formData, setFormData] = useState({
    projectType: '',
    skills: '',
    budget: '',
    timeline: '',
  });

  const [result, setResult] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const prompt = `Suggest a technology stack for a ${formData.projectType} app. The team has skills in ${formData.skills}, budget is ${formData.budget}, and timeline is ${formData.timeline}. Provide justifications.`;

    try {
      const res = await axios.post('/api/generate', { prompt });
      setResult(res.data.result);
    } catch (err) {
      console.error(err);
      setResult('Error fetching recommendation.');
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>Project Type: </label>
        <input type="text" name="projectType" onChange={handleChange} /><br />

        <label>Team Skills: </label>
        <input type="text" name="skills" onChange={handleChange} /><br />

        <label>Budget: </label>
        <input type="text" name="budget" onChange={handleChange} /><br />

        <label>Timeline: </label>
        <input type="text" name="timeline" onChange={handleChange} /><br />

        <button type="submit">Get Recommendation</button>
      </form>
      <div>
        <h3>Result:</h3>
        <p>{result}</p>
      </div>
    </div>
  );
};

export default Form;
