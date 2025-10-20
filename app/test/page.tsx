'use client';

import { useState } from 'react';

export default function TestOptimizePage() {
  const [platform, setPlatform] = useState('etsy');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [photoScore, setPhotoScore] = useState(75);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const tagsArray = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const res = await fetch('/api/optimize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          platform,
          title,
          description,
          tags: tagsArray.length > 0 ? tagsArray : undefined,
          photoScore,
        }),
      });

      const data = await res.json();
      setResponse(data);

      if (!data.ok) {
        setError(data.error?.message || 'Request failed');
      }
    } catch (err: any) {
      setError(err.message);
      setResponse({ error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Elite Listing AI - Test Console</h1>
        <p className="text-gray-400 mb-8">Test the /api/optimize endpoint</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Input Form</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Platform <span className="text-red-500">*</span>
                </label>
                <select
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  required
                >
                  <option value="etsy">Etsy</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g., Vintage Leather Messenger Bag"
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Product description..."
                  rows={4}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Tags (comma-separated)
                </label>
                <textarea
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="leather, vintage, bag, handmade"
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Photo Score: {photoScore}
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={photoScore}
                  onChange={(e) => setPhotoScore(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>50</span>
                  <span>100</span>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white font-semibold py-3 px-4 rounded transition-colors"
              >
                {loading ? 'Optimizing...' : 'Optimize Listing'}
              </button>
            </form>
          </div>

          {/* Response Section */}
          <div className="bg-gray-900 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Response</h2>
            
            {loading && (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            )}

            {error && (
              <div className="bg-red-900/50 border border-red-700 rounded p-4 mb-4">
                <p className="text-red-300 font-semibold">Error:</p>
                <p className="text-red-200">{error}</p>
              </div>
            )}

            {response && !loading && (
              <div className="space-y-4">
                {response.ok ? (
                  <>
                    <div className="bg-green-900/50 border border-green-700 rounded p-4">
                      <p className="text-green-300 font-semibold">✓ Success</p>
                      <p className="text-green-200">
                        Health Score: <span className="text-2xl font-bold">{response.healthScore}</span>
                      </p>
                      <p className="text-sm text-green-300 mt-2">
                        Generated {response.variant_count} variants
                      </p>
                    </div>

                    {response.variants && response.variants.map((variant: any, idx: number) => (
                      <div key={idx} className="bg-gray-800 border border-gray-700 rounded p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold text-blue-400">Variant {idx + 1}</h3>
                          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                            Score: {variant.copyScore}
                          </span>
                        </div>
                        <p className="font-medium text-white mb-2">{variant.title}</p>
                        <p className="text-sm text-gray-300 mb-3">{variant.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {variant.tags && variant.tags.map((tag: string, i: number) => (
                            <span
                              key={i}
                              className="bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}

                    {response.rationale && (
                      <div className="bg-gray-800 border border-gray-700 rounded p-4">
                        <h3 className="text-sm font-semibold text-gray-400 mb-2">AI Rationale</h3>
                        <p className="text-sm text-gray-300">{response.rationale}</p>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="bg-gray-800 border border-gray-700 rounded p-4">
                    <p className="text-red-400 font-semibold mb-2">Request Failed</p>
                    <pre className="text-xs text-gray-300 overflow-x-auto">
                      {JSON.stringify(response, null, 2)}
                    </pre>
                  </div>
                )}

                <details className="bg-gray-800 border border-gray-700 rounded">
                  <summary className="cursor-pointer p-4 font-semibold text-gray-400 hover:text-white">
                    View Raw JSON
                  </summary>
                  <pre className="p-4 text-xs text-gray-300 overflow-x-auto border-t border-gray-700">
                    {JSON.stringify(response, null, 2)}
                  </pre>
                </details>
              </div>
            )}

            {!response && !loading && (
              <div className="text-center py-12 text-gray-500">
                <p>Submit the form to see results</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

