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
import { ImagePlus, Pencil, Trash2 } from "lucide-react";

const empty = { title: "", price: "", stock: "" };

const inp =
  "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-gray-400 transition-colors bg-white";

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
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setUploadError("Please select an image file."); return; }
    if (file.size > 5 * 1024 * 1024) { setUploadError("Image must be under 5 MB."); return; }
    setUploadError(null);
    setImageFile(file);
    setRemoveImage(false);
    setImagePreview(URL.createObjectURL(file));
  };

  const resolveImageUrl = async (): Promise<string | null> => {
    if (imageFile) return await uploadProductImage(imageFile);
    if (removeImage) return null;
    return editingCurrentImageUrl ?? null;
  };

  const createMutation = useMutation({
    mutationFn: async () => {
      const image_url = await resolveImageUrl();
      await adminCreateProduct({ title: form.title, price: Number(form.price), stock: Number(form.stock), image_url });
    },
    onSuccess: () => { invalidate(); setForm(empty); setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ""; },
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (imageFile && editingCurrentImageUrl) await deleteProductImage(editingCurrentImageUrl).catch(() => {});
      const image_url = await resolveImageUrl();
      await adminUpdateProduct(editingId!, { title: form.title, price: Number(form.price), stock: Number(form.stock), image_url });
    },
    onSuccess: () => { invalidate(); resetForm(); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminDeleteProduct(id),
    onSuccess: invalidate,
  });

  const resetForm = () => {
    setForm(empty); setEditingId(null); setEditingCurrentImageUrl(null);
    setImageFile(null); setImagePreview(null); setRemoveImage(false); setUploadError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const startEdit = (p: Product) => {
    setEditingId(p.id); setEditingCurrentImageUrl(p.image_url);
    setForm({ title: p.title, price: String(p.price), stock: String(p.stock) });
    setImageFile(null); setImagePreview(null); setRemoveImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.stock) return;
    if (!editingId && !imageFile) { setUploadError("Please select a product image."); return; }
    editingId ? updateMutation.mutate() : createMutation.mutate();
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const displayImage = imagePreview ?? (removeImage ? null : editingCurrentImageUrl);

  return (
    <div className="flex flex-col gap-6">

      {/* ── Form card ── */}
      <div className="bg-white rounded-2xl p-6 flex flex-col gap-5">
        <h2 className="font-bold text-gray-800 text-base">
          {editingId ? "Edit Product" : "Add New Product"}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              placeholder="Product title"
              required
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
              className={`${inp} col-span-2`}
            />
            <input
              placeholder="Price (€)"
              type="number" min="0" step="0.01" required
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              className={inp}
            />
            <input
              placeholder="Stock quantity"
              type="number" min="0" required
              value={form.stock}
              onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
              className={inp}
            />
          </div>

          {/* Image */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 shrink-0 flex items-center justify-center">
              {displayImage
                ? <img src={displayImage} alt="preview" className="w-full h-full object-cover" />
                : <ImagePlus className="w-5 h-5 text-gray-300" />
              }
            </div>
            <div className="flex flex-col gap-1">
              <label className="cursor-pointer text-xs font-semibold text-white bg-gray-800 hover:bg-gray-700 transition-colors px-4 py-2 rounded-lg w-fit">
                Choose image
                <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
              </label>
              <p className="text-xs text-gray-400">
                {imageFile ? imageFile.name : editingId ? "Pick a new file to replace" : "Required, max 5 MB"}
              </p>
              {uploadError && <p className="text-xs text-red-500">{uploadError}</p>}
            </div>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Saving..." : editingId ? "Save changes" : "Add product"}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="border border-gray-200 text-gray-600 text-sm px-5 py-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* ── Table card ── */}
      <div className="bg-white rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center gap-2">
          <h3 className="font-bold text-gray-800 text-base">All Products</h3>
          {!isLoading && (
            <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-2 py-0.5 rounded-full">
              {products.length}
            </span>
          )}
        </div>

        {isLoading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : products.length === 0 ? (
          <p className="text-gray-400 text-sm p-6">No products yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide w-16">Image</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Title</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Price</th>
                <th className="text-left px-5 py-3 text-xs text-gray-400 font-semibold uppercase tracking-wide">Stock</th>
                <th className="px-5 py-3 w-20" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((p) => (
                <tr key={p.id} className={`transition-colors ${editingId === p.id ? "bg-blue-50" : "hover:bg-gray-50"}`}>
                  <td className="px-5 py-3">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                      {p.image_url
                        ? <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                        : <div className="w-full h-full flex items-center justify-center text-gray-300 text-lg">🌸</div>
                      }
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium text-gray-800">{p.title}</td>
                  <td className="px-5 py-3 text-gray-600">{p.price} €</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                      p.stock === 0 ? "bg-red-100 text-red-500"
                        : p.stock <= 3 ? "bg-amber-100 text-amber-600"
                        : "bg-green-100 text-green-600"
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-3">
                      <button onClick={() => startEdit(p)} className="text-gray-400 hover:text-gray-700 transition-colors cursor-pointer" aria-label="Edit">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => deleteMutation.mutate(p.id)} disabled={deleteMutation.isPending} className="text-gray-400 hover:text-red-500 transition-colors disabled:opacity-40 cursor-pointer" aria-label="Delete">
                        <Trash2 className="w-4 h-4" />
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
