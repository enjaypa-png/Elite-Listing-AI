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
    if (score >= 80) return 'text-[#00A651]';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return 'bg-[#00A651]';
    if (score >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-[#D9DBBE] text-black p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold mb-2 text-[#00A651]">
            Elite Listing AI
          </h1>
          <p className="text-gray-800">Optimize your Etsy listings with AI</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 justify-center">
          <button
            onClick={() => setActiveTab('optimize')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'optimize'
                ? 'bg-[#00A651] text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            📝 Listing Optimizer
          </button>
          <button
            onClick={() => setActiveTab('image')}
            className={`px-6 py-3 rounded-lg font-semibold transition-all ${
              activeTab === 'image'
                ? 'bg-[#00A651] text-white shadow-lg'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
            }`}
          >
            🖼️ Image Analysis
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Panel - Input Form */}
          <div className="bg-white rounded-2xl p-6 border-2 border-black shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-[#00A651]">
              {activeTab === 'optimize' ? 'Input Form' : 'Image Analysis'}
            </h2>

            {activeTab === 'optimize' ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-black">
                    Platform
                  </label>
                  <select
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value)}
                    className="w-full px-4 py-3 bg-[#D9DBBE] border-2 border-black rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-[#00A651] transition-all text-black"
                    required
                  >
                    <option value="etsy">Etsy</option>
                    <option value="shopify">Shopify</option>
                    <option value="ebay">eBay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-black">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Fall Oil Painting, Country Cottage Landscape, Rustic Fall Countryside Scene"
                    className="w-full px-4 py-3 bg-[#D9DBBE] border-2 border-black rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-[#00A651] transition-all text-black placeholder-gray-600"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-black">
                    Description
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Fall Oil Painting, Country Cottage Landscape, Rustic Fall Countryside Scene, Neutral Farmhouse Décor, Printable Wall Art, Autumn Landscape"
                    rows={4}
                    className="w-full px-4 py-3 bg-[#D9DBBE] border-2 border-black rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-[#00A651] transition-all resize-none text-black placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-black">
                    Tags (comma-separated)
                  </label>
                  <textarea
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                    placeholder="oil painting, country cottage landscape, picture"
                    rows={2}
                    className="w-full px-4 py-3 bg-[#D9DBBE] border-2 border-black rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-[#00A651] transition-all resize-none text-black placeholder-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-black">
                    Photo Score: {photoScore}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={photoScore}
                    onChange={(e) => setPhotoScore(parseInt(e.target.value))}
                    className="w-full h-2 bg-[#D9DBBE] rounded-lg appearance-none cursor-pointer accent-[#00A651]"
                  />
                  <div className="flex justify-between text-xs text-gray-700 mt-1">
                    <span>Poor (0)</span>
                    <span>Average (50)</span>
                    <span>Excellent (100)</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#00A651] hover:bg-[#008f46] text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {loading ? '⏳ Optimizing...' : '✨ Optimize Listing'}
                </button>
              </form>
            ) : (
              <form onSubmit={handleImageAnalysis} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-black">
                    Platform
                  </label>
                  <select
                    value={imagePlatform}
                    onChange={(e) => setImagePlatform(e.target.value)}
                    className="w-full px-4 py-3 bg-[#D9DBBE] border-2 border-black rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-[#00A651] transition-all text-black"
                    required
                  >
                    <option value="etsy">Etsy</option>
                    <option value="shopify">Shopify</option>
                    <option value="ebay">eBay</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-black">
                    Image URL *
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full px-4 py-3 bg-[#D9DBBE] border-2 border-black rounded-lg focus:ring-2 focus:ring-[#00A651] focus:border-[#00A651] transition-all text-black placeholder-gray-600"
                    required
                  />
                </div>

                {imageUrl && (
                  <div className="mt-4">
                    <p className="text-sm text-gray-700 mb-2">Preview:</p>
                    <img
                      src={imageUrl}
                      alt="Product preview"
                      className="w-full h-48 object-cover rounded-lg border-2 border-black"
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/400x300?text=Invalid+Image+URL';
                      }}
                    />
                  </div>
                )}

                <button
                  type="submit"
                  disabled={imageLoading}
                  className="w-full py-4 bg-[#00A651] hover:bg-[#008f46] text-white font-bold rounded-lg transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
                >
                  {imageLoading ? '⏳ Analyzing...' : '🔍 Analyze Image'}
                </button>
              </form>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="bg-white rounded-2xl p-6 border-2 border-black shadow-xl">
            <h2 className="text-2xl font-bold mb-6 text-[#00A651]">
              {activeTab === 'optimize' ? 'Optimization Results' : 'Analysis Results'}
            </h2>

            {activeTab === 'optimize' ? (
              <>
                {error && (
                  <div className="bg-red-100 border-2 border-red-500 text-red-800 px-4 py-3 rounded-lg mb-4">
                    <strong>✗ Unexpected token '&lt;','&lt;DOCTYPE' ... is not valid JSON</strong>
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
                    <div className="bg-[#D9DBBE] border-2 border-[#00A651] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-black">Overall Health Score</span>
                        <span className={`text-3xl font-bold ${getScoreColor(response.healthScore)}`}>
                          {response.healthScore}/100
                        </span>
                      </div>
                    </div>

                    {response.variants?.map((variant: any, index: number) => (
                      <div
                        key={index}
                        className="bg-[#D9DBBE] border-2 border-black rounded-lg p-4 hover:border-[#00A651] transition-all"
                      >
                        <h3 className="font-bold text-xl mb-3 text-[#00A651]">
                          Variant {index + 1}
                        </h3>
                        <div className="space-y-3">
                          <div>
                            <p className="text-sm text-gray-700 mb-1">Title:</p>
                            <p className="font-semibold text-black">{variant.title}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 mb-1">Description:</p>
                            <p className="text-sm text-black">{variant.description}</p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-700 mb-1">Tags:</p>
                            <div className="flex flex-wrap gap-2">
                              {variant.tags?.map((tag: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-3 py-1 bg-[#00A651] text-white rounded-full text-xs"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t-2 border-gray-400">
                            <span className="text-sm text-gray-700">Copy Score:</span>
                            <span className={`font-bold ${getScoreColor(variant.copyScore)}`}>
                              {variant.copyScore}/100
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    <details className="bg-[#D9DBBE] border-2 border-black rounded-lg p-4">
                      <summary className="cursor-pointer text-sm text-gray-700 hover:text-black transition-colors font-medium">
                        View Raw JSON
                      </summary>
                      <pre className="mt-4 text-xs bg-white p-4 rounded border-2 border-black overflow-auto max-h-64">
                        {JSON.stringify(response, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </>
            ) : (
              <>
                {imageError && (
                  <div className="bg-red-100 border-2 border-red-500 text-red-800 px-4 py-3 rounded-lg mb-4">
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
                    <div className="bg-[#D9DBBE] border-2 border-[#00A651] rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-black">Overall Quality Score</span>
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
                        <div key={index} className="bg-[#D9DBBE] border-2 border-black rounded-lg p-4">
                          <p className="text-sm text-gray-700 mb-2">{metric.label}</p>
                          <div className="flex items-center gap-3">
                            <div className="flex-1 bg-white border border-gray-400 rounded-full h-2">
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
                      <div className="bg-[#D9DBBE] border-2 border-black rounded-lg p-4">
                        <h3 className="font-bold text-lg mb-2 text-[#00A651]">Feedback</h3>
                        <p className="text-sm text-black">{imageResponse.feedback}</p>
                      </div>
                    )}

                    {imageResponse.suggestions && imageResponse.suggestions.length > 0 && (
                      <div className="bg-[#D9DBBE] border-2 border-black rounded-lg p-4">
                        <h3 className="font-bold text-lg mb-3 text-[#00A651]">Suggestions</h3>
                        <ul className="space-y-2">
                          {imageResponse.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="flex items-start gap-2 text-sm text-black">
                              <span className="text-[#00A651] mt-0.5">✓</span>
                              <span>{suggestion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <details className="bg-[#D9DBBE] border-2 border-black rounded-lg p-4">
                      <summary className="cursor-pointer text-sm text-gray-700 hover:text-black transition-colors font-medium">
                        View Raw JSON
                      </summary>
                      <pre className="mt-4 text-xs bg-white p-4 rounded border-2 border-black overflow-auto max-h-64">
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

