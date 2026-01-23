import axios from "axios";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";

type FormValues = {
  name: string;
  credit: number;
  category: string;
  teacher: string;
};

// VALIDATE
const schema = z.object({
  name: z.string().min(3, "Tên ít nhất 3 ký tự").max(50),
  credit: z.coerce.number().min(1, "Tối thiểu 1").max(10, "Tối đa 10"),
  category: z.string().min(1, "Không được để trống"),
  teacher: z.string().min(1, "Không được để trống"),
});

function Edit() {
  const navigate = useNavigate();
  const { id } = useParams(); // 👉 lấy id từ URL

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // 🔹 Lấy dữ liệu chi tiết theo id
  useEffect(() => {
    if (!id) return;

    const getDetail = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:3000/courses/${id}`
        );

        // set data vào form
        setValue("name", data.name);
        setValue("credit", data.credit);
        setValue("category", data.category);
        setValue("teacher", data.teacher);
      } catch (error) {
        console.log(error);
      }
    };

    getDetail();
  }, [id, setValue]);

  // 🔹 Submit cập nhật
  const onSubmit = async (values: FormValues) => {
    try {
      await axios.put(
        `http://localhost:3000/courses/${id}`,
        values
      );
      alert("Cập nhật thành công");
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-semibold mb-6">Sửa khóa học</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* NAME */}
        <div>
          <input
            {...register("name")}
            placeholder="Tên khóa học"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.name && (
            <p className="text-red-500 text-sm">{errors.name.message}</p>
          )}
        </div>

        {/* CREDIT */}
        <div>
          <input
            type="number"
            {...register("credit")}
            placeholder="Số tín chỉ"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.credit && (
            <p className="text-red-500 text-sm">{errors.credit.message}</p>
          )}
        </div>

        {/* CATEGORY */}
        <div>
          <input
            {...register("category")}
            placeholder="Danh mục"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.category && (
            <p className="text-red-500 text-sm">
              {errors.category.message}
            </p>
          )}
        </div>

        {/* TEACHER */}
        <div>
          <input
            {...register("teacher")}
            placeholder="Giảng viên"
            className="w-full border px-3 py-2 rounded"
          />
          {errors.teacher && (
            <p className="text-red-500 text-sm">
              {errors.teacher.message}
            </p>
          )}
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Cập nhật
          </button>

        </div>
      </form>
    </div>
  );
}

export default Edit;
