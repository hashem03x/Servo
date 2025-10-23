import React, { useEffect, useState } from 'react'
import styles from './TermsCondition.module.css';
import { FloatingWhatsApp } from 'react-floating-whatsapp';
import whatsapp from '../../assets/Image/novalogo.png';
import { toast } from 'react-toastify';

export default function TermsCondition() {
  const [editorHtml, setEditorHtml] = useState('');
  const getTermsCondition = async () => {

    try {
      const response = await fetch(`https://novatv.onrender.com/footerContent/get?page=Terms_Conditions`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        console.log(data);
        
        toast.success(data.message, {
          theme: "dark"
        });
        setEditorHtml(data.footerContent.content)
        console.log(data.footerContent.content);

      } else {
        switch (response.status) {
          case 500:
            toast.error(data.message, {
              theme: "dark"
            });
            break;
          default:
            toast('An error occurred. Please try again.');
        }
      }

    } catch (err) {
      console.error("Error Saving Content:", err);
    } finally {
     
    }
  };
  useEffect(() => {
    getTermsCondition()
  }, [])
  return (
    <>
      <div class={`${styles.term_conditions_parent}`}>
        <div class={`${styles.term_conditions}`}>

        </div>
        <main class={`${styles.content}`}>
        <div dangerouslySetInnerHTML={{ __html: editorHtml }} />
        </main>
        <FloatingWhatsApp phoneNumber="+1234567890"
          accountName="NovaTV"
          avatar={whatsapp}
          statusMessage="Typically replies within 1 hour"
          chatMessage="Hello! How can we help you?"
          allowEsc
          allowClickAway
          className='text-black w-[18rem]'
          placeholder='Send Us Your Proplem'>
        </FloatingWhatsApp>
      </div></>
  )
}
