'use client';

import React, { useState } from 'react';
import { collegeNames } from '../utils/collegeNameUtils';
import { Input } from '@/components/ui/input';
import { Button } from './ui/button';

const Navbar: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredColleges, setFilteredColleges] = useState(collegeNames);

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchTerm(value);

    // Filter colleges based on search term
    setFilteredColleges(
        collegeNames.filter((collegeNames) =>
            collegeNames.toLowerCase().includes(value.toLowerCase())
      )
    );
  };

  return (
    <nav className="flex items-center justify-between p-4 bg-white shadow-md">
      {/* Left: Logo */}
      <div className="flex items-center space-x-4">
        <div className="logo">Logo</div>
      </div>

      {/* Middle: College Search Dropdown */}
      <div className="relative w-1/3 ">
        <Input
          value={searchTerm}
          onChange={handleSearch}
          placeholder="Search Colleges..."
          className="w-full rounded border border-gray-300 p-2"
        />
        {searchTerm && (
          <div className="absolute z-10 w-full bg-white text-black shadow-lg max-h-48 overflow-auto">
            {filteredColleges.map((college, index) => (
              <div
                key={index}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => {
                  setSearchTerm(college);
                  setFilteredColleges([]);
                }}
              >
                {college}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Right: Predictor and User Icon */}
      <div className="flex items-center space-x-4">
        <Button>News</Button>
        <Button>College Predictor</Button>
        <Button>LogIn</Button>

      </div>
    </nav>
  );
};

export default Navbar;
