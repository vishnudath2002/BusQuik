import React from "react";


interface Route {
  id: string;
  [key: string]: any;
}

interface Field {
  label: string;
  key: string;
  isEditable?: boolean;
  render?: (route: Route) => React.ReactNode;
}

interface RoutesTableProps {
  data: Route[];
  fields: Field[];
  onEdit?: (fieldKey: string, route: Route) => void;
  onDelete?: (id: string) => void;
}

const Table: React.FC<RoutesTableProps> = ({ data, fields, onEdit, onDelete }) => {
   

  return (
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {fields.map((field) => (
            <th
              key={field.key}
              scope="col"
              className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              {field.label}
            </th>
          ))}
          {onDelete && (
            <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
              Actions
            </th>
          )}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 bg-white">
        {data.map((route) => (
          <tr key={route.id} className="hover:bg-gray-50">
            {fields.map((field) => (
              <td key={field.key} className="whitespace-nowrap px-6 py-4">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-gray-900">
                    {field.render ? field.render(route) : route[field.key]}
                  </span>
                  {field.isEditable && onEdit && (
                    <button
                      className="text-blue-500 hover:text-blue-700"
                      onClick={() => onEdit(field.key, route)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-5 h-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M15.232 5.232l3.536 3.536M9 12l6-6 3 3-6 6H9v-3z"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </td>
            ))}
            {onDelete && (
              <td className="px-6 py-4">
                <button
                  className="text-red-500 hover:text-red-700"
                  onClick={() => onDelete(route.id)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Table;
