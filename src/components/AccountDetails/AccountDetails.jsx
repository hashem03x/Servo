import React, { useEffect, useState } from 'react'
import styles from './AccountDetails.module.css';
import { useLanguage } from '../../contexts/LanguageContext';
import { toast } from 'react-toastify';

export default function AccountDetails() {
  const { langValue } = useLanguage();
  const [macAddress, setMacAddress] = useState("");
  const [isSubscribed, setIsSubscribed] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  //////////////////////START GET FAQS////////////////////////////////
  const getAccountDetails = async () => {

    try {
      const response = await fetch(`https://novatv.onrender.com/user/userInfo`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'authorization': `novON0${localStorage.getItem('authToken')}`
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMacAddress(data.macAddress)
        setIsSubscribed(data.isSubscribed)
        setStartDate(data.startDate)
        setEndDate(data.endDate)
        console.log(data);

      } else {
        switch (response.status) {
          case 500:
            toast.error(data.message, {
              theme: "dark"
            });
            break;
          default:
            toast('An error occurred. Please try again.',{
              theme : 'dark'
            });
        }
      }

    } catch (err) {
      console.error("Error Saving Content:", err);
    } finally {
    }
  };
  useEffect(() => {
    getAccountDetails()
  }, [])
  ////////////////////////END GET FAQS//////////////////////////////// 
  useEffect(() => { }, [])
  return (
    <>
      <div className='max-w-lg w-full'>
        <h1 className="text-[#3C3C3C] text-3xl font-bold mb-5">{langValue['AccountDetailstTitle']}</h1>

        <div className="AccInfo flex flex-col gap-3 mt-16">
          <div className="macAddress AccDetails">
            <span className='text-[#3C3C3C] text-xl font-bold'>Mac Address:</span>
            <span className='text-[#3C3C3C] font-medium'>{macAddress ? macAddress : '-'}</span>
          </div>
          <div className="Status AccDetails">
            <span className='text-[#3C3C3C] text-xl font-bold'>{langValue['Status']}:</span>
            <span className={`font-medium ${isSubscribed ? 'text-[#07C548]' : 'text-red-500'}`}>
              {isSubscribed ? 'Active' : 'Inactive'}</span>
          </div>
          <div className="creationDate AccDetails">
            <span className='text-[#3C3C3C] text-xl font-bold'>{langValue['CreationDate']}:</span>
            <span className='text-[#3C3C3C] font-medium'>{startDate ? startDate : '-'}</span>
          </div>
          <div className="ExpirationDate AccDetails">
            <span className='text-[#3C3C3C] text-xl font-bold'>{langValue['ExpirationDate']}:</span>
            <span className='text-[#3C3C3C] font-medium'>{endDate ? endDate : '-'}</span>
          </div>
        </div>
      </div>
    </>
  )
}
