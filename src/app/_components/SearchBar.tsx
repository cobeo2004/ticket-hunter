import React from "react";
import Form from "next/form";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
function SearchBar() {
  return (
    <div>
      <Form action="/search" className="relative">
        <input
          type="text"
          name="q"
          placeholder="Search for events..."
          className="w-full py-3 px-4 pl-12 bg-white rounded-xl border border-gray-200 shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5" />
        <Button
          type="submit"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
        >
          Search
        </Button>
      </Form>
    </div>
  );
}

export default SearchBar;
