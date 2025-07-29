import React, { useEffect, useState } from 'react'
import { useAuth, useUser } from '@clerk/clerk-react'
import { Heart } from 'lucide-react'
import { dummyPublishedCreationData } from '../assets/assets'
import axios from 'axios'
import toast from 'react-hot-toast';

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

const Community = () => {
  const [creations, setCreations] = useState([])
  const { user } = useUser()
        const [loading, setLoading] = useState(true);
                const { getToken } = useAuth();

  

  const fetchCreations = async ()=>{

try {

const {data} = await axios.get('/api/user/get-published-creations', {

headers: {Authorization: `Bearer ${await getToken()}`}

})

if (data.success) {

setCreations(data.creations)

}else{

toast.error(data.message)

}

} catch (error) {

toast.error(error.message)

}



setLoading(false)

}

const imageLikeToggle= async (id)=>{

try {

const {data} = await axios.post('/api/user/toggle-like-creation', {id}, {

headers: {Authorization:`Bearer ${await getToken()}`}

})
if (data.success) {

toast.success(data.message)

await fetchCreations()

}else{

toast.error(data.message)

}

} catch (error) {

toast.error(error.message)

}}

  useEffect(() => {
    if (user) {
      fetchCreations()
    }
  }, [user])

  return !loading?(
    <div className='flex-1 h-full flex flex-col gap-4 p-6'>
      <h2 className='text-xl font-semibold text-slate-700'>Creations</h2>

      <div className='bg-white h-full w-full rounded-xl overflow-y-scroll flex flex-wrap gap-4 p-4'>
        {creations.map((creation, index) => (
          <div
            key={index}
            className='relative group w-full sm:max-w-[48%] lg:max-w-[30%] rounded-lg overflow-hidden'
          >
            <img
              src={creation.content}
              alt="Generated"
              className='w-full h-64 object-cover rounded-lg'
            />

            <div className='absolute inset-0 flex flex-col justify-end gap-2 p-3 
              bg-gradient-to-b from-transparent to-black/80 text-white opacity-0 
              group-hover:opacity-100 transition-opacity rounded-lg'>
              
              <p className='text-sm'>{creation.prompt}</p>

              <div className='flex justify-between items-center'>
                <p className='text-sm'>{creation.likes.length} </p>
                <Heart onClick={()=>imageLikeToggle(creation.id)}
                  className={`w-5 h-5 hover:scale-110 cursor-pointer transition-transform ${
                    creation.likes.includes(user?.id)
                      ? 'fill-red-500 text-red-600'
                      : 'text-white'
                  }`}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  ):(
    <div
    className='
    flex justify-center items-center h-full
    '><span className='w-10 h-10 my-1 rounded-full border-3 
    border-primary border-t-transparent animate-spin'></span></div>
  )
}

export default Community
