import React, { useState, useEffect } from "react"

export default function UI({ projects, focusedItem, setFocusedItem }) {
  const [currentCharIndex, setCurrentCharIndex] = useState(null)

  const getProjectDetails = (name) => {
    const index = Number.parseInt(name.split("-")[1])
    return projects[index]
  }

  useEffect(() => {
    if (focusedItem && focusedItem.name.startsWith("project-")) {
      const text = getProjectDetails(focusedItem.name).description;
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
      }, 20); // Faster interval for smoother character animation
      return () => clearInterval(interval);
    }
  }, [focusedItem]);

  return (
    <div className="absolute top-0 left-0 p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Desmond Foo's Portfolio</h1>
      {focusedItem && (
        <div className="bg-violet-900 bg-opacity-50 p-4 rounded border border-violet-300 backdrop-blur-lg max-w-[30rem]">
          <h2 className="text-xl mb-2">
            {focusedItem.name === "about" && "About Me"}
            {focusedItem.name === "contact" && "Contact"}
            {focusedItem.name === "blog" && "Blog"}
            {focusedItem.name.startsWith("project-") && getProjectDetails(focusedItem.name).name}
          </h2>
          <p>
            {focusedItem.name.startsWith("project-") && 
              getProjectDetails(focusedItem.name).description.slice(0, currentCharIndex + 1)}
          </p>
          <button
            className="mt-8 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setFocusedItem(null)}
          >
            Back to Space
          </button>
        </div>
      )}
    </div>
  )
}