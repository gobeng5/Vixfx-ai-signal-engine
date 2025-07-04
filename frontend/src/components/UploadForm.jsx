import React, { useState } from 'react';
import axios from 'axios';

export default function UploadForm({ onSignal }) {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [useLiveChart, setUseLiveChart] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (useLiveChart) {
      alert('📡 Live chart analysis is coming soon!');
      return;
    }

    if (!image) {
      alert('Please select a screenshot to upload.');
      return;
    }

    const form = new FormData();
    form.append('screenshot', image);
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/upload', form);
      if (res.data?.data) {
        onSignal(res.data.data);
      } else {
        alert('No signal returned from AI.');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Something went wrong while uploading the screenshot.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
      <div style={{ marginBottom: '1rem' }}>
        <label>
          <input
            type="checkbox"
            checked={useLiveChart}
            onChange={(e) => setUseLiveChart(e.target.checked)}
          />
          {' '}Use Live Chart Mode (coming soon)
        </label>
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setImage(e.target.files[0])}
        disabled={useLiveChart}
      />

      <button type="submit" disabled={loading || useLiveChart} style={{ marginLeft: '1rem' }}>
        {loading ? 'Analyzing...' : 'Analyze Screenshot'}
      </button>
    </form>
  );
}
