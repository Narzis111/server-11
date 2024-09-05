import PropTypes from 'prop-types'
import { Fragment, useState } from 'react'
import {
  Dialog,
  Listbox,
  Transition,
  TransitionChild,
  DialogTitle,
  DialogPanel,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
} from '@headlessui/react'
import { BsCheckLg } from 'react-icons/bs'
import { AiOutlineDown } from 'react-icons/ai'

const allReviews = ['Winner', 'Pending', 'Participator']

const MarkModal = ({ setIsOpen, isOpen, modalHandler, booking }) => {
  const [selected, setSelected] = useState(booking.review_status)

  const handleUpdate = () => {
    modalHandler(booking._id, selected)
  }

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-10'
        onClose={() => setIsOpen(false)}
      >
        <TransitionChild
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </TransitionChild>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <TransitionChild
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <DialogPanel className='w-full h-56 max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <DialogTitle
                  as='h3'
                  className='text-lg font-medium text-center leading-6 text-gray-900'
                >
                  Update Result
                </DialogTitle>
                <div className='mt-4 w-full'>
                  <Listbox value={selected} onChange={setSelected}>
                    <div className='relative mt-1'>
                      <ListboxButton className='relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'>
                        <span className='block truncate'>{selected}</span>
                        <span className='pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2'>
                          <AiOutlineDown
                            className='h-5 w-5 text-gray-400'
                            aria-hidden='true'
                          />
                        </span>
                      </ListboxButton>
                      <Transition
                        as={Fragment}
                        leave='transition ease-in duration-100'
                        leaveFrom='opacity-100'
                        leaveTo='opacity-0'
                      >
                        <ListboxOptions className='absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'>
                          {allReviews.map((review_status, review_statusIdx) => (
                            <ListboxOption
                              key={review_statusIdx}
                              className='relative cursor-default select-none py-2 pl-10 pr-4 text-gray-900 data-[focus]:bg-amber-100  data-[focus]:text-amber-900'
                              value={review_status}
                            >
                              {({ selected }) => (
                                <>
                                  <span
                                    className={`block truncate ${
                                      selected ? 'font-medium' : 'font-normal'
                                    }`}
                                  >
                                    {review_status}
                                  </span>
                                  {selected ? (
                                    <span className='absolute inset-y-0 left-0 flex items-center pl-3 text-amber-600'>
                                      <BsCheckLg
                                        className='h-5 w-5'
                                        aria-hidden='true'
                                      />
                                    </span>
                                  ) : null}
                                </>
                              )}
                            </ListboxOption>
                          ))}
                        </ListboxOptions>
                      </Transition>
                    </div>
                  </Listbox>
                </div>
                <hr className='mt-16 ' />

                <div className='flex mt-2 justify-center gap-5'>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-green-100 px-4 py-2 text-sm font-medium text-green-900 hover:bg-green-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-500 focus-visible:ring-offset-2'
                    onClick={handleUpdate}
                  >
                    Update
                  </button>
                  <button
                    type='button'
                    className='inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2'
                    onClick={() => setIsOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

MarkModal.propTypes = {
  booking: PropTypes.object.isRequired,
  modalHandler: PropTypes.func.isRequired,
  setIsOpen: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
}

export default MarkModal
// ==========================
import { useMutation, useQuery } from "@tanstack/react-query";
import useAuth from "../../../../hooks/useAuth/useAuth";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import LoadingSpinner from "../../../../components/LoadingSpinner/LoadingSpinner";
import { useState } from "react";
import Iframe from "react-iframe";
import { PiFileMagnifyingGlass } from "react-icons/pi";
import { toast } from "react-toastify";
import MarkModal from "../../MarkModal/MarkModal";


const ContestSubmitted = () => {
 
    const { user } = useAuth()
    const axiosSecure = useAxiosSecure()
    const [isOpen, setIsOpen] = useState(false)
    const [showPreview, setShowPreview] = useState(false);
    const handleEyeClick = () => {
        setShowPreview(true);


    };


    const handleClosePreview = () => {
        setShowPreview(false);


    };
    //   Fetch  Data
    const {
        data: bookings = [], isLoading, refetch } = useQuery({
            queryKey: ['myContestSubmitted', user?.email],
            queryFn: async () => {
                const { data } = await axiosSecure.get(`/myContestSubmitted/${user?.email}`)


                return data
            },
        })
        console.log(bookings);


 
    const { mutateAsync } = useMutation({
        mutationFn: async ({ id, reviewStatus }) => {
            const { data } = await axiosSecure.patch(
                `/updateReviewStatus/${id}`,
                { review_status: reviewStatus }
            )
            return data
        },
        onSuccess: data => {
            refetch()
            console.log(data)
            toast.success('Result updated successfully!')
            setIsOpen(false)
        },
    })


    //   modal handler
   
        const modalHandler = async (id, selected) => {
            try {
                await mutateAsync({ id, reviewStatus: selected });
            } catch (err) {
                console.log(err);
                toast.error(err.message);
            }
        };
   
    if (isLoading) return <LoadingSpinner />




    return (
<div>
    submitted : {bookings.length}
    <div>
        <h2 className="text-xl font-semibold text-center">Number of Submission against your Created Contest: {bookings.length}</h2>


        <div className="overflow-x-auto">
            <table className="table table-zebra">
                {/* head */}
                <thead>
                    <tr>


                        <th>Image</th>
                        <th>Title</th>
                        <th>Submitted By</th>
                        <th>Submitted Document</th>
                        <th>Action</th>


                    </tr>
                </thead>
<tbody>


    {bookings.map((booking) => <tr key={booking._id}>
        <td><div className="w-14 h-14">
            <img src={booking.image} alt="" />
        </div></td>
        <td>{booking.contestName}</td>
        <td>{booking.user_email}</td>
        <td><button className="ml-6 bg-purple-200" onClick={handleEyeClick}>
            <PiFileMagnifyingGlass className="text-2xl text-purple-700"></PiFileMagnifyingGlass>
        </button>
            {showPreview && (
                <div className="preview-overlay" onClick={handleClosePreview}>
                    <div className="preview-container">
                        {/* Render iframe with the PDF/DOC file */}
                        <Iframe title="Document Preview" src={booking.submit_doc} width="100%" height="100%" />
                    </div>
                </div>
            )}
            </td>


        <td className='px-5 py-5 border-b border-gray-200 bg-white text-sm'>
            <button
                onClick={() => setIsOpen(true)}
                className='relative cursor-pointer inline-block px-3 py-1 font-semibold text-green-900 leading-tight'
            >
                <span
                    aria-hidden='true'
                    className='absolute inset-0 bg-green-200 opacity-50 rounded-full'
                ></span>
                <span className='relative'>Update Result </span>
            </button>
            {/* Update Modal */}
            <MarkModal
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                modalHandler={(selected) => modalHandler(booking._id, selected)}
                booking={booking}
           />
        </td>




    </tr>)}


</tbody>
            </table>
        </div>
    </div>
</div>
    );


};


export default ContestSubmitted;
// ===============================================
app.patch('/updateReviewStatus/:id', async (req, res) => {
    const id = req.params.id;
    const { review_status } = req.body;

    const filter = { _id: new ObjectId(id) };
    const updateDoc = {
        $set: {
            review_status: review_status
        }
    };

    try {
        const result = await bookingsCollection.updateOne(filter, updateDoc);
        if (result.modifiedCount === 1) {
            res.status(200).send({ message: 'Review status updated successfully' });
        } else {
            res.status(404).send({ message: 'Booking not found' });
        }
    } catch (err) {
        res.status(500).send({ message: 'Error updating review status', error: err.message });
    }
});
