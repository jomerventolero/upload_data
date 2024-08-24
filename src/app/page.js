"use client"
import React, {useEffect, useState} from 'react';
import Papa from "papaparse";

const Home = () => {

  const [memberList, setMemberList] = useState([])

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = e.target.file_upload.files[0]

    Papa.parse(file, {
      header: true,
      complete: function(results) {
        setMemberList(results.data)
      }}
    )
  }

  useEffect(() => {
    if(memberList.length) {
      fetch('http://ec2-13-55-235-138.ap-southeast-2.compute.amazonaws.com:8055/flows/trigger/e02394e9-2a4b-4ba2-9f3b-afa3f126d17b', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberList),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('Success:', data);
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  }, [memberList])


  return (
    <>
      <div className="max-w-3xl mx-auto mt-16 h-screen">
        <div className="">
          <div className="md:col-span-1">
            <div className="px-4 sm:px-0 mb-10">
              <h3 className="text-lg font-medium leading-6 text-gray-900">Add Member Data</h3>
              <p className="mt-1 text-sm text-gray-600">
                Quickly add list of multiple member data by uploading CSV file
              </p>
            </div>
          </div>
          <div className="mt-5 md:col-span-2 md:mt-0">
            <form action="#" method="POST" onSubmit={e => handleSubmit(e)}>
              <div className="shadow sm:overflow-hidden sm:rounded-md">
                <div className="space-y-6 bg-white px-4 py-5 sm:p-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Your csv file</label>
                    <div className="mt-1 flex justify-center rounded-md border-2 border-dashed border-gray-300 px-6 pt-5 pb-6">
                      <div className="space-y-1 text-center">
                        <svg
                          className="mx-auto h-12 w-12 text-gray-400"
                          stroke="currentColor"
                          fill="none"
                          viewBox="0 0 48 48"
                          aria-hidden="true"
                        >
                          <path
                            d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                            strokeWidth={2}
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                        <div className="flex text-sm text-gray-600">
                          <label
                            htmlFor="file_upload"
                            className="relative cursor-pointer rounded-md bg-white font-medium text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:text-indigo-500"
                          >
                            <span>Upload a file</span>
                            <input id="file_upload" name="file_upload" type="file" className="sr-only" />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-gray-500">CSV up to 10MB</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;