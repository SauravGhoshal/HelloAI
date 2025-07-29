import React, { useState } from 'react';
import { Edit, Sparkles } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '@clerk/clerk-react';
import Markdown from 'react-markdown';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const WriteArticle = () => {
  const articleLength = [
    { length: 800, text: 'Short (500-800 words)' },
    { length: 1200, text: 'Medium (800-1200 words)' },
    { length: 1600, text: 'Long (1200+ words)' }
  ];

  const [selectedLength, setSelectedLength] = useState(articleLength[0]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');

  const { getToken } = useAuth();

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const prompt = `Write an article on "${input}" with approximately ${selectedLength.length} words.`;
      const { data } = await axios.post(
        '/api/ai/generate-article',
        { prompt, length: selectedLength.length },
        {
          headers: {
            Authorization: `Bearer ${await getToken()}`
          }
        }
      );

      if (data.success) {
        setContent(data.content);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='h-full overflow-y-scroll p-6 flex items-start flex-wrap gap-4 text-slate-700'>

      {/* Left Column */}
      <form
        onSubmit={onSubmitHandler}
        className='w-full max-w-lg p-4 bg-white rounded-lg border border-gray-200'
      >
        <div className='flex items-center gap-3'>
          <Sparkles className='w-6 text-[#f806a3]' />
          <h1 className='text-xl font-semibold'>Article Configuration</h1>
        </div>

        <p className='mt-6 text-sm font-medium'>Article Topic</p>
        <input
          type='text'
          className='w-full p-2 px-3 mt-2 outline-none text-sm rounded-md border border-gray-300'
          placeholder='The future of Artificial Intelligence is...'
          value={input}
          onChange={(e) => setInput(e.target.value)}
          required
        />

        <p className='mt-4 text-sm font-medium'>Article Length</p>
        <div className='flex flex-wrap gap-2 mt-2'>
          {articleLength.map((item, index) => (
            <span
              key={index}
              onClick={() => setSelectedLength(item)}
              className={`text-xs px-4 py-1 border rounded-full cursor-pointer 
                ${
                  selectedLength.text === item.text
                    ? 'bg-pink-50 text-pink-700 border-blue-200'
                    : 'text-gray-500 border-gray-300'
                }`}
            >
              {item.text}
            </span>
          ))}
        </div>

        <button
          type='submit'
          disabled={loading || !input.trim()}
          className='w-full flex justify-center items-center gap-2
          bg-gradient-to-r from-[#e80633c7] to-[#f75efa] text-white px-4 py-3 mt-6
          text-sm rounded-lg cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed'
        >
          {loading ? (
            <span className='w-4 h-4 rounded-full border-2 border-t-transparent border-white animate-spin' />
          ) : (
            <>
              <Edit className='w-5' />
              <span>Generate Article</span>
            </>
          )}
        </button>
      </form>

      {/* Right Column */}
      <div className='w-full max-w-lg p-4 bg-white rounded-lg flex flex-col border border-gray-200 min-h-96 max-h-[600px]'>
        <div className='flex items-center gap-3'>
          <Edit className='w-5 h-5 text-[#fa098a]' />
          <h1 className='text-xl font-semibold'>Generated Article</h1>
        </div>

        {!content ? (
          <div className='flex-1 flex justify-center items-center'>
            <div className='text-sm flex flex-col items-center gap-5 text-gray-400'>
              <Edit className='w-9 h-9' />
              <p>Enter a topic and click "Generate Article" to get started</p>
            </div>
          </div>
        ) : (
          <div className='mt-3 max-h-[420px] overflow-y-auto text-sm text-slate-600 whitespace-pre-wrap'>
            <div className='.reset-tw'>
              <Markdown>{content}</Markdown>
              </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WriteArticle;
