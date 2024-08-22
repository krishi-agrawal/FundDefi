'use client'
import React, { useState, useContext } from 'react';
import { FormState } from './Form.jsx';

const FormLeftWrapper = () => {
    const Handler = useContext(FormState)


    return (
        <div className="p-6 bg-med-blu rounded shadow-md">
            <h2 className="text-2xl font-bold mb-4  text-offwhite text-gray-700">Create a Campaign</h2>
            <div className="mb-4">
                <label className="block text-gray-700  text-offwhite text-sm font-bold mb-2" htmlFor="title">
                    Campaign Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={Handler.form.title}
                    onChange={Handler.FormHandler}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your campaign title"
                />
            </div>
            <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="story">
                    Campaign Story
                </label>
                <textarea
                    id="story"
                    name="story"
                    value={Handler.form.story}
                    onChange={Handler.FormHandler}
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    placeholder="Enter your campaign story"
                    rows="4"
                ></textarea>
            </div>
        </div>
    );
};

export default FormLeftWrapper;
