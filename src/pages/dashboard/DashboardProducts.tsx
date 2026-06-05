import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  adminCreateProduct,
  adminDeleteProduct,
  adminFetchProducts,
  adminUpdateProduct,
} from "../../supabase/adminService";
import type { Product } from "../../@types";

const empty = { title: "", price: "", stock: "", image_url: "" };

const DashboardProducts = () => {
  const queryClient = useQueryClient();
  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["admin-products"] });

  const { data: products = [], isLoading } = useQuery({
    queryKey: ["admin-products"],
    queryFn: adminFetchProducts,
  });

  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<number | null>(null);

  const createMutation = useMutation({
    mutationFn: () =>
      adminCreateProduct({
        title: form.title,
        price: Number(form.price),
        stock: Number(form.stock),
        image_url: form.image_url || null,
      }),
    onSuccess: () => { invalidate(); setForm(empty); },
  });

  const updateMutation = useMutation({
    mutationFn: () =>
      adminUpdateProduct(editingId!, {
        title: form.title,
        price: Number(form.price),
        stock: Number(form.stock),
        image_url: form.image_url || null,
      }),
    onSuccess: () => { invalidate(); setForm(empty); setEditingId(null); },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminDeleteProduct(id),
    onSuccess: invalidate,
  });

  const startEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      title: p.title,
      price: String(p.price),
      stock: String(p.stock),
      image_url: p.image_url ?? "",
    });
  };

  const cancelEdit = () => { setEditingId(null); setForm(empty); };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.price || !form.stock) return;
    editingId ? updateMutation.mutate() : createMutation.mutate();
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-xl font-semibold">Products</h1>

      {/* Form */}
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
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm col-span-2"
          />
          <input
            placeholder="Price"
            type="number"
            min="0"
            step="0.01"
            value={form.price}
            onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Stock"
            type="number"
            min="0"
            value={form.stock}
            onChange={(e) => setForm((f) => ({ ...f, stock: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm"
          />
          <input
            placeholder="Image URL (optional)"
            value={form.image_url}
            onChange={(e) => setForm((f) => ({ ...f, image_url: e.target.value }))}
            className="border rounded-lg px-3 py-2 text-sm col-span-2"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-black text-white px-5 py-2 rounded-lg text-sm disabled:opacity-50 cursor-pointer"
          >
            {editingId ? "Save changes" : "Add product"}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="border px-5 py-2 rounded-lg text-sm cursor-pointer"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl border overflow-hidden">
        {isLoading ? (
          <p className="text-gray-400 text-sm p-6">Loading...</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium">Title</th>
                <th className="text-left px-4 py-3 font-medium">Price</th>
                <th className="text-left px-4 py-3 font-medium">Stock</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{p.title}</td>
                  <td className="px-4 py-3">${p.price}</td>
                  <td className="px-4 py-3">{p.stock}</td>
                  <td className="px-4 py-3 flex justify-end gap-2">
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
