import React, { useState } from 'react';
import { useSummary } from '../context/SummaryContext';
import { Sparkles, FileText, Copy, Save, Loader, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

const Summarize = () => {
  const { generateAISummary, createSummary } = useSummary();
  const [formData, setFormData] = useState({
    title: '',
    originalText: '',
    maxLength: 200,
    style: 'concise',
  });
  const [summary, setSummary] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [cached, setCached] = useState(false);

  const wordCount = formData.originalText.trim().split(/\s+/).filter((w) => w).length;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleGenerate = async () => {
    if (!formData.originalText.trim()) {
      toast.error('Please enter text to summarize');
      return;
    }

    if (wordCount < 50) {
      toast.error('Text must be at least 50 words long');
      return;
    }

    setIsGenerating(true);
    setSummary('');
    setStatistics(null);

    const result = await generateAISummary({
      text: formData.originalText,
      maxLength: formData.maxLength,
      style: formData.style,
    });

    setIsGenerating(false);

    if (result.success) {
      setSummary(result.summary);
      setStatistics(result.statistics);
      setCached(result.cached || false);
      toast.success(result.cached ? 'Summary retrieved from cache!' : 'Summary generated successfully!');
    } else {
      toast.error(result.message || 'Failed to generate summary');
    }
  };

  const handleSave = async () => {
    if (!formData.title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    if (!summary.trim()) {
      toast.error('Please generate a summary first');
      return;
    }

    setIsSaving(true);

    const result = await createSummary({
      title: formData.title,
      originalText: formData.originalText,
      summarizedText: summary,
    });

    setIsSaving(false);

    if (result.success) {
      setFormData({
        title: '',
        originalText: '',
        maxLength: 200,
        style: 'concise',
      });
      setSummary('');
      setStatistics(null);
      setCached(false);
    }
  };

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-5xl font-bold text-gray-800 mb-3 flex items-center justify-center gap-3">
              <Sparkles className="w-12 h-12 text-indigo-600" />
              AI Text Summarizer
            </h1>
            <p className="text-gray-600 text-lg">
              Transform lengthy text into concise, meaningful summaries using AI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <FileText className="w-6 h-6 text-indigo-600" />
                Input Text
              </h2>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title (for saving)
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter a title for this summary..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Text to Summarize *
                </label>
                <textarea
                  name="originalText"
                  value={formData.originalText}
                  onChange={handleInputChange}
                  placeholder="Paste your text here (minimum 50 words)..."
                  rows="12"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-600">{wordCount} words</span>
                  {wordCount < 50 && wordCount > 0 && (
                    <span className="text-sm text-amber-600 flex items-center gap-1">
                      <AlertCircle className="w-4 h-4" />
                      Minimum 50 words required
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Summary Style
                  </label>
                  <select
                    name="style"
                    value={formData.style}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="concise">Concise</option>
                    <option value="detailed">Detailed</option>
                    <option value="bullet">Bullet Points</option>
                    <option value="executive">Executive Summary</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Length (words)
                  </label>
                  <input
                    type="number"
                    name="maxLength"
                    value={formData.maxLength}
                    onChange={handleInputChange}
                    min="50"
                    max="500"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerate}
                disabled={isGenerating || wordCount < 50}
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate AI Summary
                  </>
                )}
              </button>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-purple-600" />
                AI Summary
              </h2>

              {!summary && !isGenerating && (
                <div className="h-full flex items-center justify-center text-center p-8">
                  <div>
                    <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">
                      Your AI-generated summary will appear here
                    </p>
                  </div>
                </div>
              )}

              {isGenerating && (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center">
                    <Loader className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Generating your summary...</p>
                    <p className="text-gray-500 text-sm mt-2">This may take a few seconds</p>
                  </div>
                </div>
              )}

              {summary && (
                <div className="space-y-4">
                  {cached && (
                    <div className="bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg text-sm flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      Retrieved from cache (faster response!)
                    </div>
                  )}

                  <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200">
                    <p className="text-gray-800 leading-relaxed whitespace-pre-wrap">{summary}</p>
                  </div>

                  {statistics && (
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {statistics.originalWords}
                        </div>
                        <div className="text-sm text-gray-600">Original Words</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {statistics.summaryWords}
                        </div>
                        <div className="text-sm text-gray-600">Summary Words</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {statistics.compressionRatio}%
                        </div>
                        <div className="text-sm text-gray-600">Compression</div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-3">
                    <button
                      onClick={() => handleCopy(summary)}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                      <Copy className="w-5 h-5" />
                      Copy Summary
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving || !formData.title.trim()}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
                    >
                      {isSaving ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save to History
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Summarize;
