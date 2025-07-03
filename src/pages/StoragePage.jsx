import React, { useState } from "react";
import Category from "../components/Category";
import StorageCard from "../components/StorageCard";
import CreateButton from "../components/CreateButton";
import Chabot from "../components/Chabot";


const StoragePage = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategorySelect = (category) => {
    // toggle: jika klik yang sama, maka reset
    setSelectedCategory((prev) => (prev === category ? null : category));
  };

  return (
    <div className="min-h-screen">
      <div className="flex flex-row-reverse items-center">
        <CreateButton />
        <Category
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
      </div>
      <StorageCard selectedCategory={selectedCategory} />
      <Chabot />
    </div>
  );
};

export default StoragePage;
