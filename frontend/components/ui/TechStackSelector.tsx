import React, { useState, useMemo } from 'react';

const ALL_TECH_STACKS = [
  'React', 'Node.js', 'Express', 'MongoDB', 'PostgreSQL', 'MySQL', 'Next.js', 
  'Vue.js', 'Angular', 'Svelte', 'TypeScript', 'JavaScript', 'Python', 'Django', 
  'Flask', 'FastAPI', 'Java', 'Spring Boot', 'C#', '.NET', 'C++', 'Go', 'Rust', 
  'Ruby', 'Ruby on Rails', 'PHP', 'Laravel', 'Docker', 'Kubernetes', 'AWS', 
  'Azure', 'GCP', 'Firebase', 'Supabase', 'GraphQL', 'REST API', 'Redis', 
  'Elasticsearch', 'Tailwind CSS', 'Sass', 'Figma', 'Git', 'CI/CD', 'Jenkins', 
  'GitHub Actions', 'Linux', 'Bash', 'Terraform', 'Ansible', 'Kafka', 'RabbitMQ'
].sort();

interface TechStackSelectorProps {
  selectedStacks: string[];
  onChange: (stacks: string[]) => void;
  disabled?: boolean;
}

export function TechStackSelector({ selectedStacks = [], onChange, disabled = false }: TechStackSelectorProps) {
  const [search, setSearch] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const filteredStacks = useMemo(() => {
    const lowerSearch = search.toLowerCase();
    return ALL_TECH_STACKS.filter(stack => 
      stack.toLowerCase().includes(lowerSearch) && !selectedStacks.includes(stack)
    );
  }, [search, selectedStacks]);

  const handleSelect = (stack: string) => {
    onChange([...selectedStacks, stack]);
    setSearch('');
  };

  const handleRemove = (stackToRemove: string) => {
    onChange(selectedStacks.filter(s => s !== stackToRemove));
  };

  return (
    <div className="relative font-sans">
      {/* Selected Chips */}
      <div className="flex flex-wrap gap-2 mb-3">
        {selectedStacks.map(stack => (
          <span 
            key={stack} 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-medium bg-black text-white dark:bg-white dark:text-black transition-all"
          >
            {stack}
            {!disabled && (
              <button 
                type="button" 
                onClick={() => handleRemove(stack)}
                className="hover:text-rose-400 focus:outline-none"
              >
                ×
              </button>
            )}
          </span>
        ))}
      </div>

      {/* Search Input */}
      {!disabled && (
        <div className="relative">
          <input
            type="text"
            placeholder="Search and add tech stack..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 text-sm dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all"
          />
          
          {/* Dropdown Menu */}
          {isOpen && search.length >= 0 && (
            <div className="absolute z-10 w-full mt-2 bg-white dark:bg-[#161522] border border-gray-200 dark:border-gray-800 rounded-xl shadow-lg max-h-60 overflow-y-auto">
              {filteredStacks.length > 0 ? (
                filteredStacks.map(stack => (
                  <button
                    key={stack}
                    type="button"
                    onMouseDown={(e) => {
                      e.preventDefault(); // Prevent onBlur
                      handleSelect(stack);
                    }}
                    className="w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-200 font-medium"
                  >
                    {stack}
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-gray-500 font-mono text-center">
                  NO MATCHES FOUND
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function TechStackBadge({ stack }: { stack: string }) {
  return (
    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700">
      {stack}
    </span>
  );
}


