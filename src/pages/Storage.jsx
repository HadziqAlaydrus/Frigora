import React from 'react'
import StorageCard from '../components/StorageCard'
import CreateButton from '../components/CreateButton';
import Chabot from '../components/Chabot';


const Storage = () => {
  return (
    <div>
      <CreateButton/>
      <StorageCard/>
      <Chabot/>
    </div>
  )
}

export default Storage;
