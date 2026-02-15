import { useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';

interface FilterOption {
  title: string;
  options: string[];
}

interface FilterSectionProps {
  onFilterSubmit?: (selectedFilters: Record<string, string[]>) => void;
  onClearFilters?: () => void;
}

export default function FilterSection({ onFilterSubmit, onClearFilters }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [filters, setFilters] = useState<FilterOption[]>([]); 
  const [selectedOptions, setSelectedOptions] = useState<Record<string, Set<string>>>({});
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      const res = await fetch('/api/categories'); // Assuming this endpoint provides categories and their options
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      const formattedFilters: FilterOption[] = data.map((category: any) => ({
        title: category.categoryName,
        options: category.options.map((option: any) => option.optionName),
      }));
      setFilters(formattedFilters);
    } catch (e: any) {
      setError(e.message);
      console.error("Failed to fetch filter options:", e);
    } finally {
      setLoading(false);
    }
  };

  const toggleDropdown = (filterTitle: string) => {
    setOpenDropdowns(prev => ({
      ...prev,
      [filterTitle]: !prev[filterTitle]
    }));
  };

  const toggleOption = (filterTitle: string, option: string) => {
    setSelectedOptions(prev => {
      const currentSet = new Set(prev[filterTitle] || []);
      if (currentSet.has(option)) {
        currentSet.delete(option);
      } else {
        currentSet.add(option);
      }
      return {
        ...prev,
        [filterTitle]: currentSet
      };
    });
  };

  const isSelected = (filterTitle: string, option: string) => {
    return selectedOptions[filterTitle]?.has(option) || false;
  };

  const handleSubmit = () => {
    const formattedFilters: Record<string, string[]> = {};
    Object.entries(selectedOptions).forEach(([title, optionsSet]) => {
      if (optionsSet.size > 0) {
        formattedFilters[title] = Array.from(optionsSet);
      }
    });
    onFilterSubmit?.(Object.keys(formattedFilters).length > 0 ? formattedFilters : {});
    setIsOpen(false);
  };

  const clearFilters = () => {
    setSelectedOptions({});
    setIsOpen(false);
    onClearFilters?.();
  };

  const selectedCount = Object.values(selectedOptions).reduce(
    (count, set) => count + set.size,
    0
  );

  if (loading) {
    return (
      <div className="p-4 space-y-4 w-64 bg-white">
        <div>Loading filters...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 space-y-4 w-64 bg-white text-red-500">
        <div>Error: {error}</div>
      </div>
    );
  }

  const FilterContent = () => (
    <div className="space-y-4 w-full">
      {filters.map((filter) => (
        <div key={filter.title} className="border border-green-200 rounded-lg shadow-sm bg-white hover:shadow-md transition-shadow">
          <button
            onClick={() => toggleDropdown(filter.title)}
            className="w-full px-4 py-3 flex justify-between items-center hover:bg-green-50 rounded-t-lg focus:outline-none focus:ring-2 focus:ring-green-500 transition-colors"
          >
            <span className="font-semibold text-gray-800">{filter.title}</span>
            {openDropdowns[filter.title] ? (
              <ChevronUp className="w-5 h-5 text-green-600" />
            ) : (
              <ChevronDown className="w-5 h-5 text-green-600" />
            )}
          </button>

          {openDropdowns[filter.title] && (
            <div className="px-4 pb-3 border-t border-green-200">
              {filter.title === "Domain" ? (
                <DomainFilterOptions
                  filter={filter}
                  isSelected={isSelected}
                  toggleOption={toggleOption}
                />
              ) : (
                <div className="pt-2 space-y-2">
                  {filter.options.map((option) => (
                    <label
                      key={option}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-green-50 p-2 rounded transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={isSelected(filter.title, option)}
                        onChange={() => toggleOption(filter.title, option)}
                        className="w-4 h-4 border-2 border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-green-500 focus:outline-none checked:bg-green-500 checked:border-green-500"
                      />
                      <span className="text-sm text-gray-700">{option}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleSubmit}
        className="w-full mt-6 px-4 py-3 bg-green-600 text-white rounded-lg shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center space-x-2 transition-colors font-medium"
      >
        <Filter className="w-5 h-5" />
        <span>Apply Filters {selectedCount > 0 && `(${selectedCount})`}</span>
      </button>

      <button
        onClick={clearFilters}
        className="w-full mt-2 px-4 py-3 bg-gray-500 text-white rounded-lg shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 flex items-center justify-center space-x-2 transition-colors font-medium"
      >
        <X className="w-5 h-5" />
        <span>Clear Filters</span>
      </button>
    </div>
  );

  // Domain filter options component with search functionality
  const DomainFilterOptions = ({
    filter,
    isSelected,
    toggleOption
  }: {
    filter: FilterOption;
    isSelected: (filterTitle: string, option: string) => boolean;
    toggleOption: (filterTitle: string, option: string) => void;
  }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const filteredOptions = filter.options.filter(option =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <div className="pt-2 space-y-2">
        <input
          type="text"
          placeholder="Search Domain..."
          className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        {filteredOptions.length > 0 ? (
          filteredOptions.map((option) => (
            <label
              key={option}
              className="flex items-center space-x-3 cursor-pointer hover:bg-gray-50 p-2 rounded"
            >
              <input
                type="checkbox"
                checked={isSelected(filter.title, option)}
                onChange={() => toggleOption(filter.title, option)}
                className="w-4 h-4 border-2 border-gray-300 rounded cursor-pointer focus:ring-2 focus:ring-blue-500 focus:outline-none checked:bg-blue-500 checked:border-blue-500"
              />
              <span className="text-sm text-gray-700">{option}</span>
            </label>
          ))
        ) : (
          <div className="text-sm text-gray-500">No options found.</div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Desktop View */}
      <div className="hidden md:block p-4 space-y-4 w-64 bg-gradient-to-br from-blue-50 to-white border-r border-green-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
          <Filter className="w-5 h-5 text-green-600" />
          Filter Jobs
        </h2>
        <FilterContent />
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 right-6 z-40 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl hover:scale-110 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
        >
          <Filter className="w-6 h-6 animate-pulse hover:animate-none" />
        </button>

        {isOpen && (
          <div className="fixed inset-0 z-50">
            <div
              className="absolute inset-0 bg-black bg-opacity-50"
              onClick={() => setIsOpen(false)}
            />
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-white flex flex-col">
              <div className="flex justify-between items-center p-4 border-b border-green-200 bg-white">
                <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                  <Filter className="w-5 h-5 text-green-600" />
                  Filter Jobs
                </h2>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="text-gray-700 w-6 h-6" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">
                <FilterContent />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
