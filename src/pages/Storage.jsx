import React, { useState } from "react";
import StorageCard from "../components/StorageCard";
import CreateButton from "../components/CreateButton";
import Chabot from "../components/Chabot";
import Category from "../components/Category";

const Storage = () => {
  return (
    <div className="min-h-screen">
      <CreateButton />
      <StorageCard/>
     <Chabot />
    </div>
  );
};

export default Storage;
