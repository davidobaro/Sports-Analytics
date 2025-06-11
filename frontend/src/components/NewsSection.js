import React from 'react';

const NewsSection = ({ articles }) => {
  return (
    <div className="card p-6">
      <h2 className="text-xl font-mono font-semibold text-cyan-400 mb-6 flex items-center">
        
        MARKET_NEWS_FEED
      </h2>
      
      <div className="space-y-4">
        {articles.map((article, index) => (
          <article 
            key={index}
            className="p-4 border border-gray-600 bg-gray-800 rounded hover:border-cyan-400 hover:bg-gray-750 transition-all duration-200 cursor-pointer"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-mono font-semibold text-green-400 hover:text-cyan-400 transition-colors line-clamp-2">
                {article.title}
              </h3>
              <span className="text-xs font-mono text-gray-500 ml-4 flex-shrink-0">
                [{article.source}]
              </span>
            </div>
            
            <p className="text-gray-400 font-mono text-sm mb-3 line-clamp-2">
              {article.summary}
            </p>
            
            <div className="flex justify-between items-center text-xs font-mono text-gray-500">
              <span>
                {new Date(article.published_at).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
              <span className="text-cyan-400 hover:text-green-400 transition-colors">
                READ_MORE →
              </span>
            </div>
          </article>
        ))}
      </div>
      
      {articles.length === 0 && (
        <div className="text-center py-8 text-gray-500 font-mono">
          NO_NEWS_DATA_AVAILABLE
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t border-gray-700 text-center">
        <button className="text-cyan-400 hover:text-green-400 font-mono font-medium transition-colors duration-200">
          LOAD_MORE_NEWS
        </button>
      </div>
    </div>
  );
};

export default NewsSection;
