import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

type Course = {
  id: number;
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

const PAGE_SIZE = 5;

function List() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [teacher, setTeacher] = useState("");
  const [page, setPage] = useState(1);

  
  useEffect(() => {
    const getAll = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/courses");
        setCourses(data);
      } catch (error) {
        console.log(error);
      }
    };
    getAll();
  }, []);

 
  const handleDelete = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn xóa?")) return;

    try {
      await axios.delete(`http://localhost:3000/courses/${id}`);
      setCourses(courses.filter((item) => item.id !== id));
      alert("Xóa thành công");
    } catch (error) {
      console.log(error);
    }
  };

 
  const filteredCourses = courses.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.teacher.toLowerCase().includes(teacher.toLowerCase())
  );


  const totalPage = Math.ceil(filteredCourses.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const paginatedCourses = filteredCourses.slice(
    start,
    start + PAGE_SIZE
  );

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-semibold">Danh sách khóa học</h1>
        <Link
          to="/add"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Thêm
        </Link>
      </div>

      
      <div className="flex gap-4 mb-4">
        <input
          placeholder="Tìm theo tên"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />

        <input
          placeholder="Lọc theo giảng viên"
          value={teacher}
          onChange={(e) => setTeacher(e.target.value)}
          className="border px-3 py-2 rounded w-1/3"
        />
      </div>

   
      <table className="w-full border">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-2 py-1">ID</th>
            <th className="border px-2 py-1">Name</th>
            <th className="border px-2 py-1">Credit</th>
            <th className="border px-2 py-1">Category</th>
            <th className="border px-2 py-1">Teacher</th>
            <th className="border px-2 py-1">Action</th>
          </tr>
        </thead>
        <tbody>
          {paginatedCourses.map((item) => (
            <tr key={item.id}>
              <td className="border px-2 py-1">{item.id}</td>
              <td className="border px-2 py-1">{item.name}</td>
              <td className="border px-2 py-1">{item.credit}</td>
              <td className="border px-2 py-1">{item.category}</td>
              <td className="border px-2 py-1">{item.teacher}</td>
              <td className="border px-2 py-1 flex gap-2">
                <Link
                  to={`/edit/${item.id}`}
                  className="text-blue-600"
                >
                  Sửa
                </Link>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600"
                >
                  Xóa
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
      <div className="flex gap-2 mt-4">
        {Array.from({ length: totalPage }).map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i + 1)}
            className={`px-3 py-1 border rounded ${
              page === i + 1 ? "bg-blue-600 text-white" : ""
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}

export default List;
