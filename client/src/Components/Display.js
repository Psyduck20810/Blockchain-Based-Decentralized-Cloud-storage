import React, { useState } from 'react'
import backup from './PdfImage.jpg'
const Display = ({account, contract}) => {
  const[data, setData] = useState(null)

  const getData = async() =>{
    const inputLink = document.querySelector('#inputLink').value;
    let dataArray;

    try {

      if(inputLink){
        //if inputLink contains an address it means user wants to fetch data of another address
        dataArray = await contract.display(inputLink)
      }else{
        //usres own data
        dataArray = await contract.display(account)
      }

      //basically the links are stored in blockchain
      console.log(dataArray)
      const isEmpty = Object.keys(dataArray).length === 0;

    if(!isEmpty){
      const image = dataArray.map((element, i) => {
        return (
          <a href={element} key={i} style={{ margin: "1rem" }} target="_blank">
            <img
              src={element}
              alt="new"
              style={{ height: "133px", width: "200px" }}
              onError={(e) => {
                // Handle image loading error here
                console.log(`Image ${i} failed to load`);
                // Replace the image with a PDF viewer or any other content
                e.target.src = backup; // Replace with the path to your PDF viewer image
              }}
            />
          </a>
        );
      });
      setData(image)
    }else{
      alert("No image to Display")
    }
    } catch (error) {
      alert("Don't have permission")
    }

  
  }
  return (
    <div>
      <div className='flex justify-center border border-r-0 border-l-0 border-gray-900 bg-gray-900'>
      <h2 className="mb-4 text-3xl font-extrabold leading-none tracking-tight text-gray-900 md:text-3xl dark:text-white"><span class="text-gray-100 dark:text-gray-100 mt-1">View Section</span></h2>
      </div>
      <div>
      <input type="text" id="inputLink" placeholder='Enter Adress or keep blank for viewing you own files' className="bg-gray-50 border border-gray-300 text-gray-900 text-sm mt-3 rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
      <button
        type="submit"
        onClick={getData}
        className="inline-flex items-center mt-2 rounded-md bg-black px-3 mx-3 py-2 text-sm font-semibold text-white hover:bg-black/80"
      >
        View Data
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="ml-2 h-4 w-4"
        >
          <line x1="5" y1="12" x2="19" y2="12"></line>
          <polyline points="12 5 19 12 12 19"></polyline>
        </svg>
      </button>
      
      </div>
      <hr/>
      {data&& <h1 className='text-md text-white rounded-md mt-3 font-bold bg-gray-600'>Uploaded Data</h1>}
      <div className=' grid grid-cols-3 bg-gray-100 overflow-auto max-h-96'>
        
        {data}
        </div>
    </div>
  )
}

export default Display