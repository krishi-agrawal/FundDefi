'use client'
import React, { useState, useContext } from 'react';
import { FormState } from './Form.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeading, faPenAlt } from '@fortawesome/free-solid-svg-icons';

const FormLeftWrapper = () => {
    const Handler = useContext(FormState)


    return (
        <div className="p-6 bg-white rounded-lg shadow-md space-y-6">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                    Campaign Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={Handler.form.title}
                    onChange={Handler.FormHandler}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline"
                    placeholder="Enter your campaign title"
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="story">
                    <FontAwesomeIcon icon={faPenAlt} className="mr-2" /> Campaign Story
                </label>
                <textarea
                    id="story"
                    name="story"
                    value={Handler.form.story}
                    onChange={Handler.FormHandler}
                    className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-400 focus:shadow-outline"
                    placeholder="Enter your campaign story"
                    rows="8" // Increased size
                ></textarea>
            </div>
        </div>
    
    

    );
};

export default FormLeftWrapper;