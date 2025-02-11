import technologies from "../lib/skill";
import { Progress } from "@/components/ui/progress"
import { useState, useEffect } from "react";

export default function UIAbout({ setEnableBike}) {
  const [renderedTech, setRenderedTech] = useState(false);
  const [selectedTech, setSelectedTech] = useState(null);
  const [currentCharIndex, setCurrentCharIndex] = useState(null)
  

  function handleSelectTech(tech, e) {
    e.preventDefault();
    setSelectedTech(tech);
  }

  useEffect(() => {
    if (selectedTech && selectedTech.competence) {
      const text = selectedTech.competence;
      setCurrentCharIndex(0);
      const interval = setInterval(() => {
        setCurrentCharIndex((prevIndex) => {
          if (prevIndex < text.length - 1) {
            return prevIndex + 1;
          } else {
            clearInterval(interval);
            return prevIndex;
          }
        });
      }, 10); // Faster interval for smoother character animation
      return () => clearInterval(interval);
    }
  }, [selectedTech]);

  return (
    <div 
      className="absolute top-0 left-0 p-4 text-white"
      onKeyDown={(e) => {
        if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
          e.preventDefault();
        }
      }}
      tabIndex="-1"
    >
      <h1 className="text-2xl font-bold mb-4">About Desmond Foo</h1>


      {/* Skills */}
      <>
      <button
        className="bg-violet-900 bg-opacity-50 p-2 rounded-lg border border-violet-300 backdrop-blur-lg cursor-pointer hover:bg-violet-800 mb-4"
        onClick={() => setRenderedTech(!renderedTech)}
      >
        {renderedTech ? 'Hide Skills' : 'Show Skills'}
      </button>

      <div className={`transform transition-all duration-1000 ease-in-out overflow-hidden
        ${renderedTech ? 'opacity-100 translate-y-0 visible' : 'opacity-0 -translate-y-4 invisible max-h-0'}
        bg-violet-900 bg-opacity-50 p-4 rounded-lg border border-violet-300 backdrop-blur-lg w-[28rem] shadow-lg`}
      >
        <h2 className="text-xl font-semibold mb-4 border-b border-violet-300 pb-2">Skills</h2>
        <div 
          className="flex flex-col gap-y-4 max-h-[22rem] overflow-y-auto [scrollbar-width:thin]"
        >
          {technologies.map((tech, index) => (
            <div 
              key={index} 
              className="grid grid-cols-[1fr_2fr] items-center gap-x-4"
            >
              <div 
                className="text-sm font-medium text-center p-3 rounded-md hover:bg-violet-800 transition-all duration-300 border border-violet-400/20 cursor-pointer"
                onClick={(e) => handleSelectTech(tech, e)}
              >
                {tech.name}
              </div>

              {/* Proficiency */}
              <div className="w-full">
                <Progress value={tech.proficiency * 10} />
              </div>
            </div>
          ))}
        </div>

        {selectedTech && selectedTech.competence && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">{selectedTech.name}</h3>
            <p className="text-sm">{selectedTech.competence.slice(0, currentCharIndex + 1)}</p>
          </div>
        )}
      </div>
      </>
      
    </div>
  );
}