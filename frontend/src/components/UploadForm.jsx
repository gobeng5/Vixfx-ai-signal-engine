import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm({ onSignal }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('screenshot', image);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', form);
      onSignal(res.data.data);
    } catch (err) {
      console.error('Upload failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <input type="file" onChange={e => setImage(e.target.files[0])} />
      <button type="submit" disabled={loading}>
        {loading ? 'Analyzing...' : 'Analyze Screenshot'}
      </button>
    </form>
  );
}
