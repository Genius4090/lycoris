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

// ── Shared input style ────────────────────────────────────────────────────────
const input =
  "border border-brownish bg-transparent px-3 py-2 text-sm font-liter text-title placeholder:text-title/40 outline-none focus:border-textish transition-colors w-full";

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
    if (!file.type.startsWith("image/")) {
      setUploadError("Please select an image file.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setUploadError("Image must be under 5 MB.");
      return;
    }
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
    onSuccess: () => { invalidate(); resetForm(); },
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
    setForm({ title: p.title, price: String(p.price), stock: String(p.stock) });
    setImageFile(null);
    setImagePreview(null);
    setRemoveImage(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.stock) return;
    if (!editingId && !imageFile) {
      setUploadError("Please select a product image.");
      return;
    }
    editingId ? updateMutation.mutate() : createMutation.mutate();
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;
  const displayImage = imagePreview ?? (removeImage ? null : editingCurrentImageUrl);

  return (
    <div className="flex flex-col gap-8">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div className="flex items-end gap-3">
          <h1 className="font-liter text-3xl text-title">Products</h1>
          {!isLoading && (
            <span className="font-liter text-textish text-sm mb-0.5">
              {products.length} total
            </span>
          )}
        </div>
      </div>

      {/* ── Form ── */}
      <form
        onSubmit={handleSubmit}
        className="border border-brownish p-6 flex flex-col gap-5 bg-[#F8F3EC]"
      >
        <h2 className="font-liter text-base text-title">
          {editingId ? "Edit product" : "Add new product"}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Product title"
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className={`${input} col-span-2`}
          />
          <input
            placeholder="Price (€)"
            type="number"
            min="0"
            step="0.01"
            required
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className={input}
          />
          <input
            placeholder="Stock quantity"
            type="number"
            min="0"
            required
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            className={input}
          />
        </div>

        {/* Image upload */}
        <div className="flex flex-col gap-2">
          <p className="font-liter text-xs text-textish">
            {editingId ? "Image — pick a new file to replace" : "Product image (required, max 5 MB)"}
          </p>

          <div className="flex items-start gap-5">
            {/* Preview */}
            <div className="w-20 h-20 border border-brownish shrink-0 overflow-hidden bg-brownish/20 flex items-center justify-center">
              {displayImage ? (
                <img src={displayImage} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <ImagePlus className="w-6 h-6 text-lightish" />
              )}
            </div>

            <div className="flex flex-col gap-2 flex-1 justify-center">
              <label className="cursor-pointer border border-brownish px-4 py-2 text-xs font-liter text-title hover:bg-brownish/30 transition-colors w-fit">
                Choose file
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
              {imageFile && (
                <p className="text-xs font-liter text-textish truncate max-w-[200px]">
                  {imageFile.name}
                </p>
              )}
              {uploadError && (
                <p className="text-xs font-liter text-pinkish">{uploadError}</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="border border-brownish p-1.5">
            <button
              type="submit"
              disabled={isSubmitting}
              className="font-liter text-sm text-title bg-brownish py-2 px-6 hover:bg-brownish/70 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? "Saving..." : editingId ? "Save changes" : "Add product"}
            </button>
          </div>
          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="font-liter text-sm text-textish border border-brownish/50 py-2 px-5 hover:bg-brownish/20 transition-colors cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ── Table ── */}
      <div className="border border-brownish overflow-hidden">
        {isLoading ? (
          <p className="font-liter text-textish text-sm p-6">Loading...</p>
        ) : products.length === 0 ? (
          <p className="font-liter text-textish text-sm p-6">No products yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-brownish/20 border-b border-brownish">
              <tr>
                <th className="text-left px-4 py-3 font-liter text-textish font-normal w-16">Image</th>
                <th className="text-left px-4 py-3 font-liter text-textish font-normal">Title</th>
                <th className="text-left px-4 py-3 font-liter text-textish font-normal">Price</th>
                <th className="text-left px-4 py-3 font-liter text-textish font-normal">Stock</th>
                <th className="px-4 py-3 w-24" />
              </tr>
            </thead>
            <tbody className="divide-y divide-brownish/40">
              {products.map((p) => (
                <tr
                  key={p.id}
                  className={`transition-colors ${
                    editingId === p.id
                      ? "bg-brownish/20"
                      : "hover:bg-brownish/10"
                  }`}
                >
                  <td className="px-4 py-3">
                    <div className="w-10 h-10 overflow-hidden bg-brownish/30 shrink-0">
                      {p.image_url ? (
                        <img src={p.image_url} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lightish text-lg">🌸</div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-liter text-title">{p.title}</td>
                  <td className="px-4 py-3 font-liter text-textish">{p.price} €</td>
                  <td className="px-4 py-3">
                    <span className={`font-liter text-xs px-2 py-0.5 ${
                      p.stock === 0
                        ? "bg-red-100 text-red-500"
                        : p.stock <= 3
                        ? "bg-amber-100 text-amber-600"
                        : "bg-brownish/40 text-title"
                    }`}>
                      {p.stock}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit(p)}
                        className="text-textish hover:text-title transition-colors cursor-pointer"
                        aria-label="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteMutation.mutate(p.id)}
                        disabled={deleteMutation.isPending}
                        className="text-lightish hover:text-pinkish transition-colors disabled:opacity-40 cursor-pointer"
                        aria-label="Delete"
                      >
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



