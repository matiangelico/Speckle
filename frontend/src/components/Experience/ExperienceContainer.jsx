//import UploadVideo from "./subirVideos";
//import DefaultValuesManager from "./DefaultValuesManager";

import { useState } from "react";
// import { useDispatch } from "react-redux";


import UploadVideo from "./UploadVideoState";
import SelectDescriptors from "./SelectDescriptorsState";
import EditHyperparameters from "./EditHyperparametersState";
import SelectResults from "./SelectResultsState";

import "../../../styles/Experience.css";

import SecondaryButton from '../common/SecondaryButton';

import NewExperienceIcon from '../../assets/svg/icon-lus-circle.svg?react';

const ExperienceContainer = () => {
  // const dispatch = useDispatch();

  const [currentState, setCurrentState] = useState("UPLOAD_VIDEO");
  const [sharedData, setSharedData] = useState({
    video: null,
    descriptors: [],
    hyperparameters: {},
  });

  const renderState = () => {
    switch (currentState) {
      case "UPLOAD_VIDEO":
        return (
          <UploadVideo
            data={sharedData}
            setData={setSharedData}
            onNext={() => setCurrentState("SELECT_DESCRIPTORS")}
          />
        );
      case "SELECT_DESCRIPTORS":
        return (
          <SelectDescriptors
            data={sharedData}
            setData={setSharedData}
            onNext={() => setCurrentState("EDIT_HYPERPARAMETERS")}
            onBack={() => setCurrentState("UPLOAD_VIDEO")}
          />
        );
      case "EDIT_HYPERPARAMETERS":
        return (
          <EditHyperparameters
            data={sharedData}
            setData={setSharedData}
            onNext={() => setCurrentState("SELECT_RESULTS")}
            onBack={() => setCurrentState("SELECT_DESCRIPTORS")}
          />
        );
      case "SELECT_RESULTS":
        return (
          <SelectResults
            data={sharedData}
            setData={setSharedData}
            onBack={() => setCurrentState("EDIT_HYPERPARAMETERS")}
          />
        );
      default:
        return null;
    }
  };

  return (
    <main className='experience-container'>
      <div className='experience-header'>
        <h1>Contenido Principal</h1>
        <p>27 de octubre de 2024, 20:33 </p>
        <SecondaryButton SVG={NewExperienceIcon} text={"Nueva experiencia"}/>
      </div>
      <div className='experience-content'>
        {renderState()}
      </div>
    </main>
  );
};

export default ExperienceContainer;
