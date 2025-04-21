import React from 'react';
import { Bus, Plus, X ,Search } from 'lucide-react';
import { BusData } from '../../types/Bus';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Table from './Table';
import { useMemo } from 'react';
import { useState , useEffect } from 'react';
import { useDebouncedValue } from "../../hooks/useDebouncedValue";


const fields = [
  {
    label: "Bus Name",
    key: "name",
    width: "w-1/4",
    isEditable: true,
  },
  {
    label: "Type",
    key: "type",
    isEditable: true,
    render: (bus) => (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
          bus.type === "sleeper"
            ? "bg-purple-100 text-purple-800"
            : "bg-blue-100 text-blue-800"
        }`}
      >
        {bus.type}
      </span>
    ),
  },
  {
    label: "Status",
    key: "status",
    isEditable: true,
    render: (bus) => (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-sm font-semibold ${
          bus.status === "Active"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {bus.status}
      </span>
    ),
  },
  {
    label: "Total Seats",
    key: "seatsTotal",
    isEditable: false,
  },
];


interface BusListProps {
  buses: BusData[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  handleSubmit: (values: {
    name: string;
    type: 'seater' | 'sleeper';
    status: 'Active' | 'Inactive';
    ac: "true" | "false";
    fileBuffer: File;
    seatsTotal: string;
  }) => void;
  handleEditName: (bus: BusData) => void;
  handleEditType: (bus: BusData) => void;
  handleEditStatus: (bus: BusData) => void;
  handleEditTotalSeats: (bus: BusData) => void;
  handleDelete: (busId: string) => void;
}



export const BusList: React.FC<BusListProps> = ({
  buses,
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  handleEditName,
  handleEditType,
  handleEditStatus,
  // handleEditTotalSeats,
  handleDelete
}) => {

  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearch = useDebouncedValue(searchQuery, 500);
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;


  useEffect(() => {
    setCurrentPage(1); 
  }, [debouncedSearch]);
  
  


  const validationSchema = Yup.object({
    name: Yup.string()
    .required('Bus name is required')
    .trim('Bus name cannot include only spaces')
    .min(3, 'Bus name must be at least 3 characters')
    .max(50, 'Bus name must be at most 50 characters')
    .matches(/^[a-zA-Z0-9 _-]+$/, 'Only letters, numbers, spaces, dashes, and underscores are allowed')
    .notOneOf(['123', '456', '789'], 'Name cannot be purely numeric') // optional static check
    .test(
      'not-only-numbers',
      'Bus name cannot contain only numbers',
      (value) => !/^\d+$/.test(value || '')
    ),
    type: Yup.string()
      .required('Bus type is required')
      .oneOf(['seater', 'sleeper'], 'Invalid bus type'),
    status: Yup.string()
      .required('Status is required')
      .oneOf(['Active', 'Inactive'], 'Invalid status'),
    ac: Yup.string()
      .required('ac or not is required')
      .oneOf(["true", "false"], 'Invalid bus type'),
    seatsTotal: Yup.string()
    .required('Total seats is required')
    .matches(/^[1-9]\d*$/, 'Seats must be a positive integer greater than 0')
    .test(
      'within-range',
      'Seats must be between 10 and 100',
      (value) => {
        const num = Number(value);
        return num >= 10 && num <= 100;
      }
    )
    .test(
      'is-integer',
      'Seats must be a whole number',
      (value) => Number.isInteger(Number(value))
    ),
    // fileBuffer: Yup.string()
    //   .required('rc is required')
   
  });

  const initialValues = {
    name: '',
    type: 'seater' as const,
    status: 'Active' as const,
    ac: "true" as const,
    seatsTotal: '',
    fileBuffer: null
  };


  const filteredBuses = useMemo(() => {
    return buses.filter(bus =>
      bus.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      bus.type.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      bus.status.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [buses, debouncedSearch]);

  // Paginate filtered buses
  const paginatedBuses = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBuses.slice(start, start + itemsPerPage);
  }, [filteredBuses, currentPage]);

  // const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);
  const totalPages = 2;


  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bus className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Bus List</h2>
        </div>
        <div className="flex items-center gap-2 border p-2 rounded-md w-full max-w-md">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, type or status"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full focus:outline-none"
        />
      </div>
        <button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
          <Plus className="h-5 w-5" />
          Add New Bus
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add New Bus</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={(values, { resetForm }) => {
                handleSubmit(values);
                resetForm();
              }}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bus Name</label>
                    <Field
                      type="text"
                      name="name"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Type</label>
                    <Field
                      as="select"
                      name="type"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="seater">Seater</option>
                      <option value="sleeper">Sleeper</option>
                    </Field>
                    <ErrorMessage
                      name="type"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    <Field
                      as="select"
                      name="status"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                    </Field>
                    <ErrorMessage
                      name="status"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">AC</label>
                    <Field
                      as="select"
                      name="ac"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="true">yes</option>
                      <option value="false">No</option>
                    </Field>
                    <ErrorMessage
                      name="ac"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Total Seats</label>
                    <Field
                      type="number"
                      name="seatsTotal"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage
                      name="seatsTotal"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div>

                 

                  {/* <div>
                    <label className="block text-sm font-medium text-gray-700">Bus Name</label>
                    <Field
                      type="file"
                      name="fileBuffer"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage
                      name="fileBuffer"
                      component="div"
                      className="text-red-500 text-sm mt-1"
                    />
                  </div> */}

                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="rounded-md bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                    >
                      Save Bus
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

<div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
  <table className="w-full table-fixed divide-y divide-gray-200">
  <Table
  data={paginatedBuses}
  fields={fields}
  onEdit={(field, bus) => {
    if (field === "name") handleEditName(bus);
    else if (field === "type") handleEditType(bus);
    // else if (field === "seatsTotal") handleEditTotalSeats(bus);
    else if (field === "status") handleEditStatus(bus);
  }}
  onDelete={handleDelete}
  />
   <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
        <div className="text-sm text-gray-500">
        page {currentPage} 
        </div>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-200 rounded text-sm" onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>
          <button className="px-3 py-1 border border-gray-200 rounded text-sm" onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      </div>
  </table>
</div>

    </div>
  );
};