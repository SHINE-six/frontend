export default function UI({ focusedItem, setFocusedItem }) {
  return (
    <div className="absolute top-0 left-0 p-4 text-white">
      <h1 className="text-2xl font-bold mb-4">Your Name's Portfolio</h1>
      {focusedItem && (
        <div className="bg-black bg-opacity-50 p-4 rounded">
          <h2 className="text-xl mb-2">
            {focusedItem.name === "about" && "About Me"}
            {focusedItem.name === "contact" && "Contact"}
            {focusedItem.name === "blog" && "Blog"}
            {focusedItem.name.startsWith("project-") && `Project ${Number.parseInt(focusedItem.name.split("-")[1]) + 1}`}
          </h2>
          <p>This is where you'd display detailed information about the selected item.</p>
          <button
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => setFocusedItem(null)}
          >
            Back to Space
          </button>
        </div>
      )}
    </div>
  )
}

