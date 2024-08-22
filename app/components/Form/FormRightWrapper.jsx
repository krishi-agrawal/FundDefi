import React, { useState, useContext } from 'react';
import { FormState } from './Form.jsx';
import { TailSpin } from 'react-loader-spinner';
import { toast } from 'react-toastify';
import axios from 'axios';

const FormRightWrapper = () => {
    const Handler = useContext(FormState);
    const [uploadLoading, setUploadLoading] = useState(false);
    const [uploaded, setUploaded] = useState(false);

    const apiKey = 'ce56d38541c926d147bb';
    const apiSecret = '1b040655db4d020934c8d37406e6bb2607b380d66869a118912be28620c9217f';
    const pinataBaseUrl = 'https://api.pinata.cloud/pinning/pinFileToIPFS';

    const uploadToPinata = async (file, fileName) => {
        const formData = new FormData();
        formData.append('file', file);

        const metadata = JSON.stringify({
            name: fileName,
        });
        formData.append('pinataMetadata', metadata);

        const options = JSON.stringify({
            cidVersion: 0,
        });
        formData.append('pinataOptions', options);

        try {
            const response = await axios.post(pinataBaseUrl, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    pinata_api_key: apiKey,
                    pinata_secret_api_key: apiSecret,
                },
            });
            return response.data;
        } catch (error) {
            console.error('Error uploading to Pinata:', error);
            throw error;
        }
    };

    const uploadFiles = async (e) => {
        e.preventDefault();
        setUploadLoading(true);
        console.log('Uploading files...');

        if (Handler.form.story !== "") {
            try {
                const storyBlob = new Blob([Handler.form.story], { type: 'text/plain' });
                const added = await uploadToPinata(storyBlob, 'story.txt');
                console.log('Story added:', added);
                Handler.setStoryUrl(`https://gateway.pinata.cloud/ipfs/${added.IpfsHash}`);
            } catch (error) {
                console.error('Error uploading story:', error);
                toast.warn('Error Uploading Story');
            }
        }

        if (Handler.image !== null) {
            try {
                const added = await uploadToPinata(Handler.image, Handler.image.name);
                console.log('Image added:', added);
                Handler.setImageUrl(`https://gateway.pinata.cloud/ipfs/${added.IpfsHash}`);
            } catch (error) {
                console.error('Error uploading image:', error);
                toast.warn('Error Uploading Image');
            }
        }

        setUploadLoading(false);
        setUploaded(true);
        Handler.setUploaded(true);
        toast.success('Files Uploaded Successfully');
    };


    return (
        <div className="p-6 bg-white rounded shadow-md">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="amount">
                    Required Amount
                </label>
                <input
                    type="number"
                    id="amount"
                    name="requiredAmt"
                    value={Handler.form.requiredAmt}
                    onChange={Handler.FormHandler}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter required amount"
                />
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="category">
                    Select Category
                </label>
                <select
                    id="category"
                    name="category"
                    value={Handler.form.category}
                    onChange={Handler.FormHandler}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                    <option value="" disabled>Select a category</option>
                    <option value="Education">Education</option>
                    <option value="Health">Health</option>
                    <option value="Environment">Environment</option>
                    <option value="Technology">Technology</option>
                    {/* Add more categories as needed */}
                </select>
            </div>
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="image">
                    Upload Image
                </label>
                <input
                    type="file"
                    id="image"
                    name='image'
                    onChange={Handler.ImageHandler}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                />
            </div>
            <div className="flex items-center justify-between">
                {uploadLoading ? (
                    <button className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                        <TailSpin color='#fff' height={20} />
                    </button>
                ) : (
                    uploaded ? (
                        <button className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" style={{ cursor: "no-drop" }}>
                            Files uploaded Successfully
                        </button>
                    ) : (
                        <button onClick={uploadFiles} className="text-white bg-blue-500 hover:bg-blue-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                            Upload Files to IPFS
                        </button>
                    )
                )}
                <button
                    type="submit"
                    onClick={Handler.startCampaign}
                    className="text-white bg-green-500 hover:bg-green-700 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                >
                    Start Campaign
                </button>
            </div>
        </div>
    );
};

export default FormRightWrapper;
