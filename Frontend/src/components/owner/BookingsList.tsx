import React, { useMemo, useState , useEffect } from "react";
import { Booking } from "../../types/Booking";
import Table from "./Table";
import { Search } from "lucide-react";
import { useDebouncedValue } from "../../hooks/useDebouncedValue";


const fields = [
  { label: "Name", key: "name" },
  { label: "Phone", key: "phone" },
  { label: "Pickup Stop", key: "pickupStops" },
  { label: "Drop Stop", key: "dropStops" },
  {
    label: "Status",
    key: "status",
    render: (row) => (
      <span
        className={`inline-flex rounded-full px-3 py-1 text-sm ${
          row.status === "success"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {row.status}
      </span>
    ),
  },
  {
    label: "Total Seats",
    key: "seatsBooked",
    render: (row) => row.seatsBooked.length,
  },
  {
    label: "Amount",
    key: "totalAmount",
    render: (row) => `₹${row.totalAmount}`,
  },
];

interface BookingsListProps {
  booking: Booking[];
}

export const BookingsList: React.FC<BookingsListProps> = ({ booking }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearch = useDebouncedValue(searchQuery, 500);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 3;

  useEffect(() => {
    setCurrentPage(1); // Reset pagination when search term changes
  }, [debouncedSearch]);

  // Filter bookings
  const filteredBookings = useMemo(() => {
    return booking.filter((b) =>
      b.name.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      b.phone.includes(debouncedSearch) ||
      b.status.toLowerCase().includes(debouncedSearch.toLowerCase())
    );
  }, [booking, debouncedSearch]);

  // Paginate
  const paginatedBookings = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBookings.slice(start, start + itemsPerPage);
  }, [filteredBookings, currentPage]);

  const totalPages = 2;

  const bookingWithIds = paginatedBookings.map((b) => ({
    id: b.userId,
    ...b,
  }));

  if (!booking || booking.length === 0) {
    return <p>No bookings available</p>;
  }

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex items-center gap-2 border p-2 rounded-md w-full max-w-md">
        <Search className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, phone, or status"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          }}
          className="w-full focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white shadow">
        <table className="w-full table-fixed divide-y divide-gray-200">
          <Table data={bookingWithIds} fields={fields} />
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

      {/* Pagination Controls */}
      {/* <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>

        <span className="text-sm text-gray-600">
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Next
        </button>
      </div> */}
    </div>
  );
};
