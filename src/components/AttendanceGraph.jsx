import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Calendar } from "lucide-react";

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
const rows = [200, 150, 100, 50, 10];

// Sample heatmap data
const heatmapData = [
  [2, 3, 1, 3, 4, 2],
  [4, 3, 2, 3, 2, 1],
  [3, 2, 4, 3, 2, 4],
  [1, 4, 3, 2, 3, 2],
  [4, 3, 2, 1, 4, 3],
];

const shades = ["#E3F2FD", "#BBDEFB", "#90CAF9", "#42A5F5", "#1E88E5"];

const AttendanceReport = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="bg-white p-6 rounded-xl shadow-md w-full border-t-4 border-blue-500">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Attendance Report</h2>

        {/* Date Picker */}
        <div className="flex items-center border px-3 py-2 rounded-lg text-gray-700 cursor-pointer">
          <Calendar className="w-5 h-5 text-gray-500 mr-2" />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="dd MMMM yyyy"
            className="outline-none cursor-pointer"
          />
        </div>
      </div>

      {/* Attendance Summary */}
      <div className="grid grid-cols-4 gap-6 text-center mb-6">
        <div>
          <p className="text-3xl font-bold">173</p>
          <p className="text-sm text-gray-500">Total Employees</p>
        </div>
        <div>
          <p className="text-3xl font-bold">128</p>
          <p className="text-sm text-gray-500">On Time</p>
        </div>
        <div>
          <p className="text-3xl font-bold">21</p>
          <p className="text-sm text-gray-500">Absent</p>
        </div>
        <div>
          <p className="text-3xl font-bold">24</p>
          <p className="text-sm text-gray-500">Late</p>
        </div>
      </div>

      {/* Attendance Heatmap */}
      <div className="grid grid-cols-7 gap-1 items-center w-full">
        {heatmapData.map((row, rowIndex) => (
          <React.Fragment key={rowIndex}>
            <p className="text-sm text-gray-500 self-center">{rows[rowIndex]}</p>
            {row.map((value, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className="h-10 w-10 rounded-md"
                style={{ backgroundColor: shades[value - 1] }}
              />
            ))}
          </React.Fragment>
        ))}
        <div className="col-span-1"></div>
        {months.map((month, index) => (
          <p key={index} className="text-center text-sm text-gray-500">
            {month}
          </p>
        ))}
      </div>
    </div>
  );
};

export default AttendanceReport;
