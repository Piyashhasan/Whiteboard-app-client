import { useState } from "react";

const SearchDrawing = () => {
  const [searchInput, setSearchInput] = useState("");

  // --- form submit handler ---
  const handleSearch = (e) => {
    e.preventDefault();
    const searchText = searchInput
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, " ");

    if (searchInput) {
      console.log("-- Search --", searchText);
    }
    setSearchInput("");
  };
  return (
    <div className="flex justify-center">
      <form onSubmit={handleSearch} className="flex items-center w-[500px]">
        <input
          className="w-full text-[12px] px-[22px] py-[9px] outline-none border-[1px] sm:text-[16px] sm:px-5 sm:py-2"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          type="text"
          placeholder="Search Drawings ..."
          required
        />
        <button
          type="submit"
          className="text-[14px] px-[22px] py-[10px] bg-[#00A9E4] text-white hover:bg-gray-600 sm:text-[14px] sm:px-8 sm:py-[10.5px]"
        >
          Search
        </button>
      </form>
    </div>
  );
};

export default SearchDrawing;
