import Image from "next/image";
import Navbar from "../components/Navbar";
import { Calculator, Newspaper, Bot } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from "@/components/ui/carousel";
import CollegeList from "@/components/CollegeList"; 


const Home: React.FC = () => {
  return (
    <div>
      <Image
        src={"/grid.svg"}
        className="absolute z-[-10] w-full"
        width={1200}
        height={300}
        alt="Background grid"
      />
      <Navbar />
      <section className="z-50">
        <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
            One stop solution For all your Worries
          </h1>
          <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
            Check your chances of getting your desired college with our college predictor and get all your queries answered by our chatbot.
          </p>
          <div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
            <a
              href="#"
              className="inline-flex justify-center items-center py-3 px-5 text-base font-medium text-center text-white rounded-lg bg-primary hover:bg-primary focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
            >
              Start Chat
              <svg
                className="ml-2 -mr-1 w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 bg-white z-50 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
        <h2 className="font-bold text-3xl">What is there for You?</h2>
        <h2 className="text-md text-gray-500">Features we offer to ease your college selection</h2>

        <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          <a
            className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
            href="#"
          >
            <Bot className="h-8 w-8" />
            <h2 className="mt-4 text-xl font-bold text-black">ChatBot</h2>
            <p className="mt-1 text-sm text-gray-600">
              Answers all the queries based on the info provided by the colleges/Rajasthan government.
            </p>
          </a>

          <a
            className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
            href="#"
          >
            <Calculator className="h-8 w-8" />
            <h2 className="mt-4 text-xl font-bold text-black">Predict your college</h2>
            <p className="mt-1 text-sm text-gray-600">
              Enter the necessary details and get to know the chances of getting your dream college with our college predictor.
            </p>
          </a>

          <a
            className="block rounded-xl border bg-white border-gray-200 p-8 shadow-xl transition hover:border-pink-500/10 hover:shadow-pink-500/10"
            href="#"
          >
            <Newspaper className="h-8 w-8" />
            <h2 className="mt-4 text-xl font-bold text-black">News and Buzz</h2>
            <p className="mt-1 text-sm text-gray-600">
              Get all the related news and buzz around for all the Rajasthan government colleges.
            </p>
          </a>
        </div>
      </section>

      {/* College Predictor Section */}
      <section className="py-8 bg-gray-50 z-50 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
        <h2 className="font-bold text-3xl text-center mb-8">College Predictor</h2>
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {/* Include College Predictor component here */}
            <div className="p-8 bg-white rounded-lg shadow-md">
              {/* College Predictor Content */}
              <h3 className="text-xl font-bold">Predict Your College</h3>
              <p className="mt-2 text-sm text-gray-600">
                Enter your exam scores and other relevant details to see your chances of getting into various colleges.
              </p>
              {/* Predictor Form/Inputs */}
            </div>
          </div>

          {/* College List Section */}
          <div className="flex-1">
            <CollegeList />
          </div>
        </div>
      </section>

      {/* News Section */}
      <section className="py-8 bg-white z-50 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-12">
       
      </section>
    </div>
  );
};

export default Home;
