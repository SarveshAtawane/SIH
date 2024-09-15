import axios from 'axios';

const NEWS_API_KEY = process.env.NEWS_API_KEY; 

export const getNews = async () => {
  try {
    const response = await axios.get('https://newsapi.org/v2/everything', {
      params: {
        q: 'Rajasthan engineering colleges OR Rajasthan state board OR CBSE board OR JEE Mains OR JEE Advance',
        language: 'en',
        sortBy: 'relevancy',
        apiKey: NEWS_API_KEY,
      },
    });

    // Extract articles from the response
    const articles = response.data.articles;

    return articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
};
