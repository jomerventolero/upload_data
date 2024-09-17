"use client"
import React, { useEffect, useState } from 'react';
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid"
import axios from "axios";


const Home = () => {
  const [memberList, setMemberList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [status, setStatus] = useState("");
  const url = "https://revive-recovery.com/flows/trigger/e02394e9-2a4b-4ba2-9f3b-afa3f126d17b";

  const handleSubmit = (e) => {
    e.preventDefault();
    const file = e.target.file_upload.files[0];
    

    Papa.parse(file, {
      header: true,
      complete: function (results) {
        setMemberList(results.data);
      }
    });
    
  };


  useEffect(() => {
    if (memberList.length) {
      // Filter out empty or incomplete entries before transforming the list
      const cleanedList = memberList.filter(member => member.first_name && member.id);
  
      // Transform the filtered data to match the second list format
      const transformedList = cleanedList.map(member => ({
        first_name: member.first_name,
        surname: member.surname,
        member_no: member.member_no,
        total_fees_due: member.total_fees_due,
        membership: member.membership,
        joined_on: member.joined_on,
        due_on: member.due_on,
        id: member.id,
        status: member.status,
        user_created: member.user_created || null,
        date_created: member.date_created,
        user_updated: member.user_updated || null,
        date_updated: member.date_updated,
        mobile_telephone: member.mobile_telephone,
        admin_fees: member.admin_fees,
        membership_fees_due: member.membership_fees_due,
        paid_to: member.paid_to || null,
        grace_period: member.grace_period || null,
        note: member.note || null,
        day_88: member.day_88,
        gym_branch: member.gym_branch,
        communication_attempt: member.communication_attempt || null,
      }));
  
      console.log(JSON.stringify(transformedList));
  
      // Use Axios to send the POST request
      axios.post(url, transformedList, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.lengthComputable) {
            const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentage);
          }
        }
      })
      .then((response) => {
        console.log('Success:', response.data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
    }
  }, [memberList]);


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
            <form action="#" method="POST" onSubmit={(e) => handleSubmit(e)} className={`${uploadProgress && "blur-lg"}`}>
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
            {uploadProgress > 0 && (
                    <div className="bg-white px-4 py-4 rounded-lg flex flex-col gap-2 fixed justify-start top-2">
                      <div className="flex flex-row gap-2">
                        <progress className="self-center rounded-lg w-full" value={uploadProgress} max="100"> </progress>
                        <p className="text-lg font-bold px-2">{uploadProgress}%</p>
                      </div>
                      {uploadProgress < 100 ? <p className="text-lg font-bold px-2">Processing...</p> : <p>Successfully Uploaded!</p>}
                      <code className="bg-slate-800 text-white p-2 rounded-lg overflow-y-scroll max-h-[80vh] w-[800px] scroll-smooth">
                        <table className="w-full">
                          <tr className="border-[2px] border-slate-400">
                            <th className="border-[2px] border-slate-400">First Name</th>
                            <th className="border-[2px] border-slate-400">Last Name</th>
                            <th className="border-[2px] border-slate-400">Gym Branch</th>
                            <th className="border-[2px] border-slate-400">Status</th>
                          </tr>
                        {memberList.map((member, index) => (
                          <tr className="border-[2px] border-slate-400" tabIndex={index}>
                            <td className="border-[2px] border-slate-400 p-1">{member.first_name}</td>
                            <td className="border-[2px] border-slate-400 p-1">{member.surname}</td>
                            <td className="border-[2px] border-slate-400 p-1">{member["gym_branch.name"]}</td>
                            <td className="border-[2px] border-slate-400 p-1">{member.status}</td>
                          </tr>
                        ))}
                        </table>
                      </code>
                      <div className="flex flex-row gap-2">
                        <a className="bg-violet-600 text-white p-2 rounded-lg cursor-pointer w-full flex justify-center" href="https://revive-recovery.com"><p>Back</p></a>
                        <a className="bg-violet-200 text-violet-800 font-semibold p-2 rounded-lg cursor-pointer w-full flex justify-center" onClick={() => {setUploadProgress(0)}}><p>Upload again</p></a>
                      </div>
                      <p className="text-sm text-gray-500 text-center">© 2024 Revive Recovery - Anytime Fitness SEB Group</p>
                    </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
