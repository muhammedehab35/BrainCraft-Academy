// import React from 'react'
// import AdvancedJobSearch from '../_components/AdvancedJobSearch'
// import AvailableJobsByLocation from '../_components/AvailableJobsByLocation'

// const page = () => {
//   return (
//     <main className="min-h-screen bg-gray-50">
//       <AdvancedJobSearch />
//       <AvailableJobsByLocation />
//     </main>
//   )
// }

// export default page
// "use client"
// import React, { useState } from 'react';
// import AdvancedJobSearch from '../_components/AdvancedJobSearch';
// import AvailableJobsByLocation from '../_components/AvailableJobsByLocation';

// const Page = () => {
//   const [isSearchActive, setIsSearchActive] = useState(false);

//   const handleSearch = (active) => {
//     setIsSearchActive(active);
//   };

//   return (
//     <main className="min-h-screen bg-gray-50">
//       <AdvancedJobSearch onSearch={handleSearch} />
//       {!isSearchActive && <AvailableJobsByLocation />}
//     </main>
//   );
// };

// export default Page;


// page.js
"use client"
import React, { useState } from 'react';
import AdvancedJobSearch from '../_components/AdvancedJobSearch';
import AvailableJobsByLocation from '../_components/AvailableJobsByLocation';

const Page = () => {
  // State to manage the visibility of components
  const [isSearchActive, setIsSearchActive] = useState(false);

  // This handler will be called when a search is performed
  const handleSearch = (active) => {
    setIsSearchActive(active);
  };

  return (
    <main className=" bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Search Section */}
        
        
        <AdvancedJobSearch onSearch={handleSearch} />

      {/* Available Jobs Section - shown only when no search is active */}
      {!isSearchActive && (
        <section className="mt-8 pb-16">

          <AvailableJobsByLocation />
        </section>
      )}
    </main>
  );
};

export default Page;