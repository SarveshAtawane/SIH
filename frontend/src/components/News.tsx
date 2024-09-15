"use client"
import { GetServerSideProps } from 'next';
import { getNews } from '../utils/Get_News'; // Ensure this path is correct
import { useState } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from '../components/ui/carousel'; // Adjust this path according to your project structure

// Define the interface for a news article
interface NewsArticle {
  title: string;
  description: string;
  url: string;
  urlToImage: string;
}

// Define the Props interface with articles being an array of NewsArticle
interface Props {
  articles: NewsArticle[];
}

// The main News component, accepting articles as props
const News: React.FC<Props> = ({ articles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Handlers to navigate through the carousel items
  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % articles.length);
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + articles.length) % articles.length);
  };

  return (
    <div>
      <h2 className="font-bold text-3xl text-center mb-8">Latest News and Updates</h2>
      <Carousel>
        <CarouselContent>
          {articles.map((article, index) => (
            <CarouselItem key={index} className={`${index === currentIndex ? 'block' : 'hidden'}`}>
              <div className="p-4 bg-gray-100 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold">{article.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{article.description}</p>
                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline mt-2 block"
                >
                  Read more
                </a>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious onClick={handlePrevious} />
        <CarouselNext onClick={handleNext} />
      </Carousel>
    </div>
  );
};

// Fetch news articles on the server side
export const getServerSideProps: GetServerSideProps = async () => {
  try {
    const articles = await getNews(); // Fetch articles using your utility function
    return { props: { articles } }; // Pass articles as props
  } catch (error) {
    console.error('Error fetching news articles:', error);
    return { props: { articles: [] } }; // Fallback to an empty array if fetching fails
  }
};

export default News;
