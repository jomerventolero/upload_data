"use client"
import React, { useEffect, useState } from 'react';
import Papa from "papaparse";
import { v4 as uuidv4 } from "uuid"
import axios from "axios";
import Sidebar from '@/components/Sidebar/page';


const Home = () => {
  const [memberList, setMemberList] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [processedMembers, setProcessedMembers] = useState([]);


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

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  function currentDateTime() {
    const datetime = new Date();
    const formattedDate = datetime.toISOString();
    return formattedDate;
  }

  function toDateISOString(dateOrig) {
    const date = new Date(dateOrig);
    if (isNaN(date.getTime())) {
      throw Error ("Invalid Date Format!")
    }
    return date.toISOString();
  }

  function gymSelector(gym_id) {
    const gymMap = {
      BER: "BER",
      BRO: "BRKV",
      CMA: "CAB",
      CMR: "CRO",
      CRA: "CRAN",
      DEE: "DEE",
      FFE: "FFE",
      FFW: "FFW",
      LAN: "LANE",
      MLY: "MAN",
      MOV: "MONA",
      PAK: "PKM",
      SKA: "STK",
      WEP: "WEP"
    };
  
    const prefix = gym_id.substring(0, 3);
    return gymMap[prefix] || "";
  }

  function totalDues(admin_fees, membership_fees) {
    return parseFloat(admin_fees) + parseFloat(membership_fees);
  }

  useEffect(() => {
    if (memberList.length) {
      const checkAndUploadMembers = async () => {
        for (const member of memberList) {
          try {
            const { first_name, surname } = member;
  
            // Step 1: Check if the member exists via Directus API (GET request)
            const existingMemberResponse = await axios.get('https://revive-recovery.com/items/current_members', {
              params: {
                filter: {
                  first_name: { _eq: first_name },
                  surname: { _eq: surname }
                }
              }
            });
  
            const transformedMember = {
              id: uuidv4() || member.id,
              first_name: member.first_name || null,
              surname: member.surname || null,
              member_no: member.member_no || null,
              total_fees_due: totalDues(member.admin_fees, member.membership_fees_due),
              membership: member.membership || null,
              joined_on: toDateISOString(member.joined_on) || null,
              due_on: toDateISOString(member.due_on) || null,
              status: "published",
              user_created: null,
              date_created: currentDateTime(),
              user_updated: null,
              date_updated: currentDateTime(),
              mobile_telephone: member.mobile_telephone || null,
              admin_fees: member.admin_fees,
              membership_fees_due: member.membership_fees_due,
              paid_to: member.paid_to || null,
              grace_period: member.grace_period || null,
              note: member.note || null,
              day_88: addDays(member.due_on, 88),
              gym_branch: gymSelector(member.member_no),
              communication_attempt: member.communication_attempt || null,
            };
  
            if (existingMemberResponse.data.data.length > 0) {
              // Member exists, update their data
              const existingMemberId = existingMemberResponse.data.data[0].id;
              await axios.patch(`https://revive-recovery.com/items/current_members/${existingMemberId}`, transformedMember);
              setProcessedMembers(prev => [...prev, { ...member, status: 'Updated' }]);
              console.log(`Updated Member: ${member.first_name} ${member.surname} - Member No: ${member.member_no}`)
            } else {
              // Member doesn't exist, add new member
              await axios.post(`https://revive-recovery.com/items/current_members/`, transformedMember);
              setProcessedMembers(prev => [...prev, { ...member, status: 'Created' }]);
              console.log(`Created Member: ${member.first_name} ${member.surname} - Member No: ${member.member_no}`)
            }
          } catch (error) {
            console.error(`Error with member ${member.first_name} ${member.surname}:`, error);
            //setProcessedMembers(prev => [...prev, { ...member, status: 'Error' }]);
          }
        }
      };
  
      checkAndUploadMembers();
    }
  }, [memberList]);
  

  return (
      <div className="max-w-3xl mx-auto mt-16 h-full w-full">
        <Sidebar />
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
            {processedMembers.length > 0 && (
              <div className="mt-8 overflow-y-scroll h-screen">
                <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Processed Members</h3>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member No</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {processedMembers.map((member, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">{`${member.first_name} ${member.surname}`}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{member.member_no}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.status === 'Updated' ? 'bg-green-100 text-green-800' :
                            member.status === 'Created' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
          </div>
        </div>
      </div>
  );
};

export default Home;
