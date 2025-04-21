import React , {useEffect,useState} from 'react';
import { Plus, MapPin, X , Search} from 'lucide-react';
import { RouteData } from '../../types/Route';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Table from './Table';
import { fetchAllRoutes } from '../../api/ownerApi';
import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { useDebouncedValue } from "../../hooks/useDebouncedValue";

interface RouteFormValues {
  source: string;
  destination: string;
  distance: string;
  estimatedTime: string;
  dropStops:string,
  pickupStops: string;
}

const fields = [
  { label: 'Source', key: 'source', isEditable: true },
  { label: 'Destination', key: 'destination', isEditable: true },
  { label: 'Distance (km)', key: 'distance', isEditable: true, render: (route) => `${route.distance} km` },
  { label: 'Time (hrs)', key: 'estimatedTime', isEditable: true, render: (route) => `${route.estimatedTime} hrs` },
  { label: 'Stops', key: 'pickupStops', isEditable: true, render: (route) => route.pickupStops?.join(' → ') },
];

interface RouteListProps {
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
  newRoute: RouteFormValues;
  handleSubmit: (values: RouteFormValues) => Promise<void>;
  handleEditSource: (route: RouteData) => void;
  handleEditDestination: (route: RouteData) => void;
  handleAddDropStops: (route: RouteData) => void;
  handleAddPickupStops: (route: RouteData) => void;
  handleEditDistance: (route: RouteData) => void;
  handleEditEstimatedTime: (route: RouteData) => void;
  handleDelete: (routeId: string) => void;
}

// Update validation schema
const RouteSchema = Yup.object().shape({
  source: Yup.string()
    .trim()
    .matches(/^[^\s].*$/, 'Source cannot start with a space')
    .matches(/^[A-Za-z\s]+$/, 'Source must contain only letters')
    .required('Source is required'),
  destination: Yup.string()
    .trim()
    .matches(/^[^\s].*$/, 'Destination cannot start with a space')
    .matches(/^[A-Za-z\s]+$/, 'Destination must contain only letters')
    .required('Destination is required'),
  distance: Yup.string()
    .required('Distance is required')
    .test('is-valid-number', 'Must be a number greater than 0', value => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    }),
  estimatedTime: Yup.string()
    .required('Estimated time is required')
    .test('is-valid-number', 'Must be a number greater than 0', value => {
      const num = parseFloat(value);
      return !isNaN(num) && num > 0;
    }),
  pickupStops: Yup.string()
    .required('pickup Stops are required')
    .test('valid-stops', 'Must contain at least one stop', value => {
      if (!value) return false;
      const stopsArray = value.split(',').map(stop => stop.trim());
      return stopsArray.length > 0 && stopsArray.every(stop => stop.length > 0);
    }),
  dropStops: Yup.string()
    .required('drop Stops are required')
    .test('valid-stops', 'Must contain at least one stop', value => {
      if (!value) return false;
      const stopsArray = value.split(',').map(stop => stop.trim());
      return stopsArray.length > 0 && stopsArray.every(stop => stop.length > 0);
    })
});

export const RouteList: React.FC<RouteListProps> = ({

  isModalOpen,
  setIsModalOpen,
  newRoute,
  handleSubmit,
  handleEditSource,
  handleEditDestination,
  handleAddDropStops,
  handleAddPickupStops,
  handleEditDistance,
  handleEditEstimatedTime,
  handleDelete,
}) => {

  const [routes, setRoutes] = useState<RouteData[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
    const debouncedSearch = useDebouncedValue(searchTerm, 500);
   const ownerId = useSelector((state: RootState) => state.user.id);
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  // const [totalPages, setTotalPages] = useState(1);
  const totalPages = 1;

  const fetchRoutes = async () => {
    try {
      const res = await fetchAllRoutes(ownerId, searchTerm, page, limit);
      setRoutes(res.routes); 
      // setTotalPages(res.totalPages); 
    } catch (error) {
      console.error('Error fetching routes:', error);
    }
  };
  

  useEffect(() => {
      setPage(1); // Reset to first page when search changes
    }, [debouncedSearch]);
  
  useEffect(() => {
    fetchRoutes();
  }, [searchTerm, page,  ownerId]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Route List</h2>
        </div>
        <div className="relative w-full max-w-md">
        <input
          type="text"
          placeholder="Search routes..."
          value={searchTerm}
          onChange={(e) => {
            setPage(1);
            setSearchTerm(e.target.value);
          }}
          className="w-full rounded-md border border-gray-300 px-4 py-2 pr-10 focus:outline-none"
        />
        <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-500" />
      </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          <Plus className="h-5 w-5" />
          Add New Route
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-xl font-bold">Add New Route</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-500 hover:text-gray-700">
                <X className="h-6 w-6" />
              </button>
            </div>
            <Formik
              initialValues={newRoute}
              validationSchema={RouteSchema}
              onSubmit={handleSubmit}
            >
              {({isSubmitting}) => (
                <Form className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Source</label>
                    <Field
                      type="text"
                      name="source"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage name="source" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Destination</label>
                    <Field
                      type="text"
                      name="destination"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                    />
                    <ErrorMessage name="destination" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Distance (km)</label>
                    <Field
                      type="number"
                      name="distance"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      step="0.1"
                    />
                    <ErrorMessage name="distance" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Estimated Time (hours)</label>
                    <Field
                      type="number"
                      name="estimatedTime"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      step="0.5"
                    />
                    <ErrorMessage name="estimatedTime" component="div" className="text-red-500 text-sm mt-1" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Pickup Stops (comma-separated)
                    </label>
                    <Field
                      type="text"
                      name="pickupStops"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      placeholder="Stop 1, Stop 2, Stop 3"
                    />
                    <ErrorMessage name="pickupStops" component="div" className="text-red-500 text-sm mt-1" />
                    <p className="mt-1 text-sm text-gray-500">
                      Enter multiple stops separated by commas. 
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Drop Stops (comma-separated)
                    </label>
                    <Field
                      type="text"
                      name="dropStops"
                      className="mt-1 block w-full rounded-md border border-gray-300 p-2"
                      placeholder="Stop 1, Stop 2, Stop 3"
                    />
                    <ErrorMessage name="dropStops" component="div" className="text-red-500 text-sm mt-1" />
                    <p className="mt-1 text-sm text-gray-500">
                      Enter multiple stops separated by commas. 
                    </p>
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
                      Save Route
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
     
        <table className="min-w-full divide-y divide-gray-200">

          <Table data={routes}
  fields={fields}
  onEdit={(field, route) => {
    if (field === 'source') handleEditSource(route);
    else if (field === 'destination') handleEditDestination(route);
    else if (field === 'distance') handleEditDistance(route);
    else if (field === 'estimatedTime') handleEditEstimatedTime(route);
    else if (field === 'pickupStops') handleAddDropStops(route);
  }}
  onDelete={handleDelete} />
          
        </table>
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
          page {page} 
          </div>
          <div className="flex gap-2">
            <button
              className="px-3 py-1 border border-gray-200 rounded text-sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border border-gray-200 rounded text-sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        
      </div>
      </div>
    </div>
  );
};