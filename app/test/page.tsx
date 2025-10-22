'use client';

import { useState } from 'react';

export default function TestOptimize() {
  const [activeTab, setActiveTab] = useState<'optimize' | 'image'>('optimize');
  
  // Listing Optimizer State
  const [platform, setPlatform] = useState('etsy');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [photoScore, setPhotoScore] = useState(75);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Image Analysis State
  const [imageUrl, setImageUrl] = useState('');
  const [imagePlatform, setImagePlatform] = useState('etsy');
  const [imageLoading, setImageLoading] = useState(false);
  const [imageResponse, setImageResponse] = useState<any>(null);
  const [imageError, setImageError] = useState<string | null>(null);

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
          description: description.length > 0 ? description : undefined,
          tags: tagsArray.length > 0 ? tagsArray : undefined,
          photoScore,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to optimize listing');
      }

      setResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleImageAnalysis = async (e: React.FormEvent) => {
    e.preventDefault();
    setImageLoading(true);
    setImageError(null);
    setImageResponse(null);

    try {
      const res = await fetch('/api/image/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          imageUrl,
          platform: imagePlatform,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Failed to analyze image');
      }

      setImageResponse(data);
    } catch (err: any) {
      setImageError(err.message);
    } finally {
      setImageLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Elite Listing AI
          </h1>
          <p className="text-gray-400">Optimize your Etsy listings with AI-powered analysis</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('optimize')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'optimize'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            📝 Listing Optimizer
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'image'
                ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
            }`}
          >
            🖼️ Image Analysis
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Input Form */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-3xl">⚙️</span> Input Form
            </h2>

            {activeTab === 'optimize' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-yellow-400">
                    Platform *
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="etsy">Etsy</option>
                    <option value="shopify">Shopify</option>
                    <option value="ebay">eBay</option>
                    <option value="amazon">Amazon</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-cyan-400">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Handmade Ceramic Coffee Mug"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-orange-400">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Describe your product..."
                    rows={4}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-green-400">
                    Tags (comma-separated)
                  </label>
                  <textarea
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="ceramic, handmade, coffee, mug"
                    rows={2}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-purple-400">
                    Photo Score: {photoScore}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={photoScore}
                    onChange={(e) => setPhotoScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>Poor (0)</span>
                    <span>Average (50)</span>
                    <span>Excellent (100)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {loading ? '⏳ Optimizing...' : '✨ Optimize Listing'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleImageAnalysis} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-blue-400">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/product-image.jpg"
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-yellow-400">
                    Platform *
                  </label>
                  <select
                    value={imagePlatform}
                    onChange={(e ) => setImagePlatform(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    required
                  >
                    <option value="etsy">Etsy</option>
                    <option value="shopify">Shopify</option>
                    <option value="ebay">eBay</option>
                    <option value="amazon">Amazon</option>
                  </select>
                </div>

                {imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-400 mb-2">Preview:</p>
                    <img
                      src={imageUrl}
                      alt="Product preview"
                      className="w-full h-48 object-cover rounded-lg border border-gray-600"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                 )}

                <button
                  type="submit"
                  disabled={imageLoading}
                  className="w-full py-4 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {imageLoading ? '⏳ Analyzing...' : '🔍 Analyze Image'}
                </button>
              </form>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <span className="text-3xl">📊</span> Results
            </h2>

            {activeTab === 'optimize' ? (
              <>
                {error && (
                  <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
                    <strong>Error:</strong> {error}
                  </div>
                )}

                {!response && !error && (
                  <div className="text-center py-16 text-gray-500">
                    <div className="text-6xl mb-4">📝</div>
                    <p>Fill out the form to optimize your listing</p>
                  </div>
                )}

                {response && response.ok && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">Overall Health Score</span>
                        <span className={`text-3xl font-bold ${getScoreColor(response.healthScore)}`}>
                          {response.healthScore}/100
                        </span>
                      </div>
                    </div>

                    {response.variants?.map((variant: any, index: number) => (
                      <div
                        key={index}
                        className="bg-gray-900/50 border border-gray-600 rounded-lg p-4 hover:border-purple-500 transition-all"
                      >
                        <h3 className="font-bold text-xl mb-3 text-purple-400">
                          Variant {index + 1}
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Title:</p>
                            <p className="font-semibold text-blue-300">{variant.title}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Description:</p>
                            <p className="text-sm text-gray-300">{variant.description}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Tags:</p>
                            <div className="flex flex-wrap gap-2">
                              {variant.tags?.map((tag: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-blue-500/20 border border-blue-500/50 rounded-full text-xs text-blue-300"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-gray-700">
                            <span className="text-sm text-gray-400">Copy Score:</span>
                            <span className={`font-bold ${getScoreColor(variant.copyScore)}`}>
                              {variant.copyScore}/100
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <details className="bg-gray-900/30 border border-gray-700 rounded-lg p-4">
                      <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors">
                        View Raw JSON
                      </summary>
                      <pre className="mt-4 text-xs bg-black/50 p-4 rounded overflow-auto max-h-64">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </>
            ) : (
              <>
                {imageError && (
                  <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg mb-4">
                    <strong>Error:</strong> {imageError}
                  </div>
                )}

                {!imageResponse && !imageError && (
                  <div className="text-center py-16 text-gray-500">
                    <div className="text-6xl mb-4">🖼️</div>
                    <p>Enter an image URL to analyze quality</p>
                  </div>
                )}

                {imageResponse && imageResponse.ok && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/50 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">Overall Quality Score</span>
                        <span className={`text-3xl font-bold ${getScoreColor(imageResponse.score)}`}>
                          {imageResponse.score}/100
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: '💡 Lighting', score: imageResponse.lighting },
                        { label: '🎨 Composition', score: imageResponse.composition },
                        { label: '🔍 Clarity', score: imageResponse.clarity },
                        { label: '✨ Appeal', score: imageResponse.appeal },
                      ].map((metric, index) => (
                        <div key={index} className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                          <p className="text-sm text-gray-400 mb-2">{metric.label}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-gray-700 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${getScoreBgColor(metric.score)}`}
                                style={{ width: `${metric.score}%` }}
                              />
                            </div>
                            <span className={`font-bold ${getScoreColor(metric.score)}`}>
                              {metric.score}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {imageResponse.feedback && (
                      <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                        <h3 className="font-bold text-lg mb-2 text-blue-400">Feedback</h3>
                        <p className="text-sm text-gray-300">{imageResponse.feedback}</p>
                      </div>
                    )}

                    {imageResponse.suggestions && imageResponse.suggestions.length > 0 && (
                      <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                        <h3 className="font-bold text-lg mb-3 text-green-400">Suggestions</h3>
                        <ul className="space-y-2">
                          {imageResponse.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-gray-300">
                              <span className="text-green-400 mt-0.5">✓</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <details className="bg-gray-900/30 border border-gray-700 rounded-lg p-4">
                      <summary className="cursor-pointer text-sm text-gray-400 hover:text-white transition-colors">
                        View Raw JSON
                      </summary>
                      <pre className="mt-4 text-xs bg-black/50 p-4 rounded overflow-auto max-h-64">
                        {JSON.stringify(imageResponse, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
