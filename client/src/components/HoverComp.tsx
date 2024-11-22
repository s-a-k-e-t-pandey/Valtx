import  { useState } from "react";
import { BooksSection, BookCard, BookCardHover } from "./Styled";
import { ArrowRight, Lock, Shield, Smartphone } from 'lucide-react'


export default function App() {
  const [displayBookCardHover, setDisplayBookCardHover] = useState(false);

  const showCardHover = () => {
    setDisplayBookCardHover(true);
  };
  const hiddenCardHover = () => {
    setDisplayBookCardHover(false);
  };

  return (
    <div className="h-20 bg-gradient-to-br from-teal-500 via-slate-400 via-black-200 to-cyan-500 opacity-90">
      <BooksSection className="flex justify-center h-40 w-40">
        <BookCard
          bgColor={"#000"}
          color={"#fff"}
          onMouseEnter={showCardHover}
          onMouseLeave={hiddenCardHover}
          className="bg-white p-6 rounded-lg shadow-md border-2 border-teal-600"
        >
          <BookCardHover display={displayBookCardHover}>
          <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-teal-800 mb-4">Secure Your Digital Life</h1>
          <p className="text-xl text-teal-600 mb-8">Store, manage, and protect your files with military-grade encryption</p>
          <div className="flex justify-center space-x-4">
            <button className="bg-teal-600 hover:bg-teal-700 text-white p-2 rounded-lg">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
            <button  className="border-teal-600 text-teal-600 hover:bg-teal-50">Learn More</button>
          </div>
        </div>
          </BookCardHover>
          Box One
        </BookCard>
        <div className="relative w-1/2 h-[500px] p-5 bg-gray-300 text-black flex flex-col justify-center items-center">
        <p className="text-xl">Book Title</p>

        <div className="absolute inset-0 bg-black bg-opacity-70 text-white text-5xl flex justify-center items-center opacity-0 hover:opacity-100 transition-opacity duration-300">
            Hover Content
        </div>
        </div>

      </BooksSection>
    </div>
  );
}