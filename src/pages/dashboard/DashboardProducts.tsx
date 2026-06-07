import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminFetchProducts,
  adminUpdateProduct,
  deleteProductImage,
  uploadProductImage,
} from "../../supabase/adminService";
import type { Product } from "../../@types";

const empty = { title: "", price: "", stock: "" };

const DashboardProducts = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: adminFetchProducts,
  });

  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingCurrentImageUrl, setEditingCurrentImageUrl] = useState<string | null>(null);

  // Image state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5MB.");
      return;
    }
    setUploadError(null);
    setImageFile(file);
    setRemoveImage(false);
    setImagePreview(URL.createObjectURL(file));
  };

  // Resolve final image_url before saving
  const resolveImageUrl = async (): Promise<string | null> => {
    if (imageFile) return await uploadProductImage(imageFile);
    if (removeImage) return null;
    return editingCurrentImageUrl ?? null;
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const image_url = await resolveImageUrl();
      await adminCreateProduct({
        title: form.title,
        price: Number(form.price),
        stock: Number(form.stock),
        image_url,
      });
    },
    onSuccess: () => {
      invalidate();
      setForm(empty);
      setImageFile(null);
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      // If replacing image, delete old one first
      if (imageFile && editingCurrentImageUrl) {
        await deleteProductImage(editingCurrentImageUrl).catch(() => {});
      }
      const image_url = await resolveImageUrl();
      await adminUpdateProduct(editingId!, {
        title: form.title,
        price: Number(form.price),
        stock: Number(form.stock),
        image_url,
      });
    },
    onSuccess: () => {
      invalidate();
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminDeleteProduct(id),
    onSuccess: invalidate,
  });

  const resetForm = () => {
    setForm(empty);
    setEditingId(null);
    setEditingCurrentImageUrl(null);
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
    setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setEditingCurrentImageUrl(p.image_url);
    setForm({
      title: p.title,
      price: String(p.price),
      stock: String(p.stock),
    });
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.stock) return;
    // On create, image is required
    if (!editingId && !imageFile) {
      setUploadError("Please select a product image.");
      return;
    }
    editingId ? updateMutation.mutate() : createMutation.mutate();
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  // What image to show in the preview area
  const displayImage = imagePreview ?? (removeImage ? null : editingCurrentImageUrl);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Products</h1>
        {!isLoading && (
          <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
            {products.length} total
          </span>
        )}
      </div>

      {/* ── Form ── */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl border p-6 flex flex-col gap-4"
      >
        <h2 className="font-medium text-sm">
          {editingId ? "Edit product" : "Add product"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Title"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm col-span-2"
          />
          <input
            placeholder="Price"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Stock"
            type="number"
            min="0"
            required
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm"
          />
        </div>

        {/* Image upload */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-medium text-gray-600">
            {editingId
              ? "Product image — select a new file to replace"
              : "Product image (required, max 5MB)"}
          </label>

          <div className="flex items-start gap-4">
            {/* Preview box */}
            <div className="w-24 h-24 border-2 border-dashed rounded-xl flex items-center justify-center bg-gray-50 shrink-0 overflow-hidden">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt="preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl text-gray-300">🖼</span>
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="text-sm file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-black file:text-white file:text-xs file:cursor-pointer cursor-pointer"
              />
              {uploadError && (
                <p className="text-red-500 text-xs">{uploadError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting
              ? "Saving..."
              : editingId
              ? "Save changes"
              : "Add product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="border px-5 py-2 rounded-lg text-sm cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ── Table ── */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">No products yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium w-16">Image</th>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className={`hover:bg-gray-50 ${editingId === p.id ? "bg-blue-50" : ""}`}
                >
                  <td className="px-4 py-3">
                    {p.image_url ? (
                      <img
                        src={p.image_url}
                        alt={p.title}
                        className="w-10 h-10 object-cover rounded-lg"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-300 text-lg">
                        🖼
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium">{p.title}</td>
                  <td className="px-4 py-3">${p.price}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-xs border px-3 py-1 rounded-lg hover:bg-gray-100 cursor-pointer"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(p.id)}
                        disabled={deleteMutation.isPending}
                        className="text-xs border border-red-200 text-red-500 px-3 py-1 rounded-lg hover:bg-red-50 disabled:opacity-50 cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default DashboardProducts;
