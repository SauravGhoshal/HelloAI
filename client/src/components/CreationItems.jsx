import React, { useState } from 'react';
import Markdown from 'react-markdown'

const CreationItems = ({ item }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      onClick={() => setExpanded(!expanded)}
      className='p-4 max-w-5xl text-sm bg-white border border-gray-200 rounded-lg cursor-pointer shadow-sm mb-4'
    >
      {/* Header */}
      <div className='flex justify-between items-center gap-4'>
        <div>
          <h2 className='font-medium text-gray-800'>{item.prompt}</h2>
          <p className='text-gray-500'>
            {item.type} - {new Date(item.created_at).toLocaleDateString()}
          </p>
        </div>
        <button className='bg-[#EFF6FF] border border-[#84acdc] text-[#041755] px-4 py-1 rounded-full'>
          {item.type}
        </button>
      </div>

      {/* Expanded Content */}
      {expanded && (
        <div className='mt-3'>
          {item.type === 'image' ? (
            <img
              src={item.content}
              alt={item.prompt || 'Generated Image'}
              className='w-full max-w-md rounded-md'
            />
          ) : (
            <div className='overflow-y-auto text-sm text-slate-700 whitespace-pre-wrap'>
              <div className='reset-tw'>
                <Markdown>{item.content}</Markdown>

                
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CreationItems;
