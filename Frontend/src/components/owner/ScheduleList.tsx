/* eslint-disable no-unused-vars */
import React from 'react';
import { Plus, Clock, X, Search } from 'lucide-react';
import { formatTime } from '../../utils/FormateDateTime';
import { ScheduleData, BusData, RouteData } from '../../types/Schedule';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import DatePicker from "react-multi-date-picker";
import { User } from '../../types/User';
import Table from './Table';
import { useState } from 'react';
import { useMemo ,  useEffect } from 'react';
import { useDebouncedValue } from "../../hooks/useDebouncedValue";




interface ScheduleFormValues {
  price: string;
  startDates: string[];
  startTime: string;
  endTime: string;
  busId: string;
  routeId: string;
  operatorId: string;
}


interface ScheduleListProps {
  schedules: ScheduleData[];
  buses: BusData[];
  routes: RouteData[];
  operators: User[];
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  initialValues: ScheduleFormValues;
  validationSchema: any;
  onSubmit: (values: ScheduleFormValues) => Promise<void>;
  handleEditPrice: (Schedule: ScheduleData) => void;
  handleEditStartTime: (Schedule: ScheduleData) => void;
  handleEditEndTime: (Schedule: ScheduleData) => void;
  handleEditBus: (bus: BusData,schedule: ScheduleData, buses: BusData[]) => void;
  handleDelete: (scheduleId: string) => void;
  selectedDates: Date[];
  setSelectedDates: React.Dispatch<React.SetStateAction<Date[]>>;
}

export const ScheduleList: React.FC<ScheduleListProps> = ({
  schedules,
  buses,
  routes,
  operators,
  isModalOpen,
  setIsModalOpen,
  initialValues,
  validationSchema,
  onSubmit,
  handleEditPrice,
  handleEditStartTime,
  handleEditEndTime,
  handleEditBus,
  handleDelete,
  selectedDates,
  setSelectedDates,
}) => {

   const [searchQuery, setSearchQuery] = useState('');
   const debouncedSearch = useDebouncedValue(searchQuery, 500);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 2;


    useEffect(() => {
      setCurrentPage(1); // Reset pagination when search term changes
    }, [debouncedSearch]);


    

  const fields = [
    {
      label: "Price",
      key: "price",
      isEditable: true,
    },
    {
      label: "Start Time",
      key: "startTime",
      isEditable: true,
      render: (row) => formatTime(row.startTime),
    },
    {
      label: "End Time",
      key: "endTime",
      isEditable: true,
      render: (row) => formatTime(row.endTime),
    },
    {
      label: "Bus",
      key: "busId",
      isEditable: true,
      render: (row) => {
        const bus = buses.find((b) => b.id === row.busId);
        return bus?.name || "N/A";
      },
    },
    {
      label: "Operator",
      key: "operatorId",
      render: (row) => {
        const operator = operators.find((op) => op.id === row.operatorId);
        return operator?.name || "N/A";
      },
    },
    {
      label: "Status",
      key: "status",
    },
  ];



  const filteredSchedules = useMemo(() => {
    return schedules.filter(schedule => {
      const bus = buses.find(b => b.id === schedule.busId);
      const operator = operators.find(op => op.id === schedule.operatorId);
      const route = routes.find(rt => rt.id === schedule.routeId);
  
      return (
        schedule.price.toString().toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        schedule.status.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        formatTime(schedule.startTime).toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        formatTime(schedule.endTime).toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        (bus?.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ?? false) ||
        (operator?.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ?? false) ||
        (`${route?.source} - ${route?.destination}`.toLowerCase().includes(debouncedSearch.toLowerCase()) ?? false)
      );
    });
  }, [schedules, buses, routes, operators, debouncedSearch]);

    const paginatedSchedules = useMemo(() => {
      const start = (currentPage - 1) * itemsPerPage;
      return filteredSchedules.slice(start, start + itemsPerPage);
    }, [filteredSchedules, currentPage]);
  
    // const totalPages = Math.ceil(filteredBuses.length / itemsPerPage);
    const totalPages = 1;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Schedule List</h2>
        </div>
        <div className="flex items-center gap-2 border p-2 rounded-md w-full max-w-md">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, type or status"
          value={searchQuery}
          onChange={(e) =>setSearchQuery(e.target.value)
        }
          className="w-full focus:outline-none"
        />
      </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add New Schedule
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add New Schedule</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={onSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price</label>
                    <Field
                      type="number"
                      name="price"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage name="price" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Dates</label>
                    <DatePicker
                      multiple
                      value={selectedDates}
                      onChange={(dates: Date[]) => setSelectedDates(dates)}
                      inline
                    />
                    <ErrorMessage name="startDates" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Start Time</label>
                    <Field
                      type="time"
                      name="startTime"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage name="startTime" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">End Time</label>
                    <Field
                      type="time"
                      name="endTime"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage name="endTime" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Bus</label>
                    <Field
                      as="select"
                      name="busId"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="">Select a bus</option>
                      {buses.map((bus) => (
                        <option key={bus.id} value={bus.id}>
                          {bus.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="busId" component="div" className="text-red-500 text-sm mt-1" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Route</label>
                    <Field
                      as="select"
                      name="routeId"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="">Select a route</option>
                      {routes.map((route) => (
                        <option key={route.id} value={route.id}>
                          {route.source} - {route.destination}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="routeId" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">operator</label>
                    <Field
                      as="select"
                      name="operatorId"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    >
                      <option value="">Select a operator</option>
                      {operators.map((operator) => (
                        <option key={operator.id} value={operator.id}>
                          {operator.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage name="operatorId" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

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
                      Save Schedule
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <table className="min-w-full divide-y divide-gray-200">
        <Table
  data={paginatedSchedules}
  fields={fields}
  onEdit={(key, row) => {
    if (key === "price") handleEditPrice(row);
    else if (key === "startTime") handleEditStartTime(row);
    else if (key === "endTime") handleEditEndTime(row);
    else if (key === "busId") handleEditBus(row.busId, row, buses);
  }}
  onDelete={(id) => handleDelete(id)}
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