'use client'
import React, { useState, createContext, useEffect } from 'react';
import FormLeftWrapper from './FormLeftWrapper.jsx';
import FormRightWrapper from './FormRightWrapper.jsx'
import { TailSpin } from 'react-loader-spinner';
import { toast } from "react-toastify"
import { ethers } from 'ethers';
import CampaignCollection from "../../../artifacts/contracts/Campaign.sol/CampaignCollection.json"

const FormState = createContext()

const Form = () => {

  const [form, setForm] = useState({
    title: '',
    story: '',
    requiredAmt: '',
    category: '',
  })
  const FormHandler = (e) => {
    const { name, value } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: value
    }));
    console.log(`Updated form field: ${name}, value: ${value}`); // Log the updated form field
  };


  const [image, setImage] = useState(null)
  const ImageHandler = (e) => {
    setImage(e.target.files[0])
  }
  const [loading, setLoading] = useState(false)
  const [uploaded, setUploaded] = useState(false)
  const [address, setAddress] = useState("")

  const [storyUrl, setStoryUrl] = useState();
  const [imageUrl, setImageUrl] = useState();

  const startCampaign = async (e) => {
    e.preventDefault()
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    if (form.title == '') { toast.warn("Campaign Title field is empty.") }
    else if (form.story == '') { toast.warn("Campaign Story field is empty.") }
    else if (form.requiredAmt == '') { toast.warn("Required fund amount not added.") }
    else if (uploaded == false) { toast.warn("Image not uploaded.") }
    else {
      setLoading(true)
      console.log("Contract Address: ", process.env.NEXT_PUBLIC_ADDRESS);
      console.log("Contract ABI: ", CampaignCollection.abi);

      const contract = new ethers.Contract(process.env.NEXT_PUBLIC_ADDRESS, CampaignCollection.abi, signer)
      const reqAmtInEther = ethers.utils.parseEther(form.requiredAmt)
      console.log("Title: ", form.title);
      console.log("Required Amount: ", reqAmtInEther);
      console.log("Image URL: ", imageUrl);
      console.log("Story URL: ", storyUrl);
      console.log("Category: ", form.category);
      const campaignData = await contract.createCampaign(
        form.title,
        reqAmtInEther,
        imageUrl,
        form.category,
        storyUrl
      )

      await campaignData.wait()
      console.log("campaignData: ", campaignData)
      setAddress(campaignData.to)
    }
  }

  useEffect(() => {
    console.log(image)
  }, [image])
  useEffect(() => {
    console.log("storyUrl: " + storyUrl)
  }, [storyUrl])
  useEffect(() => {
    console.log("imageUrl: ", imageUrl)
  }, [imageUrl])
  useEffect(() => {
    console.log("category: ", form.category)
  }, [form.category])
  

  return (
    <FormState.Provider value={{ form, setForm, image, setImage, ImageHandler, FormHandler, setStoryUrl, setImageUrl, setAddress, setUploaded, startCampaign }}>
      <div className="min-h-screen  flex items-center justify-center relative bg-white">
        <div className="container mx-auto p-6 ">
          {loading == true ?
            address == "" ?
              <div className='flex justify-center '>
                <TailSpin height={60} color='black' />
              </div>
              :
              <div className='text-blue-500'>
                <h1>Fundraiser Campaign started successfully!</h1>
                <p>{address}</p>
                <button className='border border-black'>Go to Campaign</button>
              </div>
            :

            <div className="bg-transparent backdrop-blur-md rounded-lg shadow-lg p-8 flex flex-col md:flex-row">
              <div className="w-full md:w-1/2 p-4">
                <FormLeftWrapper />
              </div>
              <div className="w-full md:w-1/2 p-4">
                <FormRightWrapper />
              </div>
            </div>
          }
        </div>
      </div>
    </FormState.Provider>
  );
};

export default Form;
export { FormState };
